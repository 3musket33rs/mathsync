(function () {
  'use strict';

  var assert = require('assert');
  var iterator = require('../src/iterator');
  var q = require('q');

  describe('Iterator utilities', function() {
    describe('fromArray', function() {
      it('yields all items of the array and then stops', function() {
        var i = iterator.fromArray(['a', 'b', 'c']);
        assert.deepEqual({ done: false, value: 'a' }, i.next());
        assert.deepEqual({ done: false, value: 'b' }, i.next());
        assert.deepEqual({ done: false, value: 'c' }, i.next());
        assert.deepEqual({ done: true, value: undefined }, i.next());
        assert.deepEqual({ done: true, value: undefined }, i.next());
      });
      it('handles items added to the array', function() {
        var a = ['a', 'b'];
        var i = iterator.fromArray(a);
        assert.deepEqual({ done: false, value: 'a' }, i.next());
        assert.deepEqual({ done: false, value: 'b' }, i.next());
        a.push('c');
        assert.deepEqual({ done: false, value: 'c' }, i.next());
      });
      it('handles items removed from the array', function() {
        var a = ['a', 'b', 'c'];
        var i = iterator.fromArray(a);
        assert.deepEqual({ done: false, value: 'a' }, i.next());
        assert.deepEqual({ done: false, value: 'b' }, i.next());
        a.splice(2, 1);
        assert.deepEqual({ done: true, value: undefined }, i.next());
      });
    });
    describe('map', function() {
      it('transforms all items of the upstream iterator', function() {
        var upstream = iterator.fromArray([1, 2, 3]);
        function square(i) {
          return i * i;
        }
        var i = iterator.map(upstream, square);
        assert.deepEqual({ done: false, value: 1 }, i.next());
        assert.deepEqual({ done: false, value: 4 }, i.next());
        assert.deepEqual({ done: false, value: 9 }, i.next());
        assert.deepEqual({ done: true, value: undefined }, i.next());
        assert.deepEqual({ done: true, value: undefined }, i.next());
      });
      it('transforms promises from upstream', function(done) {
        var upstream = iterator.fromArray([q(1), q(2), q(3)]);
        function square(i) {
          return i * i;
        }
        var i = iterator.map(upstream, square);
        i.next().value.then(function (value) {
          assert.equal(1, value);
          return i.next().value;
        }).then(function (value) {
          assert.equal(4, value);
          return i.next().value;
        }).then(function (value) {
          assert.equal(9, value);
          assert.ok(i.next().done);
        }).then(done, done);
      });
    });
  });
})();
