(function () {
  'use strict';

  var q = require('q');

  function copyArray(array) {
    var copy = [];
    for (var i = 0; i < array.length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function insertOrRemove(mayInsert, mayRemove, item) {
    var i, d;
    for (i = 0; i < mayRemove.length; i++) {
      if (byteArrayComparator(mayRemove[i], item) === 0) {
        mayRemove.splice(i, 1);
        return;
      }
    }
    for (i = 0; i < mayInsert.length; i++) {
      d = byteArrayComparator(mayRemove[i], item);
      if (d === 0) {
        return;
      } else if (d > 0) {
        break;
      }
    }
    mayInsert.splice(i, 0, item);
  }

  function byteArrayComparator(a, b) {
    var aview = new Int8Array(a);
    var bview = new Int8Array(b);
    var l = Math.min(aview.length, bview.length);
    var d;
    for (var i = 0; i < l; i++) {
      d = aview[i] - bview[i];
      if (d !== 0) {
        return d;
      }
    }
    return aview.length - bview.length;
  }

  function fullContent(added, removed) {

    function plus(item) {
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      insertOrRemove(addedCopy, removedCopy, item);
      return fullContent(addedCopy, removedCopy);
    }

    function minus(summary) {
      var diff = summary.toDifference();
      if (diff === null) {
        throw new Error('Cannot substract a summary which cannot be resolved as a difference: ' + summary);
      }
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      diff.added.forEach(function (a) {
        insertOrRemove(removedCopy, addedCopy, a);
      });
      diff.removed.forEach(function (r) {
        insertOrRemove(addedCopy, removedCopy, r);
      });
      return fullContent(addedCopy, removedCopy);
    }

    function plusAsync(iterator) {
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      function next() {
        var result = iterator.next();
        if (result.done) {
          return fullContent(addedCopy, removedCopy);
        } else if (q.isPromiseAlike(result.value)) {
          return result.value.then(function (res) {
            insertOrRemove(addedCopy, removedCopy, res);
          }).then(next);
        } else {
          insertOrRemove(addedCopy, removedCopy, result.value);
          return next();
        }
      }
      return q().then(next);
    }

    function toDifference() {
      return { added: added, removed: removed };
    }

    return {
      plus: plus,
      plusAsync: plusAsync,
      minus: minus,
      toDifference: toDifference,
      toJSON: toDifference
    };
  }

  module.exports = fullContent([], []);
})();
