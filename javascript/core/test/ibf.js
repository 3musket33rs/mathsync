(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var ibf = require('../src/ibf');
  var utils = require('./utils_typedarrays');

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

  var empty = ibf(5, digester, selector);
  var just1 = empty.plus(item1);
  var just2 = empty.plus(item2);
  var just3 = empty.plus(item3);
  var items1and2 = just1.plus(item2);

  function goThroughJson(origin) {
    return ibf.fromJSON(origin.toJSON(), digester, selector);
  }

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
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
        assertThatSetOfArrayEquals(difference.added, [item1]);
        assert.deepEqual([], difference.removed);

        difference = just2.toDifference();
        assertThatSetOfArrayEquals(difference.added, [item2]);
        assert.deepEqual([], difference.removed);

        difference = just3.toDifference();
        assertThatSetOfArrayEquals(difference.added, [item3]);
        assert.deepEqual([], difference.removed);

        difference = items1and2.toDifference();
        assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);
      });

      it('should have added item in difference after json serialization', function() {
        var difference = goThroughJson(just1).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item1]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(just2).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item2]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(just3).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item3]);
        assert.deepEqual([], difference.removed);

        difference = goThroughJson(items1and2).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assert.deepEqual([], difference.removed);
      });
    });

    describe('with removed items', function() {

      it('should have removed items in difference', function() {
        var difference = empty._substract(just1).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item1]);

        difference = empty._substract(just2).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item2]);

        difference = empty._substract(just3).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item3]);

        difference = empty._substract(items1and2).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
      });

      it('should have removed item in difference after json serialization', function() {
        var difference = goThroughJson(empty._substract(just1)).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item1]);

        difference = goThroughJson(empty._substract(just2)).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item2]);

        difference = goThroughJson(empty._substract(just3)).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item3]);

        difference = goThroughJson(empty._substract(items1and2)).toDifference();
        assert.deepEqual([], difference.added);
        assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
      });
    });

    describe('with added and removed items', function() {

      it('should have added and removed items in difference', function() {
        var difference = just1._substract(just2).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item1]);
        assertThatSetOfArrayEquals(difference.removed, [item2]);
      });

      it('should resolve different item sizes in bucket', function() {
        var difference = just1.plus(item2)._substract(just3).toDifference();
        assertThatSetOfArrayEquals(difference.added, [item1, item2]);
        assertThatSetOfArrayEquals(difference.removed, [item3]);
      });

      it('should return null difference when unresolvable', function() {
        assert.equal(null, just1.plus(item1).toDifference());
      });
    });
  });
})();
