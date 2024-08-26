<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwexcel_files", "acceso,permisos", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
$ca->next();
$r = $ca->assoc();
?>
<h2>Compartir Archivo id <?php echo $_POST["id"]; ?></h2>
<p>Quien puede ver este archivo?: 
    <select name='acceso' id='acceso'>
        <option <?php if($r["acceso"] == "soloyo") { echo " selected"; }  ?> value='soloyo'>Solo yo</option>
        <option <?php if($r["acceso"] == "usuariosdelsistema") { echo " selected"; }  ?>  value='usuariosdelsistema'>Usuarios del sistema</option>
        <option <?php if($r["acceso"] == "publico") { echo " selected"; }  ?> value='publico'>Público</option>
    </select>
</p>
<p>Permisos de archivo: 
    <select name='permisos' id='permisos'>
        <option <?php if($r["permisos"] == "lectura") { echo " selected"; }  ?> value='lectura' >Lectura</option>
        <option <?php if($r["permisos"] == "lecturayescritura") { echo " selected"; }  ?> value='lecturayescritura' >Lectura y escritura</option>
    </select>
</p>
<p>
    URL para compartir el archivo: <br />
    <a href="<?php echo $_POST["url"]; ?>" target='_blank'><?php echo $_POST["url"]; ?></a>
</p>