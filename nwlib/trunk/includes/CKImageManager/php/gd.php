<?php

//if(function_exists("gd_info"))
    
function showGDinformation() {
    if(extension_loaded("gd")) {
        return "YES";
    } else {
        return "NO";
    }
}

$files_array = Array();

$gdvar = showGDinformation();

$files_array[] = array(
    "gdvari" => $gdvar
);

echo json_encode($files_array);
?>