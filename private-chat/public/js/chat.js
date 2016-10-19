$(function(){
	// 获取房间号
	var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]) ;

	// 链接到socket
	var socket = io() ;

	var name = "",
		email = "",
		img = "",
		friend = "";

	var section = $(".section"),
		footer = $("footer"),
		onConnect = $(".connected"),
		inviteSomebody = $(".invite-textfield"),
		personInside = $(".personinside"),
		chatScreen = $(".chatscreen"),
		left = $(".left"),
		noMessages = $(".nomessages"),
		tooManyPeople = $(".toomanypeople");

	var chatNickname = $(".nickname-chat"),
		leftNickname = $(".nickname-left"),
		loginForm = $(".loginForm"),
		yourName = $("#yourName"),
		yourEmail = $("#yourEmail"),
		hisName = $("#hisName"),
		hisEmail = $("#hisEmail"),
		chatForm = $("#chatform"),
		textarea = $("#message"),
		messageTimeSent = $(".timesent"),
		chats = $(".chats");

	var ownerImage = $("#ownerImage"),
		leftImage = $("#leftImage"),
		noMessagesImage = $("#noMessagesImage");

	// 监听链接
	socket.on('connect' , function(){
		socket.emit('load' , id);
	}) ;

	// 获取头像事件
	socket.on('img' , function(data){
		img = data ;
	}) ;

	// 进入房间事件
	socket.on('peopleinchat', function( data ){
		if(data.number == 0){
			showMessage('connected') ;
			loginForm.on('submit' , function( e ) {
				e.preventDefault();
				name = $.trim(yourName.val());
				if(name.length < 1){
					alert("请输入昵称!");
					return;
				}

				email = yourEmail.val() ;

				if(!isValid(email)){
					alert("请输入合法的邮箱!");
				}else{
					showMessage("inviteSomebody");
					// 用户登录
					socket.emit('login', {user: name, avatar: email, id: id});
				}

			}) ;
		}
		else if(data.number == 1){
			showMessage("personinchat",data);

			loginForm.on('submit', function(e){
				e.preventDefault();
				name = $.trim(hisName.val());
				if(name.length < 1){
					alert("请输入昵称!");
					return;
				}

				if(name == data.user){
					alert("已经有个 \"" + name + "\" 在聊天室!");
					return;
				}
				email = hisEmail.val();

				if(!isValid(email)){
					alert("邮箱格式错误!");
				}
				else {
					socket.emit('login', {user: name, avatar: email, id: id});
				}

			});
		}else {
			showMessage('tooManyPeople');
		}
	}) ;

	// 开始聊天
	socket.on('startChat', function(data){
		if(data.boolean && data.id == id){
			chats.empty() ;
			if(name == data.users[0]){
				showMessage("youStartedChatWithNoMessages",data);
			}else{
				showMessage("heStartedChatWithNoMessages",data);
			}
			chatNickname.text(friend);
		}	
	}) ;

	socket.on('tooMany', function(data){
		if(data.boolean) {
			showMessage('tooManyPeople');
		}
	}) ;

	//  发送消息
	textarea.keypress(function(e){
		if(e.which == 13){
			e.preventDefault();
			chatForm.trigger('submit');
		}
	});

	// 发送消息
	chatForm.on('submit', function(e){
		e.preventDefault() ;
		showMessage("chatStarted");

		if(textarea.val().trim().length){
			createChatMessage(textarea.val(), name, img, moment());
			scrollToBottom();
			// 发送消息
			socket.emit('msg', {msg: textarea.val(), user: name, img: img});
		}
		textarea.val('') ;
	}) ;

	// 接收消息
	socket.on('receive' , function(data){
		showMessage('chatStarted') ;
		
		if(data.msg.trim().length) {
			createChatMessage(data.msg, data.user, data.img, moment());
			scrollToBottom();
		}
	}) ;

	// 有人离开聊天房间
	socket.on('leave' , function(data){
		if(data.boolean && id==data.room){
			showMessage("somebodyLeft", data);
			chats.empty();
		}

	}) ;

	// 创建一条消息
	function createChatMessage(msg,user,imgg,now){
		var who = '';

		if(user===name) {
			who = 'me';
		}
		else {
			who = 'you';
		}

		var li = $(
			'<li class=' + who + '>'+
				'<div class="image">' +
					'<img src=' + imgg + ' />' +
					'<b></b>' +
					'<i class="timesent" data-time=' + now + '></i> ' +
				'</div>' +
				'<p></p>' +
			'</li>');

		// use the 'text' method to escape malicious user input
		li.find('p').text(msg);
		li.find('b').text(user);

		chats.append(li);

		messageTimeSent = $(".timesent");
		messageTimeSent.last().text(now.fromNow());
	}

	function scrollToBottom(){
		$("html, body").animate({ scrollTop: $(document).height()-$(window).height() },1000);
	}



	function isValid(thatemail) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(thatemail);
	}

	function showMessage(status,data){
		if(status === "connected"){
			section.children().css('display', 'none');
			onConnect.fadeIn(1200);
		}else if(status === "inviteSomebody"){
			$("#link").text(window.location.href);
			onConnect.fadeOut(1200, function(){
				inviteSomebody.fadeIn(1200);
			});
		}
		else if(status === "personinchat"){
			onConnect.css("display", "none");
			personInside.fadeIn(1200);

			chatNickname.text(data.user);
			ownerImage.attr("src",data.avatar);
		}
		else if(status === "tooManyPeople") {
			section.children().css('display', 'none');
			tooManyPeople.fadeIn(1200);
		}
		else if(status === "youStartedChatWithNoMessages") {
			left.fadeOut(1200, function() {
				inviteSomebody.fadeOut(1200,function(){
					noMessages.fadeIn(1200);
					footer.fadeIn(1200);
				});
			});

			friend = data.users[1];
			noMessagesImage.attr("src",data.avatars[1]);
		}
		else if(status === "heStartedChatWithNoMessages") {
			personInside.fadeOut(1200,function(){
				noMessages.fadeIn(1200);
				footer.fadeIn(1200);
			});

			friend = data.users[0];
			noMessagesImage.attr("src",data.avatars[0]);
		}
		else if(status == 'chatStarted'){
			section.children().css('display','none');
			chatScreen.css('display','block');
		}
		else if(status == 'somebodyLeft'){
			leftImage.attr("src",data.avatar);
			leftNickname.text(data.user);

			section.children().css('display','none');
			footer.css('display', 'none');
			left.fadeIn(1200);
		}
	}


}) ;