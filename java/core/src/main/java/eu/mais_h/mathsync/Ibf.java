package eu.mais_h.mathsync;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONTokener;

import eu.mais_h.mathsync.digest.Digester;

class Ibf implements Summary {

  private final Bucket[] buckets;
  private final BucketSelector selector;
  private final Digester digester;

  Ibf(JSONTokener tokener, Digester digester, BucketSelector selector) {
    this(bucketsFromJSON(tokener), digester, selector);
  }

  Ibf(int size, Digester digester, BucketSelector selector) {
    this(bucketsOfSize(size), digester, selector);
  }

  private Ibf(Bucket[] buckets, Digester digester, BucketSelector selector) {
    if (buckets == null) {
      throw new IllegalArgumentException("Buckets cannot be null");
    }
    if (selector == null) {
      throw new IllegalArgumentException("Bucket selector cannot be null");
    }
    if (digester == null) {
      throw new IllegalArgumentException("Digester cannot be null");
    }

    this.buckets = buckets;
    this.selector = selector;
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

  @Override
  public Difference<byte[]> toDifference() {
    Bucket[] copy = copyBuckets();

    Set<byte[]> added = new HashSet<>();
    Set<byte[]> removed = new HashSet<>();

    // Search for unary buckets until there is nothing to do
    boolean found = true;
    while (found) {
      found = false;
      for (Bucket b : copy) {
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
            modifyWithSideEffect(copy, -items, verified);
            found = true;
          }
        }
      }
    }

    // If some buckets are not empty, there was not enough information to deserialize
    for (Bucket b : copy) {
      if (!b.isEmpty()) {
        return null;
      }
    }

    return new SerializedDifference(added, removed);
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

  @Override
  public Summary plus(byte[] content) {
    if (content == null) {
      throw new IllegalArgumentException("Cannot add a null item to an IBF");
    }

    Bucket[] updated = copyBuckets();
    modifyWithSideEffect(updated, 1, content);
    return new Ibf(updated, digester, selector);
  }

  @Override
  public Summary plus(Iterator<byte[]> items) {
    if (items == null) {
      throw new IllegalArgumentException("Cannot add a null iterator of items to an IBF");
    }

    Bucket[] updated = copyBuckets();
    modifyManyWithSideEffect(updated, 1, items);
    return new Ibf(updated, digester, selector);
  }

  @Override
  public Summary minus(Summary other) {
    if (other == null) {
      throw new IllegalArgumentException("Cannot substract a null IBF");
    }
    Summary result;
    if (other instanceof Ibf) {
      result = modifyWithIbf(-1, (Ibf)other);
    } else {
      Difference<byte[]> asDifference = other.toDifference();
      if (asDifference == null) {
        throw new IllegalArgumentException("Summary cannot be viewed as a difference, it is likely the root cause is using an incompatible summary type");
      }

      Bucket[] updated = copyBuckets();
      modifyManyWithSideEffect(updated, 1, asDifference.added().iterator());
      modifyManyWithSideEffect(updated, -1, asDifference.removed().iterator());
      result = new Ibf(updated, digester, selector);
    }
    return result;
  }

  private Ibf modifyWithIbf(int variation, Ibf other) {
    if (buckets.length != other.buckets.length) {
      throw new IllegalArgumentException("Cannot substract IBFs of different sizes, tried to substract " + other + " from " + this);
    }

    Bucket[] updated = new Bucket[buckets.length];
    for (int i = 0; i < buckets.length; i++) {
      Bucket otherBucket = other.buckets[i];
      updated[i] = buckets[i].modify(variation * otherBucket.items(), otherBucket.xored(), otherBucket.hashed());
    }
    return new Ibf(updated, digester, selector);
  }

  private void modifyManyWithSideEffect(Bucket[] buckets, int variation, Iterator<byte[]> items) {
    while (items.hasNext()) {
      modifyWithSideEffect(buckets, variation, items.next());
    }
  }

  /**
   * Modifies an array of buckets.
   *
   * <p>This method has side effects on the given array so {@link #buckets} must never ever
   * be passed to this method, only copies of it obtained through {@link #copyBuckets()}.</p>
   *
   * @param buckets the array of buckets to modify.
   * @param variation the variation to apply.
   * @param item the item to add or remove from buckets.
   */
  private void modifyWithSideEffect(Bucket[] buckets, int variation, byte[] item) {
    byte[] hashed = digester.digest(item);
    for (int bucket : selector.selectBuckets(item)) {
      bucket = bucket % buckets.length;
      buckets[bucket] = buckets[bucket].modify(variation, item, hashed);
    }
  }

  private Bucket[] copyBuckets() {
    return Arrays.copyOf(buckets, buckets.length);
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

  private static Bucket[] bucketsFromJSON(JSONTokener tokener) {
    JSONArray deserialized = new JSONArray(tokener);
    Bucket[] buckets = new Bucket[deserialized.length()];
    for (int i = 0; i < buckets.length; i++) {
      buckets[i] = new Bucket(deserialized.getJSONArray(i));
    }
    return buckets;
  }
}
