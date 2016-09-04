var http = require('http');

var qs = require('querystring');

var url = require('url');

var items=[];

var desc =[];


var server = http.createServer(function(req,res){

    // if('/'==req.url)
    // {
        switch (req.method) {
            case 'GET':
                
                show(res);
                break;
            case 'POST':

                add(req,res);
                break;
            case 'DELETE':
                console.log('it is delete');
                del(req,res);
                break;
            default:
                badRequest(res);
                break;
        }
    // }
    // else{
    //     notFound(res);
    // }

});


function show(res) {
    var content = '<html><head><title>To Do List</title></head><body>'
                +'<h1>Todo List</h1>'
                +'<ul>'
                + Array.prototype.map.call(items,function(item){
                    return '<li>'+item+'</li>';
                }).join(' ')
                +'</ul>'
                +'<h2>Desc</h2>'
                +'<ul>'
                + Array.prototype.map.call(desc,function(item){
                    return '<li>'+item+'</li>';
                }).join(' ')
                +'</ul>'
                +'<form method="post" action="/">'
                +'<p><input type="text" name="item"></p>'
                +'<p><input type="text" name="desc"></p>'
                +'<p><input type="submit" value="Add Item"></p>'
             
                +'</form></body></html>';
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(content));
    res.end(content);
}

function del(req,res)
{
    var path=url.parse(req.url).pathname;
    var i = parseInt(path.slice(1),10);
    items.splice(i,1);
    show(res);
}

function add(req,res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data',function(chunk){
        body+=chunk;
        console.log(chunk);
    });

    req.on('end',function(){

        var obj = qs.parse(body);

        console.log(obj);
        items.push(obj.item);
        desc.push(obj.desc);
        show(res);


    });
}

function notFound(res) {
    res.setHeader('Content-Type','text/plain');
    res.statusCode=400;
    res.end('Not Found');

}


function badRequest(res) {
    res.setHeader('Content-Type','text/plain');
    res.statusCode=404;
    res.end('Bad Request');
}



server.listen(4000);