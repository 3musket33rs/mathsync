package eu.mais_h.sync;

/**
 * Producer of {@link Summary summaries} at different levels of detail.
 */
public interface Summarizer {

  /**
   * Produces a summary at a given level of detail.
   * 
   * <p>The larger detail level is, the bigger summary will consume on the wire, but the more
   * information it conveys.</p>
   * 
   * @param level the level of detail.
   * @return a summary of the current state at the requested level of detail.
   */
  Summary summarize(int level);
}
