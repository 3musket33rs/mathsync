package eu.mais_h.mathsync.serialize;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

import eu.mais_h.mathsync.util.Function;

public class StringSerializerTest {

  private Serializer<String> reversed = StringSerializer.create(new Function<String, String>() {

    @Override
    public String apply(String t) {
      return new StringBuilder(t).reverse().toString();
    }
  });
  private Serializer<String> simple = StringSerializer.create();

  @Test
  public void serializes_stringified_view_with_utf8_bytes() {
    assertThat(reversed.serialize("some \u2601")).isEqualTo(new byte[] {
        (byte)226, (byte)152, (byte)129, (byte)32, (byte)101, (byte)109, (byte)111, (byte)115
      });
  }

  @Test
  public void serializes_string_with_utf8_bytes() {
    assertThat(simple.serialize("some \u2601")).isEqualTo(new byte[] {
        (byte)115, (byte)111, (byte)109, (byte)101, (byte)32, (byte)226, (byte)152, (byte)129
      });
  }
}
