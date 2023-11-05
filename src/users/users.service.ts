import { genSalt, hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtPayload, decode, sign } from 'jsonwebtoken';

import { applicationConfig } from 'config';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SignUpInput } from './dto/signup.input';
import { generateOtp } from 'src/utils/otp-generator';
import { generateUsername } from 'src/utils/username-generator';
import { validatePasswordStrength } from 'src/utils/validation-checks';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
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
