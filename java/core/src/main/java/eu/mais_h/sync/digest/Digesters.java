package eu.mais_h.sync.digest;

public class Digesters {

  private static final Digester SHA1 = new Sha1Digester();
  
  private Digesters() {
    throw new AssertionError();
  }

  public static Digester sha1() {
    return SHA1;
  }
}
