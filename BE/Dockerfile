# Multi-stage build untuk optimasi size
FROM eclipse-temurin:22-jdk AS build

WORKDIR /app

# Copy dependency files first (untuk Docker layer caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies (akan di-cache kalo pom.xml ga berubah)
RUN chmod +x mvnw && ./mvnw dependency:resolve

# Copy source code
COPY src src

# Build aplikasi
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:22-jre

# Create non-root user untuk security
RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app

# Copy JAR dari build stage
COPY --from=build /app/target/*.jar app.jar

# Copy config file
COPY src/main/resources/application-prod.properties /app/config/application.properties

# Change ownership
RUN chown -R spring:spring /app

# Switch ke non-root user
USER spring

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# JVM tuning untuk container
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]