var connection = require('amqp').createConnection();

function sleep(milliseconds)
{
    var start = new Date().getTime();
    while(new Date().getTime()<start+milliseconds);
}

connection.on('ready',function() {
    console.log('Connected to '+connection.serverProperties.product);

    var exchange = connection.exchange('up-and-running');

    var queue = connection.queue('up-and-running-queue');

    queue.on('queueDeclareOk',function(args) {
        queue.bind(exchange,'#');

        q.subscribe({ack:true},function (message) {
            console.log('Message received');
            console.log(message.count);
            sleep(5000);

            console.log('Processed. Waiting for next message');
            queue.shift();//import   因为设置了ack＝true 需要用户确认，确认完成之后需要调用 queue.shift方法来把消息踢出队列

        });
    });


});