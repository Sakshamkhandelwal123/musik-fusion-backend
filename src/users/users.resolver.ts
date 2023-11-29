import { Request } from 'express';
import { compare, genSalt, hash } from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { SignInInput } from './dto/signin.input';
import { SignUpInput } from './dto/signup.input';
import { Public } from 'src/auth/decorators/public';
import { recoveryOption } from 'src/utils/constants';
import { generateOtp } from 'src/utils/otp-generator';
import { UpdateUserInput } from './dto/update-user.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { ChannelsService } from 'src/chats/channels.service';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { WrongInputValueError } from 'src/utils/errors/common';
import { SendgridService } from 'src/common/sendgrid/sendgrid.service';
import { VerifyNewPasswordInput } from './dto/verify-new-password.input';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import {
  validatePasswordStrength,
  validatePhoneNumber,
} from 'src/utils/validation-checks';
import {
  getErrorCodeAndMessage,
  isNilOrEmpty,
  isPresent,
} from 'src/utils/helpers';
import {
  EmailAlreadyVerifiedError,
  EmailNotVerifiedError,
  InvalidOTPError,
  InvalidUserError,
  UserAlreadyExistError,
  UserDetailsCannotBeEmptyError,
  UsernameAlreadyExistsError,
  WrongPasswordError,
} from 'src/utils/errors/user';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly sendgridService: SendgridService,
    private readonly channelsService: ChannelsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Mutation('signUp')
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<string> {
    try {
      const { email } = signUpInput;

      const user = await this.usersService.findOne({ email });

      if (user) {
        throw new UserAlreadyExistError();
      }

      const newUser = await this.usersService.createUser(signUpInput);

      await this.sendgridService.sendEmail(email, {
        otp: newUser.emailOtp,
        templateName: 'EMAIL_VERIFICATION',
      });

      return 'We have send a verification email. Please verify your email to continue.';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('signIn')
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context('req') req: Request,
  ): Promise<{ user: User; accessToken: string; expiresIn: number }> {
    try {
      const { email, password } = signInInput;

      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user && !user.isEmailVerified) {
        throw new EmailNotVerifiedError();
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new WrongPasswordError();
      }

      const jwtToken = this.usersService.generateToken({
        id: user.id,
        email: user.email,
      });

      req.res.cookie('mf_access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      const response = {
        user,
        accessToken: jwtToken.token,
        expiresIn: jwtToken.expiresIn,
      };

      return response;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('forgotPassword')
  async forgotPassword(@Args('email') email: string): Promise<string> {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      const emailOtp = generateOtp();

      await this.usersService.update({ emailOtp }, { id: user.id });

      await this.sendgridService.sendEmail(email, {
        otp: emailOtp,
        recoveryOption: recoveryOption.RECOVER,
        templateName: 'PASSWORD_VERIFICATION',
      });

      return 'We have send an OTP to your email. Please verify the OTP to continue.';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('verifyNewPassword')
  async verifyNewPassword(
    @Args('verifyNewPasswordInput')
    verifyNewPasswordInput: VerifyNewPasswordInput,
  ): Promise<string> {
    try {
      const user = await this.usersService.findOne({
        email: verifyNewPasswordInput.email,
      });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.emailOtp !== verifyNewPasswordInput.otp) {
        throw new InvalidOTPError();
      }

      validatePasswordStrength(verifyNewPasswordInput.newPassword);

      const hashPassword = await hash(
        verifyNewPasswordInput.newPassword,
        await genSalt(),
      );

      await this.usersService.update(
        { password: hashPassword, emailOtp: null },
        { id: user.id },
      );

      return 'Password changed successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('resetPassword')
  async resetPassword(@CurrentUser() currentUser: User): Promise<string> {
    try {
      const emailOtp = generateOtp();

      await this.usersService.update({ emailOtp }, { id: currentUser.id });

      await this.sendgridService.sendEmail(currentUser.email, {
        otp: emailOtp,
        recoveryOption: recoveryOption.RESET,
        templateName: 'PASSWORD_VERIFICATION',
      });

      return 'We have send an OTP to your email. Please verify the OTP to continue.';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('verifyEmail')
  async verifyEmail(
    @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput,
  ): Promise<string> {
    try {
      const user = await this.usersService.findOne({
        email: verifyEmailInput.email,
      });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.isEmailVerified) {
        throw new EmailAlreadyVerifiedError();
      }

      if (user.emailOtp !== verifyEmailInput.otp) {
        throw new InvalidOTPError();
      }

      await this.usersService.update(
        { emailOtp: null, isEmailVerified: true },
        { id: user.id },
      );

      const channel = await this.channelsService.findOne({
        createdBy: user.id,
      });

      if (!channel) {
        await this.channelsService.create({
          name: user.id,
          createdBy: user.id,
        });
      }

      return 'Email verification successful';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('resendVerificationEmail')
  async resendVerificationEmail(@Args('email') email: string): Promise<string> {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.isEmailVerified) {
        throw new EmailAlreadyVerifiedError();
      }

      const emailOtp = generateOtp();

      await this.usersService.update({ emailOtp }, { id: user.id });

      await this.sendgridService.sendEmail(email, {
        otp: emailOtp,
        templateName: 'EMAIL_VERIFICATION',
      });

      return 'We have send a verification email. Please verify your email to continue.';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('updateUserProfile')
  async updateUserProfile(
    @CurrentUser() currentUser: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    try {
      if (
        isNilOrEmpty(updateUserInput.firstName) &&
        isNilOrEmpty(updateUserInput.lastName) &&
        isNilOrEmpty(updateUserInput.username) &&
        isNilOrEmpty(updateUserInput.phoneNumber)
      ) {
        throw new UserDetailsCannotBeEmptyError();
      }

      const updateUserPayload: {
        firstName?: string;
        lastName?: string;
        username?: string;
        phoneNumber?: string;
      } = {};

      if (isPresent(updateUserInput.firstName)) {
        updateUserPayload.firstName = updateUserInput.firstName;
      }

      if (isPresent(updateUserInput.lastName)) {
        updateUserPayload.lastName = updateUserInput.lastName;
      }

      if (isPresent(updateUserInput.phoneNumber)) {
        const number = validatePhoneNumber(updateUserInput.phoneNumber);

        updateUserPayload.phoneNumber = number;
      }

      if (isPresent(updateUserInput.username)) {
        const user = await this.usersService.findOne({
          username: updateUserInput.username,
        });

        if (user && currentUser.id !== user.id) {
          throw new UsernameAlreadyExistsError();
        }

        updateUserPayload.username = updateUserInput.username;
      }

      await this.usersService.update(updateUserPayload, { id: currentUser.id });

      return 'User profile updated successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('deleteUserAccount')
  async deleteUserAccount(
    @CurrentUser() currentUser: User,
    @Args('username') username: string,
  ): Promise<string> {
    try {
      const user = await this.usersService.findOne({ id: currentUser.id });

      if (user.username !== username) {
        throw new WrongInputValueError();
      }

      await this.usersService.remove({ id: currentUser.id });

      if (isPresent(user.profileImage)) {
        await this.cloudinaryService.deleteImage(user.profileImage);
      }

      return 'Account deleted successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('me')
  async me(@CurrentUser() currentUser: User): Promise<User> {
    try {
      const user = await this.usersService.findOne({ id: currentUser.id });

      if (!user) {
        throw new InvalidUserError();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Query('getUserByUsername')
  async getUserByUsername(@Args('username') username: string): Promise<User> {
    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new InvalidUserError();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @ResolveField()
  async profileImage(@Parent() parent: User): Promise<string> {
    try {
      if (isPresent(parent.profileImage)) {
        return this.cloudinaryService.getImageUrl(parent.profileImage);
      }

      return null;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
