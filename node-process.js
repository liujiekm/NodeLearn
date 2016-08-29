process.nextTick(function(){

    console.log("process.nextTick延迟执行1");
});

process.nextTick(function(){

    console.log("process.nextTick延迟执行2");
});

setImmediate(function(){
    console.log("setImmediate延迟执行1");
    process.nextTick(function(){

        console.log("process.nextTick延迟执行3");
    });
});


setImmediate(function(){
    console.log("setImmediate延迟执行2");
});



console.log("正常执行");