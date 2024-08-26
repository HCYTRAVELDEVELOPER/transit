<?php

/* * **********************************************************************

  QxUploadMgr - provides an API for uploading one or multiple files
  with progress feedback (on modern browsers), does not block the user
  interface during uploads, supports cancelling uploads.

  http://qooxdoo.org

  Copyright:
  2011 Zenesis Limited, http://www.zenesis.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php

  This software is provided under the same licensing terms as Qooxdoo,
  please see the LICENSE file in the Qooxdoo project's top-level directory
  for details.

  Parts of this code is based on the work by Andrew Valums (andrew@valums.com)
  and is covered by the GNU GPL and GNU LGPL2 licenses; please see
  http://valums.com/ajax-upload/.

  Authors:
 * John Spackman (john.spackman@zenesis.com)

 * ********************************************************************** */

function convertBytes($value) {
    if (is_numeric($value)) {
        return $value;
    } else {
        $value_length = strlen($value);
        $qty = substr($value, 0, $value_length - 1);
        $unit = strtolower(substr($value, $value_length - 1));
        switch ($unit) {
            case 'k':
                $qty *= 1024;
                break;
            case 'm':
                $qty *= 1048576;
                break;
            case 'g':
                $qty *= 1073741824;
                break;
        }
        return $qty;
    }
}

$maxFileSize = convertBytes(ini_get('post_max_size'));

if ($_SERVER["CONTENT_LENGTH"] > $maxFileSize) {
    $message = 'Archivo muy grande (el limite es ' . $maxFileSize . ' bytes). El archivo es de ' . $_SERVER["CONTENT_LENGTH"];
    error_log($message);
    echo htmlspecialchars(json_encode(array('error' => $message)), ENT_NOQUOTES);
    return;
}

class QxUploadMgr {

    static $rename = false;
    static $rename_random = false;
    static $newName = false;
    static $relativePath = false;

    public static function setRelativePath($relativePath) {
        self::$relativePath = $relativePath;
    }

    /**
     * Handles the upload
     * @param $uploadDirectory {String} the path to upload to
     * @param $replaceOldFile {Boolean} whether to replace existing files
     */
    public static function handleUpload($uploadDirectory, $replaceOldFile = FALSE) {

        if (isset($_GET["rename"])) {
            self::$rename = $_GET["rename"];
        }
        if (isset($_GET["rename_random"])) {
            self::$rename_random = $_GET["rename_random"];
        }

        if (!is_writable($uploadDirectory)) {
            error_log($uploadDirectory);
            return array('error' => "Error en el servidor. La carpeta de destino no tiene permisos de escritura.");
        }

        /* if ($_SERVER['CONTENT_TYPE'] == "application/octet-stream")
          return QxUploadMgr::handleApplicationOctet($uploadDirectory, $replaceOldFile);
          else */
        return QxUploadMgr::handleMultipartFormData($uploadDirectory, $replaceOldFile);
    }

    public static function getExtensions() {
        switch ("Files") {
            case "Images":
                return array("jpg", "jpeg", "gif", "png", "rar", "zip", "ico", "webp", "ogg", "tif", "tiff");
                break;
            case "Flash":
                return array("swf");
                break;
            case "Files":
                return array("eml", "bmp", "ico", "xls", "xlsm", "ods", "BMP", "tiff", "mp3", "mpa4", "html", "htm", "rar", "zip", "txt", "doc", "ods", "pdf", "mov", "avi", "flv", "jpg", "jpeg", "gif", "png", "rar", "WMA", "docx", "wma", "pptx", "xlsx", "wmv", "WMV", "msg", "part", "csv", "ttf", "TTF", "otf", "OTF", "mp4", "MP4", "apk", "APK", "webp", "WEBP", "ogg", "OGG", "tif", "TIF", "tiff", "TIFF", "xml", "XML");
        }
    }

    public static function getExtension($filename) {
        $pos = strrpos($filename, '.');
        if ($pos === false) {
            return '';
        } else {
            //$basename = substr($filename, 0, $pos);
            $extension = substr($filename, $pos + 1);
            return $extension;
        }
    }

    public static function isFile($ext) {
        $files_ext = array("bmp", "BMP", "tiff", "mp3", "html", "htm", "rar", "zip", "txt", "doc", "xls", "pdf", "mov", "avi", "flv", "rar", "WMA", "docx", "wma", "pptx", "xlsx", "wmv", "WMV", "part", "csv", "ttf", "apk", "APK", "webp", "WEBP", "ogg", "OGG");
        if (in_array(strtolower($ext), $files_ext)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Determins the filename for the upload
     * @param $uploadDirectory {String} the path to upload to
     * @param $originalName {String} the filename as given by the browser
     * @param $replaceOldFile {Boolean} whether to replace existing files
     */
    public static function getFilename($uploadDirectory, $originalName, $replaceOldFile) {

        $pathinfo = pathinfo($originalName);

        if (self::$rename === true) {
            $pathinfo['filename'] = $pathinfo['filename'] . "_" . date("Y_m_d_H_i_s");
        } else if (self::$rename_random === true) {
            $pathinfo['filename'] = rand();
        }

        $pathinfo['filename'] = str_replace("#", "_", $pathinfo['filename']);
        $pathinfo['filename'] = preg_replace('/[\x00-\x1F\x7F]/u', '', $pathinfo['filename']);
        $pathinfo['filename'] = preg_replace('/\s+/', '_', $pathinfo['filename']);
        $pathinfo['filename'] = str_replace("$", "_", $pathinfo['filename']);
        $pathinfo['filename'] = str_replace("\\", "_", $pathinfo['filename']);

        self::$newName = $pathinfo['filename'] . '.' . $pathinfo['extension'];

        $filename = $uploadDirectory . '/' . $pathinfo['filename'] . '.' . $pathinfo['extension'];

        if (!$replaceOldFile) {
            $index = 1;
            while (file_exists($filename)) {
                $filename = $uploadDirectory . '/' . $pathinfo['filename'] . '-' . $index . '.' . $pathinfo['extension'];
                $index++;
            }
        }

        return $filename;
    }

    /**
     * Handles the upload where content type is "application/octet-stream"
     * @param $uploadDirectory {String} the path to upload to
     * @param $replaceOldFile {Boolean} whether to replace existing files
     */
    public static function handleApplicationOctet($uploadDirectory, $replaceOldFile) {
        $filename = QxUploadMgr::getFilename($uploadDirectory, $_SERVER['HTTP_X_FILE_NAME'], $replaceOldFile);
        //error_log("Receiving application/octet-stream into $filename");

        $input = fopen("php://input", "r");
        $target = fopen($filename, "w");
        $realSize = stream_copy_to_stream($input, $target);
        fclose($input);
        fclose($target);

        if (isset($_SERVER["CONTENT_LENGTH"])) {
            $expectedSize = (int) $_SERVER["CONTENT_LENGTH"];
            if ($realSize != $expectedSize)
                return array('error' => 'El archivo tiene un tamaño inadecuado');
        }

        return array('success' => true);
    }

    /**
     * Handles the upload where content type is "multipart/form-data"
     * @param $uploadDirectory {String} the path to upload to
     * @param $replaceOldFile {Boolean} whether to replace existing files
     */
    public static function handleMultipartFormdata($uploadDirectory, $replaceOldFile) {
        //error_log("hello, count()=" . $_FILES . count());

        foreach ($_FILES as $file) {
            //error_log("$file=" . $file);

            $filename = QxUploadMgr::getFilename($uploadDirectory, $file['name'], $replaceOldFile);

            $exts = self::getExtensions();
            $ext = self::getExtension($filename);

            if (in_array(strtolower($ext), $exts)) {
                //error_log("Receiving multipart/formdata into $filename");
                if (!move_uploaded_file($file['tmp_name'], $filename)) {
                    $message = "";
                    switch ($file['error']) {
                        case UPLOAD_ERR_OK:
                            $message = false;
                            break;
                        case 1:
                            $message .= 'El archivo es muy grande - file too large (limit of ' . ini_get('upload_max_filesize') . ').';
                            break;
                        case 2:
                            $message .= 'El archivo es muy grande - file too large (limit of ' . ini_get('max_file_size') . ').';
                            break;
                        case 3:
                            $message .= 'La subida del archivo no se completó - file upload was not completed.';
                            break;
                        case 4:
                            $message .= 'El archivo tiene peso 0 - zero-length file uploaded.';
                            break;
                        case 6:
                            $message .= 'No se encontró una carpeta temporal - Missing a temporary folder.';
                            break;
                        case 7:
                            $message .= 'No se pudo escribir en el disco - Failed to write file to disk.';
                            break;
                        default:
                            $message .= 'Error interno - internal error #' . $file['error'];
                            break;
                    }
                    $rta = "Se presentó una novedad moviendo el archivo - Failed to move uploaded file from " . $file['name'] . ". Error: " . $message;
                    error_log($rta);
                    return array('error' => $rta);
                }
            } else {
                $rta = "El archivo no se encuentra dentro de los autorizados por la plataforma / The file is not within the limits authorized by the platform";
                error_log($rta);
                return array('error' => $rta, 'code' => 1000);
            }
        }
        $path = self::$relativePath;
        if (self::$rename == true) {
            if (isset($_GET["default"]) && $_GET["default"] != "" && $_GET["default"] == true) {
                return array('success' => true, 'rename' => true, 'newName' => self::$newName, 'destination_light' => $path);
            } else {
                return array('success' => true, 'rename' => true, 'newName' => self::$newName);
            }
        } else if (self::$rename_random == true) {
            if (isset($_GET["default"]) && $_GET["default"] != "" && $_GET["default"] == true) {
                return array('success' => true, 'rename' => true, 'newName' => self::$newName, 'destination_light' => $path);
            } else {
                return array('success' => true, 'rename' => true, 'newName' => self::$newName);
            }
        } else {
            return array('success' => true);
        }
    }
}

$company = 1;

if (isset($_SESSION["empresa"])) {
    $company = $_SESSION["empresa"];
}

$destination = $_SERVER["DOCUMENT_ROOT"] . '/imagenes' . "/" . $company . '/';
$relative = '/imagenes/' . $company . '/';

if (isset($_GET["destination"]) && $_GET["destination"] != "") {
    if (isset($_GET["default"]) && $_GET["default"] != "" && $_GET["default"] == true) {
        if (strpos($_GET["destination"], '/var/www') !== false) {
            $destination = $_GET["destination"] . "/" . $company . '/';
        } else {
            $destination = $_SERVER["DOCUMENT_ROOT"] . $_GET["destination"] . "/" . $company . '/';
        }
        $relative = $_GET["destination"] . $company;
    } else {
        if (strpos($_GET["destination"], '/var/www') !== false) {
            $destination = $_GET["destination"];
            //TODO: si pasa destino no se obliga a poner la empresa
//            $destination = $_GET["destination"] . "/" . $company . '/';
        } else {
            $destination = $_SERVER["DOCUMENT_ROOT"] . $_GET["destination"] . "/" . $company . '/';
        }
        $relative = $_GET["destination"] . "/" . $company . '/';
    }
}

if (!file_exists($destination) || !is_dir($destination)) {
    if (!mkdir($destination, 0777, true)) {
        echo htmlspecialchars(json_encode(array('error' => 'No se creó la carpeta de destino ' . $destination . '. Consulte con el administrador', 'code' => 1000)), ENT_NOQUOTES);
        return;
    }
}

QxUploadMgr::setRelativePath($relative);
$result = QxUploadMgr::handleUpload($destination);
echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);
