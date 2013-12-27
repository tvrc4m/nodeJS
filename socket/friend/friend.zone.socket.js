

exports=module.exports=function(socket,user){

	//朋友圈最新的动态
	socket.on('friend.zone.latest',function(data){
		
	});

	//朋友圈动态的评论
	socket.on('friend.zone.record.comment',function(data){

	});

	//朋友圈动态的评论删除
	socket.on('friend.zone.record.comment.del',function(data){

	});

	//朋友圈动态的喜欢
	socket.on('friend.zone.record.like',function(data){

	});

	//朋友圈动态的分享至微信朋友圈
	socket.on('friend.zone.record.share.weixin.friend.zone',function(data){

	});

	//朋友圈动态的分享至微信好友
	socket.on('friend.zone.record.share.weixin.friend',function(data){

	});
}