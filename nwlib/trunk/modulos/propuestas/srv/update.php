<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

global $data_post;
$data_post = $_POST["data"];

global $id_get;
$id_get = $_POST["id"];

global $ip;
if (!empty($_SERVER['HTTP_CLIENT_IP'])) { //Verificar la ip compartida de internet
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) { //verificar si la ip fue provista por un proxy
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}


$where = "";
if (isset($_GET["id"])) {
    $where .= " where id = " . $_GET["id"];
}
$query = pg_exec("select * FROM propuestas " . $where);
$r = pg_fetch_array($query);
global $id_propuesta;
$id_propuesta = $r["id"];


$where = "";

if (isset($r["producto"])) {
    $where .= " where id = " . $r["producto"];
}
$query = pg_exec("select * FROM productos " . $where);
$plan = pg_fetch_array($query);
//print_r($plan);

$where = "";

if (isset($r["cliente_prospecto"])) {
    $where .= " where id = " . $r["cliente_prospecto"];
}
$query = pg_exec("select * FROM clientes_prospecto " . $where);
$prd = pg_fetch_array($query);
global $id_cliente;
$id_cliente = $prd["id"];
//echo "<br />cliente<br />";
//print_r($prd);

$where = "";

if (isset($r["empresa"])) {
    $where .= " where id = " . $r["empresa"];
}
$query = pg_exec("select * FROM empresas " . $where);
$emp = pg_fetch_array($query);
global $logotipo;
$logotipo = $emp["logo"];

$where = "";
if (isset($r["descuento"])) {
    $where .= " where id = " . $r["descuento"];
}
$query = pg_exec("select * FROM descuentos " . $where);
$desc = pg_fetch_array($query);

$where = "";
if (isset($r["forma_pago"])) {
    $where .= " where id = " . $r["forma_pago"];
}
$query = pg_exec("select * FROM formas_pago " . $where);
$formpag = pg_fetch_array($query);

$where = "";
if (isset($r["tiempo_entrega"])) {
    $where .= " where id = " . $r["tiempo_entrega"];
}
$query = pg_exec("select * FROM tiempos_entrega " . $where);
$timentreg = pg_fetch_array($query);


$sdate = date("d") . "/" . date("m") . "/" . date("Y");



$dia = array("domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado");
$mes = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
$numdia = date("w"); //muestra el día de la semana
$nummes = date("n");
$diames = date("j"); //muestra el día del mes

global $hoy;
global $hoyletra;
global $hoymes;
global $anho;
$hoy = $dia[$numdia];
$anho = date("Y");
$hoyletra = $diames;
$hoymes = $mes[$nummes - 1];

$fecha = $r["fecha"];
$fecha_m = explode("-", $fecha);
$dia_m = $fecha_m[2];
$mes_m = $fecha_m[1];
$anio_m = $fecha_m[0];
global $fecha_final;
$fecha_final = $dia_m . '-' . $mes_m . '-' . $anio_m;

function detect_city($ip) {

    $default = 'UNKNOWN';

    if (!is_string($ip) || strlen($ip) < 1 || $ip == '127.0.0.1' || $ip == 'localhost')
        $ip = '8.8.8.8';

    $curlopt_useragent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2) Gecko/20100115 Firefox/3.6 (.NET CLR 3.5.30729)';

    $url = 'http://ipinfodb.com/ip_locator.php?ip=' . urlencode($ip);
    $ch = curl_init();

    $curl_opt = array(
        CURLOPT_FOLLOWLOCATION => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_USERAGENT => $curlopt_useragent,
        CURLOPT_URL => $url,
        CURLOPT_TIMEOUT => 1,
        CURLOPT_REFERER => 'http://' . $_SERVER['HTTP_HOST'],
    );

    curl_setopt_array($ch, $curl_opt);

    $content = curl_exec($ch);
    $curl_info = "";
    $city = "";
    if (!is_null($curl_info)) {
        $curl_info = curl_getinfo($ch);
    }

    curl_close($ch);

    if (preg_match('{<li>City : ([^<]*)</li>}i', $content, $regs)) {
        $city = $regs[1];
    }
    if (preg_match('{<li>State/Province : ([^<]*)</li>}i', $content, $regs)) {
        $state = $regs[1];
    }

    if ($city != '' && $state != '') {
        $location = $city . ', ' . $state;
        return $location;
    } else {
        return $default;
    }
}

function ingresa_movimiento($p) {
    global $id_get;
    global $id_cliente;
    global $ip;
    $ipdetect = detect_city($ip);
    $db = NWDatabase::database();
    $cc = new NWDbQuery($db);
    $sqlMov = "INSERT INTO propuestas_movs (fecha, id_propuesta, accion, ip, cliente, ciudad) 
                                        values (:fecha, :id_propuesta, :accion, :ip, :cliente ,:ciudad)";
    $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cc->bindValue(":id_propuesta", $id_get);
    $cc->bindValue(":accion", $p);
    $cc->bindValue(":ip", $ip, true);
    $cc->bindValue(":cliente", $id_cliente);
    $cc->bindValue(":ciudad", $ipdetect);
    $cc->prepare($sqlMov);
    if (!$cc->exec()) {
        echo "errores";
        return;
    } else {
        //  echo "";
        return;
    }
}

function update_prop() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $sql = "UPDATE propuestas SET estado='20',fecha_aprobacion=:fecha_aprobacion WHERE id=:id";
    $ca->bindValue(":fecha_aprobacion", date("Y-m-d H:i:s"));
    $ca->bindValue(":id", $_POST["id"]);
    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "errores";
        return;
    } else {
        echo "Propuesta aprobada correctamente. Dentro de las próximas horas un asesor lo contactará para continuar con el proceso de compra.
            ¡Gracias por confiar en nosotros!";
        return;
    }
}

ingresa_movimiento($data_post);
if ($data_post == "Aprobar") {
    update_prop();
}
?>