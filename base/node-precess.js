var http = require('http');
var process = require('process');

var server = http.createServer(function(req,res){
    res.writeHead(200,{});
    res.end('response');
    
    badLoggingCall();
    console.log('send response');
    
    
});

process.on('uncaughtException',function(e){
    
    console.log(e);
    
});

function badLoggingCall()
{
    return new Error('Damn error');
}


server.listen('2000');