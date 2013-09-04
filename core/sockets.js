
//定义变量
var parent=module.parent.exports,
app=parent.app,
server=parent.server,
client=parent.client,
sessionStore=parent.sessionStore,
sio=require('socket.io'),
parseCookies=require('connect').utils.parseSignedCookies,
cookie=require('cookie'),
config=require('./config'),
fs=require('fs');

var io=sio.listen(server);

io.set('authorization',function(hsData,accept){
	if(hsData.headers.cookie){
		var cookies=parseCookies(cookie.parse(hsData.headers.cookie),config.session.secret),
		sid=cookies[config.session.key];
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
	var hs = socket.handshake,
	Luserinfo=hs.user,
	Luid = Luserinfo.uid, //当前登录用户uid
	Luname=Luserinfo.uname,
	Lavatar=Luserinfo.avatar1,
	now = new Date();
	socket.join(Luid);
	
	utils.onlineInit(Luserinfo,client,function(unreadmsgs){
		
	});
	//朋友面板列表(点击触发)
	socket.on('friend channel',function(data){
		utils.getUserFriends(Luid,client,function(friends){
			utils.getUserFriendsDetail(friends,client,function(fd){
				utils.getUserPrivateUnreadMsgCount(Luid,client,function(unread){
					socket.emit('list friend',{friends:fd,unread:unread});
				});
			});
		});
	});
	//聊天会话面板
	socket.on('session channel',function(data){
		utils.getUserChatSession(Luid,client,function(sessions){
			socket.emit('list session',{sessions:sessions});
		});
	});
	//参与及创建的活动面板
	socket.on('event channel',function(data){
		utils.getUserEvent(Luid,client,function(events){
			utils.getUserEventDetail(events,client,function(ed){
				socket.emit('list event',{events:ed});
			});
		});
	});
	//开启与某人的私聊对话框
	socket.on('start private chat',function(data){
		var touid=data.uid;
		utils.startPrivateChat(Luid,touid,client);
		utils.getUserinfo(touid,client,function(userinfo){
			utils.getUserPrivateUnreadMsg(Luid,touid,1,50,client,function(unread){
				socket.emit('open private window',{'userinfo':userinfo,'unread':unread});
			});
		});
	});
	//关闭与某人的私聊对话框
	socket.on('close private chat',function(data){
		var touid=data.uid;
		utils.closePrivateChat(Luid,touid,client);

	});

	socket.on('start event chat',function(data){
		var eid=data.eid; //群聊活动id
		utils.startEventChat(Luid,eid,client);
		utils.getEventinfo(eid,client,function(eventinfo){
			utils.getUserEventUnreadMsg(Luid,eid,1,50,client,function(unread){
				socket.emit('open event window',{'eventinfo':eventinfo,unread:unread});
			});
		});
	});

	socket.on('close event chat',function(data){
		var toeid=data.eid;
		utils.closeEventChat(Luid,toeid,client);
	});

	//私聊中我发送消息
	socket.on('my private msg',function(data){
		var content=data.msg.replace("\n",""),
		touid=data.uid; //私聊对方uid
		if(content.length>0 && touid){
			var ctime=new Date();
			//消息完整信息
			var newdata={
				uid:Luid,
				uname:Luname,
				avater:Lavatar,
				content:content,
				ctime:ctime,
				type:'message',
				status:0
			};
			//将消息存储到redis|mongodb
			utils.saveUserPrivateChatMsg(Luid,touid,newdata,client,function(index){
				utils.sendPrivateMsg(Luid,touid,index,client,function(online,opend,unreadcount){
					io.sockets.in(Luid).emit('new private msg',{msg:newdata,to:touid});
					if(online && opend){
						io.sockets.in(touid).emit('new private msg',{msg:newdata,to:Luid});
					}else if(online && !opend){
						io.sockets.in(touid).emit('new private msg notice',{'total':unreadcount,'uid':Luid});
					}
				});
			});
		}
	});
	//在活动中我发送消息
	socket.on('my event msg',function(data){
		var content=data.msg.replace("\n","");
		var eid=data.eid; //群聊活动id
		if(content.length>0 && eid){
			//消息完整信息
			var newdata={
				uid:Luid,
				uname:Luname,
				avater:Lavatar,
				content:content,
				atTime:new Date(),
				status:0
			};
			utils.saveUserEventChatMsg(Luid,eid,newdata,client,function(length){
				utils.talkWithEvent(Luid,eid,newdata,length,client,function(touid,online,opend,unreadcount){
					if(online && opend){
						io.sockets.in(touid).emit('new event msg',{msg:newdata,to:eid});
					}else if(online && !opend){
						io.sockets.in(touid).emit('new event msg notice',{'total':unreadcount,'eid':eid});
					}
				});
			});
		}
	});

	socket.on('unread private msg',function(data){
		var fromuid=data.uid,page=data.page,limit=50;

	});

	socket.on('read private msg',function(data){
		var fromuid=data.uid,page=data.page,limit=50;
		utils.getUserPrivateUnreadMsg(Luid,fromuid,page,limit,client,function(msgs,next){
			io.sockets.in(uid).emit('read private unread msg',{msgs:msgs,next:next});
		});
	});

	socket.on('read event msg',function(data){
		
	});

	socket.on('disconnect',function(){
		var hs = socket.handshake;
		hs.user=null;
		utils.logout(Luid,client,function(status){
			if(status) socket.leave(Luid);
		});
	});
});