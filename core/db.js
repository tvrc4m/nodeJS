
var utils=require(CORE+"function.js");

exports.mongodb=MongoDB;

exports.redis=RedisDB;

exports.mysql=MysqlDB;

exports.sphinx=SphinxDB;

function DB(){
	this.link=null;
	this.config={};
}

function MongoDB(){
	this.collection=null;
	DB.call(this);
}

MongoDB.prototype.__proto__=DB.prototype;

MongoDB.prototype.connect=function(fn){
	var client=require('mongodb').MongoClient;
	client.connect(MONGODB_URL,function(err,db){
		if(err) throw err;
		fn(db);
	});
}

MongoDB.prototype.init=function(){

};

MongoDB.prototype.query=function(params,fn){
	var self=this;
	self.connect(function(db){
		var collection=db.collection(params['table']);
		var callback=function(err,result){db.close();fn(result);}
		for(param in params){
			//if(Object.hasOwnProperty.call(collection,param)){
				if(param=='findOne')
					collection.findOne(params[param],params['fields']?params['fields']:{},params['options'],callback);
				else if(param=='find')
					collection.find(params[param],params['fields']?params['fields']:{},params['options']).toArray(callback);
				else if(param=='insert')
					collection.insert(params[param],params['options']?params['options']:{},callback);
				else if(param=='update')
					collection.update(params[param],params['set'],params['options']?params['options']:{},callback);
				else if(param=='delete')
					collection.remove(params[param],params['options']?params['options']:{},callback);
				else if(param=='count')
					collection.count(params[param],params['options']?params['options']:{},callback);
			//}
		}
	});
};

MongoDB.prototype.close=function(db){
	db.close();
}

function RedisDB(){
	DB.call(this);
}

RedisDB.prototype.__proto__=DB.prototype;

RedisDB.prototype.connect=function(){
	redis = require('redis');
	this.link=redis.createClient(REDIS_PORT,REDIS_HOST);
	//TODO::this.link.auth();
	util=require('utils');
	util.merge(this,this.link.prototype);
}

function MysqlDB(){
	this.pool=[];
	DB.call(this);
}

MysqlDB.prototype.__proto__=DB.prototype;

MysqlDB.prototype.connect=function(fn){
	var mysql=require('mysql');
	this.pool=mysql.createPool({host:MYSQL_HOST,port:MYSQL_PORT,database:MYSQL_DB,user:MYSQL_USER,password:MYSQL_PASSWORD});
	this.pool.getConnection(function(err, connection) {
	  	if(err) throw err;
	  	this.link=connection;
	  	fn(connection);
	});
}

MysqlDB.prototype.init=function(){
	this.params={
		select:'*',
		table:'',
		where:'',
		order:'',
		group:'',
		join:'',
		update:'',
		set:'',
		delete:'',
		insert:'',
		limit:'',
		value:'',
		having:''
	};
}

MysqlDB.prototype.query=function(params,fn){
	var self=this;
	self.connect(function(connection){
		self.sql(params,function(sql){
			//console.log(sql);
			connection.query(sql,function(err,res){
				connection.release();
				if(fn) fn(res);
			});
		});
	});
}

MysqlDB.prototype._set=function(params){
	this.init();
	params=utils.extend({},this.params,params);
	for(var param in params){
		//if(!Object.hasOwnProperty.call(this.link,param)) throw '不存在此属性，可能有待添加';
		//this.params[param]=params['param'];
	}

	return params;
};

MysqlDB.prototype.sql=function(params,fn){
	var params=this._set(params);
	var sql='',table=params['table'];
	if(params['insert'])
		sql='INSERT INTO '+table+params['value'];
	else if(params['update'])
		sql='UPDATE '+table+' SET '+params['set'];
	else if(params['delete'])
		sql='DELETE FROM '+table;
	else
		sql='SELECT '+params['select']+' FROM '+table;
	
	if(params['where'])
		sql+=' WHERE '+params['where'];
	if(params['order'])
		sql+=' ORDER BY '+params['order'];
	if(params['group'])
		sql+=' GROUP BY '+params['group'];
	if(params['limit']){
		sql+=' LIMIT '+params['limit'];
	}
	fn(sql);
}

function SphinxDB(){
	DB.call(this);
	this.queries=[];
}

SphinxDB.prototype.__proto__=DB.prototype;

SphinxDB.prototype.init=function(){
	this._host			= 'localhost';	
	this._port			= 9312;
	this._offset		= 0;
	this._limit			= 20;
	this._mode			= SphinxClient.SPH_MATCH_ALL;	
	this._sort			= SphinxClient.SPH_SORT_RELEVANCE;
	this._sortby		= '';			
	this._min_id		= 0;
	this._max_id		= 0;
	this._filters		= [];
	this._groupby		= '';
	this._groupfunc		= SphinxClient.SPH_GROUPBY_DAY;
	this._groupsort		= '@group desc';
	this._groupdistinct	= '';
	this._maxmatches	= 3000;
	this._cutoff		= 0;
	this._retrycount	= 0;
	this._retrydelay	= 0;
	this._anchor		= {};
	this._indexweights	= {};
	this._ranker		= SphinxClient.SPH_RANK_PROXIMITY_BM25;
	this._rankexpr		= '';
	this._maxquerytime	= 0;
	this._timeout		= 1.0;
	this._fieldweights	= {};
	this._overrides		= {};
	this._select		= '*';
}

SphinxDB.prototype.run=function(fn){
	data=this.RunQueries();
	var results=null;
	for(key in data) results[this.queries[key]]=data[key];
	fn(results);
}

SphinxDB.prototype.add=function(sign,data,params){
	this.init();
	this.queries.push(sign);
	for(param in params){
		if(!Object.hasOwnProperty.call(this,param)) throw '请检查此属性是否存在';
		this[param]=params[param];
	}
	var query='';
	if(typeof(data)=='object'){
		for(key in data) data[key] || query+=!key?' '+data[key]+' ':' '+key+' '+data[key]+' ';
	}else if(typeof(data)=='string') 
		query=data;
	this.AddQuery(query);
}

SphinxDB.prototype.resetParams=function(param,fn){

}