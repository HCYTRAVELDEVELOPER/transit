$(document).ready(function () {
    if (typeof localStorage["totaldatachatlocal"] == "undefined") {
        localStorage["totaldatachatlocal"] = 0;
    }
    if (typeof localStorage["datachatlocal"] == "undefined") {
        localStorage["datachatlocal"] = {};
    }
//    console.log(localStorage["totaldatachatlocal"]);

    for (var i = 0; i < parseInt(localStorage["totaldatachatlocal"]); i++) {
//        var num = i + 1;
        var num = i;
        var user = localStorage["datachatlocal_user_" + num];
        var username = localStorage["datachatlocal_username_" + num];
        var divload = localStorage["datachatlocal_divload_" + num];
        
        windowNwChatPes(user, username, divload);
    }

});