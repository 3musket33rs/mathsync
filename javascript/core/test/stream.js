/* global describe, it */
'use strict';

var stream = require('../stream');

var assertSetEquals = require('./utils').assertSetEquals;
var assertSummaryContains = require('./utils').assertSummaryContains;

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

describe('Stream', function() {

  describe('summarizer', function() {

    it('emits summary with items', function() {
      var summarizer = stream.newSummarizer(function () {
        return new ArrayStream([
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 5, to: 6 }
          ]);
      }, function (item) {
        return new Int32Array([item.from, item.to]).buffer;
      });

      return summarizer(2).then(assertSummaryContains.bind(null, [
          new Int32Array([1, 2]).buffer,
          new Int32Array([2, 3]).buffer,
          new Int32Array([3, 4]).buffer,
          new Int32Array([4, 5]).buffer,
          new Int32Array([5, 6]).buffer
        ]));
    });
  });

  describe('resolver', function() {

    it('generates difference', function() {
      function serialize(item) {
        return new Int32Array([item.from, item.to]).buffer;
      }

      function deserialize(buffer) {
        var arr = new Int32Array(buffer);
        return { from: arr[0], to: arr[1] };
      }

      var summarizer = stream.newSummarizer(function () {
        return new ArrayStream([
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 5, to: 6 },
            { from: 6, to: 7 },
            { from: 7, to: 8 }
          ]);
      }, serialize);

      var resolve = stream.newResolver(function () {
        return new ArrayStream([
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 5, to: 6 }
          ]);
      }, summarizer, serialize, deserialize);

      return resolve().then(function (diff) {
        assertSetEquals(diff.added, [{ from: 6, to: 7 }, { from: 7, to: 8 }]);
        assertSetEquals(diff.removed, [{ from: 1, to: 2 }, { from: 2, to: 3 }]);
      });
    });
  });
});
