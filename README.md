# PeerPrep Attempt History Service

Keeps tracks of the user's attempts.

- [PeerPrep Attempt History Service](#peerprep-attempt-history-service)
  - [Quickstart Guide](#quickstart-guide)
  - [Build Script](#build-script)
  - [Architecture](#architecture)
  - [Docker Images](#docker-images)
    - [API](#api)
    - [Database Initialiser](#database-initialiser)
    - [Message Queue Consumer](#message-queue-consumer)
  - [REST API](#rest-api)
    - [Get user attempt history](#get-user-attempt-history)
    - [Get user attempt code](#get-user-attempt-code)
    - [Add to attempt history](#add-to-attempt-history)
    - [Rank all users by attempt count](#rank-all-users-by-attempt-count)

## Quickstart Guide

Note that Attempt History Service relies on User Service and Editor Service. Please ensure that these services are up and running before attempting to start Attempt History Service.

1. Clone this repository.
2. Build the docker images by running: `./build_images.sh`
3. Modify the ".env" file as per needed. Refer to [Docker Images](#docker-images) for the list of environment variables.
4. Create the docker containers by running: `docker compose up`

## Build Script

`build_images.sh` is a build script for building the Docker images and optionally pushing them to the container registry. To get more information about the script, run:

```
./build_images.sh -h
```

## Architecture

![](./images/architecture.png)

Legend:

- Start of arrow indicates request origin and end of arrow indicates request destination.
- `#505050` Dark grey items represents internal servers/containers.
- `#DA4026` Red items represents internal servers/containers that are temporary.
- `#7FBA42` Green items represents internal servers/containers that are exposed.
- `#2072B8` Blue items represents external servers/containers.


## Docker Images

### API

**Name:** ghcr.io/cs3219-ay2324s1-g04/peerprep_attempt_history_service_api

**Description:** Runs the REST API.

**Environment Variables:**

- `NODE_ENV` - Mode the app is running on ("development" or "production").
- `AHS_EXPRESS_PORT` - Port to listen on.
- `AHS_DB_HOST` - Address of the Database.
- `AHS_DB_PORT` - Port of the Database.
- `AHS_DB_USER` - Username of the user in the Database.
- `AHS_DB_PASS` - Password of the user in the Database.
- `AHS_DB` - Name of the database.
- `DATABASE_SHOULD_USE_TLS` - Should database connection be secured with TLS. Set to "true" to enable.
- `DATABASE_CONNECTION_TIMEOUT_MILLIS` - Number of milliseconds for a database client to connect to the database before timing out.
- `DATABASE_MAX_CLIENT_COUNT` - Max number of database clients.
- `SERVICE_USER_HOST` - Address of the User Service host.
- `SERVICE_USER_PORT` - Port the User Service is listening on.

### Database Initialiser

**Name:** ghcr.io/cs3219-ay2324s1-g04/peerprep_attempt_history_service_database_initialiser

**Description:** Initialises the database by creating and setting up the necessary tables.

**Environment Variables:**

- `AHS_DB_HOST` - Address of the Database.
- `AHS_DB_PORT` - Port of the Database.
- `AHS_DB_USER` - Username of the user in the Database.
- `AHS_DB_PASS` - Password of the user in the Database.
- `AHS_DB` - Name of the database.
- `DATABASE_SHOULD_USE_TLS` - Should database connection be secured with TLS. Set to "true" to enable.
- `DATABASE_CONNECTION_TIMEOUT_MILLIS` - Number of milliseconds for a database client to connect to the database before timing out.
- `DATABASE_MAX_CLIENT_COUNT` - Max number of database clients.
- `SHOULD_FORCE_INITIALISATION` - Should database initialisation be done regardless of whether one or more entities to be created already exist. Set to "true" to enable (may cause data loss).

### Message Queue Consumer

**Name:** ghcr.io/cs3219-ay2324s1-g04/peerprep_attempt_history_service_mq_consumer

**Description:** Listens to the message queue provided by room-service.

**Environment Variables:**

- `AHS_HOST` - Address of Attempt History API.
- `AHS_PORT` - Port of Attempt History API.
- `SERVICE_ROOM_MQ_USER` - User on the MQ host.
- `SERVICE_ROOM_MQ_PASS` - Password of the MQ.
- `SERVICE_ROOM_MQ_HOST` - Address of the MQ host.
- `SERVICE_ROOM_MQ_PORT` - Port the MQ is listening on.
- `SERVICE_ROOM_MQ_VHOST` - Vhost of the MQ.
- `SERVICE_ROOM_MQ_TLS` - Should MQ connection be secured with TLS. Set to "true" to enable.
- `SERVICE_ROOM_MQ_XCHANGE` - Name of the MQ exchange.
- `SERVICE_ROOM_MQ_QNAME` - Name of the MQ queue.
- `SERVICE_USER_HOST` - Address of the User Service host.
- `SERVICE_USER_PORT` - Port the User Service.
- `SERVICE_EDITOR_HOST` - Address of the Editor Service.
- `SERVICE_EDITOR_PORT` - Port the Editor Service.

## REST API

### Get user attempt history

> [GET] `/attempt-history-service/`

**Cookies**

- `access-token` - Access token.

**Returns**

- `200` - { message: "Success",  data : [{"attemptId":string,"questionId":string,"language":string,"date":date}] }
- `401` - { message: "Not authorized" }
- `500` - { message: "Sever Error" }

### Get user attempt code

> [GET] `/attempt-history-service/:aid`

**Description**
This returns a particular user's attempt, in particular their code.

Note that the code return is in raw form, so there could be code injection present.

**Params**
- `aid` - The attempt id.

**Cookies**

- `access-token` - Access token.

**Returns**

- `200` - { message: "Success",  data : user's code }
- `401` - { message: "Not authorized" }
- `500` - { message: "Sever Error" }

### Add to attempt history

> [POST] `/attempt-history-service/add`

**Description**
For internal use only.

Note that (user id, room id) is considered primary keys. That is to say, their combination is what makes an entry unique.

**Parameters**

- `user` - The user id
- `question` - The question id
- `room` - The room id
- `language` - The language id

**Body**
- Json with the key being 'code' and the value being the user's code.

**Returns**

- `200` - { message: "Success" }.
- `500` - { message: "Sever Error" }

**Examples**

> `attempt-history-service/add?user=4&question=4&room=fb137075-1ce0-4303-9e47-5182dac23a41&language=cpp`

> body `{ code : 'lorem ipsum' }`

This will create an entry for the user.

### Rank all users by attempt count

> [GET] `/attempt-history-service/all`

**Description**
Rank all users by attempt count and sort them by user id and count.

**Returns**

- `200` - { message: "Received message", {"data": [
        {"user-id": number, "attempt_count": string}]}}.
- `500` - { message: "Server Error" }
