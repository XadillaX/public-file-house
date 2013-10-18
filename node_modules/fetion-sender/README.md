Node Fetion Sender
==================

This node package allows you to send `fetion message` via node.js.

Get it
------------------

You just need to install this module via `npm`:

    $ npm install fetion-sender

Or download it from [here](https://github.com/XadillaX/fetion-sender/archive/master.zip) and put it to your `node_modules` directory.

Another way is to clone this repo via git to your `node_modules` directory.

Usage
------------------

### Simple

The easiest way to send a message is just shown below:

    var from = "152********";
    var password = "********";
    var to = "152********";
    var msg = "Hello world!";
    var fetion = require("fetion-sender");
    fetion.send(from, password, to, msg, function(status, msg) {
        if(!status) {
            console.log(msg);
        } else {
            console.log("Sent successfully!");
        }
    });

Make sure that the receiver is your fetion friend.

If you sent successfully, the `status` in callback function will be true and `msg` will be an empty string. Otherwise, `status` is false and `msg` contains the error message.

### Extra

If you want control the process, you will use the **protocol helper**.

Protocol Helper is a class of fetion sender. You can get a new protocol helper object by calling:

    var helper = require("fetion-sender").createSender();

There're several functions in that object.

> **Tip:** The `callback` shown below are all in format of
>
>     function callback(status, msg);
>
> + `status` stands for the status of the function you're called. `true` means succeed and `false` means failed.
> + `msg` stands for the result message. If `status` is `true`, this `msg` will be empty or some useful result such as **user ID** and so on. And if `status` is `false`, this parameter will be the error message.

#### Login

Login function will be called like

    helper.login(username, password, callback);

Before you do anything with this helper, make sure you're logged in.

#### Send

This is the send function

    helper.send(phonenumber, message, callback);

#### Send to Friend *

This function is called by `send` function. But you can call it also.

    helper.sendToFriend(userid, message, callback);

> **Caution:** The first parameter is not `phonenumber` but `userid` which is returned by `getUserID` function.

#### Send to Self *

If you're sending message to yourself (sender number is the receive number), you can't use `sendToFriend` function. This function is also called by `send` function.

    helper.sendToSelf(message, callback);

#### Get CSRF Token *

A CSRF token is required while you're sending message to your friend. I think this token is something like a session id. Get a CSRF token with a friend means you've set up a session with him/her.

This function is called by `sendToFriend`.

    helper.getCsrfToken(userid, callback);

#### Get User ID *

If you want use `sendToFriend` function, you must have the user ID of your friend. This function is to get the user ID with phone number.

    helper.getUserID(phonenumber, callback);
