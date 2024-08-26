function open_nwchat(id, id_t, host, key) {
//    window.open("http://nwadmin.gruponw.com/nwlib/modulos/nw_soporte_chat/src/chat.php?id=" + id + "&user=" + user + "&mail=" + mail, "Soporte NW Chat", "width=350,height=380,status=no,directories=no,menubar=no,toolbar=no,scrollbars=no,location=no,resizable=no,titlebar=no");
    window.open("http://nwadmin.gruponw.com/nwchat/" + id + "&" + id_t + "&" + host + "&" + key, "Soporte NW Chat", "width=350,height=380,status=no,directories=no,menubar=no,toolbar=no,scrollbars=no,location=no,resizable=no,titlebar=no");
}
window.onbeforeunload = function(event) {
//                alert("Adiós amigo");
}
document.getElementById("nw_button_chating").onclick = function() {
    oppe();
};
function oppe() {
    alert("hola");
}