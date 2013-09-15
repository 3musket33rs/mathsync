package eu.mais_h.sync;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

class MutableBucket implements Bucket {

  private static final String DIGEST_ALGORITHM = "SHA-1";

  private int items = 0;
  private byte[] hashed = new byte[0];
  private byte[] xored = new byte[0];

  MutableBucket() {
  }

  @Override
  public int items() {
    return items;
  }

  @Override
  public byte[] hashed() {
    return Arrays.copyOf(hashed, hashed.length);
  }

  @Override
  public byte[] xored() {
    return Arrays.copyOf(xored, xored.length);
  }

  void addItem(byte[] bytes) {
    items++;

    hashed = xor(hashed, bytes);

    byte[] hash = digest(bytes);
    xored = xor(xored, hash);
  }

  private byte[] xor(byte[] source, byte[] added) {
    byte[] xored = Arrays.copyOf(source, Math.max(source.length, added.length));
    for (int i = 0; i < added.length; i++) {
      xored[i] = (byte)(0xff & ((int)xored[i] ^ (int)added[i]));
    }
    return xored;
  }

  private byte[] digest(byte[] bytes) {
    MessageDigest md;
    try {
      md = MessageDigest.getInstance(DIGEST_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Cannot compute the hash of items with algorithm " + DIGEST_ALGORITHM, e);
    }
    md.update(bytes);
    return md.digest();
  }
}
