/* @flow */

export type Test = {|
  testDescription: string,
  testCb: Function,
  success?: boolean,
  err?: Object
|};

export type Suite = {
  suiteDescription: string,
  tests: Array<Test>
};

export type TestResults = Array<Suite>;
