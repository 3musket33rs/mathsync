'use strict';

/**
 * RxJS Observable.
 *
 * @class Observable
 * @external
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md Rx.Observable}
 */
/**
 * Subscribes to the observable.
 *
 * @example
 * observable.subscribe(
 *     function (x) { console.log('New item', x); },
 *     function (err) { console.error(err); },
 *     function () { console.log('Completed'); }
 * );
 *
 * @name external:Observable#subscribe
 * @function
 * @param {Function} onNext - the callback called for each element in the sequence.
 * @param {Function} onError - the callback called upon exceptional termination of the sequence.
 * @param {Function} onNext - the callback called upon graceful termination of the sequence.
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md Rx.Observable.subscribe}
 */

var skeleton = require('./skeleton');

function updaterFromObservable(observable) {
  function updater(item, done, fail) {
    observable.subscribe(item, fail, done);
  }
  return updater;
}

function newSummarizer(observable, serialize, digest, selector) {
  return skeleton.newSummarizer(updaterFromObservable(observable), serialize, digest, selector);
}

function newResolver(observable, remote, serialize, deserialize) {
  return skeleton.newResolver(updaterFromObservable(observable), remote, serialize, deserialize);
}

/**
 * Observable handling.
 *
 * @module mathsync/observable
 */
module.exports = {

  /**
   * Creates a new summarizer.
   *
   * <p>Each summary creates a new subscription to the observable and drains it until it reports being completed.</p>
   *
   * @example <caption>Taking items from local storage</caption>
   * var local = Rx.Observable.create(function (observer) {
   *   for (var i = 0; i < localStorage.length; i++) {
   *     observer.onNext(JSON.parse(localStorage.getItem(key)));
   *   }
   *   observer.onCompleted();
   * }
   * function serialize(item) {
   *   // ...
   * }
   * var summarizer = require('mathsync/observable').newSummarizer(local, serialize);
   *
   * @name module:mathsync/observable.newSummarizer
   * @function
   * @param {external:Observable} observable - the observable to read local items from.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
   * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
   */
  newSummarizer : newSummarizer,

  /**
   * Creates a new resolver.
   *
   * <p>Each summary creates a new subscription to the observable and drains it until it reports being completed.</p>
   *
   * @example <caption>Taking items from local storage</caption>
   * var local = Rx.Observable.create(function (observer) {
   *   for (var i = 0; i < localStorage.length; i++) {
   *     observer.onNext(JSON.parse(localStorage.getItem(key)));
   *   }
   *   observer.onCompleted();
   * }
   * function serialize(item) {
   *   // ...
   * }
   * function deserialize(buffer) {
   *   // ...
   * }
   * var resolver = require('mathsync/observable').newResolver(local, remote, serialize, deserialize);
   *
   * @name module:mathsync/observable.newResolver
   * @function
   * @param {external:Observable} observable - the observable to read local items from.
   * @param {Summarizer} remote - summarizer producing summaires of the remote side.
   * @param {Serial~Serialize} serialize - the item serializer.
   * @param {Serial~Deserialize} deserialize - the item deserializer.
   */
  newResolver : newResolver
};
