
exports = module.exports =Index;

var controller=require(CORE+"controller");

function Index(req,res){
	controller.call(this,req,res);
}

Index.prototype.__proto__=controller.prototype;

Index.prototype.index=function(){
	user_model(function(model){
		user_sphinx=new model.sphinx();
		user_sphinx.getUser('items',{'@title':'手机'},{'_index':'ftitemindex','_limit':2,'_offset':10});
		user_sphinx.getUser('items2',{'@title':'相机'},{'_index':'ftitemindex','_limit':2,'_offset':1});
		user_sphinx.run(function(data){
			console.log(data);
		});
	});
	this.seo();
	this.display('login/index');
	// this.display('home/index');
}


Index.prototype.seo=function(){
	this.title="快推网-Fastty.com.做最有影响力的返利比价社交平台,购物搜索引擎,全网搜索,综合比价,购买实惠有用的商品";
	this.keyword="返利网,比价网,淘宝返利,比价搜索";
	this.description="专业的返利网及比价网,购物比价搜索引擎,综合比价,全网一网打尽,省钱又省时,尽在快推网络";
}