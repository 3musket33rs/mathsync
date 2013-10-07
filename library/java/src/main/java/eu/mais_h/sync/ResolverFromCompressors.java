package eu.mais_h.sync;

import java.util.Set;

class ResolverFromCompressors<T> implements Resolver<T> {

  private final Compressor remote;
  private final Compressor local;
  private final Deserializer<T> deserializer;

  ResolverFromCompressors(Compressor remote, Compressor local, Deserializer<T> deserializer) {
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
      Ibf localIbf = local.compress(size);
      Ibf remoteIbf = remote.compress(size);
      difference = computeDifference(remoteIbf, localIbf);
    }
    return deserialize(difference);
  }

  private Difference<byte[]> computeDifference(Ibf remoteIbf, Ibf localIbf) {
    // TODO
    return null;
  }

  private Difference<T> deserialize(Difference<byte[]> serializedDifference) {
    // TODO
    return null;
  }
}
