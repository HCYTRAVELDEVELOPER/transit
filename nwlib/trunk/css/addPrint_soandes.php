<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
error_reporting(E_ALL);

if (session_id() == null) {
    session_start();
}
$p = $_GET;
if (!isset($p["id"])) {
    return;
}
if (!isset($_SESSION["usuario"])) {
    echo "No autorizado. Debe iniciar sesión.";
    return;
}
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
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$ca->prepareSelect("nw_print_forms", "*", "id=:id");
$ca->bindValue(":id", $p["id"]);
if (!$ca->exec()) {
    echo "Error al consultar la configuración. " . $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    return 0;
}
$r = $ca->flush();
$tipo_form = $_GET["type"];
if ($tipo_form == "Examen Médico Ocupacional" || $tipo_form == "Apoyo Diagnóstico" || $tipo_form == "Exploración de Olfato") {
    $tipo_form = "Examen";
}
if ($tipo_form == "Exploración de Olfato") {
    $tipo_form = "Olfato";
}
if ($tipo_form == "Apoyo Diagnóstico") {
    $tipo_form = "Apoyo";
}
$res_tipo = explode(" ", $tipo_form);
if (!isset($res_tipo[1])) {
    $evolucion = false;
    $ca->prepareSelect("soandes_admisiones_det a left join soandes_admisiones b ON(a.ingreso=b.id) left join soandes_pacientes c ON(b.identificacion=c.identificacion) ", "c.*,a.*,b.id as id_ingreso", "a.id=:id");
    $ca->bindValue(":id", $r["id_relation"]);
    if (!$ca->exec()) {
        echo "Error al consultar la configuración. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "No tiene admisión";
        return false;
    }
    $ad = $ca->flush();
    $enc = getEnc($ad);
    if ($enc == false) {
        echo "No se ha finalizado este ingreso";
        return false;
    }
    $u = getDatosDoctor($enc);
    if ($u == false) {
        return false;
    }
} else {
    $evolucion = true;
    $ca->prepareSelect($_GET["opcional"] . " a left join soandes_pacientes b  ON(b.identificacion::double precision=a.identificacion::double precision) ", "b.*,a.*", "a.identificacion::integer=:identificacion");
    $ca->bindValue(":identificacion", $_GET["relacion"]);
    if (!$ca->exec()) {
        echo "Error al consultar la configuración. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "No tiene admisión";
        return false;
    }
    $ad = $ca->flush();
    $enc = getEncEvolucion($ad);
    if ($enc == false) {
        echo "No se ha finalizado este ingreso";
        return false;
    }
    $u = getDatosDoctorEvolucion($ad);
    if ($u == false) {
        return false;
    }
}

function getEnc($ad) {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $ca->prepareSelect("soandes_admisiones a left join terminales t on a.sede_atencion=t.id", "a.*,t. nombre as sede_atencion_text,codigo_prestador,telefono,direccion", "a.id=:ingreso and (a.estado_historia_clinica='CERRADA' or a.estado_historia_clinica='APLAZAR' or a.estado_historia_clinica='APLAZADA') ");
    $ca->prepareSelect("soandes_admisiones a left join terminales t on a.sede_atencion=t.id left join "
            . "soandes_pacientes x on (a.identificacion=x.identificacion) ",
            "a.*,t.nombre as sede_atencion_text,t.codigo_prestador,t.telefono,t.direccion,x.edad,x.fecha_nacimiento,x.estado_civil,"
            . "x.no_hijos,x.estrato,func_concepto(x.raza::integer,'soandes_raza') as raza,x.genero,x.escolaridad", "a.id=:ingreso ");
    $ca->bindValue(":ingreso", $ad["id_ingreso"], true, true);
    if (!$ca->exec()) {
        print_r("Error ejecutando la consulta: " . $ca->lastErrorText());
        return false;
    }
    if ($ca->size() == 0) {
        echo "No tiene permisos, no existe el documento o la admisión no ha sido CERRADA o APLAZADA.";
        return false;
    }
    return $ca->flush();
}

function getEncEvolucion($ad) {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect($_GET["opcional"] . " a left join terminales t on a.terminal=t.id left join"
            . " soandes_pacientes x on (a.identificacion=x.identificacion)",
            "a.*,t.nombre as sede_atencion_text,t.codigo_prestador,t.telefono,t.direccion,x.edad,x.fecha_nacimiento,x.estado_civil,"
            . "x.no_hijos,x.estrato,func_concepto(x.raza::integer,'soandes_raza') as raza,x.genero,x.escolaridad",
            "a.identificacion=:identificacion ");
    $ca->bindValue(":identificacion", $_GET["relacion"], true, true);
    if (!$ca->exec()) {
        print_r("Error ejecutando la consulta: " . $ca->lastErrorText());
        return false;
    }
    if ($ca->size() == 0) {
        echo "No tiene permisos, no existe el documento o la admisión no ha sido CERRADA o APLAZADA.";
        return false;
    }
    return $ca->flush();
}

function getEmpresa() {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("empresas", "*", "id=:empresa");
    $ca->bindValue(":empresa", $_SESSION["empresa"], true, true);

    if (!$ca->exec()) {
        print_r("Error ejecutando la consulta: " . $ca->lastErrorText());
        return false;
    }
    if ($ca->size() == 0) {
        windowError("No tiene permisos, no existe el documento o la admisión no ha sido CERRADA o APLAZADA.");
        return false;
    }
    return $ca->flush();
}

function windowError($text) {
    echo $text;
}

function getDatosDoctor($enc) {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("soandes_admisiones_det", "atendido_por", "id=:id and atendido_por is not null ");
    $ca->bindValue(":id", $_GET["relacion"]);
    if (!$ca->exec()) {
        echo "Error al consultar la configuración. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "Este examen aún no ha sido atendido.";
        return false;
    }
    $r = $ca->flush();
    $ca->prepareSelect("usuarios", "registro_medico,firma_mecanica,documento,nombre,licencia_so,apellido", "id=:id");
    $ca->bindValue(":id", $r["atendido_por"], true, true);
    if (!$ca->exec()) {
        echo "Error al consultar la configuración. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        windowError("No existen datos del especialista.");
        return false;
    }
    return $ca->flush();
}

function getDatosDoctorEvolucion($enc) {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("usuarios", "registro_medico,firma_mecanica,documento,nombre,licencia_so,apellido", "usuario=:usuario");
    $ca->bindValue(":usuario", $enc["usuario"], true, true);
    if (!$ca->exec()) {
        echo "Error al consultar la configuración. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        windowError("No existen datos del especialista.");
        return false;
    }
    return $ca->flush();
}

$empresa = getEmpresa();
if ($empresa == false) {
    return false;
}
//$sqls = "select registro_medico,firma_mecanica,documento,nombre from  usuarios where id=:id";
//$ca->prepare($sqls);
//$ca->bindValue(":id", $ad["atendido_por"], true);
//if (!$ca->exec()) {
//    $db->rollback();
//    echo $ca->lastErrorText();
//    return;
//}
//
//if ($ca->size() == 0) {
//    echo "No existe el médico";
//    return false;
//}
//$u = $ca->flush();
//$array_tipo = explode(" ", $p["type"]);
//if ($array_tipo[0] != "Evolución") {
//    $evolucion = false;
//    $ca->prepareSelect("soandes_admisiones_det a left join soandes_admisiones b ON(a.ingreso=b.id) left join soandes_pacientes c ON(b.identificacion=c.identificacion) ", "c.*,a.*", "a.id=:id");
//    $ca->bindValue(":id", $r["id_relation"]);
//    if (!$ca->exec()) {
//        echo "Error al consultar la configuración. " . $ca->lastErrorText();
//        return;
//    }
//    if ($ca->size() == 0) {
//        echo "No tiene admisión";
//        return false;
//    }
//    $ad = $ca->flush();
//
//    $sqls = "select registro_medico,firma_mecanica,documento,nombre from  usuarios where id=:id";
//    $ca->prepare($sqls);
//    $ca->bindValue(":id", $ad["atendido_por"], true);
//    if (!$ca->exec()) {
//        $db->rollback();
//        echo $ca->lastErrorText();
//        return;
//    }
//    if ($ca->size() == 0) {
//        echo "No existe el médico";
//        return false;
//    }
//    $u = $ca->flush();
//} else {
//    $evolucion = false;
//    $arrayop = explode(" ", $r["opcional"]);
//    $ca->prepareSelect("" . $arrayop[0] . " a left join soandes_pacientes b  ON(a.identificacion=b.identificacion) ", "a.*,a.usuario as usuario_profesional,b.*", "a.identificacion=:identi and a.id=:id");
//    $ca->bindValue(":identi", $p["relacion"], true);
//    $ca->bindValue(":id", $arrayop[1], true);
//    if (!$ca->exec()) {
//        echo "Error al consultar la configuración. " . $ca->lastErrorText();
//        return;
//    }
//    if ($ca->size() == 0) {
//        echo "No tiene admisión";
//        return false;
//    }
//    $ad = $ca->flush();
////    print_r($ad);
//    if (isset($ad["fecha"])) {
//        $ad["fecha_evolucion"] = $ad["fecha"];
//    }
//    $sqls = "select registro_medico,firma_mecanica,documento,nombre from  usuarios where usuario=:id";
//    $ca->prepare($sqls);
//    $ca->bindValue(":id", $ad["usuario_profesional"], true);
//    if (!$ca->exec()) {
//        $db->rollback();
//        echo $ca->lastErrorText();
//        return;
//    }
//    if ($ca->size() == 0) {
//        echo "No existe el médico";
//        return false;
//    }
//    $u = $ca->flush();
//}
?>
<script>
    document.addEventListener("DOMContentLoaded", function () {
<?php if ($evolucion == false) { ?>
            var x = "";
            x += "<h3>DATOS DEL PACIENTE</h3>";
            x += "<table class='encUsers'>";

            x += "<tr>";
            x += "<td>";
            x += "Identificación: <?php echo $ad["identificacion"]; ?>";
            x += "<br />Paciente: <?php echo $ad["primer_apellido"] . " " . $ad["segundo_apellido"] . " " . $ad["primer_nombre"] . " " . $ad["segundo_nombre"]; ?>";
            x += "<br />Fecha nac: <?php echo $ad["fecha_nacimiento"]; ?>";
            x += "<br />Sede: <?php echo $ad["ingreso"]; ?>";
            x += "<br />Edad: <?php echo $ad["edad"]; ?>";
            x += "<br />Teléfono: <?php echo $ad["telefono_fijo"]; ?>";
            x += "</td>";
            x += "<td>";
            x += "No Admisión: <?php echo $ad["ingreso"]; ?>";
            x += "<br />Fecha Admisión: <?php echo $ad["fecha_atendido"]; ?>";
            x += "<br />Estado historia: <?php echo $ad["estado_historia_clinica"]; ?>";
            x += "<br />Atendido por: <?php echo $u["nombre"]; ?>";
            x += "</td>";
            x += "<td>";
            x += "<div class='fotoUser' style='background-image: url(<?php echo $ad["foto"]; ?>);'></div>";
            x += "</td>";
            x += "</tr>";

            x += "</table>";
<?php } else { ?>
            var x = "";
            x += "<h3>DATOS DEL PACIENTE</h3>";
            x += "<table class='encUsers'>";

            x += "<tr>";
            x += "<td>";
            x += "Identificación: <?php echo $ad["identificacion"]; ?>";
            x += "<br />Paciente: <?php echo $ad["primer_apellido"] . " " . $ad["segundo_apellido"] . " " . $ad["primer_nombre"] . " " . $ad["segundo_nombre"]; ?>";
            x += "<br />Fecha nac: <?php echo $ad["fecha_nacimiento"]; ?>";
            x += "<br />Edad: <?php echo $ad["edad"]; ?>";
            x += "<br />Teléfono: <?php echo $ad["telefono_fijo"]; ?>";
            x += "</td>";
            x += "<td>";
            x += "No Evolución: <?php echo $ad["id"]; ?>";
            x += "<br />Fecha Evolución: <?php echo $ad["fecha_evolucion"] ?>";
            x += "<br />Atendido por: <?php echo $u["nombre"]; ?>";
            x += "</td>";
            x += "<td>";
            x += "<div class='fotoUser' style='background-image: url(<?php echo $ad["foto"]; ?>);'></div>";
            x += "</td>";
            x += "</tr>";

            x += "</table>";
<?php } ?>
        var xx = document.querySelector(".encPrintAdd");
        if (xx) {
            var xa = document.createElement("div");
            xa.id = "datospaciente";
            xa.innerHTML = x;
            xx.appendChild(xa);
            xx.parentNode.insertBefore(xa, xx.firsChild);
        }
    });

</script>

<!DOCTYPE html>
<html id='xhtmlEnc' xmlns="<?php echo $protocolo; ?>://www.w3.org/1999/xhtml" xmlns:fb="<?php echo $protocolo; ?>://www.facebook.com/2008/fbml" xmlns:og="<?php echo $protocolo; ?>://ogp.me/ns#" xml:lang="es-ES">
    <head>
        <title><?php echo $_GET["type"]; ?> <?php echo $ad["identificacion"]; ?> ID <?php echo $_GET["relacion"]; ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="generator" content="gruponw" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <?php
        echo "<link href='/resource/nw_charts/chartist.min.css' rel='stylesheet' type='text/css' />";
        echo "<link href='/resource/nw_charts/jquery.jqplot.css' rel='stylesheet' type='text/css' />";
        echo "<link href='/qxnw.6.0/trunk/source/resource/nw_charts/jquery.jqplot.css' rel='stylesheet' type='text/css' />";
        echo "<link href='/nwlib6/css/addPrint2.css' rel='stylesheet' type='text/css' />";
        echo "<link href='/nwlib6/css/addPrint2_soandes.css' rel='stylesheet' type='text/css' />";
        echo '<script src="/nwlib6/css/addPrint.js"></script>';
        echo '<script src="/nwlib6/css/addPrint_soandes.js"></script>';
        ?>
    </head>
    <body>
        <div class="titleType">
            <?php echo $_GET["type"]; ?>
        </div>

        <table class="datosSoa">
            <tr>
                <th style="width: 20%;">
                    <img src="<?php echo $empresa["logo"]; ?>" style="float: left; margin-bottom: 0px; width: 170px; margin: 0 22px; margin-top:-15px;" />
                </th>
                <th style="width: 55%;">
                    <div>
                        SALUD OCUPACIONAL DE LOS ANDES LTDA.
                        <br />Código Prestador: <?php echo $enc["codigo_prestador"] ?>
                        <br />Nit: 830029102-0<br>Dirección: <?php echo $enc["direccion"] ?>
                        <br />Telefono: <?php echo $enc["telefono"] ?>
                        <br />Email: conceptos@soandes.co
                        SOA-FDS0-1 Rev 7 Enero 2017
                    </div>
                </th>
                <th style="width: 25%; text-align: right;">
                    <div class="info_user">
                        <img src="<?php echo $ad["codigo_qr"] ?>" class="qr"/>
                    </div>
                </th>
            </tr>
        </table>
        <div class="separatorGreen">Información General</div>
        <?php if ($evolucion == false) { ?>
            <table class="datosPaciente">
                <tr>
                    <td style="width: 200px;border:hidden;">
                        <strong>No. ingreso</strong>
                        <strong><?php echo $enc["id"]; ?></strong>
                    </td>
                    <td style="width: 200px;">
                        <strong>Fecha Impresión</strong>
                        <?php echo date("Y-m-d") ?>
                    </td>
                    <td style="width: 200px;">
                        <strong>Empresa Contratante</strong>
                    </td>
                    <td style="width: 400px;">
                        <?php echo $enc["contrato_text"]; ?>
                    </td>  
                    <td colspan="2" rowspan="10">
                        <div class="info_user">
                            <img class="foto_pac" src="<?php echo $ad["foto"]; ?>"  style="float: left;margin-bottom: 0px;width: 120px;height: 120px;margin: 0 10px;" />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Nombre</strong>
                    </td>
                    <td style="width: 400px;">
                        <?php echo $ad["primer_nombre"] . " " . $ad["segundo_nombre"] . " " . $ad["primer_apellido"] . " " . $ad["segundo_apellido"]; ?>
                    </td>
                    <td>
                        <strong>Empresa a Laborar</strong>
                    </td>
                    <td>
                        <?php echo $enc["destino_text"]; ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Cargo</strong>
                    </td>
                    <td>
                        <?php echo $enc["nombre_cargo"]; ?>
                    </td>
                    <td>
                        <strong>Tipo de Examen</strong>
                    </td>
                    <td class="tipoexam">
                        <span class="bloqueInline"><?php echo $enc["tipo_evaluacion_text"]; ?></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>CC</strong>
                    </td>
                    <td>
                        <?php echo $ad["identificacion"]; ?>
                    </td>
                    <td style="width: 200px;">
                        <strong>Sede</strong>
                    </td>
                    <td>
                        <?php echo $enc["sede_atencion_text"]; ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Fecha Ingreso</strong>
                    </td>
                    <td>
                        <?php echo $enc["fecha_ingreso"]; ?> &nbsp;<?php
                        echo $enc["hora_ingreso"];
                        ?>
                    </td>
                    <td style="width: 200px;">
                        <strong>Fecha Salida</strong>
                    </td>
                    <td>
                        <?php echo $enc["fecha_salida"]; ?> &nbsp;<?php
                        echo $enc["hora_salida"];
                        ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Fecha Nac.</strong>
                    </td>
                    <td>
                        <?php echo $enc["fecha_nacimiento"]; ?> 
                    </td>
                    <td style="width: 200px;">
                        <strong>Edad</strong>
                    </td>
                    <td>
                        <?php echo $enc["edad"]; ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Estado civil</strong>
                    </td>
                    <td>
                        <?php echo $enc["estado_civil"]; ?> 
                    </td>
                    <td style="width: 200px;">
                        <strong>Escolaridad</strong>
                    </td>
                    <td>
                        <?php echo $enc["escolaridad"]; ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Genero</strong>
                    </td>
                    <td>
                        <?php echo $enc["genero"]; ?> 
                    </td>
                    <td style="width: 200px;">
                        <strong>N° hijos</strong>
                    </td>
                    <td>
                        <?php echo $enc["no_hijos"]; ?>
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">
                        <strong>Raza</strong>
                    </td>
                    <td>
                        <?php echo $enc["raza"]; ?> 
                    </td>
                    <td style="width: 200px;">
                        <strong>Estrato</strong>
                    </td>
                    <td>
                        <?php echo $enc["estrato"]; ?>
                    </td>
                </tr>
            </table>
        <?php } else { ?>
            <table class="datosPaciente">
                <tr>
                    <td style="width: 200px;">
                        <strong>Fecha Impresión</strong>
                        <?php echo date("Y-m-d") ?>
                    </td>
                    <td style="width: 200px;">
                        <strong>Nombre</strong>
                        <?php echo $ad["primer_nombre"] . " " . $ad["segundo_nombre"] . " " . $ad["primer_apellido"] . " " . $ad["segundo_apellido"]; ?>
                    </td>
                    <td style="width: 200px;">
                        <strong>CC <?php echo $ad["identificacion"]; ?></strong>
                    </td>
                    <td style="width: 200px;">
                        <strong>Fecha Evolución</strong>
                        <?php echo $enc["fecha"]; ?>
                    </td>
                    <td colspan="2" rowspan="10">
                        <div class="info_user">
                            <img class="foto_pac" src="<?php echo $ad["foto"]; ?>"  style="float: left;margin-bottom: 0px;width: 120px;height: 120px;margin: 0 10px;" />
                        </div>
                    </td>
                </tr>
            </table>        
        <?php } ?>
        <?php
        $r["html"] = str_replace("resource/", "/resource/", $r["html"]);
//        $r["html"] = str_replace("qx/", "/resource/qx/", $r["html"]);
        $r["html"] = str_replace("writing-mode: vertical-lr; transform: rotate(180deg);", "writing-mode: vertical-lr; transform: rotate(180deg);position:absolute!important;bottom:0px;", $r["html"]);
        echo $r["html"];
        ?>

        <?php if ($evolucion == false) { ?>
            <table class="consentimiento_info">
                <tr>
                    <td class="table_con">
                        <FONT color= "white" style="font-size:  12px;border:0px;vertical-align: 5px;padding: 3px;"><strong>Consentimiento informado del trabajador</strong></FONT></h4>
                    </td>
                </tr>
                <tr>
                    <td><p ALIGN="justify">
                            En calidad de paciente previamente informado (a) de forma libre y voluntaria  autorizo al profesional de la salud quien firma abajo a realizar los exámenes ocupacionales. Y acepto que estos datos sean empleados para fines estrictamente citados en materia de salud ocupacional mediante la recolección, recaudo, almacenamiento, uso, circulación, procesamiento, actualización y disposición de los datos suministrados e incorporados en las bases de datos de Salud Ocupacional de los Andes Ltda.
                            Además certifico que he sido informado (a) acerca de la naturaleza y propósito de estos exámenes. Entiendo que la realización de los mismos es voluntaria y que tuve la oportunidad de retirar mi consentimiento en cualquier momento. Certifico además que las respuestas que doy son completas y verídicas.
                            Se me informo también que este documento es estrictamente confidencial y de reserva profesional. No puede comunicarse o darse a conocer, salvo a las personas o entidades previstas en la legislación vigente y se me informo que puedo obtener copia de las valoraciones realizadas en el momento que lo requiera.
                        </p></td>
                </tr>
            </table>
        <?php } ?>
        <table  class="boxFirmas">
            <tr>
                <td>
                    <p class="containTextMedium">
                        <img src="data:image;base64,<?php echo $u["firma_mecanica"] ?>" height="64" />
                    </p>
                </td>
                <td>
                    <p class="containTextMedium">
                        <img src="data:image;base64,<?php echo $ad["firma"] ?>" height="64" />
                    </p>
                </td>
                <!--<td>-->
                    <!--<div class="info_user"><img src="<?php // echo $ad["huella"];                                                                                                                                                                                                                                                                                                                          ?>" style="float: left; margin-bottom: 0px; width: 100px; height: 100px; margin: 0 52px" /></div>-->
                <!--</td>-->
            </tr>
            <tr>
                <td>   
                    <strong>
                        Profesional ocupacional:
                    </strong><?php
                    echo $u["nombre"];
                    if (isset($u["licencia_so"])) {
                        echo " " . $u["apellido"];
                    }
                    ?>
                    <br/>
                    <strong>
                        CC:
                    </strong> <?php echo $u["documento"] ?>
                    <br/>
                    <strong>
                        Registro médico:
                    </strong>
                    <?php echo $u["registro_medico"] ?>
                    </br><strong>
                        Licencia N°:
                    </strong>
                    <?php
                    if (isset($u["licencia_so"])) {
                        echo $u["licencia_so"];
                    }
                    ?>
                </td>
                <td valign="top">
                    <strong>Firma del trabajador:</strong> <?php echo $ad["primer_nombre"] . " " . $ad["segundo_nombre"] . " " . $ad["primer_apellido"] . " " . $ad["segundo_apellido"]; ?>
                    </br>
                    <strong>
                        CC:
                    </strong>
                    <?php echo $ad["identificacion"] ?>
                </td>
            </tr>
        </table>
    </body>
</html>
