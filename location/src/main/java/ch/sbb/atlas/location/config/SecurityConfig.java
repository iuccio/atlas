package ch.sbb.atlas.location.config;

import static ch.sbb.atlas.configuration.Role.ATLAS_ADMIN;
import static org.springframework.security.config.Customizer.withDefaults;

import ch.sbb.atlas.configuration.BaseSecurityConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

  @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
  private String issuerUri;

  @Value("${auth.audience.service-name}")
  private String serviceName;

  @Bean
  protected SecurityFilterChain filterChain(HttpSecurity http) {
    http
        // CORS: by default Spring uses a bean with the name of corsConfigurationSource: @see ch.sbb.esta.config.CorsConfig
        .cors(withDefaults())

        // for details about stateless authentication see e.g. https://golb.hplar.ch/2019/05/stateless.html
        .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(authorizeRequests ->
            BaseSecurityConfig.addAllowedActuatorPaths(authorizeRequests)
                .requestMatchers(HttpMethod.POST, "/**").hasRole(ATLAS_ADMIN)
                .anyRequest().authenticated()
        )

        // @see <a href="https://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#oauth2resourceserver">OAuth
        // 2.0 Resource Server</a>
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(BaseSecurityConfig.jwtCustomizer()));
    return http.build();
  }

  @Bean
  JwtDecoder jwtDecoder() {
    return BaseSecurityConfig.buildJwtDecoder(issuerUri, serviceName);
  }

}
