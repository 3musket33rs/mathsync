package eu.mais_h.sync;

import java.util.Arrays;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;

class Bucket {

  private static final String ITEMS_KEY = "items";
  private static final String XORED_KEY = "content";
  private static final String HASHED_KEY = "hash";

  static final Bucket EMPTY_BUCKET = new Bucket(0, new byte[0], new byte[0]);

  private final int items;
  private final byte[] xored;
  private final byte[] hashed;

  Bucket(JSONObject json) {
    this(json.getInt(ITEMS_KEY), deserialize(json.getString(XORED_KEY)), deserialize(json.getString(HASHED_KEY)));
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

  JSONObject toJSON() {
    JSONObject object = new JSONObject();
    object.put(ITEMS_KEY, items);
    object.put(XORED_KEY, serialize(xored));
    object.put(HASHED_KEY, serialize(hashed));
    return object;
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
