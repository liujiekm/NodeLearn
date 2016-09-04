var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var app = express();

app.get('/',function(req,res,next) {
    
    //用superagent抓取https://cnodejs.org/的内容
    superagent.get('https://cnodejs.org/').end(
        function(err,sres) {
            if(err)
            {
                next(err);
            }
            
            var $ =cheerio.load(sres.text);
            var items=[];
            $('#topic_list .topic_title').each(function(index,item) {
                var $item = $(item);
                items.push({
                    title:$item.attr('title'),
                    href:$item.attr('href')
                });
            });
            
            res.send(items);
            
        });

});

app.listen(3000);