FROM node:16.14.2 as build
ENV NODE_ENV=prod

WORKDIR /frontend

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx
WORKDIR /frontend
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build frontend/build /usr/share/nginx/html
EXPOSE 3000
