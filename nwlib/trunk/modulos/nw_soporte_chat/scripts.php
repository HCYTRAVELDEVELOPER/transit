<?php
function saca_dominio($url) {
    $url = explode('/', str_replace('www.', '', str_replace('http://', '', $url)));
    return $url[0];
}

function getNav() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $navegadores = array(
        'Opera' => 'Opera',
        'Mozilla Firefox' => '(Firebird)|(Firefox)',
        'Google Chrome' => '(Chrome)',
        'Galeon' => 'Galeon',
        'Mozilla' => 'Gecko',
        'MyIE' => 'MyIE',
        'Lynx' => 'Lynx',
        'Chrome' => 'Chrome',
        'Netscape' => '(CHROME/23\.0\.1271\.97)|(Mozilla/4\.75)|(Netscape6)|(Mozilla/4\.08)|(Mozilla/4\.5)|(Mozilla/4\.6)|(Mozilla/4\.79)',
        'Konqueror' => 'Konqueror',
        'Internet Explorer 7' => '(MSIE 7\.[0-9]+)',
        'Internet Explorer 6' => '(MSIE 6\.[0-9]+)',
        'Internet Explorer 5' => '(MSIE 5\.[0-9]+)',
        'Internet Explorer 4' => '(MSIE 4\.[0-9]+)',
    );
    foreach ($navegadores as $navegador => $pattern) {
//        if (eregi($pattern, $user_agent))
        preg_match('/' . $pattern . '/', $user_agent);
        return $navegador;
    }
}
  function insertVisita($p, $ip, $terminal) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            global $url_stay;
            $visit = 1;
            $tabla = "sop_visitas";
            $fields = "id_visitante, ip, terminal, fecha, visitas, url";
            if (isset($_COOKIE["url_referer"]) && $_COOKIE["url_referer"] == $_SERVER['HTTP_HOST']) {
//            if (isset($_COOKIE["url_referer"]) && $_COOKIE["url_referer"] == $_SERVER['HTTP_REFERER']) {
                $ca->prepareUpdate($tabla, $fields, "id_visitante=:id_visitante and url=:url");
                setcookie("url_visitas", $_COOKIE["url_visitas"] + 1);
                $visit = $_COOKIE["url_visitas"];
            } else {
                $ca->prepareInsert($tabla, $fields);
//                setcookie("url_referer", $_SERVER['HTTP_REFERER']);
                if (headers_sent()) {
                    // las cabeceras ya se han enviado, no intentar añadir una nueva
                } else {
                    setcookie("url_referer", $_SERVER['HTTP_HOST']);
                    setcookie("url_visitas", 1);
                }
//                setcookie("url_referer", $_SERVER['HTTP_HOST']);
//                setcookie("url_visitas", 1);
            }
            $ca->bindValue(":id_visitante", $p);
//            $ca->bindValue(":url", $_SERVER['HTTP_REFERER']);
//            $ca->bindValue(":url", $_SERVER['HTTP_HOST']);
            $ca->bindValue(":url", $url_stay);
            $ca->bindValue(":ip", $ip, true);
            $ca->bindValue(":terminal", $terminal);
            $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ca->bindValue(":visitas", $visit);
            if (!$ca->exec()) {
                echo "Error línea 284 index " . $ca->lastErrorText();
                return;
            }
        }
?>
