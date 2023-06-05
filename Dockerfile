FROM node:16.18.0-alpine

WORKDIR /usr/src/app



RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
