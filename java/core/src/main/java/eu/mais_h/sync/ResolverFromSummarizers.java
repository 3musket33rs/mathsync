package eu.mais_h.sync;


class ResolverFromSummarizers<T> implements Resolver<T> {

  private final Summarizer remote;
  private final Summarizer local;
  private final Deserializer<T> deserializer;

  ResolverFromSummarizers(Summarizer remote, Summarizer local, Deserializer<T> deserializer) {
    this.remote = remote;
    this.local = local;
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
    return ((Ibf)remoteIbf).substract((Ibf)localIbf).asDifference();
  }
}
