---
layout: default
title: Javascript
---

# Browser

[Full API doc](/jsdoc/module-mathsync.html) is available.

[![NPM](https://nodei.co/npm/mathsync.png)](https://nodei.co/npm/mathsync/)

## Universal module definition

The whole library is available as a [umd](https://github.com/forbeslindesay/umd) (browser global, [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) and [RequireJS](http://requirejs.org/)) with name `mathsync` in the published npm package, at `browser/browser.js`. It is built using a standalone build with [Browserify](http://browserify.org/). For example using a browser global to reference the library and XMLHttpRequest to target the server:

{% highlight javascript %}
(function (global) {
  var ms = global.mathsync;
  var http = require('http');
  var Promise = require('mathsync/src/promise');

  var data = [/* where do your items come from? */];

  var serialize = ms.string.newSerializer(function (item) {
    /* how to serialize your item? */
  });
  var local = ms.array.newSummarizer(data, serialize);

  function fetchSummary(level) {
    var p = new Promise(function (resolve, reject) {
      var req, url = 'http://localhost:4000/api/summary/' + level;
      function ready() {
        if (req.status === 200) {
          resolve(req.responseText);
        } else {
          reject(new Error('Failed to get summary from ' + url));
        }
      }
      function stateChange() {
        if (req.readyState === 4) {
          ready();
        }
      }
      req = new XMLHttpRequest();
      req.onreadystatechange = stateChange;
      req.open('GET', url);
      req.send(null);
    });
    return p.then(JSON.parse);
  }
  var remote = ms.json.newSummarizer(fetchSummary);

  var serialize = ms.string.newSerializer(function (item) {
    /* how to deserialize your item? */
  });
  var resolve = ms.array.newSummarizer(data, remote, serialize, deserialize);
})(this);
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

Using [jQuery](http://jquery.com/) fetching the JSON can be more concise:

{% highlight javascript %}
function fetchSummary(level) {
  return Promise.resolve($.getJSON('http://localhost:4000/api/summary/' + level));
}
{% endhighlight %}

## Browserify

An alternative is to author modules and bundle them using [Browserify](http://browserify.org/). Depending on feature modules like [generator](/jsdoc/generator.html) or [streams](/jsdoc/stream.html) instead of the [global](/jsdoc/module-mathsync.html) one yields smaller javascript size.
