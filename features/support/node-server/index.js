var koa = require('koa');
var app = koa();
var fs = require('fs');
var route = require('koa-route');
var net = require('net');

var data = {};

function serialize(item) {
  var buffer = new Buffer(item.key + ':' + item.value, 'utf-8');
  return new Uint8Array(buffer).buffer;
}

var summarizer = require('mathsync-generator').summarizer.fromGenerator(function* () {
  for (var k in data) {
    yield { key: k, value: data[k] };
  }
}, serialize);

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(route.get('/summary/:level', function* (level) {
  this.body = yield summarizer(level | 0);
}));

app.listen(process.env.PORT, function(err) {
  if (err) {
    throw err;
  }

  /* IPC with cucumber */

  var client = net.connect({ port: process.env.LOOP });
  client.setEncoding('UTF-8');

  function handlePut(key, value) {
    data[key] = value;
    handleGet();
  }
  function handleDelete(key) {
    delete data[key];
    handleGet();
  }
  function handleGet() {
    var values = [];
    for (var key in data) {
      values.push(key + ':' + data[key]);
    }
    client.write(values.join(',') + '\n');
  }

  var conf = { PUT: handlePut, DELETE: handleDelete };
  function handleLine(line) {
    var tokens = line.split(' ');
    conf[tokens[0]].apply(null, tokens.slice(1));
  }

  var buff = '';
  client.on('data', function(data) {
    buff += data;
    var lines = buff.split('\n');
    for (var i = 0; i < lines.length - 1; i++) {
      handleLine(lines[i]);
    }
    buff = lines[lines.length - 1];
  });
});
