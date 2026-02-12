package ch.sbb.atlas.configuration;

import static org.springframework.security.oauth2.jwt.JwtClaimNames.AUD;

import java.util.List;
import lombok.experimental.UtilityClass;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.HttpSecurityBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.web.client.RestTemplate;

@UtilityClass
public class BaseSecurityConfig {

  public static AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry addGenerallyAllowedPaths(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry authorizeRequests) {
    return addAllowedActuatorPaths(authorizeRequests)
        .requestMatchers("/swagger-ui/**").permitAll()
        .requestMatchers("/v3/api-docs/**").permitAll()
        .requestMatchers("/static/rest-api.html").permitAll();
  }

  public static AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry addAllowedActuatorPaths(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry authorizeRequests) {
    return authorizeRequests
        .requestMatchers(HttpMethod.GET, "/actuator/health/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/actuator/info/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/actuator/metrics/**").permitAll();
  }

  public static <H extends HttpSecurityBuilder<H>> Customizer<OAuth2ResourceServerConfigurer<H>.JwtConfigurer> jwtCustomizer() {
    return jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter());
  }

  private static Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(azureAdRoleConverter());
    return converter;
  }

  /**
   * Extracts the roles from an Azure AD token and converts them to granted authorities
   */
  private static JwtGrantedAuthoritiesConverter azureAdRoleConverter() {
    JwtGrantedAuthoritiesConverter roleConverter = new JwtGrantedAuthoritiesConverter();
    roleConverter.setAuthorityPrefix(Role.ROLE_PREFIX);
    roleConverter.setAuthoritiesClaimName(Role.ROLES_JWT_KEY);
    return roleConverter;
  }

  public static JwtDecoder buildJwtDecoder(String issuerUri, String serviceName) {
    NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withIssuerLocation(issuerUri).restOperations(new RestTemplate()).build();

    OAuth2TokenValidator<Jwt> audienceValidator = new JwtClaimValidator<>(AUD,
        (List<String> aud) -> aud.contains(serviceName));
    OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
    OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer,
        audienceValidator);

    jwtDecoder.setJwtValidator(withAudience);

    return jwtDecoder;
  }
}
