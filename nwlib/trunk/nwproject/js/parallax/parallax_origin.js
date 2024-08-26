$(document).ready(function() {

//    redrawDotNav();

    /* Scroll event handler */
    $(window).bind('scroll', function(e) {
        parallaxScroll();
//        redrawDotNav();
    });

    /* Next/prev and primary nav btn click handlers */
    $('a.manned-flight').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1000, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });
    $('a.frameless-parachute').click(function() {
        $('html, body').animate({
            scrollTop: $('#frameless-parachute').offset().top
        }, 1000, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });
    $('a.english-channel').click(function() {
        $('html, body').animate({
            scrollTop: $('#english-channel').offset().top
        }, 1000, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });
    $('a.about').click(function() {
        $('html, body').animate({
            scrollTop: $('#about').offset().top
        }, 1000, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });

    /* Show/hide dot lav labels on hover */
    $('nav#primary a').hover(
            function() {
                $(this).prev('h1').show();
            },
            function() {
                $(this).prev('h1').hide();
            }
    );

});

/* Scroll the background layers */
//function parallaxScroll() {
//    var scrolled = $(window).scrollTop();
//    var scrolledL = $(window).scrollLeft();
////    $('#parallax-bg1').css('top', (0 - (scrolled * .25)) + 'px');
////    $('#parallax-bg2').css('top', (0 - (scrolled * .5)) + 'px');
////    $('#parallax-bg3').css('top', (0 - (scrolled * .75)) + 'px');
//    $('.parallax-bg1').css('top', (100 - (scrolled * .20)) + 'px');
//    $('.parallax-bg1').css('left', (100 - (scrolled * .20)) + 'px');
//    $('#parallax-bg2').css('top', (80 - (scrolled * .10)) + 'px');
//    $('#parallax-bg3').css('top', (400 - (scrolled * .5)) + 'px');
//    $('.parallax-bg4').css('top', (550 - (scrolled * .5)) + 'px');
//    $('.parallax-bg5').css('right', (0 - (scrolled * .10)) + 'px');
////    $('.parallax-bg6').css('top', (700 - (scrolled * .5)) + 'px');
//    $('.parallax-bg6').css('left', (400 - (scrolled * .1)) + 'px');
////    $('.parallax-bg7').css('left', (1080 - (scrolled * .5)) + 'px');
////    $('.parallax-bg7').css('top', (1700 - (scrolled * .5)) + 'px');
//    $('.parallax-bg7').css('top', (1100 - (scrolled * .5)) + 'px');
//    $('.object_36').css('top', (2200 - (scrolled * .5)) + 'px');
//    $('.object_37').css('top', (700 - (scrolled * .2)) + 'px');
//    $('.object_79').css('top', (2500 - (scrolled * .5)) + 'px');
//}

/* Set navigation dots to an active state as the user scrolls */
//function redrawDotNav() {
//
//    return;
//
//    var section1Top = 0;
//    // The top of each section is offset by half the distance to the previous section.
//    var section2Top = $('#frameless-parachute').offset().top - (($('#english-channel').offset().top - $('#frameless-parachute').offset().top) / 2);
//    var section3Top = $('#english-channel').offset().top - (($('#about').offset().top - $('#english-channel').offset().top) / 2);
//    var section4Top = $('#about').offset().top - (($(document).height() - $('#about').offset().top) / 2);
//    ;
//    $('nav#primary a').removeClass('active');
//    if ($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top) {
//        $('nav#primary a.manned-flight').addClass('active');
//    } else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top) {
//        $('nav#primary a.frameless-parachute').addClass('active');
//    } else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top) {
//        $('nav#primary a.english-channel').addClass('active');
//    } else if ($(document).scrollTop() >= section4Top) {
//        $('nav#primary a.about').addClass('active');
//    }
//
//}
