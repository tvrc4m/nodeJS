
//打招呼
exports.hand=function(option,fn){
	var uid=option.uid,fromuid=option.fromuid,content=option.content;
	var handdata={uid:fromuid,content:content,type:'hand'};
	MU("user.notice",function(m_notice){
		var mm_notice=new m_notice.mongodb();
		mm_notice.addUserNotice(uid,handdata,function(res){
			if(!res) fn(0);
			else fn(1);
		});
	});
}