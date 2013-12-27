

exports = module.exports =Register;

var controller=require(CORE+"controller");

function Register(req,res){
	controller.call(this,req,res);
}

Register.prototype.__proto__=controller.prototype;

Register.prototype.index=function(){
	this.display('register/index');
}

Register.prototype.sign=function(){
	var uname=this.req.body.uname,password=this.req.body.password;
	if(!uname || !password){}
	IUSER('user.register',{action:'sign.uname',uname:uname,pwd:password,repwd:password},function(res){
		if(res==0){

		}else{
			this.req.user=res[0];
		}
	});
}
