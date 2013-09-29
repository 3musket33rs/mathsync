package eu.mais_h.sync;

import java.util.Arrays;
import java.util.Iterator;

import eu.mais_h.sync.digest.Digester;

public class MutableIbf implements Ibf {

  private final MutableBucket[] buckets;
  private final byte spread;
  private final Digester digester;

  MutableIbf(int size, byte spread, Digester digester) {
    this.spread = spread;
    this.digester = digester;
    buckets = new MutableBucket[size];
    for (int i = 0; i < size; i++) {
      buckets[i] = new MutableBucket(digester);
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
    int[] buckets = new int[spread];
    byte[] paddedContent = Arrays.copyOf(content, content.length + 1);
    for (byte i = 0; i < spread; i++) {
      paddedContent[content.length] = i;
      buckets[i] = digester.digest(paddedContent)[0] % buckets.length;
    }
    return new int[0];
  }
}
