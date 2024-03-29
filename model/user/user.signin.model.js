var model=require(CORE+'model.js');

exports.mongodb=UserSigninMongo;

exports.redis=UserSigninRedis;

exports.sphinx=UserSigninSphinx;


/**
	签到user_signin{_id:mongoid,uid:mongoid,longitude:float,latitude:float,location:string,ctime:timestamp}
**/

function UserSigninMongo(){
	model.mongodb.call(this);
	this.table="user_signin";
};

UserSigninMongo.prototype.__proto__=model.mongodb.prototype;

UserSigninMongo.prototype.addUserSignin=function(data,fn){
	var def={ctime:new Date().getTime()};
	this.query({'insert':MERGE({},def,data)},fn);
}

UserSigninMongo.prototype.getUserSignins=function(uid,option,fn){
	if(!fn && typeof option=='function') fn=option;
	this.find({'find':{uid:uid},'option':option},fn);
};

UserSigninMongo.prototype.delUserSignin=function(uid,ctime,fn){
	this.query({'delete':{uid:uid,ctime:ctime}},fn);
}

function UserSigninRedis(){
	console.log(2222);
};

function UserSigninSphinx(){
	model.sphinx.call(this);
	this.index='cdsindex';
}

UserSigninSphinx.prototype.__proto__=model.sphinx.prototype;

UserSigninSphinx.prototype.nearby=function(sign,data,where,sort,page,limit){
	var params={_index:this.index,_anchor:{attrlat:'latitude',attrlong:'longitude',lat:data.lat,long:data.long}};
	this.add(sign,{},params);
}

UserSigninSphinx.prototype.findUsers=function(sign,data,where,sort,page,limit){
	var params={_index:this.index,_filters:where,_offset:page,_limit:limit};
	this.add(sign,data,params);
}