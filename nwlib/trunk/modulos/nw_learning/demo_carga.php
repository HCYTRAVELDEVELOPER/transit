

<script type='text/javascript'>
// Variables para controlar el inicio y termino de la cuenta
var inicio = false;
var termino = false;
 
// Variables editables, para personalizar la barra de porcentaje
var tam_barra = 280;	// Tamaño de la barra en pixeles
var seg_barra = 6;		// Segundos de trabajo hasta 100%
 
// Se toma la diferencia con respecto el tiempo actual
var date = new Date();
var milisec_barra = seg_barra * 1000;
var milisec_final = date.getTime() + milisec_barra;
 
// Funcion que inicia el proceso
function iniciar_proceso()
{
	// Solo si no a iniciado el proceso se inicia
	if (inicio == false)
	{
		inicio = true;
  		aumenta_barra();
	}
}
 
// Funcion que aumenta el porcentaje de la barra
function aumenta_barra()
{
	// Solo si no a terminado sigue aumentando
	if (termino == false)
	{
		// Se toma el tiempo actual
		var ahora = new Date();
	    milisec_ahora = ahora.getTime();
 
		// Se toma el tiempo restante para llegar a 100%
	    var milisec_restante = Math.ceil((milisec_final - milisec_ahora) / 100);
	    if (milisec_restante < 0)
		{
			milisec_restante = 0;
		}
 
		// Se divide el tiempo restante en horas, minutos y segundos
		var horas = Math.floor(milisec_restante / 36000);
		var minutos = Math.floor(milisec_restante % 36000 / 600);
		var segundos = Math.floor(milisec_restante % 36000 % 600) / 10;
		if ((segundos % 1) == 0)
		{
			segundos = segundos + ".0";
		}
		var salida;
		if (horas > 0)
		{
			var salida = horas + " horas, " + minutos + " minutos y " + segundos + " segundos.";
		}
		else
		{
			if (minutos > 0)
			{
				var salida = minutos + " minuto(s) y " + segundos + " segundos.";
			}
			else
			{
			 	var salida = segundos + " segundos.";
			}
		}
 
		// Se genera el porcentaje a partir del tiempo restante para el 100%
		milisec_restante = Math.floor(milisec_restante) / 10;
	    var porcentaje = Math.floor(((milisec_barra - milisec_restante * 1000) / milisec_barra) * 100);
	    if (porcentaje < 0)
		{
			porcentaje = 1;
		}
 
		// Se verifica si se llego al tiempo final
		if (milisec_final >= milisec_ahora)
		{
			// Si aun no termina solo se muestra el porcentaje
			document.getElementById("div_boton").innerHTML = salida;
			document.getElementById("div_barra").innerHTML = porcentaje + "%";
	    }
		else
		{
			// Si termina se puede continuar mostrando o enviando alguna informacion
			termino = true;
			/*document.forma.submit();*/ // Mandar que termino el trabajo para permitir continuar
			document.getElementById("div_barra").innerHTML = "100% listo";
			document.getElementById("div_boton").innerHTML = "<input class='form' type='button' value='Continuar'>";
		}
      	document.getElementById("div_completado").style.width = (porcentaje / 100) * tam_barra + "px";
		setTimeout("aumenta_barra();", 100);
	}
}
 
// Se inicia el proceso despues de 300 milisegundos, se puede editar
window.setTimeout("iniciar_proceso()", 300);
</script>
<style type="text/css">
div#vacio
{
	background-color: #e4e4e4;
	border: 1px solid black;
	width: 280px;
	padding: 0px;
	padding-top: 0px;
	padding-left: 0px;
	padding-right: 0px;
	padding-bottom: 0px;
}
 
div#div_completado
{
	position: relative;
	top: 0px;
	left: 0px;
	background-color: #9af;
	width: 0px;
	padding-top: 5px;
	padding: 0px;
}
 
div#div_barra
{
	position: relative;
	top: 0px;
	left: 2px;
	color: #000;
	padding: 0px;
	padding-top: 0px;
	font-family: Verdana, Geneva, sans-serif;
	font-size: 14px;
}
 
div#div_boton
{
	position: relative;
	top: 0px;
	left: 0px;
	height: 30px;
	text-align: center;
	padding: 0px;
	padding-top: 5px;
	font-family: Verdana, Geneva, sans-serif;
	font-size: 14px;
}
</style>
<div align="center">
    <div id="vacio" align="left">
        <div id="div_completado">
            <div id="div_barra"></div>
        </div>
    </div>
    <div id="div_boton"></div>
</div>