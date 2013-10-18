package eu.mais_h.sync;


public interface Resolver<T> {

  Difference<T> difference();
}
