FROM node:22 as build-stage

WORKDIR /app

COPY package*.json ./

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npm install

COPY . .
RUN npm run build --prod

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist/portal-tesista /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]