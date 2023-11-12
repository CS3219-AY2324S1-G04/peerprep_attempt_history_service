FROM node:lts-hydrogen

COPY ./build /attempt_history_service_database_api/
COPY package.json /attempt_history_service_database_api/
COPY package-lock.json /attempt_history_service_database_api/

WORKDIR /attempt_history_service_database_api

RUN npm install --omit=dev -y

CMD node main.js
