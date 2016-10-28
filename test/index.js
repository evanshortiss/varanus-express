'use strict';

describe('varanus-express', function () {

  var expect = require('chai').expect;
  var sinon = require('sinon');
  var EventEmitter = require('events').EventEmitter;

  var mod = null;

  beforeEach(function () {
    mod = require('../lib/index');
  });

  it('should throw an assertion error - bad config.varanus type', function () {
    expect(function () {
      mod({
        varanus: 'nope'
      });
    }).to.throw('AssertionError');
  });

  it('should throw an assertion error - bad config.varanus version', function () {
    expect(function () {
      mod({
        varanus: {}
      });
    }).to.throw('AssertionError');
  });

  it('should return a middleware function with bound functions', function () {
    var mw = mod({
      varanus: {
        levels: {
          info: 10,
          debug: 20
        },
        getLogger: sinon.stub
      }
    });

    expect(mw).to.be.a.function;
    expect(mw.debug).to.be.a.function;
    expect(mw.info).to.be.a.function;
  });

  it('should log using varanus on finished requests', function (done) {
    var logStub = sinon.stub();
    var getLoggerStub = sinon.stub().returns(logStub);
    var lvl = 20;
    var logOpts = {
      name: 'test',
      level: lvl
    };

    var mw = mod({
      varanus: {
        levels: {
          info: 10,
          debug: 20
        },
        getLogger: getLoggerStub
      }
    })(logOpts);

    expect(getLoggerStub.getCall(0).args[0]).to.equal(logOpts.name);
    expect(getLoggerStub.getCall(0).args[1]).to.equal(logOpts.level);

    var req = {
      originalUrl: '/users/varanus-express'
    };

    var res = new EventEmitter();

    mw(req, res, function () {
      // Simulate request processing
      setTimeout(function () {
        // Now end the request
        res.emit('finish');

        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0]).to.equal(req.originalUrl);
        expect(logStub.getCall(0).args[1]).to.be.a.number;
        expect(logStub.getCall(0).args[2]).to.be.a.number;

        done();
      }, 10);
    });
  });

  it('should log correctly using shorthand functions', function (done) {
    var logStub = sinon.stub();
    var getLoggerStub = sinon.stub().returns(logStub);
    var logname = 'test';

    var mw = mod({
      varanus: {
        levels: {
          info: 10,
          debug: 20
        },
        getLogger: getLoggerStub
      }
    })(logname);

    expect(getLoggerStub.getCall(0).args[0]).to.equal(logname);
    expect(getLoggerStub.getCall(0).args[1]).to.be.undefined;

    var req = {
      originalUrl: '/users/varanus-express'
    };

    var res = new EventEmitter();

    mw(req, res, function () {
      // Simulate request processing
      setTimeout(function () {
        // Now end the request
        res.emit('finish');

        expect(logStub.called).to.be.true;
        expect(logStub.getCall(0).args[0]).to.equal(req.originalUrl);
        expect(logStub.getCall(0).args[1]).to.be.a.number;
        expect(logStub.getCall(0).args[2]).to.be.a.number;

        done();
      }, 10);
    });
  });

});
