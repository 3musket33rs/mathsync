(function () {
  'use strict';

  var utils = require('./utils');

  var emptyContent = require('../src/fullContent');

  describe('Full content', function() {
    describe('empty', function() {
      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(emptyContent.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(emptyContent.toJSON().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(emptyContent.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(emptyContent.toJSON().removed, []);
      });
    });
    describe('with one added item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.plus(item);

      it('has one added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, [item]);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().added, [item]);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().removed, []);
      });
    });
    describe('with one removed item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.minus(emptyContent.plus(item));

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().added, []);
      });
      it('has one removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, [item]);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().removed, [item]);
      });
    });
    describe('with added then removed item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.plus(item).minus(emptyContent.plus(item));

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().removed, []);
      });
    });
    describe('with removed then added item', function() {
      var item = new Int8Array([5]).buffer;
      var oneItem = emptyContent.minus(emptyContent.plus(item)).plus(item);

      it('has no added element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().added, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().added, []);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(oneItem.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(oneItem.toJSON().removed, []);
      });
    });
    describe('with async added items', function() {
      var asyncAdded;
      var item1 = new Int8Array([5]).buffer;
      var item2 = new Int8Array([6]).buffer;

      function* generateItems() {
        yield item1;
        yield item2;
      }

      before(function (done) {
        emptyContent.plusAsync(generateItems()).then(function (c) {
          asyncAdded = c;
        }).then(done, done);
      });

      it('has two added elements', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().added, [item1, item2]);
        utils.assertThatSetOfArrayEquals(asyncAdded.toJSON().added, [item1, item2]);
      });
      it('has no removed element', function() {
        utils.assertThatSetOfArrayEquals(asyncAdded.toDifference().removed, []);
        utils.assertThatSetOfArrayEquals(asyncAdded.toJSON().removed, []);
      });
    });
  });
})();
