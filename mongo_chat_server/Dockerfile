FROM node:16-slim

WORKDIR /usr/src/app/mongo_chat_server/

COPY package.json /usr/src/app/mongo_chat_server/

RUN yarn install && npm install typescript -g

COPY ./src/ /usr/src/app/mongo_chat_server/src/

COPY tsconfig.json /usr/src/app/mongo_chat_server/

RUN tsc

CMD ["yarn", "start"]
