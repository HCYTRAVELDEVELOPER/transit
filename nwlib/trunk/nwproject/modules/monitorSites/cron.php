<?php

//include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$appPath = "";
$execInNavigator = false;
if (isset($_SERVER['HTTP_HOST'])) {
    $appPath = $_SERVER['DOCUMENT_ROOT'] . "/";
    $execInNavigator = true;
} else {
//    $appPath = "/var/www/nwchatapp/html/";
    $appPath = "/var/www/nwtask.com/html/";
//    $appPath = "/var/www/ringow.com/html/";
//    $appPath = "/var/www/nwtask/";
}
//else
//if (!isset($argv[1])) {
//$appPath = "/var/www/ringow.com/html/";
//} else {
//    $appPath = $argv[1];
//}

$usandoCronMonitorSites = "OK";
$usedOutNwlib = true;
require_once $appPath . "rpcsrv/server.php";

error_reporting(0);
ini_set('display_errors', 0);

//$sap_url = "http://nwp5.loc/";
//$opts = array('http' => array('header' => "User-Agent:MyAgent/1.0\r\n"));
//$context = stream_context_create($opts);
//$html = file_get_contents($sap_url, false, $context);
//if ($html == "" || $html == null || $html == false || !$html) {
//    echo "NOOOO";
//}
//print_r($html);
//return;

function getSite($url, $id) {
//    $html = file_get_contents($url);
    $sap_url = $url;
    $opts = array('http' => array('header' => "User-Agent:MyAgent/1.0\r\n"));
    $context = stream_context_create($opts);
    $html = file_get_contents($sap_url, false, $context);
    if ($html == "" || $html == null || $html == false || !$html) {
        nwMaker::error("FAILED_LOAD_HTML", true);
        return "FAILED_LOAD_HTML";
    }

    $status = "OK";
//    $ob = strpos($html, "id='" . $id);
//    $ob_alter = strpos($html, 'id="' . $id);
    $ob = strpos($html, $id);
//    print_r($ob);
//    $ob_alter = strpos($html, $id);
//    if ($ob !== "" && $ob !== null && $ob !== false || $ob_alter !== "" && $ob_alter !== null && $ob_alter !== false) {
    if ($ob == "" || $ob == null || $ob == false || !$ob) {
        $status = "FAILED_SEARCH_STRING";
    }
    return $status;
}

function sendAlert($r, $cel) {
    $sm = Array();
    $sm["cel"] = $cel;
    $sm["text"] = "ALERTA PAGINA CAIDA " . $r["dominio"] . " presenta novedad, no se encuentra disponible";
//        $sm["from"] = "GRUPONW";
//        $sm["user"] = "GRUPONW";
//        $sm["pass"] = "Nw729272";
    $sm["from"] = "NETCAR";
    $sm["user"] = "NETCAR";
    $sm["pass"] = "NC729272";
    $sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
    master::sendSMSByCBG($sm);
}

function saca_dominio($url) {
    $protocolos = array('http://', 'https://', 'ftp://', 'www.');
    $url = explode('/', str_replace($protocolos, '', $url));
    return $url[0];
}

function sendAlertasusers($r) {
    //alexf
    sendAlert($r, "573125729272");
    //juliand
    sendAlert($r, "573024082706");
    //diegos
    sendAlert($r, "573228207436");
    //diegos2
    sendAlert($r, "573007572108");
    //andresf
    sendAlert($r, "573144304998");
    //andresf2
    sendAlert($r, "573007572011");
    //mauriciol
    sendAlert($r, "573168766667");

    $xa = false;
    $title = "ALERTA PAGINA CAIDA " . $r["dominio"];
    $fromName = "NwServers";
    $fromEmail = "info@gruponw.com";
    $asuntoon = "ALERTA PAGINA CAIDA " . $r["dominio"] . " presenta novedad, no se encuentra disponible";
    nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    nw_configuraciones::sendEmail("alexf@gruponw.com", "alexf@gruponw.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    nw_configuraciones::sendEmail("direccion@netwoods.net", "direccion@netwoods.net", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    nw_configuraciones::sendEmail("soporte@gruponw.com", "soporte@gruponw.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    nw_configuraciones::sendEmail("diegos@gruponw.com", "soporte@gruponw.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
    nw_configuraciones::sendEmail("mauriciol@gruponw.com", "soporte@gruponw.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
}

//$output = shell_exec('ping -c1 nwp5.loc');
//echo "<pre>$output</pre>";
//return;
//    getSite('https://nwadmin.gruponw.com', 'playground');
//    getSite('https://www.gruponw.com', 'foot_nw_credit');
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nw_monitor_sites", "*", "1=1");
if (!$ca->exec()) {
    if ($execInNavigator) {
        echo "Error line 8 " . $ca->lastErrorText();
    }
    nwMaker::error("Error Task cron " . $ca->lastErrorText(), true);
    return false;
}
$t = $ca->size();
if ($t == 0) {
    return false;
}
for ($i = 0; $i < $t; $i++) {
    $r = $ca->flush();

    $txt = "";
    $rta = "OK";

    $dom = saca_dominio($r["dominio"]);

    //primero realiza un ping al dominio, si es vacío es porque no está activo
    $output = shell_exec('ping -c1 ' . $dom);
    $txt .= " PING to " . $dom;
    if ($execInNavigator) {
        echo $txt;
    }
    if ($output == "" || $output == null || $output == false || !$output) {
        $rta = "FAILED_PING";
        $txt .= "<pre>$rta <br />---------------------------<br /><br /><br /></pre>";
        echo $txt;
        nwMaker::error("ALERTA PAGINA CAIDA " . $r["dominio"] . " " . $txt, true);
        sendAlertasusers($r);
        saveResult($r, $rta, $txt, $execInNavigator);
        continue;
    }

    $txt .= " <pre>$output</pre>";
    if ($execInNavigator) {
        echo "<pre>$output</pre>";
    }

    //revisa si el sitio tiene la cadena de texto para validar que esté activo
    rastreo($r, $rta, $execInNavigator, $txt);
}

function rastreo($r, $rta, $execInNavigator, $txt) {
    if ($rta !== "FAILED") {
        $rta = getSite($r["dominio"], $r["ratreo"]);
    }
    $res = "<pre>" . $rta . " " . $r["dominio"] . "<br />---------------------------<br /><br /><br /></pre>";
    $txt .= $res;

    if ($rta !== "OK") {
        nwMaker::error("ALERTA PAGINA CAIDA " . $r["dominio"] . " " . $rta, true);
        if ($execInNavigator) {
            print $res;
        }
        sendAlertasusers($r);
        saveResult($r, $rta, $txt, $execInNavigator);
    } else {
        if ($execInNavigator) {
            print $res;
        }
    }
//    saveResult($r, $rta, $txt, $execInNavigator);
}

function saveResult($r, $rta, $txt, $execInNavigator) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $ca->setCleanHtml(false);
    $ca->prepareInsert("nw_monitor_results", "fecha, dominio, texto_rastreado, status, results");
    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ca->bindValue(":dominio", $r["dominio"]);
    $ca->bindValue(":texto_rastreado", $r["ratreo"]);
    $ca->bindValue(":status", $rta);
    $ca->bindValue(":results", $txt);
    if (!$ca->exec()) {
        if ($execInNavigator) {
            echo "Error line 8 " . $ca->lastErrorText();
        }
        nwMaker::error("Error crontask  " . $ca->lastErrorText(), true);
        return false;
    }
    return true;
}
