/**
 * XadillaX created at 2014-10-31 15:49:09
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved
 */
var crypto = require('crypto');
var cryptkey = crypto.createHash('sha256').update('__dang_kacakaca_key').digest();
var token = "1234567890000000";

//解密
function decode(secretdata) {
    var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, token),
        decoded = decipher.update(secretdata, 'base64', 'utf8');

    decoded += decipher.final('utf8');
    return decoded;
}

//解密
function encode(cleardata) {
    var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, token),
        encoded = encipher.update(cleardata, 'utf8', 'base64');

    encoded += encipher.final('base64');
    return encoded;
}

exports.encode = encode;
exports.decode = decode;
exports.norGo = function(parent, son) {
    var sonlen = son.length;
    var sonpos = 0;
    var result = [];
    for(var i = 0; i < parent.length; i++) {
        result.push(parent[i].charCodeAt() ^ son[sonpos].charCodeAt());
        sonpos++;
        if(sonpos >= sonlen) sonpos = 0;
    }

    return result;
};
exports.norBack = function(array, son) {
    var result = "";
    var sonlen = son.length;
    var sonpos = 0;
    for(var i = 0; i < array.length; i++) {
        var a = parseInt(array[i]);
        var b = son[sonpos].charCodeAt();
        sonpos++;
        if(sonpos >= sonlen) sonpos = 0;

        result += (String.fromCharCode(a ^ b));
    }

    return result;
};

