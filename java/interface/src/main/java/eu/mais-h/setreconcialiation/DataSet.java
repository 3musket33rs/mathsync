package eu.mais_h.setreconcialiation;

import java.util.Iterator;

/**
 * Descriptor of a data set.
 */
public interface DataSet {

  /**
   * Retrieves elements to synchronize with the client.
   * 
   * <p>Whether an element is or is not included in the iteration must be
   * solely based on the value of <code>input</code>.</p>
   *
   * @param input additional information to filter what is included in the iteration.
   * @return elements to synchronize with the client.
   */
  Iterator<String> retrieve(Object input);
}