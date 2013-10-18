/**
 * Created by XadillaX on 13-10-17.
 */
var redis = require("redis");
var config = require("../commonConst");

/**
 * The initialize function
 * @param host
 * @param port
 */
function fileModel(host, port) {
    this.host = host;
    this.port = port;

    if(undefined === port || null === port) this.port = config.redis.port;
    if(undefined === host || null === host) this.host = config.redis.host;
};

module.exports = fileModel;

/**
 * If a key is existing.
 * @param key
 * @param callback(status, result)
 */
fileModel.prototype.keyExists = function(key, callback) {
    var client = redis.createClient(this.port, this.host);
    client.on("error", function(error) {
        callback(false, error);

        client.end();
    });

    client.send_command("EXISTS", [ key ], function(err, result) {
        if(err === null) callback(true, result);
        else callback(false, err);

        client.end();
    });
};

fileModel.prototype.get = function(key, callback) {
    var client = redis.createClient(this.port, this.host);
    client.on("error", function(error) {
        callback(false, error);
        client.end();
    });

    client.hgetall(key, function(error, obj) {
        if(error) callback(false, error, null);
        else {
            if(obj === null || obj === undefined) {
                callback(true, null, null);
            } else {
                obj.filename = require("../plugin/functions").hex2string(obj.filename);
                callback(true, null, obj);
            }
        }

        client.end();
    });
};

/**
 * Add a file.
 * @param filename
 * @param origFilename
 * @param callback
 */
fileModel.prototype.addFile = function(filename, origFilename, contenttype, callback) {
    var client = redis.createClient(this.port, this.host);
    client.on("error", function(error) {
        callback(false, error);
        client.end();
    });

    var obj = {
        "time"      : parseInt(Date.now() / 1000),
        "filename"  : origFilename,
        "content-type" : contenttype
    };

    client.hmset(filename, obj, function(error) {
        if(error !== null) {
            callback(false, error);
            return;
        } else {
            callback(true, "");
        }
    });
};
