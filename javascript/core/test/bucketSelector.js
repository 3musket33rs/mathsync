(function () {
  'use strict';

  var utils = require('./utils');
  var assert = require('assert');
  var selector = require('../src/bucketSelector');

  describe('Bucket selector', function() {
    describe('pad and hash', function() {

      it('returns indexes taken from padded hash', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0, 0, 0, 10]).buffer)) {
            return new Int8Array([
              0, 0, 0, 2,
              0, 0, 0, 3,
              0, 0, 0, 4,
              0, 0, 0, 5
            ]).buffer;
          }
        }
        var selected = selector.padAndHash(digester, 3)(10, new Int8Array([5]).buffer);
        assert.deepEqual(selected, [2, 3, 4]);
      });

      it('increments on pad until enough bytes are generated', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0, 0, 0, 10]).buffer)) {
            return new Int8Array([
              0, 0, 0, 2,
              0, 0, 0, 3
            ]).buffer;
          } else if (utils.isEqual(content, new Int8Array([5, 0, 0, 0, 11]).buffer)) {
            return new Int8Array([
              0, 0, 0, 4,
              0, 0, 0, 5
            ]).buffer;
          }
        }
        var selected = selector.padAndHash(digester, 3)(10, new Int8Array([5]).buffer);
        assert.deepEqual(selected, [2, 3, 4]);
      });

      it('returns absolute indexes taken from padded hash', function() {
        function digester(content) {
          if (utils.isEqual(content, new Int8Array([5, 0, 0, 0, 10]).buffer)) {
            return new Int8Array([
              255, 255, 255, 255,
              0, 0, 0, 3,
              255, 255, 255, 251,
              0, 0, 0, 12
            ]).buffer;
          }
        }
        var selected = selector.padAndHash(digester, 3)(10, new Int8Array([5]).buffer);
        assert.deepEqual(selected, [1, 3, 5]);
      });
    });
  });
})();
