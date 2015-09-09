FROM node:4.0

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
RUN npm install
RUN npm install -g grunt-cli

COPY . /app
