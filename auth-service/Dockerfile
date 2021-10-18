FROM node:12-alpine

ENV NODE_EXTRA_CA_CERTS=/usr/src/app/cacert.pem
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN export NODE_TLS_REJECT_UNAUTHORIZED=0
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]