var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');

// Middleware
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); // For user sessions
var cookieSession = require('cookie-session');

// Models need to be loaded before controllers
require('./models/post');
require('./models/user');
var posts = require('./controllers/posts');
var users = require('./controllers/users');
var sessions = require('./controllers/sessions');


// Defining Express Middleware
app.use(logger());
app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({secret: 'key'}));


var notImplemented = function(req,res) {
  res.send(501)
}

mongoose.connect('mongodb://localhost/test')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  // Posts
  app.get('/posts.json', posts.index);   // Read all (index action)
  app.get('/posts/new', notImplemented);
  app.get('/posts/:postId', notImplemented); // Read one (show action)
  app.post('/posts.json', posts.create);  // Create
  app.put('/posts/:postId', posts.update); // Update
  app.delete('/posts/:postId', notImplemented); // Destroy

  // Comments
  app.post('/posts/:postId/comments', notImplemented);
  app.delete('/posts/:postId/comments/:commentId', notImplemented);

  // Users
  app.get('/users', users.index);
  app.get('/signup', users.new);
  app.post('/users', users.create);
  app.put('/users/:userId', notImplemented);
  app.delete('/users/:userId', notImplemented);
  app.get('/signin', sessions.new);
  app.post('/signin', sessions.create);
  app.get('/signout', sessions.destroy);

  app.param('postId', posts.load);
  app.param('userId', users.load);
  


  app.listen(port, function(err) {
    console.log("Sever started on %s", port);
  });
});
