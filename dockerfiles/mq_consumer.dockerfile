FROM node:lts-hydrogen

COPY ./build /attempt_service_database_mq_consumer/
COPY package.json /attempt_service_database_mq_consumer/
COPY package-lock.json /attempt_service_database_mq_consumer/

WORKDIR /attempt_service_database_mq_consumer

RUN npm install --omit=dev -y

CMD node ./jobs/mq_consumer/main.js
