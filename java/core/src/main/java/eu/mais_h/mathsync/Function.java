package eu.mais_h.mathsync;

/**
 * Simplified backport of <a href="http://download.java.net/jdk8/docs/api/java/util/function/Function.html">java.util.function.Function</a>.
 */
public interface Function<T, R> {

  /**
   * Applies this function to the given argument.
   * 
   * @param t the function argument.
   * @return the function result.
   */
  R apply(T t);
}
