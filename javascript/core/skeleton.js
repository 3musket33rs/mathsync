'use strict';

var ibf = require('./lib/ibf');
var emptyFullContent = require('./lib/fullContent');
var sha1 = require('./lib/sha1');
var defaultSelector = require('./lib/bucketSelector').padAndHash(sha1, 3);

function levelToSize(level) {
  return Math.pow(2, level);
}

function newSummarizer(updater, serialize, digester, selector) {

  function generate(level) {
    var size = levelToSize(level);
    var empty = ibf(size, digester || sha1, selector || defaultSelector);
    var count = 0;
    return empty.plusMany(function (item, done, fail) {
      function counted(buffer) {
        count++;
        try {
          item(serialize(buffer));
        } catch (e) {
          fail(e);
        }
      }
      updater(counted, done, fail);
    }).then(function (filled) {
      if (size > count) {
        return emptyFullContent.plusMany(function (item, done, fail) {
          function serialized(buffer) {
            try {
              item(serialize(buffer));
            } catch (e) {
              fail(e);
            }
          }
          updater(serialized, done, fail);
        });
      } else {
        return filled;
      }
    });
  }

  return generate;
}

function newResolver(updater, remote, serialize, deserialize) {

  function fetchDifference(level) {
    return remote(level).then(function (summary) {
      return summary.minusMany(function (item, done, fail) {
        function serialized(buffer) {
          item(serialize(buffer));
        }
        updater(serialized, done, fail);
      });
    }).then(function (summary) {
      return summary.toDifference();
    }).then(function (diff) {
      if (diff === null) {
        return fetchDifference(level + 1);
      } else {
        return diff;
      }
    });
  }

  function deserializeDifference(difference) {
    var deserialized = { added : [], removed : [] };
    var i;
    for (i = 0; i < difference.added.length; i++) {
      deserialized.added.push(deserialize(difference.added[i]));
    }
    for (i = 0; i < difference.removed.length; i++) {
      deserialized.removed.push(deserialize(difference.removed[i]));
    }
    return deserialized;
  }

  function resolve() {
    return fetchDifference(0).then(deserializeDifference);
  }

  return resolve;
}

/**
 * Skeleton summarizer/resolver implementation.
 *
 * @module mathsync/skeleton
 */
module.exports = {

  /**
   * Creates a new summarizer.
   *
   * <p>The summarizer first counts the items as it builds an IBF, and then if the IBF is larger than the total number
   * of items restart building a full content summary. This prevents infinite loops over the level in case of issue,
   * like the same item added twice.</p>
   *
   * @example <caption>Items from an array.</caption>
   * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
   * function updater(item, done) {
   *   items.forEach(item);
   *   done();
   * }
   * function serialize(item) {
   *   return new Int32Array([item.from, item.to]).buffer;
   * }
   * var summarizer = require('mathsync/skeleton').newSummarizer(updater, serialize);
   *
   * @function
   * @param {Summary~SummaryBatchUpdater} updater - the updater giving local items.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
   * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
   */
  newSummarizer : newSummarizer,

  /**
   * Creates a new resolver.
   *
   * @example <caption>Items from an array.</caption>
   * var remote = ...
   * var items = [{ from: 1, to: 2 }, { from: 2, to: 5}];
   * function updater(item, done) {
   *   items.forEach(item);
   *   done();
   * }
   * function serialize(item) {
   *   return new Int32Array([item.from, item.to]).buffer;
   * }
   * function deserialize(buffer) {
   *   var arr = new Int32Array(buffer);
   *   return { from: arr[0], to: arr[1] };
   * }
   * var resolver = require('mathsync/skeleton').newResolver(updater, remote, serialize, deserialize);
   *
   * @function
   * @param {Summary~SummaryBatchUpdater} updater - the updater giving local items.
   * @param {Summarizer} remote - summarizer producing summaires of the remote side.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Serial~Deserialize} deserialize - the item deserializer.
   */
  newResolver : newResolver,

  defaults : {
    digester : sha1,
    selector : defaultSelector
  }
};
