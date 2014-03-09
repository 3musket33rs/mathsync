(function () {
  'use strict';

  var Promise = require('./promise');
  var arrayBufferSerialization = require('./arrayBufferSerialization');

  function copyArray(array) {
    var copy = [];
    for (var i = 0; i < array.length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function serializeItems(array) {
    var serialized = [];
    array.forEach(function (item) {
      serialized.push(arrayBufferSerialization.toString(item));
    });
    return serialized;
  }

  function insert(into, item) {
    var
      i,
      d;
    for (i = 0; i < into.length; i++) {
      d = byteArrayComparator(into[i], item);
      if (d === 0) {
        return;
      } else if (d > 0) {
        break;
      }
    }
    into.splice(i, 0, item);
  }

  function insertOrRemove(mayInsert, mayRemove, item) {
    for (var i = 0; i < mayRemove.length; i++) {
      if (byteArrayComparator(mayRemove[i], item) === 0) {
        mayRemove.splice(i, 1);
        return;
      }
    }
    insert(mayInsert, item);
  }

  function insertOrRemoveMany(mayInsert, mayRemove, items) {
    function next(resolve, reject) {
      var result = items.next();
      if (result.done) {
        resolve();
      } else if (typeof result.value.then === 'function') {
        return result.value.then(function (res) {
          insertOrRemove(mayInsert, mayRemove, res);
        }).then(next.bind(null, resolve, reject));
      } else {
        insertOrRemove(mayInsert, mayRemove, result.value);
        return next(resolve,reject);
      }
    }

    return new Promise(next);
  }

  function byteArrayComparator(a, b) {
    var
      al = a.byteLength,
      bl = b.byteLength,
      aview,
      bview,
      d,
      i;
    if (al !== bl) {
      return al - bl;
    }
    aview = new Int8Array(a);
    bview = new Int8Array(b);
    for (i = 0; i < al; i++) {
      d = aview[i] - bview[i];
      if (d !== 0) {
        return d;
      }
    }
    return 0;
  }

  function fullContent(added, removed) {

    function plus(item) {
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      insertOrRemove(addedCopy, removedCopy, item);
      return fullContent(addedCopy, removedCopy);
    }

    function plusIterator(iterator) {
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      return insertOrRemoveMany(addedCopy, removedCopy, iterator).then(function () {
        return fullContent(addedCopy, removedCopy);
      });
    }

    function minus(item) {
      // Backward compatibility with deprecated API
      if (!(item instanceof ArrayBuffer)) {
        return minusSummary(item);
      }

      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      insertOrRemove(removedCopy, addedCopy, item);
      return fullContent(addedCopy, removedCopy);
    }

    function minusIterator(iterator) {
      var addedCopy = copyArray(added);
      var removedCopy = copyArray(removed);
      return insertOrRemoveMany(removedCopy, addedCopy, iterator).then(function () {
        return fullContent(addedCopy, removedCopy);
      });
    }

    function minusSummary(summary) {
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

    function toDifference() {
      return { added: added, removed: removed };
    }

    function toJSON() {
      return { added: serializeItems(added), removed: serializeItems(removed) };
    }

    return {
      plus: plus,
      plusIterator: plusIterator,
      minus: minus,
      minusIterator: minusIterator,
      toDifference: toDifference,
      toJSON: toJSON
    };
  }

  function fromJSON(json) {
    var added = [];
    var removed = [];
    json.added.forEach(function (a) {
      insert(added, arrayBufferSerialization.fromString(a));
    });
    json.removed.forEach(function (r) {
      insert(removed, arrayBufferSerialization.fromString(r));
    });
    return fullContent(added, removed);
  }

  var emptyContent = fullContent([], []);
  emptyContent.fromJSON = fromJSON;

  module.exports = emptyContent;
})();
