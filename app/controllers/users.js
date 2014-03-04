
/**
 * Module dependencies.
 */

var usermodel = require('../hbase-models/user.js');
var md5 = require('MD5');

/**
 * Show Sign In Page
 */
exports.showSignIn = function (req, res) {
  res.render('users/signin', {
    title: 'Sign in',
    message: req.flash('error'),
  });
}

/**
 * Show Sign Up Page
 */
exports.showSignUp = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    error: ''
  });
}

/**
 * Logout, and redirect to signin page
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/signin');
}

/**
 * When there is returnTo in session, redirect to originalURL
 */
exports.session = function (req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo);
    delete req.session.returnTo;
    return;
  }
  res.redirect('/');
}

/**
 * Create user
 */

exports.create = function (req, res, next) {
  var user = req.body;
  usermodel.save(user, function (err, result) {
    if (err) {
      return res.render('users/signup', {
        error: "Your Email or Username already exists.",
        title: 'Sign up'
      });
    }
    if (result) {
      user.id = result.insertId;
      // manually login the user once successfully signed up
      req.login(user, function(err) {
        if (err) {
          //console.log(err);
          next(err);
        }
        return res.redirect('/');
      });
    }
  });
}

/**
 *  Show profile
 */
exports.showProfile = function (req, res) {
  var user = req.profile
  res.send(user);
  // res.render('users/profile', {
  //   title: user.name,
  //   user: user
  // });
}

exports.showtestuser = function (req, res) {
  usermodel.findById(md5('lgrcyanny@gmail.com'), function (err, results) {
    res.send(results);
  });
}

exports.list = function (req, res) {

}

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  usermodel.findById(id, function (err, result) {
    if (err) return next(err);
    var user = result;
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
}
