
var sha1=require('crypto').createHash('sha1');

exports.uname=function(option,fn){
	var uname=option.uname,password=option.password;
	MU("user",function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUname(uname,function(res){
			if(!res) fn(0);
			else if(res.password==sha1.update(password).digest('hex')){
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