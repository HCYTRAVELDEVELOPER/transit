/**
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'links'},
        {name: 'insert'},
        {name: 'forms'},
        {name: 'tools'},
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'styles'},
        {name: 'colors'},
        {name: 'about'}
    ];

    // Remove some buttons, provided by the standard plugins, which we don't
    // need to have in the Standard(s) toolbar.
    //config.removeButtons = 'Underline,Subscript,Superscript';

    //config.extraAllowedContent = 'p(*)[*]{*};div[id];div(*)[*]{*};input(*)[*]{*}';
    config.extraAllowedContent = 'html body head';

    // Se the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    // Make dialogs simpler.
//    config.removeDialogTabs = 'image:advanced';

    config.width = '99%';

//    config.extraPlugins = 'autogrow,fixed,pastebase64,maximize,divarea';
//    config.extraPlugins = 'fixed';
//    config.extraPlugins = 'pastebase64';
//    config.extraPlugins = 'maximize';
//    config.extraPlugins = 'divarea';
//    config.extraPlugins = 'maximize';
//    config.extraPlugins = 'maximize,fixed,pastebase64,autogrow';
    config.autoGrow_onStartup = true;

    config.extraPlugins = 'link,fixed,pastebase64,lineheight,htmlwriter,dialogadvtab';
//sourcedialog
    //  config.removePlugins = 'sourcearea';

    //ON TESTING
    config.allowedContent = true;
    
    config.removeFormatAttributes = '';

//    config.allowedContent = {
//        $1: {
//            // Use the ability to specify elements as an object.
//            elements: CKEDITOR.dtd,
//            attributes: true,
//            styles: true,
//            classes: true
//        }
//    };

//    config.autoGrow_bottomSpace = 200;

    var dominio = document.domain;
    config.filebrowserImageBrowseUrl = 'http://' + dominio + '/nwlib6/includes/CKImageManager/CKImageManager.php?Type=Images';
    config.filebrowserFlashBrowseUrl = 'http://' + dominio + '/nwlib6/includes/CKImageManager/CKImageManager.php?Type=Flash';



    CKEDITOR.on('dialogDefinition', function (ev) {
        // Take the dialog name and its definition from the event data.
        var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;

        // Check if the definition is from the dialog window you are interested in (the "Link" dialog window).
        if (dialogName == 'link') {
            // Get a reference to the "Link Info" tab.
            var infoTab = dialogDefinition.getContents('advanced');

            // Set the default value for the URL field.
            var urlField = infoTab.get('advRel');
            if (urlField != null) {
                urlField[ 'default' ] = 'noopener noreferrer';
            }
        }
    });
};
