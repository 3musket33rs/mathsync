# Test servers and clients

Simplistic key/value store example with alphanumeric keys and values. A data item is `key + value`, serialized by concatenating key and value, separated by `:` and taking their `UTF-8` bytes (key and value are alphanumeric strings). Uses default (`SHA-1`) hashing and default (`3`) spread.

Servers and clients are define a `node.rb` in their folder which is `require`d and then the methods it defines serves to communicate with the server.

## Servers

`node.rb` defines:

* `server_start(listenport)`:
** starts an HTTP server listening on `listenport`, this method must wait that the server is up and running before returning
** serves summaries at `GET /summary/:level`
** starts with an empty dataset
* `server_stop()`: stops the server, waits for the server to be stopped before returning
* `server_put(key, value)`: sets a key to a value in the dataset and returns the dataset after modification
* `server_delete(key)`: unsets a key from the dataset and returns the dataset after modification

## Clients

`node.rb` defines:

* `client_start(serverport)`:
** fetches summaries from `GET http://localhost:serverport/summary/:level`
** starts with an empty dataset
* `client_stop()`: stops the client, waits for the client to be stopped before returning
* `client_put(key, value)`: sets a key to a value in the dataset and returns the dataset after modification
* `client_delete(key)`: unsets a key from the dataset and returns the dataset after modification
* `client_sync(key)`: syncs with the server and returns the dataset after synchronization
* `client_get(key)`: returns the current state of the client
