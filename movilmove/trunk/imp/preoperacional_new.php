<?php
include_once dirname(__FILE__) . "/../rpcsrv/_mod.inc.php";
//require_once $_SERVER["DOCUMENT_ROOT"] . '/nwlib' . master::getNwlibVersion() . '/pdf/cmfpdf.inc.php';
//include $_SERVER["DOCUMENT_ROOT"] . 'nwlib' . master::getNwlibVersion() . '/barCode.php';

$db = NWDatabase::database();
session::check();
$si = session::info();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$dta = $_GET;
$id = master::clean($_GET["id"]);
$ca->prepare("select * from edo_preoperadmin_results_enc where id=:id");
$ca->bindValue(":id", $id);
//print_r($ca->preparedQuery());

if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

//if ($ca->size() != 0) {
$result = $ca->flush();
//}
//echo "<pre>";
//print_r($dta);
//echo "</pre>";

$ca->prepare("select * from usuarios where id=:id");
$ca->bindValue(":id", $si["id_usuario"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

//if ($ca->size() != 0) {
$user = $ca->flush();
//echo "<pre>";
//print_r($user);
//echo "</pre>";
//} else {
//    echo 'Este usuario administrativo no tiene una firma asociada, por favor ingrese al modulo de usuarios admin y ingrese una firma.';
//    return;
//}
//print_r($user);
$ca->prepare("select * from empresas where id=:id");
$ca->bindValue(":id", $result["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

if ($ca->size() != 0) {
    $emp = $ca->flush();
}

$ca->prepareSelect("edo_preoperadmin_results_valores", "campo,valor", "id_enc=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
}

$rs = $ca->assocAll();
//echo "<pre>";
//print_r($rs);
//echo "</pre>";

if (isset($_SERVER["HTTPS"])) {
    $host = "https://";
    $host .= $_SERVER["HTTP_HOST"];
    if (isset($dta["firma_fonductor_inspeccion"])) {

        $fc = $host . $dta["firma_fonductor_inspeccion"];
    } else {

        $fc = "";
    }
    $fs = $host . $user["firma"];
    $host .= $emp["logo"];
} else {
    $host = "http://";
    $host .= $_SERVER["HTTP_HOST"];
    if (isset($dta["firma_fonductor_inspeccion"])) {

        $fc = $host . $dta["firma_fonductor_inspeccion"];
    } else if (isset($dta["firma"])) {
        $fc = $host . $dta["firma"];
    } else {

        $fc = "";
    }
    $fs = $host . $user["firma"];
    $host .= $emp["logo"];
}

function limpiar($p) {
    $p = str_replace("_", " ", $p);
//    return strtoupper($res);
//    return strtoupper($p);

    return $p;
}
?>
<html>
    <style>
        body{
            font-size: 10px;
            max-width: 1000px;
            width: 100%;
        }
        .center{
            padding: 5px;
            text-align: center;
            align-items: center;
        }
        .center_key{
            padding: 5px;
            text-align: center;
            align-items: center;
            width: 30px;
        }
        h2, h3, h4 {
            margin: 0;
            padding: 0;
        }
        .logotipo{
            width: auto;
            max-width: 150px;
        }
        .firma{
            width: 30%;
            max-width: 150px;
            height: auto;
        }
    </style>
    <head>
    </head>
    <body style="font-family: sans-serif;margin: auto;max-width: 1000px;">
        <div style="margin: 20px 10px 10px 10px;">
            <table align="center" border="1" cellpadding="0" cellspacing="0" style="width:100%;margin-left: 0">
                <tbody>
                    <tr>
                        <td>
                            <img class="logotipo" src="<?php echo $host; ?>" alt="logo" />
                        </td>
                        <td class="center">
                            <h3>INSPECCIÓN PREOCUPACIONAL A VEHÍCULOS</h3>
                        </td>
                        <td class="center">
                            <h4>HV-O&A-F-07-11</h4>
                            <h4>Rev. 4</h4>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" class="center"> 
                            <h3>
                                1.DATOS DEL CONDUCTOR Y VEHÍCULO
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Base:</b></td>
                        <td><b>Placa: <?php echo $result["placa"]; ?></b></td>
                    </tr>
                <table align="center" border="1" cellpadding="0" cellspacing="0" style="width:100%;margin-left: 0">
                    <tr>
                        <td colspan="2" rowspan="2" class="center"><b>2. LISTADO DE VERIFICACIÓN</b></td>
                        <td class="center" colspan="2"><b> <?php echo $result["fecha"]; ?></b> </td>
                    </tr>
                    <tr>
                        <!--<td><b>Si</b> </td>-->
                        <td class="center"colspan="2"><b>Cumple</b> </td>
                    </tr>
                    <tbody>
<?php
foreach ($rs as $key => $item) {
    if ($item['campo'] == 'firma_fonductor_inspeccion') {
        $url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $firma = $url . $item['valor'];
        continue;
    }
    if ($item['campo'] == 'firma') {
        $url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $firma = $url . $item['valor'];
        continue;
    }
    if ($item['campo'] == 'Observacion') {
        continue;
    }
    if ($item['campo'] == 'Observacion') {
        continue;
    }
    echo '<tr>
          <td class="center_key">' . $key . '</td>
            <td class="center">' . limpiar($item['campo']) . '</td>
            <td class="center">' . limpiar($item['valor']) . '</td>
          </tr>';
}
//                                
?>
                    </tbody>
                </table>
                </tbody>
            </table>
            <br>
            <table width="100%" border="1" cellpadding="0" cellspacing="0">
                <tr>
                    <th class="center" style="width: 200px; height: 60px">Firma conductor</th>
                    <td class="center"> <img class="firma" src= "<?php echo $firma; ?>" alt="firma" /></td>
                </tr>
                <tr>
                    <th class="center" style="width: 200px; height: 60px">Firma supervisor</th>
                    <td class="center"> <img class="firma" src="<?php echo $fs; ?>" alt="logo" /> </td>
                </tr>
            </table>
        </div>
    </body>
</html>
