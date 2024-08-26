<?php

function clean_html($html) {
    $out = strip_tags($html);
    $out = htmlspecialchars($out);
    return $out;
}

function cargarCSS($hoja, $div) {
    ?>
    <script type="text/javascript"> 
        //<![CDATA[ 
        if(document.createStyleSheet) { 
            document.createStyleSheet('<?php echo $hoja; ?>'); 
        } 
        else { 
            var styles = "<?php echo $hoja; ?>"; 
            var newSS=document.createElement('link'); 
            newSS.rel='stylesheet'; 
            newSS.type='text/css'; 
            newSS.href=styles; 
            //$("#<?php echo $div; ?>").append(newSS);
            document.getElementsByTagName("<?php echo $div; ?>")[0].appendChild(newSS); 
        } 
        //]]> 
    </script>
    <?php
}

function limpiar_acentos($s) {
    $s = ereg_replace("[áàâãª]", "a", $s);
    $s = ereg_replace("[ÁÀÂÃ]", "A", $s);
    $s = ereg_replace("[ÍÌÎ]", "I", $s);
    $s = ereg_replace("[íìî]", "i", $s);
    $s = ereg_replace("[éèê]", "e", $s);
    $s = ereg_replace("[ÉÈÊ]", "E", $s);
    $s = ereg_replace("[óòôõº]", "o", $s);
    $s = ereg_replace("[ÓÒÔÕ]", "O", $s);
    $s = ereg_replace("[úùû]", "u", $s);
    $s = ereg_replace("[ÚÙÛ]", "U", $s);
    $s = str_replace("ç ", "c ", $s);
    $s = str_replace("Ç ", "C ", $s);
    $s = str_replace("[ñ]", "n", $s);
    $s = str_replace("[Ñ]", "N", $s);

    return $s;
}

function limpiar_acentos_1($variable) {
    $vocalti = array("á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú");
    $vocales = array("a", "e", "i", "o", "u", "A", "E", "I", "O", "U");

    str_replace($vocalti, $vocales, $variable);
}

function moneda($valor) {
    setlocale(LC_MONETARY, 'es_CO');
    return money_format('%(#10n', $valor);
}

function php_atras() {
    ?>
    <script>
        function atras ()
        {
            history.go(-1)
        }
    </script>
    <?php
}

function cambiar_titulo($titulo) {
    ?>
    <script type="text/javascript" >
        document.title ="<?php echo $titulo; ?>";
        meta = document.getElementsByTagName("meta");
        meta[2].content = "<?php echo $titulo; ?>";
        meta[4].content = "<?php echo $titulo; ?>";
    </script>
    <?php
}

function cambiar_descripcion($descripcion) {
    ?>
    <script type="text/javascript" >
        meta = document.getElementsByTagName("meta");
        meta[3].content = "<?php echo $descripcion; ?>";
        meta[5].content = "<?php echo $descripcion; ?>";
    </script>
    <?php
}

function noCache() {

    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
}

function php_atras2() {
    ?>
    <script>
        function atras2 ()
        {
            history.go(-2)
        }
    </script>
    <?php
}

function php_parent_location($url) {
    ?>
    <script>window.opener.location='<?php echo $url; ?>';</script>
    <?php
}

function alert($msg) {
    ?>
    <script type="text/javascript"> alert('<?php echo $msg; ?>');</script>
    <?php
}

function php_location($url) {
    ?>
    <script type="text/javascript" >location='<?php echo $url; ?>';</script>
    <?php
}

function php_OpenWindow($url, $width, $height) {
    ?>
    <script>window.open('<?php echo $url;
    ?>','','width=<?php echo $width; ?>,height=<?php echo $height; ?>,location=no, menubar=no, status=no, toolbar=no, scrollbars=yes, resizable=yes');</script>
    <?php
}

function php_CloseWindow() {
    ?>
    <script language="JavaScript">window.close();</script>
    <?php
}

function php_javascript($code) {
    ?>
    <script><?php echo $code;
    ?></script>
    <?php
}

function fecha() {
    $mes = date("n");
    $mesArray = array(
        1 => "Enero",
        2 => "Febrero",
        3 => "Marzo",
        4 => "Abril",
        5 => "Mayo",
        6 => "Junio",
        7 => "Julio",
        8 => "Agosto",
        9 => "Septiembre",
        10 => "Octubre",
        11 => "Noviembre",
        12 => "Diciembre"
    );

    $semana = date("D");
    $semanaArray = array(
        "Mon" => "Lunes",
        "Tue" => "Martes",
        "Wed" => "Miercoles",
        "Thu" => "Jueves",
        "Fri" => "Viernes",
        "Sat" => "Sabado",
        "Sun" => "Domingo",
    );

    $mesReturn = $mesArray[$mes];
    $semanaReturn = $semanaArray[$semana];
    $dia = date("d");
    $año = date("Y");

    return $semanaReturn . " " . $dia . " de " . $mesReturn . " de " . $año;
}

function sumaDia($fecha, $dia) {
    list($year, $mon, $day) = explode('/', $fecha);
    return date('Y/m/d', mktime(0, 0, 0, $mon, $day + $dia, $year));
}

function sumaAno($fecha, $ano) {
    list($year, $mon, $day) = explode('/', $fecha);
    return date('Y/m/d', mktime(0, 0, 0, $mon, $day, $year + $ano));
}

function hora() {
    $hora = date("H");
    $minuto = date("i");
    $segundo = date("s");
    $hora = $hora . ":" . $minuto . ":" . $segundo;
    return $hora;
}

function fecha1() {
    $ano = date("Y");
    $mes = date("m");
    $dia = date("d");
    $fecha1 = $ano . "-" . $mes . "-" . $dia;
    return $fecha1;
}

function clrAll($str) {
    $str = str_replace("&", "&", $str);
    $str = str_replace("'", "'", $str);
    $str = str_replace(">", ">", $str);
    $str = str_replace("<", "<", $str);
    return $str;
}

function validar_email_dsn($email) {

    $exp = "^[a-z'0-9]+([._-][a-z'0-9]+)*@([a-z0-9]+([._-][a-z0-9]+))+$";

    if (preg_match('/'.$exp.'/i', $email)) {

        if (checkdnsrr(array_pop(explode("@", $email)), "MX")) {
            return true;
        } else {
            return false;
        }
    } else {

        return false;
    }
}

function comprobar_email($email) {
    //compruebo unas cosas primeras
    if ((strlen($email) >= 6) && (substr_count($email, "@") == 1) && (substr($email, 0, 1) != "@") && (substr($email, strlen($email) - 1, 1) != "@")) {
        if ((!strstr($email, "'")) && (!strstr($email, "\"")) && (!strstr($email, "\\")) && (!strstr($email, "\$")) && (!strstr($email, " "))) {
            //miro si tiene caracter .
            if (substr_count($email, ".") >= 1) {
                //obtengo la terminacion del dominio
                $term_dom = substr(strrchr($email, '.'), 1);
                //compruebo que la terminación del dominio sea correcta
                if (strlen($term_dom) > 1 && strlen($term_dom) < 5 && (!strstr($term_dom, "@"))) {
                    //compruebo que lo de antes del dominio sea correcto
                    $antes_dom = substr($email, 0, strlen($email) - strlen($term_dom) - 1);
                    $caracter_ult = substr($antes_dom, strlen($antes_dom) - 1, 1);
                    if ($caracter_ult != "@" && $caracter_ult != ".") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }
}

function tipo_documento() {
    ?>
    <select id="pais_contacto" name="pais_contacto" class="selects">
        <option value="CC" >CC</option>
        <option value="Tarjeta" >Tarjeta</option>
    </select>
       <?php
}

function paises() {
    ?>
    <select id="pais_contacto" name="pais_contacto" class="selects">
        <option value="AF" >Afganistán</option>
        <option value="AL" >Albania</option>
        <option value="DZ" >Argelia</option>
        <option value="AS" >Samoa Americana</option>
        <option value="AD" >Andorra</option>
        <option value="AO" >Angola</option>
        <option value="AI" >Anguilla</option>
        <option value="AQ" >Antártida</option>
        <option value="AG" >Antigua y Barbuda</option>
        <option value="AR" >Argentina</option>
        <option value="AM" >Armenia</option>
        <option value="AW" >Aruba</option>
        <option value="AU" >Australia</option>
        <option value="AT" >Austria</option>
        <option value="AZ" >Azerbaiyán</option>
        <option value="BS" >Bahamas</option>
        <option value="BH" >Bahrein</option>
        <option value="BD" >Bangladesh</option>
        <option value="BB" >Barbados</option>
        <option value="BY" >Bielorrusia</option>
        <option value="BE" >Bélgica</option>
        <option value="BZ" >Belice</option>
        <option value="BJ" >Benin</option>
        <option value="BM" >Bermudas</option>
        <option value="BT" >Bután</option>
        <option value="BO" >Bolivia</option>
        <option value="BA" >Bosnia y Herzegovina</option>
        <option value="BW" >Botswana</option>
        <option value="BV" >Isla Bouvet</option>
        <option value="BR" >Brasil</option>
        <option value="IO" >T británicos oc. Índico</option>
        <option value="BN" >Brunei</option>
        <option value="BG" >Bulgaria</option>
        <option value="BF" >Burkina Faso</option>
        <option value="BI" >Burundi</option>
        <option value="KH" >Camboya</option>
        <option value="CM" >Camerún</option>
        <option value="CA" >Canadá</option>
        <option value="CV" >Cabo Verde</option>
        <option value="KY" >Islas Caimán</option>
        <option value="CF" >República Centroafricana</option>
        <option value="TD" >Chad</option>
        <option value="CL" >Chile</option>
        <option value="CN" >China</option>
        <option value="CX" >Isla de Christmas</option>
        <option value="CC" >Islas de Cocos o Keeling</option>
        <option value="CO" selected >Colombia</option>
        <option value="KM" >Comores</option>
        <option value="CG" >Congo</option>
        <option value="CD" >Congo, República Democrática</option>
        <option value="CK" >Islas Cook</option>
        <option value="CR" >Costa Rica</option>
        <option value="CI" >Costa de Marfíl</option>
        <option value="HR" >Croacia (Hrvatska)</option>
        <option value="CU" >Cuba</option>
        <option value="CY" >Chipre</option>
        <option value="CZ" >República Checa</option>
        <option value="DK" >Dinamarca</option>
        <option value="DJ" >Djibouti</option>
        <option value="DM" >Dominica</option>
        <option value="DO" >República Dominicana</option>
        <option value="TP" >Timor Oriental</option>
        <option value="EC" >Ecuador</option>
        <option value="EG" >Egipto</option>
        <option value="SV" >El Salvador</option>
        <option value="GQ" >Guinea Ecuatorial</option>
        <option value="ER" >Eritrea</option>
        <option value="EE" >Estonia</option>
        <option value="ET" >Etiopía</option>
        <option value="FK" >Islas Malvinas</option>
        <option value="FO" >Islas Faroe</option>
        <option value="FJ" >Fiji</option>
        <option value="FI" >Finlandia</option>
        <option value="FR" >Francia</option>
        <option value="GF" >Guayana Francesa</option>
        <option value="PF" >Polinesia Francesa</option>
        <option value="TF" >T. franceses del Sur</option>
        <option value="GA" >Gabón</option>
        <option value="GM" >Gambia</option>
        <option value="GE" >Georgia</option>
        <option value="DE" >Alemania</option>
        <option value="GH" >Ghana</option>
        <option value="GI" >Gibraltar</option>
        <option value="GR" >Grecia</option>
        <option value="GL" >Groenlandia</option>
        <option value="GD" >Granada</option>
        <option value="GP" >Guadalupe</option>
        <option value="GU" >Guam</option>
        <option value="GT" >Guatemala</option>
        <option value="GN" >Guinea</option>
        <option value="GW" >Guinea-Bissau</option>
        <option value="GY" >Guayana</option>
        <option value="HT" >Haití</option>
        <option value="HM" >Islas Heard y McDonald</option>
        <option value="HN" >Honduras</option>
        <option value="HK" >Hong Kong</option>
        <option value="HU" >Hungría</option>
        <option value="IS" >Islandia</option>
        <option value="IN" >India</option>
        <option value="ID" >Indonesia</option>
        <option value="IR" >Irán</option>
        <option value="IQ" >Irak</option>
        <option value="IE" >Irlanda</option>
        <option value="IL" >Israel</option>
        <option value="IT" >Italia</option>
        <option value="JM" >Jamaica</option>
        <option value="JP" >Japón</option>
        <option value="JO" >Jordania</option>
        <option value="KZ" >Kazajistán</option>
        <option value="KE" >Kenia</option>
        <option value="KI" >Kiribati</option>
        <option value="KR" >Corea</option>
        <option value="KP" >Corea del Norte</option>
        <option value="KW" >Kuwait</option>
        <option value="KG" >Kirguizistán</option>
        <option value="LA" >Laos</option>
        <option value="LV" >Letonia</option>
        <option value="LB" >Líbano</option>
        <option value="LS" >Lesotho</option>
        <option value="LR" >Liberia</option>
        <option value="LY" >Libia</option>
        <option value="LI" >Liechtenstein</option>
        <option value="LT" >Lituania</option>
        <option value="LU" >Luxemburgo</option>
        <option value="MO" >Macao</option>
        <option value="MG" >Madagascar</option>
        <option value="MW" >Malawi</option>
        <option value="MY" >Malasia</option>
        <option value="MV" >Maldivas</option>
        <option value="ML" >Malí</option>
        <option value="MT" >Malta</option>
        <option value="MH" >Islas Marshall</option>
        <option value="MQ" >Martinica</option>
        <option value="MR" >Mauritania</option>
        <option value="MU" >Mauricio</option>
        <option value="YT" >Mayotte</option>
        <option value="MX" >México</option>
        <option value="FM" >Micronesia</option>
        <option value="MD" >Moldavia</option>
        <option value="MC" >Mónaco</option>
        <option value="MN" >Mongolia</option>
        <option value="MS" >Montserrat</option>
        <option value="MA" >Marruecos</option>
        <option value="MZ" >Mozambique</option>
        <option value="MM" >Birmania</option>
        <option value="NA" >Namibia</option>
        <option value="NR" >Nauru</option>
        <option value="NP" >Nepal</option>
        <option value="AN" >Antillas Holandesas</option>
        <option value="NL" >Países Bajos</option>
        <option value="NC" >Nueva Caledonia</option>
        <option value="NZ" >Nueva Zelanda</option>
        <option value="NI" >Nicaragua</option>
        <option value="NE" >Níger</option>
        <option value="NG" >Nigeria</option>
        <option value="NU" >Niue</option>
        <option value="NF" >Norfolk</option>
        <option value="MP" >Islas Marianas del Norte</option>
        <option value="NO" >Noruega</option>
        <option value="OM" >Omán</option>
        <option value="PK" >Paquistán</option>
        <option value="PW" >Islas Palau</option>
        <option value="PA" >Panamá</option>
        <option value="PG" >Papúa Nueva Guinea</option>
        <option value="PY" >Paraguay</option>
        <option value="PE" >Perú</option>
        <option value="PH" >Filipinas</option>
        <option value="PN" >Pitcairn</option>
        <option value="PL" >Polonia</option>
        <option value="PT" >Portugal</option>
        <option value="PR" >Puerto Rico</option>
        <option value="QA" >Qatar</option>
        <option value="RE" >Reunión</option>
        <option value="RO" >Rumania</option>
        <option value="RU" >Rusia</option>
        <option value="RW" >Ruanda</option>
        <option value="SH" >Santa Helena</option>
        <option value="KN" >Saint Kitts y Nevis</option>
        <option value="LC" >Santa Lucía</option>
        <option value="PM" >St. Pierre y Miquelon</option>
        <option value="VC" >San Vicente y Granadinas</option>
        <option value="WS" >Samoa</option>
        <option value="SM" >San Marino</option>
        <option value="ST" >Santo Tomé y Príncipe</option>
        <option value="SA" >Arabia Saudí</option>
        <option value="SN" >Senegal</option>
        <option value="SC" >Seychelles</option>
        <option value="SL" >Sierra Leona</option>
        <option value="SG" >Singapur</option>
        <option value="SK" >República Eslovaca</option>
        <option value="SI" >Eslovenia</option>
        <option value="SB" >Islas Salomón</option>
        <option value="SO" >Somalia</option>
        <option value="ZA" >República de Sudáfrica</option>
        <option value="ES" >España</option>
        <option value="LK" >Sri Lanka</option>
        <option value="SD" >Sudán</option>
        <option value="SR" >Surinam</option>
        <option value="SJ" >Islas Svalbard y Jan Mayen</option>
        <option value="SZ" >Suazilandia</option>
        <option value="SE" >Suecia</option>
        <option value="CH" >Suiza</option>
        <option value="SY" >Siria</option>
        <option value="TW" >Taiwán</option>
        <option value="TJ" >Tayikistán</option>
        <option value="TZ" >Tanzania</option>
        <option value="TH" >Tailandia</option>
        <option value="TG" >Togo</option>
        <option value="TK" >Islas Tokelau</option>
        <option value="TO" >Tonga</option>
        <option value="TT" >Trinidad y Tobago</option>
        <option value="TN" >Túnez</option>
        <option value="TR" >Turquía</option>
        <option value="TM" >Turkmenistán</option>
        <option value="TC" >Islas Turks y Caicos</option>
        <option value="TV" >Tuvalu</option>
        <option value="UG" >Uganda</option>
        <option value="UA" >Ucrania</option>
        <option value="AE" >Emiratos Árabes Unidos</option>
        <option value="UK" >Reino Unido</option>
        <option value="US" >Estados Unidos</option>
        <option value="UM" >Islas menores de USA</option>
        <option value="UY" >Uruguay</option>
        <option value="UZ" >Uzbekistán</option>
        <option value="VU" >Vanuatu</option>
        <option value="VA" >Ciudad del Vaticano (Santa Sede)</option>
        <option value="VE" >Venezuela</option>
        <option value="VN" >Vietnam</option>
        <option value="VG" >Islas Vírgenes (Reino Unido)</option>
        <option value="VI" >Islas Vírgenes (EE.UU.)</option>
        <option value="WF" >Islas Wallis y Futuna</option>
        <option value="YE" >Yemen</option>
        <option value="YU" >Yugoslavia</option>
        <option value="ZM" >Zambia</option>
        <option value="ZW" >Zimbabue</option>
    </select>
    <?php
}

function filedata($path) {
    // Vaciamos la caché de lectura de disco
    clearstatcache();
    // Comprobamos si el fichero existe
    $data["exists"] = is_file($path);
    // Comprobamos si el fichero es escribible
    $data["writable"] = is_writable($path);
    // Leemos los permisos del fichero
    $data["chmod"] = ($data["exists"] ? substr(sprintf("%o", fileperms($path)), -4) : FALSE);
    // Extraemos la extensión, un sólo paso
    $data["ext"] = substr(strrchr($path, "."), 1);
    // Primer paso de lectura de ruta
    $data["path"] = array_shift(explode("." . $data["ext"], $path));
    // Primer paso de lectura de nombre
    $data["name"] = array_pop(explode("/", $data["path"]));
    // Ajustamos nombre a FALSE si está vacio
    $data["name"] = ($data["name"] ? $data["name"] : FALSE);
    // Ajustamos la ruta a FALSE si está vacia
    $data["path"] = ($data["exists"] ? ($data["name"] ? realpath(array_shift(explode($data["name"], $data["path"]))) : realpath(array_shift(explode($data["ext"], $data["path"])))) : ($data["name"] ? array_shift(explode($data["name"], $data["path"])) : ($data["ext"] ? array_shift(explode($data["ext"], $data["path"])) : rtrim($data["path"], "/"))));
    // Ajustamos el nombre a FALSE si está vacio o a su valor en caso contrario
    $data["filename"] = (($data["name"] OR $data["ext"]) ? $data["name"] . ($data["ext"] ? "." : "") . $data["ext"] : FALSE);
    // Devolvemos los resultados
    return $data;
}

function strip_word_html($text, $allowed_tags = '') {//<b><i><sup><sub><em><strong><u><br>
    mb_regex_encoding('UTF-8');
    //replace MS special characters first
    $search = array('/&lsquo;/u', '/&rsquo;/u', '/&ldquo;/u', '/&rdquo;/u', '/&mdash;/u');
    $replace = array('\'', '\'', '"', '"', '-');
    $text = preg_replace($search, $replace, $text);
    //make sure _all_ html entities are converted to the plain ascii equivalents - it appears
    //in some MS headers, some html entities are encoded and some aren't
    $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
    //try to strip out any C style comments first, since these, embedded in html comments, seem to
    //prevent strip_tags from removing html comments (MS Word introduced combination)
    if (mb_stripos($text, '/*') !== FALSE) {
        $text = mb_eregi_replace('#/\*.*?\*/#s', '', $text, 'm');
    }
    //introduce a space into any arithmetic expressions that could be caught by strip_tags so that they won't be
    //'<1' becomes '< 1'(note: somewhat application specific)
    $text = preg_replace(array('/<([0-9]+)/'), array('< $1'), $text);
    $text = strip_tags($text, $allowed_tags);
    //eliminate extraneous whitespace from start and end of line, or anywhere there are two or more spaces, convert it to one
    $text = preg_replace(array('/^\s\s+/', '/\s\s+$/', '/\s\s+/u'), array('', '', ' '), $text);
    //strip out inline css and simplify style tags
    $search = array('#<(strong|b)[^>]*>(.*?)</(strong|b)>#isu', '#<(em|i)[^>]*>(.*?)</(em|i)>#isu', '#<u[^>]*>(.*?)</u>#isu');
    $replace = array('<b>$2</b>', '<i>$2</i>', '<u>$1</u>');
    $text = preg_replace($search, $replace, $text);
    //on some of the ?newer MS Word exports, where you get conditionals of the form 'if gte mso 9', etc., it appears
    //that whatever is in one of the html comments prevents strip_tags from eradicating the html comment that contains
    //some MS Style Definitions - this last bit gets rid of any leftover comments */
    $num_matches = preg_match_all("/\<!--/u", $text, $matches);
    if ($num_matches) {
        $text = preg_replace('/\<!--(.)*--\>/isu', '', $text);
    }
    return $text;
}

function truncate($text, $length = 100, $ending = '...', $exact = true, $considerHtml = false) {
    if ($considerHtml) {
        // if the plain text is shorter than the maximum length, return the whole text
        if (strlen(preg_replace('/<.*?>/', '', $text)) <= $length) {
            return $text;
        }

        // splits all html-tags to scanable lines
        preg_match_all('/(<.+?>)?([^<>]*)/s', $text, $lines, PREG_SET_ORDER);

        $total_length = strlen($ending);
        $open_tags = array();
        $truncate = '';

        foreach ($lines as $line_matchings) {
            // if there is any html-tag in this line, handle it and add it (uncounted) to the output
            if (!empty($line_matchings[1])) {
                // if it's an "empty element" with or without xhtml-conform closing slash (f.e. <br/>)
                if (preg_match('/^<(\s*.+?\/\s*|\s*(img|br|input|hr|area|base|basefont|col|frame|isindex|link|meta|param)(\s.+?)?)>$/is', $line_matchings[1])) {
                    // do nothing
                    // if tag is a closing tag (f.e. </b>)
                } else if (preg_match('/^<\s*\/([^\s]+?)\s*>$/s', $line_matchings[1], $tag_matchings)) {
                    // delete tag from $open_tags list
                    $pos = array_search($tag_matchings[1], $open_tags);
                    if ($pos !== false) {
                        unset($open_tags[$pos]);
                    }
                    // if tag is an opening tag (f.e. <b>)
                } else if (preg_match('/^<\s*([^\s>!]+).*?>$/s', $line_matchings[1], $tag_matchings)) {
                    // add tag to the beginning of $open_tags list
                    array_unshift($open_tags, strtolower($tag_matchings[1]));
                }
                // add html-tag to $truncate'd text
                $truncate .= $line_matchings[1];
            }

            // calculate the length of the plain text part of the line; handle entities as one character
            $content_length = strlen(preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', ' ', $line_matchings[2]));
            if ($total_length + $content_length > $length) {
                // the number of characters which are left
                $left = $length - $total_length;
                $entities_length = 0;
                // search for html entities
                if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', $line_matchings[2], $entities, PREG_OFFSET_CAPTURE)) {
                    // calculate the real length of all entities in the legal range
                    foreach ($entities[0] as $entity) {
                        if ($entity[1] + 1 - $entities_length <= $left) {
                            $left--;
                            $entities_length += strlen($entity[0]);
                        } else {
                            // no more characters left
                            break;
                        }
                    }
                }
                $truncate .= substr($line_matchings[2], 0, $left + $entities_length);
                // maximum lenght is reached, so get off the loop
                break;
            } else {
                $truncate .= $line_matchings[2];
                $total_length += $content_length;
            }

            // if the maximum length is reached, get off the loop
            if ($total_length >= $length) {
                break;
            }
        }
    } else {
        if (strlen($text) <= $length) {
            return $text;
        } else {
            $truncate = substr($text, 0, $length - strlen($ending));
        }
    }

    // if the words shouldn't be cut in the middle...
    if (!$exact) {
        // ...search the last occurance of a space...
        $spacepos = strrpos($truncate, ' ');
        if (isset($spacepos)) {
            // ...and cut the text in this position
            $truncate = substr($truncate, 0, $spacepos);
        }
    }

    // add the defined ending to the text
    $truncate .= $ending;

    if ($considerHtml) {
        // close all unclosed html-tags
        foreach ($open_tags as $tag) {
            $truncate .= '</' . $tag . '>';
        }
    }

    return $truncate;
}

function limpiarCadena($cadena) {
    $cadena = explode(" ", $cadena);
    $i = 0; 
    $cadenas = "";
    while ($i < count($cadena)) { 
        if ($cadena[$i] != "") {
            $cadenas = $cadenas . trim($cadena[$i]) . " ";
        }
        $i++;
    }
    return trim($cadenas);
}

function fecha_esp($fecha) {

    $mes = date("n", $fecha);
    $mesArray = array(
        1 => "Enero",
        2 => "Febrero",
        3 => "Marzo",
        4 => "Abril",
        5 => "Mayo",
        6 => "Junio",
        7 => "Julio",
        8 => "Agosto",
        9 => "Septiembre",
        10 => "Octubre",
        11 => "Noviembre",
        12 => "Diciembre"
    );

    $semana = date("D", $fecha);
    $semanaArray = array(
        "Mon" => "Lunes",
        "Tue" => "Martes",
        "Wed" => "Miercoles",
        "Thu" => "Jueves",
        "Fri" => "Viernes",
        "Sat" => "Sabado",
        "Sun" => "Domingo",
    );

    $mesReturn = $mesArray[$mes];
    $semanaReturn = $semanaArray[$semana];
    $dia = date("d", $fecha);
    $año = date("Y", $fecha);

    return $semanaReturn . " " . $dia . " de " . $mesReturn . " de " . $año;
}

function fecha_alternativa($fecha) {

    $mes = date("n", $fecha);
    $mesArray = array(
        1 => "Ene",
        2 => "Feb",
        3 => "Mar",
        4 => "Abr",
        5 => "May",
        6 => "Jun",
        7 => "Jul",
        8 => "Ago",
        9 => "Sep",
        10 => "Oct",
        11 => "Nov",
        12 => "Dic"
    );

    $semana = date("D", $fecha);
    $semanaArray = array(
        "Mon" => "Lunes",
        "Tue" => "Martes",
        "Wed" => "Miercoles",
        "Thu" => "Jueves",
        "Fri" => "Viernes",
        "Sat" => "Sabado",
        "Sun" => "Domingo",
    );

    $mesReturn = $mesArray[$mes];
    $semanaReturn = $semanaArray[$semana];
    $dia = date("d", $fecha);
    $año = date("Y", $fecha);

    return $mesReturn . " " . $dia . " " . $año;
}

function file_get_contents_curl($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
    curl_setopt($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}
?>