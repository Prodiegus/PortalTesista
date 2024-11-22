FROM quay.io/keycloak/keycloak:24.0.0

WORKDIR /opt/keycloak

EXPOSE 8443

ENV KEYCLOAK_USER=admin
ENV KEYCLOAK_PASSWORD=admin
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin

COPY certs/selfsigned.jks /etc/ssl/certs/selfsigned.jks

ENTRYPOINT ["./bin/kc.sh", "start-dev", "--https-port=8443", "--https-key-store-file=/etc/ssl/certs/selfsigned.jks", "--https-key-store-password=1234"]