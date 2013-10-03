(function () {
  'use strict';

  var assert = require('assert');
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
    });
  });
})();
