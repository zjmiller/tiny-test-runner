var assert = require('assert');

describe('A sample test suite', function(){
  it('should fail', function(){
    assert.equal({}, []);
  });
  it('should fail again', function(){
    assert.equal(1, 2);
  });
  it('should pass', function(){
    assert.equal('asdf', "asdf");
  });
  it('should pass again', function(){
    assert.equal(true, true);
  });
});

describe('A second sample test suite', function(){
  it('should fail', function(){
    assert.deepEqual({ a: 'asdf' }, { a: 'qwer' });
  });
  it('should fail again', function(){
    assert.equal(NaN, undefined);
  });
  it('should pass', function(){
    assert.deepEqual({ a: 'asdf' }, { a: 'asdf' });
  });
  it('should pass again', function(){
    assert.equal(1, 1);
  });
});
