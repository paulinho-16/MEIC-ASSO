FROM node:16-slim

WORKDIR /usr/src/app/chat/server/

COPY package.json /usr/src/app/chat/server/

RUN yarn install && npm install typescript -g

COPY ./src/ /usr/src/app/chat/server/src/

COPY tsconfig.json /usr/src/app/chat/server/

RUN tsc

CMD ["yarn", "start"]
