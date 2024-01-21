FROM node:18.12-alpine


WORKDIR /node-sos

COPY package*.json ./
RUN npm install npm@8.5.1

COPY . .

CMD [ "npm", "run", "start" ]


