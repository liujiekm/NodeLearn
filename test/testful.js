var fibonacci = require('./lib/fibonacci');
var should = require('should');


describe('testful.js',function(){
    
    it('should equals 55 when n === 10',function(){
        
       fibonacci.fibonacci(10).should.equal(55); 
    });
    
    
    it('should equals 0 when n === 0',function(){
        
       fibonacci.fibonacci(0).should.equal(0); 
        
    });
    
    it('should equals 1 when n === 1',function(){
    
       fibonacci.fibonacci(1).should.equal(1); 
        
    });
    
});