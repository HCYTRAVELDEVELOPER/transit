<?php

class nwFileManager {

    static $max_thumb_width = 200;
    static $max_thumb_height = 200;

    public static function getImageDimensions($p) {
        $url = null;
        if (is_array($p)) {
            if (strpos($p["imagePath"], "http") !== false) {
                $fullPath = $p["imagePath"];
            } else {
                $fullPath = $_SERVER["DOCUMENT_ROOT"] . "/" . $p["imagePath"];
            }
            $url = $p["imagePath"];
            self::$max_thumb_height = $p["max_thumb_height"];
            self::$max_thumb_width = $p["max_thumb_width"];
        } else {
            if (strpos($p, "http") !== false) {
                $fullPath = $p;
            } else {
                $fullPath = $_SERVER["DOCUMENT_ROOT"] . "/" . $p;
                if (!file_exists($fullPath)) {
                    return false;
                }
            }
            $url = $p;
        }
        $dimensions = self::resizeDimension($fullPath);
        $files_array = array(
            "path" => self::fixUrl($url),
            "name" => basename($url),
            "height" => round($dimensions[1]),
            "width" => round($dimensions[0])
        );
        return $files_array;
    }

    public static function fixUrl($url) {
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

    public static function resizeDimension($imagepath) {
        list($width, $height, $type, $attr) = getimagesize($imagepath);
        $ht = $height;
        $wd = $width;
        if ($width > self::$max_thumb_width) {
            $diff = $width - self::$max_thumb_width;
            $percnt_reduced = (($diff / $width) * 100);
            $ht = $height - (($percnt_reduced * $height) / 100);
            $wd = $width - $diff;
            if ($ht > self::$max_thumb_height) {
                $diff = $ht - self::$max_thumb_height;
                $percnt_reduced = (($diff / $ht) * 100);
                $wd = $wd - (($percnt_reduced * $wd) / 100);
                $ht = $ht - $diff;
            }
        } else if ($height > self::$max_thumb_height) {
            $diff = $height - self::$max_thumb_height;
            $percnt_reduced = (($diff / $height) * 100);
            $wd = $width - (($percnt_reduced * $width) / 100);
            $ht = $height - $diff;
        }
        return array($wd, $ht);
    }

}
