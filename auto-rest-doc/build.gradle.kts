plugins {
    id("buildlogic.java-conventions")
}

group = "ch.sbb.atlas"
version = "2.680.0"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")//need it?
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("io.swagger.core.v3:swagger-core:${property("swaggerCoreVersion")}")
    implementation("org.springframework.restdocs:spring-restdocs-mockmvc")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.assertj:assertj-core")
    testImplementation("org.junit.jupiter:junit-jupiter-engine")

}

tasks.bootJar {
    enabled = false
}

