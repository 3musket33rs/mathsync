package eu.mais_h.sync;

/**
 * Computes the difference between two states.
 * 
 * @param <T> the type of added and removed items.
 */
public interface Resolver<T> {

  /**
   * Computes the difference between two states.
   * 
   * @return the current difference between the two states.
   */
  Difference<T> difference();
}
