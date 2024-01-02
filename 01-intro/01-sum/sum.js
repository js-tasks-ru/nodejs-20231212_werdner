function sum(a, b) {
  if (!a || !b) {
    throw new Error();
  } else if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError();
  }

  return a + b;
}

module.exports = sum;
