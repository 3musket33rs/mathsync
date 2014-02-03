# Test servers and clients

Simplistic key/value store example with alphanumeric keys and values. A data item is `key + value`, serialized by concatenating key and value, separated by `:` and taking their `UTF-8` bytes (key and value are alphanumeric strings). Uses default (`SHA-1`) hashing and default (`3`) spread.

Servers define a `server.js` file in their folder which is `require`d and returns a module to interact with the server. Same for clients with a `client.js` file.

## Servers

`server.js` module is a function `start(listenport)` which takes the port to listen to and returns a promise fullfilled with the actual server:

* server is an HTTP server listening on `listenport`
* serves summaries at `GET /summary/:level`
* starts with an empty dataset

The actual server has methods:

* `stop()`: stops the server
* `clear()`: clears the dataset
* `put(key, value)`: sets a key to a value in the dataset
* `delete(key)`: unsets a key from the dataset

All method return a promise fullfilled when the action is actually performed.

## Clients


`client.js` module is a function `start(serverport)` which takes the port to the server is started at to and returns a promise fullfilled with the actual client:

* fetches summaries from `GET http://localhost:serverport/summary/:level`
* starts with an empty dataset

The actual client has methods:

* `stop()`: stops the client
* `clear()`: clears the dataset
* `put(key, value)`: sets a key to a value in the dataset
* `delete(key)`: unsets a key from the dataset
* `sync()`: syncs with the server
* `get()`: retrieves the client state

All method return a promise fullfilled when the action is actually performed.
