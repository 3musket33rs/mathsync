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

  function bucketsOfSize(size) {
    var buckets = [];
    for (var i = 0; i < size; i++) {
      buckets.push(emptyBucket);
    }
    return buckets;
  }

  function ibf(size, digest, selector) {
    return ibfFromBuckets(bucketsOfSize(size), digest, selector);
  }

  function ibfFromBuckets(buckets, digest, selector) {

    function toJSON() {
      var json = [];
      buckets.forEach(function (bucket) {
        json.push(bucket.toJSON());
      });
      return json;
    }

    function modify(variation, content) {
      var digested = digest(content);
      var selected = selector(content);
      var bucketsCopy = arrayCopy(buckets, buckets.length);
      for (var i = 0; i < selected.length; i++) {
        var b = selected[i] % buckets.length;
        bucketsCopy[b] = bucketsCopy[b].modify(variation, content, digested);
      }
      return ibfFromBuckets(bucketsCopy, digest, selector);
    }

    function plus(content) {
      return modify(1, content);
    }

    function toDifference() {
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
      return ibfFromBuckets(b, digest, selector);
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
      return ibfFromBuckets(updated, digest, selector);
    }

    var that = {
      __buckets : buckets,
      __modify : modify,
      __isEmpty : isEmpty,
      _substract : substract,
      toDifference : toDifference,
      plus : plus,
      _reduce : reduce,
      toJSON : toJSON
    };

    return that;
  }

  function fromJSON(json, digest, selector) {
    var buckets = [];
    json.forEach(function (bucket) {
      buckets.push(emptyBucket.fromJSON(bucket));
    });
    return ibfFromBuckets(buckets, digest, selector);
  }
  ibf.fromJSON = fromJSON;
  
  module.exports = ibf;
})();
