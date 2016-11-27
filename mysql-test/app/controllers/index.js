// index 控制器
var movieModel = require('../models/movieModel');


module.exports = {
	// 查询所有电影
	index: function(req, res){
		movieModel.findAll().then(function(data){
			res.render('index',{list:data});
		})
		.catch(function(err){
			console.log(err) ;
		});
	}
} ;

