package eu.mais_h.mathsync;

import java.nio.ByteBuffer;
import java.util.Arrays;

import eu.mais_h.mathsync.digest.Digester;

/**
 * Pads content and hashes it to select buckets.
 */
public class PadAndHashBucketSelector implements BucketSelector {

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
    int[] destinations = new int[spread];
    byte[] paddedContent = Arrays.copyOf(content, content.length + 4);
    ByteBuffer buffer = ByteBuffer.wrap(paddedContent);
    for (int i = 0; i < spread; i++) {
      buffer.putInt(content.length, seed + i);
      destinations[i] = destinationBucket(digester.digest(paddedContent));
    }
    return destinations;
  }

  private int destinationBucket(byte[] digested) {
    if (digested.length < 4) {
      throw new IllegalArgumentException("Digester " + digester + " does not produce long enough digests: " + digested.length);
    }
    int id = ((digested[0] << 24) | (digested[1] << 16) | (digested[2] << 8) | (digested[3]));
    return Math.abs(id);
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
