---
layout: default
title: Lean more
---

## Introduction

The web can currently be built using applications storing some data in the browser, allowing to work while the device is disconnected from the Internet. Once the device comes back online, such applications need to synchronize with whatever other users have pushed to the server in the meantime. It includes item creation, deletion and modification. This library aims at making this synchronization easier.

One common response to that need is real time notifications, but those are not sufficient as events may be dropped if the device takes too much time to reconnect. The simplest way to achieve synchronization would be to request the whole dataset from the server each time one is coming online. This works very well but does not scale as the dataset to be transferred to the application grows. The second idea that is generally put in place is to write changes made on the server dataset to a changelog and record last synchronization checkpoint on each client. When a client is coming online, it fetches all changes since its last checkpoint and updates its local checkpoint. This assumes an infrastructure to log changes on the server.

Another important aspect is that synchronization solutions are usually made to handle the whole database. This is generally not the expected behavior as users should only receive items they have the right to see and which are of interest to them. The checkpoint way for example requires one to go through the whole log of changes to find out no item relevant to the user changed.

This library works differently by being able to create a compressed data structure representing the whole state of the server that the client will be able to decode if there are less than a given number of changes between its state the server's one. By iterating on compression levels until the client decodes the datastructure it provides an network-savy algorithm to get a consistent state.

## Workflow

This library expects the following workflow:

1. Client records changes being made while offline
2. Client pushes those changes to the server and handles conflicts
3. Client blindly pulls changes from the server

The library only handles with the third item so that it lets the application choosing how to record offline changes and handle conflicts because those are business specific. The application may be much more efficient by batching some updates to specific endpoints on the server rather than editing items one by one. When fetching changes from the server the library can simply take everything coming from the server. For that to work one only needs to provide:

* the source of local items
* how to fetch the data structure from the server
* how to serialize/deserialize items

Get started in [javascript](/javascript.html) or in [java](/java.html).

## Performances

The algorithm requires `O(log(n))` roundtrips to the server and consumes a total bandwidth of `O(n)` where `n` is the number of items which changed on the server since the last synchronization. Performances are not affected byt the total size of the dataset. Underlying algorithm greatly inspired from [What's the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

Apart from performances it has a few interesting features:
* underlying structure can be computed ahead of time in map/reduce jobs
* algorithm is self-stabilizing (an error is corrected at the next synchronization)
* server is not required to record all changes

## License

This work is licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
