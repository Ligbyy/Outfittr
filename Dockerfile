FROM node:8.12-jessie
WORKDIR /usr/src/app
COPY ./frontend .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
