～公众档所～项目解析
====================

　　原文地址：http://xcoder.in/2014/03/27/node-public-file-house/

 　所谓“公众档所”，其实就是一个公共的临时网盘了。这个东西是一个老物了，在我刚接触 `Expressjs` 的时候写的。当时还随便搞了一下 `backbone.js`，但是没有深入，勿笑。关于深入构架 `Expressjs` 方面也没做，只是粗粗写了下最基础的路由，所以整个文件结构也不是很规范。但是应该能比较适合刚学 `Node.js` 以及刚接触 `Expressjs` 的人吧。

 　Repo地址在[我的Github](https://github.com/XadillaX/public-file-house)上。Demo地址在 [http://dang.kacaka.ca/](http://dang.kacaka.ca/)，由于个人电脑的不稳定性，所以不保证你们随时可以访问，保不定哪天就失效了，所以最好的办法还是自己 `clone` 下来啪啪啪。

 　它所需要的东西大致就是 `Expressjs` + `Redis` + `Backbone` 了。不过都是最最基础的代码。

## 部署

 　把部署写在最前面是为了能让你们自己电脑上有一个能跑的环境啦。公众档所在我自己这边的环境里面是由三台电脑组成的。

+ 网关“服务器”。这是我这边环境一致对外的机器。实际上是一片树莓派，装了 `nginx`，然后对内部做反向代理。
+ 本体“服务器”。跑了 **公众档所** 本体。
+ 数据库“服务器”。我们用的数据库实际上不是严格意义上的数据库，只是 `redis` 罢了，也没做与其它数据库的持久化，只是用了他内部自带的持久化。

 　**如果你们装一台机子上，那么就是：**

 　将 `repo` 给 clone 到自己的机子上。

```shell
$ git clone https://github.com/XadillaX/public-file-house
```

 　装好 **redis**，并根据需要修改 `redis.conf` 文件。
  
 　执行 `redis.sh` 文件开启数据库。如果你自己本身已经开启数据库或者用其它方法开启了，请忽略上面数据库相关步骤。
  
 　然后打开 `commonConst.js` 文件进行编辑，把相关的一些信息改成自己所需要的。

 　哦对了，还有一个“洁癖相关”的步骤。我以前年轻不懂事，把 `node_modules` 文件夹也给加到版本库中了，而且也在里面居然自己加了两个没有弄到 `nmp` 去的模块（**而且这两个模块本来就不应该放在这个文件夹下，但是不要在意这些细节，反正我现在肯定不会做这么傻的事了**）。
  
 　至于为什么不要这么做，就跟 `node_modules` 文件夹的意义相关了。而且里面有可能有一些在我本机编译好的模块，所以最好还是清理下自己重新装一遍为佳。

 　具体呢大致就是把 `node_modules` 文件夹里面的 `alphaRandomer.js` 文件和 `smpEncoder.js` 文件拷贝出来备份到任意文件夹，然后删除整个 `node_module` 文件夹。接下去跑到项目根目录执行：
  
```shell
$ npm install
```
  
 　把三方模块重新装好之后，把刚才拷出去的俩文件放回这个目录下。（**但是以后你们自己写别的项目的话千万别学我这个坏样子啊，以前年轻不懂事 QAQ**）
  
 　最后跑起来就行啦：

```shell
$ node pfh.js
```

## 解析

接下去就是要剖析这小破东西了。

### 基础文件

#### pfh.js

 　这个文件其实是 `Expressjs` 自动生成的，以前不是很懂他，所以也没怎么动，基本上是保持原封不动的。

#### router.js

 　这个是路由定义的文件。比较丑陋的一种方法，把需要定义的所有路由都写进两个 `json` 对象中，一个 `POST` 和一个 `GET`。

 　看过 `Expressjs` 文档的人或者教程的人都知道，最基础的路由注册写法其实就是：

```javascript
app.get(KEY, FUNCTION);
```

 　或者：

```javascript
app.post(KEY, FUNCTION);
```

 　所以我下面有一个函数：

```javascript
exports.setRouter = function(app) {
    for(var key in this.getRouter) {
        app.get(key, this.getRouter[key]);
    }

    for(var key in this.postRouter) {
        app.post(key, this.postRouter[key]);
    }
};
```

 　其大致意思就是把之前我们定义好的两个路由对象里的内容一一给注册到系统的路由当中去。这个是我最初最简陋的思想，不过后来我把它稍稍完善了一下写到[别的地方](https://github.com/XadillaX/exframess/blob/master/config/router.js#L17)去了。
  
### 模型

#### model/fileModel.js

 　这个就是模型层了，主要就是 `redis` 的一些操作了。在这里我用的是 [`redis`](https://github.com/mranney/node_redis) 这个模块，具体的用法大家可以看它 `repo` 的 `README.md` 文件。
  
 　大致就三个函数：
  
1. `fileModel.prototype.keyExists`: 判断某个提取码存在与否。
2. `fileModel.prototype.get`: 获取某个验证码的文件信息。
3. `fileModel.prototype.addFile`: 添加一个文件信息。

> 不过有个坏样子大家不要学，`Node.js` 大家都约定俗成的回调函数参数一般都是 `callback(err, data, blahblah...)` 的，第一个参数都是错误，如果没错误都是 `null` 或者是 `undefined` 的。但是以前也没这种意识，所以回调函数的参数也都是比较乱的。

### 控制器

#### action/index.js

 　这是一些基础控制器。
  
##### exports.index

 　纯粹的首页显示。

##### exports.download

 　文件下载控制器。由代码可知，首先获取 `token` 和 `code`。 `token` 是验证 **URL** 的有效性而 `code` 即提取码了。

 　期间我们验证了下 `token`：

```javascript
if(!functions.verifyBlahblah(token)) {
    resp.redirect(baseConfig.webroot);
}
```

 　而这个 `verifyBlahblah` 函数就在[这个文件](https://github.com/XadillaX/public-file-house/blob/master/plugin/functions.js#L21)里面。

```javascript
exports.verifyBlahblah = function(blahblah) {
    var array = blahblah.split("^");
    var time = array[array.length - 1];
    array.pop();

    var encoder = require("smpEncoder");

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
```

 　大体意思就是把其打散到数组里面，其中时间戳是最后一位。然后解密。最后验证解密后的 `token` 是否等于系统的 `token` 以及时间戳有没有过期。

 　大家通过截取 `Chrome` 或者 `Firefox` 的请求信息，不难发现有这么个地址：

```
Request URL:http://localhost/download?file=662ZE&token=65^97^74^68^106^125^88^115^65^96^66^105^127^114^87^123^123^114^84^124^114^125^120^121^99^116^100^118^116^98^124^120^109^98^120^100^80^119^120^87^119^105^116^8^1395904110
Request Method:GET
Status Code:200 OK
```

 　而这一坨 `65^97^74^68^106^125^88^115^65^96^66^105^127^114^87^123^123^114^84...^1395904110` 便是所谓的 `token` 了。而且本来就是个demo，这个 `token` 也就是随便做做样子罢了。

 　接下去通过验证之后，便可以从数据库中读取文件信息了。如果有文件，那么通过 `resp.download` 函数呈现给用户。

```javascript
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
```

##### exports.getToken

 　这个函数就是生产一个有效的 `token` 用的。在前端是通过 **ajax** 来获取的。

```javascript
var encoder = require("smpEncoder");
var token = baseConfig.token;
var now = parseInt(Date.now() / 1000);
var result = encoder.encode(now + token);
result = encoder.norGo(result, now.toString());
var resultString = "";
for(var i = 0; i < result.length; i++) resultString += (result[i] + "^");
```

 　大体呢就是根据目前的时间戳和系统 `token` 一起加密生产一个有效的 `token`。

##### exports.send2fetion

 　通过自己的飞信给自己发送提取码以备忘。

 　这里的话用了一个 `fetion-sender` 的模块。`Repo` 在[这里](https://github.com/XadillaX/fetion-sender)。

#### action/upload.js

 　这个文件里面其实就一个 `exports.upload` 函数，另一个是生成提取码用的。

##### function genAlphaKey(time, callback)

 　生成提取码。我们假设最多尝试10次，若尝试10次还没有生成唯一的验证码就输出错误让用户重试。所以就有了：

```javascript
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
```

 　不断地生成定长的提取码，然后通过模型的 `keyExists` 函数来确定这个提取码是否存在，如果存在了就递归调用重新生成，否则就直接回调。
  
##### exports.upload

 　上传文件的页面了。

```javascript
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
```

 　前面一堆话大致就是做下有效性判断而已。然后调用函数来生成有效的提取码：

```javascript
genAlphaKey(1, function(status, msg, filename) {
    ...
});
```

 　如果生成成功的话就往数据库中添加文件信息：

```javascript
var fileModel = new FileModel();
fileModel.addFile(filename,
    fileInfo.name,
    fileInfo.headers["content-type"],
    function(status, msg) {
        ...
    }
);
```

 　如果添加也成功了的话，那么把刚上传到临时文件夹的文件给移动到上传文件储存目录中，以便以后可以被下载：

```javascript
fs.rename(fileInfo.path, uploadDir + filename, function(err) {
    ...
});
```

 　如果移动也成功了的话，那么返回一个成功的json信息：

```javascript
result.status = true;
result.code = filename;
resp.send(200, result);
```

### 视图

 　这里视图就一个 `index.ejs` 。然后通过 `backbone.js` 来调用不同的页内模板和逻辑来实现的类似于 **SPA ~~(Solus Par Agula)~~ (Single Page Application)** 的效果。

#### views/index/index.ejs

 　像类似于下面的这种就是 `backbone.js` 的模板概念了：

```html
<script type="text/template" id="faq-template">
...
</script>
```

 　到时候就可以通过 `backbone.js` 中的函数来填充到页面实体当中去。

#### public/js/index.js

 　在拥有了所有的前端js依赖之后，这个文件就是这个 `SPA` 的入口了。

 　逻辑很简单：

```javascript
var workspace = null;
$(function() {
    workspace = new Workspace();
    Backbone.history.start({ pushState: true, hashChange: false });
});
```

 　新建一个 `Workscpace`，然后对 `backbone` 进行一点配置。

> To indicate that you'd like to use HTML5 pushState support in your application, use Backbone.history.start({pushState: true}). If you'd like to use pushState, but have browsers that don't support it natively use full page refreshes instead, you can add {hashChange: false} to the options.
>
> <p style="text-align: right">——摘自 [backbonejs.org](http://backbonejs.org/#History-start)</p>

 　然后这个 `Workspace` 即这个 `SPA` 的本体了。

#### public/backbone/router/workspace.js

 　这里定义了几个路由，即什么路由要用哪个类去处理。这样才能在 `URL` 当中各种跳转。其实无非就是把待渲染元素渲染成页内模板，然后把页面的各种事件响应逻辑改掉即可。对于 `Backbone` 我其实只用过两次，现在也忘不大多了，怕误人子弟，所以一些具体的函数啊用法啊还是去参考下官网比较好来着。

#### public/backbone/view/*.js

 　就是各路由所对应的视图了。

##### uploadView.js

 　比如说 `uploadView.js` 文件当中，执行渲染函数：

```javascript
    ...,
    
    render : function() {
        $(this.el).html(Mustache.to_html(
            this.template
        ));

        $("#uploadfile").fileupload({
            url : "../../upload.pfh",
            dataType : "json",
            done : this.uploaded,
            progressall : this.processUpload,
            start : this.startUpload
        });

        $(".template").show("normal");

        return this;
    },
    
    ...
```

 　就是用页内模板来渲染：

```javascript
$(this.el).html(Mustache.to_html(
    this.template
));
```

 　而这个 `this.el` 是在 `Workspace` 中定义的：

```javascript
    ...,
    
    upload : function() {
        var uploadView = new UploadView({ el: "#main-template-container" });
        uploadView.render();
    },
    
    ...
```

 　如你所见，就是这个 `#main-template-container` 了。
  
 　这个渲染完毕之后，然后把 `#uploadfile` 给变成上传按钮（用了 **jquery.fileupload.js**）。再然后把渲染好的页面给 `show` 出来。

 　然后这个　`uploadView.js` 中还定义了两个[响应事件](http://backbonejs.org/#View-delegateEvents)：

```javascript
    ...,
    
    events : {
        "click .upbutton" : "upload",
        "click #uploadpage-to-download" : "goDownload"
    },
    
    ...
```

 　即在按下 `.upbutton` 的时候会执行 `upload` 函数，在按下“去下载”的按钮时会执行 `goDownload` 函数。

```javascript
    ...,
    
    upload : function() {
        $("#uploadfile").click();
    },
    
    ...
```

 　执行上传函数的时候，实际上是自动触动了 `#uploadfile` 按钮的 `click` 事件。这个时候就会按照之前定义好的 `$("#uploadfile").fileupload(...)` 去处理了。

##### getView.js

 　这个是获取文件的视图。

 　渲染时会获取 `code` 。这个 `code` 同样是 `Workspace` 传入的：

```javascript
    ...,
    
    get : function(code, err) {
        var getView = new GetView({ el: "#main-template-container" });
        getView.setCode(code);
        if(err !== undefined) getView.setError(err);
        getView.render();
    },
    
    ...
```

 　上面关于 `get` 的路由是 `get/:code` 之类的，所以这个 `code` 会作为一个路由参数传给 `get` 函数。
  
 　有了这个 `code` 之后就可以把页面渲染出来了。这就是为什么我们地址输入 `http://localhost/get/XXXXX` 的时候输入框里面就有提取码了。把这个渲染出来之后，我们对“二维码”的两张图片做下响应：鼠标移动上去会显示出来。再然后我们要获取二维码了（`this.genQRCode()`）：

```javascript
    ...,
    
    genQRCode : function() {
        var code = this.code;

        var dpage = "http://dang.kacaka.ca/get/" + code;
        dpage = UrlEncode(dpage);
        var img = '<img style="width: 150; height: 150;" src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&choe=UTF-8&chld=L|4&chl=' + dpage + '" />';

        $("#download-page-qr").attr("data-content", img);

        var opage = "http://dang.kacaka.ca/download?";
        this.getToken(function(token) {
            if(undefined === token) {
                $("#download-origin-qr").attr("data-content", '<div style="text-align: center;">二维码生成失败。</div>');
                return;
            }

            opage += "token=" + token;
            opage += "&file=" + code;
            opage = UrlEncode(opage);
            var img = '<div style="text-align: center;"><img style="width: 150; height: 150;" src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&choe=UTF-8&chld=L|4&chl=' + opage + '" /><br /><small>该二维码有效期五分钟。</small></div>';
            $("#download-origin-qr").attr("data-content", img);
        });

        if("" === this.code) {
            $("h2 small").css("display", "none");
        } else $("h2 small").css("display", "inline-block");
    }
```

 　无非就是调用谷歌的 API 然后生成图片地址放上去罢了。一个地址就是当前页面地址，另一个就是加上 `token` 之后的直接下载地址。

 　如你所见，获取token是通过ajax往服务器请求的：

```javascript
    ...,
    
    getToken : function(callback) {
        $.get("../../blahblah", {}, function(e) {
            callback(e.token);
        });
    },
    
    ...
```

 　然后事件的话：

```javascript
    ...,
    
    events : {
        "click #downloadpage-to-upload" : "toUpload",
        "click #download-btn" : "toDownload",
        "keydown #download-code": "toDownloadKeydown",

        "keyup #download-code" : "navCode"
    },
    
    ...
```

 　按了“去上传”按钮会跑去上传。如果按下“下载”按钮就下载文件了。然后输入框里面弹起键盘的话，会导致输入框文字变化，这个时候就要更新二维码以及URL了。

```javascript
    ...,
    
    navCode : function() {
        var code = $("#download-code").val();
        workspace.navigate("get/" + code);
        this.code = code;

        if(code === "") {
            $("h2 small").css("display", "none");
        } else {
            this.genQRCode();
        }
    },
    
    ...
```

 　每当输入框变化之后，地址栏就要变成新的 `get/:code` (`workspace.navigate("get/" + code)`) 了，然后重新获取一遍二维码。

 　下载按钮的逻辑代码如下：

```javascript
    ...,
    
    toDownload : function() {
        var code = $("#download-code").val();
        workspace.navigate("get/" + code);
        this.getToken(function(token) {
            if(token === undefined) {
                alert("获取验证信息失败，请稍后重试。");
            } else {
                var url = "../../download?file=" + code + "&token=" + token;
                window.location.href = url;
            }
        });
    },
    
    ...
```

 　反正就是根据 `code` 来生成地址，然后从获取token的地址中把token拿出来拼接成下载地址之后再访问（`window.location.href = url`）就好了。

##### uploadedView.js

 　这个视图是上传成功视图。功能很简单，就是现实下提取码，然后飞信能发送一下，以及能复制验证码罢了。

```javascript
    ...,
    
    render : function() {
        if(undefined === this.code) {
            workspace.navigate("upload", { trigger: true, replace: true });
            return;
        }

        $(this.el).html(Mustache.to_html(
            this.template,
            { code: this.code }
        ));

        var phoneinfo = store.get("fetion-info");
        if(undefined !== phoneinfo) {
            $("#phonenumber").val(phoneinfo.phonenumber);
            $("#password").val(phoneinfo.password);
        }

        $(".template").show("normal", function() {
            $('#copy-code-btn-parent').zclip({
                path:'../../ZeroClipboard.swf',
                copy:function() {
                    return $("#code-input").val();
                },
                afterCopy: function() {
                    alert("提取码已经成功复制到剪切板了。");
                }
            });
        });

        return this;
    },
    
    ...
```

 　通过判断有没有 `code` 来判断是否上传成功。这个 `code` 的来源是 `uploadView.js` 中的 `uploaded (done: this.uploaded)` 函数：

```javascript
    ...,
    
    uploaded : function(e, data) {
        var result = data.result;
        if(!result.status) {
            $("#progress").css("display", "none");
            $("#progress .progress-bar").html("已上传 0%");
            $("#progress .progress-bar").attr("aria-valuenow", "0");
            $("#progress .progress-bar").css("width", "0%");

            $("#upload-div #feed-doc").removeClass("alert-info");
            $("#upload-div #feed-doc").addClass("alert-danger");
            $("#upload-div #feed-doc").html(result.msg);
            $("#upload-div #feed-doc").css("display", "block");
            return;
            return;
        } else {
            store.set("code", result.code);
            workspace.navigate("uploaded", { trigger: true, replace: true });

            return;
        }
    },
    
    ...
```

 　`e` 和 `data` 这两个参数哪来？首先这个 `uploaded` 函数是在之前渲染的时候定义成 `jquery.fileupload` 的上传结束回调函数的，所以这两个参数自然是 `jquery.fileupload` 传过来的。详见[这里](https://github.com/blueimp/jQuery-File-Upload/wiki/Options#done)。
  
 　总之就是上次成功之后，这个upload函数会获取一个 `code`，然后它就会拿这个 `code` 存到 `store` 中。这个 `store.js` 是一个 `localStorage` 的封装。它的代码和文档在[这里](https://github.com/cloudhead/store.js)。

 　存好之后让 `Workspace` 给导航到 `uploaded` 视图中。

 　而这个 `uploaded` 视图的初始化函数里面有这样的代码：

```javascript
    ...,
    
    initialize : function() {
        this.code = store.get("code");
        var self = this;

        $("#sending").click(self.sending);
        $("#cancel-sending").click(self.cancelSending);
        $("#phonenumber, #password").keydown(function(e) { if(e.keyCode === 13) self.sending(); });
    },
    
    ...
```

 　就是初始化的时候，从 `localStorage` 中把 `code` 给取出来。

## 结束

 　代码量少，用到的东西也是基础；不过以前的代码由于不了解 `Node.js` 啊 `Expressjs` 啊等等的，所以导致代码杂乱无章、脏乱无比，所以一定程度上阻碍了可读性的存在。

 　希望本文能给各位看官稍稍理清思路。我也不必写得面面俱到，只是在某个程度上点题一下而已。更多的大家自己看代码即可了。不过希望还不要把大家给误导了就好，毕竟这代码我自己现在看觉得好丢脸啊 QAQ。大家就去其糟粕取其精华吧。（喂喂喂，我去年买了个表，哪有什么精华啊！
