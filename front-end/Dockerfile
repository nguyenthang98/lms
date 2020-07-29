FROM nginx:stable-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN apk add --update npm nodejs && \
    npm install

COPY . /app

RUN npm run build && \
    cp -r /app/dist/* /usr/share/nginx/html

EXPOSE 80
