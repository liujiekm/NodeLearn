var http= require('http');

var formidable = require('formidable');


var server = http.createServer(function(req,res){
    switch (req.method) {
        case 'GET':
            show(req,res);
            break;
        case 'POST':
            upload(req,res);
            break
    
        default:
            break;
    }

});


function show(req,res) {
    var content = '<form action="/" enctype="multipart/form-data">'
                    +'<p><input type="text" name="name" /></p>'
                    +'<p><input type="file" name="file" /></p>'
                    +'<p><input type="submit" value="Upload" /></p>'
                    +'</form>'
    
    ;
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(content));
    res.end(content);
}

function upload(req,res) {
    if(!isFormData(req))
    {
        res.statusCode=400;
        res.end('Bad Request');
    }
    else{
        var form = new formidable.IncomingForm();
        form.parse(req,function(err,fields,files) {
            console.log(fields);
            console.log(files);
            req.end('upload complete!');
        });//调用此方法之后formidable就可以对请求的data时间进行解析 


        form.on('progress',function(bytesReceived,bytesExpected) {
            
            var percent = Math.floor(bytesReceived/bytesExpected*100);
            console.log(percent);
        });
    }
}


server.listen(3000,function(){

    console.log('server running on port 3000');

});


function isFormData(req) {
    var type = req.headers['Content-Type']||'';
    return type.indexOf('multipart/form-data')==0;
}