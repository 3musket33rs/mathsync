(function () {
  'use strict';

  var emptyBucket = require('./bucket');
  var q = require('q');

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

    function copyBuckets() {
      var copy = [];
      for (var i = 0; i < buckets.length; i++) {
        copy.push(buckets[i]);
      }
      return copy;
    }

    function modifyWithSideEffect(bucketsCopy, variation, content) {
      var digested = digest(content);
      var selected = selector(content);
      for (var i = 0; i < selected.length; i++) {
        var b = selected[i] % buckets.length;
        bucketsCopy[b] = bucketsCopy[b].modify(variation, content, digested);
      }
    }

    function plus(content) {
      if (!(content instanceof ArrayBuffer)) {
        throw new TypeError('Ibf#plus takes an ArrayBuffer, given ' + content);
      }
      var bucketsCopy = copyBuckets();
      modifyWithSideEffect(bucketsCopy, 1, content);
      return ibfFromBuckets(bucketsCopy, digest, selector);
    }

    function plusAsync(iterator) {
      var bucketsCopy = copyBuckets();
      function next() {
        var result = iterator.next();
        if (result.done) {
          return ibfFromBuckets(bucketsCopy, digest, selector);
        } else if (q.isPromiseAlike(result.value)) {
          return result.value.then(function (res) {
            modifyWithSideEffect(bucketsCopy, 1, res);
          }).then(next);
        } else {
          modifyWithSideEffect(bucketsCopy, 1, result.value);
          return next();
        }
      }
      return q().then(next);
    }

    function toDifference() {
      var bucketsCopy = copyBuckets();
      var l = bucketsCopy.length;

      var added = [];
      var removed = [];

      // Search for unary buckets until there is nothing to do
      var i, items, b, verified, found = true;
      while (found) {
        found = false;
        for (i = 0; i < l; i++) {
          b = bucketsCopy[i];
          items = b.items();
          if (items === 1 || items === -1) {
            verified = verify(b);
            if (verified !== null) {
              switch (items) {
              case 1:
                added.push(verified);
                break;
              case -1:
                removed.push(verified);
                break;
              }
              modifyWithSideEffect(bucketsCopy, -items, verified);
              found = true;
            }
          }
        }
      }

      // If some buckets are not empty, there was not enough information to deserialize
      for (i = 0; i < l; i++) {
        if (!bucketsCopy[i].isEmpty()) {
          return null;
        }
      }
      return { added: added, removed: removed };
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

    function minus(other) {
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
      minus : minus,
      toDifference : toDifference,
      plus : plus,
      plusAsync : plusAsync,
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
