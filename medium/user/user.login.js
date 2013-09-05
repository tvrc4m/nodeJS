
exports.uname=function(option,fn){
	var uname=option.uname,password=option.password;
	MU("user",function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByUname(uname,function(res){
			if(res.password==password) fn(1);
			else fn(0);
		});
	});
}

exports.phone=function(option,fn){
	var phone=option.phone,password=option.password;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.getUserByPhone(phone,function(res){
			if(res.password==password) fn(1);
			else fn(0);
		})
	})
}