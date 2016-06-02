var express = require('express');
var app = express();

app.get('/',function(req,res){
    
    
    res.render('index.jade',{pageTitle:'Jade Example',layout:false});
});

app.listen(1000);