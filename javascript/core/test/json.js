(function () {
  /* global describe, it */
  'use strict';

  var json = require('../json');

  var ibfBuilder = require('../lib/ibf');
  var empty = require('../lib/fullContent');
  var sha1 = require('../lib/sha1');
  var selector = require('../lib/bucketSelector').padAndHash(sha1, 2);

  var assertSummaryContains = require('./utils').assertSummaryContains;
  var assert = require('assert');

  describe('JSON', function() {

    describe('resolver', function() {

      it('generate summary from IBF', function() {
        var ibf = ibfBuilder(32, sha1, selector)
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = json.newSummarizer(function (level) {
          assert.equal(5, level);
          return ibf.toJSON();
        }, sha1, selector);

        return throughJson(5).then(assertSummaryContains.bind(null, [
          new Int8Array([1, 2]).buffer,
          new Int8Array([2, 2]).buffer,
          new Int8Array([3, 2]).buffer
        ]));
      });

      it('generate summary from full content', function() {
        var fullContent = empty
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = json.newSummarizer(function (level) {
          assert.equal(5, level);
          return fullContent.toJSON();
        }, sha1, selector);

        return throughJson(5).then(assertSummaryContains.bind(null, [
          new Int8Array([1, 2]).buffer,
          new Int8Array([2, 2]).buffer,
          new Int8Array([3, 2]).buffer
        ]));
      });
    });
  });
})();
