package eu.mais_h.sync;

import java.util.Arrays;

import eu.mais_h.sync.digest.Digester;

class MutableBucket extends AbstractBucket {

  private int items = 0;
  private byte[] hashed = new byte[0];
  private byte[] xored = new byte[0];
  private final Digester digester;

  MutableBucket(Digester digester) {
    this.digester = digester;
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
}
