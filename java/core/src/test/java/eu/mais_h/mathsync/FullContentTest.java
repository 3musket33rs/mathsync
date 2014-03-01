package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Arrays;
import java.util.Set;

import org.json.JSONTokener;
import org.junit.Test;

public class FullContentTest {

  private byte[] item1 = new byte[] { (byte)5 };
  private byte[] item2 = new byte[] { (byte)6 };
  private byte[] item3 = new byte[] { (byte)7 };
  
  private Summary empty = FullContent.EMPTY;
  
  @Test
  public void difference_of_empty_summary_is_empty() {
    assertThat(empty.toDifference().added()).isEmpty();
    assertThat(empty.toDifference().removed()).isEmpty();
    assertThat(goThroughJson(empty).toDifference().added()).isEmpty();
    assertThat(goThroughJson(empty).toDifference().removed()).isEmpty();
  }
  
  @Test
  public void difference_of_singleton_summary_contains_added_item() {
    Summary plusItem1 = empty.plus(item1);
    
    assertThatSetOfArrayEquals(plusItem1.toDifference().added(), item1);
    assertThat(plusItem1.toDifference().removed()).isEmpty();
    assertThatSetOfArrayEquals(goThroughJson(plusItem1).toDifference().added(), item1);
    assertThat(goThroughJson(plusItem1).toDifference().removed()).isEmpty();
  }
  
  @Test
  public void difference_of_singleton_removed_summary_contains_removed_item() {
    Summary minusItem1 = empty.minus(empty.plus(item1));
    
    assertThat(minusItem1.toDifference().added()).isEmpty();
    assertThatSetOfArrayEquals(minusItem1.toDifference().removed(), item1);
    assertThat(goThroughJson(minusItem1).toDifference().added()).isEmpty();
    assertThatSetOfArrayEquals(goThroughJson(minusItem1).toDifference().removed(), item1);
  }
  
  @Test
  public void difference_of_added_then_removed_item_is_empty() {
    Summary addedThenRemoved = empty.plus(item1).minus(empty.plus(item1));
    
    assertThat(addedThenRemoved.toDifference().added()).isEmpty();
    assertThat(addedThenRemoved.toDifference().removed()).isEmpty();
    assertThat(goThroughJson(addedThenRemoved).toDifference().added()).isEmpty();
    assertThat(goThroughJson(addedThenRemoved).toDifference().removed()).isEmpty();
  }
  
  @Test
  public void difference_of_removed_then_added_item_is_empty() {
    Summary removedThenAdded = empty.minus(empty.plus(item1)).plus(item1);
    
    assertThat(removedThenAdded.toDifference().added()).isEmpty();
    assertThat(removedThenAdded.toDifference().removed()).isEmpty();
    assertThat(goThroughJson(removedThenAdded).toDifference().added()).isEmpty();
    assertThat(goThroughJson(removedThenAdded).toDifference().removed()).isEmpty();
  }
  
  @Test
  public void difference_of_many_added_item_contains_them() {
    Summary manyAdded = empty.plus(Arrays.asList(item1, item2, item3).iterator());

    assertThatSetOfArrayEquals(manyAdded.toDifference().added(), item1, item2, item3);
    assertThat(manyAdded.toDifference().removed()).isEmpty();
    assertThatSetOfArrayEquals(goThroughJson(manyAdded).toDifference().added(), item1, item2, item3);
    assertThat(goThroughJson(manyAdded).toDifference().removed()).isEmpty();
  }
  
  private Summary goThroughJson(Summary s) {
    return new FullContent(new JSONTokener(s.toJSON()));
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
