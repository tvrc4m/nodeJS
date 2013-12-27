
exports = module.exports =Index;

var controller=require(CORE+"controller");

function Index(req,res){
	controller.call(this,req,res);
}

Index.prototype.__proto__=controller.prototype;

Index.prototype.index=function(){
	this.display('error');
}
