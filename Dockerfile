FROM node:13.5-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=prod 
COPY out/main .

EXPOSE 3000

ENTRYPOINT ["node", "Main.js"]
