

exports=module.exports=function(socket,login){

	//通讯录列表
	socket.on('address.list',function(data){
		MF('friend',function(m_friend){
			var mm_friend=new m_friend.mongodb();
			mm_friend.getUserFriends(login._id,function(friends){
				socket.emit('address.list.complete',{friends:friends});
			});
		});
	});

	//通讯录用户搜索
	socket.on('address.list.search',function(data){
		var q=data.q;
		MF('friend',function(m_friend){
			var mm_friend=new m_friend.mongodb();
			mm_friend.findFriends({$or:{uname:/q/,realname:/q/,remark:/q/}},function(users){
				socket.emit('address.list.search.w',{users:users});
			});
		});
	});
}