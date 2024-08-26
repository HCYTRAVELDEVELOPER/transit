<?php

class NWUtils {

    public static function encrypt($value, $type = null) {
        if ($type === "md5") {
            return md5($value);
        }
        $c = nwprojectOut::nwpMakerConfig();
        if (isset($c["segmod"]) && $c["segmod"] !== null && $c["segmod"] !== false && $c["segmod"] !== "") {
            if ($c["segmod"] === "sha256") {
                return hash('sha256', $value);
            }
        }
        return md5($value);
    }

    public static function testMergeWavs($p) {
        return self::convertAndMergeMp3($p["file1"], $p["file2"], $p["final"]);
//        return self::mergeWavs($p["file1"], $p["file2"], $p["final"]);
    }

    public static function generatePdf($p) {
        $p["destination"] = $_SERVER["DOCUMENT_ROOT"] . $p["destination"];
        $exec = "node ../nwlib6/node/generarPdfV2.js '{$p["url"]}' '{$p["destination"]}' ;2>&1";
        $ret = exec($exec, $out, $err);
        if ($err && $err !== null && $err !== "") {
            error_log(json_encode($err));
        }
        return true;
    }

    public static function convertAndMergeMp3($file1, $file2, $finalWav) {
        $f1 = self::mp3ToWav($file1);
        $f2 = self::mp3ToWav($file2);
        return self::mergeWavs($f1, $f2, $finalWav);
    }

    public static function mergeWavs($filePathWav1, $filePathWav2, $final) {
        if (!file_exists($filePathWav1)) {
            return ("No existe el archivo 1");
        }
        if (!is_writable($filePathWav1)) {
            return ("El archivo 1 no tiene los permisos requeridos");
        }
        if (!file_exists($filePathWav2)) {
            return ("No existe el archivo 2");
        }
        if (!is_writable($filePathWav2)) {
            return ("El archivo 2 no tiene los permisos requeridos");
        }
//        $shell = 'sox -m ' . $filePathWav1 . ' ' . $filePathWav2 . ' ' . $final . ' 2>&1';
        $shell = 'sox -m ' . $filePathWav1 . ' ' . $filePathWav2 . ' ' . $final;
        $salida = shell_exec($shell);
        return $salida;
    }

    public static function mp3ToWav($filePath) {
        $arr = explode(".", $filePath);
        $dest = $arr[0] . ".wav";
        if (!file_exists($filePath)) {
//            NWJSonRpcServer::information("No existe el archivo origen");
            echo "No existe el archivo origen";
        }
        if (!is_writable($filePath)) {
//            NWJSonRpcServer::information("El archivo no tiene los permisos requeridos");
            echo "El archivo no tiene los permisos requeridos";
        }
        $shell = 'ffmpeg -i ' . $filePath . ' -y ' . $dest;
        $salida = shell_exec($shell);
        return $dest;
    }

    protected static $win1252ToUtf8 = array(
        128 => "\xe2\x82\xac",
        130 => "\xe2\x80\x9a",
        131 => "\xc6\x92",
        132 => "\xe2\x80\x9e",
        133 => "\xe2\x80\xa6",
        134 => "\xe2\x80\xa0",
        135 => "\xe2\x80\xa1",
        136 => "\xcb\x86",
        137 => "\xe2\x80\xb0",
        138 => "\xc5\xa0",
        139 => "\xe2\x80\xb9",
        140 => "\xc5\x92",
        142 => "\xc5\xbd",
        145 => "\xe2\x80\x98",
        146 => "\xe2\x80\x99",
        147 => "\xe2\x80\x9c",
        148 => "\xe2\x80\x9d",
        149 => "\xe2\x80\xa2",
        150 => "\xe2\x80\x93",
        151 => "\xe2\x80\x94",
        152 => "\xcb\x9c",
        153 => "\xe2\x84\xa2",
        154 => "\xc5\xa1",
        155 => "\xe2\x80\xba",
        156 => "\xc5\x93",
        158 => "\xc5\xbe",
        159 => "\xc5\xb8"
    );

    public static function toUTF8($text) {
        if (is_array($text)) {
            foreach ($text as $k => $v) {
                $text[$k] = self::toUTF8($v);
            }
            return $text;
        }
        if (!is_string($text)) {
            return $text;
        }
        $max = strlen($text);

        $buf = "";
        for ($i = 0; $i < $max; $i++) {
            $c1 = $text[$i];
            if ($c1 >= "\xc0") {
                $c2 = $i + 1 >= $max ? "\x00" : $text[$i + 1];
                $c3 = $i + 2 >= $max ? "\x00" : $text[$i + 2];
                $c4 = $i + 3 >= $max ? "\x00" : $text[$i + 3];
                if ($c1 >= "\xc0" & $c1 <= "\xdf") {
                    if ($c2 >= "\x80" && $c2 <= "\xbf") {
                        $buf .= $c1 . $c2;
                        $i++;
                    } else {
                        $cc1 = (chr(ord($c1) / 64) | "\xc0");
                        $cc2 = ($c1 & "\x3f") | "\x80";
                        $buf .= $cc1 . $cc2;
                    }
                } elseif ($c1 >= "\xe0" & $c1 <= "\xef") {
                    if ($c2 >= "\x80" && $c2 <= "\xbf" && $c3 >= "\x80" && $c3 <= "\xbf") {
                        $buf .= $c1 . $c2 . $c3;
                        $i = $i + 2;
                    } else {
                        $cc1 = (chr(ord($c1) / 64) | "\xc0");
                        $cc2 = ($c1 & "\x3f") | "\x80";
                        $buf .= $cc1 . $cc2;
                    }
                } elseif ($c1 >= "\xf0" & $c1 <= "\xf7") {
                    if ($c2 >= "\x80" && $c2 <= "\xbf" && $c3 >= "\x80" && $c3 <= "\xbf" && $c4 >= "\x80" && $c4 <= "\xbf") {
                        $buf .= $c1 . $c2 . $c3 . $c4;
                        $i = $i + 3;
                    } else {
                        $cc1 = (chr(ord($c1) / 64) | "\xc0");
                        $cc2 = ($c1 & "\x3f") | "\x80";
                        $buf .= $cc1 . $cc2;
                    }
                } else {
                    $cc1 = (chr(ord($c1) / 64) | "\xc0");
                    $cc2 = (($c1 & "\x3f") | "\x80");
                    $buf .= $cc1 . $cc2;
                }
            } elseif (($c1 & "\xc0") == "\x80") {
                if (isset(self::$win1252ToUtf8[ord($c1)])) {
                    $buf .= self::$win1252ToUtf8[ord($c1)];
                } else {
                    $cc1 = (chr(ord($c1) / 64) | "\xc0");
                    $cc2 = (($c1 & "\x3f") | "\x80");
                    $buf .= $cc1 . $cc2;
                }
            } else {
                $buf .= $c1;
            }
        }
        return $buf;
    }

    public static function functionExists($func) {
        if (ini_get('safe_mode')) {
            return false;
        }
        $disabled = ini_get('disable_functions');
        if ($disabled) {
            $disabled = explode(',', $disabled);
            $disabled = array_map('trim', $disabled);
            return !in_array($func, $disabled);
        }
        return true;
    }

    public static function fileExists($p) {
        if ($p == "" || $p == null) {
            return false;
        }
        if (file_exists($_SERVER["DOCUMENT_ROOT"] . $p)) {
            return true;
        } else {
            return false;
        }
    }

    public static function console($data) {
        error_log(print_r($data, true));
    }

    public static function getDateTime($db) {
        $rta = "'" . date("Y-m-d H:i:s") . "'";
        switch ($db->getDriver()) {
            case "ORACLE":
                $rta = "TIMESTAMP'" . date("Y-m-d H:i:s") . "' ";
                break;
            default:
                break;
        }
        return $rta;
    }

    public static function getDate($db, $strdate = false) {
        $d = date("Y-m-d");
        if ($strdate == false) {
            $rta = str_pad($d, strlen($d) + 1, "'", STR_PAD_BOTH);
        } else {
            $rta = "'" . $strdate . "'";
        }
        switch ($db->getDriver()) {
            case "ORACLE":
                if ($strdate == false) {
                    $rta = "DATE'" . date("Y-m-d") . "' ";
                } else {
                    $rta = "DATE'" . $strdate . "' ";
                }
                break;
            default:
                break;
        }
        return $rta;
    }

    public static function getTime($db) {
        $rta = "'" . date("H:i:s") . "'";
        switch ($db->getDriver()) {
            case "ORACLE":
                $rta = "TO_DATE('" . date("H:i:s") . "', 'HH24:MI:SS')";
                break;
            default:
                break;
        }
        return $rta;
    }

    public static function convertToOracleLower($r) {
        $ru = Array();
        foreach ($r as $key => $value) {
            $ru[strtolower($key)] = $value;
        }
        return $ru;
    }

    public static function getPermissionsFromFile($file) {

        $perms = fileperms($file);

        if (($perms & 0xC000) == 0xC000) {
// Socket
            $info = 's';
        } elseif (($perms & 0xA000) == 0xA000) {
// Symbolic Link
            $info = 'l';
        } elseif (($perms & 0x8000) == 0x8000) {
// Regular
            $info = '-';
        } elseif (($perms & 0x6000) == 0x6000) {
// Block special
            $info = 'b';
        } elseif (($perms & 0x4000) == 0x4000) {
// Directory
            $info = 'd';
        } elseif (($perms & 0x2000) == 0x2000) {
// Character special
            $info = 'c';
        } elseif (($perms & 0x1000) == 0x1000) {
// FIFO pipe
            $info = 'p';
        } else {
// Unknown
            $info = 'u';
        }

// Owner
        $info .= (($perms & 0x0100) ? 'r' : '-');
        $info .= (($perms & 0x0080) ? 'w' : '-');
        $info .= (($perms & 0x0040) ?
                (($perms & 0x0800) ? 's' : 'x' ) :
                (($perms & 0x0800) ? 'S' : '-'));

// Group
        $info .= (($perms & 0x0020) ? 'r' : '-');
        $info .= (($perms & 0x0010) ? 'w' : '-');
        $info .= (($perms & 0x0008) ?
                (($perms & 0x0400) ? 's' : 'x' ) :
                (($perms & 0x0400) ? 'S' : '-'));

// World
        $info .= (($perms & 0x0004) ? 'r' : '-');
        $info .= (($perms & 0x0002) ? 'w' : '-');
        $info .= (($perms & 0x0001) ?
                (($perms & 0x0200) ? 't' : 'x' ) :
                (($perms & 0x0200) ? 'T' : '-'));

        return $info;
    }

    public static function getHumanReadableSize($size, $unit = null, $decemals = 2) {
        $byteUnits = Array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        if (!is_null($unit) && !in_array($unit, $byteUnits)) {
            $unit = null;
        }
        $extent = 1;
        foreach ($byteUnits as $rank) {
            if ((is_null($unit) && ($size < $extent <<= 10)) || ($rank == $unit)) {
                break;
            }
        }
        return number_format($size / ($extent >> 10), $decemals) . ' ' . $rank;
    }

    public static function getProtocol() {
        if (!isset($_SERVER['HTTPS'])) {
            return 'http://';
        }
        $sptc = strtolower($_SERVER['HTTPS']);
        $proto = $sptc == 'on' ? 'https://' : 'http://';
        return $proto;
    }

    public static function getVar($type, $var) {
        $realType = "";
        switch ($type) {
            case "GET":
                $realType = INPUT_GET;
                break;
            case "POST":
                $realType = INPUT_POST;
                break;
            case "SERVER":
                $realType = INPUT_SERVER;
                break;
            case "ENV":
                $realType = INPUT_ENV;
                break;
            case "COOKIE":
                $realType = INPUT_COOKIE;
                break;
        }
        return filter_input($realType, $var);
    }

    public static function cleanCols($string) {
        $text = str_replace("<b style='color:red'>*</b>", "*", $string);
        return $text;
    }

    public static function clean_accent($cadena) {
        return self::quitar_tildes($cadena);
    }

    public static function quitar_tildes($cadena) {
        $no_permitidas = array("á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ñ", "À", "Ã", "Ì", "Ò", "Ù", "Ã™", "Ã ", "Ã¨", "Ã¬", "Ã²", "Ã¹", "ç", "Ç", "Ã¢", "ê", "Ã®", "Ã´", "Ã»", "Ã‚", "ÃŠ", "ÃŽ", "Ã”", "Ã›", "ü", "Ã¶", "Ã–", "Ã¯", "Ã¤", "«", "Ò", "Ã", "Ã„", "Ã‹");
        $permitidas = array("a", "e", "i", "o", "u", "A", "E", "I", "O", "U", "n", "N", "A", "E", "I", "O", "U", "a", "e", "i", "o", "u", "c", "C", "a", "e", "i", "o", "u", "A", "E", "I", "O", "U", "u", "o", "O", "i", "a", "e", "U", "I", "A", "E");
        $texto = str_replace($no_permitidas, $permitidas, $cadena);
        return $texto;
    }

    public static function validateDate($date, $format = 'Y-m-d H:i:s') {
        if ($date === null) {
            return false;
        }
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    public static function objToArray($obj = false) {
        if (is_object($obj))
            $obj = get_object_vars($obj);
        if (is_array($obj)) {
            return array_map(__FUNCTION__, $obj);
        } else {
            return $obj;
        }
    }

    public static function moneyFormat($string, $locale) {
        setlocale(LC_MONETARY, $locale);
        return money_format('%i', $string);
    }

    public static function searchFieldIntoArrayByKey($fieldKey, $array) {
        foreach ($array as $key => $value) {
            if ($fieldKey == $key) {
                return $array[$fieldKey];
            }
        }
    }

    public static function executeSql($sql) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function createRandomColor() {
        return '#' . strtoupper(dechex(nwMaker::random(0, 10000000)));
    }

    public static function startCompression() {
        if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
            ob_start("ob_gzhandler");
        } else {
            ob_start();
        }
        if (session_id() == null) {
            session_start();
        }
    }

    public static function get_random_string($valid_chars, $length) {
        $random_string = "";
        $num_valid_chars = strlen($valid_chars);
        for ($i = 0; $i < $length; $i++) {
            $random_pick = nwMaker::random(1, $num_valid_chars);
            $random_char = $valid_chars[$random_pick - 1];
            $random_string .= $random_char;
        }
        return $random_string;
    }

    public static function getRealIp() {
        $ip = "";
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public static function cleanString($str) {
        $text = html_entity_decode(strip_tags($str));
        $text = str_replace("&rsquo;", "'", $text);
        $content = preg_replace("/&#?[a-z0-9]{2,8};/i", "", $text);
        $invalid_characters = array("$", "%", "#", "<", ">", "|");
        $str = str_replace($invalid_characters, "", $content);
        $output = preg_replace('/[^(\x20-\x7F)]*/', '', $str);
        $ser = serialize($output);
        $result = addslashes($ser);
        $result = quotemeta($result);
        return $str;
    }

    public static function isMobile() {
        return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
    }

    public static function removeSecuritySql($p) {
        $p = str_replace("insert", " ", $p);
        $p = str_replace("INSERT", " ", $p);
        $p = str_replace("update", " ", $p);
        $p = str_replace("UPDATE", " ", $p);
        $p = str_replace("delete", " ", $p);
        $p = str_replace("DELETE", " ", $p);
        $p = str_replace("create", " ", $p);
        $p = str_replace("CREATE", " ", $p);
        $p = str_replace("GRANT", " ", $p);
        $p = str_replace("grant", " ", $p);
        return $p;
    }

    public static function getOS() {

        global $user_agent;

        $os_platform = "Unknown OS Platform";

        $os_array = array(
            '/windows nt 6.2/i' => 'Windows 8',
            '/windows nt 6.1/i' => 'Windows 7',
            '/windows nt 6.0/i' => 'Windows Vista',
            '/windows nt 5.2/i' => 'Windows Server 2003/XP x64',
            '/windows nt 5.1/i' => 'Windows XP',
            '/windows xp/i' => 'Windows XP',
            '/windows nt 5.0/i' => 'Windows 2000',
            '/windows me/i' => 'Windows ME',
            '/win98/i' => 'Windows 98',
            '/win95/i' => 'Windows 95',
            '/win16/i' => 'Windows 3.11',
            '/macintosh|mac os x/i' => 'Mac OS X',
            '/mac_powerpc/i' => 'Mac OS 9',
            '/linux/i' => 'Linux',
            '/ubuntu/i' => 'Ubuntu',
            '/iphone/i' => 'iPhone',
            '/ipod/i' => 'iPod',
            '/ipad/i' => 'iPad',
            '/android/i' => 'Android',
            '/blackberry/i' => 'BlackBerry',
            '/webos/i' => 'Mobile'
        );

        foreach ($os_array as $regex => $value) {

            if ($user_agent !== null) {
                if (preg_match($regex, $user_agent)) {
                    $os_platform = $value;
                }
            }
        }

        return $os_platform;
    }

    public static function getBrowser() {
        if (!isset($_SERVER['HTTP_USER_AGENT'])) {
            $agent = "server_cron";
            return array(
                'webkit' => $agent,
                'userAgent' => $agent,
                'name' => $agent,
                'version' => $agent,
                'platform' => $agent,
                'pattern' => $agent
            );
        }
        $u_agent = $_SERVER['HTTP_USER_AGENT'];
//        $u_agent = (isset($_SERVER['HTTP_USER_AGENT'])) ? $_SERVER['HTTP_USER_AGENT'] : exec("hostname");

        $bname = 'Unknown';
        $platform = 'Unknown';
        $version = "";

        if (preg_match('/linux/i', $u_agent)) {
            $platform = 'linux';
        } elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
            $platform = 'mac';
        } elseif (preg_match('/windows|win32/i', $u_agent)) {
            $platform = 'windows';
        }

        $ub = "";

        if (preg_match('/MSIE/i', $u_agent) && !preg_match('/Opera/i', $u_agent)) {
            $bname = 'Internet Explorer';
            $ub = "MSIE";
        } elseif (preg_match('/Firefox/i', $u_agent)) {
            $bname = 'Mozilla Firefox';
            $ub = "Firefox";
        } elseif (preg_match('/Chrome/i', $u_agent)) {
            $bname = 'Google Chrome';
            $ub = "Chrome";
        } elseif (preg_match('/Safari/i', $u_agent)) {
            $bname = 'Apple Safari';
            $ub = "Safari";
        } elseif (preg_match('/Opera/i', $u_agent)) {
            $bname = 'Opera';
            $ub = "Opera";
        } elseif (preg_match('/Netscape/i', $u_agent)) {
            $bname = 'Netscape';
            $ub = "Netscape";
        }

        $webkit = "unknown";
//        if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'webkit') !== false) {
        if (strpos(strtolower($u_agent), 'webkit') !== false) {
            $webkit = "webkit";
        }

        $known = array('Version', $ub, 'other');
        $pattern = '#(?<browser>' . join('|', $known) .
                ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
        if (!preg_match_all($pattern, $u_agent, $matches)) {
// we have no matching number just continue
        }

        $i = count($matches['browser']);
        if ($i != 1) {
            if (strripos($u_agent, "Version") < strripos($u_agent, $ub)) {
                $version = $matches['version'][0];
            } else {
                $version = $matches['version'][1];
            }
        } else {
            $version = $matches['version'][0];
        }

        if ($version == null || $version == "") {
            $version = "?";
        }

        return array(
            'webkit' => $webkit,
            'userAgent' => $u_agent,
            'name' => $bname,
            'version' => $version,
            'platform' => $platform,
            'pattern' => $pattern
        );
    }

    public static function findNumberIntoText($text, $quote = "") {
        if ($quote == "") {
            $findme = ':';
        } else {
            $findme = $quote;
        }
        $pos = strpos($text, $findme);
        $pos1 = strrpos($text, $findme);

        if ($pos === false) {
            return null;
        } else if ($pos == $pos1) {
            return null;
        } else {
            $val = substr($text, $pos + 1, $pos1 - $pos - 1);
            if (is_numeric($val)) {
                return $val;
            }
        }
        return null;
    }

    public static function getKeysFromArray($array) {
        $result = array();
        foreach ($array as $sub) {
            $result = array_merge($result, $sub);
        }
        return array_keys($result);
    }

    public static function writeToFile($data, $mode = "", $file = "") {
        if ($mode == "") {
            $mode = "a+";
        }
        if ($file == "") {
            $file = dirname(__FILE__) . "/cache/log";
        }
        $fp = fopen($file, $mode);
        fwrite($fp, $data);
        fclose($fp);
    }

    public static function readConfig() {

        if (!file_exists(dirname(__FILE__) . "/dev/config")) {
            return "";
        }
        if (!is_writable(dirname(__FILE__) . "/dev/config")) {
            return "";
        }
        $config = file_get_contents(dirname(__FILE__) . "/dev/config");
        return json_decode($config, true);
    }

    public static function writeOnConfig($config) {
        file_put_contents(dirname(__FILE__) . "/dev/config", json_encode($config));
    }

    public static function writeConf($p) {
        if (!is_writable(dirname(__FILE__) . "/dev/config")) {
            return false;
        }
        NWUtils::writeOnConfig($p);
        return true;
    }
}
