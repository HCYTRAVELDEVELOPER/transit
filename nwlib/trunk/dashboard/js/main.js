var url = "/nwlib6/modulos/";
nwlibVersion = "6";
useSecondView = false;

function widthMenuSecondView() {
    var div = document.querySelectorAll(".containerBoxM");
    var total = div.length;
    var ancho = 100 / total;
    for (var i = 0; i < total; i++) {
        div[i].style.width = ancho + "%";
    }
}

function reload() {
    location.reload();
}
function abre(id) {
    location.href = '/nwlib' + nwlibVersion + '/dashboard/vistaInterna.php?id=' + id;
}

function loadWall() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("walk").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/modulos/nw_tareas/walk.php?embed=true");
    xmlhttp.send();
}
function comment(id) {
    var url_data = url + "nw_tareas/src/comments/comments.php";
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("boxComment_" + id).innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", url_data + "?id=" + id + "&tipo=1", true);
    xmlhttp.send();
}
function commentInt(id, tipo) {
    var comentario = document.getElementById("comentario" + id).value;
//    alert(comentario);
    var url_data = url + "nw_tareas/src/comments/agregar.php";
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    } else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            document.getElementById("comments" + id).innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", url_data + "?comentario=" + comentario + "&tipo=1&id_relation=" + id, true);
    xmlhttp.send();
    delayedAlert(comment(id), 0);
}
function publicatInt() {
    var comentario = document.getElementById("comentario").value;
    var url_data = url + "nw_tareas/src/walk/agregar.php";
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    } else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
//            alert(xmlhttp.responseText);
            document.getElementById("walk").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", url_data + "?comentario=" + comentario, true);
    xmlhttp.send();
    delayedAlert(loadWall, 0);
}



var timeoutID;
function delayedAlert(func, time) {
    timeoutID = window.setTimeout(func, time);
}
function slowAlert() {
    loadWall();
}
function clearAlert() {
    window.clearTimeout(timeoutID);
}



function loadMainDivs(id) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("contend_modules").innerHTML = xmlhttp.responseText;
        }
    }
    var sendScondV = "";
    if (typeof useSecondView != "undefined") {
        if (useSecondView) {
            sendScondV = "&usedSecondView=true";
        }
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/loadMainDivs.php?id=" + id + sendScondV, true);
    xmlhttp.send();
}

function loadXMLDoc(id) {
    useSecondView = true;
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/vistaInterna.php?id=" + id, true);
    xmlhttp.send();
}
function loadNw() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("loadNwEnc").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/loadNw.php", true);
    xmlhttp.send();
}
function loadNewsNw(e, o) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("loadNewsNw").innerHTML = xmlhttp.responseText;
        }
    };
    var plus = "";
//    console.log(o);
//    return;
//    if (o != undefined) {
    if (typeof o != 'undefined') {
        plus = "?offset=" + o;
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/newsNw/index.php" + plus, true);
    xmlhttp.send();
}
function addFavorite(id) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("DivFavorite" + id).innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/addFavorite.php?id=" + id, true);
    xmlhttp.send();
}
function deleteFavorite(id) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("DeleteFavorite").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/deleteFavorite.php?id=" + id, true);
    xmlhttp.send();
    reload();
}
function search() {
    ci = document.getElementById('ci').value;
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("searchResult").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard/search.php?search=" + ci, true);
    xmlhttp.send();
}

function limpiarSearch() {
    document.getElementById("loadNwEnc").innerHTML = "";
}
function limpiar() {
    document.getElementById("myDiv").innerHTML = "";
}

//$(document).ready(function() {
//    loadInternetSiNo();
//});
function loadInternetSiNo() {
    //        $("#hayInternet").load('/nwlib/modulos/nw_tareas/loadInternet.php');
    if (!$("#hayInternet").load('/nwlib' + nwlibVersion + '/modulos/nw_tareas/loadInternet.php')) {
        alert("no se pudo cargar loadInternet");
    }
    setTimeout(function () {
        var htmlInternet = $("#hayInternet").text();
        if (htmlInternet == "") {
            window.location = "/nwlib" + nwlibVersion + "/modulos/nw_tareas/offline_task.html";
        }
    }, 4000);
}
function startAllStart() {
    var soundStartHome = parent.qxnw.local.getData("soundStart");
    if (soundStartHome != false) {
        document.getElementById("soundStart").innerHTML = "<audio class='audioStar' id='audioStar' src='/nwlib" + nwlibVersion + "/audio/SD_ALERT_43.mp3' autoplay></audio>";
    }
}