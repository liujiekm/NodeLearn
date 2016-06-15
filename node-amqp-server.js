var connection = require('amqp').createConnection();

var count=0;

connection.on('ready',function(){
    console.log('Connected to '+connection.serverProperties.product);

    //接受消息，并把消息传递给绑定的队列的实体
    var exchange = connection.exchange('up-and-running');

    var queue = connection.queue('up-and-running-queue');

    queue.on('queueDeclareOk',function(args){
        console.log('Queue opened');
        queue.bind(exchange,'#');

        queue.on('queueBindOk',function(){
            console.log('Queue bound');

            setInterval(function(){
                console.log('Publishing message #'+ ++count);
                exchange.publish('routingKey',{count:count});
            },1000)
        });
    });


});