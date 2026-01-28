package ch.sbb.line.directory.converter;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.deser.std.StdScalarDeserializer;
import tools.jackson.databind.module.SimpleModule;

/**
 * https://stackoverflow.com/questions/6852213/can-jackson-be-configured-to-trim-leading-trailing-whitespace-from-all-string-pr
 */
@Component
public class TrimLeadingTrailingWhitespace extends SimpleModule {

  private static final long serialVersionUID = 1L;

  @PostConstruct
  final void registerDeserializer() {
    addDeserializer(String.class, new StdScalarDeserializer<>(
        String.class) {
      @Override
      public String deserialize(JsonParser jsonParser, DeserializationContext ctx) {
        return jsonParser.getValueAsString().trim();
      }
    });
  }
}
