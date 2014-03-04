var LocalStrategy = require('passport-local').Strategy;
var usermodel = require('../app/hbase-models/user.js');
var md5 = require('MD5');


module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    usermodel.findById(id, function (err, result) {
      done(err, result);
    });
  });

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      usermodel.findById(md5(email), function (err, result) {
        if (err) { return done(err) }
        if (!result) {
          return done(null, false, { message: 'Unknown user' + email })
        }
        var user = result;
        if (!usermodel.authenticate(password, user)) {
          console.log('Invalid password');
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user);
      });
    }
  ));
}
