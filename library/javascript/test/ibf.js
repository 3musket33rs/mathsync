(function () {
  'use strict';

  var assert = require('assert');
  var _ = require('underscore');
  var ibf = require('../src/ibf');

  describe('IBF', function() {
    describe('jsonification', function() {
      it('should have lenght corresponding to its size', function() {
        assert.equal(5, ibf(5).toJson().length);
      });
      it('should have initialize buffers', function() {
        var i = ibf(3);
        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[0]);
        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[1]);
        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[2]);
      });
      it('should map item to corresponding buffers', function() {
        var i = ibf(5, 2, function (content) {
          if (_.isEqual(content, [ 3, 4, 0])) {
            return [ 2, 10 ];
          } else if (_.isEqual(content, [ 3, 4, 1])) {
            return [ 9, 11 ];
          } else if (_.isEqual(content, [ 3, 4 ])) {
            return [ 8, 9 ];
          }
        });
        i.addItem([ 3, 4 ]);

        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[0]);
        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[1]);
        assert.deepEqual({ items : 1, hashed : [ 8, 9], xored : [ 3, 4] }, i.toJson()[2]);
        assert.deepEqual({ items : 0, hashed : [], xored : [] }, i.toJson()[3]);
        assert.deepEqual({ items : 1, hashed : [ 8, 9], xored : [ 3, 4] }, i.toJson()[4]);
      });
    });
  });
})();
