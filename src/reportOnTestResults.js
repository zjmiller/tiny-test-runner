/* @flow */
/* eslint-disable no-console, prefer-template */

import chalk from 'chalk';
import type { TestResults, Suite, Test } from '../flow-type-aliases/types';

export default function reportOnTestResults(results: TestResults): void {
  results.forEach((suite: Suite) => {
    console.log('  ' + chalk.gray.bold(suite.suiteDescription));
    suite.tests.forEach((test: Test) => {
      const {
        testDescription,
        success,
        err,
      }: {
        testDescription: string,
        success?: boolean,
        err?: Object
      } = test;

      console.log(
        '    '
        + (success ? chalk.green('✓') : chalk.red('✗'))
        + ' '
        + testDescription
      );

      if (err !== undefined) {
        console.log();

        const relPathOfErrorPlusLineColumn: string =
          err.stack.split('\n')[1].slice(8 + process.cwd().length);

        console.log(chalk.gray(
          '      '
          + 'failure @  '
          + relPathOfErrorPlusLineColumn
        ));

        const expectedOutputMaybeStringified =
          typeof err.expected === 'object'
          ?
          JSON.stringify(err.expected)
          :
          err.expected;

        console.log(chalk.green(
          '       '
          + `expected  ${expectedOutputMaybeStringified}`
        ));

        const actualOutputMaybeStringified =
          typeof err.actual === 'object'
          ?
          JSON.stringify(err.actual)
          :
          err.actual;

        console.log(chalk.red(
          '         '
          + `actual  ${actualOutputMaybeStringified}`
        ));

        console.log();
      }
    });
    console.log();
  });

  const numPassed: number = results.reduce(
    (prev, cur) => prev + cur.tests.filter(test => test.success).length,
    0
  );

  const numFailed: number = results.reduce(
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
