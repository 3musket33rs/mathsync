package eu.mais_h.sync;


class ResolverFromCompressors<T> implements Resolver<T> {

  private final Summarizer remote;
  private final Summarizer local;
  private final Deserializer<T> deserializer;

  ResolverFromCompressors(Summarizer remote, Summarizer local, Deserializer<T> deserializer) {
    this.remote = remote;
    this.local = local;
    this.deserializer = deserializer;
  }

  @Override
  public Difference<T> difference() {
    int level = 1;
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
    // TODO
    return null;
  }
}
