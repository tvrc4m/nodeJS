

exports = module.exports =Register;

var controller=require(CORE+"controller");

function Register(req,res){
	controller.call(this,req,res);
}

Register.prototype.__proto__=controller.prototype;

Register.prototype.index=function(){
	this.display('register');
}

Register.prototype.sign=function(){
	
}
