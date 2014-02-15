package eu.mais_h.mathsync;

import java.util.Iterator;

/**
 * Represents summarized data.
 * 
 * <p>Note that instances must be immutable.</p>
 */
public interface Summary {

  /**
   * Adds an item to the summary.
   * 
   * <p>When both summaries can be {@link #toDifference() viewed as a difference}:
   * <ul>
   *   <li>if the item is in the removed set of that summary, it is in none of the resulting summary difference sets</li>
   *   <li>if the item is in none of the difference sets of that summary, it is in the added set of the resulting difference</li>
   *   <li>if the item is in the added set of that summary, the resulting summary may be impossible to decipher</li>
   * </ul>
   * </p>
   * 
   * @param item the item to add.
   * @return a new summary with the item being included.
   */
  Summary plus(byte[] item);

  /**
   * Adds several items to the summary.
   * 
   * <p>Equivalent to repeatedly calling {@link #plus(byte[])} for each element, but this
   * method can do optimizations for batch updates.</p>
   * 
   * @param items the items to add.
   * @return a new summary with the items being included.
   */
  Summary plus(Iterator<byte[]> items);

  /**
   * Substracts a summary from this one.
   * 
   * @param summary the summary to substract from this one.
   * @return a new summary with the items substracted from this one.
   */
  Summary minus(Summary summary);
  
  /**
   * Retrieves a JSON view of the summary.
   * 
   * @return a JSON view of the summary.
   */
  String toJSON();
  
  /**
   * Retrieves a view of the summary as a difference.
   * 
   * @return a difference view of the summary or <code>null</code> if it cannot be resolved with the information it contains.
   */
  Difference<byte[]> toDifference();
}
