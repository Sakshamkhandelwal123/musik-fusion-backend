
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateChatInput {
    exampleField?: Nullable<number>;
}

export interface UpdateChatInput {
    id: number;
}

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

export interface VerifyEmailInput {
    email: string;
    otp: number;
}

export interface VerifyNewPasswordInput {
    email: string;
    otp: number;
    newPassword: string;
}

export interface Chat {
    exampleField?: Nullable<number>;
}

export interface IQuery {
    chats(): Nullable<Chat>[] | Promise<Nullable<Chat>[]>;
    chat(id: number): Nullable<Chat> | Promise<Nullable<Chat>>;
    me(): User | Promise<User>;
    getUserByUsername(username: string): User | Promise<User>;
}

export interface IMutation {
    createChat(createChatInput: CreateChatInput): Chat | Promise<Chat>;
    updateChat(updateChatInput: UpdateChatInput): Chat | Promise<Chat>;
    removeChat(id: number): Nullable<Chat> | Promise<Nullable<Chat>>;
    resetPassword(): string | Promise<string>;
    forgotPassword(email: string): string | Promise<string>;
    signUp(signUpInput: SignUpInput): string | Promise<string>;
    deleteUserAccount(username: string): string | Promise<string>;
    verifyEmail(verifyEmailInput: VerifyEmailInput): string | Promise<string>;
    resendVerificationEmail(email: string): string | Promise<string>;
    signIn(signInInput: SignInInput): SignInResponse | Promise<SignInResponse>;
    verifyNewPassword(verifyNewPasswordInput: VerifyNewPasswordInput): string | Promise<string>;
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

type Nullable<T> = T | null;
