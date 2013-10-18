package eu.mais_h.sync;

import java.util.Set;

public interface Difference<T> {
  
  Set<T> added();
  Set<T> removed();
}
