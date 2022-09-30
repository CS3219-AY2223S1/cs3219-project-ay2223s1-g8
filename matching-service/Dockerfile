FROM node:16.14.2
ENV NODE_ENV=prod

WORKDIR /matching-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8001

CMD ["node", "index.js"]