# mathsync

Data synchronization using a mathematical aproach.

## Features

Helping synchronization between clients and servers accross a network. The client is expected to have pushed its changes to the server and then requests the library to pull changes from the server.

Clients of the library must provide on the server a way to serialize items and an endpoint, as well as a way to deserialize  items and to access the server endpoint on the client.

The algorithm requires `O(log(n))` roundtrips to the server and consumes a total bandwidth of `O(s * n)` where `n` is the number of items which changed on the server since the last synchronization and `s` the size of an item. The total number of items in the repository has no influence. Underlying algorithm greatly inspired from [What’s the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

Nice features:

* underlying structure can be computed ahead of time (in map/reduce jobs)
* self-stabilizing algorithm (any error would be corrected at the next synchronization)
* the server is neither required to record a log of changes nor to version items

## Development

[![Build Status](https://travis-ci.org/3musket33rs/mathsync.png?branch=master)](https://travis-ci.org/3musket33rs/mathsync)

Per-language low levels libraries to be easily integrated anywhere plus higher level integrations for common needs. Everything located in a single git repository to make changes atomic.

### Requirements

* [make](http://www.gnu.org/software/make/)
* JDK7
* [Node.js](http://nodejs.org/)
* [Ruby](https://www.ruby-lang.org/)

[Vagrant](http://www.vagrantup.com/) can be used to get a working virtual machine in minutes with all build requirements. Code can be edited directly in the host while compiling occurs in the VM (at `/home/vagrant/dev`). Windows users should ensure that the virtual machine is able to create symlinks on the host file system.

### Build

Initial setup is done using:

```
make init
```

And builds are launched with:

```
make build
```

### Testing

TODO

Each module is unit tested during their own build. Modules are cross-tested using [Cucumber](http://cukes.info/), launched with:

```
make init
```

### Version bump

* before development: `env VERSION=0.42.1 make set-dev-version`
* right before releasing: `env VERSION=0.42.1 make set-release-version`

### Support

1. Go to the issues section of the sync repo
   (https://github.com/3musket33rs/sync/issues) and search for an answer to your
   question or problem.
2. If no answer exists, file a new ticket!  Somebody will typically respond
   within a few hours.

It's that easy.


## License

[Apache License](http://www.apache.org/licenses/LICENSE-2.0)
