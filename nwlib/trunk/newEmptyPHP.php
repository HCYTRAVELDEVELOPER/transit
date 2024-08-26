<!doctype html>         
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>jQuery UI Datepicker - Default functionality</title>
        <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script>
            $(function () {
                $("#fecha").datepicker({
                    dateFormat: "HH:ii:ss",
                    showOn: "button",
                    buttonImage: "/nwlib6/icons/calendar.gif",
                    buttonImageOnly: false,
                    buttonText: "Seleccionar fecha",
                    showWeek: true,
                    firstDay: 1
                });
            });
        </script>
    </head>
    <body>
        <p>Date: <input type="text" id="fecha"></p>


    </body>
</html>