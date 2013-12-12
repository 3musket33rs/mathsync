(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var summarizer = require('../src/summarizer');
  var sha1 = require('../src/sha1');

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
  }

  describe('Summarizer', function() {
    describe('fromItems', function() {
      it('generate summary with serialized yielded items', function(done) {
        function* generator() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }
        function serialize(value) {
          return value;
        }
        summarizer.fromItems(generator, serialize, sha1, 4)(3).then(function (summary) {
          var diff = summary._asDifference();
          assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
          done();
        }, function (err) {
          done(err);
        });
      });
    });

    describe('fromJson', function() {
      it('generate summary with identical content', function(done) {
        function* generator() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }
        function serialize(value) {
          return value;
        }

        var original = summarizer.fromItems(generator, serialize, sha1, 4);
        var throughJson = summarizer.fromJson(function (level) {
          return original(level).then(function (summary) {
            return summary.toJson();
          });
        }, sha1, 4);

        throughJson(3).then(function (summary) {
          var diff = summary._asDifference();
          assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
          assert.equal(0, diff.removed.length);
          done();
        }, function (err) {
          done(err);
        });
      });
    });

    describe('fromLarge', function() {
      it('generate summary with identical content', function(done) {
        function* generator() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }
        function serialize(value) {
          return value;
        }

        var large = summarizer.fromItems(generator, serialize, sha1, 4)(10);
        var throughLarge = summarizer.fromLarge(function () {
          return large;
        }, sha1, 4);

        throughLarge(3).then(function (summary) {
          var diff = summary._asDifference();
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
