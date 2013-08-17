var express = require('express');
var app = express();
var fs = require('fs');

var node = require('../../../node');
var content = [];
var lib = node({
  getAll: function () {
    return content;
  }
});

app.get('/', function(req, res) {
  res.send('<html><body>Programming land</body></html>');
});

app.get('/ibf', function(req, res) {
  var body = JSON.stringify();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.put('/items/:value', function(req, res) {
  var value = request.params.value;
  var idx = content.indexOf(value);
  if (idx < 0) {
    content.push(value);
    res.end('Added element');
  } else {
    res.status(409, 'Element already exists');
  }
});

app.delete('/items/:value', function(req, res) {
  var value = request.params.value;
  var idx = content.indexOf(value);
  if (idx < 0) {
    res.status(409, 'Element does not exist');
  } else {
    content.splice(idx, 1);
    res.end('Removed element');
  }
});

app.listen(process.env.PORT, function(err) {
  if (err) {
    throw err;
  }
  fs.writeFile(process.env.PIDFILE, process.pid, function(err) {
    if (err) {
      throw err;
    }
  });
});
