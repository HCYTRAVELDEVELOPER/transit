<?php

class nw_file_manager {

    public static function changeName($p) {
        $nuevo = str_replace($p["nombre_anterior"], $p["nombre_nuevo"], $p["ruta"]);
        if ($p["extension"] == "") {
            rename($p["ruta"], $nuevo);
        } else {
            rename($p["ruta"], $nuevo . "." . $p["extension"]);
        }
    }

    public static function saveEditFile($p) {
        session::check();
        $filename = $p["ruta"];
        $content = $p["texto"];
//        chmod("/var/www/nwproject5/rpcsrv", 0777);
//        chmod($filename, 0777);
//        $aux=echo "admin-pass" | chmod($filename, 0777);
//        $r = echo "alexf23" | sudo -u root -S chmod(' . $filename . ', 0777) ";
        if (@chmod($filename, 0777)) {
            return "Permiso 777 dado al archivo " . $filename . ", corra denuevo el script para seguir su función";
        } else {
            return "No se pudo dar Permisos al archivo " . $filename . "";
        }
        if (is_writable($filename)) {
            $fp = fopen($p["ruta"], "w");
            fputs($fp, $p["texto"]);
            fclose($fp);
            return "Puedes escribir en el directorio $filename";
//            $f = file_put_contents($filename, $content);
        } else {
            return "NO Puedes escribir en el directorio $filename";
        }
//        $archivDos = fopen($filename . "des", 'w');
//        $erroDos = 0;
//        if (!isset($archivDos)) {
//            $erroDos = 1;
//            print "No se ha podido crear/abrir el archivo $filename<br />";
//        } else
//        if (!fwrite($archivDos, $p["texto"])) {
//            $erroDos = 1;
//            print "No se ha podido escribir en el archivo $filename <br />";
//        }
//        @fclose();
//        if ($erroDos == 0) {
//            print "Datos actualizados $archivDos.<br />";
//            print "<a href=/asistente\">Volver</a><br />";
//        }
//        $fp = fopen($p["ruta"], "r");
//        $fp = fopen($p["ruta"], "w");
//        fputs($fp, $p["texto"]);
//        fclose($fp);
//        $nuevoarchivo = fopen($p["ruta"], "a");
//        $nuevoarchivo = fopen("ftp://alexf:alexf23@nwp5.loc/{$p["ruta"]}", "w");
//        fwrite($nuevoarchivo, $p["texto"]);
//        fclose($nuevoarchivo);
//        function mk_file($filename) {
//            if (is_file($filename)) {
//                fclose(fopen($filename, "x")); //create the file and close it
//                return true;
//            }
//            else
//                return false; //file already exists
//        }
    }

    public static function readFile($file) {
        session::check();
        $nombre_fichero = $file;
        $fichero_texto = fopen($nombre_fichero, "r");
        //Debido a filesize(), sólo funcionará con archivos de texto
        $contenido_fichero = fread($fichero_texto, filesize($nombre_fichero));
        return $contenido_fichero;
    }

    public static function consulta_carpet_initial() {
        session::check();
        $dir = $_SERVER["DOCUMENT_ROOT"] . "/imagenes";
        $dir = str_replace("//", "/", $dir);
        return $dir;
    }

    public static function extensions_array($type) {
        switch ($type) {
            case "img":
                return Array("jpg", "JPG", "PNG", "png", "jpeg", "JPEG");
                break;
            case "flash":
                return Array("swf", "SWF");
                break;
            case "gif":
                return Array("gif", "GIF");
                break;
            case "pdf":
                return Array("pdf", "PDF");
                break;

            default:
                break;
        }
    }

    public static function consulta_tree($p) {
        session::check();
        $carpet = "";
        if (isset($p["carpet"])) {
            if ($p["carpet"] != "undefined") {
                $carpet = $p["carpet"] . "/";
            }
        }
        $array = array();
        if (version_compare(PHP_VERSION, '5.0.0', '<')) {
            $directorio = @opendir($carpet);
            if (!$directorio) {
                NWJSonRpcServer::information("No se encontró la ruta");
                return;
            }
            $archivos = Array();
            $counter = 0;
            while (false !== ($archivo = readdir($directorio))) {
                $archivos[] = $archivo;
                $i = 0;
                foreach ($archivos as $archivo) {

                    $partes_ruta = pathinfo($carpet . $archivo);

                    if ($p["buscar"] != "") {
                        if (strrpos($partes_ruta['basename'], $p["buscar"]) === false) {
                            if (isset($partes_ruta['extension']) && $partes_ruta['extension'] != "") {
                                continue;
                            }
                        }
                    }

                    $array[$i]["ruta"] = $carpet . $archivo;
                    if (isset($partes_ruta['extension'])) {
                        if (isset($p["type"]) && $p["type"] != "todos") {
                            $exts = self::extensions_array($p["type"]);
                            if (array_search($partes_ruta['extension'], $exts) === false) {
                                continue;
                            }
                        }
                        $array[$i]["extension"] = $partes_ruta['extension'];
                    } else {
                        $array[$i]["extension"] = "";
                    }
                    if (isset($partes_ruta['basename']) && $partes_ruta['basename'] != ".") {
                        $array[$i]["nombre"] = $partes_ruta['basename'];
                    } else {
                        $array[$i]["nombre"] = "{$archivo}";
                    }
                    $array[$i]["relative_path"] = str_replace($_SERVER["DOCUMENT_ROOT"], "/", $carpet . $archivo);
                    $array[$i]["datetime"] = date("Y-M-d H:i:s", filemtime($carpet . $archivo));
                    $array[$i]["size"] = NWUtils::getHumanReadableSize(filesize($carpet . $archivo));
                    $array[$i]["filetype"] = filetype($carpet . $archivo);
                    $array[$i]["dirInitial"] = $_SERVER["DOCUMENT_ROOT"];
                    $array[$i]["permissions"] = 0;
                    //$array[$i]["permissions"] = NWUtils::getPermissionsFromFile($carpet . $archivo);
                    //$ow = posix_getpwuid(fileowner($carpet . $archivo));
                    //$array[$i]["owner"] = isset($ow["name"]) ? $ow["name"] : "";
                    $array[$i]["owner"] = "www-data";
                    $i++;
                    $counter = 0;
                }
                reset($archivos);
            }
            closedir($directorio);
        } else {
            $directorio = @scandir($carpet);
            if (!$directorio) {
                NWJSonRpcServer::information("No se encontró la ruta");
                return;
            }
            $archivos = Array();
            $counter = 0;
            $i = 0;
            for ($ia = 0; $ia < count($directorio); $ia++) {
                $archivo = $directorio[$ia];
                $partes_ruta = pathinfo($carpet . $archivo);

                if ($p["buscar"] != "") {
                    if (strrpos($partes_ruta['basename'], $p["buscar"]) === false) {
                        if (isset($partes_ruta['extension']) && $partes_ruta['extension'] != "") {
                            continue;
                        }
                    }
                }

                $array[$i]["ruta"] = $carpet . $archivo;
                if (isset($partes_ruta['extension'])) {
                    if (isset($p["type"]) && $p["type"] != "todos") {
                        $exts = self::extensions_array($p["type"]);
                        if (array_search($partes_ruta['extension'], $exts) === false) {
                            continue;
                        }
                    }
                    $array[$i]["extension"] = $partes_ruta['extension'];
                } else {
                    $array[$i]["extension"] = "";
                }
                if (isset($partes_ruta['basename']) && $partes_ruta['basename'] != ".") {
                    $array[$i]["nombre"] = $partes_ruta['basename'];
                } else {
                    $array[$i]["nombre"] = "{$archivo}";
                }
                $array[$i]["relative_path"] = str_replace($_SERVER["DOCUMENT_ROOT"], "/", $carpet . $archivo);
                $array[$i]["datetime"] = date("Y-M-d H:i:s", filemtime($carpet . $archivo));
                $array[$i]["size"] = NWUtils::getHumanReadableSize(filesize($carpet . $archivo));
                $array[$i]["filetype"] = filetype($carpet . $archivo);
                $array[$i]["dirInitial"] = $_SERVER["DOCUMENT_ROOT"];
                $array[$i]["permissions"] = 0;
                $array[$i]["permissions"] = NWUtils::getPermissionsFromFile($carpet . $archivo);

//                $ow = posix_getpwuid(fileowner($carpet . $archivo)); 
//                $array[$i]["owner"] = isset($ow["name"]) ? $ow["name"] : "";
                $array[$i]["owner"] = "www-data";
                $i++;
            }
        }

        $rta = Array();
        $rta["files"] = Array();
        for ($i = 0; $i < count($array); $i++) {
            if (isset($array[$i]["extension"]) && $array[$i]["extension"] == "") {
                $rta["files"][] = $array[$i];
            }
        }
        for ($i = 0; $i < count($array); $i++) {
            if (isset($array[$i]["extension"]) && $array[$i]["extension"] != "") {
                $rta["files"][] = $array[$i];
            }
        }

        $iter = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($carpet, RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST, RecursiveIteratorIterator::CATCH_GET_CHILD);
        $iter->setMaxDepth(1);
        $i = 0;
        $array = Array();
        $rta["directories"] = Array();
        foreach ($iter as $path => $dir) {
            if ($dir->isDir()) {
                $partes_ruta = pathinfo($path);
                $array[$i]["ruta"] = $path;
                $array[$i]["extension"] = "";
                if (isset($partes_ruta['basename']) && $partes_ruta['basename'] != ".") {
                    $array[$i]["nombre"] = $partes_ruta['basename'];
                }
                $array[$i]["datetime"] = date("Y-M-d H:i:s", filemtime($path));
                $array[$i]["size"] = NWUtils::getHumanReadableSize(filesize($path));
                $array[$i]["filetype"] = filetype($path);
                $array[$i]["dirInitial"] = $_SERVER["DOCUMENT_ROOT"];
                $array[$i]["permissions"] = 0;
//                $array[$i]["permissions"] = NWUtils::getPermissionsFromFile($path);
                $array[$i]["relative_path"] = str_replace($_SERVER["DOCUMENT_ROOT"], "/", $path);
                $ow = "www-data";
//                $ow = posix_getpwuid(fileowner($path));
                $array[$i]["owner"] = isset($ow["name"]) ? $ow["name"] : "";
                $array[$i]["parts"] = count(explode("/", $path));
                $rta["directories"][$i] = $array[$i];
                $i++;
            }
        }

        return $rta;
    }

    public static function save($p) {
        session::check();
        $rta = "";
        $file = $p["ruta"] . "/" . $p["nombre"];
        $carpet_new = mkdir($file, 0744);
        $error = 0;
        if (!isset($carpet_new)) {
            $error = 1;
            $rta .= "No se ha podido crear la carpeta $file .<br />";
        } else
        if ($error == 0) {
            $rta .= "Carpeta $file creada exitosamente!.<br />";
            chmod($file, 0744);
        }
        return $rta;
    }

    public static function saveFile($p) {
        session::check();

        for ($i = 0; $i < count($p["ruta"]); $i++) {
            $file = $_SERVER["DOCUMENT_ROOT"] . $p["filename"];
            $r = $p["ruta"][$i];
            $newfile = $p["url"] . "/" . $r["filename"];
            chmod($file, 0777);
            if (!@copy($file, $newfile)) {
                NWJSonRpcServer::information("La ruta para subir el archivo es incorrecta o no tiene permisos");
            }
            unlink($file);
        }
        return true;
    }

    public static function eliminarCarpet($dir) {
        session::check();
        $rta = "";
        foreach (scandir($dir) as $item) {
            if ($item != "." && $item != "..") {
//                continue;
//                unlink($dir . DIRECTORY_SEPARATOR . $item);
                if (is_dir($dir . "/" . $item)) {
//                    rmdir($dir . "/" . $item);
                    self::eliminarCarpet($dir . "/" . $item);
//                    rmdir($item);
                } else
                if (!is_dir($dir . "/" . $item)) {
//                unlink($dir . DIRECTORY_SEPARATOR . $item);
                    unlink($dir . "/" . $item);
//                    unlink($item);
                }
                $rta .= $item . " || ";
            }
        }
        rmdir($dir);
        return $rta;
    }

    public static function eliminarArchivo($dir) {
        session::check();
        for ($i = 0; $i < count($dir); $i++) {
            if (strpos($dir[$i], 'www') !== false) {
                unlink($dir[$i]);
            } else {
                unlink($_SERVER["DOCUMENT_ROOT"] . "/" . $dir[$i]);
            }
        }
        return true;
    }

}
