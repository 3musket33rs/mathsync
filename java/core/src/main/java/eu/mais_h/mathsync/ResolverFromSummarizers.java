package eu.mais_h.mathsync;

import eu.mais_h.mathsync.serialize.Deserializer;

/**
 * Resolver using two summarizers to compute the delta.
 *
 * @param <T> the type of compared items.
 */
@Deprecated
public class ResolverFromSummarizers<T> implements Resolver<T> {

  private final Summarizer local;
  private final Summarizer remote;
  private final Deserializer<T> deserializer;

  ResolverFromSummarizers(Summarizer local, Summarizer remote, Deserializer<T> deserializer) {
    this.local = local;
    this.remote = remote;
    this.deserializer = deserializer;
  }

  @Override
  public Difference<T> difference() {
    int level = 0;
    Difference<byte[]> difference = null;
    while (difference == null) {
      level++;
      Summary localIbf = local.summarize(level);
      Summary remoteIbf = remote.summarize(level);
      difference = computeDifference(remoteIbf, localIbf);
    }
    return new DeserializedDifference<T>(difference, deserializer);
  }

  private Difference<byte[]> computeDifference(Summary remoteIbf, Summary localIbf) {
    if (!(remoteIbf instanceof Ibf)) {
      throw new IllegalStateException("Remote summary has an invalid type: " + remoteIbf);
    }
    if (!(localIbf instanceof Ibf)) {
      throw new IllegalStateException("Local summary has an invalid type: " + localIbf);
    }
    return ((Ibf)remoteIbf).minus((Ibf)localIbf).toDifference();
  }

  /**
   * Builds a resolver from a local and a remote summarizer.
   *
   * <p>Both summarizers must produce compatible summaries, for example they have to use
   * identical serialization and digest computation.</p>
   *
   * @param remote the summarizer providing remote state.
   * @param local the summarizer providing local state.
   * @param deserializer the deserializer of items.
   * @return a configured resolver.
   */
  public static <T> Resolver<T> from(Summarizer remote, Summarizer local, Deserializer<T> deserializer) {
    return new ResolverFromSummarizers<>(remote, local, deserializer);
  }
}
