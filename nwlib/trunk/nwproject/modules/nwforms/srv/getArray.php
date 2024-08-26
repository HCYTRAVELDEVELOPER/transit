<?php

$bodyForm = "";
if (isset($_POST["array"])) {
    $total = count($_POST["array"]);
    if ($total > 0) {
        foreach ($_POST["array"] as $rb) {
            if (!isset($rb["campo"])) {
                continue;
            }
            if (!isset($rb["respuesta"])) {
                continue;
            }
            $bodyForm .= "<p><strong>{$rb["campo"]}</strong>: {$rb["respuesta"]}</p>";
        }
    }
}
echo $bodyForm;
