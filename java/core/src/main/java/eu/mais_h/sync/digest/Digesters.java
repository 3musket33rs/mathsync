package eu.mais_h.sync.digest;

/**
 * Common {@link Digester} implementations.
 */
public class Digesters {

  private static final Digester SHA1 = new Sha1Digester();
  
  private Digesters() {
    throw new AssertionError();
  }

  /**
   * Retrieves a digester producing SHA-1 digests.
   * 
   * @return a digester producing SHA-1 digests.
   * @see <a href="http://fr.wikipedia.org/wiki/SHA-1">Wikipedia's article on SHA-1</a>.
   */
  public static Digester sha1() {
    return SHA1;
  }
}
