

exports=module.exports=function(socket,user){

	//添加照片
	socket.on('album.photo.add',function(data){

	});

	//删除照片
	socket.on('album.photo.del',function(data){

	});

	//照片喜欢
	socket.on('album.photo.like',function(data){

	});

	//照片评论
	socket.on('album.photo.comment',function(data){
		
	});

	//相册照片列表
	socket.on('album.photo.list',function(data){

	});
	
	//允许陌生人查看十张照片  default:true
	socket.on('album.phone.view.by.stranger',function(data){

	});
}