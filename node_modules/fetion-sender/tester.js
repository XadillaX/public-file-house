var from = "15222222222";
var password = "15222222222";
var to = "15222222222";
var msg = "Hello world!";

var fetion = require("fetion-sender");
fetion.send(from, password, to, msg, function(status, msg) {
    if(!status) {
        console.log(msg);
    } else {
        console.log("Sent successfully!");
    }
});
