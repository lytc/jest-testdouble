const td = require('testdouble');
const jestSpyMatchers = require('expect/build/spyMatchers').default;
const argsMatch = require('testdouble/lib/args-match').default;
const { matcherHint, printWithType, printReceived, RECEIVED_COLOR } = require('jest-matcher-utils');

const isJestMock = mockOrSpy =>
  !(!mockOrSpy ||
  ((mockOrSpy.calls === undefined || mockOrSpy.calls.all === undefined) &&
    mockOrSpy._isMockFunction !== true));

const isTestDouble = received => td.explain(received).isTestDouble;
const ensureJestMockOrTestDouble = (received, matcherName) => {
  // test double
  if (isTestDouble(received)) {
    return true;
  }

  // jest mock or spy
  if (isJestMock(received)) {
    return true;
  }

  throw new Error(
    matcherHint(matcherName, 'received', '') +
    '\n\n' +
    `${RECEIVED_COLOR('received')} value must be a test double, jest mock function or jest spy.\n` +
    printWithType('Received', received, printReceived)
  );
};

const nthToString = (nth) => {
  switch (nth) {
  case 1: return 'first';
  case 2: return 'second';
  case 3: return 'third';
  }
  return `${nth}th`;
};

function toHaveBeenCalled(td, received) {
  let explanation = td.explain(received);
  const { callCount, calls } = explanation;
  let message;

  message = `Expected ${received} to ${this.isNot ? 'not ' : ''}have been called.\n`;

  if (callCount > 0) {
    message += 'But it was called with:\n';
    message += `- ${calls.map(({ args }) => this.utils.printReceived(args)).join('\n- ')}`;
  } else {
    message += `But it was ${RECEIVED_COLOR('not called')}.`;
  }


  return { pass: callCount > 0, message: () => message };
}

function toHaveBeenCalledWith(td, received, ...args) {
  let explanation = td.explain(received);
  let error;

  try {
    td.verify(received(...args));
  } catch (err) {
    error = err;
  }

  const { callCount, calls } = explanation;
  const pass = !error;
  let message;

  message = `Expected ${received} to ${this.isNot ? 'not ' : ''}have been called with:\n`;
  message += `${this.utils.printExpected(args)}\n`;

  if (callCount > 0) {
    message += 'But it was called with:\n';
    message += `- ${calls.map(({ args }) => this.utils.printReceived(args)).join('\n- ')}`;
  } else {
    message += `But it was ${RECEIVED_COLOR('not called')}.`;
  }


  return { pass, message: () => message };
}

function toHaveBeenCalledTimes(td, received, number) {
  if (!Number.isInteger(number) || number < 1) {
    let message =
      `${this.utils.printReceived('number')} value must be a positive integer greater than or equal to ${this.utils.printExpected(0)}.\n`;
    message += printWithType('Got', number, printReceived);
    return {pass: false, message: () => message};
  }

  let explanation = td.explain(received);
  const { callCount, calls } = explanation;
  const pass = callCount === number;
  let message = `Expected ${received}${this.isNot ? ' not' : ''}`;
  message += ` to have been called ${number} time${number === 1 ? '' : 's'}, `;
  message += `but it was called ${callCount} time${callCount === 1 ? '' : 's'}.`;

  if (callCount > 0) {
    message += `\n- ${calls.map(({ args }) => this.utils.printReceived(args)).join('\n- ')}`;
  }

  return { pass, message: () => message };
}

function toHaveBeenLastCalledWith(td, received, ...args) {
  let explanation = td.explain(received);
  const { callCount, calls } = explanation;

  let message = `Expected ${received} to${this.isNot ? ' not' : ''} have been last called with:\n`;
  message += `${this.utils.printExpected(args)}\n`;

  if (callCount === 0) {
    message += `But it was ${RECEIVED_COLOR('not called')}.`;
    return { pass: false, message: () => message };
  }

  const lastCall = calls[callCount - 1];
  const pass = argsMatch(args, lastCall.args);
  message += 'But it was called with:\n';
  message += this.utils.printReceived(lastCall.args);

  return { pass: pass, message: () => message };
}

function toHaveBeenNthCalledWith(td, received, nth, ...args) {
  if (!Number.isInteger(nth) || nth < 1) {
    const message =
      `nth value ${this.utils.printReceived(nth)} must be a positive integer greater than ${this.utils.printExpected(0)}`;
    return {pass: false, message: () => message};
  }

  let explanation = td.explain(received);
  const { callCount, calls } = explanation;
  let message = `Expected ${received} ${nthToString(nth)} call to${this.isNot ? ' not' : ''} have been called with:\n`;
  message += `${this.utils.printExpected(args)}\n`;

  if (callCount < nth) {
    message += `But it was ${RECEIVED_COLOR('not called')}.`;
    return { pass: false, message: () => message };
  }

  const nthCall = calls[nth - 1];
  const pass = argsMatch(args, nthCall.args);
  message += 'But it was called with:\n';
  message += this.utils.printReceived(nthCall.args);

  return { pass: pass, message: () => message };
}

const matchers = {
  toHaveBeenCalled,
  toHaveBeenCalledWith,
  toHaveBeenCalledTimes,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
  toBeCalled: toHaveBeenCalled,
  toBeCalledWith: toHaveBeenCalledWith,
  toBeCalledTimes: toHaveBeenCalledTimes,
  lastCalledWith: toHaveBeenLastCalledWith,
  nthCalledWith: toHaveBeenNthCalledWith
};

Object.keys(matchers).forEach((name) => {
  const matcher = matchers[name];

  matchers[name] = function (td, received, ...args) {
    const matcherName = this.isNot ? `.not.${name}` : `.${name}`;
    ensureJestMockOrTestDouble(received, matcherName);

    return matcher.call(this, td, received, ...args);
  };
});

module.exports = function (td) {
  Object.keys(matchers).forEach((name) => {
    const matcher = matchers[name];

    matchers[name] = function (received, ...args) {
      if (isJestMock(received)) {
        return jestSpyMatchers[name].call(this, received, ...args);
      }
      const result = matcher.call(this, td, received, ...args);
      const message = result.message;
      result.message = () => `${this.utils.matcherHint(this.isNot ? `.not.${name}` : `.${name}`, 'testDouble', '')}\n\n${message()}`;
      return result;
    };
  });

  expect.extend(matchers);
};
