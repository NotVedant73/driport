FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy project files and build the executable JAR
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Render injects PORT at runtime; default to 8080 for local runs
ENV PORT=8080

# Copy built artifact from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]