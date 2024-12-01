FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Copiar los certificados al contenedor
COPY certs/selfsigned.crt /etc/ssl/certs/selfsigned.crt
COPY certs/selfsigned.key /etc/ssl/certs/selfsigned.key

EXPOSE 3000

CMD ["node", "server.js"]