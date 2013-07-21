
module.exports = (function() {
  'use strict';

  function sync(config) {
    var that = {};

    that.start = function () {
      return transaction(config);
    };

    return that;
  }

  function transaction(config) {
    var that = {};

    that.add = function (key) {
      // TODO
    };

    that.clear = function () {
      // TODO
    };

    that.remove = function (key) {
      // TODO
    };

    that.commit = function () {
      // TODO
    };

    return that;
  }

  return sync;
})();
