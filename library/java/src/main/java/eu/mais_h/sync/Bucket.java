package eu.mais_h.sync;

interface Bucket {

  int items();
  byte[] hashed();
  byte[] xored();
}
