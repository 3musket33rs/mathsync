package eu.mais_h.mathsync;

import java.util.Set;

import eu.mais_h.mathsync.digest.Digester;
import eu.mais_h.mathsync.digest.Sha1Digester;
import eu.mais_h.mathsync.serialize.Serializer;

/**
 * Summarizer which iterates on items in the current state to build summaries.
 */
public class SummarizerFromItems implements Summarizer {

  private final Iterable<byte[]> items;
  private final Digester digester;
  private final int spread;

  SummarizerFromItems(Iterable<byte[]> items, Digester digester, int spread) {
    this.items = items;
    this.digester = digester;
    this.spread = spread;
  }

  /**
   * {@inheritDoc}
   *
   * <p>Summaries produced have a size of <code>O(2^level)</code>.</p>
   */
  @Override
  public Summary summarize(int level) {
    Ibf ibf = new Ibf(Defaults.ibfSizeFromLevel(level), digester, spread);
    for (byte[] item : items) {
      ibf.addItem(item);
    }
    return ibf;
  }

  /**
   * Builds a simple summarizer.
   *
   * @param items the set of containing all items in the current state.
   * @param serializer the serializer to use to serialize items.
   * @return a summarizer with {@link Sha1Digester SHA-1 digester} and default spread.
   */
  public static <T> Summarizer simple(Set<? extends T> items, Serializer<? super T> serializer) {
    return custom(items, serializer, Sha1Digester.get(), 3);
  }

  /**
   * Builds a custom summarizer.
   *
   * @param items the set of containing all items in the current state.
   * @param serializer the serializer to use to serialize items.
   * @param digester the custom digester to use.
   * @param spread the number of buckets to store each item in, it is recommended using an odd number to prevent items falling twice in the same bucket to become invisible.
   * @return a summarizer corresponding to the input.
   */
  public static <T> Summarizer custom(Set<? extends T> items, Serializer<? super T> serializer, Digester digester, int spread) {
    return new SummarizerFromItems(new SerializedItems<T>(items, serializer), digester, spread);
  }
}