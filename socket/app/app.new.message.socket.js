

exports=module.exports=function(socket,user){

	//接收新消息通知 default:true
	socket.on('app.new.message.receive.notice',function(data){

	});

	//接收新消息以声音提醒 default:true
	socket.on('app.new.message.revice.notice.by.sound',function(data){

	});

	//接收新消息以振动提醒	default:true
	socket.on('app.new.message.revice.notice.by.vibration',function(data){

	});

	//新消息提示音选择	defalut:system(跟随系统)
	socket.on('app.new.message.revice.sound.select',function(data){

	});

	//后台消息提醒时段设置--全天  default:true
	socket.on('app.backgroup.message.notice.wholeday',function(data){

	});

	//后台消息提醒时段设置
	socket.on('app.backgroup.message.notice.timezone',function(data){

	});

	//朋友圈更新提醒 同上面的消息提醒方式 default:true
	socket.on('app.friend.zone.update.notice',function(data){

	});

	//情侣空间更新提醒 同上面的消息提醒方式 default:true
	socket.on('app.lovers.zone.update.notice',function(data){

	});
}