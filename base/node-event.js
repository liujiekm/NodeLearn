
var events = require('events');
var emitter = new events.EventEmitter();

emitter.on("event1",function(message){

    console.log(message);
})



emitter.emit('event1',"i am message1")
