(function () {
  'use strict';

  /**
   * Generator functions.
   *
   * <p>Calling them as a function returns an {@link external:Iterator iterator}.</p>
   *
   * @example
   * function* generator() {
   *   yield 1;
   *   yield 2;
   *   yield 3;
   * }
   *
   * @class Generator
   * @external
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function* Generators on Mozilla Developer Network}
   */

  /**
   * An occurrence of a Generator.
   *
   * <p>This is the result of calling a generator function which does <code>yield</code> on each item it wants to
   * expose. It can actually be a hand made object as long as it respects the contract of this interface.</p>
   *
   * @example
   * function* generator() {
   *   yield 1;
   *   yield 2;
   *   yield 3;
   * }
   * var it = generator();
   *
   * @example
   * var it = (function () {
   *   var i = 0;
   *   var content = [1, 2, 3];
   *   return {
   *     next : function () {
   *       var res;
   *       if (i < content.length) {
   *         res = { done : false, value : content[i] };
   *       } else {
   *         res = { done : true };
   *       }
   *       i++;
   *       return res;
   *     }
   *   };
   * })();
   *
   * @class Iterator
   * @external
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/The_Iterator_protocol The Iterator protocol on Mozilla Developer Network}
   */
  /**
   * Reads the next item on the iterator.
   *
   * <p>Can either return a value if it is not done, <code>{ done : false, value : 'some value' }</code>, or inform it
   * is done with <code>{ done : true }</code>.</p>
   *
   * @returns Object a done marker or a value container.
   * @function external:Iterator#next
   */

  var skeleton = require('./skeleton');

  function updaterFromGenerator(generator) {
    function updater(item, done) {
      var iterator = generator();
      var result = iterator.next();
      while(!result.done) {
        item(result.value);
        result = iterator.next();
      }
      done();
    }

    return updater;
  }

  function newSummarizer(generator, serialize, digest, selector) {
    return skeleton.newSummarizer(updaterFromGenerator(generator), serialize, digest, selector);
  }

  function newResolver(generator, remote, serialize, deserialize) {
    return skeleton.newResolver(updaterFromGenerator(generator), remote, serialize, deserialize);
  }

  /**
   * Generator/Iterator handling.
   *
   * @module mathsync/generator
   */
  module.exports = {

    /**
     * Creates a new summarizer.
     *
     * @example <caption>Items from an array.</caption>
     * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
     * function* generator() {
     *   var i, l = items.length;
     *   for (i = 0; i < l; i++) {
     *     yield items[i];
     *   }
     * }
     * function serialize(item) {
     *   return new Int32Array([item.from, item.to]).buffer;
     * }
     * var summarizer = require('mathsync/generator').newSummarizer(generator, serialize);
     *
     * @name module:mathsync/generator.newSummarizer
     * @function
     * @param {external:Generator} generator - the generator yielding local items.
     * @param {Serial~Serialize} serialize - the item serializer.
     * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
     * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
     */
    newSummarizer : newSummarizer,

    /**
     * Creates a new resolver.
     *
     * @example <caption>Items from an array.</caption>
     * var remote = ...
     * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
     * function* generator() {
     *   var i, l = items.length;
     *   for (i = 0; i < l; i++) {
     *     yield items[i];
     *   }
     * }
     * function serialize(item) {
     *   return new Int32Array([item.from, item.to]).buffer;
     * }
     * function deserialize(buffer) {
     *   var arr = new Int32Array(buffer);
     *   return { from: arr[0], to: arr[1] };
     * }
     * var resolver = require('mathsync/generator').newResolver(generator, remote, serialize, deserialize);
     *
     * @name module:mathsync/generator.newResolver
     * @function
     * @param {external:Generator} generator - the generator yielding local items.
     * @param {Summarizer} remote - summarizer producing summaires of the remote side.
     * @param {Serial~Serialize} serialize - the item serializer.
     * @param {Serial~Deserialize} deserialize - the item deserializer.
     */
    newResolver : newResolver
  };
})();
