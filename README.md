# sync

Almost transparent synchronization between browser and server.

## API

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

### Testing

Each module is unit tested and modules are cross-tested using [Cucumber](http://cukes.info/), with [PhantomJS](http://phantomjs.org/) for in-browser code.

## License

[Apache License](http://www.apache.org/licenses/LICENSE-2.0)
