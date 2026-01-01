FROM node:22-alpine

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]