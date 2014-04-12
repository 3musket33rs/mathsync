(function () {
  /* global describe, it */
  'use strict';

  var assert = require('assert');
  var sha1 = require('../src/sha1');
  var utils = require('./utils');

  describe('SHA-1', function() {
    describe('digest', function() {
      it('should refuse null source', function() {
        assert.throws(function () {
          sha1(null);
        }, function (err) {
          assert.ok(err.message.indexOf('source') >= 0);
          assert.ok(err.message.indexOf('null') >= 0);
          return true;
        });
      });

      it('should refuse object source', function() {
        assert.throws(function () {
          sha1({ test: 1 });
        }, function (err) {
          assert.ok(err.message.indexOf('source') >= 0);
          assert.ok(err.message.indexOf('[object Object]') >= 0);
          return true;
        });
      });

      it('should digest ascii abc to specification example', function() {
        utils.assertEqual(
          new Int8Array([0xA9, 0x99, 0x3E, 0x36, 0x47, 0x06, 0x81, 0x6A, 0xBA, 0x3E, 0x25, 0x71, 0x78, 0x50, 0xC2, 0x6C, 0x9C, 0xD0, 0xD8, 0x9D]).buffer,
          sha1(new Int8Array([0x61, 0x62, 0x63]).buffer)
        );
      });
    });
  });
})();
