## Additional [Jest](https://github.com/facebook/jest) matchers for [TestDouble](https://github.com/testdouble/testdouble.js)
[![Build Status](https://circleci.com/gh/lytc/jest-testdouble/tree/master.svg?style=svg)](https://circleci.com/gh/lytc/jest-testdouble/tree/master)
[![npmjs](https://img.shields.io/badge/npm-jest-testdouble-red.svg)](https://www.npmjs.com/package/testdouble)
### Installation
```bash
npm i jest-testdouble expect --save-dev # "expect" is a peer dependency required for jest-testdouble to work
```
or
```sbash
yarn add jest-testdouble expect --dev # "expect" is a peer dependency required for jest-testdouble to work
```
### Configuration
From Jest test helper (we recommend to use [setupTestFrameworkScriptFile](https://jestjs.io/docs/en/configuration.html#setuptestframeworkscriptfile-string))
```js
const td = require('testdouble');
const jestTestDouble = require('jest-testdouble');

jestTestDouble(td);

global.td = td;
```

### Usage
This package add Jest matchers for TestDouble. Fallback to Jest matcher if the expect `value` is Jest mock/spy.
#### Matchers
- [not].toHaveBeenCalled (alias [not].toBeCalled)
- [not].toHaveBeenCalledWith (alias [not].toBeCalledWith)
- [not].toHaveBeenCalledTimes (alias [not].toBeCalledTimes)
- [not].toHaveBeenLastCalledWith (alias [not].lastCalledWith)
- [not].toHaveBeenNthCalledWith (alias [not].nthCalledWith)
### Example
```js
const drink = td.func('drink');
drink('beer');
expect(drink).toHaveBeenCalledWith('beer');

// Fallback to Jest matcher if expect value is Jest mock function
const eat = jest.eat('eat');
eat('rice');
expect(eat).toHaveBeenCalledWith('rice');
```

### Cannot find module 'expect/build/spyMatchers' from 'index.js' error
`jest-testdouble` requires the `expect` package to work. You just need to install it

```bash
npm i expect --save-dev
```
or
```sbash
yarn add expect --dev
```

