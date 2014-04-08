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
    Mockito.when(digester.digest(Matchers.eq(new byte[] {
      (byte)5, (byte)0, (byte)0, (byte)0, (byte)10
    }))).thenReturn(new byte[] {
      (byte)0, (byte)0, (byte)0, (byte)2,
      (byte)0, (byte)0, (byte)0, (byte)3,
      (byte)0, (byte)0, (byte)0, (byte)4,
      (byte)0, (byte)0, (byte)0, (byte)5
    });

    int[] selected = selector.selectBuckets(10, new byte[] { (byte)5 });

    assertSelectedEquals(selected, 2, 3, 4);
  }

  @Test
  public void increments_on_pad_until_enough_bytes_are_generated() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] {
      (byte)5, (byte)0, (byte)0, (byte)0, (byte)10
    }))).thenReturn(new byte[] {
      (byte)0, (byte)0, (byte)0, (byte)2,
      (byte)0, (byte)0, (byte)0, (byte)3
    });
    Mockito.when(digester.digest(Matchers.eq(new byte[] {
      (byte)5, (byte)0, (byte)0, (byte)0, (byte)11
    }))).thenReturn(new byte[] {
      (byte)0, (byte)0, (byte)0, (byte)4,
      (byte)0, (byte)0, (byte)0, (byte)5
    });

    int[] selected = selector.selectBuckets(10, new byte[] { (byte)5 });

    assertSelectedEquals(selected, 2, 3, 4);
  }

  @Test
  public void returns_absolute_indexes_taken_from_padded_hash() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] {
      (byte)5, (byte)0, (byte)0, (byte)0, (byte)10
    }))).thenReturn(new byte[] {
      (byte)255, (byte)255, (byte)255, (byte)255,
      (byte)0, (byte)0, (byte)0, (byte)3,
      (byte)255, (byte)255, (byte)255, (byte)251,
      (byte)0, (byte)0, (byte)0, (byte)12
    });

    int[] selected = selector.selectBuckets(10, new byte[] { (byte)5 });

    assertSelectedEquals(selected, 1, 3, 5);
  }

  private void assertSelectedEquals(int[] selected, int... expected) {
    assertThat(selected.length).isEqualTo(expected.length);
    assertThat(selected).contains(expected);
  }
}
