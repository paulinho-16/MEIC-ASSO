FROM node:16

WORKDIR /usr/src/app/api/

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY src/ src/

COPY tsconfig.json ./

CMD [ "yarn", "dev"]