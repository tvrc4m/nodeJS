
var objectid=require('mongodb').ObjectID;

exports['get.by.uid']=function(option,fn){
	var uid=option.uid;
	if(!uid instanceof objectid) uid=new objectid(uid);
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUid(uid,{password:-1},fn);
	});
}

exports['get.by.uname']=function(option,fn){
	var uname=option.uname;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUname(uname,fn);
	});
}

exports['get.detail.by.uid']=function(option,fn){
	var uid=option.uid;
	if(!uid instanceof objectid) uid=new objectid(uid);
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUid(uid,fn);
	});
}

exports['get.users.by.uid']=function(option,fn){
	var uids=option.uids,fields=option.fields || {};
	for(var key in uids) if(!uids[key] instanceof objectid) uids[key]=new objectid(uids[key]);
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.findUsers({_id:{$in:uids}},{fields:fields},fn);
	});
}