package ch.sbb.atlas.user.administration.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "azure-config")
@Getter
@Setter
public class AzureConfig {

  private String tenantId;
  private String appRegistrationId;
  private String azureAdSecret;

}
