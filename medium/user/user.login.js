
var crypto=require('crypto');

exports.uname=function(option,fn){
	var uname=option.uname,password=option.password;
	MU("user",function(m_user){
		var mr_user=new m_user.redis();
		console.log(m_user.redis.prototype);
		mr_user.set('user_1_info','ujkjk',function(err,res){
			console.log(err);console.log(res);
		});
		var ms_user=new m_user.sphinx();
		ms_user.findUsers('findusers',[],[],{},1,10);
		ms_user.findUsers('findusers2',[],[],{},1,10);
		MU('user.signin',function(m_signin){
			var ms_signin=new m_signin.sphinx();
			ms_signin.findUsers('findusers3',[],[],{},1,10);
			ms_signin.run(function(res){
				console.log(res);
			})
		})
		
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUname(uname,function(res){
			if(!res) fn(0);
			else if(res.password==crypto.createHash('sha1').update(password).digest('hex')){
				delete res.password;
				fn(res);
			}
			else fn(0);
		});
	});
}

exports.phone=function(option,fn){
	var phone=option.phone,password=option.password;
	MU('user',function(m_user){
		var mm_user=new m_user.sphinx();
		mm_user.getUser();
		mm_user.run(function(res){
			console.log(res);
		})
	})
}