(function () {
  'use strict';

  function fromArray(array) {
    var i = 0;
    function next() {
      var res;
      if (i < array.length) {
        res = { done: false, value: array[i] };
        i++;
      } else {
        res = { done: true, value: undefined };
      }
      return res;
    }
    return { next: next };
  }

  function count(iterator) {
    var it;
    function next() {
      var upper = iterator.next();
      if (!upper.done) {
        it.count++;
      }
      return upper;
    }
    it = { next: next, count: 0 };
    return it;
  }

  function map(iterator, transform) {
    function next() {
      var upper = iterator.next();
      if (upper.done) {
        return upper;
      } else {
        return { done: false, value: transform(upper.value) };
      }
    }
    return { next: next };
  }

  /**
   * Utilities around iterators.
   *
   * @module iterator
   */
  module.exports = {

    /**
     * Creates an iterator on an array.
     *
     * @function
     * @param {Object[]} array - the array of items to represent.
     * @return {external:Iterator} an iterator which will provide items of the array.
     */
    fromArray: fromArray,

    /**
     * Counts items in an iterator.
     *
     * <p>Each time the <code>next</code> method is called, property <code>count</code> of the iterator is updated with
     * the current number of items already read. Once the iterator is finished, this counter represents the total number
     * of items iterated on and no longer changes.</p>
     *
     * @function
     * @param {external:Iterator} iterator - the original iterator to count items of.
     * @param {external:Iterator} iterator - an iterator which elments will be counted.
     */
    count: count,

    /**
     * Transforms values of an array.
     *
     * @function
     * @param {external:Iterator} iterator - the original iterator to transform.
     * @param {Function} transform - the function transforming individual items.
     * @return {external:Iterator} an iterator which will provide transformed items.
     */
    map: map
  };
})();
