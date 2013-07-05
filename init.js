
var app=module.parent.exports.app;
//每次重启时要做的初始化操作
module.exports=function(client){
	
	//清空登录用户列表
	client.del('users_online');
	// 清空用户在线中的朋友
	client.keys('user_*_online_friends',function(err,keys){
		if(keys.length) client.del(keys);
	});
	// 清空群活动的在线用户
	client.keys('activity_*_online_users',function(err,keys){
		if(keys.length) client.del(keys);
	});

	// 清空用户打开的私聊窗口记录
	client.keys('user_*_opend_private_chat',function(err,keys){
		if(keys.length) client.del(keys);
	});
	// 清空用户打开的群聊窗口记录
	client.keys('user_*_opend_activity_chat',function(err,keys){
		if(keys.length) client.del(keys);
	});
	// 清空用户状态
	client.keys('user_*_status',function(err,keys){
		if(keys.length) client.del(keys);
	});


};