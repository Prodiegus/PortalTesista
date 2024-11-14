FROM phpmyadmin/phpmyadmin

ENV PMA_HOST=mysql
ENV PMA_USER=root
ENV PMA_PASSWORD=rootpassword

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80