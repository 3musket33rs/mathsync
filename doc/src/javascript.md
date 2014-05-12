---
layout: default
title: Javascript
---

# Javascript

[Full API doc](/jsdoc/module-mathsync.html) is available.

[![NPM](https://nodei.co/npm/mathsync.png)](https://nodei.co/npm/mathsync/)

## [Node.js](http://nodejs.org/) server

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

## Browser client

It is currently recommended to use [Browserify](http://browserify.org/) to use the library on the browser side.

Add a dependency towards the library and to a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) provider (here using [Q](https://github.com/kriskowal/q) but any would comply):

{% highlight json%}
{
  "dependencies": {
    "mathsync": "{{ site.version }}",
    "q": "0.9.x"
  }
}
{% endhighlight %}

Fetch the data structure from the endpoint, returning a promise:

{% highlight javascript %}
var ms = require('mathsync');
var http = require('http');
var q = require('q');

var data = [/* where do your items come from? */];

var serialize = ms.string.newSerializer(function (item) {
  /* how to serialize your item? */
});
var local = ms.array.newSummarizer(data, serialize);

function fetchSummary(level) {
  var deferred = q.defer();

  http.get('http://localhost:8080/summary/' + level, function (res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      deferred.resolve(chunks);
    });
  }).on('error', deferred.reject);

  return deferred.promise.then(Buffer.concat).then(JSON.parse);
}
var remote = ms.json.newSummarizer(fetchSummary);

var serialize = ms.string.newSerializer(function (item) {
  /* how to deserialize your item? */
});
var resolve = ms.array.newSummarizer(data, remote, serialize, deserialize);
{% endhighlight %}

and then call it whenever you want to synchronize wit the server:

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

## Generator

The library supports the use of [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) as iterator where one is expected to and `yield` all items:

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
