package eu.mais_h.sync;

import java.util.Set;

public interface Resolver<T> {

  Difference<T> difference();
}
