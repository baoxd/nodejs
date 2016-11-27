// 合并两个对象
var _ = require('underscore');
var util = require('../utils/util');
var db = require('../utils/db');

// 获取数据库连接
var client =db.client();

// SQL
var SQLS = {
	FINDALL:'SELECT * FROM MOVIE',
	INSERT:'INSERT INTO MOVIE(ID,DOCTOR,TITLE,LANGUAGE,COUNTRY,SUMMARY,POSTER,YEAR,CREATEDATE)  ' +
		'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
	UPDATE:'UPDATE MOVIE SET DOCTOR = ?, TITLE = ?, LANGUAGE = ?, COUNTRY = ?, SUMMARY = ?, POSTER = ?, YEAR = ?, CREATEDATE = ? WHERE ID = ?',
	FINDONE:'SELECT * FROM MOVIE WHERE  ID = ?',
	DELETE:'DELETE FROM MOVIE WHERE ID = ?',
	UPDATE_PV:'UPDATE MOVIE SET PV = PV + 1 WHERE ID = ? '
} ;


// 查询所有电影
exports.findAll = function(){
	return new Promise(function(resolve,reject){
		client.query(SQLS.FINDALL, function(err, results, fields){
			if(err){
				reject(err);
				return ;
			}
			resolve(results);
		});
	}) ;
}

// 根据ID查询
exports.findOne = function(id){
	return new Promise(function(resolve, reject){
		client.query(SQLS.FINDONE, [id] , function(err, results, fields){
			if(err){
				reject(err);
				return ;
			}
			resolve(results);
		});
	});
}

// 删除
exports.delete = function(id){
	return new Promise(function(resolve, reject){
		client.query(SQLS.DELETE, [id], function(err,results){
			if(err){
				reject(err);
				return;
			}
			resolve(results);
		});
	});
}

// 插入、更新
exports.save = function(movie){
	var self = this ,
		params = [] ;
	return new Promise(function(resolve, reject) {
		// 更新
		if (movie.id && movie.id !='undefined') {
			self.findOne(movie.id).then(function(data){
				var _movie = _.extend(data[0],movie);
				params.push(_movie.doctor);
				params.push(_movie.title);
				params.push(_movie.language);
				params.push(_movie.country);
				params.push(_movie.summary);
				params.push(_movie.poster);
				params.push(_movie.year);
				params.push(_movie.createDate);
				params.push(_movie.id);

				client.query(SQLS.UPDATE, params, function(err, result){
					if(err){
						reject(err);
						return ;
					}
					resolve(_movie.id);
				});
			}).catch(function(err){
				// 查询出错
				// console.log(err);
				// 控制器捕获错误
				reject(err);
			}) ;
		} else {
			// 插入
			// ID,DOCTOR,TITLE,LANGUAGE,COUNTRY,SUMMARY,POSTER,YEAR,CREATEDATE
			params.push(util.uuid());
			params.push(movie.doctor);
			params.push(movie.title);
			params.push(movie.language);
			params.push(movie.country);
			params.push(movie.summary);
			params.push(movie.poster);
			params.push(movie.year);
			params.push(Date.now());

			client.query(SQLS.INSERT, params , function(err, result){
				if(err){
					reject(err);
					return ;
				}
				resolve(params[0]);
			});
		}
	});
}

// 更新pv
exports.updatePv = function(id){
	return new Promise(function(resolve, reject){
		client.query(SQLS.UPDATE_PV , [id] , function(err, result){
			if(err){
				return reject(err);
			}
			resolve(result);
		});
	});
}