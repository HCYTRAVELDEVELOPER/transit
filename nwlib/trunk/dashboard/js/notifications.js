var timeoutIDNotifica;
var timeoutIDNotificaDos;
var timeoutIDNotificaTres;
dentro = "no";
function delayedAlertOne(func, time) {
    timeoutIDNotifica = window.setTimeout(func, time);
}
function delayedAlertTwo(func, time) {
    timeoutIDNotificaDos = window.setTimeout(func, time);
}
function delayedAlertTrhee(func, time) {
    timeoutIDNotificaTres = window.setTimeout(func, time);
}
function clearAlertNotifica() {
    window.clearTimeout(timeoutIDNotifica);
}
function clearAlertNotificaDos() {
    window.clearTimeout(timeoutIDNotificaDos);
}
function clearAlertNotificaTres() {
    window.clearTimeout(timeoutIDNotificaTres);
}
function alertNotificaNw(p) {
    var pr = p;
    if (p == undefined) {
        pr = "0";
//        dentro = "no";
    }
    var url_data = "/nwlib/dashboard/notifications/notifications.php";
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var str = xmlhttp.responseText;
            var res = str.split("||");
            var total = res[0];
            if (total > 0) {
                var timeUno = 6000;
                var notific = res[1];
                var str_notOne = notific;
                var res_notOne = str_notOne.split("&/");
                var notificaciones = res_notOne[0];
                var notificaciones_titles = res_notOne[1];
                var notificaciones_text = res_notOne[2];
                var res_notTitles = notificaciones_titles.split("//");
                var res_notText = notificaciones_text.split("//");
                var mess = "";
                for (var i = 0; i < notificaciones; i++) {
                    mess += "<div class='divNotificaUnitary'><h5>" + res_notTitles[i] + "</h5><p>" + res_notText[i] + "</p></div>";
                }
                var cha = res[2];
                var str_notTwo = cha;
                var res_notTwo = str_notTwo.split("&/");
                var chats = res_notTwo[0];
                var chats_titles = res_notTwo[1];
                var chats_text = res_notTwo[2];
                var res_chatTitles = chats_titles.split("//");
                var res_chatText = chats_text.split("//");
                var messChat = "";
                for (var i = 0; i < chats; i++) {
                    messChat += "<div class='divNotificaUnitary'><h5>" + res_chatTitles[i] + "</h5><p>" + res_chatText[i] + "</p></div>";
                }
                var not = document.querySelector(".nw___notificationsImage");
                var cha = document.querySelector(".nw_chatImage");
                document.querySelector(".notificationsRead").innerHTML = "<div class='si_notification'>" + notificaciones + "</div>";
                document.getElementById("alertChatRight").innerHTML = "<div class='si_notification'>" + chats + "</div>";
                document.getElementById("notificationsDash").style.display = "block";
                if (notificaciones > 0) {
                    if (pr == "0") {
                        if (dentro == "no") {
                            delayedAlertTwo(removeDivNotificaNots, timeUno);
                        }
                    }
                    not.classList.add("si_notifications_icon");
                    document.getElementById("notificationsNotific").innerHTML = "<div id='divNotificaDivNots' class='divNotificaDiv divNotificaDivNots'><h3>Tienes " + notificaciones + " Notificaciones.</h3>" + mess + "</div>";
                    if (pr == "0") {
                        if (dentro == "no") {
                            var soundNotific = qxnw.local.getData("notifications_sound");
                            if (soundNotific != false) {
                                document.getElementById("notificationsAudioNot").innerHTML = "<audio class='audioNotifications' id='player' src='/nwlib/audio/SD_ALERT_4.mp3' autoplay></audio>";
                            }
                        }
                    }
                }
                if (chats > 0) {
                    if (pr == "0") {
                        if (dentro == "no") {
                            delayedAlertTrhee(removeDivNotificaChats, timeUno);
                        }
                    }
                    cha.classList.add("si_notifications_icon");
                    document.getElementById("notificationsChats").innerHTML = "<div id='divNotificaDivChats' class='divNotificaDiv divNotificaDivChats'><h3>Tienes  " + chats + " mensajes</h3>" + messChat + "</div>";
                    if (pr == "0") {
                        if (dentro == "no") {
                            var soundChat = qxnw.local.getData("sound_chat");
                            if (soundChat != false) {
                                document.getElementById("notificationsAudioChat").innerHTML = "<audio class='audioNotifications' id='player' src='/nwlib/audio/008872064_prev.mp3' autoplay></audio>";
                            }
                        }
                    }
                }
            } else {
                var not = document.querySelector(".nw___notificationsImage");
                var cha = document.querySelector(".nw_chatImage");
                not.classList.remove("si_notifications_icon");
                cha.classList.remove("si_notifications_icon");
                not.classList.add("no_notifications_icon");
                cha.classList.add("no_notifications_icon");
                document.querySelector(".notificationsRead").innerHTML = "<div class='no_notification'>0</div>";
//                document.getElementById("nw___notificationsImage").className =
//                        document.getElementById("nw___notificationsImage").className.replace
//                        (/(?:^|\s)no_notifications_icon(?!\S)/g, '');
//                document.getElementById("nw_chatImage").className =
//                        document.getElementById("nw_chatImage").className.replace
//                        (/(?:^|\s)no_notifications_icon(?!\S)/g, '');
//                document.getElementById("nw___notificationsImage").className += " no_notifications_icon";
//                document.getElementById("nw_chatImage").className += " no_notifications_icon";
                document.getElementById("alertChatRight").innerHTML = "<div class='no_notification'>0</div>";
            }
        }
    };
    xmlhttp.open("GET", url_data + "?read=" + pr, true);
    xmlhttp.send();
    if (dentro == "no") {
        delayedAlertOne(alertNotificaNw, 15000);
    }
}
function readNotifications() {
    var url_data = "/nwlib/dashboard/notifications/notificationsReads.php";
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var str = xmlhttp.responseText;
            document.getElementById("alertNotifiRightOn").innerHTML = 0;
        }
    };
    xmlhttp.open("GET", url_data, true);
    xmlhttp.send();
}
function removeDivNotificaNots() {
    document.getElementById("notificationsDash").style.display = "none";
    var div = document.querySelector('div.divNotificaDivNots');
//    var div = document.querySelector('divNotificaDiv');
//    var div = document.getElementById('divNotificaDivNots');
    div.parentNode.removeChild(div);
//    div.remove();
}
function removeDivNotificaChats() {
    document.getElementById("notificationsDash").style.display = "none";
    var div = document.querySelector('.divNotificaDivChats');
    div.parentNode.removeChild(div);
//    div.remove();
}
//    document.getElementById("notificationsDash").onmousemove= function() {
//    document.getElementById("notificationsDash").onmouseout= function() {
//        dentro = "si";
//    };
//document.getElementById("notificationsDash").addEventListener("mouseout", fadeOutNotific);
function outsiteNot() {
    clearAlertNotifica();
    clearAlertNotificaDos();
    clearAlertNotificaTres();
    dentro = "si";
//    if (dentro == "no") {
    alertNotificaNw();
//    }
//    clearAlertNotifica("timeoutIDNotificaTwo");
//    clearAlertNotifica("timeoutIDNotificaThree");
}
function fadeOutNotific() {
    dentro = "no";
//    if (dentro == "si") {
    delayedAlertOne(alertNotificaNw, 15000);
//    }
    removeDivNotificaNots();
    removeDivNotificaChats();
}
function crearNotificaContain() {
    var newElement = '<div onmouseleave="fadeOutNotific();"  onmousemove="outsiteNot();"  id="notificationsDash" class="notificationsDash">\n\
                                       <div  id="notificationsNotific" class="notificationsNotific"></div>\n\
                                       <div id="notificationsChats" class="notificationsChats"></div>\n\
                                       <div id="notificationsAudioNot" class="notificationsAudio"></div>\n\
                                       <div id="notificationsAudioChat" class="notificationsAudio"></div>\n\
                                    </div>';
    var bodyElement = document.body;
    bodyElement.innerHTML = newElement + bodyElement.innerHTML;
    alertNotificaNw();
    document.getElementById("notificationsChats").onclick = function() {
        parent.qxnw.main.openChat();
        parent.qxnw.main.openChatMaxPopUp();
    };
    document.getElementById("notificationsNotific").onclick = function() {
        readNotifications();
        fadeOutNotific();
    };
}
var hash = location.hash;
if (hash != "#chat") {
    document.addEventListener("DOMContentLoaded", crearNotificaContain);
}
function startAllStart() {
    var soundStartHome = qxnw.local.getData("soundStart");
    if (soundStartHome != false) {
        document.getElementById("soundStart").innerHTML = "<audio class='audioStar' id='audioStar' src='/nwlib/audio/SD_ALERT_43.mp3' autoplay></audio>";
    }
}