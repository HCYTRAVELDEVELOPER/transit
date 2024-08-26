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
?>
<!DOCTYPE html>
<html lang="es-419">
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <script type="text/javascript">

            function llamar() {
                var data = {id: 1, titulo: 'Notificación de Andrés Flórez', texto: "Se ha generado una nueva notificación"};
                var str = JSON.stringify(data);
                injectedObject.nw_SendNotification(str);
                setInterval(function () {
                    var data = {id: 1, titulo: 'Notificación de XXXX', texto: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."};
                    var str = JSON.stringify(data);
                    injectedObject.nw_SendNotification(str);
                }, 15000);
            }

        </script>
        <meta charset="utf-8">
    </head>
    <body>
        <b>
            HOLA

            QUE PASA

            <?php
            echo rand();
            ?>
        </b>

        <input type="text" id="titulo" />

        <button onclick="javascript: llamar()" >Llamar</button>
    </body>
</html>