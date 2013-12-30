
//路径常量
global.ROOT=__dirname;

require('./core/config.js');
require("./core/common.js");
require('./core/function.js');
require('./core/db.js');
require('./core/model.js');

var express = require('express')
  , http = require('http')
  //,https=require('https')
  , redis = require('redis')
  , RedisStore = require('connect-redis')(express)
  , path = require('path')
  , domain = require('domain')
  , fs = require('fs');

/*
 * Instantiate redis
 */

var client = exports.client  = redis.createClient(REDIS_PORT,REDIS_HOST);
//client.auth(rtg.auth.split(':')[1]);

var sessionStore = exports.sessionStore = new RedisStore({client: client});

/*
 * Create and config server
 */

var app = exports.app = express();

app.configure(function() {
  app.set('port', process.env.PORT || APP_PORT || 6789);
  // app.set('view engine', 'jade'); 
  app.set('view engine', 'html'); 
  app.engine('.html', require('ejs').__express);
  app.set('views', VIEW+ APP_THEME);
  // app.use(express.static(STATIC));//使用Ngix处理静态请求
  app.use(express.bodyParser());
  app.use(express.cookieParser(SESSION_SECRET));
  app.use(express.session({
    key: SESSION_KEY,
    store: sessionStore
  }));
  app.use(app.router);
  app.use(function(req,res,next){
    var d = domain.create();
    //监听domain的错误事件
    d.on('error', function (err) {
      res.statusCode = 500;
      res.json({sucess:false, messag: '服务器异常'});
      d.dispose();
    });
    d.add(req);
    d.add(res);
    d.run(next);
  });
});

/**单入口路由**/

app.all('*',function(req,res,next){
  if(/socket\.io/.test(req.route.path)) next();
  global.REQ=req;
  global.RES=res;
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
  init global
*/

require('./core/init.js');

/*
 * Socket.io
 */

require('./core/socket');

var f_error_log=fs.createWriteStream(error_log,{flags:'a'});
/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
//   //console.log('Exception: ' + err.stack);
  f_error_log.write('Exception: '+err.stack+'\n');
});

