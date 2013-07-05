
var client=module.parent.exports.client;

var mysql=require('mysql'),db=null;
var dboption={	host: '127.0.0.1',  
    			port: 3306,  
    			user: 'root',  
    			password: '',  
    			database: 'JuLeJiedianzi'
    		};

if(mysql.createClient) {  
    db = mysql.createClient(dboption);  
} else {  
    db =mysql.createConnection(dboption); 
    db.connect(function(err) {  
        if(err) {  
            console.error('connect db ' + dboption.host + ' error: ' + err);  
            process.exit();  
        }  
    });  
}
function timestamp(){
	return new Date().getTime();
}

// 需要登录才可进行聊天功能
exports.needlogin=function(req,res,next){
	if(req.session.user) next();
	else res.redirect('/nodejs/login');
};

exports.onlineInit=function(userinfo,client,fn){
	var uid=userinfo.uid;
	// 将用户添加到在线set中
	client.sadd('users_online',uid);
	// 设置用户状态
	exports.setUserStatus(uid,1,client);
	//获取用户的朋友圈
	exports.getUserFriends(uid,client,function(friends){
		//循环朋友圈,保存此用户在线的朋友
		friends.forEach(function(fuid,index){
			//查询所有的在线用户,此朋友是否在线中
			client.sismember('users_online',fuid,function(err,online){
				//如果在线,则添加到自己建立的朋友在线数组中
				if(online) client.sadd('user_'+uid+'_online_friends',fuid);
			});
		});
	});
	//获取此用户所参与的群
	exports.getUserEvent(uid,client,function(events){
		//循环群,将用户uid添加到群的在线用户中
		events.forEach(function(event){
			client.sadd('event_'+event+'_online_users',uid);
		});
	});
	exports.getUserPrivateUnreadMsg(uid,1,1,40,client,function(msgs,next){
		
	});

	//获取用户之前未读的数据
	exports.getUserPrivateUnreadMsgCount(uid,client,function(msgs){
		if(fn) fn(msgs);
	});
};
//注销时的操作
exports.logout=function(uid,client,fn){
	//注销或断开连接时退出在线状态
	client.srem('users_online',uid);
	//设置用户状态。-1表示离线
	exports.setUserStatus(uid,-1,client);
	//遍历朋友圈，在朋友的在线列表中删除自己
	exports.getUserFriends(uid,client,function(friends){
		friends.forEach(function(friend){
			var fuid=friend.uid;
			client.srem('user_'+fuid+'_online_friends',uid,function(err,ok){
				
			});
		});
	});
	//从用户参与的群的在线列表中删除自己
	exports.getUserEvent(uid,client,function(events){
		//循环群,将用户uid添加到群的在线用户中
		events.forEach(function(event){
			client.srem('event_'+event+'_online_users',uid);
		});
	});
	fn(true);
};

exports.getUserinfo=function(uid,client,fn){
	var key='user_'+uid+'_info';
	client.exists(key,function(err,exist){
		if(exist){
			client.hgetall(key,function(err,userinfo){
				if (!err) fn(userinfo);
				else fn(null);
			});
		}else{
			exports.setUserinfo(uid,client,fn);
		}
	});
	
};
exports.setUserinfo=function(uid,client,fn){
	db.query('select * from jlj_user where uid='+uid,function(err,res,field){
		if(res){
			client.hmset('user_'+uid+'_info',res[0]);
			if(fn) fn(res[0]);
		}else{
			fn('');
		}
	});
};

exports.getUserinfoByEmail=function(email,client,fn){
	client.hgetall(email,function(err,userinfo){
		if(!err && !userinfo){
			db.query('select * from jlj_user where email="'+email+'"',function(err,res,field){
				client.hmset(email,res[0]);
				fn(res[0]);
			});
		}else if(!err && userinfo){
			fn(userinfo);
		}
		else fn(null);
	});
};

exports.getUserFriends=function(uid,client,fn){
	client.exists('user_'+uid+'_friends',function(err,exist){
		if(exist){
			client.smembers('user_'+uid+'_friends',function(err,fs){
				fn(fs);
			});
		}else{
			exports.setUserFriends(uid,client,function(fs){
				fn(fs);
			});
		}
	});
};
//获取朋友中的详细列表
exports.getUserFriendsDetail=function(fs,client,fn){
	var friends=[],len=fs.length;
	if(len==0){
		fn(friends);
		return;
	}
	fs.forEach(function(fuid,index){
		if(fuid==null) return false;
		exports.getUserinfo(fuid,client,function(userinfo){
			friends.push(userinfo);
			if(friends.length==len) fn(friends);
		});
	});
};

exports.setUserFriends=function(uid,client,fn){
	//获取关注的人列表
	db.query('select fuid from jlj_user_follow where uid='+uid,function(err,res,field){
		var friends=[],len=res.length;
		if(len==0){
			fn(friends);
			return false;
		}
		//循环加入
		res.forEach(function(user,index){
			friends.push(user.fuid);
			client.sadd('user_'+uid+'_friends',user.fuid);
			if(index+1==len) fn(friends)
		});
	});
};

exports.getEventinfo=function(eid,client,fn){
	var key='event_'+eid+'_info';
	client.exists(key,function(err,exist){
		if(exist){
			client.hgetall(key,function(err,eventinfo){
				if(!err) fn(eventinfo);
				else fn(null);
			});
		}else{
			exports.setEventinfo(eid,client,fn);
		}
	});
};

exports.setEventinfo=function(eid,client,fn){
	db.query('select * from jlj_event where id='+eid,function(err,res,field){
		if(err) fn(null);
		else{
			client.hmset('event_'+eid+'_info',res[0]);
			fn(res[0]);
		}
	});
};

exports.setUserEvent=function(uid,client,fn){
	var key='user_'+uid+"_events";
	//添加自己创建的活动
	db.query('select id from jlj_event where uid='+uid,function(err,res,field){
		var events=[],len=res.length;
		if(len==0){
			//添加自己加入的活动
			db.query('select event_id from jlj_event_join where uid='+uid+' and isconfirm=1 and isdel=0',function(err,res,field){
				var len2=res.length;
				if(len2==0){
					fn(events);
				}else{
					res.forEach(function(data,index){
						events.push(data.event_id);
						client.sadd(key,data.event_id);
						if(events.length==len+len2){
							//TODO:过滤重复数据
							fn(events);
						}
					});
				}
			});
		}else{
			res.forEach(function(data,index){
				events.push(data.id);
				client.sadd(key,data.id);
				if(events.length==len){
					//添加自己加入的活动
					db.query('select event_id from jlj_event_join where uid='+uid+' and isconfirm=1 and isdel=0',function(err,res,field){
						var len2=res.length;
						if(len2==0){
							fn(events);
						}else{
							res.forEach(function(data,index){
								events.push(data.event_id);
								client.sadd(key,data.event_id);
								if(events.length==len+len2){
									//TODO:过滤重复数据
									fn(events);
								}
							});
						}
					});
				}
			});
		}
	});
};
//获取用户创建及加入的活动
exports.getUserEvent=function(uid,client,fn){
	var key='user_'+uid+"_events";
	client.exists(key,function(err,exist){
		if(exist){
			client.smembers(key,function(err,events){
				if(!err) fn(events);
				else fn([]);
			});
		}else{
			exports.setUserEvent(uid,client,function(events){
				fn(events);
			});
		}
	});
};

exports.getUserEventDetail=function(events,client,fn){
	var detail=[],len=events.length;
	if(len==0) {fn([]);return;}
	events.forEach(function(eid,index){
		exports.getEventinfo(eid,client,function(eventinfo){
			detail.push(eventinfo);
			if(detail.length==len) fn(detail);
		});
	});
};

exports.startPrivateChat=function(uid,touid,client,fn){
	//当用户开启一个聊天窗口时
	//添加此用户打开的聊天界面,添加对方用户uid
	client.sadd('user_'+uid+'_opend_private_chat',touid,function(err,ok){});
	exports.getUserinfo(touid, client, function(userinfo){
		exports.addUserChatSession(uid,{name:userinfo.uname,pic:userinfo.avatar1,type:'private',id:touid},client,function(ok2){});
	});
};

//当私聊开始聊天时
exports.talkWithPrivate=function(uid,touid,data,client,fn){
	exports.sendPrivateMsg(uid,touid,client,function(online,opend,unreadcount){
		if(online) fn();
	});
};

exports.startEventChat=function(uid,eid,client,fn){
	//保存此用户打开的群聊窗口,添加群活动id
	client.sadd('user_'+uid+'_opend_event_chat',eid);
	exports.getEventinfo(eid, client, function(eventinfo){
		exports.addUserChatSession(uid,{name:eventinfo.title,pic:eventinfo.coverimg,type:'event',id:eid},client,function(ok2){});
	});
};

exports.talkWithEvent=function(uid,eid,data,client,fn){
	//获取群活动下面的所有用户
	exports.getEventUsers(eid,client,function(users){
		//循环每个用户,得到用户uid
		users.forEach(function(touid,index){
			//每个用户调用发送群消息的方法
			exports.sendEventMsg(uid,eid,touid,client,function(online,opend,unreadcount){
				//通过返回是否在线,窗口是否打开,未读数量,做下一步操作
				fn(touid,online,opend,unreadcount);
			});
		});
	});
};

// 判断用户是否在线
exports.isOnline=function(uid,client,fn){
	client.sismember('users_online',uid,function(err,online){
		fn(online);
	});
};

exports.isPrivateOpend=function(uid,touid,client,fn){
	//对方的私聊聊天窗口是否打开了
	client.sismember('user_'+uid+'_opend_private_chat',touid,function(err,opend){
		fn(opend);
	});
};

exports.isEventOpend=function(uid,eid,client,fn){
	//对方的群聊聊天窗口是否打开了
	client.sismember('user_'+uid+'_opend_event_chat',eid,function(err,opend){
		fn(opend);
	});
};

exports.setUserStatus=function(uid,status,client,fn){
	client.set('user_'+uid+"_status",status,function(err,update){
		if(fn) fn(update);
	});
};

exports.getEventUsers=function(eid,client,fn){
	var key="event_"+eid+"_allusers";
	client.exists(key,function(err,ok){
		if(ok){
			client.smembers(key,function(err,users){
				if (!err && users) fn(users);
		    	else fn([]);
			});
		}else{
			exports.setEventUsers(eid, client,function(users){
				fn(users);
			});
		}
	});
	
};

exports.setEventUsers=function(eid,client,fn){
	db.query('select uid from jlj_event_join where event_id='+eid+" and isdel=0 and isconfirm=1",function(err,res,field){
		var users=[],len=res.length;
		if(len==0){fn(users);return false;}
		var key='event_'+eid+'_allusers';
		res.forEach(function(user,index){
			users.push(user.uid);
			client.sadd(key,user.uid);
			if(users.length==len){
				//添加创建者
				exports.getEventinfo(eid,client,function(eventinfo){
					users.push(eventinfo['uid']);
					client.sadd(key,eventinfo['uid']);
					fn(users);
				});
			}
		});
	});
};

exports.closeEventChat=function(uid,eid,client){
	//当用户关闭群聊聊天窗口时
	client.srem('user_'+uid+'_opend_event_chat',eid,function(err,ok){
		fn(ok);
	});
};

exports.closePrivateChat=function(uid,touid,client,fn){
	//当用户关闭私聊聊天窗口时
	client.srem('user_'+uid+'_opend_private_chat',touid,function(err,ok){
		if(ok){
			//当对话框关闭时,重置此用户的未读消息
			exports.unsetUserPrivateUnreadMsg(uid,touid);
		}
	});
};

exports.addUserPrivateUnreadMsg=function(uid,touid,index,client,fn){
	//添加用户的私聊未读消息列表
	var now = new Date(),yd=now.getFullYear().toString()+(now.getMonth() + 1).toString()+now.getDate().toString();
	var key='user_'+uid+'_private_'+touid+'_unread_msg_'+yd;
	client.exists(key,function(err,exist){
		if(exist){
			client.hset(key,'end',index);
		}else{
			var value={date:yd,start:index,end:index};
			client.hmset(key,value);
		}
		exports.addUserPrivateUnreadMsgCount(uid,touid,client,fn);
	});
};

exports.addUserPrivateUnreadMsgCount=function(uid,touid,client,fn){
	//添加用户的私聊未读消息数量
	var key='user_'+uid+'_private_'+touid+'_unread_msg_count';
	client.hexists(key,'uid',function(err,exist){
		if(!exist) //保存发送人的uid
			client.hmset(key,{uid:uid,count:1},function(err,status){
				if(status && fn) fn(1);
			});
		else 
			client.hincrby(key,'count',1,function(err,unreadcount){
				if(unreadcount && fn) fn(unreadcount);
			});
	});
};

exports.getUserPrivateUnreadMsg=function(uid,fromuid,page,limit,client,fn){
	// 获取保存未读消息的键值
	client.keys('user_'+fromuid+'_private_'+uid+'_unread_msg_[0-9]*',function(err,keys){
		var unreadmsg=Array(),len=keys.length;
		if(len==0){
			fn([],false);
			return false;
		}
		//循环获取到的keys
		keys.forEach(function(key,index){
			client.type(key,function(err,type){
				// 保存未计消息的状态的redis类型为hash
				if(type=='hash'){
					client.hgetall(key,function(err,unmsgsign){
						unreadmsg.push(unmsgsign);
						if(unreadmsg.length==len){
							exports.getUserPrivateUnreadMsgRange(uid,fromuid,unreadmsg,page,limit,client,fn)
						}
					});
				}else{
					len=len-1;
				}
			});
		});	
	});
};
//获取某一用户的未读消息// 按天获取未读聊天记录
exports.getUserPrivateUnreadMsgRange=function(uid,fromuid,unreadmsg,page,limit,client,fn){
	var readmsg=function(uid,fromuid,unreadmsg,page,limit,client,fn){
		var start=unreadmsg[0]['start']+(page-1)*limit;
		var end=unreadmsg[0]['end'];
		var yd=unreadmsg[0]['date'];
		var key=fromuid<uid?"user_"+fromuid+"_"+uid+"_private_chat_msg_"+yd:"user_"+uid+"_"+fromuid+"_private_chat_msg_"+yd;
		if(start+limit>end){
			client.lrange(key,start,end,function(err,msgs){
				//msgs->真实的消息数组,第二个参数代表是否还有未读数据
				JsonMsg(msgs,false,fn);
			});
		}else{
			client.lrange(key,start,start+limit,function(err,msgs){
				JsonMsg(msgs,true,fn);
			});
		}
	};
	var JsonMsg=function(msgs,next,fn){
		var jsonmsgs=[],len=msgs.length;
		if(len==0){ fn(jsonmsgs,false);return false;} 
		msgs.forEach(function(msg,index){
			jsonmsgs.push(JSON.parse(msg));
			if(jsonmsgs.length==len) fn(jsonmsgs,next);
		});
	};
	if(unreadmsg.length){
		if(unreadmsg.length==1){
			//获取开始值
			readmsg(uid,fromuid,unreadmsg,page,limit,client,fn);

		}else{
			unreadmsg.reverse(unreadmsg);
			console.log(unreadmsg);
			unreadmsg.forEach(function(msg,index){	
				fn([]);
			});
		}
	}else{
		fn([],false);
	}
};

exports.getUserPrivateUnreadMsgCount=function(uid,client,fn){
	client.keys('user_*_private_'+uid+'_unread_msg_count',function(err,keys){
		var unmsgcount=Array(),len=keys.length;
		if(len==0){
			fn(unmsgcount);
			return false;
		}
		keys.forEach(function(key,index){
			client.hgetall(key,function(err,msg){
				unmsgcount.push(msg);
				if(unmsgcount.length==len) fn(unmsgcount);
			});
		});
	});
};
//清空未读消息key
exports.unsetUserPrivateUnreadMsg=function(uid,fromuid,client,fn){
	//包括未读统计数字及未读标识set
	client.keys('user_'+fromuid+'_private_'+uid+'_unread_msg_*',function(err,keys){
		keys.forEach(function(key,index){
			client.del(key);
		});
	});
};
//清空用户所有的未读消息记录
exports.unsetUserAllPrivateUnreadMsg=function(uid,client,fn){
	//包括未读统计数字及未读标识set
	client.keys('user_*_private_'+uid+'_unread_msg_*',function(err,keys){
		keys.forEach(function(key,index){
			client.del(key,function(err,ok){

			});
		});
	});
};

exports.addUserEventUnreadMsg=function(uid,aid,client,fn){
	//添加用户的群聊未读消息数量
	client.incr('user_'+uid+'_event_'+aid+'_unread_msg',function(err,unreadcount){
		if(unreadcount) fn(unreadcount);
	});
};

exports.getUserTotalUnreadMsg=function(uid,client,fn){
	client.get('user_'+uid+'_unread_msg_total',function(err,total){
		if(total) fn(total);
		else fn(0);
	});
};
exports.getUserUnreadMsg=function(uid,client,fn){

};

exports.addUserUnreadMsg=function(uid,client,fn){
	client.incr('user_'+uid+'_unread_msg_total',function(err,total){
		fn(total);
	});
};

exports.viewPrivateChatRecord=function(uid,touid,page,client,fn){
	var key=uid>touid?"user_*_*_private_chat_msg_*":"user_*_*_private_chat_msg_*";
	//client.sort(key,)
}

exports.saveUserPrivateChatMsg=function(uid,touid,data,client,fn){
	var newdata=JSON.stringify(data),now = new Date(),yd=now.getFullYear().toString()+(now.getMonth() + 1).toString()+now.getDate().toString();
	var key=uid<touid?"user_"+uid+"_"+touid+"_private_chat_msg_"+yd:"user_"+touid+"_"+uid+"_private_chat_msg_"+yd;
	client.rpush(key,newdata,function(err,total){
		if(total && fn) fn(total-1);
	});
};
exports.saveUserEventChatMsg=function(uid,eid,data,client,fn){
	var newdata=JSON.stringify(data),now = new Date(),yd=now.getFullYear().toString()+(now.getMonth() + 1).toString()+now.getDate().toString();
	var key="user_"+uid+"_event_"+eid+"_chat_msg_"+yd;
	client.rpush(key,newdata,function(err,ok){
		if(fn) fn(ok);
	});
};

exports.sendPrivateMsg=function(uid,touid,newindex,client,fn){
	//fn(online,opend,unreadcount)分别代表是否在线,窗口是否打开,未读数量
	exports.isOnline(touid,client,function(online){
		if(online){
			//如果在线
			exports.isPrivateOpend(uid,touid,client,function(opend){
				if(opend){
					//如果对方对开启了聊天窗口
					fn(true,true,0);
				}else{
					//如果没有,只返回未读数量
					exports.addUserPrivateUnreadMsg(uid,touid,newindex,client,function(unreadcount){
						fn(true,false,unreadcount);
					});
				}
			});
		}else{
			//如果不在线,添加未读数量,不返回
			exports.addUserPrivateUnreadMsg(uid,touid,newindex,client,function(unreadcount){
				fn(false,false,unreadcount);
			});
		}
	});
};
// 群活动广播时也采取循环单播的形式吧。
//touid是循环单播时的用户uid
exports.sendEventMsg=function(uid,eid,touid,client,fn){
	//fn(online,opend,unreadcount)分别代表是否在线,窗口是否打开,未读数量
	exports.isOnline(touid,client,function(online){
		if(online){
			//如果在线
			exports.isEventOpend(touid,eid,client,function(opend){
				if(opend){
					//如果对方对开启了聊天窗口
					fn(true,true);
				}else{
					//如果没有,只返回未读数量
					exports.addUserEventUnreadMsg(touid,eid,client,function(unreadcount){
						fn(true,false,unreadcount);
					});
				}
			});
		}else{
			//如果不在线,添加未读数量,不返回
			exports.addUserEventUnreadMsg(touid,eid,client,function(unreadcount){});
		}
	});
};

exports.getUserChatSession=function(uid,client,fn){
	client.smembers("user_"+uid+"_chat_session",function(err,sessions){
		var res=[],len=sessions.length;
		if(len==0){fn(res);return false;}
		else
			sessions.forEach(function(session,index){
				res.push(JSON.parse(session));
				if(res.length==len) fn(res);
			});
	});
};

exports.addUserChatSession=function(uid,session,client,fn){
	client.sadd("user_"+uid+"_chat_session",JSON.stringify(session),function(err,ok){
		if(!err) fn(ok);
	});
};

exports.resetUserChatSession=function(uid,client,fn){
	client.del("user_"+uid+"_chat_session",function(err,ok){
		fn(ok);
	});
};