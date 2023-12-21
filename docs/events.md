# Events

| Event Type               | Performer Id | Performer Type | Entity Id         | Entity Type | Reference Id | Reference Type |  Timestamp   |              Metadata               |
| :----------------------- | :----------: | :------------: | :---------------- | :---------: | :----------: | :------------: | :----------: | :---------------------------------: |
| USER_SIGN_IN             |   User Id    |      User      | User Id           |    User     |     null     |      null      | Current Time |               {User}                |
| USER_SIGN_UP             |   User Id    |      User      | User Id           |    User     |     null     |      null      |  Created At  |               {User}                |
| USER_PROFILE_UPDATED     |   User Id    |      User      | User Id           |    User     |     null     |      null      |  Updated At  |           {Updated User}            |
| USER_DELETED             |   User Id    |      User      | User Id           |    User     |     null     |      null      | Current Time |               {User}                |
| USER_FOLLOWED            |   User Id    |      User      | Following User Id |    User     |     null     |      null      |  Created At  |         {User, Follow User}         |
| USER_UNFOLLOWED          |   User Id    |      User      | Following User Id |    User     |     null     |      null      | Current Time |        {User, UnFollow User}        |
| FRIEND_REQUEST_SENT      |   User Id    |      User      | Following User Id |    User     |     null     |      null      |  Created At  | {User, Friend User, Friend Request} |
| FRIEND_REMOVED           |   User Id    |      User      | Following User Id |    User     |     null     |      null      |  Updated At  |         {User, Friend User}         |
| FRIEND_REQUEST_WITHDRAWN |   User Id    |      User      | Friend User Id    |    User     |     null     |      null      | Current Time | {User, Friend User, Friend Request} |
| FRIEND_REQUEST_ACCEPTED  |   User Id    |      User      | Friend User Id    |    User     |     null     |      null      |  Updated At  |         {User, Friend User}         |
| FRIEND_REQUEST_REJECTED  |   User Id    |      User      | Friend User Id    |    User     |     null     |      null      |  Updated At  |         {User, Friend User}         |
| CHANNEL_CREATED          |   User Id    |      User      | Channel Id        |   Channel   |     null     |      null      |  Created At  |              {Channel}              |
| CHANNEL_JOINED           |   User Id    |      User      | Channel Id        |   Channel   |     null     |      null      |  Created At  |      {Channel, Channel Member}      |
| CHANNEL_LEFT             |   User Id    |      User      | Channel Id        |   Channel   |     null     |      null      | Current Time |      {Channel, Channel Member}      |
