# Centrifugo Setup Guide

Download and Install centrifugo from this website :-  
[https://github.com/centrifugal/centrifugo/releases](https://github.com/centrifugal/centrifugo/releases)

Run centrifugo by following command :-

```
./centrifugo
```

To generate config file use the following command :-

```
./centrifugo genconfig
```

Add the following code to generated config.json(Replace values with your generated values) :-

```
{
  "token_hmac_secret_key": "token",
  "admin": true,
  "admin_password": "admin password",
  "admin_secret": "admin secret",
  "api_key": "api key",
  "allowed_origins": [],
  "allow_subscribe_for_client": true,
  "allow_publish_for_client": true,
  "allow_history_for_client": true,
  "allow_presence_for_client": true,
  "allow_history_for_subscriber": true,
  "allow_publish_for_subscriber": true,
  "allow_presence_for_subscriber": true,
  "presence": true,
  "history_size": "chats size",
  "history_ttl": "expiration time"
}
```

For more information visit :- [Centrifugal.dev](https://centrifugal.dev/docs/getting-started/introduction)
