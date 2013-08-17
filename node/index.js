function init(store) {
  var that = {};

  that.get = function(size) {
    return store.getAll();
  }

  return that;
}

module.exports = init;