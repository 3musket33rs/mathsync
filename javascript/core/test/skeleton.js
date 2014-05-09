(function () {
  /* global describe, it */
  'use strict';

  var ibf = require('../src/ibf');
  var sha1 = require('../src/sha1');
  var defaultSelector = require('../src/bucketSelector').padAndHash(sha1, 3);

  var assert = require('assert');
  var skeleton = require('../src/skeleton');
  var assertSetEquals = require('./utils').assertSetEquals;

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

    describe('default resolver', function() {

      it('iterates on sizes until difference is not null', function() {
        var called = [];
        var resolve = skeleton.newResolver(function (item, done) {
          item({ from: 1, to: 2 });
          item({ from: 2, to: 3 });
          item({ from: 3, to: 4 });
          item({ from: 4, to: 5 });
          item({ from: 5, to: 6 });
          done();
        }, function (level) {
          called.push(level);
          return ibf(level + 1, sha1, defaultSelector).plusMany(function (item, done) {
            item(new Int32Array([3, 4]).buffer);
            item(new Int32Array([4, 5]).buffer);
            item(new Int32Array([5, 6]).buffer);
            item(new Int32Array([6, 7]).buffer);
            item(new Int32Array([7, 8]).buffer);
            done();
          });
        }, function (item) {
          return new Int32Array([item.from, item.to]).buffer;
        }, function (buffer) {
          var arr = new Int32Array(buffer);
          return { from: arr[0], to: arr[1] };
        });

        return resolve().then(function () {
          // ibf size = level so it had to iterate until having at least the number of differences to decipher
          assert.ok(called.length > 4);
          assert.equal(0, called[0]);
          assert.equal(1, called[1]);
          assert.equal(2, called[2]);
          assert.equal(3, called[3]);
          assert.equal(4, called[4]);
        });
      });

      it('deserialize difference', function() {
        var called = [];
        var resolve = skeleton.newResolver(function (item, done) {
          item({ from: 1, to: 2 });
          item({ from: 2, to: 3 });
          item({ from: 3, to: 4 });
          item({ from: 4, to: 5 });
          item({ from: 5, to: 6 });
          done();
        }, function (level) {
          called.push(level);
          return ibf(level + 1, sha1, defaultSelector).plusMany(function (item, done) {
            item(new Int32Array([3, 4]).buffer);
            item(new Int32Array([4, 5]).buffer);
            item(new Int32Array([5, 6]).buffer);
            item(new Int32Array([6, 7]).buffer);
            item(new Int32Array([7, 8]).buffer);
            done();
          });
        }, function (item) {
          return new Int32Array([item.from, item.to]).buffer;
        }, function (buffer) {
          var arr = new Int32Array(buffer);
          return { from: arr[0], to: arr[1] };
        });

        return resolve().then(function (diff) {
          assertSetEquals(diff.added, [{ from: 6, to: 7 }, { from: 7, to: 8 }]);
          assertSetEquals(diff.removed, [{ from: 1, to: 2 }, { from: 2, to: 3 }]);
        });
      });
    });
  });
})();
