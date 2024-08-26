<?php
if (!session_id())
    session_start();

ob_start('comprimir_pagina');

function protocoloHTTPS() {
    $http = "http";
    $https = "https";
    $protocolo = $http;
    if (isset($_SERVER["HTTPS"])) {
        if ($_SERVER["HTTPS"] == "on") {
            $protocolo = $https;
        } else {
            $protocolo = $http;
        }
    }
    return $protocolo;
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/nwlib6/includes/php-jwt/vendor/autoload.php';

use \Firebase\JWT\JWT;

$key = "nw_app_secret";

$room = strip_tags(str_replace("_", "", $_GET["room"]));

$protocolo = protocoloHTTPS();

$terminal = "";
if (isset($_GET["terminal"])) {
    $terminal = $_GET["terminal"];
}
if (isset($_SESSION["terminal"])) {
    $terminal = $_SESSION["terminal"];
}
$id_user = "";
if (isset($_GET["id_user"])) {
    $id_user = $_GET["id_user"];
}
if (isset($_SESSION["id_usuario"])) {
    $id_user = $_SESSION["id_usuario"];
}
$email = "";
if (isset($_GET["email"])) {
    $email = $_GET["email"];
}
if (isset($_SESSION["email"])) {
    $email = $_SESSION["email"];
}
$name = "";
if (isset($_GET["name"])) {
    $name = $_GET["name"];
}
if (isset($_SESSION["nombre"])) {
    $name = $_SESSION["nombre"];
    if (isset($_SESSION["apellido"])) {
        $name .= " " . $_SESSION["apellido"];
    }
}
$foto = "";
if (isset($_GET["foto"])) {
    $foto = $_GET["foto"];
}
if (isset($_SESSION["foto"])) {
    $foto = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . $_SESSION["foto"];
}
$moderator = true;
if (isset($_GET["moderator"])) {
    if ($_GET["moderator"] === "false") {
        $moderator = false;
    }
}
$fileRecordingsEnabled = false;
if (isset($_GET["fileRecordingsEnabled"])) {
    if ($_GET["fileRecordingsEnabled"] === "true") {
        $fileRecordingsEnabled = true;
    }
}
$startWithVideoMuted = false;
if (isset($_GET["startWithVideoMuted"])) {
    if ($_GET["startWithVideoMuted"] === "true") {
        $startWithVideoMuted = true;
    }
}
$mosaico = true;
if (isset($_GET["mosaico"])) {
    if ($_GET["mosaico"] === "false") {
        $mosaico = false;
    }
}
$urlFin = "";
if (isset($_GET["urlFin"])) {
    $urlFin = $_GET["urlFin"];
}
$mod = "false";
if ($moderator === true) {
    $mod = "true";
}
$version = "1";
//if ($terminal == "1") {
if ($_SERVER["HTTP_HOST"] === "app.taskenter.com" || $_SERVER["HTTP_HOST"] === "taskenter.com") {
    $version = "2";
}
if ($_SERVER["HTTP_HOST"] === "test.taskenter.com") {
    $version = "3";
}
//}
$version = "3";
if ($_SERVER["HTTP_HOST"] === "app.taskenter.com") {
    $version = "3";
}
if ($_SERVER["HTTP_HOST"] === "localhost" || $_SERVER["HTTP_HOST"] === "localhost:8383" || $_SERVER["HTTP_HOST"] === "192.168.10.19") {
    $version = "3";
}
if ($_SERVER["HTTP_HOST"] === "ccb.gruponw.com" || $_SERVER["HTTP_HOST"] === "www.ccb.gruponw.com" || $_SERVER["HTTP_HOST"] === "asesoriasvirtuales.ccb.org.co" || $_SERVER["HTTP_HOST"] === "www.asesoriasvirtuales.ccb.org.co") {
//    $version = "2";
    $version = "3";
}
if (isset($_GET["testingv"]) && $_GET["testingv"] === "true") {
    $version = "3";
}
//$version = "3";
//$do = "meet.gruponw.com";
$do = "meet2.gruponw.com";
//$do = "meet.ringow.com";
if ($version === "2") {
    $do = "meet2.gruponw.com";
} else
if ($version === "3") {
    $do = "meet3.gruponw.com";
}
$version = "3";
$do = "meet3.gruponw.com";
$v = "51";

$moderadorMode = "NO";
if ($mod === true) {
    $moderadorMode = "SI";
}

$token = array(
    "iss" => "nw_app_video",
    "room" => $room,
    "exp" => strtotime("+10 years"),
    "sub" => $do,
    "aud" => "nw_app_secret",
    "moderator" => $mod,
    "openBridgeChannel" => "true",
    "context" => [
        "user" => [
            'avatar' => $foto,
            'name' => $name,
            'email' => $email,
            'id' => $id_user
        ]
    ]
);
$jwt = JWT::encode($token, $key);
?>

<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1'>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="css/initVideo.css?v=<?php echo $v; ?>">
    </head>
    <body class="cuerpo" data-moderator="<?php echo $moderadorMode; ?>" data-version="<?php echo $version; ?>" data-jwt="<?php echo $jwt; ?>" data-mosaico="<?php echo json_encode($mosaico); ?>" data-urlend="<?php echo $urlFin; ?>" data-fileRecordingsEnabled="<?php echo json_encode($fileRecordingsEnabled); ?>" data-room="<?php echo $room; ?>" data-email="<?php echo $email; ?>" data-name="<?php echo $name; ?>" data-photo="<?php echo $foto; ?>" data-terminal="<?php echo $terminal; ?>">
        <div id="jitsi-container"></div>

        <div class="containerInit">
            <h2>Unirse a la reunión</h2>
            <div class="video-wrap">
                <video id="video" muted playsinline autoplay></video>
            </div>            
        </div>
        <!--<script src='js/initVideo.min.js?v=26' ></script>-->
        <script src='js/initVideo.js?v=<?php echo $v; ?>' ></script>
        <?php
        if ($_SERVER["HTTP_HOST"] === "localhost" || $_SERVER["HTTP_HOST"] === "localhost:8383" || $_SERVER["HTTP_HOST"] === "192.168.10.19" || $_SERVER["HTTP_HOST"] === "app.taskenter.com" || $_SERVER["HTTP_HOST"] === "test.taskenter.com" || $_SERVER["HTTP_HOST"] === "taskenter.com") {
            ?>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-auth.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-storage.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-firestore.js"></script>
            <script src='/nwlib6/nwproject/modules/webrtc/v6/chat/scripts/initVideoTask.js?v=<?php echo $v; ?>' ></script>
            <?php
        }
        ?>
    </body>
</html>

<?php
ob_end_flush();

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}
