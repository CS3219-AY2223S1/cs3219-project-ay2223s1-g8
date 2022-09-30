# -- BUILD --
FROM node:16.14.2 as build

WORKDIR /frontend

COPY package*.json ./
COPY ./ ./

RUN npm install
RUN npm run build

# -- RELEASE --
FROM nginx:stable-alpine as release

COPY --from=build /frontend/build /usr/share/nginx/html
COPY --from=build /frontend/.env.prod /usr/share/nginx/html/.env
COPY --from=build /frontend/nginx/nginx.conf /etc/nginx/nginx.conf

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g runtime-env-cra@0.2.2

WORKDIR /usr/share/nginx/html

EXPOSE 3000

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]