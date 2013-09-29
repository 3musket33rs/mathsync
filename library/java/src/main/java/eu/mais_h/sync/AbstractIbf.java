package eu.mais_h.sync;

import java.util.Iterator;

public abstract class AbstractIbf implements Ibf {

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
