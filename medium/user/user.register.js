
var sha1=require('crypto').createHash('sha1');

exports['sign.uname']=function(option,fn){
	user_model(function(model){
		 	user_sphinx=new model.sphinx();
		 	user_sphinx.getUser('items','',{'_index':'ftitemindex','_field':'*'});
		 	user_sphinx.run(function(data){
		 		console.log(data);
		 		data.items.value.forEach(function(item){
		 			console.log(item);
		 		})
		 	});
		 });
}

exports['sign.phone']=function(option,fn){
	var phone=option.phone,code=option.code,pwd=option.pwd,repwd=option.repwd;
	if(!/^\d{11}$/.test(phone)) return -1;
	if(pwd!==repwd || pwd.length<6) return -2;
	user_model(function(model){
		var user_mongo=new model.mongodb();
		user_mongo.addUser({phone:phone,password:sha1.update(pwd).digest('hex')},function(res){
			fn(res);
		});
	});
}