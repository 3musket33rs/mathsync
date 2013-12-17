package eu.mais_h.mathsync.digest;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import org.junit.Test;

public class Sha1DigesterTest {

  Sha1Digester sha1 = Sha1Digester.get();

  @Test
  public void throws_exception_for_null_input() {
    try {
      sha1.digest(null);
      fail();
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).contains("null").contains("source");
    }
  }

  @Test
  public void sha1_of_ascii_abc_corresponds_to_specification_example() {
    byte[] abc = new byte[] {
        (byte)0x61, (byte)0x62, (byte)0x63
    };
    assertThat(sha1.digest(abc)).isEqualTo(new byte[] {
        (byte)0xA9, (byte)0x99, (byte)0x3E, (byte)0x36, (byte)0x47, (byte)0x06,
        (byte)0x81, (byte)0x6A, (byte)0xBA, (byte)0x3E, (byte)0x25, (byte)0x71,
        (byte)0x78, (byte)0x50, (byte)0xC2, (byte)0x6C, (byte)0x9C, (byte)0xD0,
        (byte)0xD8, (byte)0x9D
    });
  }
}
