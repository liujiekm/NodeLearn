var express = require('express');
var app = express();
var utility = require('utility');



app.get('/',function(req,res){
    var query = req.query.query;
    //工具类 md5生产
    var md5Value = utility.md5(query);
    
    
    
    res.send(md5Value);
   
});

app.get('/param/:id?',function(req,res){
    
   var id = req.params.id;
   if(id)
   {
       res.send(id);
   }
   else
   {
       res.send('no param');
   }
});


app.listen(3000,function(){
    
   console.log('app is listen at port 3000'); 
    
});