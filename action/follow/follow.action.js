
exports = module.exports =Follow;

var controller=require(CORE+"controller");

function Follow(req,res){
	controller.call(this,req,res);
}

Follow.prototype.__proto__=controller.prototype;

Follow.prototype.index=function(){
	this.display('error');
}
