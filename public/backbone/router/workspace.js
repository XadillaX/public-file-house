/**
 * Created by XadillaX on 13-10-17.
 */
var Workspace = Backbone.Router.extend({
    routes      : {
        ""         : "upload",
        "upload"   : "upload",
        "uploaded" : "uploaded",

        "get/:code/:err" : "get",
        "get/:code": "get",
        "get"      : "get",
        "get/"      : "get",

        "faq"      : "faq",
        "contact"   : "contact"
    },

    upload      : function() {
        var uploadView = new UploadView({ el: "#main-template-container" });
        uploadView.render();
    },

    uploaded    : function() {
        var uploadedView = new UploadedView({ el: "#main-template-container" });
        uploadedView.render();
    },

    get         : function(code, err) {
        var getView = new GetView({ el: "#main-template-container" });
        getView.setCode(code);
        if(err !== undefined) getView.setError(err);
        getView.render();
    },

    faq         : function() {
        var faqView = new FaqView({ el: "#main-template-container" });
        faqView.render();
    },

    contact     : function() {
        var contactView = new ContactView({ el: "#main-template-container" });
        contactView.render();
    }
});
