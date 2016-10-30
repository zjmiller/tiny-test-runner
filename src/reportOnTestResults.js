/* eslint-disable no-console, prefer-template */

import chalk from 'chalk';

export default function reportOnTestResults(results) {
  results.forEach((suite) => {
    console.log('  ' + chalk.gray.bold(suite.suiteDescription));
    suite.tests.forEach((test) => {
      console.log(
        '    '
        + (test.success ? chalk.green('✓') : chalk.red('✗'))
        + ' '
        + test.testDescription
      );

      if (!test.success) {
        console.log();

        const relPathOfErrorPlusLineColumn =
          test.err.stack.split('\n')[1].slice(8 + process.cwd().length);

        console.log(chalk.gray(
          '      '
          + 'failure @  '
          + relPathOfErrorPlusLineColumn
        ));

        const expectedOutputMaybeStringified =
          typeof test.err.expected === 'object'
          ?
          JSON.stringify(test.err.expected)
          :
          test.err.expected;

        console.log(chalk.green(
          '       '
          + `expected  ${expectedOutputMaybeStringified}`
        ));

        const actualOutputMaybeStringified =
          typeof test.err.actual === 'object'
          ?
          JSON.stringify(test.err.expected)
          :
          test.err.actual;

        console.log(chalk.red(
          '         '
          + `actual  ${actualOutputMaybeStringified}`
        ));

        console.log();
      }
    });
    console.log();
  });

  const numPassed = results.reduce(
    (prev, cur) => prev + cur.tests.filter(test => test.success).length,
    0
  );

  const numFailed = results.reduce(
    (prev, cur) => prev + cur.tests.filter(test => !test.success).length,
    0
  );

  if (numPassed > 0) {
    console.log(
      '  '
      + chalk.green(`${numPassed} passed`)
    );
  }

  if (numFailed > 0) {
    console.log(
      '  '
      + chalk.red(`${numFailed} failed`)
    );
  }

  console.log();
}
