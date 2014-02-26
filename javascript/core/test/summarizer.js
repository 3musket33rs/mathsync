(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var summarizer = require('../src/summarizer');
  var ibfBuilder = require('../src/ibf');
  var empty = require('../src/fullContent');
  var sha1 = require('../src/sha1');
  var utils = require('./utils');
  var selector = require('../src/bucketSelector').padAndHash(sha1, 3);

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return utils.isEqual(item1, item2);
      });
    }));
  }

  describe('Summarizer', function() {

    describe('fromItems', function() {
      it('generate summary with input items', function(done) {
        function serialize(value) {
          return new Int8Array(value).buffer;
        }
        var fromItems = summarizer.fromItems([[1, 2], [2, 2], [3, 2]], serialize, sha1, selector);

        fromItems(5).then(function (summary) {
          var diff = summary.toDifference();
          assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
          done();
        }, function (err) {
          done(err);
        });
      });
    });

    describe('fromJSON', function() {
      it('generate summary from IBF', function(done) {
        var ibf = ibfBuilder(32, sha1, selector)
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = summarizer.fromJSON(function (level) {
          assert.equal(5, level);
          return ibf.toJSON();
        }, sha1, selector);

        throughJson(5).then(function (summary) {
          var diff = summary.toDifference();
          assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
          done();
        }, function (err) {
          done(err);
        });
      });

      it('generate summary from full content', function(done) {
        var fullContent = empty
          .plus(new Int8Array([1, 2]).buffer)
          .plus(new Int8Array([2, 2]).buffer)
          .plus(new Int8Array([3, 2]).buffer);

        var throughJson = summarizer.fromJSON(function (level) {
          assert.equal(5, level);
          return fullContent.toJSON();
        }, sha1, selector);

        throughJson(5).then(function (summary) {
          var diff = summary.toDifference();
          assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
          done();
        }, function (err) {
          done(err);
        });
      });
    });
  });
})();
