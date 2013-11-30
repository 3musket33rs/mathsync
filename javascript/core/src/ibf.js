(function () {
  'use strict';

  var emptyBucket = require('./bucket');

  function arrayCopy(array, length) {
    var copy = [];
    for (var i = 0; i < length; i++) {
      copy.push(array[i]);
    }
    return copy;
  }

  function arraysEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  function intFromDigestedBytes(digested) {
    return (digested[0] << 24) | (digested[1] << 16) | (digested[2] << 8) | (digested[3]);
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

    function toJson() {
      var json = [];
      buckets.forEach(function (bucket) {
        json.push(bucket.toJson());
      });
      return json;
    }

    function modify(variation, content) {
      var bucketId;
      var bucketsCopy = arrayCopy(buckets, buckets.length);

      var digested = digest(content);

      var contentCopy = arrayCopy(content, content.length);
      contentCopy.push(0);

      for (var i = 0; i < spread; i++) {
        contentCopy[contentCopy.length - 1] = i;
        bucketId = intFromDigestedBytes(digest(contentCopy)) % buckets.length;
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

    function verify(bucket) {
      var content = bucket.xored();
      while (true) {
        if (arraysEqual(digest(content), bucket.hashed())) {
          return content;
        }
        if (content.length > 0 && content[content.length - 1] === 0) {
          content = arrayCopy(content, content.length - 1);
        } else {
          return null;
        }
      }
    }

    function isEmpty() {
      for (var i = 0; i < buckets.length; i++) {
        if (buckets[i].items() !== 0) {
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
      toJson : toJson,
      substract : substract,
      asDifference : asDifference,
      addItem : addItem
    };

    return that;
  }

  function fromJson(json, digest, spread) {
    var buckets = [];
    json.forEach(function (bucket) {
      buckets.push(emptyBucket.fromJson(bucket));
    });
    return ibfFromBuckets(buckets, digest, spread);
  }
  ibf.fromJson = fromJson;

  module.exports = ibf;
})();
