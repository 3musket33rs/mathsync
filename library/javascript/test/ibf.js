var assert = require("assert");
var ibf = require('../src/ibf');

describe('IBF', function(){
  describe('jsonification', function(){
    it('should have lenght corresponding to its size', function(){
      assert.equal(5, ibf(5).toJson().length);
    });
  });
});
