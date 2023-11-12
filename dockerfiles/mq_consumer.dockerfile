FROM node:lts-hydrogen

COPY ./build /attempt_history_service_database_mq_consumer/
COPY package.json /attempt_history_service_database_mq_consumer/
COPY package-lock.json /attempt_history_service_database_mq_consumer/

WORKDIR /attempt_history_service_database_mq_consumer

RUN npm install --omit=dev -y

CMD node ./jobs/mq_consumer/main.js
