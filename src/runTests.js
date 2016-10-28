import chalk from 'chalk';
import findTests from 'tiny-test-finder';
import fs from 'fs';

module.exports = function runTests(optsForFindTests = {}){
  const testFilePaths = findTests(optsForFindTests);

  let numPassed = 0;
  let numFailed = 0;

  global.describe = function(suiteDescription, suiteCb) {
    console.log('  ' + chalk.gray.bold(suiteDescription));
    suiteCb();
    console.log();
  }

  global.it = function(testDescription, testCb) {
    let success = true;
    let err;

    try {
      testCb();
    } catch (e) {
      err = e;
      success = false;
    }

    if (success) numPassed += 1;
    else (numFailed += 1);

    console.log(
      '    '
      + (success ? chalk.green('✓') : chalk.red('✗'))
      + ' '
      + testDescription
    );

    if (!success) {
      console.log();

      console.log(chalk.gray(
        '      '
        + 'failure @  '
        + err.stack.split('\n')[1].slice(8 + process.cwd().length)
      ));

      console.log(chalk.green(
        '       '
        + `expected  ${typeof err.expected === 'object' || typeof err.expected === 'array' ? JSON.stringify(err.expected) : err.expected}`
      ));

      console.log(chalk.red(
        '         '
        + `actual  ${typeof err.expected === 'object' || typeof err.actual === 'array' ? JSON.stringify(err.actual) : err.actual}`
      ));

      console.log();
    }
  }

  testFilePaths.forEach(filePath => require(filePath));

  numPassed > 0 && console.log(
    '  '
    + chalk.green(`${numPassed} passed`)
  );

  numFailed > 0 && console.log(
    '  '
    + chalk.red(`${numFailed} failed`)
  );

  console.log();
}
