package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Arrays;
import java.util.HashSet;

import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.mathsync.digest.Digester;

public class PadAndHashBucketSelectorTest {

  private Digester digester = Mockito.mock(Digester.class);
  private BucketSelector selector = PadAndHashBucketSelector.newInstance(digester, 3);

  @Test
  public void refuses_null_digester() {
    try {
      PadAndHashBucketSelector.newInstance(null, 3);
      fail();
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).contains("Digester").contains("null");
    }
  }

  @Test
  public void refuses_non_strictly_positive_spread() {
    try {
      PadAndHashBucketSelector.newInstance(digester, 0);
      fail();
    } catch (IllegalArgumentException e) {
      assertThat(e.getMessage()).contains("0").contains("strictly positive number");
    }
  }

  @Test
  public void returns_indexes_taken_from_padded_hash() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(intToBytes(2));
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(intToBytes(3));
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)2 }))).thenReturn(intToBytes(4));

    int[] selected = selector.selectBuckets(new byte[] { (byte)5 });

    assertSelectedEquals(selected, 2, 3, 4);
  }

  @Test
  public void returns_absolute_indexes_taken_from_padded_hash() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(intToBytes(-1));
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(intToBytes(3));
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)2 }))).thenReturn(intToBytes(-5));

    int[] selected = selector.selectBuckets(new byte[] { (byte)5 });

    assertSelectedEquals(selected, 1, 3, 5);
  }

  private void assertSelectedEquals(int[] selected, int... expected) {
    assertThat(new HashSet<>(Arrays.asList(selected))).isEqualTo(new HashSet<>(Arrays.asList(selected)));
  }

  private byte[] intToBytes(int i) {
    return new byte[] {
      (byte)((i >> 24) & 0xff),
      (byte)((i >> 16) & 0xff),
      (byte)((i >> 8) & 0xff),
      (byte)(i & 0xff)
    };
  }
}
