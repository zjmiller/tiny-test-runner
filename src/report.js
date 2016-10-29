import chalk from 'chalk';

export default function report(type, opts) {
  if (type === 'endSuite') {
    console.log();
  }

  else if (type === 'beginSuite') {
    console.log('  ' + chalk.gray.bold(opts.suiteDescription));
  }

  else if (type === 'testResult') {
    console.log(
      '    '
      + (opts.wasSuccess ? chalk.green('✓') : chalk.red('✗'))
      + ' '
      + opts.testDescription
    );

    if (!opts.wasSuccess) {
      console.log();

      console.log(chalk.gray(
        '      '
        + 'failure @  '
        + opts.err.stack.split('\n')[1].slice(8 + process.cwd().length)
      ));

      console.log(chalk.green(
        '       '
        + `expected  ${typeof opts.err.expected === 'object' || typeof opts.err.expected === 'array' ? JSON.stringify(opts.err.expected) : opts.err.expected}`
      ));

      console.log(chalk.red(
        '         '
        + `actual  ${typeof opts.err.expected === 'object' || typeof opts.err.actual === 'array' ? JSON.stringify(opts.err.actual) : opts.err.actual}`
      ));

      console.log();
    }
  }

  else if (type === 'summary') {
    opts.numPassed > 0 && console.log(
      '  '
      + chalk.green(`${opts.numPassed} passed`)
    );

    opts.numFailed > 0 && console.log(
      '  '
      + chalk.red(`${opts.numFailed} failed`)
    );

    console.log();
  }
}
