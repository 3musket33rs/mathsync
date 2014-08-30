'use strict';

/**
 * Node's readable stream.
 *
 * <p>Only to be used in object mode.</p>
 *
 * @class Readable
 * @external
 * @see {@link http://nodejs.org/api/stream.html#stream_class_stream_readable stream.Readable on Node.js}
 */
/**
 * Reads the next available item.
 *
 * <p>To be repeatedly called until it returns <code>null</code> after the stream emits <code>readable</code>.<p>
 *
 * @example
 * stream.on('readable', function() {
 *   var item;
 *   while (null !== (item = stream.read())) {
 *     // handle item
 *   }
 * });
 *
 * @name external:Readable#read
 * @function
 * @return {Object} next available item or <code>null</code> if no item is currently available.
 */
/**
 * Readable event.
 *
 * <p>Notifies the stream can be read again.</p>
 *
 * @example
 * stream.on('readable', function() {
 *   // use stream.read() until it returns null
 * });
 *
 * @event external:Readable#readable
 * @type {Object}
 */
/**
 * Error event.
 *
 * <p>Called if there is an error while reading data.</p>
 *
 * @example
 * stream.on('error', function(err) {
 *   console.error(err);
 * });
 *
 * @event external:Readable#error
 * @type {Error}
 */
/**
 * End event.
 *
 * <p>Called after all data has been read.</p>
 *
 * @example
 * stream.on('end', function(err) {
 *   console.log('done with my stream');
 * });
 *
 * @event external:Readable#end
 */

var skeleton = require('./skeleton');

function updaterFromStreamBuilder(streamProducer) {
  function updater(item, done, fail) {
    var stream = streamProducer();
    stream.on('readable', function() {
      var i;
      while (null !== (i = stream.read())) {
        item(i);
      }
    });
    stream.on('error', fail);
    stream.on('end', done);
  }

  return updater;
}

function newSummarizer(streamProducer, serialize, digest, selector) {
  return skeleton.newSummarizer(updaterFromStreamBuilder(streamProducer), serialize, digest, selector);
}

function newResolver(streamProducer, remote, serialize, deserialize) {
  return skeleton.newResolver(updaterFromStreamBuilder(streamProducer), remote, serialize, deserialize);
}

/**
 * Stream handling.
 *
 * @module mathsync/stream
 */
module.exports = {

  /**
   * Creates a new summarizer.
   *
   * @example <caption>Taking items from a {@link https://github.com/maxogden/level.js level.js} database</caption>
   * var levelup = require('levelup');
   * var leveljs = require('level-js');
   * var db = levelup(name, { db : leveljs });
   * function serialize(item) {
   *   // ...
   * }
   * var summarizer = require('mathsync/stream').newSummarizer(function () {
   *   return db.createReadStream();
   * }, serialize);
   *
   * @name module:mathsync/stream.newSummarizer
   * @function
   * @param {function} streamProducer - the no-arg function returning a fresh {@link external:Readable stream} emitting local items each time it is called.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
   * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
   */
  newSummarizer : newSummarizer,

  /**
   * Creates a new resolver.
   *
   *
   * @example <caption>Taking items from a {@link https://github.com/maxogden/level.js level.js} database</caption>
   * var remote = ...
   * var levelup = require('levelup');
   * var leveljs = require('level-js');
   * var db = levelup(name, { db : leveljs });
   * function serialize(item) {
   *   // ...
   * }
   * function deserialize(buffer) {
   *   // ...
   * }
   * var resolver = require('mathsync/stream').newResolver(function () {
   *   return db.createReadStream();
   * }, remote, serialize, deserialize);
   *
   * @name module:mathsync/stream.newResolver
   * @function
   * @param {function} streamProducer - the no-arg function returning a fresh {@link external:Readable stream} emitting local items each time it is called.
   * @param {Summarizer} remote - summarizer producing summaires of the remote side.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Serial~Deserialize} deserialize - the item deserializer.
   */
  newResolver : newResolver
};
