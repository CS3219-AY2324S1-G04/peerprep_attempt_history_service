FROM node:lts-hydrogen

COPY ./build /attempt_service_database_rabbit/
COPY package.json /attempt_service_database_rabbit/
COPY package-lock.json /attempt_service_database_rabbit/

WORKDIR /attempt_service_database_rabbit

RUN npm install --omit=dev -y

CMD node ./jobs/rabbit/main.js
