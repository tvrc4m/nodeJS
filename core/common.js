var path=require('path');

global.MERGE=function(target){
	var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

global.M=function(name,fn){
	var file=MODEL+name.toLocaleLowerCase()+".model.js";
	path.exists(file,function(exists){
		if(exists)
			fn(require(file));
		else
			console.log('m function file is not exists');
	});
};

global.MU=function(name,fn){
	M("user/"+name, fn);
};

global.MF=function(name,fn){
	M('friend/'+name,fn);
};

global.MC=function(name,fn){
	M('chat/'+name,fn);
}

global.I=function(name,option,fn){
	var file=MEDIUM+name+".js";
	path.exists(file,function(exists){
		if(exists)
			require(file)[option.action](option,fn);
			//new (require(file))(option,fn,socket)[option.action]()
		else
			console.log('invoke error');
	});
};

global.IUSER=function(name,option,fn){
	I('user/'+name,option,fn);
}

global.S=function(name,value){
	if(value) REQ.session[name]=value;
	else return REQ.session[name];
};

global.SU=function(userinfo){
	REQ.session.user=userinfo;
}

global.C=function(name,value,option){
	var option=MERGE({},COOKIE_OPTION,option);
	if(value) REQ.cookie(name,value,option);
	else return REQ.cookies[name];
};