package eu.mais_h.mathsync.serialize;

import java.io.UnsupportedEncodingException;

import eu.mais_h.mathsync.util.Function;

/**
 * Serializer going through a string representation of items.
 * 
 * <p>{@link StringDeserializer} should be used as the corresponding {@link Deserializer}.</p>
 */
public class StringSerializer<T> implements Serializer<T> {

  private final Function<T, String> toString;
  
  private StringSerializer(Function<T, String> toString) {
    this.toString = toString;
  }

  @Override
  public byte[] serialize(T item) {
    String stringified = toString.apply(item);
    byte[] result;
    try { 
      result = stringified.getBytes("UTF-8");
    } catch (UnsupportedEncodingException e) {
      throw new AssertionError("JVM does not support UTF-8 encoding");
    }
    return result;
  }

  /**
   * Retrieves an instance of this serializer.
   *
   * @param toString the function to convert items to string as an intermediate representation.
   * @return an instance of this serializer kind.
   */
  public static <T> Serializer<T> create(Function<T, String> toString) {
    return new StringSerializer<>(toString);
  }
}
