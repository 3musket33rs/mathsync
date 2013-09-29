package eu.mais_h.sync;

import java.lang.AssertionError;

import eu.mais_h.sync.digest.Digesters;

public class Compressors {

  private Compressors() {
    throw new AssertionError();
  }

  public static <T> Compressor<T> fromSerializer(Serializer<T> serializer) {
    return new CompressorFromSerializer<T>(serializer, Digesters.sha1(), (byte)4);
  }
}
