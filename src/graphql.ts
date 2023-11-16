
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum FriendRequestStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

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

export interface FriendRequest {
    id: string;
    userId: string;
    followingUserId: string;
    friendRequestStatus: FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface FriendRequestResponse {
    total: number;
    requests: FriendRequest[];
}

export interface UserFriendResponse {
    total: number;
    friends: Friend[];
}

export interface UserFollowingResponse {
    total: number;
    following: Friend[];
}

export interface UserFollowerResponse {
    total: number;
    followers: Friend[];
}

export interface IQuery {
    getFriendRequests(): FriendRequestResponse | Promise<FriendRequestResponse>;
    getUserFriends(username: string): UserFriendResponse | Promise<UserFriendResponse>;
    getUserFollowers(username: string): UserFollowerResponse | Promise<UserFollowerResponse>;
    getUserFollowing(username: string): UserFollowingResponse | Promise<UserFollowingResponse>;
    me(): User | Promise<User>;
    getUserByUsername(username: string): User | Promise<User>;
}

export interface IMutation {
    withdrawFriendRequest(friendUserId: string): string | Promise<string>;
    followUser(followUserInput: FollowUserInput): string | Promise<string>;
    unFollowUser(unFollowUserInput: UnFollowUserInput): string | Promise<string>;
    friendUnfriendAUser(friendUnfriendInput: FriendUnfriendInput): string | Promise<string>;
    handleFriendRequest(friendUserId: string, status: FriendRequestStatus): string | Promise<string>;
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
