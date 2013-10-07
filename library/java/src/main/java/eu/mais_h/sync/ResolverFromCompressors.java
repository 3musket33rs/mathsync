package eu.mais_h.sync;

import java.util.Set;

class ResolverFromCompressors<T> implements Resolver<T> {

  private final Compressor remote;

  ResolverFromCompressors(Compressor remote) {
    this.remote = remote;
  }

  @Override
  public Difference<T> difference(Set<T> local) {
    int size = 1;
    Difference<T> difference = null;
    while (difference == null) {
      size = size * 2;
      Ibf other = remote.compress(size);
      difference = computeDifference(other, local);
    }
    return difference;
  }

  private Difference<T> computeDifference(Ibf other, Set<T> local) {
    return null;
  }
}
