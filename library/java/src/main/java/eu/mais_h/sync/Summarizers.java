package eu.mais_h.sync;

import java.lang.AssertionError;
import java.util.Set;

import eu.mais_h.sync.digest.Digesters;

public class Summarizers {

  private Summarizers() {
    throw new AssertionError();
  }

  public static <T> Summarizer fromItems(Set<T> items, Serializer<T> serializer) {
    return fromSerializedItems(new SerializedItems<T>(items, serializer));
  }

  public static Summarizer fromSerializedItems(Iterable<byte[]> items) {
    return new SummarizerFromItems(items, Digesters.sha1(), (byte)4);
  }
}
