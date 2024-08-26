<?php
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

$annw = 0;
if (isset($animNwInsert)) {
    if ($animNwInsert == "trueNW") {
        $annw = 1;
    }
}
if ($annw == 0) {
    include_once ($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
}
$ruta_enlaces = "/nwlib" . master::getNwlibVersion() . "/modulos/nw_animate/";
$ruta_js = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . $ruta_enlaces;
$play = "";
$playHoja = "";
if (isset($_SESSION["usuario"])) {
    $play = "no";
    $playHoja = "no";
}
if (!isset($_SESSION["usuario"])) {
    $play = "si";
    $playHoja = "si";
}
if (isset($_GET["play"]) && $_GET["play"] == "true") {
    $play = "si";
    $playHoja = "si";
}
if (isset($_SERVER["HTTP_REFERER"])) {
    if ($_SERVER["HTTP_REFERER"] != "") {
        $pag = explode("//", $_SERVER["HTTP_REFERER"]);
        if (isset($pag[1])) {
            $dom = explode("/", $pag[1]);
            if (isset($dom[0])) {
                if ($dom[0] == "nw_apps.loc" || $dom[0] == "apps.gruponw.com" || $dom[0] == $_SERVER["HTTP_HOST"]) {
                    $play = "no";
                    $playHoja = "no";
                } else {
                    $play = "si";
                    $playHoja = "si";
                }
            } else {
                $play = "si";
                $playHoja = "si";
            }
        }
    }
}
if ($annw == 1) {
    $playHoja = "si";
    $play = "si";
}
if (isset($_GET["play"]) && $_GET["play"] == "true") {
    $play = "si";
    $playHoja = "si";
}
if (!isset($_SESSION["usuario"])) {
    $play = "si";
    $playHoja = "si";
}
if ($playHoja == "no") {
    ?>
    <!DOCTYPE html>
    <html>
        <head>
            <title>Animaciones NW</title>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <?php
        }
        if ($annw == 0) {
            ?>
            <script src="<?php echo $ruta_js; ?>js/jquery-1.10.2.js"></script>
            <?php
        }
        if ($playHoja == "no") {
            ?>
            <script src="<?php echo $ruta_js; ?>/js/jquery-ui.js"></script>
            <script src="<?php echo $ruta_js; ?>/editing/js/jquery.spritely.js" type="text/javascript"></script>
            <link rel="stylesheet" href="../js/jquery-ui.css">
            <script src="js/init.js" type="text/javascript"></script>
            <script src="js/main.js" type="text/javascript"></script>
            <script src="js/loadObjects.js" type="text/javascript"></script>
            <script src="js/objectsLeft.js" type="text/javascript"></script>
            <link href="css/ad.css" rel="stylesheet" type="text/css" charset="utf-8"/>
            <link href="css/style.css" rel="stylesheet" type="text/css" charset="utf-8"/>
            <?php
        }
        $id = "";
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
        }
        $id_enc = "";
        $escena = "";
        if (isset($id_encNw)) {
            $id_enc = $id_encNw;
        }
        if (isset($_GET["id_enc"])) {
            $id_enc = $_GET["id_enc"];
        }
        if (isset($_POST["id_enc"])) {
            $id_enc = $_POST["id_enc"];
        }
        if (isset($escenaNw)) {
            $escena = $escenaNw;
        }
        if (isset($_GET["escena"])) {
            $escena = $_GET["escena"];
        }
        if (isset($_POST["escena"])) {
            $escena = $_POST["escena"];
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $tabla = "nwanimate_enc";
        $ca->prepareSelect($tabla, "*", "id=:id");
        $ca->bindValue(":id", $id_enc);
        if (!$ca->exec()) {
            echo "Errot: " . $ca->preparedQuery() . "... Error:" . $ca->lastErrorText();
            return;
        }
        $total = $ca->size();
        if ($total > 0) {
            $ca->next();
            $r = $ca->assoc();
            $altoGlobal = $r["alto"] / 10 . "vw";
            if ($play == "no") {
                ?>
                <style>
                    .contendImg {
                        max-width: 1000px;
                        min-width: 1000px;
                        top: 10%;
                        box-shadow: 0px 0px 55px #000;
                        height: <?php echo $r["alto"] . $r["alto_medida"]; ?>;
                        margin: 0px 50px;
                        margin-bottom: 100px;
                        width: <?php echo $r["ancho"] . $r["ancho_medida"]; ?>;
                    }
                </style>
                <?php
            }
        }
        $ca = new NWDbQuery($db);
        $tabla = "nwanimate_escenas";
        $ca->prepareSelect($tabla, "*", "id=:id");
        $ca->bindValue(":id", $escena);
        if (!$ca->exec()) {
            echo "Errot: " . $ca->preparedQuery() . "... Error:" . $ca->lastErrorText();
            return;
        }
        $total = $ca->size();
        if ($total > 0) {
            $ca->next();
            $r = $ca->assoc();
            $duracionGlobal = $r["duracion"];
            $transicionGlobal = $r["transicion"];
            $transicionGlobalFinal = $r["transicion_final"];
            $backgroundGlobal = $r["background"];
            if ($play == "no") {
                ?>
                <style>
                    .contendImg {
                        background: <?php echo $r["background"]; ?>;
                    }
                </style>
                <?php
            }
        }
        $ca = new NWDbQuery($db);
        $si = session::info();
        $p = $_GET;
        $ca->prepareSelect("nwanimate_code", "codigo", "id_enc=:id_enc and escena=:escena");
        $ca->bindValue(":id_enc", $id_enc);
        $ca->bindValue(":escena", $escena);
        if (!$ca->exec()) {
            $db->rollback();
            echo "Error: " . $ca->lastErrorText();
            return;
        }
        $code = "";
        if ($ca->size() > 0) {
            $ca->next();
            $ra_next = $ca->assoc();
            $code = $ra_next["codigo"];
        }
        echo $code;
        if ($playHoja == "no") {
            ?>
            <script>
                function saveFinal() {
                    var ElementosMitexto = $(".box_object_added");
                    var total = ElementosMitexto.length;
                    var id_enc = $(".addBox").attr("id");
                    var escena = $(".addBox").attr("name");
                    if (im > 0) {
                        //                        loading();
                        for (var i = 0; i < im; i++) {
                            var num = i + 1;
                            var id_object = person[num];
                            var existe = $('#object_' + id_object).length;
                            if (existe != 0) {
                                var p = $("#object_" + id_object).position();
                                var width = $("#object_" + id_object).width();
                                var height = $("#object_" + id_object).height();
                                var rotacion = $("#object_" + id_object).attr("nwrotation");
                                if (rotacion == undefined) {
                                    rotacion = 0;
                                }
                                var lefto = p.left;
                                var topo = p.top;
                                var dat = {id_enc: id_enc, escena: escena, id: id_object, pos_x: lefto, pos_y: topo, width: width, height: height, rotacion: rotacion};
                                saveOtrosObjects(dat);
                            }
                        }
                    }
                }
                ax = 0;
                function saveOtrosObjects(p) {
                    var url = "srv/saveOthers.php";
                    var data = p;
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        error: function() {
                            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
                        },
                        success: function(data) {
                            if (data != "") {
                                //                                alert(data);
                            }
                            ax++;
                            if (ax == im) {
                                savePropertiresEscena(<?php echo $escena; ?>);
                            }
                        }
                    });
                }
            </script>
            <?php
        }
        if ($play == "no") {
            ?>
        </head>
        <body>
            <div id="loading" style="display: none;">
                <?php
                include_once ($_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/loading/index.php");
                ?>
            </div>
            <div id="contenedor">
                <?php
                include 'src/buttonsEditing.php';
                if (isset($play) && $play != "") {
                    $playpasa = $play;
                }
                if (isset($_POST["play"]) && $_POST["play"] != "") {
                    $playpasa = $_POST["play"];
                }
                ?>
                <div class="center" id="center" data-id="<?php echo $id_enc; ?>" data-escena="<?php echo $escena; ?>" data-play="<?php echo $playpasa; ?>">
                    <div class="contendImg" id="contendImg">
                        <script>
                            $(document).ready(function() {
                                loadObjectsCenter();
                            });
                        </script>
                    </div>
                </div>
                <?php
            } else {
                //INCLUYO EL SCRIPT DE ANIMACIÓN SI ESTÁ EN PLAY
                if ($playHoja != "no") {
                    if ($annw == 0) {
                        ?>
                        <script src="<?php echo $ruta_js; ?>editing/js/animate.js" type="text/javascript"></script>
                        <?php
                    }
                }
                $present = "NO";
                if (isset($_GET["present"])) {
                    $present = "SI";
                }
                //EL DIV MAS IMPORTANTE, CONTIENE TODA ANIMACIÓN Y DATA
                ?>
                <title>Animaciones NW</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <div id="containNwAnimate" class="containNwAnimateBox containNwAnimate<?php echo $escena; ?> fadeInUp_animate" 
                     data-id="<?php echo $id_enc; ?>" data-escena="<?php echo $escena; ?>" data-play="<?php echo $play; ?>" 
                     data-alto="<?php echo $altoGlobal; ?>" data-duracion="<?php echo $duracionGlobal; ?>" data-transicion-inicial="<?php echo $transicionGlobal; ?>" 
                     data-background="<?php echo $backgroundGlobal; ?>" data-transicion_final="<?php echo $transicionGlobalFinal; ?>"  present="<?php echo $present; ?>"
                     style="background-color: <?php echo $backgroundGlobal; ?>;"></div>
                <?php
                //PUEDE ESTAR COMO ANIMACIÓN EN PÁGINA WEB
                if (!isset($_GET["present"])) {
                    ?>
                    <script>
                        nwa = "SI";
                        $(document).ready(function() {
                            nwa = "SI";
                            $(".containNwAnimate<?php echo $escena; ?>").ready(function() {
                                nwAnimation(<?php echo $id_enc; ?>, <?php echo $escena; ?>, '<?php echo $play; ?>', '<?php echo $altoGlobal; ?>', '<?php echo $duracionGlobal; ?>', '<?php echo $transicionGlobal; ?>', '<?php echo $backgroundGlobal; ?>', '<?php echo $transicionGlobalFinal; ?>');
                            });
                        });
                    </script>               
                    <?php
                }
            }
            if ($play == "no") {
                ?>
            </div>
        </body>
    </html>
    <?php
}
?>