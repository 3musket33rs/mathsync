package eu.mais_h.sync.digest;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

class Sha1Digester implements Digester {

  private static final String DIGEST_ALGORITHM = "SHA-1";

  @Override
  public byte[] digest(byte[] source) {
    MessageDigest md;
    try {
      md = MessageDigest.getInstance(DIGEST_ALGORITHM);
    } catch (NoSuchAlgorithmException e) {
      throw new AssertionError("JVM does not support " + DIGEST_ALGORITHM + " algorithm", e);
    }
    md.update(source);
    return md.digest();
  }
}
