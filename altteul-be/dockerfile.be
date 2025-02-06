# 1단계: 빌드
FROM bellsoft/liberica-openjdk-alpine:17 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

# 2단계: 런타임 이미지
FROM bellsoft/liberica-openjdk-alpine:17
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
