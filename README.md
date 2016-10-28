# varanus-express

Add varanus tracking to and express application and/or routes via this
middleware. Where varanus would normally log the function name, this will log
the value of _req.originalUrl_.

# Usage

```js

var varanus = require('varanus')({
  flushInterval: 30000,
  logLevel: 'trace',
  flush: require('./your-varanus-flush-logic')
});

var varanusMw = require('varanus-express')({
  varanus: varanus
});

var app = require('express')();

// Log all requests at "trace" level (this is what varanus is set to above)
app.use(varanusMw('all-routes'));

// Log /tasks at "debug" level
app.use('/tasks', varanusMw.debug('/tasks'), require('lib/routes/tasks'));

// Log all /users requests at "info" level
app.use('/users', varanusMw.info('/users'), require('lib/routes/users'));

```
