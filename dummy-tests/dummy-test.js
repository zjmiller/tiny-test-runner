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

describe('An async testsuite', function(){
  it('should fail after 100ms', function(done){
    setTimeout(function(){
      try {
        assert.equal(true, false);
        done();
      } catch (e) {
        done(e);
      }
    }, 3000);
  });
});
