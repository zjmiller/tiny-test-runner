/* @flow */
/* eslint-disable global-require, import/no-dynamic-require */

import findTests from 'tiny-test-finder';
import type { TestResults, Suite, Test } from '../flow-type-aliases/types';

export default function getTestResults(
  opts?: { optsForFindTests: Object }
): Promise<TestResults> {
  const suites: TestResults = [];

  global.describe = function describe(
      suiteDescription: string,
      suiteCb: () => void
  ): void {
    suites.push({
      suiteDescription,
      tests: [],
    });
    suiteCb();
  };

  global.it = function it(
    testDescription: string,
    testCb: Function
  ): void {
    suites[suites.length - 1].tests.push({
      testDescription,
      testCb,
    });
  };

  // Load test files and populate suites array.
  const testFilePaths: string[] =
    opts !== undefined ?
    findTests(opts.optsForFindTests)
    :
    findTests()
    ;

  testFilePaths.forEach((filePath: string) => { require(filePath); });

  // Go through and turn each test into a promise.
  // When an individual promise resolves,
  // it adds infomration to its entry in suites.
  const testPromises: Promise<any>[] = [];
  suites.forEach((suite: Suite, i: number) => {
    suite.tests.forEach((test: Test, j: number) => {
      const testCb: (cb?: Function) => void = test.testCb;

      // Does the it() callback list a done parameter?
      // We'll use the follow regex to figure this out.
      // If there is a done cb, then we'll let the it() callback
      // fulfill the promise itself by calling done. Otherwise, we'll do it.
      const cbHasParam: boolean = Boolean(
        testCb.toString().match(/^[^(]*\([^)\s]+/)
      );

      // These test promises are only ever fulfilled, none are rejected.
      // The difference between a passed and failing test
      // is not whether the associated promise is fulfilled or rejected,
      // but rather whether the promise is fulfilled with a value or not.
      // If a promise is fulfilled, but not with a value, then the test passed.
      // If a promise is fulfilled with a value, then the test failed.
      // The value is the relevant AssertionError object.
      const testPromise: Promise<any> = new Promise((done: (e?: Object) => void) => {
        try {
          testCb(done);
          if (!cbHasParam) done();
        } catch (e) {
          done(e);
        }
      });

      testPromise.then((assertionErrorAsValue?: Object) => {
        if (assertionErrorAsValue === undefined) {
          suites[i].tests[j].success = true;
        } else {
          suites[i].tests[j].success = false;
          suites[i].tests[j].err = assertionErrorAsValue;
        }
      }).catch((err: Object) => { throw err; });

      testPromises.push(testPromise);
    });
  });

  return Promise.all(testPromises)
    .then(() => suites)
    .catch((err: Object) => { throw err; });
}
