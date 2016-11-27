var mysql = require('mysql');

var HOST = 'localhost' ;
var USER = 'root' ;
var PASSWORD = '1234';
var DATABASE = 'nodejs' ;
var LIMIT = 10;


// 获取数据库连接
exports.client = function(){
	return mysql.createPool({
		host: HOST,
		user: USER,
		password: PASSWORD,
		database: DATABASE,
		connectionLimit: LIMIT
	});
}