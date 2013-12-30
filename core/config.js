
global.CORE=ROOT+"/core/";

global.MODEL=ROOT+"/model/";

global.MEDIUM=ROOT+"/medium/";

global.ACTION=ROOT+"/action/";

global.SOCKETS=ROOT+"/socket/";

global.VIEW=ROOT+"/view/";

global.STATIC=ROOT+"/static/default/";

global.APP_PORT=6789;

global.APP_THEME="default";

global.SESSION_SECRET="tvrc4m.yicker";

global.SESSION_KEY="yicker";

global.COOKIE_OPTION={maxAge:3600*24*30,httpOnly:true,path:'/',secure:true,domain:'.yicker.cn'}

global.DEFAULT_GROUP="home";

global.DEFAULT_ACTION="index";

global.DEFAULT_METHOD="index";

global.MYSQL_URL='mysql://root:@localhost:3306/fastty';

global.MONGODB_URL="mongodb://localhost:27017/yicker";//'mongodb://fastty2013:fastty2013mongodb@localhost:27017/fastty';

global.REDIS_HOST="127.0.0.1";

global.REDIS_PORT=6379;

global.USER_DEFAULT_SCORE=100;	//注册时的默认积分值

global.error_log="/var/log/yicker.js.log";