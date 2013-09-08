
//真实姓名
exports.realname=function(option,fn){
	var realname=option.realname,uid=option.uid;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{realname:realname}},fn);
	})
}

//工作地点--写字楼
exports.workplace=function(option,fn){
	var workplace=option.workplace,uid=option.uid;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{workplace:workplace}},fn);
	})
}

//职业
exports.professional=function(option,fn){
	var professional=option.professional,uid=option.uid;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{professional:professional}},fn);
	})
}

//性别
exports.sex=function(option,fn){
	var sex=option.sex,uid=option.uid;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{sex:sex}},fn);
	})
}

//个性签名
exports.sign=function(option,fn){
	var sign=option.sign,uid=option.uid;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{sign:sign}},fn);
	})
}