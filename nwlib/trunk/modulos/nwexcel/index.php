<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
global $carpeta;
$carpeta = "/nwlib{$cfg["nwlibVersion"]}/modulos/nwexcel/file.php";
ob_start('comprimir_pagina');

function files($type) {
    global $carpeta;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    if (!isset($si["usuario"])) {
        echo "Debes iniciar sesión. <a href='/build/index.html'>Haz clic aquí.</a>";
        return;
    }
    $where = " 1=1 ";
    if ($type == "plantillas") {
        $where .= " and tipo='plantilla' ";
    } else
    if ($type == "shared") {
        $where .= " and tipo<>'plantilla' and acceso='usuariosdelsistema' ";
    } 
    else {
        $where .= " and tipo<>'plantilla' and usuario=:usuario ";
    }
    
    $where .= " and empresa=:empresa ";
    $where .= " order by fecha desc ";
    
    $ca->prepareSelect("nwexcel_files", "*", $where);
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    if (!$ca->exec()) {
        echo "error. " . $ca->lastErrorText();
        return;
    }
    $rta = "";
    $total = $ca->size();
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $nombre = "Documento sin Título";
            if ($r["nombre"] != "") {
                $nombre = $r["nombre"];
            }
            $link = "{$carpeta}?id={$r["id"]}";
            $rta .= "<div class='box_file'>
                
                                <a href='{$link}'>
                                    <div class='box_file_inter'>
                                        <h3>{$nombre}</h3>
                                        <p>{$r['fecha']}</p>
                                        <p>Creado / modificado por: {$r['usuario']}</p>
                                        <p>Acceso: {$r['acceso']}</p>
                                    </div>
                                </a>
                                
                                <div class='options'>
                                    <p><a href='{$link}' >Abrir</a></p>
                                    <p class='borrar'>Borrar</p>
                                </div>
                            </div>";
        }
    }
    return $rta;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="/nwlib6/modulos/nwexcel/css/home.css" rel="stylesheet" type="text/css" charset="utf-8" />
    </head>
    <body>
        <div class="contain_home">
            <div class="contain_home_inter">
                <div>
                    <a href="<?php echo $carpeta; ?>">
                        <span>+</span> Nuevo Documento
                    </a>
                </div>
                <div class="contain_files">

                    <div class="contain_files_box">
                        <h1>
                            Plantillas
                        </h1>
                        <?php
                        print_r(files("plantillas"));
                        ?>
                        <div class="clear"></div>
                    </div>

                    <div class="contain_files_box">
                        <h1>
                            Mis Archivos
                        </h1>
                        <?php
                        print_r(files("files"));
                        ?>
                        <div class="clear"></div>
                    </div>

                    <div class="contain_files_box">
                        <h1>
                            Compartidos
                        </h1>
                        <?php
                        print_r(files("shared"));
                        ?>
                        <div class="clear"></div>
                    </div>

                    <div class="clear"></div>
                </div>
            </div>
        </div>
    </body>
</html>
<?php
ob_end_flush();

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}
?>