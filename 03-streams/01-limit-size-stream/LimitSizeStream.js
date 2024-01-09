const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._limit = options.limit;
    this._processedDataLength = 0;
  }

  _transform(chunk, _, callback) {
    if (!(this._checkTheEligibility(chunk))) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }

  _flush(callback) {
    this._processedDataLength = 0;
    callback();
  }

  _checkTheEligibility(chunk) {
    if (this._limit) {
      this._processedDataLength += chunk.byteLength;
      return this._processedDataLength <= this._limit;
    }

    return true;
  }
}

module.exports = LimitSizeStream;
