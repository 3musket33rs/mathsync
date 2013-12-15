package eu.mais_h.sync;

import java.util.Arrays;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.json.JSONArray;

class Bucket {

  static final Bucket EMPTY_BUCKET = new Bucket(0, new byte[0], new byte[0]);

  private final int items;
  private final byte[] xored;
  private final byte[] hashed;

  Bucket(JSONArray json) {
    this(json.getInt(0), deserialize(json.getString(1)), deserialize(json.getString(2)));
  }

  private Bucket(int items, byte[] xored, byte[] hashed) {
    this.items = items;
    this.xored = xored;
    this.hashed = hashed;
  }

  int items() {
    return items;
  }

  byte[] hashed() {
    return hashed;
  }

  byte[] xored() {
    return xored;
  }
  
  boolean isEmpty() {
    if (items != 0) {
      return false;
    }
    for (int i = 0; i < hashed.length; i++) {
      if (hashed[i] != 0) {
        return false;
      }
    }
    return true;
  }

  JSONArray toJSON() {
    JSONArray json = new JSONArray();
    json.put(items);
    json.put(serialize(xored));
    json.put(serialize(hashed));
    return json;
  }

  Bucket modify(int variation, byte[] content, byte[] digested) {
    return new Bucket(items + variation, xor(xored, content), xor(hashed, digested));
  }

  private byte[] xor(byte[] source, byte[] added) {
    byte[] xored = Arrays.copyOf(source, Math.max(source.length, added.length));
    for (int i = 0; i < added.length; i++) {
      xored[i] = (byte)(0xff & ((int)xored[i] ^ (int)added[i]));
    }
    return xored;
  }

  @Override
  public final String toString() {
    return "Bucket holding " + items + " items, hashed=" + Hex.encodeHexString(hashed) + ", xored=" + Hex.encodeHexString(xored);
  }

  private String serialize(byte[] array) {
    return Base64.encodeBase64String(array);
  }

  private static byte[] deserialize(String base64) {
    return Base64.decodeBase64(base64);
  }
}
