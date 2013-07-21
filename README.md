# sync

__WORK IN PROGRESS__

Almost transparent synchronization between browser and server.

## API

### Client - Local Storage

Once the library is installed, `window.localStorage` can be used as usual and will get automatic synchronization with the server counterpart.

#### Maps all keys to the server

    var setup = require('sync-client-localStorage')
    setup(window.localStorage);

#### Maps a subset of keys to the server

    var setup = require('sync-client-localStorage')
    setup(window.localStorage, {
      filter: function (key) { return key.length > 3; }
    });

#### More efficient key compression

    var setup = require('sync-client-localStorage')
    setup(window.localStorage, {
      stringify: function (key, value) {
        return key + '-' + value;
      },
      parse: function (serialized) {
        var a = serialized.split('-', 2);
        return { k: a[0], v: a[1] };
      }
    });

## Inspiration

* algorithm described in [What’s the Difference? Efficient Set Reconciliation without Prior Context](http://conferences.sigcomm.org/sigcomm/2011/papers/sigcomm/p218.pdf)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
