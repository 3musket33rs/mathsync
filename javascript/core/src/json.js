(function () {
  'use strict';

  var defaults = require('./skeleton').defaults;
  var ibfBuilder = require('./ibf');
  var emptyFullContent = require('./fullContent');
  var Promise = require('./promise');

  function newSummarizer(producer, digester, selector) {
    return function (level) {
      return Promise.resolve(producer(level)).then(function (json) {
        if (Array.isArray(json)) {
          return ibfBuilder.fromJSON(json, digester || defaults.digester, selector || defaults.selector);
        } else {
          return emptyFullContent.fromJSON(json);
        }
      });
    };
  }

  /**
   * Summarizer deserializing JSON content.
   *
   * <p>When synchroniwing a client and a server, the client asks a JSON summary to the server and then has to
   * deserialize it.</p>
   *
   * @module mathsync/json
   */
  module.exports = {

    /**
     * Deserializes JSON views of summaries, likely obtained throught the network.
     *
     * @example <caption>From an HTTP endpoint using XMLHttpRequest</caption>
     * var Promise = require('mathsync/promise'); // polyfill
     * function fetchSummary(level) {
     *   var p = new Promise(function (resolve, reject) {
     *     var req, url = 'http://localhost:4000/api/summary/' + level;
     *     function ready() {
     *       if (req.status === 200) {
     *         resolve(req.responseText);
     *       } else {
     *         reject(new Error('Failed to get summary from ' + url));
     *       }
     *     }
     *     function stateChange() {
     *       if (req.readyState === 4) {
     *         ready();
     *       }
     *     }
     *     req = new XMLHttpRequest();
     *     req.onreadystatechange = stateChange;
     *     req.open('GET', url);
     *     req.send(null);
     *   });
     *   return p.then(JSON.parse);
     * }
     * var summarizer = require('mathsync/json').newSummarizer(fetchSummary);
     *
     * @example <caption>From an HTTP endpoint using jQuery</caption>
     * var Promise = require('mathsync/src/promise'); // polyfill
     * function fetchSummary(level) {
     *   return Promise.resolve($.getJSON('http://localhost:4000/api/summary/' + level));
     * }
     * var summarizer = require('mathsync/json').newSummarizer(fetchSummary);
     *
     * @example <caption>From an HTTP endpoint using Node's http</caption>
     * var Promise = require('mathsync/src/promise'); // polyfill
     * var http = require('http');
     * function fetchSummary(level) {
     *   var p = new Promise(function (resolve, reject) {
     *     http.get('http://localhost:4000/api/summary/' + level, function (res) {
     *       var chunks = [];
     *       res.on('data', function(chunk) {
     *         chunks.push(chunk);
     *       });
     *       res.on('end', function() {
     *         resolve(chunks);
     *       });
     *     }).on('error', reject);
     *   });
     *   return p.then(Buffer.concat).then(JSON.parse);
     * }
     * var summarizer = require('mathsync/json').newSummarizer(fetchSummary);
     *
     * @function
     * @param {function} producer - the producer of JSON summaries, returns {@link external:Promise promises} resolving to JSON content.
     * @param {Digest~Digester} [digester] - the digester to use, defaults to SHA-1.
     * @param {BucketSelector~Selector} [selector] - how to place items in IBF buckets, uses 3 buckets by default.
     * @return {summarizer} a summarizer returning deserialized summaries.
     */
    newSummarizer : newSummarizer
  };
})();
