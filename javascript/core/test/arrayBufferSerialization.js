(function () {
  'use strict';

  var assert = require('assert');
  var utils = require('./utils');
  var arrayBufferSerialization = require('../src/arrayBufferSerialization');

  describe('ArrayBuffer serialization', function() {
    describe('toString', function() {
      it('encode to base64 string', function() {
        assert.equal('YWJj', arrayBufferSerialization.toString(new Int8Array([97, 98, 99]).buffer));
      });
    });
    describe('fromString', function() {
      it('decode from base64 string', function() {
        utils.isEqual([97, 98, 99], arrayBufferSerialization.fromString('YWJj'));
      });
    });
  });
})();
