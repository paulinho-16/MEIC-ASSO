FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY src/ src/

COPY tsconfig.json ./

CMD [ "npm", "run", "dev" ]