/**
 * XadillaX created at 2014-10-31 15:50:02
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved
 */
exports._dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

exports.randomNumber = function(min, max)
{
    var range = max - min;
    var rand = Math.random();
    return(min + Math.round(rand * range));
}

exports.setDict = function(text) {
    this._dict = text;
};

exports.rand = function(length) {
    var text = "";
    for(var i = 0; i < length; i++) {
        text += this._dict[this.randomNumber(0, this._dict.length - 1)];
    }
    return text;
};

