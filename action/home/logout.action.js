

exports = module.exports =Logout;

var controller=require(CORE+"controller");

function Logout(req,res){
	controller.call(this,req,res);
}

Logout.prototype.__proto__=controller.prototype;

Logout.prototype.index=function(){
	this.req.session.destroy();
	this.res.redirect('/');
}
