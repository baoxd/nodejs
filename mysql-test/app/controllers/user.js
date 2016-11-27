var userModel = require('../models/userModel');


module.exports = {
	showSignin: function(req, res){
		res.render('signin',{'title':'登录页面'});
	},
	showSignup:function(req,res){
		res.render('signup', {'title':'注册页面'});
	},

	// 登出
	logout: function(req, res) {
		delete req.session.user;
		res.redirect('/');
	},

	// 用户列表
	userlist:function(req,res){
		userModel.findAll().then(function(data){
			res.render('userlist',{list:data,title:'电影-用户列表'});
		}).catch(function(e){
			console.log(e);
			res.redirect('/');
		});
	},

	// 注册
	signup: function(req, res){
		var user = req.body.user;
		// console.log(user);
		if(user && user.name){
			userModel.findByName(user.name).then(function(data){
				// console.log(data);
				if(data && data[0]){
					res.redirect('/signin');
				}else{
					userModel.save(user).then(function(data){
						res.redirect('/');
					}).catch(function(e){
						console.log(e);
						res.redirect('/');
					})
				}
				res.end();
			}).catch(function(e){
				console.log(e);
				res.redirect('/');
			});
		}else{
			res.redirect('/');
		}
	},

	// 登录
	signin: function(req, res){
		var user = req.body.user;
		// console.log(user);
		if(user && user.name && user.password){
			// console.log(user);
			userModel.login(user).then(function(data){
				if(data){
					req.session.user = data ;
					res.redirect('/');
				}else{
					res.redirect('/signup');
				}
			}).catch(function(e){
				console.log(e);
				res.redirect('/');
			});
		}
	},
	// 必须登录中间件
	loginRequired: function(req, res, next) {
		var user = req.session.user;
		if (!user) {
			return res.redirect('/signin');
		}
		next()
	} ,
	// 管理员中间件
	adminRequired: function(req, res, next) {
		var user = req.session.user;
		if (user.role <= 10) {
			return res.redirect('/signin');
		}
		next();
	}
} ;