package eu.mais_h.mathsync;

import eu.mais_h.mathsync.digest.Digester;
import eu.mais_h.mathsync.digest.Sha1Digester;

/**
 * Summarizer which deserializes JSON payloads from a remote source.
 */
public class SummarizerFromJson implements Summarizer {

  private final Function producer;
  private final Digester digester;
  private final BucketSelector selector;

  SummarizerFromJson(Function producer, Digester digester, BucketSelector selector) {
    this.producer = producer;
    this.digester = digester;
    this.selector = selector;
  }

  @Override
  public Summary summarize(int level) {
    return new Ibf(producer.apply(level), digester, selector);
  }

  /**
   * Builds a simple summarizer.
   *
   * @param producer function which fetches the JSON payload corresponding to a given level.
   * @return a summarizer with {@link Sha1Digester SHA-1 digester} and default bucket selector.
   */
  public static <T> Summarizer simple(Function producer) {
    return custom(producer, Sha1Digester.get(), Defaults.defaultSelector());
  }

  /**
   * Builds a custom summarizer.
   *
   * @param producer function which fetches the JSON payload corresponding to a given level.
   * @param digester the custom digester to use.
   * @param selector the strategy to choose buckets to store items in.
   * @return a summarizer corresponding to the input.
   */
  public static <T> Summarizer custom(Function producer, Digester digester, BucketSelector selector) {
    return new SummarizerFromJson(producer, digester, selector);
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
