$(document).ready(function() {
    $(window).bind('scroll', function(e) {
        parallaxScroll();
    });

    var array = {};
    array[0] = {};
    array[0]["div"] = ".parallax-bg1";
    array[0]["movimiento"] = "left";
    array[0]["distancia"] = "100";
    array[0]["multiplica"] = ".20";

});


function parallaxScrollAll(array) {

    //alert("fdsafdsa");

    console.log(array);


//    $('.parallax-bg1').css('left', (100 - (scrolled * .20)) + 'px');

    var total = array.lenght;
    if (total > 0) {

        var scrolled = $(window).scrollTop();

        for (var i = 0; i < total; i++) {
            var r = array[i];
            var div = r["div"];
            var movimiento = r["movimiento"];
            var distancia = r["distancia"];
            var multiplica = r["multiplica"];


            $(div).css(movimiento, (distancia - (scrolled * multiplica)) + 'px');

        }
    }

}