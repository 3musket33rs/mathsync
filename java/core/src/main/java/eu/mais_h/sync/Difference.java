package eu.mais_h.sync;

import java.util.Set;

/**
 * Represents the difference between two states.
 * 
 * @param <T> the type of added and removed items.
 */
public interface Difference<T> {
  
  /**
   * Represents the set of items added on the remote side compared to the local state.
   * 
   * @return the set of items added on the remote side compared to the local state.
   */
  Set<T> added();
  
  /**
   * Represents the set of items removed on the remote side compared to the local state.
   * 
   * @return the set of items removed on the remote side compared to the local state.
   */
  Set<T> removed();
}
