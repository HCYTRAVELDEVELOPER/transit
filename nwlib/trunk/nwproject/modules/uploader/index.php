<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$conf = nwprojectOut::nwpMakerConfig();
if (isset($conf["version"])) {
    $v = $conf["version"];
} else {
    $v = nwMaker::random(5, 100000);
}
$conf["config"]["getcompressringow"] = "true";
$conf["config"]["datepicker"] = "false";
$conf["config"]["loadcenter"] = "false";
$conf["config"]["ringow_openform"] = "false";
?>
<!DOCTYPE html>
<html>
    <head>
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta charset="utf-8">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <title>UP!</title>
        <?php
        print nwMaker::includeCssNwMaker($conf["config"], $v);
        ?>
        <style>
            .footerButtonsNwForms{
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="f_example_form_popup"></div>
        <?php
        print nwMaker::includeJsNwMaker($conf["config"], $v);
        ?>
        <script>

            var callbackForChangeFile = function (r) {
                var get = getGET();
                var m = {};
                m.tipo = "uploaderFileFrame";
                m.data = r;
                m.field = get.nameInput;
                window.parent.postMessage(m, '*');
            };

            document.addEventListener("DOMContentLoaded", function () {
                var d = new f_example_form_popup();
                d.constructor();
            });

            function f_example_form_popup() {
                var get = getGET();
                var self = createDocument(".f_example_form_popup");
                var thisDoc = this;
                this.constructor = constructor;
                this.self = self;
                var accept_ext = false;
                if (evalueData(get.accept_ext) && accept_ext !== "") {
                    accept_ext = get.accept_ext;
                }
                function constructor(r) {
                    var fields = [
                        {
                            tipo: 'uploader',
//                            mode: 'images',
                            accept_ext: accept_ext,
                            nombre: '',
                            name: 'ruta'
                        }
                    ];
                    var typeForm = "nopopup";
                    createNwForms(self, fields, typeForm);
                    if (evalueData(get.data)) {
                        setValue(self, "ruta", get.data);
                    }
                }
            }

            window.addEventListener('message', function (e) {
                if (typeof e.data !== "undefined") {
                    var r = e.data;
                    if (r.tipo === "addCss") {
                        $("body").append("<style>" + r.css + "</style>")
                    } else
                    if (r.tipo === "addDataForm") {
                        setValue(".f_example_form_popup", "ruta", r.data);
                    }
                }
            });

        </script>
    </body>
</html>