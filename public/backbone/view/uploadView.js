/**
 * Created by XadillaX on 13-10-17.
 */
var UploadView = Backbone.View.extend({
    template    : _.template($("#upload-template").html(), {}),
    events      : {
        "click .upbutton"   : "upload",
        "click #uploadpage-to-download" : "goDownload"
    },

    initialize  : function() {
    },

    render      : function() {
        $(this.el).html(Mustache.to_html(
            this.template
        ));

        $("#uploadfile").fileupload({
            url         : "../../upload.pfh",
            dataType    : "json",
            done        : this.uploaded,
            progressall : this.processUpload,
            start       : this.startUpload
        });

        $(".template").show("normal");

        return this;
    },

    upload      : function() {
        $("#uploadfile").click();
    },

    startUpload : function(e) {
        $("#feed-doc").css("display", "none");
        $("#progress").css("display", "block");
    },

    uploaded    : function(e, data) {
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

    processUpload : function(e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
        $("#upload-percent").html("已上传 " + progress + "%");
    },

    goDownload      : function() {
        workspace.navigate("get", { trigger: true, replace: true });
    }
});
