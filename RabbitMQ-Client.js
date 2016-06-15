var context = require('rabbit.js').createContext('http://127.0.0.1');


// the context will emit 'ready' when it's connected
context.on('ready',function(){

    //to start sending or receiving message you need to acquire a socket;
    var pub = context.socket('PUBLISH');
    var sub = context.socket('SUBSCRIBE');

    var worker = context.socket('WORKER');

    
    //connect to something
    pub.connect('');
    sub.connect('');

    // human knows
    sub.setEncoding('utf8');
    sub.on('data',function(result){
        console.log(result);

    });

});

// error handle

context.on('error',function(){



});