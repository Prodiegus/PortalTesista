FROM phpmyadmin/phpmyadmin

ARG PMA_HOST
ARG PMA_USER
ARG PMA_PASSWORD

ENV PMA_HOST=${PMA_HOST}
ENV PMA_USER=${PMA_USER}
ENV PMA_PASSWORD=${PMA_PASSWORD}

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80