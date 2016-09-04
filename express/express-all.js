var express = require('express');
var app = express();


var users = [{name:'kobe'},{name:'jordan'}];

app.all('/user/:id/:op?',function(req,res,next){
    var user = users[req.params.id];
    //赋值到全局request的变量中
    req.user=user;
    if(user)
    {
        next();
    }
    else
    {
        next(new Error('Cannot find user with ID :'+req.params.id));
    }
    
    
});


app.get('/user/:id',function(req,res) {
    res.send('Viewing '+req.user.name);
});
app.get('/user/:id/edit',function(req,res) {
    res.send('Editing '+req.user.name);
});
app.put('/user/:id',function(req,res) {
    res.send('Updating '+req.user.name);
});
app.get('*',function(req,res) {
    res.send('Danger , Will Robinson! ', 404);

});




app.listen(4000,function() {
    console.log('server is on port 3000');
});
