/**
 * Created by XadillaX on 13-10-17.
 */
var redis = require("redis");
var config = require("../commonConst");
var client = redis.createClient(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
});
client.on("error", function(err) {
    console.error(err);
});

/**
 * The initialize function
 * @param host
 * @param port
 */
function FileModel() {
}

module.exports = FileModel;

/**
 * If a key is existing.
 * @param key
 * @param callback(status, result)
 */
FileModel.prototype.keyExists = function(key, callback) {
    client.send_command("EXISTS", [ key ], function(err, result) {
        if(err === null) callback(true, result);
        else callback(false, err);
    });
};

FileModel.prototype.get = function(key, callback) {
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
    });
};

/**
 * Add a file.
 * @param filename
 * @param origFilename
 * @param callback
 */
FileModel.prototype.addFile = function(filename, origFilename, contenttype, callback) {
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
