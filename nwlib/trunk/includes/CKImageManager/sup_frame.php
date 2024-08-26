<?php
/*
 * Copyright 2010 - Jose Carrero. All rights reserved.
 *
 * sup_frame.html
 *
 * version 0.5 (2010/02/09) 
 * 
 * Licensed under the GPL license:  
 *   http://www.gnu.org/licenses/gpl.html
 *
 * This file is part of CKImageManager.
 *
 *  CKImageManager is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CKImageManager is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with CKImageManager.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

include_once($_SERVER['DOCUMENT_ROOT'] . "/nwlib/utiles.php");
require_once($_SERVER['DOCUMENT_ROOT'] . "/nwlib/includes/CKImageManager/php/config.php");

noCache();
?>
<html>
    <head>
        <link href="/nwlib/includes/CKImageManager/css/splitter.css" type="text/css" rel="stylesheet">
        <link href="/nwlib/includes/CKImageManager/css/jquery-ui.css" type="text/css" rel="stylesheet">
        <link href="/nwlib/includes/CKImageManager/css/main.css" type="text/css" rel="stylesheet">
        <!--[if IE]>
        <link href="/nwlib/includes/CKImageManager/css/main-ie.css" type="text/css" rel="stylesheet">
        <![endif]-->
        <script src="/nwlib/includes/CKImageManager/js/jquery.js"></script>
        <script src="/nwlib/includes/CKImageManager/js/jquery-ui.js"></script>
        <script src="/nwlib/includes/CKImageManager/js/splitter.js"></script>
        <script src="/nwlib/includes/CKImageManager/js/main.js"></script>
        <script type="text/javascript">

            function setContainerWindow(cw) {
                window._containerWindow = cw;
            }
            function getContainerWindow() {
                return window._containerWindow;
            }

            function ok(fileUrl) {

                window.top.qx.core.Init.getApplication().returnModal();
                //parent.window.opener.form.cke_dialog_ui_input_text.setValue(fileUrl);
                window.top.document.getElementById('<?php echo $_GET["name"]; ?>').value = fileUrl;
                var element = window.top.document.getElementById('form<?php echo $_GET["name"]; ?>');
                element.parentNode.removeChild(element);

                //parent.top[parente].setImage(fileUrl);

                //parent.top.f_productosNeBase.slotReceiveImage(fileUrl);

                //parent.top.refDialog.dialog('close');

                //parent.top.close_dialog();
                /*
                 var refDialog;
                 $(function() {
                 refDialog = $('<iframe id="site" src="' + this.href + '" />').dialog();
                 });
                 
                 window.parent.refDialog.dialog('close')
                 //window.returnValue = 'test';
                 //parent.window.opener.ckfileurl1(fileUrl);
                 //window.returnValue(fileUrl);
                 */
            }
        </script>
    </head>
    <body>
        <div id="opciones">
            <a href="#" class="uploadLink boton"><div>Subir archivo</div></a>
            <a href="#" id="newFolderLink" class="boton"><div>Nueva carpeta</div></a>
            <a href="#" id="deleteFolderLink" class="boton"><div>Borrar la carpeta actual</div></a>
            <a href="#" id="actualiza" class="boton"><div>Actualizar</div></a>

            <strong class="buscar" >Buscar:</strong> 
            <input id="buscar_text" name="buscar_text" class="buscar" type="text"  />
            <a href="#" id="buscar_boton" class="boton"><div>Buscar</div></a>

            <strong class="buscar" >Minimizadas</strong> 
            <input type="checkbox" id="check_mini" class="buscar" name="check_mini"/>

            <div style="height: 34px;line-height: 34px;float:left">Carpeta actual: <strong><?php echo str_replace(dirname($config["upload_path"]), "", $config["upload_path"]) ?></strong><span id="current_folder"></span></div>
            <input type="hidden" name="current_img" id="current_img">
            <input type="hidden" name="file_type" id="file_type" value="<?php echo isset($_GET["Type"]) ? $_GET["Type"] : "Images"; ?>">
        </div>

        <div id="contenido">
            <table id="filemanager" border=0 cellspacing=0>
                <tr>
                    <td id="folder-browser"><ul id="tree"></ul></td>
                    <td id="thumbs"><ul></ul></td>
                </tr>
            </table>
        </div>

        <div id="uploadDiv">
            <!--<form target="oculto" method="post" action="php/ckimagemanager.php?&CKEditorFuncNum=<?php echo isset($_GET["CKEditorFuncNum"]) ? $_GET["CKEditorFuncNum"] : ""; ?>&Type=<?php echo isset($_GET["Type"]) ? $_GET["Type"] : ""; ?>" enctype="multipart/form-data">
                File: <input type="file" name="upload">
                <input type="hidden" name="dir" id="cur_dir">
            </form>-->
        </div>

        <!-- Create Folder Dialog -->
        <div id="newFolderDiv">
            Nombre carpeta: <input type="text" name="newFolder" id="newFolderText">
        </div>
        <!-- Create Folder Dialog -->

        <div id="ajaxLoader"></div>

        <div id="promptDialog">¿Está seguro de borrar el archivo seleccionado?</div>
        <div id="promptDialog2">
            Está segur@ de borrar el archivo <strong><span></span></strong>?.<br>
            Esto borrará la carpeta con todo el contenido.
        </div>

        <input type="hidden" name="fileToDelete" id="fileToDelete">
    </body>
</html>