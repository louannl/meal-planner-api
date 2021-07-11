FROM node:14-alpine3.14

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install --production

CMD ["npm", "run", "start"]