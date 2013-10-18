/**
 * Created by XadillaX on 13-10-18.
 */
function str2asc(strstr){
    return ("0"+strstr.charCodeAt(0).toString(16)).slice(-2);
}
function asc2str(ascasc){
    return String.fromCharCode(ascasc);
}
function UrlEncode(str){
    var ret="";
    var strSpecial="!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
    var tt= "";

    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        var c=str2asc(chr);
        tt += chr+":"+c+"n";
        if(parseInt("0x"+c) > 0x7f){
            ret+="%"+c.slice(0,2)+"%"+c.slice(-2);
        }else{
            if(chr==" ")
                ret+="+";
            else if(strSpecial.indexOf(chr)!=-1)
                ret+="%"+c.toString(16);
            else
                ret+=chr;
        }
    }
    return ret;
}
function UrlDecode(str){
    var ret="";
    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        if(chr == "+"){
            ret+=" ";
        }else if(chr=="%"){
            var asc = str.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                ret+=asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
                i+=5;
            }else{
                ret+=asc2str(parseInt("0x"+asc));
                i+=2;
            }
        }else{
            ret+= chr;
        }
    }
    return ret;
}

var GetView = Backbone.View.extend({
    template    : _.template($("#get-template").html(), {}),
    events      : {
        "click #downloadpage-to-upload" : "toUpload",
        "click #download-btn"   : "toDownload",
        "keydown #download-code": "toDownloadKeydown",
        //"change #download-code" : "navCode",
        "keyup #download-code"  : "navCode"
    },

    initialize  : function() {
        this.code = "";
    },

    render      : function() {
        $(this.el).html(Mustache.to_html(
            this.template,
            { code : this.code }
        ));

        $(".template").show("normal");

        $("#download-page-qr, #download-origin-qr").hover(
            function() {
                $(this).popover("show");
            },
            function() {
                $(this).popover("hide");
            }
        );
        this.genQRCode();

        return this;
    },

    getToken    : function(callback) {
        $.get("../../blahblah", {}, function(e) {
            callback(e.token);
        });
    },

    setCode     : function(code) {
        this.code = code;
        if(code === undefined) this.code = "";
    },

    toUpload    : function() {
        workspace.navigate("upload", { "trigger" : true, "replace" : true });
    },

    toDownload  : function() {
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

    navCode     : function() {
        var code = $("#download-code").val();
        workspace.navigate("get/" + code);
        this.code = code;

        if(code === "") {
            $("h2 small").css("display", "none");
        } else {
            this.genQRCode();
        }
    },

    toDownloadKeydown : function(e) {
        if(e.keyCode === 13) this.toDownload();
    },

    setError    : function(err) {
        if(err === "not-exist") {
            alert("【" + this.code + "】——不存在的提取码，或者提取码已过期。");
        }
    },

    genQRCode   : function() {
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
});
