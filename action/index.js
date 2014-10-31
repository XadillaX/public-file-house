var errMap = {
    "Spider error"                                  : "发射娘从飞信那边拿到了一堆没用的东西导致发射失败，请稍后再发射。",

    "Unknown error while checking login status."    : "未知错误导致的发射娘登陆失败，请稍后再试。",
    "Wrong password"                                : "密码错误哦。",
    "You failed to logged in for several times so you have to log in correctly on PC or mobile."    : "主人肯定在调试发射娘之前已经登录失败好多次了，飞信那边要你给验证码才行，发射娘太笨没法识别验证码，请手动去飞信正确登录一次发射娘才能发射。",
    "Wrong username or password."                   : "用户名或者密码错误哦。",
    "Other error."                                  : "登录的时候遇到其它错误了。",

    "You have to log in first."                     : "发射娘感冒了，未能记录登录信息，请稍后再试。",

    "Empty message."                                : "主人怎么可以拿空信息给发射娘吃！",
    "Unknown error."                                : "发射的时候遇到未知错误了。",

    "Can't fetch the CSRF token for"                : "发射娘在获取CSRF验证信息的时候出错了涅。",
    "Can't find friend"                             : "未能找到该好友，但也有可能是发射娘感冒了开了个小差，如果主人确定输入信息无误，请稍后再试。",

    "Invalid sender mobile number."                 : "主人，你的手机号写错啦！",
    "Invalid receiver mobile number."               : "主人，发射娘要射的地方手机号写错啦！",

    "最多输入 500 字"                                : null
};

var FileModel = require("../model/fileModel");

function getErrorMsg(errinfo) {
    for(var key in errMap) {
        if(errinfo.indexOf(key) !== -1) {
            if(errMap[key] === null) return errinfo;
            return errMap[key];
        }
    }

    console.log(errinfo);
    return "主人，发射娘也不知道发生了什么错误，呜呜呜%>_<%";
}

var baseConfig = require("../commonConst");
var functions = require("../plugin/functions");
var validator = require("validator").check;

exports.index = function(req, resp) {
    var config = functions.cloneObject(baseConfig);

    resp.render("index/index", config);
};

exports.download = function(req, resp) {
    var token = req.query.token;
    var code = req.query.file;
    if(undefined === token || undefined === code) {
        resp.redirect(baseConfig.webroot);
        return;
    };

    if(!functions.verifyBlahblah(token)) {
        resp.redirect(baseConfig.webroot);
    } else {
        var fileModel = new FileModel();
        fileModel.get(code, function(status, error, obj) {
            if(error) resp.redirect(baseConfig.webroot);
            else {
                if(obj === null) {
                    resp.redirect(baseConfig.webroot + "/get/" + code + "/not-exist");
                } else {
                    resp.download(baseConfig.uploadDir + code, require("urlencode")(obj.filename));
                }
            }
        });
    }
};

exports.getToken = function(req, resp) {
    var encoder = require("../lib/smpEncoder");
    var token = baseConfig.token;
    var now = parseInt(Date.now() / 1000);
    var result = encoder.encode(now + token);
    result = encoder.norGo(result, now.toString());
    var resultString = "";
    for(var i = 0; i < result.length; i++) resultString += (result[i] + "^");

    resp.send(200, {
        "token" : resultString + now
    });
};

exports.send2fetion = function(req, resp) {
    var phone = req.body.phonenumber;
    var password = req.body.password;
    var code = req.body.code;

    //console.log(req.body);

    var result = {};

    try {
        validator(phone, "请输入正确的手机号喏。").is(/1(3[4-9]|5[012789]|8[78])\d{8}$/);
        validator(code, "请勿胡乱提交。").len(5, 5);
    } catch(e) {
        result.status = false;
        result.msg = e.message;
        resp.send(200, result);
        return;
    }

    var message = "咕喏咕喏，你在公众档所提交了一个文件，该文件的提取码为 【" + code + "】。（该信息由 公众档所 http://dang.kacaka.ca 代发）";
    var fetion = require("fetion-sender").send(phone, password, phone, message, function(status, msg) {
        if(!status) {
            var err = getErrorMsg(msg);
            result.status = false;
            result.msg = err;
            resp.send(200, result);
            return;
        }

        result.status = true;
        result.msg = "";
        resp.send(200, result);
        return;
    });
};
