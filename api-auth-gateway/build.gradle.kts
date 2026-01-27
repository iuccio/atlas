import java.util.*

plugins {
    id("buildlogic.java-conventions")
    id("buildlogic.docker-java")
}

group = "ch.sbb.atlas"
version = "2.1071.0"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-security-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-configuration-processor")

    implementation("org.springframework.cloud:spring-cloud-starter-gateway-server-webflux")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-security-test")
    testImplementation(libs.bundles.okhttp)

}

tasks.named<Jar>("jar") {
    enabled = false
}

springBoot {
    buildInfo {
        properties {
            additional.set(
                mapOf(
                    "time" to "${Date()}"
                )
            )
        }
    }
}