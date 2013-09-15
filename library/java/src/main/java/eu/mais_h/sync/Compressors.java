package eu.mais_h.sync;

import java.lang.AssertionError;

public class Compressors {

  private Compressors() {
    throw new AssertionError();
  }

  public static <T> Compressor<T> fromItemCompressor(ItemCompressor<T> itemCompressor) {
    return new CompressorFromItemCompressor(itemCompressor);
  }
}
