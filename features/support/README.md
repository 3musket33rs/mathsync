# Test servers and clients

Simplistic key/value store example with alphanumeric keys and values.

A data item is `key + value`, serialized by concatenating key and value, separated by `:` and taking their `UTF-8` bytes (key and value are alphanumeric strings). Uses default (`SHA-1`) hashing and default (`3`) spread.

## Servers

* starts with an empty dataset
* listens to port given by environment variable `PORT`
* writes its pid to file given by environment variable `PIDFILE` once it is ready to serve requests
* handles `GET /summary/:level` where level is a positive integer and return the summary corresponding to the current state at the requested level
* TODO: describe ruby binding to launch/modify state

## Clients

* fetches summaries at `GET http://localhost:PORT/summary/:level`
* TODO: describe ruby binding to start the client, specify target port and modify/fetch state
