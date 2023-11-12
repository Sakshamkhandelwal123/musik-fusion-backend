
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface FriendUnfriendInput {
    followingUserId: string;
    isFriend: boolean;
}

export interface FollowUserInput {
    followingUserId: string;
}

export interface UnFollowUserInput {
    followingUserId: string;
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

export interface Friend {
    id: string;
    userId: string;
    followingUserId: string;
    isFriend: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuery {
    getUserFollowers(username: string): User[] | Promise<User[]>;
    getUserFollowing(username: string): User[] | Promise<User[]>;
    getUserFriends(username: string): User[] | Promise<User[]>;
    me(): User | Promise<User>;
    getUserByUsername(username: string): User | Promise<User>;
}

export interface IMutation {
    followUser(followUserInput: FollowUserInput): string | Promise<string>;
    unFollowUser(unFollowUserInput: UnFollowUserInput): string | Promise<string>;
    friendUnfriendAUser(friendUnfriendInput: FriendUnfriendInput): string | Promise<string>;
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
