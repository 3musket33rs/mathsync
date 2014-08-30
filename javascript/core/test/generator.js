/* global describe, it */
'use strict';

var generator = require('../generator');

var assertSetEquals = require('./utils').assertSetEquals;
var assertSummaryContains = require('./utils').assertSummaryContains;

describe('Generator', function() {

  describe('summarizer', function() {

    it('generates summary with items', function() {
      var summarizer = generator.newSummarizer(function* () {
        yield { from: 1, to: 2 };
        yield { from: 2, to: 3 };
        yield { from: 3, to: 4 };
        yield { from: 4, to: 5 };
        yield { from: 5, to: 6 };
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

      var summarizer = generator.newSummarizer(function* () {
        yield { from: 3, to: 4 };
        yield { from: 4, to: 5 };
        yield { from: 5, to: 6 };
        yield { from: 6, to: 7 };
        yield { from: 7, to: 8 };
      }, serialize);

      var resolve = generator.newResolver(function* () {
        yield { from: 1, to: 2 };
        yield { from: 2, to: 3 };
        yield { from: 3, to: 4 };
        yield { from: 4, to: 5 };
        yield { from: 5, to: 6 };
      }, summarizer, serialize, deserialize);

      return resolve().then(function (diff) {
        assertSetEquals(diff.added, [{ from: 6, to: 7 }, { from: 7, to: 8 }]);
        assertSetEquals(diff.removed, [{ from: 1, to: 2 }, { from: 2, to: 3 }]);
      });
    });
  });
});
