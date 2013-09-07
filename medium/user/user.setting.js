
exports.realname=function(option,fn){
	var realname=option.realname,uid=option.uid;
	//var _id=new require('mongodb').ObjectID(uid);
	console.log(uid);
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.updateUserByUid(uid,{$set:{realname:realname}},fn);
	})
}

exports.workplace=function(option,fn){

}
