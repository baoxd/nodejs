var _ = require('underscore');
var util = require('../utils/util');
var db = require('../utils/db');

// 获取数据库连接
var client =db.client();

var SQLS = {
	findByMovieId:'SELECT * FROM COMMENTS WHERE movieId = ?',
	insert:'INSERT INTO COMMENTS(id,content,createDate,userId,userName,movieId) VALUES(?,?,?,?,?,?)'
};

exports.findByMovieId = function(movieId){
	return new Promise(function(resolve,reject){
		client.query(SQLS.findByMovieId,[movieId], function(err,results){
			if(err){
				return reject(err);
			}
			resolve(results);
		});
	});
}

exports.save = function(comment){
	return new Promise(function(resolve,reject){
		var params = [] ;
		params.push(util.uuid());
		params.push(comment.content);
		params.push(Date.now());
		params.push(comment.userId);
		params.push(comment.userName);
		params.push(comment.movieId);
		client.query(SQLS.insert,params,function(err, results){
			if(err){
				return reject(err);
			}
			resolve(results);
		});
	});
}