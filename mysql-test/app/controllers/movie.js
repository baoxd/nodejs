var movieModel = require('../models/movieModel');
var commentModel = require('../models/commentModel');
var file = require('../utils/file');

module.exports = {
	// 添加一个新电影
	new: function(req, res) {
		res.render('new', {
			title: '电影-后台录入页',
			movie: {
				title: "",
				doctor: "",
				country: "",
				language: "",
				year: "",
				poster: "",
				summary: ""
			}
		});
	},

	// 电影列表
	list: function(req, res){
		movieModel.findAll().then(function(data){	
			// console.log(data[0]);
			res.render('list',{list:data})
		}).catch(function(e){
			console.log(e);
		});
	},

	// 修改
	update: function(req, res){
		var id = req.params.id ;
		movieModel.findOne(id).then(function(data){
			console.log(data[0]);
			res.render('new', {
				title:'后台更新页',
				movie:data[0]
			});
		}).catch(function(e){
			console.log(e);
		});
	},

	// 删除电影
	delete: function(req, res){
		var id = req.query.id;
		if(!id){
			res.end({msg:false});
			return ;
		}

		movieModel.delete(id).then(function(data){
			if(data){
				res.json({msg:true});
			}
			else{
				res.json({msg:false});
			}
		}).catch(function(e){
			console.log(e);
		});
	},

	// 电影详情
	detail: function(req, res){
		var id = req.params.id ;

		movieModel.updatePv(id).then(function(data){
		}).catch(function(e){
			console.log(e);
		})
		
		movieModel.findOne(id).then(function(data){
			commentModel.findByMovieId(id).then(function(comments){
				console.log(comments);
				res.render('detail',{movie:data[0],comments:comments});
			}).catch(function(e){
				console.log(e);
				res.render('detail',{movie:data[0]});
			})
			// res.render('detail',{movie:data[0]});
		}).catch(function(e){
			console.log(e);
		});
	},	

	// 保存电影信息
	save: function(req, res){
		// 暂时去掉文件上传
		// file.upload(req.files);
		movieModel.save(req.body.movie).then(function(id){
			res.redirect('/detail/'+id);
		}).catch(function(e){
			console.log(e);
		})
	}
} ;