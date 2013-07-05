//Socket.io
var socket = io.connect();

socket.on('error', function (reason){
  console.error('Unable to connect Socket.IO', reason);
});
  
socket.on('connect', function (){
  socket.emit('new private msg notice')
});

socket.on('list friend',function(data){
  
});
socket.on('new private msg',function(data){
  var uid=data.uid,uname=data.uname,avatar=data.avatar,content=data.content,ctime=data.ctime;
  var li='<li>';
  li+='<img src="" class="avatar" />';
  li+='<label><a href="#">'+uname+'</a></label>';
  li+='<span>'+content+'</span>';
  $('.chat-dialogbox-chatting ul').append(li);
});
socket.on('new private msg notice',function(data){
  var uid=data.uid,total=data.total;
  
});
socket.on('new event msg',function(data){
  var uid=data.uid,uname=data.uname,avatar=data.avatar,content=data.content,ctime=data.ctime;
  var li='<li>';
  li+='<img src="" class="avatar" />';
  li+='<label><a href="#">'+uname+'</a></label>';
  li+='<span>'+content+'</span>';
  $('.chat-dialogbox-chatting ul').append(li); 
});
socket.on('open private window',function(data){
  var userinfo=data.userinfo,uid=userinfo.uid,hasexist=0;
  $('.chat-viewport').each(function(i,e){
    if($(e).hasClass('private_'+uid)){
      $(e).show();
      hasexist=1;
    }else{
      $(e).hide();
    }
  });
  if(!hasexist){
    var box='<div class="chat-viewport private_'+uid+'">';
    box+='<div class="chat-profile-event">';
    box+='<img src="img/noavatar.jpg" alt="" class="avatar">';
    box+='<label><a href="#">'+userinfo.uname+'</a></label>';
    box+='</div>';
    box+='<div class="chat-dialogbox">';
    box+='<div class="chat-dialogbox-chatting">';
    box+='<div class="history">';
    box+='<span><i class="icon-time"></i> <a href="#" class="sub-link">查看更早聊天记录</a></span>';
    box+='</div>';
    box+='<ul class="unstyled">';
    box+='</ul>';
    box+='</div>';
    box+='<div class="chat-dialogbox-faces-list"></div>';
    box+='</div>';
    box+='<div class="chat-inputbox">';
    box+='<input type="text" id="input-text" placeholder="聊天输入..">';
    box+='<button type="button" id="input-submit" onclick="friendSend(this,'+uid+')">发送</button>';
    box+='</div></div>';
    $('.chat-viewbox').append(box);
  }
});
function friendChannel(){
  socket.emit('friend channel');
}

function chatWithFriend(uid,uname){
  socket.emit('start private chat',{uid:uid,uname:uname});
  //document.location="/nodejs/chat/friend/?uid="+uid;
}
function openPrivateWindow(){

}
function chatWithEvent(eid,title){
  socket.emit('start event chat',{eid:eid,title:title});
  document.location="/nodejs/chat/event/?eid="+eid;
}
function friendSend(that,uid){
  var content=$(that).siblings('input:text').val();
  socket.emit('my private msg',{uid:uid,msg:content});
  $(that).siblings('input:text').val('');
}
function eventSend(that,eid){
  var content=$(that).siblings('input:text').val();
  socket.emit('my event msg',{eid:eid,msg:content});
  $(that).siblings('input:text').val('');
}