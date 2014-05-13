---
layout: default
title: Javascript
---

# Node.js

[Full API doc](/jsdoc/module-mathsync.html) is available.

[![NPM](https://nodei.co/npm/mathsync.png)](https://nodei.co/npm/mathsync/)

## Server example

Add a dependency towards the library:

{% highlight json %}
{
  "dependencies": {
    "mathsync": "{{ site.version }}"
  }
}
{% endhighlight %}

Create a endpoint fetching your items, serializing them and sending the summary over the wire (here done using [Koa](http://koajs.com/)):

{% highlight javascript%}
var ms = require('mathsync');

var data = [/* where do your items come from? */];

var serialize = ms.string.newSerializer(function (item) {
  /* how to serialize your item to string? */
});
var summarizer = ms.array.newSummarizer(data, serialize);

var app = require('koa')();
var route = require('koa-route');

app.use(route.get('/summary/:level', function* (level) {
  this.body = yield summarizer(level | 0);
}));
{% endhighlight %}

The endpoint can be extended to expose session-specific summaries. It is possible to build custom serializers not going through a string.

## Streams

The library supports the use of [Node readable streams](http://nodejs.org/api/stream.html) emitting all items. Read the [specific API doc](/jsdoc/stream.html).

{% highlight javascript %}
var ms = require('mathsync');

var serialize = ms.string.newSerializer(function (item) {
  /* how to serialize your item to string? */
});

var local = ms.stream.newSummarizer(function () {
  return new MyDataStream(/* where do your items come from? */);
}, serialize);
{% endhighlight %}

## Generator

The library supports the use of [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) as iterator where one is expected to and `yield` all items. Read the [specific API doc](/jsdoc/generator.html).

{% highlight javascript %}
var ms = require('mathsync');

var data = {};

var serialize = ms.string.newSerializer();

var local = ms.generator.newSummarizer(function* () {
  for (var k in data) {
    yield (k + ':' + data[k]);
  }
}, serialize);
{% endhighlight %}

## Client example

Maybe less common, but it can act as a client to another server.

{% highlight javascript %}
var ms = require('mathsync');
var http = require('http');
var Promise = require('mathsync/src/promise');

var data = [/* where do your items come from? */];

var serialize = ms.string.newSerializer(function (item) {
  /* how to serialize your item? */
});
var local = ms.array.newSummarizer(data, serialize);

function fetchSummary(level) {
  return new Promise(function (resolve, reject) {
    http.get('http://localhost:8080/summary/' + level, function (res) {
      var chunks = [];
      res.on('data', function(chunk) {
        chunks.push(chunk);
      });
      res.on('end', function() {
        resolve(chunks);
      });
    }).on('error', reject);
  }).then(Buffer.concat).then(JSON.parse);
}
var remote = ms.json.newSummarizer(fetchSummary);

var serialize = ms.string.newSerializer(function (item) {
  /* how to deserialize your item? */
});
var resolve = ms.array.newSummarizer(data, remote, serialize, deserialize);
{% endhighlight %}

and then call it whenever you want to synchronize:

{% highlight javascript %}
resolve().then(function (difference) {
  difference.removed.forEach(function (i) {
    /* remove deleted item locally! */
  });
  difference.added.forEach(function (i) {
    /* add new item locally! */
  });
});
{% endhighlight %}
