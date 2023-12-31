# Musik Fusion Apis

## Graphql Apis

### Query

| Name                       |        Auth        | GraphQL Input         |
| :------------------------- | :----------------: | :-------------------- |
| me                         | :white_check_mark: |                       |
| getUserByUsername          |        :x:         | username              |
| getUserFollowers           |        :x:         | username              |
| getUserFollowing           |        :x:         | username              |
| getUserFriends             | :white_check_mark: | username              |
| getFriendRequests          | :white_check_mark: |                       |
| getAllChats                | :white_check_mark: | channelName           |
| getMySubscribedChannels    | :white_check_mark: |                       |
| getAllChatsByChannel       | :white_check_mark: | channelId, filter     |
| getNotificationData        | :white_check_mark: | userId, limit, offset |
| getUnreadNotificationCount | :white_check_mark: | userId                |
| getNotificationMetadata    | :white_check_mark: | notificationId        |
| notificationAudiences      | :white_check_mark: |                       |
| notificationAudience       | :white_check_mark: | id                    |

### Mutation

| Name                    |        Auth        | GraphQL Input                              |
| :---------------------- | :----------------: | :----------------------------------------- |
| signIn                  |        :x:         | email, password                            |
| signUp                  |        :x:         | firstName, lastName, email, password       |
| forgotPassword          |        :x:         | email                                      |
| verifyNewPassword       |        :x:         | email, otp, newPassword                    |
| resetPassword           | :white_check_mark: | email                                      |
| verifyEmail             |        :x:         | email, otp                                 |
| resendVerificationEmail |        :x:         | email                                      |
| updateUserProfile       | :white_check_mark: | username, firstName, lastName, phoneNumber |
| deleteUserAccount       | :white_check_mark: | username                                   |
| followUser              | :white_check_mark: | followingUserId                            |
| unFollowUser            | :white_check_mark: | followingUserId                            |
| friendUnfriendAUser     | :white_check_mark: | followingUserId, isFriend                  |
| handleFriendRequest     | :white_check_mark: | friendUserId, status                       |
| withdrawFriendRequest   | :white_check_mark: | friendUserId                               |
| sendMessage             | :white_check_mark: | channelId, message                         |
| joinChannel             | :white_check_mark: | friendUserId                               |
| leaveChannel            | :white_check_mark: | channelId                                  |
| deleteChat              | :white_check_mark: | chatId                                     |
| deleteBulkChats         | :white_check_mark: | chatIds                                    |
| deleteAllChats          | :white_check_mark: | channelId                                  |
| markNotificationRead    | :white_check_mark: | userId                                     |

## Rest Apis

| Name                                      | Type |        Auth        | Body Input | Query Params |
| :---------------------------------------- | :--: | :----------------: | :--------- | :----------- |
| /                                         | GET  |        :x:         |            |              |
| /redirect/callback                        | GET  |        :x:         |            | code, state  |
| /spotify/get-spotify-authentication-token | GET  |        :x:         |            |              |
| /user/upload-image                        | POST | :white_check_mark: |            | image        |
| /spotify/login                            | GET  |        :x:         |            |              |
| /spotify/refresh-token                    | GET  |        :x:         |            |              |
