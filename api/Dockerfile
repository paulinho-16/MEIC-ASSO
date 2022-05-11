FROM node:16

WORKDIR /usr/src/app/api/

COPY package.json /usr/src/app/api/

COPY yarn.lock /usr/src/app/api/

RUN yarn install && npm install typescript -g

COPY ./src/ /usr/src/app/api/src/

COPY ./migrations/ /usr/src/app/api/migrations/

COPY tsconfig.json /usr/src/app/api/

COPY .env /usr/src/app/api/

RUN tsc

CMD [ "sh", "-c", "yarn migrate up && yarn start" ]

