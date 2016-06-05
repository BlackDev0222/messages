var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {type: String, required: true},
  password_digest: {type: String, required: true},
  createdAt: {type:Date, default: Date.now}
});

mongoose.model('user', UserSchema);
