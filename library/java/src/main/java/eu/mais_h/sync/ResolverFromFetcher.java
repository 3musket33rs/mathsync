package eu.mais_h.sync;

import java.util.Set;

class ResolverFromFetcher<T> implements Resolver<T> {

  private final Fetcher fetcher;

  ResolverFromFetcher(Fetcher fetcher) {
    this.fetcher = fetcher;
  }

  @Override
  public Difference<T> difference(Set<T> local) {
    int size = 1;
    Difference<T> difference = null;
    while (difference == null) {
      size = size * 2;
      Ibf remote = fetcher.fetch(size);
      difference = computeDifference(remote, local);
    }
    return difference;
  }

  private Difference<T> computeDifference(Ibf remote, Set<T> local) {
    return null;
  }
}
