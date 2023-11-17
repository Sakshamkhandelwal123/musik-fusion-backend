# Musik Fusion Apis

## Graphql Apis

### Query

| Name              |        Auth        | GraphQL Input |
| :---------------- | :----------------: | :------------ |
| me                | :white_check_mark: |               |
| getUserByUsername |        :x:         | username      |
| getUserFollowers  |        :x:         | username      |
| getUserFollowing  |        :x:         | username      |
| getUserFriends    | :white_check_mark: | username      |
| getFriendRequests | :white_check_mark: |               |

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

## Rest Apis

| Name                                      | Type |        Auth        | Body Input     | Query Params |
| :---------------------------------------- | :--: | :----------------: | :------------- | :----------- |
| /spotify/get-spotify-authentication-token | GET  |        :x:         |                |              |
| /image/upload                             | POST | :white_check_mark: | username, type | image        |
