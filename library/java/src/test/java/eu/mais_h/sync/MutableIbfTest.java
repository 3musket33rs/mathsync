package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Iterator;

import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.sync.digest.Digester;

public class MutableIbfTest {

  private Digester digester = Mockito.mock(Digester.class);

  @Test
  public void bucket_number_is_size() {
    assertThat(new MutableIbf(5, (byte)2, digester)).hasSize(5);
  }

  @Test
  public void add_item_in_buckets_designated_by_hash() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(new byte[] { (byte)9 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5 }))).thenReturn(new byte[] { (byte)4 });
    
    MutableIbf ibf = new MutableIbf(5, (byte)2, digester);
    ibf.addItem(new byte[] { (byte)5 });
    
    MutableBucket empty = new MutableBucket(digester);
    MutableBucket filled = new MutableBucket(digester);
    filled.addItem(new byte[] { (byte)5 });
    
    Iterator<Bucket> buckets = ibf.iterator();
    assertThat(buckets.next()).isEqualTo(empty);
    assertThat(buckets.next()).isEqualTo(empty);
    assertThat(buckets.next()).isEqualTo(empty);
    assertThat(buckets.next()).isEqualTo(filled);
    assertThat(buckets.next()).isEqualTo(filled);
    assertThat(buckets.hasNext()).isFalse();
  }
}
