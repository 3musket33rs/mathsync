package eu.mais_h.mathsync.digest;

/**
 * Creates digests of items serialized as byte arrays.
 */
public interface Digester {

  /**
   * Digests an item serialized as an array of bytes.
   *
   * <p>Any byte array value must be accepted and have a non <code>null</code> return value: for any <code>a</code>,
   * <code>digest(a) != null</code>.</p>
   *
   * <p>All valid inputs should produce in output an array of the same size:for any <code>a1</code> and
   * <code>a2</code>, <code>digest(a1).length == digest(a2).length</code>.</p>
   *
   * <p>The output must be consistent, an identical output should be returned if called twice on the same array: for
   * any <code>a1</code> and <code>a2</code>, <code>Arrays.equals(a1, a2)</code> implies
   * <code>Arrays.equals(digest(a1), digest(a2))</code>.</p>
   *
   * <p>In addition to those constrains, it is recommended that it has the properties of a
   * <a href="http://en.wikipedia.org/wiki/Cryptographic_hash_function">cryptographic hash function</a>.</p>
   *
   * @param source the item serialized as an array of bytes.
   * @return the message digest of the item.
   * @throws IllegalArgumentException if the input array is <code>null</code>.
   */
  byte[] digest(byte[] source);
}
