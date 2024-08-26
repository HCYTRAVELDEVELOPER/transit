<?php

$listCode = $_GET["list_code"];

if (isset($listCode)) {
    $data = file_get_contents($listCode);
    $data = unserialize($data);
    $table = "<table class='nw_list_table'>";
    for ($i = 0; $i < count($data); $i++) {
        if ($i == 0) {
            $keys = array_keys($data[$i]);
            $table .= "<tr class='nw_list_table_enc'>";
            for ($ia = 0; $ia < count($keys); $ia++) {
                $table .= "<td>";
                $table .= ucfirst($keys[$ia]);
                $table .= "</td>";
            }
            $table .= "</tr>";
        }
        $table .= "<tr>";
        foreach ($data[$i] as $value) {
            $table .= "<td>";
            $table .= $value;
            $table .= "</td>";
        }
        $table .= "</tr>";
    }
    $table .= "</table>";
    echo $table;
}