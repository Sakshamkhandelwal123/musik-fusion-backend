# MusikFusion

Made by combining music and fusion, Musikfusion is a web application that gives you an extraordinary experience while listening a music.

## Features(in development)

1. SignIn
2. SignUp
3. Dashboard
4. Songs --> Play, Pause, Add to Queue, Forward, Backward, Add to Favorite
5. Playlist
6. Search --> Search any Song
7. Notifications
8. Friends
9. Trending Songs
10. Chat System --> Chat with Friends while listening to music
11. Community(Post)

## Technology Used

1. NodeJS
2. TypeScript
3. Express
4. NestJS
5. GraphQL
6. PostgreSQL
7. Sequelize
8. Sendgrid
9. Cloudinary
10. BullMq

## Installation

To install the dependencies for this project, run the following command:

```bash
$ npm install
```

## Running the application

To start the application run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environment Variables

This application uses environment variables to configure various settings. These variables are stored in an `.env` file located in the root of the project.

Here's a brief description of each environment variable:

### Environment

```
APP_ENV= # The environment in which the application is running (e.g. development, main)
```

### Database

```
DB_DIALECT= # The dialect of the database server
DB_HOST= # The hostname of the database server
DB_PORT= # The port number on which the database server is listening
DB_USERNAME= # The username of the database user
DB_PASSWORD= # The password of the database user
DB_NAME= # The name of the database
```

### Spotify

```
SPOTIFY_CLIENT_ID= # Spotify development client id
SPOTIFY_CLIENT_SECRET= # Spotify development client secret
```

### JWT

```
JWT_SECRET= # The private key used to sign JWTs
```

### Sendgrid

```
SENDGRID_SENDER_EMAIL= # Sender email associated with sendgrid account
SENDGRID_API_KEY= # Api key of sendgrid
```

### Cloudinary

```
CLOUD_NAME= # Cloudinary cloud name
CLOUDINARY_API_KEY= # Cloudinary api key
CLOUDINARY_API_SECRET_KEY= # Cloudinary secret key
```

### Centrifugo

```
TOKEN_HMAC_SECRET_KEY= # The private key used to sign centrifugo JWT token
```

### Redis

```
REDIS_HOST= # The hostname of redis server
REDIS_PORT= # The port number on which the redis server is listening
```

### Kafka

```
KAFKA_USERNAME= # The username for connecting to Kafka brokers
KAFKA_PASSWORD= # The password for connecting to Kafka brokers
KAFKA_BROKERS= # A comma-separated list of Kafka brokers to connect to
```

Make sure to replace the placeholder values with your own values before starting the application.
