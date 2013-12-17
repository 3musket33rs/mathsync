package eu.mais_h.mathsync;


/**
 * Summarizer which uses a large (possibly cached) summary to generate smaller ones.
 */
public class SummarizerFromLarge implements Summarizer {

  private final Supplier producer;

  SummarizerFromLarge(Supplier producer) {
    this.producer = producer;
  }

  @Override
  public Summary summarize(int level) {
    Summary summary = producer.get();
    if (!(summary instanceof Ibf)) {
      throw new IllegalStateException("Invalid summary given, got: " + summary);
    }
    return ((Ibf)summary).reduce(Defaults.ibfSizeFromLevel(level));
  }

  /**
   * Builds a simple summarizer.
   *
   * @param producer function which provides (possibly cached) large summaries.
   * @return a summarizer reducing large summaries.
   */
  public static <T> Summarizer from(Supplier producer) {
    return new SummarizerFromLarge(producer);
  }

  /**
   * De-generified/simplified backport of <a href="http://download.java.net/jdk8/docs/api/java/util/function/Supplier.html">java.util.function.Supplier</a>.
   */
  public static interface Supplier {

    /**
     * Produces the a large summary.
     *
     * @return a large summary.
     */
    Summary get();
  }
}
