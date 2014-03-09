package eu.mais_h.mathsync;

import java.util.Set;

import eu.mais_h.mathsync.serialize.Deserializer;
import eu.mais_h.mathsync.serialize.Serializer;

/**
 * Resolver using a remote summarizer to compute the delta.
 *
 * @param <T> the type of compared items.
 */
public class ResolverFromItems<T> implements Resolver<T> {

  private final Iterable<byte[]> items;
  private final Summarizer remote;
  private final Deserializer<T> deserializer;

  ResolverFromItems(Iterable<byte[]> items, Summarizer remote, Deserializer<T> deserializer) {
    this.items = items;
    this.remote = remote;
    this.deserializer = deserializer;
  }

  @Override
  public Difference<T> difference() {
    int level = 0;
    Difference<byte[]> difference = null;
    while (difference == null) {
      level++;
      Summary remoteIbf = remote.summarize(level);
      Summary minusLocal = remoteIbf.minus(items.iterator());
      difference = minusLocal.toDifference();
    }
    return new DeserializedDifference<T>(difference, deserializer);
  }

  /**
   * Builds a simple resolver.
   *
   * @param items the set containing all items in the current state.
   * @param serializer the serializer to use to serialize items.
   * @param remote the retriever of remote state.
   * @param deserializer the deserializer to use to deserialize items.
   * @return a summarizer with SHA-1 digester and default spread.
   */
  public static <T> Resolver<T> from(Set<? extends T> items, Serializer<? super T> serializer, Summarizer remote, Deserializer<T> deserializer) {
    return new ResolverFromItems(new SerializedItems(items, serializer), remote, deserializer);
  }
}
