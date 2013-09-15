package eu.mais_h.sync;

import java.util.Set;

public interface Compressor<T> {

  Ibf compress(Set<T> input, int size);
}
