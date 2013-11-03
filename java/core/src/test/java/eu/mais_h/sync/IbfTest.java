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
  private byte[] item3 = new byte[] { (byte)7, (byte)8, (byte)9 };
  private byte spread = 3;
  private Ibf empty = new Ibf(5, digester, spread);
  private Ibf just1;
  private Ibf just2;
  private Ibf just3;
  private Ibf items1and2;
  private Difference<byte[]> difference;

  @Before
  public void prepareIbf() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(new byte[] { (byte)1 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)2 }))).thenReturn(new byte[] { (byte)4 });
    Mockito.when(digester.digest(Matchers.eq(item1))).thenReturn(new byte[] { (byte)4 });

    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)0 }))).thenReturn(new byte[] { (byte)2 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)2 }))).thenReturn(new byte[] { (byte)4 });
    Mockito.when(digester.digest(Matchers.eq(item2))).thenReturn(new byte[] { (byte)8 });
    
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)7, (byte)8, (byte)9, (byte)0 }))).thenReturn(new byte[] { (byte)0 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)7, (byte)8, (byte)9, (byte)1 }))).thenReturn(new byte[] { (byte)1 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)7, (byte)8, (byte)9, (byte)2 }))).thenReturn(new byte[] { (byte)2 });
    Mockito.when(digester.digest(Matchers.eq(item3))).thenReturn(new byte[] { (byte)12 });

    just1 = empty.addItem(item1);
    just2 = empty.addItem(item2);
    just3 = empty.addItem(item3);
    items1and2 = just1.addItem(item2);
  }

  @Test
  public void empty_ibf_leads_to_empty_difference() {
    difference = empty.asDifference();
    assertThat(difference.added()).isEmpty();
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void json_serialization_keeps_empty_ibf_empty() {
    difference = goThroughJson(empty).asDifference();
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
    
    difference = just3.asDifference();
    assertThatSetOfArrayEquals(difference.added(), item3);
    assertThat(difference.removed()).isEmpty();

    difference = items1and2.asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void json_serialization_keeps_added_item_in_difference() {
    difference = goThroughJson(just1).asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(just2).asDifference();
    assertThatSetOfArrayEquals(difference.added(), item2);
    assertThat(difference.removed()).isEmpty();
    
    difference = goThroughJson(just3).asDifference();
    assertThatSetOfArrayEquals(difference.added(), item3);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(items1and2).asDifference();
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
    
    difference = empty.substract(just3).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item3);

    difference = empty.substract(items1and2).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1, item2);
  }

  @Test
  public void json_serialization_keeps_removed_item_in_difference() {
    difference = goThroughJson(empty.substract(just1)).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1);

    difference = goThroughJson(empty.substract(just2)).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2);
    
    difference = goThroughJson(empty.substract(just3)).asDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item3);

    difference = goThroughJson(empty.substract(items1and2)).asDifference();
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
  public void different_item_sizes_in_the_same_bucket_are_resolved() {
    difference = just1.addItem(item2).substract(just3).asDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThatSetOfArrayEquals(difference.removed(), item3);
  }

  @Test
  public void unresolvable_difference_leads_to_null() {
    assertThat(just1.addItem(item1).asDifference()).isNull();
  }
  
  private Ibf goThroughJson(Ibf origin) {
    return new Ibf(origin.toJson(), digester, spread);
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
