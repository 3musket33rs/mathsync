package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Collections;

import org.junit.Test;

public class SerializedDifferenceTest {

  private byte[] item = new byte[] { (byte)6 };

  @Test
  public void added_set_is_taken_from_input() {
    assertThat(new SerializedDifference(Collections.<byte[]>singleton(item), Collections.<byte[]>emptySet()).added()).containsOnly(item);
  }

  @Test
  public void removed_set_is_taken_from_input() {
    assertThat(new SerializedDifference(Collections.<byte[]>emptySet(), Collections.<byte[]>singleton(item)).removed()).containsOnly(item);
  }
}
