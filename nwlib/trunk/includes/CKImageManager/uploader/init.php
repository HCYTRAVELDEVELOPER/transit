<?
$var_root = "";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en" xml:lang="en">
    <head> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Subida de archivos avanzada</title>

        <meta name="author" content="Andrés Flórez" />
        <meta name="copyright" content="Copyright 2009 Andrés Flórez" />
        <!-- Framework CSS -->
        <link rel="stylesheet" href="<?php echo $var_root; ?>css/screen.css" type="text/css" media="screen, projection">
        <link rel="stylesheet" href="<?php echo $var_root; ?>css/print.css" type="text/css" media="print">
        <!--[if IE]><link rel="stylesheet" href="css/ie.css" type="text/css" media="screen, projection"><![endif]-->
        <!--[if lte IE 7]>
                <script type="text/javascript" src="js/firebug-lite-compressed.js"></script>
        <![endif]-->
        <script src="js/jquery.js"></script>
        <script type="text/javascript" src="<?php echo  $var_root; ?>js/main.js"></script>
        <script type="text/javascript" src="<?php echo  $var_root; ?>js/mootools.js"></script>
        <script type="text/javascript" src="<?php echo  $var_root; ?>source/Swiff.Uploader.js"></script>
        <script type="text/javascript" src="<?php echo  $var_root; ?>source/Fx.ProgressBar.js"></script>
        <!--<script type="text/javascript" src="http://github.com/mootools/mootools-more/raw/master/Source/Core/Lang.js"></script>-->
        <script type="text/javascript" src="<?php echo  $var_root; ?>source/FancyUpload2.js"></script>
        <!-- See script.js -->
        <script type="text/javascript">
            //<![CDATA[

            /**
             * FancyUpload Showcase
             *
             * @license		MIT License
             * @author		Harald Kirschner <mail [at] digitarald [dot] de>
             * @copyright	Authors
             */

            window.addEvent('domready', function() { // wait for the content

                // our uploader instance 

                var up = new FancyUpload2($('demo-status'), $('demo-list'), {// options object
                    // we console.log infos, remove that in production!!
                    verbose: true,
                    // url is read from the form, so you just have to change one place
                    url: $('form-demo').action,
                    // path to the SWF file
                    path: 'source/Swiff.Uploader.swf',
                    // remove that line to select all files, or edit it, add more items
                    typeFilter: {
                        'Imagenes-archivos (*.jpg, *.jpeg, *.gif, *.png, *.zip, *.rar, *.swf, *.flv)': '*.jpg; *.jpeg; *.gif; *.png; *.zip; *.rar; *.swf; *.flv'
                    },
                    // this is our browse button, *target* is overlayed with the Flash movie
                    target: 'demo-browse',
                    // graceful degradation, onLoad is only called if all went well with Flash
                    onLoad: function() {
                        $('demo-status').removeClass('hide'); // we show the actual UI
                        $('demo-fallback').destroy(); // ... and hide the plain form

                        // We relay the interactions with the overlayed flash to the link
                        this.target.addEvents({
                            click: function() {
                                return false;
                            },
                            mouseenter: function() {
                                this.addClass('hover');
                            },
                            mouseleave: function() {
                                this.removeClass('hover');
                                this.blur();
                            },
                            mousedown: function() {
                                this.focus();
                            }
                        });

                        // Interactions for the 2 other buttons

                        $('demo-clear').addEvent('click', function() {
                            up.remove(); // remove all files
                            return false;
                        });

                        $('demo-upload').addEvent('click', function() {
                            up.start(); // start upload
                            return false;
                        });
                    },
                    // Edit the following lines, it is your custom event handling

                    /**
                     * Is called when files were not added, "files" is an array of invalid File classes.
                     * 
                     * This example creates a list of error elements directly in the file list, which
                     * hide on click.
                     */
                    onSelectFail: function(files) {
                        files.each(function(file) {
                            new Element('li', {
                                'class': 'validation-error',
                                html: file.validationErrorMessage || file.validationError,
                                title: MooTools.lang.get('FancyUpload', 'removeTitle'),
                                events: {
                                    click: function() {
                                        this.destroy();
                                    }
                                }
                            }).inject(this.list, 'top');
                        }, this);
                    },
                    /**
                     * This one was directly in FancyUpload2 before, the event makes it
                     * easier for you, to add your own response handling (you probably want
                     * to send something else than JSON or different items).
                     */
                    onFileSuccess: function(file, response) {
                        var json = new Hash(JSON.decode(response, true) || {});

                        if (json.get('status') == '1') {
                            file.element.addClass('file-success');
                            file.info.set('html', '<strong>Imagen subida:</strong> ' + json.get('width') + ' x ' + json.get('height') + 'px, <em>' + json.get('mime') + '</em>)');
                        } else {
                            file.element.addClass('file-failed');
                            file.info.set('html', '<strong>Ocurrió un error:</strong> ' + (json.get('error') ? (json.get('error') + ' #' + json.get('code')) : response));
                        }
                    },
                    /**
                     * onFail is called when the Flash movie got bashed by some browser plugin
                     * like Adblock or Flashblock.
                     */
                    onFail: function(error) {
                        switch (error) {
                            case 'hidden': // works after enabling the movie and clicking refresh
                                alert('Para conectar el importador de archivos, desbloquéelo en su browser y actualize.');
                                break;
                            case 'blocked': // This no *full* fail, it works after the user clicks the button
                                alert('Para conectar el importador de archivos, conecte la aplicación para Flash).');
                                break;
                            case 'empty': // Oh oh, wrong path
                                alert('Un archivo requerido no se encontró. Por favor inténtelo más tarde.');
                                break;
                            case 'flash': // no flash 9+ :(
                                alert('Para conectar el importador de archivos, install the último plugin Adobe Flash.')
                        }
                    }

                });

            });
            //]]>
        </script>
        <!-- See style.css -->
        <style type="text/css">
            /**
* FancyUpload Showcase
*
* @license		MIT License
* @author		Harald Kirschner <mail [at] digitarald [dot] de>
* @copyright	Authors
            */

            /* CSS vs. Adblock tabs */
            .swiff-uploader-box a {
                display: none !important;
            }

            /* .hover simulates the flash interactions */
            a:hover, a.hover {
                color: red;
            }

            #demo-status {
                padding: 10px 15px;
                width: 420px;
                border: 1px solid #eee;
            }

            #demo-status .progress {
                background: url(<?php echo  $var_root; ?>assets/progress-bar/progress.gif) no-repeat;
                background-position: +50% 0;
                margin-right: 0.5em;
                vertical-align: middle;
            }

            #demo-status .progress-text {
                font-size: 0.9em;
                font-weight: bold;
            }

            #demo-list {
                list-style: none;
                width: 450px;
                margin: 0;
            }

            #demo-list li.validation-error {
                padding-left: 44px;
                display: block;
                clear: left;
                line-height: 40px;
                color: #8a1f11;
                cursor: pointer;
                border-bottom: 1px solid #fbc2c4;
                background: #fbe3e4 url(<?php echo  $var_root; ?>assets/failed.png) no-repeat 4px 4px;
            }
            #demo-list li.file {
                border-bottom: 1px solid #eee;
                background: url(<?php echo  $var_root; ?>assets/file.png) no-repeat 4px 4px;
                overflow: auto;
            }
            #demo-list li.file.file-uploading {
                background-image: url(<?php echo  $var_root; ?>assets/uploading.png);
                background-color: #D9DDE9;
            }
            #demo-list li.file.file-success {
                background-image: url(<?php echo  $var_root; ?>assets/success.png);
            }
            #demo-list li.file.file-failed {
                background-image: url(<?php echo  $var_root; ?>assets/failed.png);
            }
            #demo-list li.file .file-name {
                font-size: 1.2em;
                margin-left: 44px;
                display: block;
                clear: left;
                line-height: 40px;
                height: 40px;
                font-weight: bold;
            }
            #demo-list li.file .file-size {
                font-size: 0.9em;
                line-height: 18px;
                float: right;
                margin-top: 2px;
                margin-right: 6px;
            }
            #demo-list li.file .file-info {
                display: block;
                margin-left: 44px;
                font-size: 0.9em;
                line-height: 20px;
                /*clear*/
            }

            #demo-list li.file .file-remove {
                clear: right;
                float: right;
                line-height: 18px;
                margin-right: 6px;
            }	</style>
    </head>
    <body>

        <div class="container" style="margin:0 auto 0 auto; width: 500px;">
            <br />
            <h2>Subida múltiple de archivos</h2>
            <div>
                <form action="<?php echo  $var_root; ?>server/script.php" method="post" enctype="multipart/form-data" id="form-demo">

                    <input type="hidden" id="folder" name="folder" value="<?php echo  $_GET["folder"]; ?>" />

                    <fieldset id="demo-fallback">
                        <legend>Subida de archivos</legend>
                        <label for="demo-photoupload">
                            Suba una foto:
                            <input type="file" name="Filedata" />
                        </label>
                    </fieldset>

                    <div id="demo-status" class="hide">
                        <p>
                            <a href="#" id="demo-browse" style="cursor: pointer">Subir archivos</a> |
                            <a href="#" id="demo-clear">Limpiar lista</a> |
                            <a href="#" id="demo-upload" style="font-size: 14px; color: red;"><b>Empezar a subir</b></a>
                        </p>
                        <div>
                            <strong class="overall-title"></strong><br />
                            <img src="<?php echo  $var_root; ?>assets/progress-bar/bar.gif" class="progress overall-progress" />
                        </div>
                        <div>
                            <strong class="current-title"></strong><br />
                            <img src="<?php echo  $var_root; ?>assets/progress-bar/bar.gif" class="progress current-progress" />
                        </div>
                        <div class="current-text"></div>

                        <div style="text-align: right; font-size: 16px;">
                            <a href="javascript: cierra('<?php echo  $_GET["folder"]; ?>');" class="close_uploader">
                                Cerrar
                            </a>
                        </div>
                    </div>
                    <ul id="demo-list"></ul>
                </form>		
            </div>
        </div>
    </body>
</html>
