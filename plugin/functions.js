var util = require("util");

exports.cloneObject = function(obj) {
    if(typeof obj === "object") {
        if(util.isArray(obj)) {
            var newArr = [];
            for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
            return newArr;
        } else {
            var newObj = {};
            for(var key in obj) {
                newObj[key] = this.cloneObject(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
};

exports.verifyBlahblah = function(blahblah) {
    var array = blahblah.split("^");
    var time = array[array.length - 1];
    array.pop();

    var encoder = require("../lib/smpEncoder");

    try {
        var text = encoder.norBack(array, time.toString());
        text = encoder.decode(text);
    } catch(e) {
        return false;
    }

    var now = text.substr(0, 10);
    var token = text.substr(10);

    if(parseInt(Date.now() / 1000) - parseInt(now) > 300) return false;
    if(token !== require("../commonConst").token) return false;

    return true;
};

exports.hex2string = function(text) {
    var i = 0;
    var result = "";
    while(i < text.length) {
        if(text[i] === '\\' && i < text.length - 1 && text[i + 1] !== 'x') {
            result += text[i];
            result += text[i + 1];
            i += 2;
        } else if(text[i] === '\\' && i < text.length - 1 && text[i + 1] === 'x') {
            var temp = text.substr(i + 2, 2);
            temp = parseInt(temp, 16);
            temp = String.fromCharCode(temp);
            result += temp;
            i += 4;
        } else {
            result += text[i];
            i++;
        }
    }

    //console.log(result);
    return result;
};
