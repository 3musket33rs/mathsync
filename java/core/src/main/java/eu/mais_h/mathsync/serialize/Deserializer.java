package eu.mais_h.mathsync.serialize;

/**
 * Deserializes arrays of bytes back to objects.
 *
 * @param <T> the type of output objects.
 */
public interface Deserializer<T> {

  /**
   * Deserializes an array of bytes back to an object.
   *
   * <p>Any array of bytes should lead to either a non <code>null</code> value or throw an
   * {@link IllegalArgumentException}.
   *
   * <p>The output must be consistent, an identical output should be returned if called twice
   * on the identical arrays: for any valid <code>a1</code> and <code>a2</code>,
   * <code>Arrays.equals(a1, a2)</code> implies
   * <code>deserialize(a1).equals(deserialize(a2))</code>.</p>
   *
   * @param content the array of bytes representing an object.
   * @return the object deserialized from the array of bytes.
   * @throws IllegalArgumentException if the input array does not denote a valid object.
   */
  T deserialize(byte[] content) throws IllegalArgumentException;
}
