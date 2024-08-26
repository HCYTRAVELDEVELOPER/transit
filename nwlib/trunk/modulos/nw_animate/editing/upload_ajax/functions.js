$(document).ready(function() {
    $(".messages").hide();
    var fileExtension = "";
    //función que observa los cambios del campo file y obtiene información
    $(':file').change(function() {
        //obtenemos un array con los datos del archivo
        var file = $("#imagen")[0].files[0];
        //obtenemos el nombre del archivo
        var fileName = file.name;
        //obtenemos la extensión del archivo
        fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        //obtenemos el tamaño del archivo
        var fileSize = file.size;
        //obtenemos el tipo de archivo image/png ejemplo
        var fileType = file.type;
        //mensaje con la información del archivo
        showMessage("<span class='info'>Archivo para subir: " + fileName + ", peso total: " + fileSize + " bytes.</span>");
        subeFile();
    });
    //al enviar el formulario
    $(':button').click(function() {
        subeFile();
    });
});
function subeFile() {
    //información del formulario
    var formData = new FormData($(".formulario")[0]);
    var message = "";
    //hacemos la petición ajax  
    $.ajax({
        url: 'upload.php',
        type: 'POST',
        // Form data
        //datos del formulario
        data: formData,
        //necesario para subir archivos via ajax
        cache: false,
        contentType: false,
        processData: false,
        //mientras enviamos el archivo
        beforeSend: function() {
            $(".bgBl").fadeIn(); 
            message = $("<span class='before'>Subiendo la imagen, por favor espere...</span>");
            showMessage(message)
        },
        //una vez finalizado correctamente
        success: function(data) {
            pasa_dato(data);
            $(".bgBl").fadeOut();
            message = $("<span class='success'>La imagen ha subido correctamente .</span>");
            showMessage(message);
//                if(isImage(fileExtension))
//                {

            $(".showImage").html("<img src='/imagenes/" + data + "' />");

//                }
        },
        //si ha ocurrido un error
        error: function() {
            message = $("<span class='error'>Ha ocurrido un error.</span>");
            showMessage(message);
        }
    });
}
//como la utilizamos demasiadas veces, creamos una función para 
//evitar repetición de código
function showMessage(message) {
    $(".messages").html("").show();
    $(".messages").html(message);
}
//comprobamos si el archivo a subir es una imagen
//para visualizarla una vez haya subido
function isImage(extension) {
    switch (extension.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'png':
        case 'jpeg':
        case 'ods':
        case 'zip':
        case 'docx':
        case 'doc':
        case 'xlsx':
        case 'pdf':
            return true;
            break;
        default:
            return false;
            break;
    }
}