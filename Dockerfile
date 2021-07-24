FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 5000
CMD npm start