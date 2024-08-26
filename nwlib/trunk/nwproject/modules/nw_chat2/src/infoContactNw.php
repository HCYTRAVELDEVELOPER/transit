<?php
$usedOutNwlib = true;
include $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$id = master::clean($_GET["id"]);
$r = soporte::getInfoContact($id);
?>
<!DOCTYPE html>
<html>
    <head>
        <title>NwChat Info</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
    </head>
    <body>
        <style>
            body {
                position: relative;
                font-size: 12px;
                background: #fff;
                margin: 0;
                padding: 0;
                font-family: arial;
            }
            #container {
                position: relative;
                margin: 5px;
                padding: 1px;
            }
            h3 {
                font-size: 12px;
                margin: 0;
                padding: 0;
            }
            p {
                margin: 4px 0px;
                padding: 0;
            }
        </style>
    </div>
    <div id="container">
        <h3>
            Información
        </h3>
        <?php echo $r["info_site"]; ?>
    </div>
</body>
</html>