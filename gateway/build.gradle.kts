import java.util.*

plugins {
    id("buildlogic.java-conventions")
    id("buildlogic.docker-java")
}

group = "ch.sbb.atlas"
version = "2.1071.0"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-configuration-processor")
    implementation("io.micrometer:micrometer-tracing")
    implementation("io.micrometer:micrometer-tracing-bridge-brave")

    implementation("org.springframework.cloud:spring-cloud-starter-gateway-server-webflux")

    testImplementation("org.springframework.boot:spring-boot-starter-test")

}
tasks.named<Jar>("jar") {
    enabled = false
}

springBoot {
    buildInfo {
        properties {
            additional.set(mapOf(
                    "time" to "${Date()}"
            ))
        }
    }
}