
exports = module.exports =FollowAjax;

var controller=require(CORE+"controller");

function FollowAjax(req,res){
	controller.call(this,req,res);
}

FollowAjax.prototype.__proto__=controller.prototype;

FollowAjax.prototype.add=function(){
	this.display('error');
}

FollowAjax.prototype.cancel=function(){

}

