
exports = module.exports =Setting;

var controller=require(CORE+"controller");

function Setting(req,res){
	controller.call(this,req,res);
}

Setting.prototype.__proto__=controller.prototype;

Setting.prototype.index=function(){
	console.log(this.req.session);
	var _id=this.req.session.user._id;
	IUSER('user.setting',{action:'realname','realname':'weishan11',uid:_id},function(res){
		console.log(res);
	});
}