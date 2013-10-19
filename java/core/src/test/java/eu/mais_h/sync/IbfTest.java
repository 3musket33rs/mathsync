package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Arrays;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.sync.digest.Digester;

public class IbfTest {

  private Digester digester = Mockito.mock(Digester.class);
  private byte[] item1 = new byte[] { (byte)5 };
  private byte[] item2 = new byte[] { (byte)6 };
  private Ibf empty = new Ibf(5, (byte)2, digester);
  private Ibf just1;
  private Ibf just2;
  private Ibf full;
  private Difference<byte[]> difference;

  @Before
  public void prepareIbf() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(new byte[] { (byte)9 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(item1))).thenReturn(new byte[] { (byte)4 });

    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)0 }))).thenReturn(new byte[] { (byte)1 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(item2))).thenReturn(new byte[] { (byte)8 });

    just1 = empty.addItem(item1);
    just2 = empty.addItem(item2);
    full = just1.addItem(item2);
  }

  @Test
  public void empty_ibf_leads_to_empty_difference() {
    difference = empty.asDifference();
    assertThat(difference.added()).isEmpty();
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void added_item_is_in_difference() {
    difference = just1.asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThat(difference.removed()).isEmpty();

    difference = just2.asDifference();
    assertThatSetOfArrayEquals(difference.added(), item2);
    assertThat(difference.removed()).isEmpty();

    difference = full.asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void removed_item_is_in_difference() {
    difference = empty.substract(just1).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1);

    difference = empty.substract(just2).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2);

    difference = empty.substract(full).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1, item2);
  }

  @Test
  public void added_and_removed_item_are_in_difference() {
    difference = just1.substract(just2).asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThatSetOfArrayEquals(difference.removed(), item2);
  }

  @Test
  public void unresolvable_difference_leads_to_null() {
    assertThat(just1.addItem(item1).asDifference()).isNull();
  }

  private void assertThatSetOfArrayEquals(Set<byte[]> actual, byte[]... expected) {
    assertThat(actual).hasSize(expected.length);
    for (byte[] a : actual) {
      boolean found = false;
      for (byte[] e : expected) {
        if (Arrays.equals(a, e)) {
          found = true;
          break;
        }
      }
      if (!found) {
        fail(Arrays.toString(a) + " is not in " + Arrays.deepToString(expected));
      }
    }
  }
}
