<?php
if (strstr(strtolower($_SERVER['HTTP_USER_AGENT']), "googlebot") || isset($_GET["viewBYRingowOperator"])) {
    return;
}
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$po = nwchat2::startCallUp($_GET);
$ringow_popup = $po["ringow_popup"];
$status = $po["status"];
$id = $po["id"];
$typeCall = $po["typeCall"];
$online = $po["online"];
$username = $po["username"];
$usernameTwo = $po["usernameTwo"];
$co = $po["co"];
$exec = $po["exec"];
?>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        var r = {};
        r.tipo = "sendConfigurationRingow";
        r.ringow_popup = "<?php echo $ringow_popup; ?>";
        r.typeCall = "<?php echo $typeCall; ?>";
        r.status = "<?php echo $status; ?>";
        r.id_enc = "<?php echo $id; ?>";
        r.online = "<?php echo $online; ?>";
        r.usuario = <?php echo json_encode($username); ?>;
        r.usuarioTwo = <?php echo json_encode($usernameTwo); ?>;
        r.config = <?php echo json_encode($co); ?>;
        window.parent.postMessage(r, '*');

<?php
if ($exec == true || $exec == 1 || $exec == "1") {
    ?>
            updateClient("<?php echo $id; ?>");
            interval = setInterval(function () {
                updateClient("<?php echo $id; ?>");
            }, 10000);
    <?php
}
?>
    });

    window.addEventListener('message', function (event) {
        if (event.data == "refresh") {
            setTimeout(function () {
                window.location.reload();
            }, 3000);
        }
    });

    function updateClient(id) {
        var send = "";
        send += "&id=" + id;
        var li = "/nwlib6/nwproject/modules/webrtc/testing/two/updateClient.php";
        var request = new XMLHttpRequest();
        request.open("POST", li, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(send);
        request.onload = function (e) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var ra = request.responseText;
                } else {
                    console.error(request.statusText);
                }
            }
        };
        request.onerror = function (e) {
            console.error(request.statusText);
        };
    }
</script>