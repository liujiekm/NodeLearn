var socketio = require('socket.io');
var io;
var guestNumber=1;
var nickNames={};
var namesUsed=[];
var currentRoom ={};




exports.listen=function(server){

    io = socketio.listen(server);//启动socket io 服务器，允许它搭载在已有的http服务器上

    io.set('log level',1);

    io.sockets.on('connection',function(socket){
        //当有用户连接上来时，赋予其一个访客名
        guestNumber=assignGuestName(socket,guestNumber,nickNames,namesUsed);
        //在用户连接上来时把他加入聊天室lobby
        joinRoom(socket,'Lobby');

        handleMessageBroadcasting(socket,nickNames);

        handleNameChangeAttempts(socket,nickNames,namesUsed);

        handleRoomJoining(socket);

        //当用户发起请求时，向其提供已经被占用的聊天室列表
        socket.on('rooms',function(){

            socket.emit('rooms',io.sockets.manager.rooms);
        });

        handleClientDisconnection(socket,nickNames,namesUsed);


    });

}


function assignGuestName(socket,guestNumber,nickNames,namesUsed)
{
    var name = 'Guest'+guestNumber;
    nickNames[socket.id]=name;//与当前socket id相关联

    socket.emit('nameResult',{success:true,name:name});//知会所有client nickname

    namesUsed.push(name);
    return guestNumber++;
}

// 用户加入房间
function joinRoom(socket,room)
{
    socket.join(room);//让用户进入房间

    currentRoom[socket.id]=room;//纪录用户的当前房间 根据用户id aka socket.id

    socket.emit('joinResult',{room:room}); //触发加入room事件

    socket.broadcast.to(room).emit('message',{text:nickNames[socket.id]+' has joined '+room +'.'});//通知房间用户 有用户加入，通过触发 message 事件

    var usersInRoom = io.sockets.clients(room);//获得连接到当前房间的用户客户端

    if(usersInRoom.length>1)
    {
        var usersInRoomSummary = 'Users currently in '+room+':';
        for(var index in usersInRoom)
        {
            var userSocketId = usersInRoom[index].id;
            if(userSocketId!=socket.id)
            {
                usersInRoomSummary+=', ';
            }

            usersInRoomSummary+=nickNames[userSocketId];
        }
        usersInRoomSummary+='.';
        socket.emit('message',{text:usersInRoomSummary});
    }

}


//用户修改名称
function handleNameChangeAttempts(ocket,nickNames,namesUsed)
{
    //监听客户端改名命令
    socket.on('nameAttempt',function(name){
        if(name.indexOf('Guest')==0)//不允许Guest 开头的名称
        {
            socket.emit('nameResult',{success:false,message:'Names cannot bgein with "Guest".'});
        }
        else
        {
            if(namesUsed.indexOf(name)==-1)//未使用的名称
            {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);

                namesUsed.push(name);
                nickNames[socket.id]=name;
                delete namesUsed[previousNameIndex];

                socket.emit('nameResult',{success:true,name:name});

                //告知房间内用户改名信息
                socket.broadcast.to(currentRoom[socket.id]).emit('message',{text:previousName +' is now know as '+name+' .'});
            }
            else
            {
                socket.emit('nameResult',{success:false,message:'This name already in use'});
            }
        }


    });


}


//发送聊天信息
function handleMessageBroadcasting(socket,nickNames)
{
    socket.on('message',function(message){

        //广播给房间内的所有用户
        socket.broadcast.to(currentRoom[socket.id]).emit('message',{text:nickNames[socket.id]+': '+message.text});

    });
}


//创建房间
function handleRoomJoining(socket)
{
    socket.on('join',function(room){

        socket.leave(currentRoom[socket.id]);

        joinRoom(socket,room.newRoom);
    });
}
//用户断开连接
function handleClientDisconnection(socket,nickNames,namesUsed)
{
    socket.on('disconnect',function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];

    });
}