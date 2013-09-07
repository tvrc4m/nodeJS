
//路径常量
global.ROOT=__dirname;

require('./core/config.js');
require("./core/common.js");

var express = require('express')
  , http = require('http')
  //,https=require('https')
  , redis = require('redis')
  , RedisStore = require('connect-redis')(express)
  , path=require('path')
  //, fs=require('fs');

/*
 * Instantiate redis
 */

if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  var client = exports.client  = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
  var client = exports.client  = redis.createClient();
}

var sessionStore = exports.sessionStore = new RedisStore({client: client});

/*
 * Create and config server
 */

var app = exports.app = express();

app.configure(function() {
  app.set('port', process.env.PORT || APP_PORT || 6789);
  app.set('view engine', 'jade'); 
  app.set('views', VIEW+ APP_THEME);
  app.use(express.static(STATIC));
  app.use(express.bodyParser());
  app.use(express.cookieParser(SESSION_SECRET));
  app.use(express.session({
    key: SESSION_KEY,
    store: sessionStore
  }));
  app.use(app.router);
});

/**单入口路由**/

app.all('*',function(req,res,next){
  if(/socket\.io/.test(req.route.path)) next();
  var group=req.query.group || req.body.group || DEFAULT_GROUP;
  var action=req.query.app || req.body.app || DEFAULT_ACTION;
  var method=req.query.act || req.body.act || DEFAULT_METHOD;
  
  var file=ACTION+group+"/"+action+".action.js";
  path.exists(file,function(exists){
    if(exists){
      var controller=require(file);
      if(controller.prototype.hasOwnProperty(method)){
        new controller(req,res)[method]();
      }else{
        res.render('error');
      }
    }else{
      res.render('error');
    }
  });
});

/*
 * Web server
 */

global.server=exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Balloons.io started on port %d', app.get('port'));
});
/*
var options = {
    key: fs.readFileSync('./openssl/privatekey.pem'),
    cert: fs.readFileSync('./openssl/certificate.pem'),
    requestCert:true,
    rejectUnauthorized:false
};

global.server=exports.server = https.createServer(options,app).listen(app.get('port'), function() {
  console.log('Balloons.io started on port %d', app.get('port'));
});
*/
/*
 * Socket.io
 */

require('./core/socket');

/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});

