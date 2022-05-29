FROM node:14-alpine3.14

ENV NODE_ENV=development

RUN apk add --no-cache bash

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]