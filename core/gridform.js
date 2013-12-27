
var gridfrom=require('gridfrom');
var mongodb=require('mongodb');
gridfrom.mongo=mongodb;
gridfrom.db=mongodb.Db;

exports=module.exports=GridForm;

function GridForm(){
	this.form=gridfrom();
}

GridForm.prototype.upload=function(){
	this.form.parse(REQ,function(err,fields,files){
		
	});
}