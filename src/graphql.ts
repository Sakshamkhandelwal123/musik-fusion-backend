
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username?: Nullable<string>;
    email: string;
    isEmailVerified: boolean;
    phoneNumber?: Nullable<string>;
    createdAt: Date;
    updatedAt: Date;
}

export interface SignInResponse {
    user: User;
    accessToken: string;
    expiresIn: number;
}

export interface IQuery {
    me(): User | Promise<User>;
    getUserByUsername(username: string): User | Promise<User>;
}

export interface IMutation {
    resetPassword(): string | Promise<string>;
    forgotPassword(email: string): string | Promise<string>;
    signUp(signUpInput: SignUpInput): string | Promise<string>;
    deleteUserAccount(username: string): string | Promise<string>;
    verifyEmail(email: string, otp: number): string | Promise<string>;
    resendVerificationEmail(email: string): string | Promise<string>;
    signIn(signInInput: SignInInput): SignInResponse | Promise<SignInResponse>;
    verifyNewPassword(email: string, otp: number, newPassword: string): string | Promise<string>;
}

type Nullable<T> = T | null;
