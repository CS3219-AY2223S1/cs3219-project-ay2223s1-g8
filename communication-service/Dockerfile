FROM node:16.14.2
ENV NODE_ENV=prod

WORKDIR /communication-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8005

CMD ["node", "index.js"]