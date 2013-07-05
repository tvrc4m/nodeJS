
var app = module.parent.exports.app,
utils=require('../utils'),
passport = require('passport'),
client=module.parent.exports.client,
config=require('../config');

app.get('/nodejs/login',function(req,res,next){
	if(req.session.user){
		res.redirect('/nodejs');
	}else{
		res.render('login');
	}
});
app.get('/nodejs',function(req,res,next){
	if(req.session.user){
		var uid=req.session.user.uid;
		utils.getUserinfo(uid,client,function(userinfo){
			utils.getUserFriends(uid,client,function(friends){
				utils.getUserFriendsDetail(friends,client,function(fd){
					utils.getUserPrivateUnreadMsgCount(uid,client,function(unread){
						res.render('friend',{'userinfo':userinfo,'friends':fd,'unread':unread,'IMGURL':'http://pics.julejie.com/','tab':'friend'});
					});
				});
			});
		});
	}else{
		res.redirect('/nodejs/login');
	}
});

app.get('/nodejs/event',function(req,res,next){
	if(req.session.user){
		var uid=req.session.user.uid;
		utils.getUserinfo(uid,client,function(userinfo){
			utils.getUserEvent(uid,client,function(events){
				utils.getUserEventDetail(events,client,function(ed){
					res.render('event',{'userinfo':userinfo,'events':ed,'IMGURL':'http://pics.julejie.com/','tab':'event'});
				});
			});
		});
	}else{
		res.redirect('/nodejs/login');
	}
});
app.get('/nodejs/session',function(req,res,next){
	if(req.session.user){
		var uid=req.session.user.uid;
		utils.getUserinfo(uid,client,function(userinfo){
			utils.getUserChatSession(uid,client,function(sessions){
				res.render('chat_list',{'userinfo':userinfo,'sessions':sessions,'IMGURL':'http://pics.julejie.com/','tab':'session'});
			});
		});
	}else{
		res.redirect('/nodejs/login');
	}
});
app.get('/nodejs/chat/friend',function(req,res,next){
	if(req.session.user){
		var uid=req.session.user.uid;
		var fuid=req.query.uid;
		utils.getUserFriends(uid,client,function(friends){
			utils.getUserFriendsDetail(friends,client,function(fd){
				utils.getUserinfo(fuid,client,function(currentuser){
					utils.getUserPrivateUnreadMsgCount(uid,client,function(unread){
						utils.getUserPrivateUnreadMsg(uid,fuid,1,50,client,function(msgs,next){
							res.render('friend_chat',{'userinfo':req.session.user,'current':currentuser,'friends':fd,'unread':unread,'IMGURL':'http://pics.julejie.com/','histories':[],'unreadmsgs':msgs});
						});
					});
				});
			});
		});
	}else{
		res.redirect('/nodejs/login');
	}
});
app.get('/nodejs/chat/event',function(req,res,next){
	if(req.session.user){
		var uid=req.session.user.uid,
		eid=req.query.eid;
		utils.getUserinfo(uid,client,function(userinfo){
			utils.getUserEvent(uid,client,function(events){
				utils.getUserEventDetail(events,client,function(ed){
					utils.getEventinfo(eid,client,function(eventinfo){
						res.render('event_chat',{'userinfo':userinfo,'eventinfo':eventinfo,'events':ed,'IMGURL':'http://pics.julejie.com/','histories':[]});
					});
				});		
			});
		});
	}else{
		res.redirect('/nodejs/login');
	}
});
app.post('/nodejs/login',function(req,res,next){
	var email=req.body.email,password=req.body.password;
	//passport.authenticate('local',{failureRedirect:'/nodejs/login',successRedirect:'/nodejs/room'});
	utils.getUserinfoByEmail(email,client,function(userinfo){
		if(userinfo){
			req.session.user=userinfo;
			res.redirect('/nodejs');
		}else{
			res.redirect('/nodejs/login');
		}
	});
	
});