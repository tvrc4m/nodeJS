

exports=module.exports=function(socket,user){
	
	//登录
	socket.on('user.login',function(data){
		call_user_login('uname',data,function(res){
			//if(res==0) 
		});
	});

	//昵称登录
	socket.on('user.register.uname',function(data){
		call_user_register('sign.uname',data,function(res){
			if(res){

			}
		})
	});

	socket.on('user.unique.uname',function(data){
		
	});

	socket.on('user.unique.email',function(data){
		
	});

	//手机号登录
	socket.on('user.register.phone',function(data){
		
	});

	//注销
	socket.on('user.logout',function(data){
	
	});

	//退出登录--下次需要重新登录
	socket.on('user.exit',function(data){
		
	});
}
