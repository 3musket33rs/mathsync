package eu.mais_h.sync;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.json.JSONArray;

import eu.mais_h.sync.digest.Digester;

class Ibf implements Summary {

  private final Bucket[] buckets;
  private final int spread;
  private final Digester digester;

  Ibf(String jsonString, Digester digester, int spread) {
    this(bucketsFromJSON(jsonString), digester, spread);
  }

  Ibf(int size, Digester digester, int spread) {
    this(bucketsOfSize(size), digester, spread);
  }

  private Ibf(Bucket[] buckets, Digester digester, int spread) {
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

  @Override
  public String toJSON() {
    JSONArray array = new JSONArray();
    for (Bucket b : buckets) {
      array.put(b.toJSON());
    }
    return array.toString();
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
    return new Ibf(updated, digester, spread);
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
    return new Ibf(updated, digester, spread);
  }

  private int[] destinationBuckets(byte[] content) {
    int[] destinations = new int[spread];
    byte[] paddedContent = Arrays.copyOf(content, content.length + 1);
    for (byte i = 0; i < spread; i++) {
      paddedContent[content.length] = i;
      destinations[i] = destinationBucket(digester.digest(paddedContent));
    }
    return destinations;
  }

  private int destinationBucket(byte[] digested) {
    if (digested.length < 4) {
      throw new IllegalArgumentException("Digester " + digester + " does not produce long enough digests: " + digested.length);
    }
    int id = ((digested[0] << 24) | (digested[1] << 16) | (digested[2] << 8) | (digested[3])) % buckets.length;
    if (id < 0) {
      id += buckets.length;
    }
    return id;
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

  private static Bucket[] bucketsFromJSON(String jsonString) {
    JSONArray deserialized = new JSONArray(jsonString);
    Bucket[] buckets = new Bucket[deserialized.length()];
    for (int i = 0; i < buckets.length; i++) {
      buckets[i] = new Bucket(deserialized.getJSONArray(i));
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
            return filtered.modify(-items, verified);
          }
        }
      }
      return null;
    }

    private byte[] verify(Bucket b) {
      byte[] content = b.xored();
      while (true) {
        if (Arrays.equals(digester.digest(content), b.hashed())) {
          return content;
        }
        if (content.length > 0 && content[content.length - 1] == (byte)0) {
          content = Arrays.copyOf(content, content.length - 1);
        } else {
          return null;
        }
      }
    }
  }
}
