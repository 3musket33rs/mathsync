# sync

Transparent synchronization between client (browser included) and server.

### Api at a glance

__WORK IN PROGRESS__

### Integration Module

__WORK IN PROGRESS__

## Architecture

Per-language low levels libraries to be easily integrated anywhere plus higher level integrations for common needs. Everything located in a single git repository to synchronize changes.

Inspirational algorithm described in [What’s the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

## Development

[![Build Status](https://travis-ci.org/3musket33rs/sync.png?branch=master)](https://travis-ci.org/3musket33rs/sync)

### Requirements

* [make](http://www.gnu.org/software/make/)
* JDK7
* Node
* [EditorConfig](http://editorconfig.org/)

### Installation
Simply

```javascript
make
```

### Version bump

* before development: `env VERSION=0.42.1 make set-dev-version`
* right before releasing: `env VERSION=0.42.1 make set-release-version`

### Simple Example


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
