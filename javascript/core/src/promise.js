(function () {
  'use strict';

  /**
   * The native promise object.
   *
   * @external Promise
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise Promise on Mozilla Developer Network}
   */
  /**
   * Register fullfillment and rejection handlers to the promise.
   *
   * @param {function} onFullfilled - fullfillment handler called with the resolved value.
   * @param {function} onRejected - rejection handler called with the rejection cause.
   * @returns {external:Promise} a promise resolving to the result value of the called handler.
   * @function external:Promise#then
   */

  /**
   * Promise implementation chooser.
   *
   * <p>Either returns the global Promise object or uses the
   * <a href="https://github.com/jakearchibald/es6-promise">polyfill</a>.</p>
   *
   * @module promise
   */
  module.exports = (typeof Promise === 'undefined') ? require('es6-promise').Promise : Promise;
})();
