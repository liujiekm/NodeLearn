var http = require('http');
var path = require('path');

var parse = require('url').parse;
var fs = require('fs');

var join = path.join;

var root = __dirname;


var server = http.createServer(function(req,res){

    var url = parse(req.url);
    var path = join(root,url.pathname);
    //var stream = fs.createReadStream(path);

    // console.log(path);
    // stream.on('data',function(chunk){
    //     res.write(chunk);
    // });
    // stream.on('end',function(){
    //     res.end();
    // });


    // stream.pipe(res);

    // stream.on('error',function(error){

    //     res.statusCode=500;
    //     res.end('Internal Server Error');
    // });


    fs.stat(path,function(err,stat){

        if(err)
        {
            if(err.code=='ENOENT')
            {
                res.statusCode=404;
                res.end('File Not Found');
            }
            else
            {
                res.statusCode=500;
                res.end('Internal Server Error');
            }
        }
        else{
            res.setHeader('Content-Length',stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error',function(error){

                res.statusCode=500;
                res.end('Internal Server Error');
            });
        }
    });

});

server.listen(5000);