package ch.sbb.atlas.configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.deser.std.StdScalarDeserializer;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.module.SimpleModule;

@Configuration
public class JacksonJsonConfig {

  @Bean
  TrimLeadingTrailingWhitespace trimLeadingTrailingWhitespace() {
    return new TrimLeadingTrailingWhitespace();
  }

  @Bean
  ObjectMapper objectMapper() {
    return JsonMapper.builder()
        .configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false)
        .addModule(trimLeadingTrailingWhitespace())
        .findAndAddModules()
        .build();
  }

  /**
   * https://stackoverflow.com/questions/6852213/can-jackson-be-configured-to-trim-leading-trailing-whitespace-from-all-string-pr
   */
  static class TrimLeadingTrailingWhitespace extends SimpleModule {

    private static final long serialVersionUID = 1L;

    @PostConstruct
    final void registerDeserializer() {
      addDeserializer(String.class, new StdScalarDeserializer<>(String.class) {
        @Override
        public String deserialize(JsonParser jsonParser, DeserializationContext ctx) {
          return jsonParser.getValueAsString().trim();
        }
      });
    }
  }
}
