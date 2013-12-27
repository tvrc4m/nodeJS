

exports = module.exports =Login;

var controller=require(CORE+"controller");

function Login(req,res){
	controller.call(this,req,res);
}

Login.prototype.__proto__=controller.prototype;

Login.prototype.index=function(){
	this.seo();
	this.display('login/index');
}

Login.prototype.validate=function(){
	var uname=this.req.body.uname,password=this.req.body.password;
	var self=this;
	//手机号/昵称登录
	if(/\d{11}/.test(uname)){
		IUSER('user.login',{action:'phone',phone:uname,password:password},function(result){
			console.log(result);
		});
	}else{
		IUSER('user.login',{action:'uname',uname:uname,password:password},function(result){
			self.req.session.user=result;
			console.log(result);
		});
	}
}

Login.prototype.seo=function(){
	this.title="登录";
	this.keyword="登录";
}
