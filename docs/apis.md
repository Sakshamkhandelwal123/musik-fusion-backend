# Musik Fusion Apis

## Graphql Apis

### Query

| Name              |        Auth        | GraphQL Input |
| :---------------- | :----------------: | :------------ |
| me                | :white_check_mark: |               |
| getUserByUsername |        :x:         |               |
| getUserFollowers  |        :x:         |               |
| getUserFollowing  |        :x:         |               |

### Mutation

| Name                    |        Auth        | GraphQL Input |
| :---------------------- | :----------------: | :------------ |
| signin                  |        :x:         |               |
| signup                  |        :x:         |               |
| resetPassword           |        :x:         |               |
| changePassword          | :white_check_mark: |               |
| verifyPhoneNumber       |        :x:         |               |
| verifyEmail             |        :x:         |               |
| resendOtp               |        :x:         |               |
| resendVerificationEmail |        :x:         |               |
| updateUserProfile       | :white_check_mark: |               |
| deleteUserAccount       | :white_check_mark: |               |
| followUser              | :white_check_mark: |               |
| unfollowUser            | :white_check_mark: |               |

## Rest Apis

| Name                                      | Type |        Auth        | Body Input | Query Params |
| :---------------------------------------- | :--: | :----------------: | :--------- | :----------- |
| /spotify/get-spotify-authentication-token | GET  |        :x:         |            |              |
| /image/upload                             | POST | :white_check_mark: |            |              |
