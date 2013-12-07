package eu.mais_h.sync;

import java.lang.AssertionError;

import eu.mais_h.sync.serialize.Deserializer;

public class Resolvers {

  private Resolvers() {
    throw new AssertionError();
  }
  
  public <T> Resolver<T> fromSummarizers(Summarizer remote, Summarizer local, Deserializer<T> deserializer) {
    return new ResolverFromSummarizers<>(remote, local, deserializer);
  }
}
