var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('../build/moment.min.js'); // Time formatter

var PostSchema = new Schema({
  name: String,
  title: String,
  message: String,
  createdAt: {type:String, default: function() {
    return moment().format('MMMM Do YYYY, h:mm a');  }
  }
});

mongoose.model('post', PostSchema);
