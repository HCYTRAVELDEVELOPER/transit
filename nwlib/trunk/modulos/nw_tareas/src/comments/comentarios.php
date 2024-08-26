<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/utiles.php';

function timesince($original) {
    $ta = array(
        array(31536000, "Año", "Años"),
        array(2592000, "Mes", "Meses"),
        array(604800, "Semana", "Semanas"),
        array(86400, "Día", "Días"),
        array(3600, "Hora", "Horas"),
        array(60, "Minuto", "Minutos"),
        array(1, "Segundo", "Segundos")
    );
    $since = time() - $original;
    $res = "";
    $lastkey = 0;
    for ($i = 0; $i < count($ta); $i++) {
        $cnt = floor($since / $ta[$i][0]);
        if ($cnt != 0) {
            $since = $since - ($ta[$i][0] * $cnt);
            if ($res == "") {
                $res .= ( $cnt == 1) ? "1 {$ta[$i][1]}" : "{$cnt} {$ta[$i][2]}";
                $lastkey = $i;
            } else if ($ta[0] >= 60 && ($i - $lastkey) == 1) {
                $res .= ( $cnt == 1) ? " y 1 {$ta[$i][1]}" : " y {$cnt} {$ta[$i][2]}";
                break;
            } else {
                break;
            }
        }
    }
    return $res;
}
?>
<style type="text/css">

    .commentbox{
        background-color: #ececec;
        width: 450px;
        padding: 10px;
    }

    .commentfooter{
        background: url(/nwproject/php/modulos/nwcommerce/images/comment.gif) 280px 0 no-repeat; /*20px 0 equals horizontal and vertical position of arrow. Adjust as desired (ie: 20px -5px).*/
        margin-left: -100px;
        padding-top: 1px;
        font-size: 90%;
        color: #4A4A4A;
    }

    .comment_answer{
        margin-left: 100px;
        background-color: darkorange;
        width: 300px;
    }

</style>
<br />
<br />
<br />

<?php
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);

$sql = "select * from nc_comments where product=:product_id ";

$ca->prepare($sql);
$ca->bindValue(":product_id", $_POST["producto"]);

if (!$ca->exec()) {
    echo "No se pudieron consultar los comentarios. ";
}
?>
<h3 style="color: #999;
font-size: 13px;
font-family: Arial;
font-weight: normal;">Comentarios: Mostrando <?php echo $ca->size(); ?> <?php
if ($ca->size() == 1) {
    echo "resultado";
} else {
    echo "resultados";
}
?></h3>
<?php
for ($i = 0; $i < $ca->size(); $i++) {

    $ca->next();

    $comentarios = $ca->assoc();

    $user = explode("@", $comentarios["mail"]);
    $hora = strtotime($comentarios["date"]);
    $hora = timesince($hora);
    ?>
    <br />
    <div class="commentbox">
        <br />
        <?php if ($comentarios["url"] != null) { ?>
            <font face="Arial" color="gray">Página web: <a target="blank" style="text-decoration: underline;" href="http://<?php echo $comentarios["url"]; ?>" ><?php echo $comentarios["url"]; ?></a>, </font>
        <?php } ?>
        <font style="color: #CC0000;">Escrito hace <?php echo $hora; ?></font>
        <br />
        <br />
        <?php
        echo '<font face="Arial">';
        echo $comentarios["comment"];
        echo '</font>';
        echo '<br />';
        echo '<hr>';
        ?>
    </div>
    <div class="commentfooter"><font face="Arial" color="gray">Por: <?php echo $user[0]; ?></font></div>



    <?php if ($comentarios["answer"] != "") { ?>
        <div class="comment_answer">
            <?php
            echo '<font face="Arial">';
            echo "<strong>Respuesta por: Administrador</strong>";
            echo "<br />";
            echo $comentarios["answer"];
            echo '</font>';
            echo '<br />';
            echo '<hr>';
            ?>
        </div>
        <?php
    }
}
?>

<br />
<br />
<h3 style="color: #999;
font-size: 13px;
font-family: Arial;
font-weight: normal;
text-align: left;">¿Tienes preguntas?</h3>
<form action="javascript: agregar_comentario();" method="post" id="form_comentario" name="form_comentario">
    <input id="id_product_comment" name="id_product_comment" type="hidden" value="<?php echo $_POST["producto"]; ?>" />
    <table border="0" style="width: 650px; text-align: center;">
        <tr>
            <td id="mail_comentarios" style="color: #CC0000; display: none;" align="center">
                Ingrese su E-mail (No será publicado):
                <input size="50" id="mail" name="mail" type="text" class="required email"/>
            </td>
        </tr>
        <tr>
            <td>
                <textarea cols="78" rows="5" id="comentario" onfocus="if (this.value == 'Ingresa tu pregunta') {this.value = '';}" onblur="if (this.value == '') {this.value = 'Ingresa tu pregunta';}" name="comentario" class="required" style="padding: 8px;
margin: 0px 0px 0px 10px;
border-color: #CCC;
width: 617.5px;
height: 130px;
font-size: 14px;
font-family: Arial, Helvetica, sans-serif;
display: block;
color: #999;">Ingresa tu pregunta</textarea>
            </td>
        </tr>
        <tr>
            <td style="color: #999;
font-size: 13px;
font-family: Arial;
font-weight: normal;">
                Puede ingresar su URL (<label style="color: #CC0000;">opcional</label>):
                <input type="text" size="50" id="url" name="url" style="padding: 4px 8px;
margin: 0px 0px 0px 10px;
border: 1px solid #CCC;
width: 250px;
font-weight: bold;
font-size: 14px;
font-family: Arial, Helvetica, sans-serif;"/>
            </td>
        </tr>
        <tr>
            <td align="right">
        <center>
            <button style="width: 120px;font-size: 14px;height: 35px;padding: 0px;font: bold 12px/35px Arial, Helvetica, sans-serif;text-align: center;white-space: nowrap;color: white;background: #B0B0B0;border: none;margin: 12px; cursor: pointer;" onclick="javascript: mail_function();" 
                    type="button" value="Comentar"><span>Enviar</span>
            </button>
        </center>
        </td>
        </tr>
        <tr>
            <td style="color: #999;
font-size: 11px;
font-family: Arial;
font-weight: normal; text-align:justify;">
                <p>
                Normas de uso:
                Esta es la opinión de los internautas, no de <?php echo str_replace("www.", "", $_SERVER["HTTP_HOST"]); ?>.
                No está permitido registrar comentarios contrarios a las leyes Colombianas o injuriantes.
                Reservado el derecho a eliminar los comentarios que consideremos fuera de tema.
                </p>
            </td>
        </tr>
    </table>
</form>
<hr />

<script language="javascript" type="text/javascript">
    $(document).ready(function(){
        $("#form_comentario").validate();
    });

    function agregar_comentario(){

        if ($("#mail").val()==""){
            return;
        }
        
        var str = $("#form_comentario").serialize();
        $.ajax({
            url: '/nwproject/php/modulos/nwcommerce/src/comentarios/agregar_comentarios.php',
            data: str,
            type: 'post',
            success: function(data){
                if(data != "")
                    alert(data);
                cargar_comentarios('<?php echo $_POST["producto"]; ?>');
            }
        });
    };

    function mail_function(){
        $("#mail_comentarios").show();
        $("#form_comentario").submit();
    }
</script>