FROM node:16.14.2
ENV NODE_ENV=dev

WORKDIR /user-service

COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]