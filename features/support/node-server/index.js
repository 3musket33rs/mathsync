var koa = require('koa');
var app = koa();
var fs = require('fs');
var route = require('koa-route');

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
  //TODO
});
