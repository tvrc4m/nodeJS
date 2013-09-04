//$('.chat-panel, .chat-window').draggable();

	$('.chat-close').mouseover(function(){
		$(this).find('i').removeClass('icon-remove').addClass('icon-remove-sign');
	}).mouseout(function(){
		$(this).find('i').removeClass('icon-remove-sign').addClass('icon-remove');
	}).click(function(){
		$('.chat-panel').fadeOut();
		$('.chat-window').fadeOut();
	});

	$('#chat-tab li, #chat-tab-v li').click(function(){
		var element = $(this).find('a');
		var eq = element.index();
		tabActive(element, eq);
	})
	
	var tabActive = function(element, eq){
		element.eq(eq).tab('show');
	}

	$('.conversation-content li').mouseover(function(){
		$(this).css('background','#ffffcc');
		$(this).find('.icon-remove-sign').show();
	}).mouseout(function(){
		$(this).css('background','#ffffff');
		$(this).find('.icon-remove-sign').hide();
	}).click(function(){
		$('.chat-panel').hide();
		$('.chat-window').fadeIn(100);
	});

var socket = io.connect();

