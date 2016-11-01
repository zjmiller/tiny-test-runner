/* @flow */

import getTestResults from './getTestResults';
import reportOnTestResults from './reportOnTestResults';
import type { TestResults } from '../flow-types/types';

module.exports = function runTests(opts: Object) {
  getTestResults(opts)
    .then((results: TestResults) => { reportOnTestResults(results); })
    .catch((err: Object) => { throw err; });
};
