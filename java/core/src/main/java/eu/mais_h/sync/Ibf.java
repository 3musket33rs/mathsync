package eu.mais_h.sync;

import java.util.Arrays;
import java.util.Iterator;

import eu.mais_h.sync.digest.Digester;

class Ibf implements Summary {

  private final Bucket[] buckets;
  private final byte spread;
  private final Digester digester;

  Ibf(int size, byte spread, Digester digester) {
    this(bucketsOfSize(size), spread, digester);
  }

  private Ibf(Bucket[] buckets, byte spread, Digester digester) {
    this.spread = spread;
    this.digester = digester;
    this.buckets = buckets;
  }

  Ibf addItem(byte[] content) {
    Bucket[] updated = Arrays.copyOf(buckets, buckets.length);
    byte[] hashed = digester.digest(content);
    for (int bucket : destinationBuckets(content)) {
      updated[bucket] = updated[bucket].modify(1, content, hashed);
    }
    return new Ibf(updated, spread, digester);
  }

  Ibf substract(Ibf other) {
    if (buckets.length != other.buckets.length) {
      throw new IllegalArgumentException("Cannot substract IBFs of different sizes, tried to substract " + other + " from " + this);
    }
    Bucket[] updated = new Bucket[buckets.length];
    for (int i = 0; i < buckets.length; i++) {
      Bucket otherBucket = other.buckets[i];
      updated[i] = buckets[i].modify(-otherBucket.items(), otherBucket.xored(), otherBucket.hashed());
    }
    return new Ibf(updated, spread, digester);
  }

  Difference<byte[]> asDifference() {
    // TODO
    return null;
  }

  private int[] destinationBuckets(byte[] content) {
    int[] destinations = new int[spread];
    byte[] paddedContent = Arrays.copyOf(content, content.length + 1);
    for (byte i = 0; i < spread; i++) {
      paddedContent[content.length] = i;
      destinations[i] = digester.digest(paddedContent)[0] % buckets.length;
    }
    return destinations;
  }

  @Override
  public final int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + Arrays.hashCode(buckets);
    return result;
  }

  @Override
  public final boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (!(obj instanceof Ibf)) {
      return false;
    }
    Ibf other = (Ibf)obj;
    if (!Arrays.equals(buckets, other.buckets)) {
      return false;
    }
    return true;
  }

  @Override
  public final String toString() {
    StringBuilder builder = new StringBuilder("IBF with buckets [");
    boolean first = true;
    for (Bucket bucket : buckets) {
      if (first) {
        first = false;
      } else {
        builder.append(", ");
      }
      builder.append(bucket);
    }
    return builder.append("]").toString();
  }

  private static Bucket[] bucketsOfSize(int size) {
    Bucket[] buckets = new Bucket[size];
    for (int i = 0; i < size; i++) {
      buckets[i] = Bucket.EMPTY_BUCKET;
    }
    return buckets;
  }
}
