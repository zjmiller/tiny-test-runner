/* eslint-disable global-require, import/no-dynamic-require */

import findTests from 'tiny-test-finder';
import reportOnTestResults from './reportOnTestResults';

module.exports = function runTests(optsForFindTests = {}) {
  const suites = [];

  global.describe = function describe(suiteDescription, suiteCb) {
    suites.push({
      suiteDescription,
      tests: [],
    });
    suiteCb();
  };

  global.it = function it(testDescription, testCb) {
    suites[suites.length - 1].tests.push({
      testDescription,
      testCb,
    });
  };

  // Load test files and populate suites array.
  const testFilePaths = findTests(optsForFindTests);
  testFilePaths.forEach(filePath => require(filePath));

  // Go through and turn each test into a promise.
  // When an individual promise resolves,
  // it adds infomration to its entry in suites.
  const testPromises = [];
  suites.forEach((suite, i) => {
    suite.tests.forEach((test, j) => {
      const { testCb } = test;

      // Does the it() callback list a done parameter?
      // We'll use the follow regex to figure this out.
      // If there is a done cb, then we'll let the it() callback
      // fulfill the promise itself by calling done. Otherwise, we'll do it.
      const cbHasParam = testCb.toString().match(/^[^(]*\([^)\s]+/);

      // These test promises are only ever fulfilled, none are rejected.
      // The difference between a passed and failing test
      // is not whether the associated promise is fulfilled or rejected,
      // but rather whether the promise is fulfilled with a value or not.
      // If a promise is fulfilled, but not with a value, then the test passed.
      // If a promise is fulfilled with a value, then the test failed.
      // The value is the relevant AssertionError object.
      const testPromise = new Promise((done) => {
        try {
          testCb(done);
          if (!cbHasParam) done();
        } catch (e) {
          done(e);
        }
      });

      testPromise.then((assertionErrorAsValue) => {
        if (!assertionErrorAsValue) {
          suites[i].tests[j].success = true;
        } else {
          suites[i].tests[j].success = false;
          suites[i].tests[j].err = assertionErrorAsValue;
        }
      }).catch((err) => { throw err; });

      testPromises.push(testPromise);
    });
  });

  // When all the promises have resolved,
  // the fully updated suites array is passed to the reporter.
  Promise.all(testPromises)
    .then(() => reportOnTestResults(suites))
    .catch((err) => { throw err; });
};
