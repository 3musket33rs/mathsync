(function () {
  'use strict';

  var digest = require('crypto-js/sha1');
  
  var hexToWord = require('crypto-js/enc-hex').parse;
  var wordToHex = require('crypto-js/enc-hex').stringify;

  var bitsToHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  var hexToBits = (function () {
    var obj = {};
    bitsToHex.forEach(function (hex, idx) {
      obj[hex] = idx;
    });
    return obj;
  })();

  function arrayToHex(source) {
    var letters = [];
    source.forEach(function (v) {
      letters.push(bitsToHex[(v >> 4) & 0xF]);
      letters.push(bitsToHex[v & 0xF]);
    });
    return letters.join('');
  }

  function hexToArray(hex) {
    var l = hex.length;
    var bytes = [];
    for (var i = 0; i < l; i += 2) {
      bytes.push((hexToBits[hex[i]] << 4) + (hexToBits[hex[i + 1]]));
    }
    return bytes;
  }

  function sha1(source) {
    if (!Array.isArray(source)) {
      throw new TypeError('Cannot digest source: ' + source);
    }
    return hexToArray(wordToHex(digest(hexToWord(arrayToHex(source)))));
  }

  module.exports = sha1;
})();
