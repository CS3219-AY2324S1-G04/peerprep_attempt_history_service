FROM node:lts-hydrogen

COPY ./build /attempt_service_database_init/
COPY package.json /attempt_service_database_init/
COPY package-lock.json /attempt_service_database_init/

WORKDIR /attempt_service_database_init

RUN npm install --omit=dev -y

CMD node ./jobs/database_init/database-init.js
