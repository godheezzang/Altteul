# Build Stage
FROM gradle:8.6.0-jdk17 AS build

WORKDIR /app

# 프로젝트 파일 복사
COPY --chown=gradle:gradle . .

# Gradle 빌드 수행
RUN gradle clean build -x test --no-daemon

# Run Stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# 비특권 사용자 추가
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --group appuser

# 빌드된 JAR 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 사용자 변경
USER appuser

# 포트 설정
EXPOSE 8080

# JVM 설정 최적화
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar" \
]