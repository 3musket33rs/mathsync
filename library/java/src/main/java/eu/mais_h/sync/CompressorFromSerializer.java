package eu.mais_h.sync;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

class CompressorFromSerializer<T> implements Compressor<T> {

  private final Serializer<T> serializer;

  CompressorFromSerializer(Serializer<T> serializer) {
    this.serializer = serializer;
  }

  @Override
  public Ibf compress(Set<T> input, int size) {
    List<MutableBucket> buckets = new ArrayList<MutableBucket>(size);
    for (int i = 0; i < size; i++) {
      buckets.add(new MutableBucket());
    }
    for (T item : input) {
      byte[] content = serializer.serialize(item);
      for (int bucket : destinationBuckets(content)) {
        buckets.get(bucket).addItem(content);
      }
    }
    return null;
  }

  private int[] destinationBuckets(byte[] content) {
    return new int[0];
  }
}
