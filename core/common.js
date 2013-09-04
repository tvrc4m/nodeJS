var path=require('path');

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
	M('follow/'+name,fn);
};

global.MC=function(name,fn){
	M('chat/'+name,fn);
}

global.I=function(name,option,fn){
	var file=MEDIUM+name+".js";
	path.exists(file,function(exists){
		if(exists)
			require(file)[option.action](option,fn);
		else
			console.log('invoke error');
	});
};

global.IUSER=function(name,option,fn){
	I('user/'+name,option,fn);
}

global.S=function(req,name,value){
	req.session[name]=value;
};

global.C=function(){
	
};