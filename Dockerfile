# build environment
FROM node as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json \
    package-lock.json \
    tsconfig.json \
    yarn.lock \
    ./

RUN npm install

COPY . ./
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

# production environment
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]