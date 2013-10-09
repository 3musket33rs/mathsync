package eu.mais_h.sync;

import java.util.Arrays;

import org.apache.commons.codec.binary.Hex;

import eu.mais_h.sync.digest.Digester;

class Bucket {

  private int items = 0;
  private byte[] hashed = new byte[0];
  private byte[] xored = new byte[0];
  private final Digester digester;

  Bucket(Digester digester) {
    this.digester = digester;
  }

  public int items() {
    return items;
  }

  public byte[] hashed() {
    return Arrays.copyOf(hashed, hashed.length);
  }

  public byte[] xored() {
    return Arrays.copyOf(xored, xored.length);
  }

  void addItem(byte[] bytes) {
    items++;

    xored = xor(xored, bytes);

    byte[] hash = digester.digest(bytes);
    hashed = xor(hashed, hash);
  }

  private byte[] xor(byte[] source, byte[] added) {
    byte[] xored = Arrays.copyOf(source, Math.max(source.length, added.length));
    for (int i = 0; i < added.length; i++) {
      xored[i] = (byte)(0xff & ((int)xored[i] ^ (int)added[i]));
    }
    return xored;
  }

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
