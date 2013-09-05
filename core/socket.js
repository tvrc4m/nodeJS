
//定义变量
var parent=module.parent.exports,
client=parent.client,
server=parent.server,
sio=require('socket.io'),
parseCookies=require('connect').utils.parseSignedCookies,
sessionStore=parent.sessionStore,
cookie=require('cookie'),
config=require("./config.js");

io=sio.listen(server);

io.set('authorization',function(hsData,accept){
	if(hsData.headers.cookie){
		var cookies=parseCookies(cookie.parse(hsData.headers.cookie),SESSION_SECRET),sid=cookies[SESSION_KEY];
		hsData.user={uid:3,uname:"veteric"};
		return accept(null,true);
		sessionStore.load(sid,function(err,session){
			if(err || !session.user) return accept('无效Cookie!',false);
			hsData.user=session.user;
			return accept(null,true);
		});
	}else{
		return accept('no cookie,please login',false);
	}
});

io.configure(function(){
	io.set('store',new sio.RedisStore({client:client}));
	io.enable('browser client minification');
  	io.enable('browser client gzip');
});

io.sockets.on('connection',function(socket){
	var hs = socket.handshake,user=hs.user;
	
	socket.join(user.uid);

	var fs=require('fs');

	['user','chat','follow'].forEach(function(dir){
		fs.readdir(SOCKET+dir,function(err,files){
			files.forEach(function(filename){
				if (!/\.js$/.test(filename)) return;
  				require(SOCKET+dir+"/"+filename)(socket,user);
			});
		});
	});
});


