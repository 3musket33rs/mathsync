package eu.mais_h.sync;

import java.util.Set;

import eu.mais_h.sync.digest.Sha1Digester;

public class Summarizers {
  
  private static final byte SPREAD = 4;

  private Summarizers() {
    throw new AssertionError();
  }

  public static <T> Summarizer fromItems(Set<T> items, Serializer<T> serializer) {
    return fromSerializedItems(new SerializedItems<T>(items, serializer));
  }

  public static Summarizer fromSerializedItems(Iterable<byte[]> items) {
    return new SummarizerFromItems(items, Sha1Digester.get(), SPREAD);
  }
  
  public static Summary fromJson(String jsonString) {
    return new Ibf(jsonString, Sha1Digester.get(), SPREAD);
  }
}
