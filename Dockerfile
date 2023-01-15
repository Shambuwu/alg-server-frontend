FROM node:latest
ENV NODE_ENV=development

WORKDIR /var/app

COPY ./package.json ./package-lock.json ./

RUN npm install
