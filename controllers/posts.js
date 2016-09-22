var mongoose = require('mongoose');
var Post = mongoose.model('post');
var controller = {}

// Shared function to load Post from ID params

controller.load = function(req,res,next,id) {
  Post.findById(id, function(err,post) {
    if(err) return next(err);
    if(!post) return res.send(404);
    req.post = post;
    next();
  });
}

controller.index = [
  function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    Post.find({}, function(err, posts) {
      if(err) return next(err);
      res.json(posts);
    });
  }
];

controller.create = [
  // Validation of form attributes
  function(req, res, next) {
    if("name" in req.body && "title" in req.body && "message" in req.body) {
      next();
    } else {
      res.send(400);
    }
  },
  // Create Post and send back JSON
  function(req, res, next) {
    Post.create(req.body, function(err, post) {
      if(err) return next(err);
      res.json(post);
    });
  }
];

controller.update = [
  function(req, res, next) {
    // Update post, send back in JSON
    for(key in req.body) {
      req.post[key] = req.body[key];
    }
    req.post.save(function(err, post) {
      res.json(post);
    });
  }
];

module.exports = controller;
