var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');//根据文件扩展名得出mime类型

var chatServer = require('./lib/chat_server');

var cache = {};


//发送文件数据及错误相应
function send404(res)
{
    res.writeHead(404,{'Content-Type':'text/plain'});
    res.write('Error 404:resource not found');
    res.end();
}


//发送文件
//之所以用fileContents是为了支持缓存来存储页面的数据
function sendFile(res,filePath,fileContents)
{
    res.writeHead(200,{'Content-Type':mime.lookup(path.basename(filePath))});
    res.end(fileContents);
}


function serverStatic(res,cache,absPath)
{
    if(cache[absPath])
    {
        sendFile(res,absPath,cache[absPath]);
    }
    else{
        fs.exists(absPath,function(exists){
            if(exists)//文件存在
            {
                fs.readFile(absPath,function(err,data){

                    if(err)
                    {
                        send404(fs);
                        console.log(err);
                    }else{
                        cache[absPath]=data;
                        sendFile(res,absPath,data);
                    }
                    
                });
            }
            else{
                send404(res);
            }

        })
    }
}




var server = http.createServer();
server.on('request',function(req,res){
    var filePath = false;//? why bool
    if(req.url=='/')
    {
        filePath='public/index.html';
    }else{
        filePath='public'+req.url;
    }

    var absPath = "./"+filePath;
    serverStatic(res,cache,absPath);

});

server.listen(2000);

console.log('server running on http://localhost:2000/');


chatServer.listen(server);


