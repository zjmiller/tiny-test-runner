var assert = require('assert');

describe('test suite', function(){
  it('test 1 - passing', function(){
    assert.equal(1, 1);
  });
  it('test 2 - failing', function(){
    assert.equal(1, 2);
  });
});
