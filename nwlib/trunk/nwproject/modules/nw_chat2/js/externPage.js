$(document).ready(function () {
    var get = getGET();
//    if (get === false) {
//        return;
//    }
    loadJs("/nwlib6/nwproject/modules/nw_chat2/js/main2.js", function () {
        nwc = new newNwChat();
        loadJs("/nwlib6/nwproject/modules/nw_chat2/js/forms/f_chat.js", function () {
            nwc.setConfig(true);
//        if (typeof get["extern"] != "undefined") {
//            nwc.setConfig(true);
//        } else {
//            nwc.setConfig("intern");
//        }
            //mensaje a usuario
//        nwc.createNwChatConversation("yo@yo.com", ".temporal");
//mensaje llamada grupal o externa
//        nwc.createNwChatConversation(150, ".temporal");
//        nwc.createNwChatConversation(22, ".temporal");
        }, false, true);
    }, false, true);
});
