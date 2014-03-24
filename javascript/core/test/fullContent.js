(function () {
  'use strict';

  var utils = require('./utils');
  var Readable = require('stream').Readable;
  var util = require('util');

  var emptyContent = require('../src/fullContent');

  function goThroughJson(origin) {
    return emptyContent.fromJSON(origin.toJSON());
  }

  function ArrayStream(items) {
    Readable.call(this, { objectMode: true });
    this._index = 0;
    this._items = items;
  }
  util.inherits(ArrayStream, Readable);
  ArrayStream.prototype._read = function() {
    if (this._index >= this._items.length) {
      this.push(null);
    } else {
      this.push(this._items[this._index]);
      this._index++;
    }
  };

  describe('Full content', function() {
    describe('empty', function() {
      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(emptyContent.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(emptyContent).toDifference().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(emptyContent.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(emptyContent).toDifference().removed, []);
      });
    });
    describe('with one added item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.plus(item);

      it('has one added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, [item]);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().added, [item]);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().removed, []);
      });
      it('does not accept duplicates', function() {
        var duplicated = oneItem.plus(item);
        utils.assertThatSetOfArrayEquals(duplicated.toDifference().added, [item]);
        utils.assertThatSetOfArrayEquals(goThroughJson(duplicated).toDifference().added, [item]);
      });
    });
    describe('with one removed item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.minus(item);

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().added, []);
      });
      it('has one removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, [item]);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().removed, [item]);
      });
      it('does not accept duplicates', function() {
        var duplicated = oneItem.minus(item);
        utils.assertThatSetOfArrayEquals(duplicated.toDifference().removed, [item]);
        utils.assertThatSetOfArrayEquals(goThroughJson(duplicated).toDifference().removed, [item]);
      });
    });
    describe('with added then removed item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.plus(item).minus(item);

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().removed, []);
      });
    });
    describe('with removed then added item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.minus(item).plus(item);

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(oneItem).toDifference().removed, []);
      });
    });
    describe('with added items through iterator', function() {
      var asyncAdded;
      var item1 = new Int8Array([5]).buffer;
      var item2 = new Int8Array([6]).buffer;

      function* generateItems() {
        yield item1;
        yield item2;
      }

      before(function (done) {
        emptyContent.plusIterator(generateItems()).then(function (c) {
          asyncAdded = c;
        }).then(done, done);
      });

      it('has two added elements', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().added, [item1, item2]);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncAdded).toDifference().added, [item1, item2]);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncAdded).toDifference().removed, []);
      });
    });
    describe('with added items through stream', function(done) {
      var asyncAdded;
      var item1 = new Int8Array([5]).buffer;
      var item2 = new Int8Array([6]).buffer;

      before(function (done) {
        emptyContent.plusStream(new ArrayStream([item1, item2])).then(function (c) {
          asyncAdded = c;
        }).then(done, done);
      });

      it('has two added elements', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().added, [item1, item2]);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncAdded).toDifference().added, [item1, item2]);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncAdded).toDifference().removed, []);
      });
    });
    describe('with removed items through iterator', function() {
      var asyncRemoved;
      var item1 = new Int8Array([5]).buffer;
      var item2 = new Int8Array([6]).buffer;

      function* generateItems() {
        yield item1;
        yield item2;
      }

      before(function (done) {
        emptyContent.minusIterator(generateItems()).then(function (c) {
          asyncRemoved = c;
        }).then(done, done);
      });

      it('has two removed elements', function() {
        utils.assertThatSetOfArrayEquals(asyncRemoved.toDifference().removed, [item1, item2]);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncRemoved).toDifference().removed, [item1, item2]);
      });
      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(asyncRemoved.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncRemoved).toDifference().added, []);
      });
    });
    describe('with removed items through stream', function() {
      var asyncRemoved;
      var item1 = new Int8Array([5]).buffer;
      var item2 = new Int8Array([6]).buffer;

      function* generateItems() {
        yield item1;
        yield item2;
      }

      before(function (done) {
        emptyContent.minusStream(new ArrayStream([item1, item2])).then(function (c) {
          asyncRemoved = c;
        }).then(done, done);
      });

      it('has two removed elements', function() {
        utils.assertThatSetOfArrayEquals(asyncRemoved.toDifference().removed, [item1, item2]);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncRemoved).toDifference().removed, [item1, item2]);
      });
      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(asyncRemoved.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(goThroughJson(asyncRemoved).toDifference().added, []);
      });
    });
  });
})();
