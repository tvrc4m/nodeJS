
var sha1=require('crypto').createHash('sha1');

exports['sign.uname']=function(option,fn){
	var uname=option.uname,pwd=option.pwd,repwd=option.repwd;
	if(!/^[a-zA-Z]+[\w\-]+/.test(uname) || uname.length<6) return -1;
	if(pwd!==repwd || pwd.length<6) return -2;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.addUser({uname:uname,password:sha1.update(pwd).digest('hex')},function(res){
			fn(res);
		});
	});
}

exports['sign.phone']=function(option,fn){
	var phone=option.phone,code=option.code,pwd=option.pwd,repwd=option.repwd;
	if(!/^\d{11}$/.test(phone)) return -1;
	if(pwd!==repwd || pwd.length<6) return -2;
	MU('user',function(m_user){
		var mm_user=new m_user.mongodb();
		mm_user.addUser({phone:phone,password:sha1.update(pwd).digest('hex')},function(res){
			fn(res);
		});
	});
}