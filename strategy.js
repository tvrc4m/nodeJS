
var passport=require('passport'),
localStrategy=require('passport-local').Strategy,
client=module.parent.exports.client,
crypto = require('crypto'),
utils=require('./utils'),
config=require('./config');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //查询用户表
  utils.getUserinfo(client,user,done);
});
