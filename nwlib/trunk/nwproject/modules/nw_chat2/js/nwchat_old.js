init();

function getGet() {
    var query = document.getElementById("nwchat2").src.match(/\?.*$/);
    query[0] = query[0].replace("?", "");
    var GET = query[0].split("&");
    var get = {};
    for (var i = 0, l = GET.length; i < l; i++) {
        var tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    return get;
}

function init() {

    var get = getGet();

//variables
    var button = "<img src='http://www.homecenterchat.gruponw.com/nwlib6/nwproject/modules/nw_chat2/img/online_demo.png' />";

//nuevo chat
    var url = "http://www." + get["host"] + "/nwlib6/nwproject/modules/nw_chat2/index.php?id=" + get["id"] + "&host=" + get["host"] + "&key=" + get["key"] + "";

//crea el botón para mostrar el iframe del chat conversación

    var div = document.createElement("div");
    div.id = "buttonOpenNwChat";
    div.innerHTML = button;
    var divExist = document.getElementById("buttonOpenNwChat");
    if (divExist == null) {
        document.body.appendChild(div);
    }

    document.querySelector("#buttonOpenNwChat").style.position = "fixed";
    document.querySelector("#buttonOpenNwChat").style.right = "0px";
    document.querySelector("#buttonOpenNwChat").style.bottom = "0px";
    document.querySelector("#buttonOpenNwChat").style.zIndex = "1000000000";
    document.querySelector("#buttonOpenNwChat").style.cursor = "pointer";

//acción para abrir el chat
    document.querySelector('#buttonOpenNwChat').onclick = function() {
        document.querySelector("#buttonOpenNwChat").style.display = "none";
        document.querySelector("#containNwChat").style.display = "block";
        if (isMobile()) {
            document.body.style.overflow = "hidden";
        }
    };

    //div contenedor de chat
    var containerNwChat = document.createElement("div");
    containerNwChat.id = "containNwChat";
    containerNwChat.innerHTML = "<div class='titleEncNwChat'><p class='pTitleNwChat'>Chat</p><span class='cerrarNwChat'><span class='cerrarNwChatIcon'></span></span></div>";
    var divExist = document.getElementById("containNwChat");
    if (divExist == null) {
        document.body.appendChild(containerNwChat);
    }

    document.querySelector(".cerrarNwChat").style.display = "block";
    document.querySelector(".cerrarNwChat").style.position = "absolute";
    document.querySelector(".cerrarNwChat").style.right = "5px";
    document.querySelector(".cerrarNwChat").style.top = "0px";
    document.querySelector(".cerrarNwChat").style.width = "20px";
    document.querySelector(".cerrarNwChat").style.height = "17px";

    document.querySelector(".cerrarNwChatIcon").style.background = "#fff";
    document.querySelector(".cerrarNwChatIcon").style.display = "block";
    document.querySelector(".cerrarNwChatIcon").style.width = "18px";
    document.querySelector(".cerrarNwChatIcon").style.height = "2px";
    document.querySelector(".cerrarNwChatIcon").style.top = "10px";
    document.querySelector(".cerrarNwChatIcon").style.position = "relative";
    document.querySelector(".cerrarNwChatIcon").style.cursor = "pointer";

    document.querySelector(".titleEncNwChat").style.background = "#0072ce";
    document.querySelector(".titleEncNwChat").style.color = "#fff";
    document.querySelector(".titleEncNwChat").style.padding = "5px 0px";
    document.querySelector(".titleEncNwChat").style.cursor = "pointer";
    document.querySelector(".titleEncNwChat").style.fontSize = "12px";
    document.querySelector(".titleEncNwChat").style.fontFamily = "Arial";
    document.querySelector(".titleEncNwChat").style.borderBottom = "1px solid #fff";
       if (isMobile()) {
             document.querySelector(".titleEncNwChat").style.position = "fixed";
             document.querySelector(".titleEncNwChat").style.width = "100%";
        }

    document.querySelector(".pTitleNwChat").style.textAlign = "center";
    document.querySelector(".pTitleNwChat").style.margin = "0";

    //para minimizar el chat
    document.querySelector('.titleEncNwChat').onclick = function() {
        document.querySelector("#containNwChat").style.display = "none";
        document.querySelector("#buttonOpenNwChat").style.display = "block";
        if (isMobile()) {
            document.body.style.overflow = "auto";
        }
    };

//crea el iframe del chat en conversación
    var frameNwChat = document.createElement("IFRAME");
    frameNwChat.id = "frameNwChat";
    frameNwChat.src = url;
    frameNwChat.scrolling = "no";
    var control = document.getElementById("frameNwChat");
    if (control == null) {
        document.querySelector("#containNwChat").appendChild(frameNwChat);
    }


//css div contenedor chat
    if (isMobile()) {
        document.querySelector("#containNwChat").style.width = "100%";
        document.querySelector("#containNwChat").style.height = "100%";
        document.querySelector("#containNwChat").style.left = "0px";
        document.querySelector("#containNwChat").style.top = "0px";
    } else {
        document.querySelector("#containNwChat").style.width = "300px";
        document.querySelector("#containNwChat").style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.53)";
        document.querySelector("#containNwChat").style.right = "15px";
        document.querySelector("#containNwChat").style.bottom = "0px";
    }
    document.querySelector("#containNwChat").style.position = "fixed";
    document.querySelector("#containNwChat").style.zIndex = "10000000000000000";
    document.querySelector("#containNwChat").style.display = "none";
    document.querySelector("#containNwChat").style.background = "#ffffff";

//css chat iframe
    if (isMobile()) {
        document.querySelector("#frameNwChat").style.height = "100%";
        document.querySelector("#frameNwChat").style.width = "100%";
    } else {
        document.querySelector("#frameNwChat").style.height = "420px";
        document.querySelector("#frameNwChat").style.width = "300px";
        document.querySelector("#frameNwChat").style.position = "relative";
        document.querySelector("#frameNwChat").style.overflow = "hidden";
    }
    document.querySelector("#frameNwChat").style.border = "0";

}


function isMobile() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
    {
        return true;
    }
    return false;
}