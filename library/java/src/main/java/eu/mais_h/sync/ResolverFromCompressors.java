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
    int size = 1;
    Difference<byte[]> difference = null;
    while (difference == null) {
      size = size * 2;
      Summary localIbf = local.compress(size);
      Summary remoteIbf = remote.compress(size);
      difference = computeDifference(remoteIbf, localIbf);
    }
    return deserialize(difference);
  }

  private Difference<byte[]> computeDifference(Summary remoteIbf, Summary localIbf) {
    // TODO
    return null;
  }

  private Difference<T> deserialize(Difference<byte[]> serializedDifference) {
    // TODO
    return null;
  }
}
