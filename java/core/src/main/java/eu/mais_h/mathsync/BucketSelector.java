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
   * <p>The output array must contain integers between <code>0</code> and <code>Integer.MAX_VALUE</code>. It is better
   * if all integers in that range have the same probability of appearance.</p>
   *
   * <p>The output must be consistent, for any byte array<code>content</code>, for any positive integer <code>b</code>,
   * multiple invocations of <code>selectBuckets(b, content)</code> must return the same array.</p>
   *
   * <p>The number of returned buckets may vary for different contents and the returned array may contain
   * duplicates.</p>
   *
   * @param content the content to store.
   * @return an array of buckets to store content in.
   */
  int[] selectBuckets(byte[] content);
}
