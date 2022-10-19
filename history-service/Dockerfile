FROM node:16.14.2
ENV NODE_ENV=prod

WORKDIR /history-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8004

CMD ["node", "server.js"]