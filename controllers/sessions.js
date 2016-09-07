var mongoose = require('mongoose');
var User = mongoose.model('user');
var bcrypt = require('bcrypt');
var controller = {};

controller.new = [
  function(req, res, next) {
  res.send("<form method='post' action='/signin'><input name='email'></br><input type='password' name='password'></br><button type='submit'>Submit</button></form>"); // Render Sign-In form
  }
];

controller.create = [
  function(req, res, next) {
    var input = req.body;
    if (User.find({email: input.email}, function(err, user) {
      if(err) {
        return res.send('No such user found');
      }
      bcrypt.compare(input.password, user[0].password_digest, function(err, match) {
        if(err) return next('Wrong username or password.');
        req.session.user = user;
        console.log("User signed in");
        res.redirect('/');
        });
    }));
    console.log(req.session.user);
  }
];

controller.destroy = [
  function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
  }
];

module.exports = controller;

