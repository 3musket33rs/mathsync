package eu.mais_h.sync;

import java.lang.AssertionError;
import java.util.Set;

import eu.mais_h.sync.digest.Digesters;

public class Compressors {

  private Compressors() {
    throw new AssertionError();
  }

  public static <T> Compressor fromItems(Set<T> items, Serializer<T> serializer) {
    return fromSerializedItems(new SerializedItems<T>(items, serializer));
  }

  public static Compressor fromSerializedItems(Iterable<byte[]> items) {
    return new CompressorFromItems(items, Digesters.sha1(), (byte)4);
  }
}
