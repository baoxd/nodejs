process.chdir(__dirname) ;

var cluster = require('cluster');
var os = require('os');
var log = require('npmlog');

log.level = 'silly';

process.on('SIGTERM', function() {
	log.warn('exit', 'Exited on SIGTERM');
	process.exit(0);
});

process.on('SIGINT', function() {
	log.warn('exit', 'Exited on SIGINT');
	process.exit(0);
});

process.on('uncaughtException', function(err) {
	log.error('uncaughtException ', err);
	process.exit(1);
});

if (cluster.isMaster) {
	cluster.on('fork', function(worker) {
		log.info('cluster', 'Forked worker #%s [pid:%s]', worker.id, worker.process.pid);
	});

	cluster.on('exit', function(worker) {
		log.warn('cluster', 'Worker #%s [pid:%s] died', worker.id, worker.process.pid);
		setTimeout(function() {
			cluster.fork();
		}, 1000);
	});
	cluster.fork();
	return;
}

var express = require('express') ;
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname,'public/upload')});
var port = process.env.PORT || 8000 ;
var app = express() ;
// 在模板中使用moment变量
app.locals.moment = require('moment');

app.set('view engine','html') ;
app.engine('html',require('ejs').renderFile) ;
app.set('views',path.join(__dirname,'app/views')) ;
app.use(express.static(path.join(__dirname, 'public')));
// 新版本express不在包含bodyParser、cookieParser中间件，需要单独安装
app.use(bodyParser.urlencoded({extended: true})) ;
// app.use(upload.single('uploadPoster'));
// multer和connect-multiparty模块稍有不同
// multer可以直接将文件上传至指定的文件夹
// connect-multiparty将文件上传至临时文件夹，需要手动移动到指定的文件夹
app.use(require('connect-multiparty')());
app.use(cookieParser()) ;
app.use(session({
	secret: 'MYSQL'
})) ;
// app.use(express.bodyParser()) ;
// app.use(express.cookieParser()) ;
// app.use(express.session({
// 	secret: 'MYSQL'
// })) ;

if ('development' === app.get('env')) {
	app.set('showStackError', true);
	// app.use(express.logger(':method :url :status'));
	app.use(require('morgan')(':method :url :status', {
		'stream': {
			'write': function(line) {
				if ((line = (line || '').trim())) {
					log.http('express', line);
				}
			}
		}
	}));
}

require('./router/routes')(app);

app.listen(port);
console.log('mysql-test started on port :' + port) ;
