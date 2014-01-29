# Mathsync javascript implementation

## Dependency

In your `package.json`:

```
{
  "dependencies": {
    "mathsync": "0.2.x"
  }
}
```

## Usage - server

Expose a summarizer bound to your data to a `GET` endpoint (here using [koa.js](http://koajs.com/)):

```
var data = [/* ... */];

function serialize(item) {
  var buffer = new Buffer(item.key + ':' + item.value, 'utf-8');
  return new Uint8Array(buffer).buffer;
}

var summarizer = require('mathsync').summarizer.fromItems(data, serialize);

app.use(route.get('/summary/:level', function* (level) {
  this.body = yield summarizer(level | 0);
}));
```

## Usage - client

```
var ms = require('mathsync');
var data = [/* ... */];

// local items
function serialize(item) { /* ... */ }
var local = ms.summarizer.fromItems(data, serialize);

// server items
function fetchSummary(level) {
  return http.getJson('/summary/' + level);
}
var remote = summarizer.fromJSON(fetchSummary);

// delta
function deserialize(buffer) {
  var arr = new Buffer(new Uint8Array(buffer)).toString('utf-8').split(':');
  return { key: arr[0], value: arr[1] };
}
var resolve = ms.resolver.fromSummarizers(local, remote, deserialize);

resolve().then(function (difference) { /* ... */ });
```
