var index = require("./action/index");
var upload = require("./action/upload");

exports.getRouter = {
    "/"             : index.index,
    "/index.pfh"    : index.index,

    "/upload"       : index.index,
    "/uploaded"     : index.index,

    "/get/:code/:err": index.index,
    "/get/:code"    : index.index,
    "/get"          : index.index,

    "/blahblah"     : index.getToken,
    "/download"     : index.download,

    "/faq"          : index.index,
    "/contact"      : index.index
};

exports.postRouter = {
    "/upload.pfh"   : upload.upload,
    "/send2fetion.pfh" : index.send2fetion
};

exports.setRouter = function(app) {
    for(var key in this.getRouter) {
        app.get(key, this.getRouter[key]);
    }

    for(var key in this.postRouter) {
        app.post(key, this.postRouter[key]);
    }
};
