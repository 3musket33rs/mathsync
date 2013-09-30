package eu.mais_h.sync;

import java.lang.AssertionError;
import java.util.Set;

import eu.mais_h.sync.digest.Digesters;

public class Compressors {

  private Compressors() {
    throw new AssertionError();
  }

  public static <T> Compressor<T> fromItems(Set<T> items, Serializer<T> serializer) {
    return fromSerializedItems(new SerializedItems<T>(items, serializer));
  }

  public static <T> Compressor<T> fromSerializedItems(Iterable<byte[]> items) {
    return new CompressorFromItems<T>(items, Digesters.sha1(), (byte)4);
  }
}
