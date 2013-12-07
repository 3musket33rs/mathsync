package eu.mais_h.sync.serialize;

/**
 * Serializes objects to arrays of bytes.
 * 
 * @param <T> the type of input objects.
 */
public interface Serializer<T> {

  /**
   * Serializes an object to an array of byte.
   * 
   * <p>Any instance of <code>T</code> must be accepted and have a non <code>null</code> return value:
   * for any <code>o</code>, <code>o instanceof T</code> implies <code>serialize(o) != null</code>.</p>
   * 
   * <p>The output must be consistent, an identical output should be returned if called twice on the equal
   * objects: for any <code>o1</code> and <code>o2</code>, <code>o1.equals(o2)</code> implies
   * <code>Arrays.equals(serialize(o1), serialize(o2))</code>.</p>
   * 
   * @param item the object to serialize.
   * @return the array of bytes representing the input object on the wire.
   */
  byte[] serialize(T item);
}
