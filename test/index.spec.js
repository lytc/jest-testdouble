const td = require('testdouble');

const jestTestdouble = require('../src');

jestTestdouble(td);

describe('#toHaveBeenCalled', () => {
  beforeEach(td.reset);

  it('should fail if was not called', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenCalled()).toThrowErrorMatchingSnapshot();
  });

  it('should fail not', () => {
    const foo = td.func('foo');
    foo(1);
    expect(() => expect(foo).not.toHaveBeenCalled()).toThrowErrorMatchingSnapshot();
  });

  it('should pass', () => {
    const foo = td.func('foo');
    foo(1);
    expect(foo).toHaveBeenCalled();
  });
});

describe('#toHaveBeenCalledWith', () => {
  it('should fail if was not called', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenCalledWith(1, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should fail when the args does not match', () => {
    const foo = td.func('foo');
    foo(1);
    foo(1, 3);

    expect(() => expect(foo).toHaveBeenCalledWith(1, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with not', () => {
    const foo = td.func('foo');
    foo(1, 2);
    foo(1, 3);

    expect(() => expect(foo).not.toHaveBeenCalledWith(1, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should pass', () => {
    const foo = td.func('foo');
    foo(1, 2);
    expect(foo).toHaveBeenCalledWith(1, 2);
    expect(foo).not.toHaveBeenCalledWith(1, 3);
  });
});

describe('#toHaveBeenCalledTimes', () => {
  it('should fail with invalid time value', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenCalledTimes()).toThrowErrorMatchingSnapshot();
    expect(() => expect(foo).toHaveBeenCalledTimes('hey')).toThrowErrorMatchingSnapshot();
    expect(() => expect(foo).toHaveBeenCalledTimes(-1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);

    expect(() => expect(foo).toHaveBeenCalledTimes(1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with not', () => {
    const foo = td.func('foo');
    foo(1);

    expect(() => expect(foo).not.toHaveBeenCalledTimes(1)).toThrowErrorMatchingSnapshot();
  });

  it('should pass', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);

    expect(foo).toHaveBeenCalledTimes(2);
    expect(foo).not.toHaveBeenCalledTimes(1);
  });
});

describe('#toHaveBeenLastCalledWith', () => {
  it('should fail if was not called', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenLastCalledWith(1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);

    expect(() => expect(foo).toHaveBeenLastCalledWith(1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with not', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);

    expect(() => expect(foo).not.toHaveBeenLastCalledWith(2)).toThrowErrorMatchingSnapshot();
  });

  it('should pass', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);
    expect(foo).toHaveBeenLastCalledWith(2);
    expect(foo).not.toHaveBeenLastCalledWith(1);
  });
});

describe('#toHaveBeenNthCalledWith', () => {
  it('should fail with invalid time number', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenNthCalledWith(-1, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if was not called', () => {
    const foo = td.func('foo');
    expect(() => expect(foo).toHaveBeenNthCalledWith(1, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with args', () => {
    const foo = td.func('foo');
    foo(2);
    expect(() => expect(foo).toHaveBeenNthCalledWith(1, 1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with nth', () => {
    const foo = td.func('foo');
    foo(2);
    expect(() => expect(foo).toHaveBeenNthCalledWith(2, 1)).toThrowErrorMatchingSnapshot();
  });

  it('should fail with not', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);
    foo(3);
    expect(() => expect(foo).not.toHaveBeenNthCalledWith(2, 2)).toThrowErrorMatchingSnapshot();
  });

  it('should pass', () => {
    const foo = td.func('foo');
    foo(1);
    foo(2);
    foo(3);

    expect(foo).toHaveBeenNthCalledWith(2, 2);
    expect(foo).not.toHaveBeenNthCalledWith(2, 1);
  });

  it('should fallback to jest spy matcher', () => {
    const foo = jest.fn();
    foo(1);
    expect(foo).toHaveBeenCalledWith(1);
    expect(() => expect(foo).toHaveBeenCalledWith(2)).toThrowErrorMatchingSnapshot();
  });

  it('should throw error if value is not test double or jest mock/spy', () => {
    const foo = () => {};
    expect(() => expect(foo).toBeCalled()).toThrowErrorMatchingSnapshot();
  });
});
