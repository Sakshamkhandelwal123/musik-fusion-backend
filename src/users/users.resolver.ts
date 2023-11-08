import { compare, genSalt, hash } from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { SignInInput } from './dto/signin.input';
import { SignUpInput } from './dto/signup.input';
import { Public } from 'src/auth/decorators/public';
import { generateOtp } from 'src/utils/otp-generator';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { WrongInputValueError } from 'src/utils/errors/common';
import { validatePasswordStrength } from 'src/utils/validation-checks';
import { SendgridService } from 'src/common/sendgrid/sendgrid.service';
import {
  EmailNotVerifiedError,
  InvalidOTPError,
  InvalidUserError,
  UserAlreadyExistError,
  WrongPasswordError,
} from 'src/utils/errors/user';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly sendgridService: SendgridService,
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
  async forgotPassword(email: string) {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      const emailOtp = generateOtp();

      await this.usersService.update({ emailOtp }, { id: user.id });

      await this.sendgridService.sendEmail(email, {
        otp: emailOtp,
        recoveryOption: 'Recover',
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
  async verifyNewPassword(email: string, otp: number, newPassword: string) {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.emailOtp !== otp) {
        throw new InvalidOTPError();
      }

      validatePasswordStrength(newPassword);

      const hashPassword = await hash(newPassword, await genSalt());

      await this.usersService.update(
        { password: hashPassword },
        { id: user.id },
      );

      return 'Password Changed!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation('resetPassword')
  async resetPassword(@CurrentUser() currentUser: User) {
    try {
      const emailOtp = generateOtp();

      await this.usersService.update({ emailOtp }, { id: currentUser.id });

      await this.sendgridService.sendEmail(currentUser.email, {
        otp: emailOtp,
        recoveryOption: 'Reset',
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
  async verifyEmail(email: string, otp: number) {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      if (user.emailOtp !== otp) {
        throw new InvalidOTPError();
      }

      await this.usersService.update({ emailOtp: null }, { id: user.id });

      return 'Email Verification Successful!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Mutation('resendVerificationEmail')
  async resendVerificationEmail(email: string) {
    try {
      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
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

  @Mutation('deleteUserAccount')
  async deleteUserAccount(@CurrentUser() currentUser: User, username: string) {
    try {
      if (currentUser.username !== username) {
        throw new WrongInputValueError();
      }

      await this.usersService.remove({ id: currentUser.id });

      return 'Account deleted successfully!!!';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Query('me')
  async me(@CurrentUser() currentUser: User) {
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
  async getUserByUsername(@Args('username') username: string) {
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
}
