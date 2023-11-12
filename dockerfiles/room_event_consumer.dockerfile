FROM node:lts-hydrogen

COPY ./build /attempt_history_service_database_room_event_consumer/
COPY package.json /attempt_history_service_database_room_event_consumer/
COPY package-lock.json /attempt_history_service_database_room_event_consumer/

WORKDIR /attempt_history_service_database_room_event_consumer

RUN npm install --omit=dev -y

CMD node ./jobs/room_event_consumer/main.js
