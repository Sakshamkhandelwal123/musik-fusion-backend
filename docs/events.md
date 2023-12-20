# Events

| Event Type               | Performer Id | Performer Type | Entity Id        | Entity Type | Reference Id | Reference Type |  Timestamp   |        Metadata        |
| :----------------------- | :----------: | :------------: | :--------------- | :---------: | :----------: | :------------: | :----------: | :--------------------: |
| USER_SIGN_IN             |   User Id    |      User      | User Id          |    User     |     null     |      null      | Current Time |      User Details      |
| USER_SIGN_UP             |   User Id    |      User      | User Id          |    User     |     null     |      null      |  Created At  |      User Details      |
| USER_PROFILE_UPDATED     |   User Id    |      User      | User Id          |    User     |     null     |      null      |  Updated At  |  Updated User Details  |
| USER_DELETED             |   User Id    |      User      | User Id          |    User     |     null     |      null      | Current Time |      User Details      |
| USER_FOLLOWED            |   User Id    |      User      | Followed User Id |    User     |     null     |      null      |  Created At  |     Friend Details     |
| USER_UNFOLLOWED          |   User Id    |      User      | Followed User Id |    User     |     null     |      null      | Current Time |     Friend Details     |
| FRIEND_REQUEST_SENT      |   User Id    |      User      | Friend Id        |    User     |     null     |      null      |  Created At  | Friend Request Details |
| FRIEND_REMOVED           |   User Id    |      User      | Friend Id        |    User     |     null     |      null      | Current Time | Friend Request Details |
| FRIEND_REQUEST_WITHDRAWN |   User Id    |      User      |                  |
| FRIEND_REQUEST_ACCEPTED  |   User Id    |      User      |                  |
| FRIEND_REQUEST_REJECTED  |   User Id    |      User      |                  |
| CHANNEL_CREATED          |   User Id    |      User      | Channel Id       |   Channel   |     null     |      null      |  Created At  |    Channel Details     |
| CHANNEL_JOINED           |   User Id    |      User      | Channel Id       |   Channel   |     null     |      null      |  Created At  | Channel Member Details |
| CHANNEL_LEFT             |   User Id    |      User      | Channel Id       |   Channel   |     null     |      null      | Current Time | Channel Member Details |
