/**
 * Created by XadillaX on 13-10-17.
 */
var alphaRandomer = require("../lib/alphaRandomer");
var config = require("../commonConst");
var FileModel = require("../model/fileModel");
var fs = require("fs");
var maxTryTime = 10;

/**
 * 生成文件提取码
 * @param time
 * @param callback
 */
function genAlphaKey(time, callback) {
    var keyLength = config.uploadLen;
    var filename = alphaRandomer.rand(keyLength);
    var fileModel = new FileModel();

    fileModel.keyExists(filename, function(status, result) {
        if(!status) {
            if(time < maxTryTime) {
                genAlphaKey(time + 1, callback);
            }
            else {
                callback(false, result, "");
            }

            return;
        } else {
            if(result) genAlphaKey(time, callback);
            else {
                callback(true, "", filename);
            }
        }
    });
}

/**
 * 上传文件
 * @param req
 * @param resp
 */
exports.upload = function(req, resp) {
    var result = {};

    if(req.files.files.length !== 1) {
        result.status = false;
        result.msg = "请用正确的姿势喂我文件。";
        resp.send(200, result);
        return;
    }

    var fileInfo = req.files.files[0];
    if(fileInfo.size > config.maxUploadSize) {
        result.status = false;
        result.msg = "文件太大啦，公众档所一次只能吃10M的文件哦。";
        resp.send(200, result);
        return;
    }

    var uploadDir = config.uploadDir;

    //console.log(fileInfo); //resp.send(200, ""); return;

    genAlphaKey(1, function(status, msg, filename) {
        if(!status) {
            result.status = false;
            result.msg = msg.message;
            resp.send(200, result);
            return;
        }

        var fileModel = new FileModel();
        fileModel.addFile(filename, fileInfo.name, fileInfo.headers["content-type"], function(status, msg) {
            if(!status) {
                result.status = false;
                result.msg = msg.message;
                resp.send(200, result);
                return;
            }

            // 移动文件
            fs.rename(fileInfo.path, uploadDir + filename, function(err) {
                if(err) {
                    result.status = false;
                    result.msg = err.message;
                    resp.send(200, result);
                    return;
                }

                result.status = true;
                result.code = filename;
                resp.send(200, result);
            });
        });

        return;
    });
};
