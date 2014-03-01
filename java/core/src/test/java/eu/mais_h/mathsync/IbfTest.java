package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Arrays;
import java.util.Set;

import org.json.JSONTokener;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.mathsync.digest.Digester;

public class IbfTest {

  private Digester digester = Mockito.mock(Digester.class);
  private byte[] item1 = new byte[] { (byte)5 };
  private byte[] item2 = new byte[] { (byte)6 };
  private byte[] item3 = new byte[] { (byte)7, (byte)8, (byte)9 };
  private BucketSelector selector = Mockito.mock(BucketSelector.class);
  private Summary empty = new Ibf(5, digester, selector);
  private Summary just1;
  private Summary just2;
  private Summary just3;
  private Summary items1and2;
  private Summary items2and3;
  private Difference<byte[]> difference;

  @Before
  public void prepareIbf() {
    Mockito.when(selector.selectBuckets(Matchers.eq(item1))).thenReturn(new int[] { 6, 3, 4 });
    Mockito.when(digester.digest(Matchers.eq(item1))).thenReturn(new byte[] { (byte)4 });

    Mockito.when(selector.selectBuckets(Matchers.eq(item2))).thenReturn(new int[] { 2, 3, 4 });
    Mockito.when(digester.digest(Matchers.eq(item2))).thenReturn(new byte[] { (byte)8 });

    Mockito.when(selector.selectBuckets(Matchers.eq(item3))).thenReturn(new int[] { 0, 1, 2 });
    Mockito.when(digester.digest(Matchers.eq(item3))).thenReturn(new byte[] { (byte)12 });

    just1 = empty.plus(item1);
    just2 = empty.plus(item2);
    just3 = empty.plus(item3);
    items1and2 = just1.plus(item2);
    items2and3 = empty.plus(Arrays.asList(item2, item3).iterator());
  }

  @Test
  public void empty_ibf_leads_to_empty_difference() {
    difference = empty.toDifference();
    assertThat(difference.added()).isEmpty();
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void json_serialization_keeps_empty_ibf_empty() {
    difference = goThroughJson(empty).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void added_item_is_in_difference() {
    difference = just1.toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThat(difference.removed()).isEmpty();

    difference = just2.toDifference();
    assertThatSetOfArrayEquals(difference.added(), item2);
    assertThat(difference.removed()).isEmpty();

    difference = just3.toDifference();
    assertThatSetOfArrayEquals(difference.added(), item3);
    assertThat(difference.removed()).isEmpty();

    difference = items1and2.toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThat(difference.removed()).isEmpty();
    
    difference = items2and3.toDifference();
    assertThatSetOfArrayEquals(difference.added(), item2, item3);
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void json_serialization_keeps_added_item_in_difference() {
    difference = goThroughJson(just1).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(just2).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item2);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(just3).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item3);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(items1and2).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThat(difference.removed()).isEmpty();

    difference = goThroughJson(items2and3).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item2, item3);
    assertThat(difference.removed()).isEmpty();
  }

  @Test
  public void removed_item_is_in_difference() {
    difference = empty.minus(just1).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1);

    difference = empty.minus(just2).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2);

    difference = empty.minus(just3).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item3);

    difference = empty.minus(items1and2).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1, item2);

    difference = empty.minus(items2and3).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2, item3);
  }

  @Test
  public void json_serialization_keeps_removed_item_in_difference() {
    difference = goThroughJson(empty.minus(just1)).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1);

    difference = goThroughJson(empty.minus(just2)).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2);

    difference = goThroughJson(empty.minus(just3)).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item3);

    difference = goThroughJson(empty.minus(items1and2)).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item1, item2);

    difference = goThroughJson(empty.minus(items2and3)).toDifference();
    assertThat(difference.added()).isEmpty();
    assertThatSetOfArrayEquals(difference.removed(), item2, item3);
  }

  @Test
  public void added_and_removed_item_are_in_difference() {
    difference = just1.minus(just2).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1);
    assertThatSetOfArrayEquals(difference.removed(), item2);
  }

  @Test
  public void different_item_sizes_in_the_same_bucket_are_resolved() {
    difference = just1.plus(item2).minus(just3).toDifference();
    assertThatSetOfArrayEquals(difference.added(), item1, item2);
    assertThatSetOfArrayEquals(difference.removed(), item3);
  }

  @Test
  public void unresolvable_difference_leads_to_null() {
    assertThat(just1.plus(item1).toDifference()).isNull();
  }

  private Summary goThroughJson(Summary origin) {
    return new Ibf(new JSONTokener(origin.toJSON()), digester, selector);
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
