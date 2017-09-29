var q = require("q");
var fs = require("fs");

q.die = function(reason){
    var d = q.defer();
    d.reject(reason);
    return d.promise;
};

module.exports = function(name, value){
    try{
        if( !fs.existsSync(".fecli") ) {
            fs.mkdirSync(".fecli")
        }
        fs.writeFileSync(".fecli/" + name, value);
        return q(value);
    }catch(e){
        return q.die(e);
    }
};
