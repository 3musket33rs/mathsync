---
layout: default
title: Javascript
---

# Javascript

[Full API doc](/jsdoc) is available.

[![NPM](https://nodei.co/npm/mathsync.png)](https://nodei.co/npm/mathsync/)

## [Node.js](http://nodejs.org/) server

Add a dependency towards the library:

{% highlight json %}
{
  "dependencies": {
    "mathsync": "0.5.x"
  }
}
{% endhighlight %}

Create a endpoint fetching your items, serializing them and sending the summary over the wire (here done using [Koa](http://koajs.com/)):

{% highlight javascript%}
var ms = require('mathsync');

var data = [/* where do your items come from? */];

var serialize = ms.serialize.fromString(function (item) {
  /* how to serialize your item to string? */
});
var summarizer = ms.summarizer.fromItems(data, serialize);

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
    "mathsync": "0.5.x",
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

var serialize = ms.serialize.fromString(function (item) {
  /* how to serialize your item? */
});
var local = ms.summarizer.fromItems(data, serialize);

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
var remote = ms.summarizer.fromJSON(fetchSummary);

var deserialize = ms.serialize.toString(function (str) {
  /* how to deserialize your item? */
});
var resolve = ms.resolver.fromItems(data, remote, serialize, deserialize);
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

The library supports the use of [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Generators.3A_a_better_way_to_build_Iterators) as iterator where one is expected to and `yield` all items:

{% highlight javascript %}
var ms = require('mathsync-generator');

var data = {};

var serialize = ms.serialize.fromString();

var local = ms.summarizer.fromGenerator(function* () {
  for (var k in data) {
    yield (k + ':' + data[k]);
  }
}, serialize);
{% endhighlight %}
