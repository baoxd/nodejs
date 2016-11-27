var commentModel = require('../models/commentModel') ;

exports.save = function(req, res){
	var comment = req.body.comment;
	// console.log(comment);
	if(!comment){
		res.redirect('/');
	}
	if(comment){

		commentModel.save(comment).then(function(data){
			console.log(data);
			res.redirect('/detail/'+comment.movieId);
		}).catch(function(e){
			console.log(e);
			res.redirect('/detail/'+comment.movieId);
		});
	}
	
}