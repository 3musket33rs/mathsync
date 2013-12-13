(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var summarizer = require('../src/summarizer');
  var sha1 = require('../src/sha1');
  var utils = require('./utils_typedarrays');

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return utils.isEqual(item1, item2);
      });
    }));
  }

  function testSummarizer(builder) {
    it('generate summary with input items', function(done) {
      function serialize(value) {
        return new Int8Array(value).buffer;
      }

      builder([[1, 2], [2, 2], [3, 2]], serialize)(5).then(function (summary) {
        var diff = summary._asDifference();
        assertThatSetOfArrayEquals(diff.added, [[1, 2], [2, 2], [3, 2]]);
        assert.equal(0, diff.removed.length);
        done();
      }, function (err) {
        done(err);
      });
    });
  }

  describe('Summarizer', function() {
    describe('fromItems', function() {
      testSummarizer(function (array, serialize) {
        return summarizer.fromItems(array, serialize, sha1, 4);
      });
    });

    describe('fromGenerator', function() {
      testSummarizer(function (array, serialize) {
        function* generator() {
          for (var i = 0; i < array.length; i++) {
            yield array[i];
          }
        }
        return summarizer.fromGenerator(generator, serialize, sha1, 4);
      });
    });

    describe('fromJSON', function() {
      testSummarizer(function (array, serialize) {
        var original = summarizer.fromItems(array, serialize, sha1, 4);
        var throughJson = summarizer.fromJSON(function (level) {
          return original(level).then(function (summary) {
            return summary.toJSON();
          });
        }, sha1, 4);
        return throughJson;
      });
    });

    describe('fromLarge', function() {
      testSummarizer(function (array, serialize) {
        var large = summarizer.fromItems(array, serialize, sha1, 4)(10);
        var throughLarge = summarizer.fromLarge(function () {
          return large;
        }, sha1, 4);
        return throughLarge;
      });
    });
  });
})();
