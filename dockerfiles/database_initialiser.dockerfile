FROM node:lts-hydrogen

COPY ./build /attempt_history_service_database_initialiser/
COPY package.json /attempt_history_service_database_initialiser/
COPY package-lock.json /attempt_history_service_database_initialiser/

WORKDIR /attempt_history_service_database_initialiser

RUN npm install --omit=dev -y

CMD node ./jobs/database_init/database-init.js
