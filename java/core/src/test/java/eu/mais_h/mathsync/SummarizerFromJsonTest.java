package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Arrays;
import java.util.Set;

import org.junit.Test;

import eu.mais_h.mathsync.digest.Digester;
import eu.mais_h.mathsync.digest.Sha1Digester;
import eu.mais_h.mathsync.util.Function;

public class SummarizerFromJsonTest {

  private Digester digester = Sha1Digester.get();
  private BucketSelector selector = Defaults.defaultSelector();

  private byte[] item1 = new byte[] { 1, 2 };
  private byte[] item2 = new byte[] { 2, 2 };
  private byte[] item3 = new byte[] { 3, 2 };
  
  @Test
  public void test_should_generate_summary_from_IBF() {
    final Summary ibf = new Ibf(32, digester, selector).plus(item1).plus(item2).plus(item3);
    
    Summarizer throughJson = SummarizerFromJson.custom(new Function<Integer, String>() {
      
      @Override
      public String apply(Integer t) {
        assertThat(t).isEqualTo(5);
        return ibf.toJSON();
      }
    }, digester, selector);

    Summary deserialized = throughJson.summarize(5);
    
    Difference<byte[]> diff = deserialized.toDifference();
    assertThatSetOfArrayEquals(diff.added(), item1, item2, item3);
    assertThat(diff.removed()).isEmpty();
  }
  
  @Test
  public void test_should_generate_summary_from_full_content() {
    final Summary fullContent = FullContent.EMPTY.plus(item1).plus(item2).plus(item3);
    
    Summarizer throughJson = SummarizerFromJson.custom(new Function<Integer, String>() {
      
      @Override
      public String apply(Integer t) {
        assertThat(t).isEqualTo(5);
        return fullContent.toJSON();
      }
    }, digester, selector);

    Summary deserialized = throughJson.summarize(5);
    
    Difference<byte[]> diff = deserialized.toDifference();
    assertThatSetOfArrayEquals(diff.added(), item1, item2, item3);
    assertThat(diff.removed()).isEmpty();
  }
  
  @Test
  public void test_should_throw_for_arbitrary_json() {
    Summarizer throughJson = SummarizerFromJson.custom(new Function<Integer, String>() {
      
      @Override
      public String apply(Integer t) {
        return "invalid json";
      }
    }, digester, selector);

    try {
      throughJson.summarize(5);
      fail();
    } catch (IllegalStateException e) {
      assertThat(e.getMessage()).contains("invalid json");
    }
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
