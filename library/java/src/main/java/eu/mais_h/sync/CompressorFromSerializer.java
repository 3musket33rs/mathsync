package eu.mais_h.sync;

import java.util.Set;

import eu.mais_h.sync.digest.Digester;

class CompressorFromSerializer<T> implements Compressor<T> {

  private final Serializer<T> serializer;
  private final Digester digester;
  private final byte spread;

  CompressorFromSerializer(Serializer<T> serializer, Digester digester, byte spread) {
    this.serializer = serializer;
    this.digester = digester;
    this.spread = spread;
  }

  @Override
  public Ibf compress(Set<T> input, int size) {
    MutableIbf ibf = new MutableIbf(size, spread, digester);
    for (T item : input) {
      byte[] content = serializer.serialize(item);
      ibf.addItem(content);
    }
    return ibf;
  }
}
