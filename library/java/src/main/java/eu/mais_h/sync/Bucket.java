package eu.mais_h.sync;

public interface Bucket {

  int items();
  byte[] hashed();
  byte[] xored();
}
