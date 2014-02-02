(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  global.Promise = require('q');
  var resolver = require('../src/resolver');
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

  describe('Resolver', function() {
    describe('fromSummarizers', function() {
      it('generate difference', function(done) {
        function serialize(value) {
          return new Int8Array(value).buffer;
        }
        function deserialize(value) {
          var view = new Int8Array(value);
          var res = [];
          for (var i = 0; i < view.length; i++) {
            res.push(view[i]);
          }
          return res;
        }

        function* localItems() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }
        var local = summarizer.fromItems(localItems, serialize, sha1, 4);

        function* remoteItems() {
          yield [1, 2];
          yield [4, 2];
        }
        var remote = summarizer.fromItems(remoteItems, serialize, sha1, 4);

        resolver.fromSummarizers(local, remote, deserialize)().then(function (difference) {
          assertThatSetOfArrayEquals(difference.added, [[4, 2]]);
          assertThatSetOfArrayEquals(difference.removed, [[2, 2], [3, 2]]);
          done();
        }, function (err) {
          done(err);
        });
      });
    });
  });
})();
