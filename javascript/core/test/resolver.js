(function () {
  /* global describe, it */
  'use strict';

  var resolver = require('../src/resolver');
  var array = require('../src/array');
  var sha1 = require('../src/sha1');
  var bucketSelector = require('../src/bucketSelector').padAndHash(sha1, 3);
  var assertThatSetOfArrayEquals = require('./utils').assertThatSetOfArrayEquals;

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

  describe('Resolver', function() {
    describe('fromItems', function () {
      it('generate difference', function () {
        var localItems = [[1, 2], [2, 2], [3, 2]];

        var remoteItems = [[1, 2], [4, 2]];
        var remote = array.newSummarizer(remoteItems, serialize, sha1, bucketSelector);

        return resolver.fromItems(localItems, remote, serialize, deserialize)().then(function (difference) {
          assertThatSetOfArrayEquals(difference.added, [[4, 2]]);
          assertThatSetOfArrayEquals(difference.removed, [[2, 2], [3, 2]]);
        });
      });
    });
    describe('fromGenerator', function () {
      it('generate difference', function () {
        function* local() {
          yield [1, 2];
          yield [2, 2];
          yield [3, 2];
        }

        var remoteItems = [[1, 2], [4, 2]];
        var remote = array.newSummarizer(remoteItems, serialize, sha1, bucketSelector);

        return resolver.fromGenerator(local, remote, serialize, deserialize)().then(function (difference) {
          assertThatSetOfArrayEquals(difference.added, [[4, 2]]);
          assertThatSetOfArrayEquals(difference.removed, [[2, 2], [3, 2]]);
        });
      });
    });
  });
})();
