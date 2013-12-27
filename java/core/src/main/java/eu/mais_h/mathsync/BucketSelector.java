package eu.mais_h.mathsync;

/**
 * Selects buckets to store items in.
 *
 * <p>This interface leaks internal details about summary structure. One can implement and use custom instances to
 * customize settings but be ready for major changes in following versions.</p>
 */
public interface BucketSelector {

  /**
   * Selects buckets to store items in.
   *
   * <p>The output array must contain integers between <code>0</code> and <code>buckets - 1</code>.</p>
   *
   * <p>The output must be consistent, for any byte array<code>content</code>, for any positive integer <code>b</code>,
   * multiple invocations of <code>selectBuckets(b, content)</code> must return the same array.</p>
   *
   * <p>The number of returned buckets must be constant regardless the input number of buckets, for any byte array
   * <code>content</code>, for any two positive integers <code>b1</code> and <code>b2</code>,
   * <code>selectBuckets(b1, content).length == selectBuckets(b2, content).length</code>. There may be duplicates in the
   * returned array.</p>
   *
   * @param buckets the number of buckets.
   * @param content the content to store.
   * @return an array of buckets to store content in.
   */
  int[] selectBuckets(int buckets, byte[] content);
}
