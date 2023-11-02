
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
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    username?: Nullable<string>;
    email: string;
    isEmailVerified: boolean;
    phoneNumber?: Nullable<string>;
    isPhoneNumberVerified?: Nullable<boolean>;
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
    signIn(signInInput: SignInInput): SignInResponse | Promise<SignInResponse>;
    signUp(signUpInput: SignUpInput): string | Promise<string>;
}

type Nullable<T> = T | null;
