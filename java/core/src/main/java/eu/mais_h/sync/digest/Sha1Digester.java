package eu.mais_h.sync.digest;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Digester producing SHA-1 digests.
 * 
 * <p>Retrieve instances of this kind using {@link #get()}.</p>
 * 
 * @see <a href="http://fr.wikipedia.org/wiki/SHA-1">Wikipedia's article on SHA-1</a>
 */
public class Sha1Digester implements Digester {

  private static final String DIGEST_ALGORITHM = "SHA-1";
  private static final Sha1Digester INSTANCE = new Sha1Digester();
  
  private Sha1Digester() {
  }
  
  /**
   * Digests according to SHA-1 specification.
   */
  @Override
  public byte[] digest(byte[] source) {
    if (source == null) {
      throw new IllegalArgumentException("Cannot digest null source");
    }
    
    MessageDigest md;
    try {
      md = MessageDigest.getInstance(DIGEST_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new AssertionError("JVM does not support " + DIGEST_ALGORITHM + " algorithm", e);
    }
    md.update(source);
    return md.digest();
  }
  
  @Override
  public String toString() {
    return DIGEST_ALGORITHM;
  }
  
  /**
   * Retrieves an instance of this digester kind.
   * 
   * @return an instance of this digester kind.
   */
  public static Sha1Digester get() {
    return INSTANCE;
  }
}
