(function () {
  /* global describe, it */
  'use strict';

  var string = require('../src/string');

  var assert = require('assert');
  var utils = require('./utils');

  describe('Serialize', function() {
    describe('serializer', function() {

      it('serialize string with utf8bytes', function() {
        var simple = string.newSerializer();
        utils.assertEqual([115, 111, 109, 101, 32, 226, 152, 129], simple('some \u2601'));
      });

      it('serialize stringified view with utf8bytes', function() {
        var reversed = string.newSerializer(function (t) {
          return t.split('').reverse().join('');
        });
        utils.assertEqual([226, 152, 129, 32, 101, 109, 111, 115], reversed('some \u2601'));
      });
    });

    describe('deserializer', function() {

      it('take string from utf8 bytes', function() {
        var simple = string.newDeserializer();
        assert.equal('some \u2600', simple([115, 111, 109, 101, 32, 226, 152, 128]));
      });

      it('take string from utf8 bytes and read object', function() {
        var reversed = string.newDeserializer(function (t) {
          return t.split('').reverse().join('');
        });
        assert.equal('some \u2600', reversed([226, 152, 128, 32, 101, 109, 111, 115]));
      });
    });
  });
})();
