(function () {
  'use strict';
  
  var spawn = require('./spawn');

  module.exports = function startClient(serverport) {
    return spawn(serverport, null, 12001);
  };
})();
