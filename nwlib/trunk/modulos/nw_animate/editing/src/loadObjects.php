<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function loadObjects($play, $capa) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);

    $id_enc = "";
    $escena = "";
    if (isset($_GET["id_enc"])) {
        $id_enc = $_GET["id_enc"];
    }
    if (isset($_POST["id_enc"])) {
        $id_enc = $_POST["id_enc"];
    }
    if (isset($_GET["escena"])) {
        $escena = $_GET["escena"];
    }
    if (isset($_POST["escena"])) {
        $escena = $_POST["escena"];
    }
    $where1 = "  ";
    $where1 .= " and a.id_enc=:id_enc";
    $where1 .= " and a.id_escena=:escena ";
    if ($capa != 0) {
        $where1 .= " and a.capa=:capa";
        $ca->bindValue(":capa", $capa);
    } else {
        $where1 .= " and a.capa =0";
    }
    $where = " b.publicado IS NULL {$where1} or b.publicado='SI' {$where1} ";
    $where .= " order by a.orden desc";

    $ca->prepareSelect("nwanimate_objetos a left join nwanimate_escenas b on (a.id_escena=b.id)", "a.*", $where);
    $ca->bindValue(":escena", $escena);
    $ca->bindValue(":id_enc", $id_enc);
    if (!$ca->exec()) {
        echo "Error:" . $ca->lastErrorText();
        return;
    }
    $result = "";
    $total = $ca->size();
    if ($capa == 0) {
        $result .= " <script> im = $total; person = []; </script> ";
    }
//    if ($total == 0) {
//        return 0;
//    }
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $rta = "";
            $object = $ca->flush();
            $texto_object = "";
            $num = $i + 1;
            $repeticiones = 9;
            if ($object["repeticiones"] != "") {
                $repeticiones = $object["repeticiones"];
            }
            $cs1 = "";
            if ($play == "no") {
                $cs1 .= "left: " . $object["pos_x"] . "px;";
            } else
            if ($play == "si") {
                $cs1 .= "left: " . $object["pos_x"] / 10 . "vw;";
            }
            if ($play == "no") {
                $cs1 .= "top: " . $object["pos_y"] . "px;";
            } else {
                $cs1 .= "top: " . $object["pos_y"] / 10 . "vw;";
            }
            if ($play == "no") {
                $cs1 .= "width: " . $object["width"] . "px;";
            } else {
                $cs1 .= "width: " . $object["width"] / 10 . "vw;";
            }
            if ($play == "no") {
                $cs1 .= "height: " . $object["height"] . "px;";
            } else {
                $cs1 .= "height: " . $object["height"] / 10 . "vw;";
            }
            $cs1 .= "transform: rotate(" . $object["rotacion"] . "deg);";
            $classBloq1 = "";
            if ($object["tipo"] == "capa") {
                $classBloq1 .= " capaRecortadaBloque ";
            }
            $oRotation = "0";
            if (isset($object["rotacion"]) && $object["rotacion"] != null) {
                $oRotation = $object["rotacion"];
            }
            $box_object = "box_object_play";
            if ($play == "no") {
                $box_object = "box_object";
            }
            $cssFigure = "";
            if (isset($object["tipo"]) && $object["tipo"] == "figure") {
                if ($object["tipo_figura"] == "circulo") {
                    $cssFigure = "circleNw";
                }
                if ($object["tipo_figura"] == "cuadrado_puntas_redondas") {
                    $cssFigure = "cuadroRedondoNw";
                }
            }
            if (isset($object["tipo"]) && $object["tipo"] == "capa") {
                $cssFigure .= " capaRecortada ";
                $texto_object = loadObjects($play, $object["id"]);
            }
            $css = "";
            if ($object["tipo"] == "img") {
                if (isset($object["imagen"])) {
                    $css .= "background-image: url(" . $object["imagen"] . ");";
                }
            } else
            if ($object["tipo"] == "figure") {
                if (isset($object["color"])) {
                    $css .= "background-color: " . $object["color"] . ";";
                }
            } else
            if (isset($object["tipo"]) && $object["tipo"] == "text") {
                if (isset($object["nombre"])) {
                    $css .= "color: " . $object["color"] . ";";
                    $css .= "font-size: " . $object["tipo_figura"] . "px;";
                    $css .= "word-wrap: break-word;";
                    $texto_object = $object["nombre"];
                }
            } else {
                $css .= "background-image: url(" . $object["imagen"] . ");";
            }
            $cssDiv = "";
            if ($object["tipo"] != "capa") {
                $cssDiv = "style='{$css}'";
            }
            $velocidad = $object["velocidad"];
            if ($velocidad == NULL || $velocidad == "") {
                $velocidad = 20;
            }
            $htmlPlayno = "";
            if ($play == "no") {
                $htmlPlayno = "<div class='div_pos div_pos_{$object["id"]}' >{$object["width"]}px  *  {$object["height"]}px</div>";
            }
            //DIV CONTENEDOR DE LA ANIMACIÓN
            $rta .="<div  style='{$cs1}' id='object_{$object['id']}' nwrotation='{$oRotation}' width='{$object['width']}' height='{$object['height']}' top='{$object['pos_y']}' left='{$object['pos_x']}' type='{$object['tipo']}' class='{$box_object} {$classBloq1}' name='{$object['id']}' >
                      <div {$cssDiv} perspectiveX='0' perspectiveY='0' class='imgObject {$cssFigure}' id='imgObject_{$object['id']}'>
                        {$texto_object}
                      </div>
                   {$htmlPlayno}
                  </div>";

            if ($object["tipo"] != "capa") {
                $rta .= "<script>";
                $rta .= "$(document).ready(function() { ";
                $rta .= "person[{$num}] = {$object["id"]};";
                if ($play == "no") {
                    $rta .= "insertFotogramasObject({$object["id"]});";
                }
                if (isset($object["animado"]) && $object["animado"] == "si") {
                    $rta .= "animated({$object["id"]}, {$repeticiones}, 0);";
                }
                if ($object["movimiento"] == "si") {
                    $cc = new NWDbQuery($db);
                    $cc->prepareSelect("nwanimate_objects_animation", "*", "objeto=:objecto  order by id asc");
                    $cc->bindValue(":objecto", $object["id"]);
                    if (!$cc->exec()) {
                        echo "error:" . $cc->lastErrorText();
                        return;
                    }
                    $totalANims = $cc->size();
                    if ($totalANims > 0) {
                        for ($e = 0; $e < $totalANims; $e++) {
                            $cc->next();
                            $rob = $cc->assoc();
                            if ($rob["velocidad"] > $rob["delay"]) {
                                $velocity_object = $rob["velocidad"] - $rob["delay"];
                            } else
                            if ($rob["velocidad"] < $rob["delay"]) {
                                $velocity_object = $rob["delay"] - $rob["velocidad"];
                            } else {
                                $velocity_object = $rob["velocidad"] - $rob["delay"];
                            }
                            $obj_x = $rob["pos_x"];
                            $obj_y = $rob["pos_y"];
                            $width_ob = $rob["width"];
                            $height_ob = $rob["height"];
                            $easing_object = $rob["easing"];
                            $ob_medida = "px";
                            $apaPlay = "no";
                            if ($easing_object == "" || $easing_object == null) {
                                $easing_object = "linear";
                            }
                            if ($width_ob == "" || $width_ob == null) {
                                $width_ob = $object["width"];
                            }
                            if ($height_ob == "" || $height_ob == null) {
                                $height_ob = $object["height"];
                            }
                            if ($play == "si") {
                                $obj_x = $rob["pos_x"] / 10;
                                $obj_y = $rob["pos_y"] / 10;
                                $width_ob = $width_ob / 10;
                                $height_ob = $height_ob / 10;
                                $ob_medida = "vw";
                                $apaPlay = "si";
                                $rta .=" var array = {
                            id:{$object['id']},
                            top_final:{$obj_y},
                            left_final:{$obj_x},
                            veloc:{$velocity_object},
                            reprod: '{$object['reproducir']}',
                            opFin:{$rob['opacidad']},
                            delay:{$rob['delay']},
                            me: '$ob_medida',
                            play: '$apaPlay',
                            reproduce: 'si',
                            w: '$width_ob',
                            h: '$height_ob',
                            easing: '$easing_object',
                            rotacion: '{$rob['rotacion']}',
                            perspectivex: '{$rob['perspectiveX']}',
                            perspectivey: '{$rob['perspectiveY']}'
                            };
                            animatedMovimiento(array);
                        ";
                            }
                        }
                    }
                }
                $rta .= "});";
                $rta .= "</script>";
            } else {
                $rta .= "<script>";
                $rta .= "$(document).ready(function() { ";
                $rta .= "person[{$num}] = {$object["id"]};";
                $rta .= "});";
                $rta .= "</script>";
            }
            $result .= $rta;
        }
    }
    return $result;
}

if (isset($play) && $play != "") {
    $playpasa = $play;
}
if (isset($_POST["play"]) && $_POST["play"] != "") {
    $playpasa = $_POST["play"];
}
$data = loadObjects($playpasa, 0);
if ($playpasa == "no") {
    $data .= "<script>";
    $data .= "$(document).ready(function() { ";
    $data .= " jsLoadObjects();  jsLoadContextMenu();";
    $data .= "});";
    $data .= "</script>";
}
echo $data;
?>