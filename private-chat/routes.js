
var gravatar = require('gravatar');

module.exports = function(app, io){

	// 访问根目录
	app.get('/', function(req , res){
		res.render('home') ;
	}) ;

	// 创建房间
	app.get('/create',function(req, res){
		var id = Math.round(Math.random() * 1000000 ) ;
		res.redirect('/chat/'+id) ;
	});

	app.get('/chat/:id', function(req, res){
		res.render('chat');
	}) ;

	var chat = io.on('connection' , function (socket){
		// 检查房间人数剩余
		socket.on('load' , function (data){
			var room = findClientsSocket(io , data) ;
			if(room.length == 0){
				socket.emit('peopleinchat', {'number' : 0}) ;
			}else if(room.length == 1){
				socket.emit('peopleinchat', {
					number : 1 ,
					user : room[0].username ,
					avatar : room[0].avatar ,
					id : data 
				}) ;
			}else if(room.length >= 2){
				// chat.emit('tooMany',{boolean:true}) ;
				socket.emit('tooMany',{boolean:true})
			}
		}) ;

		socket.on('login' , function( data ){
			var room = findClientsSocket(io , data.id) ;

			if(room.length < 2){
				socket.username = data.user ;
				socket.room = data.id ;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});
				socket.emit('img' , socket.avatar);

				socket.join(data.id) ;

				if(room.length == 1){
					var usernames = [] ,
					     avatars = [] ;
					usernames.push(room[0].username) ;
					usernames.push(socket.username) ;
					avatars.push(room[0].avatar) ;
					avatars.push(socket.avatar) ;

					chat.in(data.id).emit('startChat', {
						boolean : true ,
						id : data.id ,
						users : usernames ,
						avatars : avatars
					}) ;
				}
			}else{
				socket.emit('tooMany' , {boolean : true});
			}
		}) ;

		// 接收消息 并转发到房间里其他人
		socket.on('msg' , function( data ){
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		}) ;
		
		// 有人离开聊天房间
		socket.on('disconnect' , function(data){
			socket.broadcast.to(socket.room).emit('leave' , {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});
		} );
		
	}) ;
}

// 查询某namespace下链接的客户端
function findClientsSocket(io, roomId, namespace){
	var res = [] ,
		ns = io.of(namespace || '/') ;
	if(ns){
		for(var id in ns.connected){
			if(roomId){
				if(ns.connected[id].rooms.indexOf(roomId) >= 0){
					res.push(ns.connected[id]);
				}
			}else{
				res.push(ns.connected[id]);
			}
		}
	}
	return res ;
}

