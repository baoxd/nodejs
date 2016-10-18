
var express = require('express') ;
var app = express() ;
var port = process.env.PORT || 3000 ;
var io = require('socket.io').listen(app.listen(port)) ;

// Set .html as the default template extension
app.set('view engine', 'html');

// Initialize the ejs template engine
app.engine('html', require('ejs').renderFile);

// Tell express where it can find the templates
app.set('views', __dirname + '/views');

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));




app.get('/', function(req, res){
	res.render('index');
});

var roomId = 1212 ;

var chat = io.on('connection' , function( socket ){
	// 进入房间
	socket.join(roomId);
	console.log('socket connection...') ;
	// 接收数据
	socket.on('msg' , function(data){
		// console.log(data);
		// socket.broadcast.emit('receive', data) ;
		// socket.broadcast.to(roomId).emit('receive', data) ;
		chat.in(roomId).emit('receive' , data) ;
	});
}) ; 

console.log('Project running on ' + port) ;



