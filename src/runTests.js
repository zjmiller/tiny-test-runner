import chalk from 'chalk';
import findTests from 'tiny-test-finder';
import fs from 'fs';
import report from './report';

module.exports = function runTests(optsForFindTests = {}){
  let suites = [];

  global.describe = function(suiteDescription, suiteCb) {
    suites.push({
      suiteDescription,
      tests: [],
    });
    suiteCb();
  }

  global.it = function(testDescription, testCb) {
    suites[suites.length - 1].tests.push({
      testDescription,
      testCb,
    });
  }

  // Load test files, populating suites
  const testFilePaths = findTests(optsForFindTests);
  testFilePaths.forEach(filePath => require(filePath));

  // Go through and turn each test into a promise
  // When an individual promise resolves
  // It add infomration to its entry in suites
  let testPromises = [];
  suites.forEach((suite, i) => {
    const { tests } = suite;

    suite.tests.forEach((test, j) => {
      const { testCb } = test;

      // Does it() have a done callback?
      // We'll use the follow regex to figure this out.
      // If it does have a done cb, then we'll let the it() function
      // fulfill the promise itself. If it doesn't, well do it.
      const cbHasParam = testCb.toString().match(/^[^(]*\([^)\s]+/);

      // These test promises are only ever fulfilled, none are rejected
      // The difference between a passed and failing test
      // is not whether the associated promise is fulfilled or rejected,
      // but rather whether the promise is fulfilled with a value or not
      // If a promise is fulfilled, but not with a value, then the test passed
      // If a promise is fulfilled with a value, then the test failed
      // And the value is the relevant AssertionError object
      const testPromise = new Promise(function(done){
        try {
          testCb(done);
          if (!cbHasParam) done();
        } catch (e) {
          done(e);
        }
      });

      testPromise.then(assertionErrorAsValue => {
        if (!assertionErrorAsValue) {
          suites[i].tests[j].success = true;
        } else {
          suites[i].tests[j].success = false;
          suites[i].tests[j].err = assertionErrorAsValue;
        }
      }).catch(err => console.log(err));

      testPromises.push(testPromise);
    });
  });

  // When all the promises have resolved
  // The fully updated suites is passed to the reporter
  Promise.all(testPromises)
    .then(() => report(suites))
    .catch(err => console.log(err));
}

// async moves out of call stack, errors don't pass up
// need to catch errors and use a promise's reject method
// Promise.all fails fast
// throw is statement
