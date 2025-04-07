FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/portal-tesista/browser /usr/share/nginx/html

# Copiar la configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar los certificados SSL
COPY certs/portaltesista_me.crt /etc/nginx/certs/portaltesista_me.crt
COPY certs/portaltesista_me.ca-bundle /etc/nginx/certs/portaltesista_me.ca-bundle
COPY certs/selfsigned.key /etc/nginx/certs/selfsigned.key

# Copiar la carpeta .well-known para validación
COPY .well-known /usr/share/nginx/html/.well-known

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]