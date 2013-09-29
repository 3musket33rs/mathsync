package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.sync.digest.Digester;

public class MutableBucketTest {

  private Digester digester = Mockito.mock(Digester.class);
  private MutableBucket bucket = new MutableBucket(digester);

  @Test
  public void item_number_is_zero_by_default() {
    assertThat(bucket.items()).isEqualTo(0);
  }

  @Test
  public void adding_an_item_increments_item_number() {
    Mockito.when(digester.digest(Matchers.<byte[]>any())).thenReturn(new byte[0]);
    
    bucket.addItem(new byte[0]);
    
    assertThat(bucket.items()).isEqualTo(1);
  }
  
  @Test
  public void xored_is_empty_by_default() {
    assertThat(bucket.xored()).isEqualTo(new byte[0]);
  }

  @Test
  public void adding_an_item_xor_its_content() {
    Mockito.when(digester.digest(Matchers.<byte[]>any())).thenReturn(new byte[0]);

    bucket.addItem(new byte[] { (byte)1 });
    bucket.addItem(new byte[] { (byte)3 });
    
    assertThat(bucket.xored()).isEqualTo(new byte[] { (byte)(1 ^ 3) });
  }
  
  @Test
  public void hashed_is_empty_by_default() {
    assertThat(bucket.hashed()).isEqualTo(new byte[0]);
  }

  @Test
  public void adding_an_item_xor_its_hash() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)1 }))).thenReturn(new byte[] { (byte)4 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)2 }))).thenReturn(new byte[] { (byte)5 });

    bucket.addItem(new byte[] { (byte)1 });
    bucket.addItem(new byte[] { (byte)2 });
    
    assertThat(bucket.hashed()).isEqualTo(new byte[] { (byte)(4 ^ 5) });
  }
}
