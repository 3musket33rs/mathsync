package eu.mais_h.sync;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import eu.mais_h.sync.digest.Digester;

class Ibf implements Summary {

  private final Bucket[] buckets;
  private final byte spread;
  private final Digester digester;

  Ibf(int size, byte spread, Digester digester) {
    this(bucketsOfSize(size), spread, digester);
  }

  private Ibf(Bucket[] buckets, byte spread, Digester digester) {
    if (buckets == null) {
      throw new IllegalArgumentException("Buckets cannot be null");
    }
    if (spread < 1) {
      throw new IllegalArgumentException("Items must be stored in a strictly positive number of buckets, given: " + spread);
    }
    if (digester == null) {
      throw new IllegalArgumentException("Digester cannot be null");
    }

    this.buckets = buckets;
    this.spread = spread;
    this.digester = digester;
  }

  Ibf addItem(byte[] content) {
    if (content == null) {
      throw new IllegalArgumentException("Cannot add a null item to an IBF");
    }

    return modify(1, content);
  }

  Ibf substract(Ibf other) {
    if (other == null) {
      throw new IllegalArgumentException("Cannot substract a null IBF");
    }
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
    return new DifferenceBuilder(this).difference;
  }
  
  private boolean isEmpty() {
    for (Bucket b : buckets) {
      if (b.items() != 0) {
        return false;
      }
    }
    return true;
  }

  private Ibf modify(int variation, byte[] content) {
    Bucket[] updated = Arrays.copyOf(buckets, buckets.length);
    byte[] hashed = digester.digest(content);
    for (int bucket : destinationBuckets(content)) {
      updated[bucket] = updated[bucket].modify(variation, content, hashed);
    }
    return new Ibf(updated, spread, digester);
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
    if (size < 1) {
      throw new IllegalArgumentException("IBF size must be a strictly positive number, given: " + size);
    }

    Bucket[] buckets = new Bucket[size];
    for (int i = 0; i < size; i++) {
      buckets[i] = Bucket.EMPTY_BUCKET;
    }
    return buckets;
  }
  
  private final class DifferenceBuilder {
    
    private final Set<byte[]> added = new HashSet<>();
    private final Set<byte[]> removed = new HashSet<>();
    private final Difference<byte[]> difference;
    
    private DifferenceBuilder(Ibf original) {
      if (performOperations(original).isEmpty()) {
        difference = new SerializedDifference(added, removed);
      } else {
        difference = null;
      }
    }
    
    private Ibf performOperations(Ibf original) {
      Ibf previous = original;
      Ibf next = original;
      while (next != null) {
        previous = next;
        next = performNextOperation(previous);
      }
      return previous;
    }
    
    private Ibf performNextOperation(Ibf filtered) {
      for (Bucket b : filtered.buckets) {
        int items = b.items();
        if (items == 1 || items == -1) {
          byte[] verified = verify(b);
          if (verified != null) {
            switch (items) {
            case 1:
              added.add(verified);
              break;
            case -1:
              removed.add(verified);
              break;
            }
            return filtered.modify(-b.items(), verified);
          }
        }
      }
      return null;
    }
    
    private byte[] verify(Bucket b) {
      //TODO handle trailing 0s
      if (Arrays.equals(digester.digest(b.xored()), b.hashed())) {
        return b.xored();
      } else {
        return null;
      }
    }
  }
}
