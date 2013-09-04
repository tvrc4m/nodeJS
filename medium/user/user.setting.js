

module.exports=function(option){

	switch(option.action){

		case 'add':return add(option);

		case 'headimg':return headimg(option);
	}
}

function add(option){
	
	MU("user",function(m_user){
		var m_user_mongo=new m_user('mysql');
		console.log(m_user_mongo.prototype);
		//m_user('mongodb').prototype.connect();
	});
}


function headimg(option){

}