var assert = require("assert");
var sync = require('../src');

describe('Basic', function(){
  describe('return value', function(){
    it('should return value for key', function(){
      assert.equal('value', sync.key);
    });
  });
});
