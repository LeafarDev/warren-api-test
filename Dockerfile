FROM node:10-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . /app/src

# check files list
RUN ls -a

RUN npm install
RUN npm run build
# env
ENV NODE_ENV=production

EXPOSE 3333

CMD [ "node", "./dist/src/index.js" ]
