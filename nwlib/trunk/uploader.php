<?php

if (!function_exists('json_decode')) {

    function json_decode($content, $assoc = false) {
        require_once dirname(__FILE__) . '/rpc/JSON.php';
        if ($assoc) {
            $json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
        } else {
            $json = new Services_JSON;
        }
        return $json->decode($content);
    }

}

if (!function_exists('json_encode')) {

    function json_encode($content) {
        require_once dirname(__FILE__) . '/rpc/JSON.php';
        $json = new Services_JSON;
        return $json->encode($content);
    }

}

class NW_uploader {

    private $image_dest;
    private $path_light;
    var $file_type = "Files";
    var $max_thumb_height = 100;
    var $max_thumb_width = 100;
    var $base_url;
    var $upload_path;
    static $id;
    var $rename = false;
    var $rename_random = false;
    var $file_name = "";
    var $size_h;
    var $size_w;

    public function start() {

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST) &&
                empty($_FILES) && $_SERVER['CONTENT_LENGTH'] > 0) {
            $displayMaxSize = ini_get('post_max_size');

            switch (substr($displayMaxSize, -1)) {
                case 'G':
                    $displayMaxSize = $displayMaxSize * 1024;
                case 'M':
                    $displayMaxSize = (int) $displayMaxSize * 1024;
                case 'K':
                    $displayMaxSize = $displayMaxSize * 1024;
            }
            $error["message"] = "Error: El tamaño del archivo excede el autorizado por el servidor. Consulte con el administrador. Archivo: " . $_SERVER["CONTENT_LENGTH"] . " bytes::Permitido: " . $displayMaxSize . " bytes";
            self::error($error);
        }

        if (isset($_GET["rename"])) {
            $this->rename = $_GET["rename"];
        }
        if (isset($_POST["rename"])) {
            $this->rename = $_GET["rename"];
        }
        if (isset($_GET["rename_random"])) {
            $this->rename_random = $_GET["rename_random"];
        }
        if (isset($_POST["rename_random"])) {
            $this->rename_random = $_POST["rename_random"];
        }
        if (isset($_GET["sizes"])) {
            $size = explode("x", $_GET["sizes"]);
            $this->size_w = $size[0];
            $this->size_h = $size[1];
        }

        if (!isset($_FILES[self::getRealFile()]['name'])) {
            self::error("No se procesó el nombre del archivo. Más del error: " . json_encode($_FILES));
        }

        $name = $this->getNewName($_FILES[self::getRealFile()]['name']);
        $name = preg_replace('/[\x00-\x1F\x7F]/u', '', $name);
        $name = preg_replace('/\s+/', '_', $name);
        $name = str_replace("#", "_", $name);
        $name = str_replace("$", "_", $name);
        $name = str_replace("\\", "_", $name);

        $this->file_name = $name;

        $company = 1;

        if (isset($_SESSION["empresa"])) {
            $company = $_SESSION["empresa"];
        }

        $path_dest = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $company . '/';

        if (isset($_GET["destination"]) && $_GET["destination"] != "") {
            $path_dest = $_SERVER["DOCUMENT_ROOT"] . $_GET["destination"] . $company . '/';
        }

        if (!file_exists($path_dest) || !is_dir($path_dest)) {
            if (!mkdir($path_dest, 0777, true)) {
                $arr = Array();
                $arr["file"] = $name;
                self::error("No se creó la carpeta de destino. Consulte con el administrador. Path dest: " . $path_dest, $arr);
            }
        }

        $this->image_dest = $path_dest . $name;

        if (isset($_GET["destination"]) && $_GET["destination"] != "") {
            $this->path_light = $_GET["destination"] . $company . '/' . $name;
        } else {
            $this->path_light = '/imagenes/' . $company . '/' . $name;
        }

        if (isset($_GET["destination"]) && $_GET["destination"] != "") {
            $this->base_url = "https://" . $_SERVER["HTTP_HOST"] . $_GET["destination"] . $company . '/';
            $this->upload_path = $_SERVER['DOCUMENT_ROOT'] . $_GET["destination"] . $company;
        } else {
            $this->base_url = "https://" . $_SERVER["HTTP_HOST"] . "/imagenes/" . $company . '/';
            $this->upload_path = $_SERVER['DOCUMENT_ROOT'] . "/imagenes/" . $company;
        }
        $this->checkSecurity();

        $this->upload();
    }

    private function checkSecurity() {
//        $pos = strpos($_FILES['uploadfile']['name'], 'php');
        if (!isset($_POST["uploadfile"])) {
            return;
        }
        $pos = strpos($_FILES[$_POST["uploadfile"]]['name'], 'php');
        if (!($pos === false)) {
            die('error');
        }
        if ($this->file_type == "Images") {
//            $imageinfo = getimagesize($_FILES['uploadfile']['tmp_name']);
            $imageinfo = getimagesize($_FILES[self::getRealFile()]['tmp_name']);
            if ($imageinfo['mime'] != 'image/gif' && $imageinfo['mime'] != 'image/heif' && $imageinfo['mime'] != 'image/jpeg' && $imageinfo['mime'] != 'image/jpg' && $imageinfo['mime'] != 'image/png') {
                die('error 2');
            }
        }
    }

    function getNWIconByUrl($url, $size) {
        $icon = "image";
        $toCheck = pathinfo($url);
        $ext = $toCheck["extension"];
        switch ($ext) {
            case "docx" :
                $icon = "word";
                break;
            case "DOCX" :
                $icon = "word";
                break;
            case "doc" :
                $icon = "word";
                break;
            case "DOC" :
                $icon = "word";
                break;
            case "ppp" :
                $icon = "PowerPoint-icon";
                break;
            case "PPP" :
                $icon = "PowerPoint-icon";
                break;
            case "xls" :
                $icon = "excel";
                break;
            case "XLS" :
                $icon = "excel";
                break;
            case "xlsx" :
                $icon = "excel";
                break;
            case "XLSX" :
                $icon = "excel";
                break;
            case "pdf" :
                $icon = "pdf";
                break;
            case "PDF" :
                $icon = "pdf";
                break;
            case "ODT" :
                $icon = "word";
                break;
            case "odt" :
                $icon = "word";
                break;
            case "rar" :
                $icon = "rar";
                break;
            case "RAR" :
                $icon = "rar";
                break;
        }
        return "/nwlib6" . "/icons/" . $size . "/" . $icon . ".png";
    }

    function getExtensions() {
        switch ($this->file_type) {
            case "Images":
                return array("jpg", "jpeg", "gif", "png", "rar", "zip", "ico", "webp", "HEIF", "heif");
                break;
            case "Flash":
                return array("swf");
                break;
            case "Files":
                return array("tar.gz", "eml", "bmp", "ico", "xls", "xlsm", "ods", "BMP", "tiff", "mp3", "mpa4", "html", "htm", "rar", "zip", "txt", "doc", "ods", "pdf", "mov", "avi", "flv", "jpg", "jpeg", "gif", "png", "rar", "WMA", "docx", "wma", "pptx", "xlsx", "wmv", "WMV", "msg", "tar", "gz", "part", "csv", "ttf", "otf", "TTF", "OTF", "mp4", "MP4", "xps", "apk", "APK", "webp", "WEBP", "ogg", "OGG", "tif", "TIF", "tiff", "TIFF", "HEIF", "heif", "ODT", "odt", "xml", "XML");
        }
    }

    function isFile($ext) {
        $files_ext = array("bmp", "BMP", "tiff", "mp3", "html", "htm", "rar", "zip", "txt", "doc", "xls", "pdf", "mov", "avi", "flv", "rar", "WMA", "docx", "wma", "pptx", "xlsx", "wmv", "WMV", "part", "csv", "ttf", "otf", "TTF", "OTF", "webp", "WEBP", "ogg", "OGG", "ODT", "odt");
        if (in_array(strtolower($ext), $files_ext)) {
            return true;
        } else {
            return false;
        }
    }

    function getExtension($filename) {
        $pos = strrpos($filename, '.');
        if ($pos === false) {
            return '';
        } else {
//$basename = substr($filename, 0, $pos);
            $extension = substr($filename, $pos + 1);
            return $extension;
        }
    }

    function writeToFile($data, $mode = "", $file = "") {
        if ($mode == "") {
            $mode = "a+";
        }
        if ($file == "") {
            $file = dirname(__FILE__) . "/log";
        }
        $fp = fopen($file, $mode);
        fwrite($fp, $data);
        fclose($fp);
    }

    function resizeDimension($imagepath) {
        list($width, $height, $type, $attr) = getimagesize($imagepath);
        $ht = $height;
        $wd = $width;
        if ($width > $this->max_thumb_width) {
            $diff = $width - $this->max_thumb_width;
            $percnt_reduced = (($diff / $width) * 100);
            $ht = $height - (($percnt_reduced * $height) / 100);
            $wd = $width - $diff;
        } else if ($height > $this->max_thumb_height) {
            $diff = $height - $this->max_thumb_height;
            $percnt_reduced = (($diff / $height) * 100);
            $wd = $width - (($percnt_reduced * $width) / 100);
            $ht = $height - $diff;
        }
        return array($wd, $ht);
    }

    function compressImage($source_image, $compress_image) {
        $image_info = getimagesize($source_image);
        if ($image_info['mime'] == 'image/jpeg') {
            $source_image = imagecreatefromjpeg($source_image);
            imagejpeg($source_image, $compress_image, 75);
        } elseif ($image_info['mime'] == 'image/gif') {
            $source_image = imagecreatefromgif($source_image);
            imagegif($source_image, $compress_image, 75);
        } elseif ($image_info['mime'] == 'image/png') {
            $source_image = imagecreatefrompng($source_image);
            imagepng($source_image, $compress_image, 6);
        }
    }

    function upload() {

        $error = Array();
        $error["name"] = basename($this->image_dest);
        $files_array = Array();
        $exts = $this->getExtensions();
        $ext = $this->getExtension($this->image_dest);
        $type = $this->file_type;
        if (file_exists($this->image_dest)) {
            unlink($this->image_dest);
        }

        if (in_array(strtolower($ext), $exts)) {
            if (!file_exists($this->image_dest)) {
                if (is_uploaded_file($_FILES[self::getRealFile()]['tmp_name'])) {

                    if ($this->size_h !== null && $this->size_w !== null) {
                        $imageSize = @getimagesize($_FILES[self::getRealFile()]['tmp_name']);
                        if ($imageSize[0] > $this->size_w) {
                            $error["message"] = "El ancho ({$imageSize[0]}) es mayor que el permitido para esta operación ($this->size_w) ";
                            self::information($error);
                        }
                        if ($imageSize[1] > $this->size_h) {
                            $error["message"] = "El alto ({$imageSize[1]}) es mayor que el permitido para esta operación ($this->size_h) ";
                            self::information($error);
                        }
                        if ($imageSize[0] < $this->size_w) {
                            $error["message"] = "El ancho ({$imageSize[0]}) es menor que el permitido para esta operación ($this->size_w) ";
                            self::information($error);
                        }
                        if ($imageSize[1] < $this->size_h) {
                            $error["message"] = "El alto ({$imageSize[1]}) es menor que el permitido para esta operación ($this->size_h) ";
                            self::information($error);
                        }
                    }

                    $old_umask = umask();
                    umask(0027);
                    if ((move_uploaded_file($_FILES[self::getRealFile()]['tmp_name'], $this->image_dest))) {
                        if ($this->file_type == "Images") {
                            $dimensions = $this->resizeDimension($this->image_dest);
                            $files_array = array(
                                "fileUrl" => $this->fixUrl($this->image_dest),
                                "image" => $this->fixUrl($this->image_dest),
                                "image_light" => $this->fixUrl($this->path_light),
                                "name" => basename($this->image_dest),
                                "height" => $dimensions[1],
                                "width" => $dimensions[0],
                                "type" => "image"
                            );
                        } else if ($this->file_type == "Files") {
                            $image = $this->fixUrl($this->image_dest);
                            $image_light = $this->fixUrl($this->path_light);
                            $dimensions = Array();
                            $dimensions[0] = $this->max_thumb_width;
                            $dimensions[1] = $this->max_thumb_height;
                            $fileUrl = null;
                            $type = "N/A";
                            if ($this->isFile($ext)) {
                                $urlFile = $this->getNWIconByUrl($this->path_light, 32);
                                $image = $this->fixUrl($urlFile);
//$image_light = $this->fixUrl($urlFile);
//                                $fileUrl = $this->fixUrl($this->image_dest);
                                $type = "file";
                            } else {
                                $dimensions = $this->resizeDimension($this->image_dest);
                            }
                            $files_array = array(
                                "fileUrl" => $fileUrl,
                                "image_light" => $image_light,
                                "image_light_nwmaker" => $this->fixUrl($this->path_light),
                                "image" => $image,
                                "name" => basename($this->image_dest),
                                "height" => $dimensions[1],
                                "width" => $dimensions[0],
                                "type" => $type
                            );
                        } else {
                            $files_array = array(
                                "swfUrl" => $this->fixUrl("img/swf.png"),
                                "image_light" => $this->fixUrl($this->path_light),
                                "fileUrl" => $this->fixUrl($this->image_dest),
                                "image" => $this->fixUrl($this->image_dest),
                                "name" => basename($this->image_dest),
                                "height" => $this->max_thumb_width,
                                "width" => $this->max_thumb_height
                            );
                        }
                        self::response($files_array);
                    } else {
                        if (is_dir($this->upload_path) && !is_writable($this->upload_path)) {
                            $error["message"] = 'Error: El directorio ' . $this->upload_path . " no posee permisos de escritura o no existe";
                        } else {
                            $error["message"] = "Error: A problem occurred during file upload!";
                        }
                        self::error($error);
                    }
                    umask($old_umask);
                } else {
                    $error["message"] = "Error: Ocurrió una novedad al subir el archivo. Es probable que la carpeta destino no tenga los permisos requeridos. Error: " . $_FILES[self::getRealFile()]['error'];
                    self::error($error, Array("file" => $this->file_name));
                }
            } else {
                if (is_uploaded_file($_FILES[self::getRealFile()]['tmp_name'])) {
                    $dimensions = $this->resizeDimension($this->image_dest);
                    if ($this->file_type == "Files") {
                        $image = $this->fixUrl($this->image_dest);
                        $image_light = $this->fixUrl($this->path_light);
                        $dimensions = Array();
                        $dimensions[0] = $this->max_thumb_width;
                        $dimensions[1] = $this->max_thumb_height;
                        $fileUrl = null;
                        if ($this->isFile($ext)) {
                            $urlFile = $this->getNWIconByUrl($this->image_dest, 32);
                            $image = $this->fixUrl($urlFile);
                            $image_light = $this->fixUrl($urlFile);
                            $fileUrl = $this->fixUrl($this->image_dest);
                        } else {
                            $dimensions = $this->resizeDimension($this->image_dest);
                        }
                        $files_array = array(
                            "fileUrl" => $fileUrl,
                            "image_light" => $image_light,
                            "image" => $image,
                            "name" => basename($this->image_dest),
                            "height" => $dimensions[1],
                            "width" => $dimensions[0]
                        );
                    } else {
                        $files_array = array(
                            "fileUrl" => $this->fixUrl($this->image_dest),
                            "image" => $this->fixUrl($this->image_dest),
                            "image_light" => $this->fixUrl($this->path_light),
                            "name" => basename($this->image_dest),
                            "height" => $dimensions[1],
                            "width" => $dimensions[0]
                        );
                    }
                    self::response($files_array, Array("file" => $this->file_name));
                }
            }
        } else {
            $error["message"] = "Error: El archivo que intenta subir no está dentro de los autorizados por el aplicativo. Consulte con el administrador: " . $ext . " Tipo:  " . $type;
            self::information($error);
        }
    }

    function getNewName($name) {
        $ext = $this->getExtension($name);
        $path_parts = pathinfo($name);
        if ($this->rename) {
            $name = $path_parts["filename"] . "_" . date("Y_m_d_H_i_s") . "." . $ext;
        } else if ($this->rename_random) {
            $name = date("Y_m_d_H_i_s") . random_int(111111, 999999) . "." . $ext;
        }
        return $name;
    }

    function fixUrl($url) {
        $pattern = array(
            "/(\/){2}/",
            "/((http|ftp|https):(\/))/i",
        );
        $replace = array(
            "/",
            "$1/"
        );
        return preg_replace($pattern, $replace, $url);
    }

    private static function response($result) {
        $response = array(
            "jsonrpc" => 2.0,
            "id" => 1,
            "error" => null,
            "result" => $result
        );
        self::output(json_encode($response));
        exit;
    }

    private static function responseBase($error = false) {
        $r = array("jsonrpc" => 2.0, "id" => null);
        if ($error) {
            $r["error"] = null;
        }
        return $r;
    }

    public static function information($message, $op = array()) {
        $op["code"] = 102;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;
        $op["strip_slashes"] = isset($op["strip_slashes"]) ? $op["strip_slashes"] : false;

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }
        if ($op["strip_slashes"] === true) {
            $message = stripslashes(html_entity_decode($message));
        }

        $id = 1;
        $id = self::$id != "" ? self::$id : $id;

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    public static function error($message, $op = array()) {
        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";
        $op["code"] = isset($op["code"]) ? $op["code"] : 100;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        $bt = debug_backtrace();
        $caller = array_shift($bt);

        if ($op["file"] == "") {
            $op["file"] = $caller['file'];
        }
        if ($op["line"] == "") {
            $op["line"] = $caller['line'];
        }

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }

        if (!is_array($message)) {
            $message = html_entity_decode($message);
            $message = stripslashes($message);
            $message .= "\n";
        }
        ob_start();
        debug_print_backtrace();
        $trace = ob_get_contents();
        ob_end_clean();

        if (trim($op["file"]) != '') {
            $op["file"] = str_replace(".php", "", basename($op["file"]));
            $trace .= "<br /><b>\nfile:{$op["file"]}, line:{$op["line"]}</b>";
        }

        $id = 1;
        if (self::$id != "") {
            $id = self::$id;
        }

        if ($op["code"] == 10) {
            $trace = "";
        }

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "origin" => 1, "name" => $op["file"]);
        self::output(json_encode($r));
        exit;
    }

    public static function output($data) {
        header("Content-Type: text/html; ");
//header("Content-Length: " . strlen($data));
        print $data;
        exit;
    }

    public static function getRealFile() {
        if (isset($_POST["uploadfile"])) {
            return $_POST["uploadfile"];
        }
        return 'uploadfile';
    }
}

$uploader = new NW_uploader();
$uploader->start();
