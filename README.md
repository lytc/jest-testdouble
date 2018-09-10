## [TestDouble](https://github.com/testdouble/testdouble.js) matchers for [Jest](https://github.com/facebook/jest)
### Installation
```bash
npm i jest-testdouble --save-dev
```
or
```sbash
yarn add jest-testdouble --dev
```
### Configuration
From Jest test helper (we recommend to use [setupTestFrameworkScriptFile](https://jestjs.io/docs/en/configuration.html#setuptestframeworkscriptfile-string))
```js
const td = require('testdouble');
const jesTestDouble = require('jest-testdouble');

jestTestDouble(td);

global.td = td;
```

### Usage
This package add TestDouble matchers to Jest. Fallback to Jest matcher if the expect `value` is Jest mock or spy.
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

