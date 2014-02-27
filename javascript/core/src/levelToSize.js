(function () {
  'use strict';

  function levelToSize(level) {
    return Math.pow(2, level);
  }

  module.exports = levelToSize;
})();
