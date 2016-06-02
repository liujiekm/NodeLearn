var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var eventproxy = require('eventproxy');
var url = require('url');



var app = express();
var ep = new eventproxy();
var cnodeUrl = 'https://cnodejs.org';

// app.get('/',function(req,res,next) {
    superagent.get(cnodeUrl).end(function(err,sres) {
        if(err)
        {
            console.log(err);
        }
        
        var topicUrls =[];
        var $ = cheerio.load(sres.text);
        $('#topic_list .topic_title').each(function(index,item) {
            var $item = $(item);
            var topicUrl = url.resolve(cnodeUrl,$item.attr('href'));
            topicUrls.push(topicUrl);
            
        });
        
        
        
        
        ep.after('top_html',topicUrls.length,function(topics) {
            
            
            topics=topics.map(
                function (topicPair) {
                    var topUrl=topicPair[0];
                    var topHtml = topicPair[1];
                    
                    var $ = cheerio.load(topHtml);
                    
                    return ({
                                title: $('.topic_full_title').text().trim(),
                                href: topUrl,
                                comment1: $('.reply_content').eq(0).text().trim(),
                            });

                }
            );
            
              console.log('final:');
                console.log(topics);
            
        });
        
        
        
        topicUrls.forEach(function(topicUrl) {
            superagent.get(topicUrl).end(function(err,sres) {
                console.log('fetch '+topicUrl+' successful!');
                ep.emit('top_html',[topicUrl,sres.text]);
            });
        });
        
        
        
        
        console.log(topicUrls);

    });
    
    
// });


// app.listen(2000);