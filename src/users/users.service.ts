import { Queue } from 'bullmq';
import { genSalt, hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JwtPayload, decode, sign } from 'jsonwebtoken';

import { applicationConfig } from 'config';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { queueNames } from 'src/utils/constants';
import { SignUpInput } from './dto/signup.input';
import { generateOtp } from 'src/utils/otp-generator';
import { setGlobalQueueValue } from 'src/utils/helpers';
import { UpdateUserInput } from './dto/update-user.input';
import { generateUsername } from 'src/utils/username-generator';
import { validatePasswordStrength } from 'src/utils/validation-checks';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectQueue(queueNames.DATA_CLEANUP_QUEUE)
    private readonly dataCleanupQueue: Queue,
  ) {}

  async createUser(signUpInput: SignUpInput, options = {}) {
    const { password } = signUpInput;

    validatePasswordStrength(password);

    const hashPassword = await hash(signUpInput.password, await genSalt());

    let username = `mf-${signUpInput.email}`;

    let i = 1;
    while (i <= 5) {
      const uniqueUsername = generateUsername();

      const user = await this.findOne({ username: uniqueUsername });

      if (!user) {
        username = uniqueUsername;
        break;
      }

      i++;
    }

    const emailOtp = generateOtp();

    const payload = {
      ...signUpInput,
      username,
      password: hashPassword,
      emailOtp,
    };

    return this.userModel.create(payload, options);
  }

  findOne(condition = {}, options = {}) {
    return this.userModel.findOne({
      where: condition,
      ...options,
    });
  }

  async update(payload: UpdateUserInput, condition = {}, options = {}) {
    return this.userModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }

  async remove(condition = {}) {
    await setGlobalQueueValue(this.dataCleanupQueue);

    return this.userModel.destroy({
      where: condition,
      individualHooks: true,
    });
  }

  generateToken({ id, email }: { id: string; email: string }) {
    const token = sign(
      {
        id,
        email,
      },
      applicationConfig.jwt.secret,
      {
        expiresIn: applicationConfig.jwt.expiresIn,
        algorithm: 'HS256',
        issuer: applicationConfig.jwt.issuer,
      },
    );

    const decodedToken = decode(token) as JwtPayload;

    return {
      token,
      expiresIn: decodedToken.exp - decodedToken.iat,
    };
  }
}
