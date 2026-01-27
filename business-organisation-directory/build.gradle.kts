plugins {
    id("buildlogic.java-conventions")
    id("buildlogic.java-restdoc")
    alias(libs.plugins.wsdl2java)
    id("buildlogic.docker-java")
}

group = "ch.sbb.atlas"
version = "2.1071.0"

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-security-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")
    implementation("org.springframework.boot:spring-boot-starter-kafka")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.springframework.boot:spring-boot-starter-json")

    // For correlation id and tracing
    implementation("org.springframework.boot:spring-boot-micrometer-tracing-brave")

    // Libraries
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-csv")
    implementation(libs.aws.s3)

    // SOAP Web Service
    implementation("org.springframework.boot:spring-boot-starter-webservices")
    implementation("org.springframework.ws:spring-ws-core")
    implementation("org.springframework.ws:spring-ws-support")
    implementation("org.springframework.ws:spring-ws-security")
    implementation("com.sun.xml.messaging.saaj:saaj-impl")

    // Flyway for DB migrations
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

    // Project dependencies
    implementation(project(":base-atlas"))
    implementation(project(":kafka"))
    implementation(project(":user-administration-security"))

    implementation("org.hibernate.orm:hibernate-processor")
    annotationProcessor("org.hibernate.orm:hibernate-processor")

    runtimeOnly("org.postgresql:postgresql")

    // Testing dependencies
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
    testImplementation("org.springframework.boot:spring-boot-starter-webservices-test")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:testcontainers-postgresql")

    testImplementation(project(":base-atlas", "test"))
    testImplementation(project(":auto-rest-doc"))
}

wsdl2java {
    packageName.set("ch.sbb.business.organisation.directory.service.crd")
}

tasks.compileJava.get().dependsOn(tasks.wsdl2java)

springBoot {
    buildInfo()
}