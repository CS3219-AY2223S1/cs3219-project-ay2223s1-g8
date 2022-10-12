FROM node:16.14.2
ENV NODE_ENV=prod

WORKDIR /question-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8002

CMD ["node", "index.js"]