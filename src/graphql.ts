
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

export interface CreateMessageInput {
    message: string;
    channelId: string;
}

export interface Filter {
    limit: number;
    offset: number;
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

export interface UpdateUserInput {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    username?: Nullable<string>;
    phoneNumber?: Nullable<string>;
}

export interface Chat {
    id: string;
    message: string;
    isWatched: boolean;
    channel: Channel;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface Channel {
    id: string;
    name: string;
    createdBy: User;
    lastMessageTimestamp?: Nullable<Date>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatPaginatedResponse {
    total: number;
    limit: number;
    offset: number;
    chats: Chat[];
}

export interface IQuery {
    getMySubscribedChannels(): Channel[] | Promise<Channel[]>;
    getAllChatsByChannel(channelId: string, filter?: Nullable<Filter>): ChatPaginatedResponse | Promise<ChatPaginatedResponse>;
    getFriendRequests(): FriendRequestResponse | Promise<FriendRequestResponse>;
    getUserFriends(username: string): UserFriendResponse | Promise<UserFriendResponse>;
    getUserFollowers(username: string): UserFollowerResponse | Promise<UserFollowerResponse>;
    getUserFollowing(username: string): UserFollowingResponse | Promise<UserFollowingResponse>;
    me(): User | Promise<User>;
    getUserByUsername(username: string): User | Promise<User>;
}

export interface IMutation {
    joinChannel(friendUserId: string): Channel | Promise<Channel>;
    sendMessage(createMessageInput: CreateMessageInput): Chat | Promise<Chat>;
    leaveChannel(channelId: string): string | Promise<string>;
    deleteChat(chatId: string): string | Promise<string>;
    deleteBulkChats(chatIds: string[]): string | Promise<string>;
    deleteAllChats(channelId: string): string | Promise<string>;
    withdrawFriendRequest(friendUserId: string): string | Promise<string>;
    followUser(followUserInput: FollowUserInput): string | Promise<string>;
    unFollowUser(unFollowUserInput: UnFollowUserInput): string | Promise<string>;
    friendUnfriendAUser(friendUnfriendInput: FriendUnfriendInput): string | Promise<string>;
    handleFriendRequest(friendUserId: string, status: FriendRequestStatus): string | Promise<string>;
    resetPassword(): string | Promise<string>;
    forgotPassword(email: string): string | Promise<string>;
    signUp(signUpInput: SignUpInput): string | Promise<string>;
    resendVerificationEmail(email: string): string | Promise<string>;
    signIn(signInInput: SignInInput): SignInResponse | Promise<SignInResponse>;
    verifyEmail(verifyEmailInput: VerifyEmailInput): string | Promise<string>;
    verifyNewPassword(verifyNewPasswordInput: VerifyNewPasswordInput): string | Promise<string>;
    updateUserProfile(updateUserInput: UpdateUserInput): string | Promise<string>;
    deleteUserAccount(username: string): string | Promise<string>;
}

export interface Friend {
    id: string;
    user: User;
    followingUser: User;
    isFriend: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface FriendRequest {
    id: string;
    user: User;
    followingUser: User;
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

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username?: Nullable<string>;
    profileImage?: Nullable<string>;
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
