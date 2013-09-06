

exports=module.exports=function(socket,user){

	//字体大小(enum值)
	socket.on('app.setting.fontsize',function(data){

	});

	//聊天背景
	socket.on('app.setting.chat.backgrounp',function(data){

	});

	//获取随机携带的背景图片
	socket.on('app.setting.backgrounp.system.list',function(data){

	});

	//选择随机携带的背景图片
	socket.on('app.setting.backgrounp.system.select',function(data){

	});

	//从相册中选择背景图片
	socket.on('app.setting.backgrounp.album',function(data){
		
	});

	//语言选择 default:system(跟随系统)
	socket.on('app.setting.language.select',function(data){

	});


}