(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var ibf = require('../src/ibf');

  var item1 = [5];
  var item2 = [6];
  var item3 = [7, 8, 9];
  var spread = 3;

  function digester(content) {
    if (_.isEqual(content, [5, 0])) {
      return [0, 0, 0, 1 ];
    } else if (_.isEqual(content, [5, 1])) {
      return [0, 0, 0, 3 ];
    } else if (_.isEqual(content, [5, 2])) {
      return [0, 0, 0, 4 ];
    } else if (_.isEqual(content, item1)) {
      return [4];
    }

    if (_.isEqual(content, [6, 0])) {
      return [0, 0, 0, 2 ];
    } else if (_.isEqual(content, [6, 1])) {
      return [0, 0, 0, 3 ];
    } else if (_.isEqual(content, [6, 2])) {
      return [0, 0, 0, 4 ];
    } else if (_.isEqual(content, item2)) {
      return [8];
    }

    if (_.isEqual(content, [7, 8, 9, 0])) {
      return [0, 0, 0, 0 ];
    } else if (_.isEqual(content, [7, 8, 9, 1])) {
      return [0, 0, 0, 1 ];
    } else if (_.isEqual(content, [7, 8, 9, 2])) {
      return [0, 0, 0, 2 ];
    } else if (_.isEqual(content, item3)) {
      return [12];
    }
  }

  var empty = ibf(5, digester, spread);
  var just1 = empty.addItem(item1);
  var just2 = empty.addItem(item2);
  var just3 = empty.addItem(item3);
  var items1and2 = just1.addItem(item2);

  function goThroughJson(origin) {
    return ibf.fromJson(origin.toJson(), digester, spread);
  }

  function assertThatSetOfArrayEquals(arr1, arr2) {
    assert.equal(arr1.lenght, arr2.lenght);
    assert.ok(_(arr1).every(function (item1) {
      return _(arr2).some(function (item2) {
        return _.isEqual(item1, item2);
      });
    }));
  }

  describe('Empty ibf', function() {

    it('should lead to empty difference', function() {
      var difference = empty.asDifference();
      assert.deepEqual([], difference.added);
      assert.deepEqual([], difference.removed);
    });

    it('should lead to empty difference after json serialization', function() {
      var difference = goThroughJson(empty).asDifference();
      assert.deepEqual([], difference.added);
      assert.deepEqual([], difference.removed);
    });
  });

  describe('Ibf with added items', function() {

    it('should have added items in difference', function() {
      var difference = just1.asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1]);
      assert.deepEqual([], difference.removed);

      difference = just2.asDifference();
      assertThatSetOfArrayEquals(difference.added, [item2]);
      assert.deepEqual([], difference.removed);

      difference = just3.asDifference();
      assertThatSetOfArrayEquals(difference.added, [item3]);
      assert.deepEqual([], difference.removed);

      difference = items1and2.asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1, item2]);
      assert.deepEqual([], difference.removed);
    });

    it('should have added item in difference after json serialization', function() {
      var difference = goThroughJson(just1).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1]);
      assert.deepEqual([], difference.removed);

      difference = goThroughJson(just2).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item2]);
      assert.deepEqual([], difference.removed);

      difference = goThroughJson(just3).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item3]);
      assert.deepEqual([], difference.removed);

      difference = goThroughJson(items1and2).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1, item2]);
      assert.deepEqual([], difference.removed);
    });
  });

  describe('Ibf with removed items', function() {

    it('should have removed items in difference', function() {
      var difference = empty.substract(just1).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item1]);

      difference = empty.substract(just2).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item2]);

      difference = empty.substract(just3).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item3]);

      difference = empty.substract(items1and2).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
    });

    it('should have removed item in difference after json serialization', function() {
      var difference = goThroughJson(empty.substract(just1)).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item1]);

      difference = goThroughJson(empty.substract(just2)).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item2]);

      difference = goThroughJson(empty.substract(just3)).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item3]);

      difference = goThroughJson(empty.substract(items1and2)).asDifference();
      assert.deepEqual([], difference.added);
      assertThatSetOfArrayEquals(difference.removed, [item1, item2]);
    });
  });

  describe('Ibf with added and removed items', function() {

    it('should have added and removed items in difference', function() {
      var difference = just1.substract(just2).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1]);
      assertThatSetOfArrayEquals(difference.removed, [item2]);
    });

    it('should resolve different item sizes in bucket', function() {
      var difference = just1.addItem(item2).substract(just3).asDifference();
      assertThatSetOfArrayEquals(difference.added, [item1, item2]);
      assertThatSetOfArrayEquals(difference.removed, [item3]);
    });

    it('should return null difference when unresolvable', function() {
      assert.equal(null, just1.addItem(item1).asDifference());
    });
  });
})();
