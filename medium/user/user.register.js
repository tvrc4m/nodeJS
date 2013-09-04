

module.exports=function(option){

	switch(option.action){

		case 'local':return local(option);

		case 'third':return third(option);
	}
}

function local(option){
	MU("user",function(m_user){
		var m_user_mongo=new m_user('mongodb');
		console.log(m_user_mongo.prototype);
		//m_user('mongodb').prototype.connect();
	});
}


function third(option){

}