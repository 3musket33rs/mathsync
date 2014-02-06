package eu.mais_h.mathsync.serialize;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

import eu.mais_h.mathsync.util.Function;

public class StringDeserializerTest {

  private Deserializer<String> deserializer = StringDeserializer.create(new Function<String, String>() {

    @Override
    public String apply(String t) {
      return new StringBuilder(t).reverse().toString();
    }
  });

  @Test
  public void takes_string_from_utf8_bytes_and_read_object() {
    assertThat(deserializer.deserialize(new byte[] {
        (byte)226, (byte)152, (byte)128, (byte)32, (byte)101, (byte)109, (byte)111, (byte)115
    })).isEqualTo("some \u2600");
  }
}
