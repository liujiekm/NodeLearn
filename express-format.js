var express = require('express');
var app = express();

// app.get('/users/:id.:format?',function(req,res){
    
//     if(req.params.format)
//     {
//         res.send(req.params.id +'<br/>'+req.params.format);
//     }
//     else{
//         next();
//     }
    
    
// });

app.get('/users/:id.:format((json|xml))',function(req,res){
    
    
    res.send(req.params.id +'<br/>'+req.params.format);
    
});

app.listen(1000);