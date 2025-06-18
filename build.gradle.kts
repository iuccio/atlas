plugins {
    id("org.sonarqube") version "6.2.0.5505"
}

group = "ch.sbb.atlas"
version = "2.680.0"

extra["awsS3Version"] = "2.31.65"

extra["swaggerCoreVersion"] = "2.2.33"
extra["openapiStarterCommonVersion"] = "2.8.9"

// Geo Data Libs
extra["proj4jVersion"] = "1.4.1"
extra["jtsVersion"] = "1.20.0"
extra["springOpenapiUiVersion"] = "2.8.9"
extra["springCloudVersion"] = "2025.0.0"

subprojects {
    sonar {
        properties {
            property("sonar.projectKey", "ch.sbb.atlas:atlas")
            property("sonar.projectVersion", project.version)
            property("sonar.dynamicAnalysis", "reuseReports")
            property("sonar.java.coveragePlugin", "jacoco")
            property(
                "sonar.exclusions",
                "**/node_modules/**,**/src/app/api/**,**/*.spec.ts,**/*.module.ts,**/*.routes.ts,**/karma.conf.js," +
                        "**/instana.js,**/polyfills.ts,**/cypress/**,**/db/migration/**/*,**/*.kts"
            )
        }
    }
    if (project.name == "frontend") {
        sonar {
            properties {
                property("sonar.projectKey", "ch.sbb.atlas:atlas")
                property("sonar.projectVersion", project.version)
                property(
                    "sonar.exclusions",
                    "**/node_modules/**,**/src/app/api/**,**/*.spec.ts,**/*.module.ts,**/*.routes.ts,**/karma.conf.js,**/*.kts"
                )
                property("sonar.sources", "./")
                property("sonar.language", "ts")
                property("sonar.profile", "TsLint")
                property("sonar.verbose", "true")
                property("sonar.test.inclusion", "**/*.spec.ts")
                property("sonar.ts.tslint.configPath", "tslint.json")
                property("sonar.ts.coverage.lcovReportPath", "coverage/atlas-frontend/lcov.info")
                property("sonar.typescript.lcov.reportPaths", "${project.projectDir}/coverage/atlas-frontend/lcov.info")
                property("sonar.coverage.exclusions", "**/*.spec.ts,**/src/app/api/**,**/cypress/**,/**/*.module.ts")
            }
        }
    }
}