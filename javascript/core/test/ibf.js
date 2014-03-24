(function () {
  'use strict';

  var assert = require('assert');
  var ibf = require('../src/ibf');
  var utils = require('./utils');
  var Readable = require('stream').Readable;
  var util = require('util');

  var item1 = new Int8Array([5]).buffer;
  var item2 = new Int8Array([6]).buffer;
  var item3 = new Int8Array([7, 8, 9]).buffer;

  function selector(content) {
    if (utils.isEqual(content, item1)) {
      return [6, 3, 4];
    } else if (utils.isEqual(content, item2)) {
      return [2, 3, 4];
    }  else if (utils.isEqual(content, item3)) {
      return [0, 1, 2];
    }
  }

  function digester(content) {
    if (utils.isEqual(content, item1)) {
      return new Int8Array([4]).buffer;
    } else if (utils.isEqual(content, item2)) {
      return new Int8Array([8]).buffer;
    } else if (utils.isEqual(content, item3)) {
      return new Int8Array([12]).buffer;
    }
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

  function* generator1and2() {
    yield item1;
    yield item2;
  }

  function* generator2and3() {
    yield item2;
    yield item3;
  }

  var empty = ibf(5, digester, selector);
  var just1 = empty.plus(item1);
  var just2 = empty.plus(item2);
  var just3 = empty.plus(item3);
  var iterator1and2;
  var iterator2and3;
  var stream1and2;
  var stream2and3;

  before(function(done) {
    empty.plusIterator(generator1and2()).then(function (i1a2) {
      iterator1and2 = i1a2;
      return empty.plusIterator(generator2and3());
    }).then(function (i2a3) {
      iterator2and3 = i2a3;
      return empty.plusStream(new ArrayStream([item1, item2]));
    }).then(function (s1a2) {
      stream1and2 = s1a2;
      return empty.plusStream(new ArrayStream([item2, item3]));
    }).then(function (s2a3) {
      stream2and3 = s2a3;
    }).then(done, done);
  });

  function goThroughJson(origin) {
    return ibf.fromJSON(origin.toJSON(), digester, selector);
  }

  describe('Ibf', function() {
    describe('empty', function() {

      it('should lead to empty difference', function() {
        var difference = empty.toDifference();
        assert.deepEqual([], difference.added);
        assert.deepEqual([], difference.removed);
      });

      it('should lead to empty difference after json serialization', function() {
        var difference = goThroughJson(empty).toDifference();
        assert.deepEqual([], difference.added);
        assert.deepEqual([], difference.removed);
      });
    });

    describe('with added items', function() {

      it('should have added items in difference', function() {
        var difference = just1.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1]);
        assert.deepEqual([], difference.removed);

        difference = just2.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2]);
        assert.deepEqual([], difference.removed);

        difference = just3.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item3]);
        assert.deepEqual([], difference.removed);

        difference = iterator1and2.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);

        difference = iterator2and3.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2, item3]);
        assert.deepEqual([], difference.removed);

        difference = stream1and2.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);

        difference = stream2and3.toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2, item3]);
        assert.deepEqual([], difference.removed);
      });

      it('should have added item in difference after json serialization', function() {
        var difference = goThroughJson(just1).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(just2).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(just3).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item3]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(iterator1and2).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(iterator2and3).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2, item3]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(stream1and2).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(stream2and3).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item2, item3]);
        assert.deepEqual([], difference.removed);
      });
    });

    describe('with removed items', function() {

      it('should have removed items in difference', function(done) {
        var difference = empty.minus(item1).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item1]);

        difference = empty.minus(item2).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item2]);

        difference = empty.minus(item3).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item3]);

        empty.minusIterator(generator1and2()).then(function (r) {
          difference = r.toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
          return empty.minusIterator(generator2and3());
        }).then(function (r) {
          difference = r.toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item2, item3]);
          return empty.minusStream(new ArrayStream([item1, item2]));
        }).then(function (r) {
          difference = r.toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
          return empty.minusStream(new ArrayStream([item2, item3]));
        }).then(function (r) {
          difference = r.toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item2, item3]);
        }).then(done, done);
      });

      it('should have removed item in difference after json serialization', function(done) {
        var difference = goThroughJson(empty.minus(item1)).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item1]);

        difference = goThroughJson(empty.minus(item2)).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item2]);

        difference = goThroughJson(empty.minus(item3)).toDifference();
        assert.deepEqual([], difference.added);
        utils.assertThatSetOfArrayEquals(difference.removed, [item3]);

        empty.minusIterator(generator1and2()).then(function (r) {
          difference = goThroughJson(r).toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
          return empty.minusIterator(generator2and3());
        }).then(function (r) {
          difference = goThroughJson(r).toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item2, item3]);
          return empty.minusStream(new ArrayStream([item1, item2]));
        }).then(function (r) {
          difference = goThroughJson(r).toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
          return empty.minusStream(new ArrayStream([item2, item3]));
        }).then(function (r) {
          difference = goThroughJson(r).toDifference();
          assert.deepEqual([], difference.added);
          utils.assertThatSetOfArrayEquals(difference.removed, [item2, item3]);
        }).then(done, done);
      });
    });

    describe('with added and removed items', function() {

      it('should have added and removed items in difference', function() {
        var difference = just1.minus(item2).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1]);
        utils.assertThatSetOfArrayEquals(difference.removed, [item2]);
      });

      it('should resolve different item sizes in bucket', function() {
        var difference = just1.plus(item2).minus(item3).toDifference();
        utils.assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        utils.assertThatSetOfArrayEquals(difference.removed, [item3]);
      });

      it('should return null difference when unresolvable', function() {
        assert.equal(null, just1.plus(item1).toDifference());
      });
    });
  });
})();
