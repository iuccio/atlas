package ch.sbb.business.organisation.directory.configuration;

import ch.sbb.atlas.configuration.PagingConfig;
import ch.sbb.atlas.configuration.filter.CorrelationIdFilterConfig;
import java.util.Collection;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Import({CorrelationIdFilterConfig.class, PagingConfig.class})
public class AtlasWebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.removeConvertible(String.class, Collection.class);
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/static/**")
        .addResourceLocations("classpath:/static/");
  }
}
