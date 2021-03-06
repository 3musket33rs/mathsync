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

function insert(into, item) {
  var i, d;
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

function insertOrRemoveMany(mayInsert, mayRemove, updater) {
  return new Promise(function (resolve, reject) {
    var isClosed = false;
    function item(i) {
      if (!isClosed) {
        insertOrRemove(mayInsert, mayRemove, i);
      }
    }
    function done() {
      isClosed = true;
      resolve();
    }
    updater(item, done, reject);
  });
}

function fullContent(added, removed) {

  function plus(item) {
    var addedCopy = copyArray(added);
    var removedCopy = copyArray(removed);
    insertOrRemove(addedCopy, removedCopy, item);
    return fullContent(addedCopy, removedCopy);
  }

  function plusMany(updater) {
    var addedCopy = copyArray(added);
    var removedCopy = copyArray(removed);
    return insertOrRemoveMany(addedCopy, removedCopy, updater).then(function () {
      return fullContent(addedCopy, removedCopy);
    });
  }

  function minus(item) {
    var addedCopy = copyArray(added);
    var removedCopy = copyArray(removed);
    insertOrRemove(removedCopy, addedCopy, item);
    return fullContent(addedCopy, removedCopy);
  }

  function minusMany(updater) {
    var addedCopy = copyArray(added);
    var removedCopy = copyArray(removed);
    return insertOrRemoveMany(removedCopy, addedCopy, updater).then(function () {
      return fullContent(addedCopy, removedCopy);
    });
  }

  function toDifference() {
    return { added: added, removed: removed };
  }

  function toJSON() {
    return { added: serializeItems(added), removed: serializeItems(removed) };
  }

  return {
    plus: plus,
    plusMany: plusMany,
    minus: minus,
    minusMany: minusMany,
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
