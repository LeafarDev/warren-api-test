FROM node:12-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /usr/src/app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .
# build
RUN npm install
RUN npm run build
# env
ENV NODE_ENV=production

# check files list
RUN ls -a

EXPOSE 3333

CMD [ "node", "./dist/src/index.js" ]
