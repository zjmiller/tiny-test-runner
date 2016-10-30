import getTestResults from './getTestResults';
import reportOnTestResults from './reportOnTestResults';

module.exports = function runTests(opts) {
  getTestResults(opts)
    .then(results => reportOnTestResults(results))
    .catch((err) => { throw err; });
};
