package eu.mais_h.mathsync.serialize;

import java.io.UnsupportedEncodingException;

/**
 * Serializer and deserializer using string representation of items.
 *
 * <p>The UTF-8 encoding of strings is used to cary them on the network.</p>
 */
public class StringSerializer implements Serializer<String>, Deserializer<String> {

  private static final String ENCODING = "UTF-8";
  private static final StringSerializer INSTANCE = new StringSerializer();

  private StringSerializer() {
  }

  @Override
  public byte[] serialize(String item) {
    try {
      return item.getBytes(ENCODING);
    } catch (UnsupportedEncodingException e) {
      throw new AssertionError("JVM does not support " + ENCODING + " encoding");
    }
  }

  @Override
  public String deserialize(byte[] item) {
    try {
      return new String(item, ENCODING);
    } catch (UnsupportedEncodingException e) {
      throw new AssertionError("JVM does not support " + ENCODING + " encoding");
    }
  }

  /**
   * Retrieves an instance of this serializer/deserializer kind.
   *
   * @return an instance of this serializer/deserializer kind.
   */
  public static StringSerializer get() {
    return INSTANCE;
  }
}
