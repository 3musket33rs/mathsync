(function () {
  'use strict';

  var emptyBucket = require('./bucket');

  function arrayCopy(array) {
    var copy = [];
    for (var i = 0; i < array.length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function arraysEqual(a, b) {
    if (!a || !b) {
      return false;
    }
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    a = new Int8Array(a);
    b = new Int8Array(b);
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  function intFromDigestedBytes(digested) {
    return new DataView(digested).getInt32(0);
  }

  function bucketsOfSize(size) {
    var buckets = [];
    for (var i = 0; i < size; i++) {
      buckets.push(emptyBucket);
    }
    return buckets;
  }

  function ibf(size, digest, spread) {
    return ibfFromBuckets(bucketsOfSize(size), digest, spread);
  }

  function ibfFromBuckets(buckets, digest, spread) {

    function toJSON() {
      var json = [];
      buckets.forEach(function (bucket) {
        json.push(bucket.toJSON());
      });
      return json;
    }

    function modify(variation, content) {
      var bucketId;
      var bucketsCopy = arrayCopy(buckets, buckets.length);

      var digested = digest(content);

      var copy = new Int8Array(content.byteLength + 1);
      copy.set(new Int8Array(content));
      for (var i = 0; i < spread; i++) {
        copy[copy.length - 1] = i;

        bucketId = intFromDigestedBytes(digest(copy.buffer)) % buckets.length;
        if (bucketId < 0) {
          bucketId += buckets.length;
        }
        bucketsCopy[bucketId] = bucketsCopy[bucketId].modify(variation, content, digested);
      }

      return ibfFromBuckets(bucketsCopy, digest, spread);
    }

    function addItem(content) {
      return modify(1, content);
    }

    function asDifference() {
      var added = [];
      var removed = [];

      var previous = that;
      var next = that;
      while (next !== null) {
        previous = next;
        next = performNextOperation(previous, added, removed);
      }

      if (previous.__isEmpty()) {
        return { added: added, removed: removed };
      } else {
        return null;
      }
    }

    function performNextOperation(filtered, added, removed) {
      var buckets = filtered.__buckets;
      var bucket;
      var items;
      var verified;
      for (var i = 0; i < buckets.length; i++) {
        bucket = buckets[i];
        items = bucket.items();
        if (items === 1 || items === -1) {
          verified = verify(bucket);
          if (verified !== null) {
            switch (items) {
            case 1:
              added.push(verified);
              break;
            case -1:
              removed.push(verified);
              break;
            }
            return filtered.__modify(-items, verified);
          }
        }
      }
      return null;
    }

    function reduce(toSize) {
      var b = bucketsOfSize(toSize);
      for (var i = 0; i < buckets.length; i++) {
        b[i % toSize] = b[i % toSize].group(buckets[i]);
      }
      return ibfFromBuckets(b, digest, spread);
    }

    function verify(bucket) {
      var content = bucket.xored();
      var view = new Int8Array(content);
      var trim = 0;
      while (true) {
        if (arraysEqual(digest(content), bucket.hashed())) {
          return content;
        }
        if (view.length > trim && view[view.length - trim - 1] === 0) {
          content = content.slice(0, content.byteLength - 1);
        } else {
          return null;
        }
        trim++;
      }
    }

    function isEmpty() {
      for (var i = 0; i < buckets.length; i++) {
        if (!buckets[i].isEmpty()) {
          return false;
        }
      }
      return true;
    }

    function substract(other) {
      var updated = [];
      var otherBucket;
      for (var i = 0; i < buckets.length; i++) {
        otherBucket = other.__buckets[i];
        updated.push(buckets[i].modify(-otherBucket.items(), otherBucket.xored(), otherBucket.hashed()));
      }
      return ibfFromBuckets(updated, digest, spread);
    }

    var that = {
      __buckets : buckets,
      __modify : modify,
      __isEmpty : isEmpty,
      _substract : substract,
      _asDifference : asDifference,
      _addItem : addItem,
      _reduce : reduce,
      toJSON : toJSON
    };

    return that;
  }

  function fromJSON(json, digest, spread) {
    var buckets = [];
    json.forEach(function (bucket) {
      buckets.push(emptyBucket.fromJSON(bucket));
    });
    return ibfFromBuckets(buckets, digest, spread);
  }
  ibf.fromJSON = fromJSON;

  module.exports = ibf;
})();
