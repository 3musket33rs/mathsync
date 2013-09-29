package eu.mais_h.sync;

import java.util.Arrays;

import org.apache.commons.codec.binary.Hex;

public abstract class AbstractBucket implements Bucket {

  @Override
  public final int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + items();
    result = prime * result + Arrays.hashCode(hashed());
    result = prime * result + Arrays.hashCode(xored());
    return result;
  }

  @Override
  public final boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (!(obj instanceof Bucket)) {
      return false;
    }
    Bucket other = (Bucket)obj;
    if (items() != other.items()) {
      return false;
    }
    if (!Arrays.equals(hashed(), other.hashed())) {
      return false;
    }
    if (!Arrays.equals(xored(), other.xored())) {
      return false;
    }
    return true;
  }

  @Override
  public final String toString() {
    return getClass().getName() + " [items=" + items() + ", hashed=" + Hex.encodeHexString(hashed()) + ", xored=" + Hex.encodeHexString(xored()) + "]";
  }
}
