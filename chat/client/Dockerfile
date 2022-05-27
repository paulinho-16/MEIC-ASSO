FROM node:16-slim

WORKDIR /usr/src/app/chat/client/

COPY package.json /usr/src/app/chat/client/

RUN yarn install

COPY ./ /usr/src/app/chat/client/

CMD ["yarn", "start"]
