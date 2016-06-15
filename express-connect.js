var express = require('express');


var cookieParser = require('cookie-parser');
var session = require('express-session');
// var app = express.createServer(
//     express.cookieParser(),//Connect 中间件 解析请求中的cookie
//     express.session({secret:'secret key'})//Conect 中间件，让多个请求共享用户数据的session管理
    
// );

var app = express();

app.use(cookieParser());
app.use(session({secret:'secret key',
                resave:'true',
                saveUninitialized:'true'
}));



var roleFactory = function(role){
    return function(req,res,next){
        if(req.session.role&&req.session.role.indexOf(role)!=-1)
        {
            next();
        }
        else{
            res.send('You are not authenticated!');
        }
        
        
    }
    
    
};

app.get('/',roleFactory,function(req,res){
    
    res.send('Welcome to Express');
    
    
});

app.get('/auth',function(req,res){
    
    req.session.role='admin';
    res.send('You have been authenticated');
    
});

app.listen(1000);