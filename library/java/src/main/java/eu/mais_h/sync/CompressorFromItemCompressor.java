package eu.mais_h.sync;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

class CompressorFromItemCompressor<T> implements Compressor<T> {

  private final ItemCompressor<T> itemCompressor;

  CompressorFromItemCompressor(ItemCompressor<T> itemCompressor) {
    this.itemCompressor = itemCompressor;
  }

  @Override
  public Ibf compress(Set<T> input, int size) {
    List<MutableBucket> buckets = new ArrayList<MutableBucket>(size);
    for (T item : input) {
      CompressedItem compressed = itemCompressor.compress(item, size);
      for (int bucket : compressed.buckets()) {
        buckets.get(bucket).addItem(compressed.bytes());
      }
    }
    return null;
  }
}
