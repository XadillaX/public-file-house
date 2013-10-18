/**
 * Created by XadillaX on 13-10-17.
 */
var workspace = null;
$(function() {
    workspace = new Workspace();
    Backbone.history.start({ pushState: true, hashChange: false });
});
