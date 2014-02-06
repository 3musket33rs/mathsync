---
layout: default
title: MathSync
---

# MathSync

Data synchronization using a mathematical aproach.

## Introduction

The goal of this tiny library is to easily allow web applications to get in synchronization with their server after some time offline. When coming online, one would expect to locally see items created and modified by other users as well as to see items deleted to disappear. Despite bringing better interactivity to the application, real time notifications are not sufficient and should be combined with synchronization.

The simplest way to achieve synchronization would be to request the whole dataset from the server each time one is coming online. This works very well but does not scale as the dataset to be transferred to the application grows.

The second idea that is generally put in place is to write changes made on the server dataset to a changelog and record last synchronization checkpoint on each client. When a client is coming online, it fetches all changes since its last checkpoint and updates its local checkpoint. This assumes an infrastructure to log changes on the server.

This library works differently by being able to create a compressed data structure representing the whole state of the server that the client will be able to decode if there are less than a given number of changes between its state the server's one. By iterating on compression levels until the client decodes the datastructure it provides an network-savy algorithm to get a consistent state.

## Workflow

1. Client records changes being made while offline
2. Client pushes those changes to the server and handles conflicts
3. Client blindly pulls changes from the server

The library only deals with the third item so that it lets the application choosing how to record offline changes and handle conflicts because those are business specific. When fetching changes the library can simply take everything coming from the server. For that to work one only needs to provide the source of items, how to serialize/deserialize them, and how to fetch the data structure on the server.

Get started on [javascript](/jsdoc) or in [java](/javadoc).

## Performances

The algorithm requires `O(log(n))` roundtrips to the server and consumes a total bandwidth of `O(n)` where `n` is the number of items which changed on the server since the last synchronization. Performances are not affected byt the total size of the dataset. Underlying algorithm greatly inspired from [What's the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf).

Nice features:

* underlying structure can be computed ahead of time
* self-stabilizing algorithm (an error is corrected at the next synchronization)
* does not require the server to record all changes

## License

This work is licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
