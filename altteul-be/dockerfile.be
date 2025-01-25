# Base Image
FROM gradle:7.6.1-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy project files
COPY --chown=gradle:gradle . .

# Build the project
RUN gradle build -x test

# Final Image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the Spring Boot JAR file
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
