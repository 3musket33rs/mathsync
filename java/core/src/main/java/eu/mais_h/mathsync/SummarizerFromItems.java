package eu.mais_h.mathsync;

import java.util.Iterator;
import java.util.Set;

import eu.mais_h.mathsync.digest.Digester;
import eu.mais_h.mathsync.digest.Sha1Digester;
import eu.mais_h.mathsync.serialize.Serializer;

/**
 * Summarizer which iterates on items in the current state to build summaries.
 */
public class SummarizerFromItems implements Summarizer {

  private final SerializedItems items;
  private final Digester digester;
  private final BucketSelector selector;

  SummarizerFromItems(SerializedItems items, Digester digester, BucketSelector selector) {
    this.items = items;
    this.digester = digester;
    this.selector = selector;
  }

  /**
   * {@inheritDoc}
   *
   * <p>Summaries produced have a size of <code>O(2^level)</code>.</p>
   */
  @Override
  public Summary summarize(int level) {
    int size = Defaults.ibfSizeFromLevel(level);
    Summary empty;
    if (size > items.size()) {
      empty = FullContent.EMPTY;
    } else {
      empty = new Ibf(size, digester, selector);
    }
    Summary filled = empty.plus(items.iterator());
    return filled;
  }

  /**
   * Builds a simple summarizer.
   *
   * @param items the set of containing all items in the current state.
   * @param serializer the serializer to use to serialize items.
   * @return a summarizer with {@link Sha1Digester SHA-1 digester} and default spread.
   */
  public static <T> Summarizer simple(Set<? extends T> items, Serializer<? super T> serializer) {
    return custom(items, serializer, Sha1Digester.get(), Defaults.defaultSelector());
  }

  /**
   * Builds a custom summarizer.
   *
   * @param items the set of containing all items in the current state.
   * @param serializer the serializer to use to serialize items.
   * @param digester the custom digester to use.
   * @param selector the strategy to choose buckets to store items in.
   * @return a summarizer corresponding to the input.
   */
  public static <T> Summarizer custom(Set<? extends T> items, Serializer<? super T> serializer, Digester digester, BucketSelector selector) {
    return new SummarizerFromItems(new SerializedItems(items, serializer), digester, selector);
  }
}
