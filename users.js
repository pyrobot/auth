var users = [
    { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith', apikey: '1' },
    { id: '2', username: 'john', password: 'password', name: 'John Doe', apikey: '2' }
];


exports.find = function(id, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id) {
      return done(null, user);
    }
  }
  return done(null, null);
};

exports.findByUsername = function(username, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return done(null, user);
    }
  }
  return done(null, null);
};

exports.findByApiKey = function(apikey, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.apikey === apikey) {
      return done(null, user);
    }
  }
  return done(null, null);
};
