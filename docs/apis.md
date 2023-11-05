# Musik Fusion Apis

## Graphql Apis

### Query

| Name              |        Auth        | GraphQL Input |
| :---------------- | :----------------: | :------------ |
| me                | :white_check_mark: |               |
| getUserByUsername |        :x:         | username      |
| getUserFollowers  |        :x:         | username      |
| getUserFollowing  |        :x:         | username      |

### Mutation

| Name                    |        Auth        | GraphQL Input                              |
| :---------------------- | :----------------: | :----------------------------------------- |
| signIn                  |        :x:         | email, password                            |
| signUp                  |        :x:         | firstName, lastName, email, password       |
| resetPassword           |        :x:         | newPassword                                |
| changePassword          | :white_check_mark: | newPassword                                |
| verifyPhoneNumber       |        :x:         | phoneNumber, otp                           |
| verifyEmail             |        :x:         | email, otp                                 |
| resendOtp               |        :x:         | phoneNumber                                |
| resendVerificationEmail |        :x:         | email                                      |
| updateUserProfile       | :white_check_mark: | username, firstName, lastName, phoneNumber |
| deleteUserAccount       | :white_check_mark: | username                                   |
| followUser              | :white_check_mark: | username                                   |
| unfollowUser            | :white_check_mark: | username                                   |

## Rest Apis

| Name                                      | Type |        Auth        | Body Input     | Query Params |
| :---------------------------------------- | :--: | :----------------: | :------------- | :----------- |
| /spotify/get-spotify-authentication-token | GET  |        :x:         |                |              |
| /image/upload                             | POST | :white_check_mark: | username, type | image        |
