FROM node:13

ENV NODE_ENV=production
RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app

CMD node src
