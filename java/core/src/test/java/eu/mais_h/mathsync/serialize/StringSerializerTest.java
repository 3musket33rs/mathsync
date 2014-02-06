package eu.mais_h.mathsync.serialize;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

import eu.mais_h.mathsync.util.Function;

public class StringSerializerTest {
  
  private Serializer<String> serializer = StringSerializer.create(new Function<String, String>() {

    @Override
    public String apply(String t) {
      return new StringBuilder(t).reverse().toString();
    }
  });

  @Test
  public void serializes_stringified_view_with_utf8_bytes() {
    assertThat(serializer.serialize("some \u2601")).isEqualTo(new byte[] {
        (byte)226, (byte)152, (byte)129, (byte)32, (byte)101, (byte)109, (byte)111, (byte)115
      });
  }
}
