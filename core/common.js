var path=require('path');
var fs=require('fs');

global.MERGE=function(target){
	var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

//声明调用Model模块的方法，以文件名称作为方法调用
fs.readdir(MODEL,function(err,dirs){
	dirs.forEach(function(dir){
		fs.readdir(MODEL+dir,function(err,files){
			files.forEach(function(filename){
				if (!/\.js$/.test(filename)) return;
				global[path.basename(filename,'.js').replace('.','_')]=function(fn){
					fn(require(path.join(MODEL,dir,filename)));
				}
			}); 
		});
	});
});

//声明调用Medium中间件的方法，以文件名称作为方法调用
fs.readdir(MEDIUM,function(err,dirs){
	dirs.forEach(function(dir){
		fs.readdir(MEDIUM+dir,function(err,files){
			files.forEach(function(filename){
				if (!/\.js$/.test(filename)) return;
				global["call_"+path.basename(filename,'.js').replace('.','_')]=function(action,option,fn){
					require(path.join(MEDIUM,dir,filename))[action](option,fn);
				}
			}); 
		});
	});
});

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
// redis key
global.redis_keys={
	"user_info":"user_%s_info",			//用户信息
	"user_friends":"user_%s_friends"	//好友列表
};