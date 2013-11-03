# sync

__WORK IN PROGRESS__

## Features

Helping synchronization between clients and servers accross a network. The client is expected to have pushed its changes to the server and then requests the library to pull changes from the server.

Clients of the library must provide on the server a way to serialize items and an endpoint, as well as a way to deserialize  items and to access the server endpoint on the client.

The algorithm requires `O(log(n))` roundtrips to the server and consumes a total bandwidth of `O(n)` where `n` is the number of items which changed on the server since the last synchronization. Underlying algorithm greatly inspired from [What’s the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

Nice features:

* underlying structure can be computed ahead of time
* self-stabilizing algorithm (an error is corrected at the next synchronization)
* does not require the server to record all changes

## Development

[![Build Status](https://travis-ci.org/3musket33rs/sync.png?branch=master)](https://travis-ci.org/3musket33rs/sync)

### Architecture

Per-language low levels libraries to be easily integrated anywhere plus higher level integrations for common needs. Everything located in a single git repository to synchronize changes.

### Requirements

* [make](http://www.gnu.org/software/make/)
* JDK7
* Node
* [EditorConfig](http://editorconfig.org/)

### Installation

```javascript
make
```

### Version bump

* before development: `env VERSION=0.42.1 make set-dev-version`
* right before releasing: `env VERSION=0.42.1 make set-release-version`

### Testing

Each module is unit tested and modules are cross-tested using [Cucumber](http://cukes.info/), with [PhantomJS](http://phantomjs.org/) for in-browser code.

### Support

1. Go to the issues section of the sync repo
   (https://github.com/3musket33rs/sync/issues) and search for an answer to your
   question or problem.
2. If no answer exists, file a new ticket!  Somebody will typically respond
   within a few hours.

It's that easy.


## License

[Apache License](http://www.apache.org/licenses/LICENSE-2.0)
