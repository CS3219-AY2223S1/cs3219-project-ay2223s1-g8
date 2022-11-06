FROM node:16.14.2
ENV NODE_ENV=prod

WORKDIR /collab-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8006

CMD ["node", "server.js"]