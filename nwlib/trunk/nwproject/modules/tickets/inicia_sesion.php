<!DOCTYPE html>
<html>
    <head>
        <title>Inicia sesión</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                font-size: 14px;
                font-family: arial;
                color: #090909;
            }
            .container{
                position: relative;
                margin: auto;
                max-width: 1000px;
                margin-top: 30px;
                box-shadow: 0px 0px 5px #ccc;
                height: 100%;
                padding: 20px;
                box-sizing: border-box;
                border-radius: 5px;
            }
            .container h1{
                font-size: 20px;
                text-align: center;
            }
        </style>        
    </head>
    <body>
        <div class="container">
            <h1>
                Por favor, inicie sesión <a href='<?php echo $domain; ?>/?redirectionTo=<?php echo $_SERVER['REQUEST_URI']; ?>' target='_SELF'>aquí</a>.
            </h1>
        </div>
    </body>
</html>
