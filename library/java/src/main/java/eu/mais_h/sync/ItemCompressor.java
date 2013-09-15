package eu.mais_h.sync;

public interface ItemCompressor<T> {

  CompressedItem compress(T item, int forIbfSize);
}
