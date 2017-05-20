An extremely lightweight test runner.

Install globally with npm (or yarn):

```console
> npm install -g tiny-test-runner
```

And then run tests on the command line:

```console
> ttr
```

This command looks through your source code for any directory named `test` or `__test__` and runs each file in these directories. In these files, write BDD-style tests w/ `describe` and `it`, and use `done` if you're testing something asynchronous. Just like you would with Mocha.
