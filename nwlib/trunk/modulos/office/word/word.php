<?php

$ruta = "http://nwadmin3.loc" . $_GET["archivo"];
echo $ruta;

/* * *************************************************************** 
  This approach uses detection of NUL (chr(00)) and end line (chr(13))
  to decide where the text is:
  - divide the file contents up by chr(13)
  - reject any slices containing a NUL
  - stitch the rest together again
  - clean up with a regular expression
 * *************************************************************** */

function parseWord($userDoc) {
    $fileHandle = fopen($userDoc, "r");
    $line = @fread($fileHandle, filesize($userDoc));
    $lines = explode(chr(0x0D), $line);
    $outtext = "";
    foreach ($lines as $thisline) {
        $pos = strpos($thisline, chr(0x00));
        if (($pos !== FALSE) || (strlen($thisline) == 0)) {
            
        } else {
            $outtext .= $thisline . " ";
        }
    }
    $outtext = preg_replace("/[^a-zA-Z0-9\s\,\.\-\n\r\t@\/\_\(\)]/", "", $outtext);
    return $outtext;
}

$userDoc = $ruta;
$text = parseWord($userDoc);
echo $text;


return;
//Microsoft WORD - PHP Viewer 
$fp = fopen($ruta, "r");  //$ruta es nuestro archivo .doc 

$char = fgetc($fp);
$charant = NULL;
$cantNull = 0;


//Tomamos 120 Nulos seguidos , siendo un nulo en PHP: \0 
while ($cantNull < 120) {
    $char = fgetc($fp);

    if ($char == "\0" && $charant == "\0") {
        $cantNull += 1;
    } else {
        $cantNull = 0;
    }

    $charant = $char;
}

//Tomamos los nulos sobrantes hasta encontrar otro caracter 
$text = "\0";
while ($text == "\0") {
    $text = fgetc($fp);
}

//Imprimimos hasta que encuentre otro Null 
echo $text;
while ($text != "\0") {
    $text = fgetc($fp);
    echo nl2br($text);  //nl2br convierte los saltos de linea en <br /> 
}
?>