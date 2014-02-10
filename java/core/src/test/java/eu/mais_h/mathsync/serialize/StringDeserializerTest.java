package eu.mais_h.mathsync.serialize;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

import eu.mais_h.mathsync.util.Function;

public class StringDeserializerTest {

  private Deserializer<String> reversed = StringDeserializer.create(new Function<String, String>() {

    @Override
    public String apply(String t) {
      return new StringBuilder(t).reverse().toString();
    }
  });
  private Deserializer<String> simple = StringDeserializer.create();

  @Test
  public void takes_string_from_utf8_bytes_and_read_object() {
    assertThat(reversed.deserialize(new byte[] {
        (byte)226, (byte)152, (byte)128, (byte)32, (byte)101, (byte)109, (byte)111, (byte)115
    })).isEqualTo("some \u2600");
  }

  @Test
  public void takes_string_from_utf8_bytes() {
    assertThat(simple.deserialize(new byte[] {
        (byte)115, (byte)111, (byte)109, (byte)101, (byte)32, (byte)226, (byte)152, (byte)128
    })).isEqualTo("some \u2600");
  }
}
