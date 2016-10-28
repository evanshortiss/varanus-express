'use strict';

var assert = require('assert');
var finished = require('on-finished');

module.exports = function (config) {

  assert.equal(
    typeof config.varanus,
    'object',
    'config.varanus must be an object'
  );

  assert.equal(
    typeof config.varanus.getLogger,
    'function',
    'config.varanus must be from varanus version >=2.1.0'
  );

  function getMiddlewareInstanceWithOpts (opts) {
    if (typeof opts === 'string') {
      opts = {
        name: opts
      };
    }

    var log = config.varanus.getLogger(opts.name, opts.level);

    return function _varanusMiddleware (req, res, next) {
      var start = Date.now();

      finished(res, function (err) {
        // TODO: determine error behaviours
        if (!err) {
          log(req.originalUrl, start, Date.now());
        }
      });

      next();
    };
  }

  // Generate useful aliases to apply specific levels for an instance
  Object.keys(config.varanus.levels).forEach(function (lvl) {
    getMiddlewareInstanceWithOpts[lvl] = function (name) {
      return getMiddlewareInstanceWithOpts({
        name: name,
        level: config.varanus.levels[lvl]
      });
    };
  });

  return getMiddlewareInstanceWithOpts;
};
