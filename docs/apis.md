# Musik Fusion Apis

## Graphql Apis

### Query

| Name              |        Auth        | Body / GraphQL Input |
| :---------------- | :----------------: | :------------------- |
| me                | :white_check_mark: |                      |
| getUserByUsername |        :x:         |                      |

### Mutation

| Name                    |        Auth        | Body / GraphQL Input |
| :---------------------- | :----------------: | :------------------- |
| signin                  |        :x:         |                      |
| signup                  |        :x:         |                      |
| resetPassword           |        :x:         |                      |
| verifyPhoneNumber       |        :x:         |                      |
| verifyEmail             |        :x:         |                      |
| resendOtp               |        :x:         |                      |
| resendVerificationEmail |        :x:         |                      |
| updateProfile           | :white_check_mark: |                      |
| deleteAccount           | :white_check_mark: |                      |
| getUserFollowers        |        :x:         |                      |
| getUserFollowing        |        :x:         |                      |

## Rest Apis

| Name                                      | Type |        Auth        | Body Input | Query Params |
| :---------------------------------------- | :--: | :----------------: | :--------- | :----------- |
| /spotify/get-spotify-authentication-token | GET  |        :x:         |            |              |
| /image/upload                             | POST | :white_check_mark: |            |              |
