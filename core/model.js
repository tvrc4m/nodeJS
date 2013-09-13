
exports.mongodb=MongoModel;

exports.mysql=MysqlModel;

exports.redis=RedisModel;

exports.sphinx=SphinxModel;

var EventEmitter = require('events').EventEmitter;

var db=require('./db.js');

function Model(){
	this.db=null;
}

Model.prototype.__proto__=EventEmitter.prototype;

function MongoModel(){
	Model.call(this);
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

MongoModel.prototype.storeset=function(option){
	if(!option['root'] && this.table)
		option['root']=this.table;
	else
		throw 'this.table undifined';
	return option;
}

MongoModel.prototype.gridfs=function(params,option,mode,fn){
	this.db.gridfs(params,this.storeset(option),mode,fn);
}


function RedisModel(){
	Model.call(this);
}

RedisModel.prototype.__proto__=Model.prototype;

for(var command in db.redis.prototype){
	RedisModel.prototype[command]=db.redis.prototype[command];
}

function MysqlModel(){
	Model.call(this);
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

function SphinxModel(){
	Model.call(this);
	this.db=db.sphinx;
}

SphinxModel.prototype.__proto__=Model.prototype;

SphinxModel.prototype.find=function(){
	
}

SphinxModel.prototype.add=function(sign,data,params){
	this.db.add(sign,data,params);
}

SphinxModel.prototype.run=function(fn){
	this.db.run(fn);
}