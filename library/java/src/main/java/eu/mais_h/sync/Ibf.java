package eu.mais_h.sync;

import java.util.Arrays;
import java.util.Iterator;

import eu.mais_h.sync.digest.Digester;

class Ibf implements Summary, Iterable<Bucket> {

  private final Bucket[] buckets;
  private final byte spread;
  private final Digester digester;

  Ibf(int size, byte spread, Digester digester) {
    this.spread = spread;
    this.digester = digester;
    buckets = new Bucket[size];
    for (int i = 0; i < size; i++) {
      buckets[i] = new Bucket(digester);
    }
  }

  @Override
  public Iterator<Bucket> iterator() {
    return Arrays.<Bucket>asList(buckets).iterator();
  }

  void addItem(byte[] content) {
    for (int bucket : destinationBuckets(content)) {
      buckets[bucket].addItem(content);
    }
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
    for (Bucket bucket : this) {
      result = prime * result + bucket.hashCode();
    }
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
    Iterator<Bucket> buckets = iterator();
    Iterator<Bucket> otherBuckets = other.iterator();
    while (buckets.hasNext() && otherBuckets.hasNext()) {
      if (!buckets.next().equals(otherBuckets.next())) {
        return false;
      }
    }
    if (buckets.hasNext() || otherBuckets.hasNext()) {
      return false;
    }
    return true;
  }

  @Override
  public final String toString() {
    StringBuilder builder = new StringBuilder(getClass().getName()).append(" [");
    boolean first = true;
    for (Bucket bucket : this) {
      if (first) {
        first = false;
      } else {
        builder.append(", ");
      }
      builder.append(bucket);
    }
    return builder.append("]").toString();
  }
}
