<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */
if (!session_id()) {
    session_start();
}

if (!isset($_SESSION["usuario"])) {
    echo "No puede ingresar";
    return;
}

ini_set('max_upload_filesize', 83886089999);
if ($_FILES["file"]["error"] > 0) {
    echo "Error: " . $_FILES["file"]["error"] . "<br />";
} else {
    move_uploaded_file($_FILES["file"]["tmp_name"], $_SERVER["DOCUMENT_ROOT"] . "/imagenes/" . $_FILES["file"]["name"]);
    echo "/imagenes/" . $_FILES["file"]["name"];
}
?>