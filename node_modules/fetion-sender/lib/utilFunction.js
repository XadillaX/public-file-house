/**
 * Created with JetBrains WebStorm.
 * User: XadillaX
 * Date: 13-10-14
 * Time: 上午12:06
 * Util functions.
 */
var util = require("util");


/**
 * get the cookie string.
 * @param cookie
 * @returns {string}
 */
exports.getCookieString = function(cookie) {
    var p = ";";
    var pos = cookie.indexOf(p);
    var str = cookie.substring(0, pos + 2);
    return str;
};

/**
 * stringify the post data.
 * @param data
 * @returns {*}
 */
exports.stringifyData = function(data) {
    var qs = require("querystring");
    return qs.stringify(data);
};

/**
 * get the length of stringified post data.
 * @param data
 * @returns {int}
 */
exports.getDataLength = function(data) {
    var str = this.stringifyData(data);
    return str.length;
};

/**
 * clone an object.
 * @param obj
 * @returns {{}}
 */
exports.cloneObject = function(obj) {
    var newobj = {};

    if(util.isArray(obj)) {
        newobj = [];
        for(var i = 0; i < obj.length; i++) {
            newobj.push(obj[i]);
        }
    } else if(typeof obj === "object") {
        for(var key in obj) {
            newobj[key] = this.cloneObject(obj[key]);
        }
    } else {
        newobj = obj;
    }

    return newobj;
};
