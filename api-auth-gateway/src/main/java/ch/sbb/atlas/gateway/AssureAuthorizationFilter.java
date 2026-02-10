package ch.sbb.atlas.gateway;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

/**
 * Required dependencies:
 * org.springframework.boot:spring-boot-security-oauth2-client
 * org.springframework.boot:spring-boot-starter-security
 */
@RequiredArgsConstructor
@Component
@Slf4j
public class AssureAuthorizationFilter extends AbstractGatewayFilterFactory<Object> {

  private final TokenService tokenService;

  @Override
  public GatewayFilter apply(Object config) {
    return addAccessTokenIfNotPresent();
  }

  /**
   * GatewayFilter to add an Authorization Header, if currently not set
   */
  private GatewayFilter addAccessTokenIfNotPresent() {
    return (exchange, chain) -> tokenService.getClientCredentialAccessToken().map(accessToken -> {
      if (!exchange.getRequest().getHeaders().containsHeader(HttpHeaders.AUTHORIZATION)) {
        ServerHttpRequest newRequest = exchange.getRequest().mutate()
            .headers(headers -> headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)).build();
        return exchange.mutate().request(newRequest).build();
      }
      return exchange;
    }).defaultIfEmpty(exchange).flatMap(chain::filter);
  }

}