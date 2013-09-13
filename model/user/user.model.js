var model=require(CORE+'model.js');

exports.mongodb=UserMongo;

exports.redis=UserRedis;

exports.mysql=UserMysql;

exports.sphinx=UserSphinx;

/**
	user{_id:mongoid,uname:string,realname:string,photo:string,sex:enum,workplace:string,professional:string,sign:string,provice:string,city:string,location:string}
**/

function UserMongo(){
	model.mongodb.call(this);
	this.table="user";
};

UserMongo.prototype.__proto__=model.mongodb.prototype;

UserMongo.prototype.addUser=function(data,fn){
	var timestamp=new Date().getTime(),def={ltime:timestamp,score:USER_DEFAULT_SCORE};
	this.query({'insert':MERGE({},def,data)},fn);
}

UserMongo.prototype.getUserByUid=function(uid,fields,fn){
	if(!fn && typeof fields=='function') fn=fields;
	this.get({'findOne':{uid:uid},'fields':fields},fn);
};

UserMongo.prototype.getUserByUname=function(uname,fn){
	this.get({'findOne':{uname:uname}},fn);
}

UserMongo.prototype.getUserByPhone=function(phone,fn){
	this.get({'findOne':{phone:phone}},fn);
}

UserMongo.prototype.updateUserByUid=function(uid,data,fn){
	this.query({'update':{uid:uid},'set':data,'option':{}},fn);
};

UserMongo.prototype.findUsers=function(where,option,fn){
	this.query({'find':where,'option':option},fn);
}


function UserRedis(){
	model.redis.call(this);
};

UserRedis.prototype.__proto__=model.redis.prototype;

function UserMysql(){
	this.table='ft_cat';
	model.mysql.call(this);
}

UserMysql.prototype.__proto__=model.mysql.prototype;

UserMysql.prototype.getUser=function(uid,fn){
	var params={where:'cid='+uid};
	this.find(params,fn);
}

UserMysql.prototype.on('mysql.get.user.info',function(uid){
	console.log(234235);
})

UserMysql.prototype.on('update.user.info',function(uid){
	console.log(356467);
})

function UserSphinx(){
	model.sphinx.call(this);
	this.index='cdsindex';
}

UserSphinx.prototype.__proto__=model.sphinx.prototype;

UserSphinx.prototype.getUser=function(sign,fn){
	this.add(sign);
}

UserSphinx.prototype.findUsers=function(sign,data,where,sort,page,limit){
	var params={_index:this.index,_filters:where,_offset:page,_limit:limit};
	this.add(sign,data,params);
}