
exports = module.exports =UserSetting;

var controller=require(CORE+"controller");

function UserSetting(req,res){
	controller.call(this,req,res);
}

UserSetting.prototype.__proto__=controller.prototype;

UserSetting.prototype.index=function(){
	this.display('error');
}
