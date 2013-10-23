package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class BucketTest {

  private byte[] emptyBytes = new byte[0];
  private byte[] content1 = new byte[] { (byte)1, (byte)2 };
  private byte[] hash1 = new byte[] { (byte)3, (byte)4 };
  private byte[] content2 = new byte[] { (byte)5, (byte)6 };
  private byte[] hash2 = new byte[] { (byte)7, (byte)8 };

  private Bucket empty = Bucket.EMPTY_BUCKET;
  private Bucket added1 = empty.modify(1, content1, hash1);
  private Bucket added2 = empty.modify(2, content2, hash2);
  private Bucket added1removed2 = added1.modify(-2, content2, hash2);

  @Test
  public void item_number_is_zero_by_default() {
    assertThat(empty.items()).isEqualTo(0);
  }

  @Test
  public void modifying_bucket_changes_item_number() {
    assertThat(added1.items()).isEqualTo(1);
    assertThat(added2.items()).isEqualTo(2);
    assertThat(added1removed2.items()).isEqualTo(-1);
  }

  @Test
  public void xored_is_empty_by_default() {
    assertThat(empty.xored()).isEqualTo(emptyBytes);
  }

  @Test
  public void modifying_bucket_xor_its_content() {
    assertThat(added1.xored()).isEqualTo(content1);
    assertThat(added2.xored()).isEqualTo(content2);
    assertThat(added1removed2.xored()).isEqualTo(new byte[] { (byte)(1 ^ 5), (byte)(2 ^ 6) });
  }

  @Test
  public void hashed_is_empty_by_default() {
    assertThat(empty.hashed()).isEqualTo(emptyBytes);
  }

  @Test
  public void adding_an_item_xor_its_hash() {
    assertThat(added1.hashed()).isEqualTo(hash1);
    assertThat(added2.hashed()).isEqualTo(hash2);
    assertThat(added1removed2.hashed()).isEqualTo(new byte[] { (byte)(3 ^ 7), (byte)(4 ^ 8) });
  }
}
