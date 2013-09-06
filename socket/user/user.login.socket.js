

exports=module.exports=function(socket,user){
	socket.on('user.login',function(data){
		console.log(3247768);
		console.log(data);
		MU('user',function(m_user){
			var mm_user=new m_user.sphinx();
			mm_user.getUser('name');
			mm_user.getUser('nick');
			MU('user',function(n_user){
				var nn_user=new n_user.sphinx();
				nn_user.getUser('nick33');
				nn_user.run(function(res){
					console.log(res);
				});
			});
			
		})
	});
}