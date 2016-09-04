var fs = require('fs');

var http = require('http');
var stream = fs.createReadStream('./resource.json');

// fs.readFile('./resource.json',function(err,data){
//     if(err)
//     {
//         console.log(err);
//         return ;
//     }

//     console.log(data);
//     console.log('this is not stream');
// });


// stream.on('data',function(chunk){
//     console.log(chunk);
// });

// stream.on('end',function(){

//     console.log('finished');
// });

var server = http.createServer();
server.on('request',function(req,res){

    res.writeHead(200,{'Content-Type':'image/png'});

    fs.createReadStream('./image.png').pipe(res);
});
server.listen(2000);
console.log('Server running at http://localhost:2000/')

