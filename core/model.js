
exports.mongodb=MongoModel;

exports.mysql=MysqlModel;

exports.redis=RedisModel;

var EventEmitter = require('events').EventEmitter;

var db=require('./db.js');

function Model(){
	this.db=null;
}

Model.prototype.__proto__=EventEmitter.prototype;

function MongoModel(){
	this.db=new db.mongodb();
}

MongoModel.prototype.__proto__=Model.prototype;

MongoModel.prototype.find=function(params,fn){
	this.db.query(this.set(params),fn);
}

MongoModel.prototype.get=function(params,fn){
	this.db.query(this.set(params),function(res){
		fn(res);
	});
}

MongoModel.prototype.count=function(params){

}

MongoModel.prototype.query=function(params,fn){
	this.db.query(this.set(params),fn);
}

MongoModel.prototype.set=function(params){
	if(!params['table'] && this.table)
		params['table']=this.table;
	else
		throw 'this.table undifined';
	return params;
}


function RedisModel(){

}

function MysqlModel(){
	this.db=new db.mysql();
}

MysqlModel.prototype.__proto__=Model.prototype;

MysqlModel.prototype.find=function(params,fn){
	this.db.query(this.set(params),fn);
}

MysqlModel.prototype.get=function(params,fn){
	this.db.query(this.set(params),function(res){
		fn(res[0]);
	});
}

MysqlModel.prototype.count=function(params){

}

MysqlModel.prototype.query=function(params,fn){
	this.db.query(this.set(params),fn);
}

MysqlModel.prototype.set=function(params){
	if(!params['table'] && this.table)
		params['table']=this.table;
	else
		throw 'this.table undifined';
	return params;
}