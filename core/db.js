
var mongodb=require('Mongodb'),
	mysql=require('mysql'),
	redis=require('redis'),
	sphinx=require('sphinxapi');

exports.mongodb=MongoDB;

exports.redis=RedisDB;

exports.mysql=MysqlDB;

exports.sphinx=new SphinxDB();	//只实例化一次,保证是singletone模式

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
	var client=mongodb.MongoClient;
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
		var callback=function(err,result){db.close();err?fn(0):fn(result);}
		for(param in params){
			//if(Object.hasOwnProperty.call(collection,param)){
				var options=params['option']?params['option']:{};
				switch(param){
					case 'findOne':collection.findOne(params[param],params['fields']?params['fields']:{},options,callback);break;
					case 'find':collection.find(params[param],params['fields']?params['fields']:{},options).toArray(callback);break;
					case 'insert':collection.insert(params[param],options,callback);break;
					case 'update':collection.update(params[param],params['set'],options,callback);break;
					case 'delete':collection.remove(params[param],optionscallback);break;
					case 'count':collection.count(params[param],options,callback);break;
					//case '':
				}
			//}
		}
	});
};

MongoDB.prototype.close=function(db){
	db.close();
}

MongoDB.prototype.gridfs=function(params,option,mode,fn){
	this.connect(function(db){
		var store=new mongodb.GridStore(db,option['_id'] || new mongodb.ObjectId(),option['file'] || null,mode,option);
		var wcallabck=function(err,store){store.close(function(err,file){err?fn(0):fn(file);db.close();})};
		var callback=function(err,res){db.close();err?fn(0):fn(res);};
		store.open(function(err,store){
			if(err) throw err;
			for(var param in params){
				switch(param){
					case 'write':store.write(params['write'],true,wcallabck);break;
					case 'writeFile':store.writeFile(params['writeFile'],wcallabck);break;
					case 'delete':store.unlink(function(err,res){err?fn(0):fn(1);});break;
					case 'read':store.read(callback);break;
					case 'stream':fn(store.stream(true));break;
					//case 'exist':
				}
			}
		})
	});
}

MongoDB.prototype.store=function(file_id,table,fn){
	this.connect(function(db){
		mongodb.GridStore.exist(db,file_id,table,function(err,res){
			if(err && res!=true) fn(0);
			else fn(1);
		});
	})
}

function RedisDB(){
	DB.call(this);
}

RedisDB.prototype.__proto__=DB.prototype;

var redisClient=redis.createClient(REDIS_PORT,REDIS_HOST);

var commands=[];
//TODO::为何for in循环却不行呢，而需要用forEach,
for(var command in redis.RedisClient.prototype){
	commands.push(command);
}

commands.forEach(function(command){
	RedisDB.prototype[command]=function(args,fn){
		redisClient[command](args,fn);
	};
});

function MysqlDB(){
	this.pool=[];
	DB.call(this);
}

MysqlDB.prototype.__proto__=DB.prototype;

MysqlDB.prototype.connect=function(fn){
	this.pool=mysql.createPool(MYSQL_URL);
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
	params=MERGE({},this.params,params);
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

var queries=[];

function SphinxDB(){
	DB.call(this);
	this.link=new sphinx();
}

SphinxDB.prototype.__proto__=DB.prototype;

SphinxDB.prototype.init=function(){
	this.link._host			= 'localhost';	
	this.link._port			= 9312;
	this.link._offset		= 0;
	this.link._limit			= 20;
	this.link._mode			= sphinx.SPH_MATCH_EXTENDED2;	
	this.link._sort			= sphinx.SPH_SORT_RELEVANCE;
	this.link._sortby		= '';			
	this.link._min_id		= 0;
	this.link._max_id		= 0;
	this.link._filters		= [];
	this.link._groupby		= '';
	this.link._groupfunc		= sphinx.SPH_GROUPBY_ATTR;
	this.link._groupsort		= '@group desc';
	this.link._groupdistinct	= '';
	this.link._maxmatches	= 1000;
	this.link._cutoff		= 0;
	this.link._retrycount	= 0;
	this.link._retrydelay	= 0;
	this.link._anchor		= {};
	this.link._indexweights	= {};
	this.link._ranker		= sphinx.SPH_RANK_PROXIMITY_BM25;
	this.link._rankexpr		= '';
	this.link._maxquerytime	= 0;
	this.link._timeout		= 1.0;
	this.link._fieldweights	= {};
	this.link._overrides		= {};
	this.link._select		= '*';
	this.link._index		= '*';
}

SphinxDB.prototype.run=function(fn){

	this.link.RunQueries(function(err, data){
		var results={};
		for(var key in data) results[queries[key]]=data[key];
		fn(results);
	});
}

SphinxDB.prototype.add=function(sign,data,params){
	this.init();
	queries.push(sign);
	for(param in params){
		if(!Object.hasOwnProperty.call(this.link,param)) throw '请检查此属性是否存在';
		this.link[param]=params[param];
	}
	var query='';
	if(typeof(data)=='object'){
		for(var key in data) 
			if(data[key]) query+=!key?' '+data[key]+' ':' '+key+' '+data[key]+' ';
	}else if(typeof(data)=='string') 
		query=data;
	this.link.AddQuery(query);
}