package eu.mais_h.mathsync;

import java.nio.ByteBuffer;
import java.util.Arrays;

import eu.mais_h.mathsync.digest.Digester;

/**
 * Pads content and hashes it to select buckets.
 */
public class PadAndHashBucketSelector implements BucketSelector {

  private static final int BYTES_PER_INT = 4;

  private final int spread;
  private final Digester digester;

  private PadAndHashBucketSelector(Digester digester, int spread) {
    if (spread < 1) {
      throw new IllegalArgumentException("Items must be stored in a strictly positive number of buckets, given: " + spread);
    }
    if (digester == null) {
      throw new IllegalArgumentException("Digester cannot be null");
    }

    this.spread = spread;
    this.digester = digester;
  }

  @Override
  public int[] selectBuckets(int seed, byte[] content) {
    int remaining = spread * BYTES_PER_INT;
    ByteBuffer bucketsBytes = ByteBuffer.allocate(remaining);

    byte[] paddedContent = Arrays.copyOf(content, content.length + BYTES_PER_INT);
    ByteBuffer buffer = ByteBuffer.wrap(paddedContent);

    int pad = seed;
    while (remaining > 0) {
      buffer.putInt(content.length, pad++);
      byte[] hashed = digester.digest(paddedContent);
      bucketsBytes.put(hashed, 0, Math.min(hashed.length, remaining));
      remaining = bucketsBytes.remaining();
    }

    int[] buckets = new int[spread];
    for (int i = 0; i < spread; i++) {
      buckets[i] = Math.abs(bucketsBytes.getInt(i * BYTES_PER_INT));
    }
    return buckets;
  }

  /**
   * Builds an instance of this selector.
   *
   * @param digester the digest algorithm to use.
   * @param spread the number of buckets to store each item in, it is recommended using an odd number to prevent items falling an even number of times in the same bucket to become invisible.
   * @return an instance of this selector with the given spread and digest algorithm.
   */
  public static BucketSelector newInstance(Digester digester, int spread) {
    return new PadAndHashBucketSelector(digester, spread);
  }
}
