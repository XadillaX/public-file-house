/**
 * Created with JetBrains WebStorm.
 * User: XadillaX
 * Date: 13-10-13
 * Time: 下午11:44
 * Fetion sender.
 */
var protocol = require("./lib/protocolHelper");

/**
 * create a functional fetion sender.
 * @returns {*}
 */
exports.createSender = function() {
    return protocol.create();
};

/**
 * send a message from your phone to your friend.
 * @param from
 * @param password
 * @param to
 * @param msg
 * @param callback
 */
exports.send = function(from, password, to, message, callback) {
    var sender = this.createSender();
    sender.login(from, password, function(status, msg) {
        if(!status) {
            callback(status, "Error while login: " + msg);
            return;
        }

        sender.send(to, message, function(status, msg) {
            if(!status) {
                callback(status, "Error while sending: " + msg);
                return;
            }

            callback(true, "");
        });
    });
};
