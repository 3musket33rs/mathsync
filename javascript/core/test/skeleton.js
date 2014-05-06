(function () {
  /* global describe, it */
  'use strict';

  var assert = require('assert');
  var skeleton = require('../src/skeleton');

  function assertIsIbfOfSize(size, summary) {
    assert.equal(size, summary.toJSON().length);
    return summary;
  }

  function assertIsFullContent(summary) {
    assert.ok(!!summary.toJSON().added);
    assert.ok(!!summary.toJSON().removed);
    return summary;
  }

  function assertContainsExactly(items, summary) {
    return summary.minusMany(function (item, done) {
      items.forEach(item);
      done();
    }).then(function (emptied) {
      var diff = emptied.toDifference();
      assert.equal(0, diff.added.length);
      assert.equal(0, diff.removed.length);
      return summary;
    });
  }

  describe('Skeleton', function() {

    describe('default summarizer', function() {

      it('generate ibf of exponential size with items', function() {
        var summarizer = skeleton.newSummarizer(function (item, done) {
          item({ from: 1, to: 2 });
          item({ from: 2, to: 3 });
          item({ from: 3, to: 4 });
          item({ from: 4, to: 5 });
          item({ from: 5, to: 6 });
          done();
        }, function (item) {
          return new Int32Array([item.from, item.to]).buffer;
        });

        return summarizer(2)
          .then(assertIsIbfOfSize.bind(null, 4))
          .then(assertContainsExactly.bind(null, [
            new Int32Array([1, 2]).buffer,
            new Int32Array([2, 3]).buffer,
            new Int32Array([3, 4]).buffer,
            new Int32Array([4, 5]).buffer,
            new Int32Array([5, 6]).buffer
          ]));
      });

      it('generate full content for large summaries', function() {
        var summarizer = skeleton.newSummarizer(function (item, done) {
          item({ from: 1, to: 2 });
          item({ from: 2, to: 3 });
          done();
        }, function (item) {
          return new Int32Array([item.from, item.to]).buffer;
        });

        return summarizer(4)
          .then(assertIsFullContent)
          .then(assertContainsExactly.bind(null, [
            new Int32Array([1, 2]).buffer,
            new Int32Array([2, 3]).buffer
          ]));
      });
    });
  });
})();
