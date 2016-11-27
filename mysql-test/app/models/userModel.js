var util = require('../utils/util');
var db = require('../utils/db');
var _ = require('underscore');
//一种加密算法，这里用来加密密码
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10
var client = db.client();

var SQLS = {
	FINDALL:'SELECT * FROM USER',
	FINDBYID:'SELECT * FROM USER WHERE  ID = ?',
	FINDBYNAME:'SELECT * FROM USER WHERE NAME = ?',
	INSERT:'INSERT INTO USER(ID,NAME,PASSWORD,ROLE,CREATEDATE) VALUES(?,?,?,?,?)',
	FINDBYNAMEPAS:'SELECT * FROM USER WHERE NAME = ? AND PASSWORD = ?',
	UPDATE:'UPDATE USER SET NAME = ? ,PASSWORD = ? ,ROLE = ?, CREATEDATE = ? WHERE ID = ? '
};

exports.findAll = function(){
	return new Promise(function(resolve,reject){
		client.query(SQLS.FINDALL, function(err,results){
			if(err){
				return reject(err);
			}
			resolve(results);
		});
	});
}

// 根据id查询
exports.findById = function(id){
	return new Promise(function(resolve, reject){
		client.query(SQLS.FINDBYID, [id], function(err, results){
			if(err){
				return reject(err);
			}
			resolve(results);
		});
	});
}

// 根据name查询
exports.findByName = function(name){
	return new Promise(function(resolve, reject){
		client.query(SQLS.FINDBYNAME, [name] , function(err, results){
			if(err){
				reject(err);
			}
			resolve(results);
		});
	});
}

// 登录
exports.login = function(user){
	return new Promise(function(resolve, reject){
		var name = user.name ;
		var password = user.password ;

		client.query(SQLS.FINDBYNAME, [name], function(err, results){
			if(err){
				return reject(err);
			}
			var _user = results[0] ;

			if(!_user){
				return resolve(null);
			}

			if(_user){
				bcrypt.compare(password, _user.password, function(err, isMatch) {
					if (err) return reject(err);

					if(isMatch){
						resolve(_user);
					}else{
						resolve(null);
					}
				})
			}
		});

		// 相同的值加密后 不同
		// bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		// 	if(err){
		// 		return reject(err);
		// 	}
		// 	bcrypt.hash(password, salt, function(err,hash){
		// 		if(err){
		// 			return reject(err);
		// 		}
		// 		var params = [] ;
		// 		params.push(name);
		// 		params.push(hash);
		// 		console.log(hash);

		// 		client.query(SQLS.FINDBYNAMEPAS , params , function(err,results){
		// 			console.log(results);
		// 			if(err){
		// 				return reject(err);
		// 			}
		// 			resolve(results[0]);
		// 		});
		// 	});
		// });
	});
}

exports.save = function(user){
	return new Promise(function(resolve, reject){
		var params = [] ;
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err)
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) return reject(err);

				// user.password = hash
				if(user.id){
					client.query(SQLS.FINDBYID, user.id , function(err, results){
						if(err){
							return reject(err);
						}
						var _user = _.extend(results[0],user);
						params.push(_user.name);
						params.push(hash);
						params.push(_user.role);
						params.push(_user.createDate);
						params.push(_user.id);

						client.query(SQLS.UPDATE, params , function(err,results){
							if(err){
								return reject(err);
							}
							resolve(results);
						});
					});
					
				}
				else {
					params.push(util.uuid());
					params.push(user.name);
					params.push(hash);
					params.push('0');
					params.push(Date.now());
					client.query(SQLS.INSERT, params , function(err,results){
						if(err){
							return reject(err);
						}
						resolve(results);
					});
				}
			})
		})
	});
}

