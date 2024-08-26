var url = "/nwlib/modulos/";
nwlibVersion = "6";
document.addEventListener("DOMContentLoaded", loadNewsNw);
document.addEventListener("DOMContentLoaded", loadWall);
function loadNewsNw(e, o) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("loadNewsNw").innerHTML = xmlhttp.responseText;
        }
    };
    var plus = "";
    console.log(o);
    if (typeof o != 'undefined') {
        plus = "?offset=" + o;
    }
    xmlhttp.open("GET", "/nwlib" + nwlibVersion + "/dashboard6/src/newsNw/index.php" + plus, true);
    xmlhttp.send();
}
function loadWall() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("wall").innerHTML = xmlhttp.responseText;
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
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
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
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
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
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
//            alert(xmlhttp.responseText);
            document.getElementById("wall").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", url_data + "?comentario=" + comentario, true);
    xmlhttp.send();
    delayedAlert(loadWall, 0);
}