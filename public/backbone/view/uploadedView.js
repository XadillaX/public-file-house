/**
 * Created by XadillaX on 13-10-17.
 */
var UploadedView = Backbone.View.extend({
    template    : _.template($("#uploaded-template").html(), {}),
    events      : {
        "click #uploaded-div input" : "selectCode",
        "focus embed"               : "copyCode",

        "click #continue-upload"    : "continueUpload",
        "click #send-to-fetion"     : "sendToFetion",
        "click #to-download"        : "toDownload",

        "click .dropdown-menu #show-code"   : "showCode",
        "click .dropdown-menu #show-link"   : "showLink"
    },

    initialize  : function() {
        this.code = store.get("code");
        var self = this;

        //store.remove("code");
        $("#sending").click(self.sending);
        $("#cancel-sending").click(self.cancelSending);
        $("#phonenumber, #password").keydown(function(e) { if(e.keyCode === 13) self.sending(); });
    },

    render      : function() {
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

    selectCode  : function() {
        $("#uploaded-div input").select();
    },

    copyCode    : function() {
        this.selectCode();
    },

    continueUpload : function() {
        workspace.navigate("upload", { trigger: true, replace: true });
    },

    sendToFetion: function() {
        $("#send-to-fetion-modal").modal();
    },

    toDownload  : function() {
        workspace.navigate("get/" + this.code, { trigger: true, replace: true });
    },

    sending     : function() {
        this.sending = true;
        var self = this;

        $("#sending").button("loading");

        var postdata = {
            phonenumber     : $("#phonenumber").val(),
            password        : $("#password").val(),
            "code"          : $("#code-input").val()
        };

        $.post("../../send2fetion.pfh", postdata, function(e) {
            if(!self.sending) return;

            //alert(e);return;
            if(e.status) {
                self.sending = false;
                $("#sending").button("reset");
                $("#send-to-fetion-modal").modal("hide");

                store.set("fetion-info", { "phonenumber" : postdata.phonenumber, "password" : postdata.password });
                alert("发送成功！");
            } else {
                self.sending = false;
                $("#sending").button("reset");

                alert("发送失败：" + e.msg);
            }
        });
    },

    cancelSending: function() {
        this.sending = false;
        $("#sending").button("reset");
    },

    showCode    : function() {
        this.changeDisplay($("#show-code").find("a"));
    },

    showLink    : function() {
        this.changeDisplay($("#show-link").find("a"));
    },

    changeDisplay: function(ele) {
        var html = ele.html();
        $("#show-current").html(html + ' <span class="caret"></span>');

        if(html === "提取码") {
            $("#code-input").val(this.code);
        } else {
            $("#code-input").val("http://dang.kacaka.ca/get/" + this.code);
        }
    }
});
