package eu.mais_h.sync;

import java.lang.AssertionError;

public class Compressors {

  private Compressors() {
    throw new AssertionError();
  }

  public static <T> Compressor<T> fromSerializer(Serializer<T> serializer) {
    return new CompressorFromSerializer<T>(serializer);
  }
}
