package eu.mais_h.mathsync;

import eu.mais_h.mathsync.digest.Digester;
import eu.mais_h.mathsync.digest.Sha1Digester;

/**
 * Summarizer which deserializes JSON payloads from a remote source.
 */
public class SummarizerFromJson implements Summarizer {

  private final Function producer;
  private final Digester digester;
  private final int spread;

  SummarizerFromJson(Function producer, Digester digester, int spread) {
    this.producer = producer;
    this.digester = digester;
    this.spread = spread;
  }

  @Override
  public Summary summarize(int level) {
    return new Ibf(producer.apply(level), digester, spread);
  }

  /**
   * Builds a simple summarizer.
   *
   * @param producer function which fetches the JSON payload corresponding to a given level.
   * @return a summarizer with {@link Sha1Digester SHA-1 digester} and default spread.
   */
  public static <T> Summarizer simple(Function producer) {
    return custom(producer, Sha1Digester.get(), 3);
  }

  /**
   * Builds a custom summarizer.
   *
   * @param producer function which fetches the JSON payload corresponding to a given level.
   * @param digester the custom digester to use.
   * @param spread the number of buckets to store each item in, it is recommended using an odd number to prevent items falling twice in the same bucket to become invisible.
   * @return a summarizer corresponding to the input.
   */
  public static <T> Summarizer custom(Function producer, Digester digester, int spread) {
    return new SummarizerFromJson(producer, digester, spread);
  }

  /**
   * De-generified/simplified backport of <a href="http://download.java.net/jdk8/docs/api/java/util/function/Function.html">java.util.function.Function</a>.
   */
  public static interface Function {

    /**
     * Produces the JSON payload corresponding to the given level.
     *
     * @param level the level to fetch the JSON payload of.
     * @return the JSON payload corresponding to the given level.
     */
    String apply(int level);
  }
}
