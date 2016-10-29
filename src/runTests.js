import chalk from 'chalk';
import findTests from 'tiny-test-finder';
import fs from 'fs';
import report from './report';

module.exports = function runTests(optsForFindTests = {}){
  const testFilePaths = findTests(optsForFindTests);

  let numPassed = 0;
  let numFailed = 0;

  global.describe = function(suiteDescription, suiteCb) {
    report('beginSuite', { suiteDescription });
    suiteCb();
    report('endSuite');
  }

  global.it = function(testDescription, testCb) {
    let wasSuccess = true;
    let err;

    try {
      testCb();
    } catch (e) {
      err = e;
      wasSuccess = false;
    }

    if (wasSuccess) numPassed += 1;
    else (numFailed += 1);

    report('testResult', { testDescription, wasSuccess, err });
  }

  testFilePaths.forEach(filePath => require(filePath));

  report('summary', { numPassed, numFailed });

}
