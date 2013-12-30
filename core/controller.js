
exports=module.exports=Controller;

function Controller(req,res){
	this.req=req;
	this.res=res;
	this.title='';
	this.keyword='';
	this.description='';
	this.data={};
	this.init();
}

Controller.prototype.init=function(){
	var page=this.req.query.page;
	if(!page || page<1) this.req.query.page=1;
}

Controller.prototype.display=function(name,fn){
	if(fn)
		this.res.render(name,this.data,function(err,html){
			if(fn) fn(html);
		});
	else{
		this.assign({pageTitle:this.title,pageKeyword:this.keyword,pageDescription:this.description});
		this.res.render(name,this.data);
	}
}

Controller.prototype.assign=function(data){
	this.data=MERGE(this.data,data);
}

	

	