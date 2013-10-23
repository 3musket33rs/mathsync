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
    Set<byte[]> added = new HashSet<byte[]>();
    Set<byte[]> removed = new HashSet<byte[]>();

    Ibf filtered = this;
    Operation next = filtered.findNextOperation();
    while (next != null) {
      switch (next.type) {
      case ADDED:
        added.add(next.content);
        break;
      case REMOVED:
        removed.add(next.content);
        break;
      }
      filtered = next.afterOperation;
      next = filtered.findNextOperation();
    }

    if (filtered.isEmpty()) {
      return new SerializedDifference(added, removed);
    } else {
      return null;
    }
  }
  
  private Operation findNextOperation() {
    for (Bucket b : buckets) {
      OperationType type = getBucketOperation(b);
      if (type != null) {
        byte[] xored = b.xored();
        byte[] hashed = b.hashed();
        //TODO handle trailing 0s
        if (Arrays.equals(digester.digest(xored), hashed)) {
          Ibf afterOperation = modify(-b.items(), xored);
          return new Operation(xored, afterOperation, type);
        }
      }
    }
    return null;
  }
  
  private OperationType getBucketOperation(Bucket b) {
    switch (b.items()) {
    case 1:
      return OperationType.ADDED;
    case -1:
      return OperationType.REMOVED;
    default:
      return null;
    }
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
  
  private static enum OperationType { ADDED, REMOVED }
  
  private static final class Operation {
    
    private final byte[] content;
    private final Ibf afterOperation;
    private final OperationType type;
    
    private Operation(byte[] content, Ibf afterOperation, OperationType type) {
      this.content = content;
      this.afterOperation = afterOperation;
      this.type = type;
    }
  }
}
