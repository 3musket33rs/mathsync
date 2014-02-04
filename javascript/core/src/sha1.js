(function () {
  'use strict';

  var Rusha = require('rusha');
  var rusha = new Rusha();

  function sha1(source) {
    if (!(source instanceof ArrayBuffer)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    var int32arr = rusha.rawDigest(source);
    var buff = new ArrayBuffer(20);
    var readview = new DataView(int32arr.buffer);
    var writeview = new DataView(buff);
    for (var i = 0; i < 20; i += 4) {
      writeview.setInt32(i, readview.getInt32(i, true), false);
    }
    return buff;
  }

  module.exports = sha1;
})();
