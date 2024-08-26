<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
print nwprojectOut::getNwMakerLib();
?>
<!DOCTYPE html>
<html>
    <head>
        <title>NwForms</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link href='/nwlib6/nwproject/modules/nwforms/css/nwformsMaker2.css?v=1' rel='stylesheet' type='text/css' />
        <script>
            $(document).ready(function () {
                loadJs("/nwlib6/nwproject/modules/nwforms/js/main2.js", function () {
                    var get = getGET();
                    var d = new nwFormsMaker(get.form);
                    d.constructor();
                }, false, true);
            });
        </script>
    </head>
    <body>
        <div class="containerNwForm">
            <div class="nwFormsMaker"></div>
        </div>
    </body>
</html>
