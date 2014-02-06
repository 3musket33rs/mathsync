package eu.mais_h.mathsync.serialize;

import java.io.UnsupportedEncodingException;

import eu.mais_h.mathsync.util.Function;

/**
 * Deserializer going through a string representation of items.
 * 
 * <p>{@link StringSerializer} should be used as the corresponding {@link Serializer}.</p>
 */
public class StringDeserializer<T> implements Deserializer<T> {

  private Function<String, T> toObject;
  
  private StringDeserializer(Function<String, T> toObject) {
    this.toObject = toObject;
  }
  
  @Override
  public T deserialize(byte[] item) {
    String stringified;
    try {
      stringified = new String(item, "UTF-8");
    } catch (UnsupportedEncodingException e) {
      throw new AssertionError("JVM does not support UTF-8 encoding");
    }
    T result = toObject.apply(stringified);
    return result;
  }

  /**
   * Retrieves an instance of this deserializer.
   *
   * @param toObject the function to convert items from the intermediate string to an actual object.
   * @return an instance of this deserializer kind.
   */
  public static <T> Deserializer<T> create(Function<String, T> toObject) {
    return new StringDeserializer<>(toObject);
  }
}
