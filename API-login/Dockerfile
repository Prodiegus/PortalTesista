FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copiar el certificado al contenedor
COPY certs/selfsigned.crt /etc/ssl/certs/selfsigned.crt

# Agregar el certificado al almacén de claves de Java
RUN keytool -import -alias mycert -keystore $JAVA_HOME/lib/security/cacerts -file /etc/ssl/certs/selfsigned.crt -storepass changeit -noprompt

COPY --from=build /app/target/ApiLogin-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]