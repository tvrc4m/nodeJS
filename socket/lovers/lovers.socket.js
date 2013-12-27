

exports=module.exports=function(socket,user){

	//创建情侣空间,发出邀请
	socket.on('lovers.create.invited',function(data){
		
	});

	//同意创建情侣空间
	socket.on('lovers.create.invited.agree',function(data){

	});

	//拒绝创建情侣空间
	socket.on('lovers.create.invited.refuse',function(data){

	});

	//若有一方想退出,则通知对方征询对方意见
	socket.on('lovers.quit.notice',function(data){

	});

	//情侣空间解散,记录保持三个月,过期删除
	socket.on('lovers.quit.notice.agree',function(data){

	});

	//导出情侣空间的数据
	socket.on('lovers.data.import',function(data){

	});

}