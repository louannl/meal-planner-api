FROM node:18-alpine3.15

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install --production

CMD ["npm", "run", "start"]