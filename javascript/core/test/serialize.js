(function () {
  /* global describe, it */
  'use strict';

  var assert = require('assert');
  var serialize = require('../src/serialize');
  var utils = require('./utils');

  describe('Serialize', function() {
    describe('fromString', function() {

      var reversed = serialize.fromString(function (t) {
        return t.split('').reverse().join('');
      });
      var simple = serialize.fromString();

      it('serialize stringified view with utf8bytes', function() {
        utils.assertEqual([226, 152, 129, 32, 101, 109, 111, 115], reversed('some \u2601'));
      });
      it('serialize string with utf8bytes', function() {
        utils.assertEqual([115, 111, 109, 101, 32, 226, 152, 129], simple('some \u2601'));
      });
    });
    describe('toString', function() {

      var reversed = serialize.toString(function (t) {
        return t.split('').reverse().join('');
      });
      var simple = serialize.toString();

      it('take string from utf8 bytes and read object', function() {
        assert.equal('some \u2600', reversed([226, 152, 128, 32, 101, 109, 111, 115]));
      });
      it('take string from utf8 bytes', function() {
        assert.equal('some \u2600', simple([115, 111, 109, 101, 32, 226, 152, 128]));
      });
    });
  });
})();
