/* @flow */

import getTestResults from './getTestResults';
import reportOnTestResults from './reportOnTestResults';

type Test = {|
  testDescription: string,
  testCb: Function,
  success?: boolean,
  err?: Object
|}

type Suite = {
  suiteDescription: string,
  tests: Array<Test>
}

type TestResults = Array<Suite>;

module.exports = function runTests(opts: Object) {
  getTestResults(opts)
    .then((results: TestResults) => { reportOnTestResults(results); })
    .catch((err: Object) => { throw err; });
};
