# Musik Fusion Apis

## Graphql Apis

### Query

| Name              |        Auth        | Body / GraphQL Input |
| :---------------- | :----------------: | :------------------- |
| me                | :white_check_mark: |                      |
| getUserByUsername |        :x:         |                      |

### Mutation

| Name                    | Auth | Body / GraphQL Input |
| :---------------------- | :--: | :------------------- |
| signin                  | :x:  |                      |
| signup                  | :x:  |                      |
| resetPassword           | :x:  |                      |
| verifyPhoneNumber       | :x:  |                      |
| verifyEmail             | :x:  |                      |
| resendOtp               | :x:  |                      |
| resendVerificationEmail | :x:  |                      |

## Rest Apis

| Name                                      | Type | Auth | Body Input | Query Params |
| :---------------------------------------- | :--: | :--: | :--------- | :----------- |
| /spotify/get-spotify-authentication-token | GET  | :x:  |            |              |
