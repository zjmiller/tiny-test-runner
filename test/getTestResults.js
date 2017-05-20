/* eslint-disable */

var assert = require('assert');
var getTestResults = require('../dist/getTestResults').default;

describe('Test results getter', function(){
  it('should get results of synchronous test', function(done){

    getTestResults({
      optsForFindTests: {
        posTestDirNames: ['dummy-tests'],
      }
    }).then(results => {
      try {
        assert.equal(
          1,
          results.length
        );
        done();
      } catch (e) {
        done(e);
      }
    }).catch(err => { throw err; });

  });
});
