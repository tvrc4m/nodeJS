

exports=module.exports=function(socket,user){
	
	socket.on('user.login',function(data){
		var uname=data.uname,pwd=data.password;
		IUSER('user.login',{action:'uname',uname:uname,password:pwd},function(res){
			//if(res==0) 
		});
	});
}