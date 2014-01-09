---
title: MathSync
---

# MathSync

Data synchronization using a mathematical aproach.

## Features

Helping synchronization between clients and servers accross a network. The client is expected to have pushed its changes to the server and then requests the library to pull changes from the server.

Clients of the library must provide on the server a way to serialize items and an endpoint, as well as a way to deserialize  items and to access the server endpoint on the client.

The algorithm requires `O(log(n))` roundtrips to the server and consumes a total bandwidth of `O(n)` where `n` is the number of items which changed on the server since the last synchronization. Underlying algorithm greatly inspired from [What’s the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

Nice features:

* underlying structure can be computed ahead of time
* self-stabilizing algorithm (an error is corrected at the next synchronization)
* does not require the server to record all changes

## License

[Apache License](http://www.apache.org/licenses/LICENSE-2.0)
