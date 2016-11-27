var IndexController = require('../app/controllers/index');
var MovieController = require('../app/controllers/movie');
var UserController = require('../app/controllers/user');
var CommentController = require('../app/controllers/comment');


module.exports = function(app){
	// 获取session信息
	app.use(function(req, res, next) {
		var _user = req.session.user

		app.locals.user = _user
		next()
	})

	app.get('/index',IndexController.index) ;

	// user
	app.post('/user/signup',UserController.signup);
	app.post('/user/signin',UserController.signin);
	app.get('/signin', UserController.showSignin);
	app.get('/signup', UserController.showSignup);
	app.get('/logout',UserController.logout);
	app.get('/userlist', UserController.loginRequired, UserController.adminRequired, UserController.userlist);


	// movie
	app.get('/detail/:id', MovieController.detail);
	app.get('/list',MovieController.list);
	app.get('/admin/new',UserController.loginRequired, UserController.adminRequired,MovieController.new);
	app.post('/admin/control/new', UserController.loginRequired, UserController.adminRequired, MovieController.save);
	app.get('/admin/control/update/:id',UserController.loginRequired, UserController.adminRequired,MovieController.update);
	app.delete('/admin/control/delete', UserController.loginRequired, UserController.adminRequired,MovieController.delete);

	// comment
	app.post('/user/comment', UserController.loginRequired, CommentController.save);

}