FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/portal-tesista/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY certs/selfsigned.crt /etc/nginx/certs/selfsigned.crt
COPY certs/selfsigned.key /etc/nginx/certs/selfsigned.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]