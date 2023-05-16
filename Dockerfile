FROM node:20
LABEL authors="jaredmscott"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm install

# CMD ["npm", "run", "start"]
