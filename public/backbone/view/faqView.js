/**
 * Created by XadillaX on 13-10-18.
 */
var FaqView = Backbone.View.extend({
    template    : _.template($("#faq-template").html(), {}),
    events      : {
        "click #go-upload"  : "goUpload",
        "click #go-download": "goDownload"
    },
    render      : function() {
        $(this.el).html(Mustache.to_html(
            this.template
        ));

        $(".template").show("normal");

        return this;
    },
    goUpload    : function() {
        workspace.navigate("upload", { trigger: true, replace: true });
    },
    goDownload  : function() {
        workspace.navigate("get", { trigger: true, replace: true });
    }
});