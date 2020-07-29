FROM node:12.18.2-alpine3.9

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 3000
EXPOSE 9229

ENTRYPOINT ["npm", "start"]
