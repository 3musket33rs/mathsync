(function () {
  /* global describe, it */
  'use strict';

  var assert = require('assert');
  var summarizer = require('../src/summarizer');
  var ibfBuilder = require('../src/ibf');
  var empty = require('../src/fullContent');
  var sha1 = require('../src/sha1');
  var utils = require('./utils');
  var selector = require('../src/bucketSelector').padAndHash(sha1, 3);
  var Readable = require('stream').Readable;
  var util = require('util');

  function ArrayStream(items) {
    Readable.call(this, { objectMode: true });
    this._index = 0;
    this._items = items;
  }
  util.inherits(ArrayStream, Readable);
  ArrayStream.prototype._read = function() {
    if (this._index >= this._items.length) {
      this.push(null);
    } else {
      this.push(this._items[this._index]);
      this._index++;
    }
  };

  describe('Summarizer', function() {

    describe('fromItems', function() {
      it('generate summary with input items', function() {
        function serialize(value) {
          return new Int8Array(value).buffer;
        }
        var fromItems = summarizer.fromItems([[1, 2], [2, 2], [3, 2]], serialize, sha1, selector);

        return fromItems(5).then(function (summary) {
          var diff = summary.toDifference();
          utils.assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
        });
      });
    });

    describe('fromGenerator', function() {
      it('generate summary with input items', function() {
        function* provider() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }
        function serialize(value) {
          return new Int8Array(value).buffer;
        }
        var fromItems = summarizer.fromGenerator(provider, serialize, sha1, selector);

        return fromItems(5).then(function (summary) {
          var diff = summary.toDifference();
          utils.assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
        });
      });
    });

    describe('fromStream', function() {
      it('generate summary with input items', function() {
        function streamer() {
          return new ArrayStream([
            [1, 2],
            [2, 2],
            [3, 2]
          ]);
        }
        function serialize(value) {
          return new Int8Array(value).buffer;
        }
        var fromStream = summarizer.fromStream(streamer, serialize, sha1, selector);

        return fromStream(5).then(function (summary) {
          var diff = summary.toDifference();
          utils.assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
        });
      });
    });

    describe('fromJSON', function() {
      it('generate summary from IBF', function() {
        var ibf = ibfBuilder(32, sha1, selector)
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = summarizer.fromJSON(function (level) {
          assert.equal(5, level);
          return ibf.toJSON();
        }, sha1, selector);

        return throughJson(5).then(function (summary) {
          var diff = summary.toDifference();
          utils.assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
        });
      });

      it('generate summary from full content', function() {
        var fullContent = empty
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = summarizer.fromJSON(function (level) {
          assert.equal(5, level);
          return fullContent.toJSON();
        }, sha1, selector);

        return throughJson(5).then(function (summary) {
          var diff = summary.toDifference();
          utils.assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
        });
      });
    });
  });
})();
