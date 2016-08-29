var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();

channel.client = {};
channel.subscription={};


channel.on('join',function(id,client){

    var welcome = 'welcome!\n'+'Guests online: '+this.listeners('broadcast').length;
    client.write(welcome);

    this.client[id]=client;
    this.subscription[id]=function(senderId,message){
        if(id!=senderId)
        {
            this.client[id].write(message);
        }
    }
    this.on('broadcast',this.subscription[id]);

});

channel.on('leave',function(id){
    channel.emit('broadcast',id,id+' has left the chat.\n');
    channel.removeListener('broadcast',this.subscription[id]);

});

channel.on('shutdown',function(){


    channel.emit('broadcast','','Chat has shut down .\n');
    channel.removeAllListeners('broadcast');
});


var server = net.createServer(function(client){
    var id = client.remoteAddress+':'+client.remotePort;
    channel.emit('join',id,client);

    client.on('data',function(data){
        data = data.toString();

        if(data=='shutdown\r\n')
        {
            channel.emit('shutdown');
        }

        channel.emit('broadcast',id,data);
    });

    client.on('close',function(){
        channel.emit('leave',id);
    });


});

server.listen(8888);