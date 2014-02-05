package eu.mais_h.mathsync.serialize;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class StringSerializerTest {
  
  private StringSerializer serializer = StringSerializer.get();

  @Test
  public void serializes_with_utf8_bytes() {
    assertThat(serializer.serialize("some \u2601")).isEqualTo(new byte[] { (byte)115, (byte)111, (byte)109, (byte)101, (byte)32, (byte)226, (byte)152, (byte)129 });
  }

  @Test
  public void deserializes_from_utf8_bytes() {
    assertThat(serializer.deserialize(new byte[] { (byte)115, (byte)111, (byte)109, (byte)101, (byte)32, (byte)226, (byte)152, (byte)128 })).isEqualTo("some \u2600");
  }
}
