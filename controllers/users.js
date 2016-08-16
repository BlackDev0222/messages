var mongoose = require('mongoose');
var User = mongoose.model('user');
var bcrypt = require('bcrypt');
var controller = {}
// Shared function to load User from ID params

controller.load = function(req,res,next,id) {
  User.findById(id, function(err,user) {
    if(err) return next(err);
    if(!user) return res.send(404);
    req.user = user;
    next();
  });
}

controller.index = [
  function(req, res, next) {
    User.find({}, function(err, users) {
      if(err) return next(err);
      res.json(users);
    });
  }
]

controller.new = [
  function(req, res) {
    res.send("<form method='post' action='/users'><input name='email'></br><input type='password' name='password_digest'></br><button type='submit'>Submit</button></form>"); // Render Sign-In form
  }
]

var storage = "";

controller.create = [
  function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
      if(err) return next(err);
      bcrypt.hash(req.body.password_digest, salt, function(err, hash) {    // Take in password from form field, salt and hash.
        if(err) return next(err);
        storage = hash;                                   // Then store it in place of it in response body.
      });
    });
    User.create({email: req.body.email, password_digest: storage}, function(err, post) {
      if(err) return next(err);
      res.redirect('/users');
    });
  }
];

module.exports = controller;

