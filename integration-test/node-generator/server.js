(function () {
  'use strict';
  
  var spawn = require('./spawn');

  module.exports = function startServer(listenport) {
    return spawn(null, listenport, 12002);
  };
})();
