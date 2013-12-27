/*
mongodb
	friend
		{
			"userid":[
				"userid",...
			]
		}
redis
	key: user_id_friends
	set: [userid,...]

	key: user_id_info
	hash: {detail info}
*/

exports=module.exports=function(socket,login){

	//好友信息
	socket.on('friend.info',function(data){
		
	});

	//好友备注
	socket.on('friend.remark',function(data){
		
	});

	//星标好友，排序靠前
	socket.on('friend.star',function(data){

	});

	//删除好友
	socket.on('friend.delete',function(data){

	});

	//添加到黑名单中
	socket.on('friend.add.black',function(data){
		
	});

	//移除黑名单
	socket.on('friend.remove.black',function(data){
		
	});
}