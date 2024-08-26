/*************************************************************************
 
 Copyright:
 2012 Netwoods, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez
 
 ************************************************************************ */

/**
 * Manage the configuration of all program. i.e icons, fonts size, colors, and others. When
 * you update a property, the program try to update all the configuration and store the nre configuration 
 * on client side.
 */

qx.Class.define("qxnw.config", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    type: "singleton",
    /*
     * The icon size
     */
    properties: {
        manyCompanies: {
            init: 0
        },
        encodeRpcBase64: {
            init: false
        },
        nwlibVersionStr: {
            init: "{nwlib_version}"
        },
        qxnwVersionStr: {
            init: "{qxnw_version}"
        },
        syncLocalSettings: {
            init: false
        },
        showDestroyObjects: {
            init: true
        },
        showRpcDebug: {
            init: false
        },
        showStorageDebug: {
            init: false
        },
        showTips: {
            init: false
        },
        urlOut: {
            init: null
        },
        locales: {
            init: [
                {
                    name: "es",
                    realName: "Español/españa",
                    icon: "es",
                    label: "Español",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "es_co",
                    realName: "Colombia",
                    icon: "co",
                    label: "Español / Colombia",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "es_CO",
                    realName: "Colombia",
                    icon: "co",
                    label: "Español / Colombia",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "es_419",
                    realName: "Español / latinoamérica",
                    icon: "es",
                    label: "Español / latinoamérica",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "es_MX",
                    realName: "Español / México",
                    icon: "us",
                    label: "Español / México",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "es_us",
                    realName: "Español / Estados Unidos",
                    icon: "us",
                    label: "Español/USA",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "$"
                },
                {
                    name: "en",
                    realName: "Estados Unidos",
                    icon: "us",
                    label: "Inglés / USA",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "USD"
                },
                {
                    name: "es_SV",
                    realName: "El Salvador",
                    icon: "es_SV",
                    label: "Español / El Salvador",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "USD"
                },
                {
                    name: "es_sv",
                    realName: "El Salvador",
                    icon: "es_SV",
                    label: "Español / El Salvador",
                    iconType: "qxnw",
                    formatDate: "yyyy-mm-dd",
                    dateTimeFormat: "yyyy-MM-dd H:mm",
                    dateFormat: "yyyy-MM-dd",
                    cldr_date_format_short: "yyyy-MM-dd",
                    cldr_date_format_medium: "yyyy-MM-dd",
                    cldr_date_format_full: "yyyy-MM-dd",
                    cldr_date_format_long: "yyyy-MM-dd",
                    cldr_date_time_format_short: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_medium: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_full: "yyyy-MM-dd HH:mm:ss",
                    cldr_date_time_format_long: "yyyy-MM-dd HH:mm:ss",
                    currency: "USD"
                }
            ]
        },
        widgetsDisp: {
            init: [{"textField": "TextField"}, {"address": "Adress"}, {"uploader_multiple": "Uploader Multiple"},
                {"colorButton": "Color Button"}, {"label": "Label"}, {"colorPopup": "Color Popup"}, {"camera": "Camera"}, {"image": "image"},
                {"ckeditor": "CkEditor"}, {"uploader": "Uploader"}, {"uploader_images": "Uploader Images"}, {"timeField": "Time Field"},
                {"radioButton": "Radio Button"}, {"textFieldSearch": "textFieldSearch"}, {"button": "Button"}, {"textField": "textField"},
                {"selectBox": "SelectBox"}, {"passwordField": "passwordField"}, {"dateField": "dateField"}, {"dateTimeField": "dateTimeField"},
                {"dateChooser": "dateChooser"}, {"textArea": "textArea"}, {"spinner": "spinner"}, {"tokenField": "tokenField"}, {"checkBox": "checkBox"},
                {"selectListCheck": "selectListCheck"}, {"selectTokenField": "selectTokenField"}, {"listCheck": "listCheck"}, {"radioCheck": "radioCheck"}]
        },
        dataType: {
            init: [{"BIGINT": "BIGINT"}, {"BIGSERIAL": "BIGSERIAL"}, {"BIT": "BIT"}, {"BIT VARYING": "BIT VARYING"}, {"BOOLEAN": "BOOLEAN"},
                {"BOX": "BOX"}, {"CHAR": "CHAR"}, {"CIDR": "CIDR"}, {"CIRCLE": "CIRCLE"}, {"DATE": "DATE"},
                {"DOUBLE PRECISION": "DOUBLE PRECISION"}, {"INET": "INET"}, {"INTEGER": "INTEGER"}, {"INTERVAL": "INTERVAL"},
                {"LINE": "LINE"}, {"MARCADOR": "MARCADOR"}, {"MONEY": "MONEY"}, {"NUMERIC": "NUMERIC"},
                {"PATH": "PATH"}, {"POINT": "POINT"}, {"POLYGON": "POLYGON"}, {"SERIAL": "SERIAL"}, {"SMALLINT": "SMALLINT"}, {"TEXT": "TEXT"},
                {"TIME": "TIME"}, {"TIMESTAMP": "TIMESTAMP"}, {"TIMESTAMPTZ": "TIMESTAMPTZ"}, {"TSQUERY": "TSQUERY"},
                {"TSVECTOR": "TSVECTOR"}, {"VARCHAR": "VARCHAR"}]
        },
        signerModel: {
            init: "TOPAZ", // EPADLINK
            check: "String"
        },
        phpThumbQuality: {
            init: "50",
            check: "String"
        },
        phpThumbPath: {
            init: "/nwlib%version%/includes/phpthumb/phpThumb.php?src=",
            check: "String"
        },
        connected: {
            init: true,
            check: "Boolean"
        },
        seassonMessage: {
           // init: ":: <a title='Desarrollo de software' style='color: green;' target='_blank' href='https://www.gruponw.com/social-responsability'>Juntos por un mundo mejor</a> ",
          //  check: "String"
        },
        devMessage: {
            init: ":: Great power comes great responsibility ::",
            check: "String"
        },
        isSwitchedTheme: {
            init: false,
            check: "Boolean"
        },
        resizeMainLeftMenu: {
            init: true,
            check: "Boolean"
        },
        isLoadedQxnw_soft: {
            init: false,
            check: "Boolean"
        },
        addNewSubWindows: {
            init: true,
            check: "Boolean"
        },
        isGoogleMapsLoaded: {
            init: false,
            check: "Boolean"
        },
        isCkeditorLoaded: {
            init: false,
            check: "Boolean"
        },
        isJitsiLoaded: {
            init: false,
            check: "Boolean"
        },
        showInformationOnValidate: {
            init: false,
            check: "Boolean"
        },
        prefixPath: {
            init: "",
            check: "String"
        },
        savePositionForm: {
            init: true,
            check: "Boolean"
        },
        menuStyle: {
            init: "horizontal",
            check: "String"
        },
        maxShowRows: {
            init: 5000,
            check: "Integer"
        },
        timeChatRequest: {
            init: 10000,
            check: "integer"
        },
        timeUsersChatRequest: {
            init: 15000,
            check: "integer"
        },
        cleanCacheAtFirst: {
            init: false,
            check: "Boolean"
        },
        iconSize: {
            init: 16,
            check: "Integer"
        },
        fontSize: {
            init: 12,
            check: "Integer"
        },
        fontFamilys: {
            init: ["Tahoma", "Liberation Sans", "Arial", "sans-serif"]
        },
        fontAcceptedFamilys: {
            init: ["Tahoma", "Liberation Sans", "Arial", "sans-serif"]
        },
        iconAcceptedSizes: {
            init: new Array(16, 22, 32, 48, 64, 128)
        },
        fontAcceptedSizes: {
            init: new Array(7, 8, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30)
        },
        iconsPath: {
            init: "qx/icon/Tango/%size%/%type%/",
            check: "String"
        },
        iconsQXNWPath: {
            //ROOT CHANGE TO NOT RELATIVE
            init: "/nwlib#/icons/%size%/",
            check: "String"
        },
        iconsCategories: {
            init: new Array("actions", "apps", "categories", "devices", "emblems", "emotes", "mimetypes", "places, status")
        },
        iconsCategories2DArray: {
            init: [{"actions": "Acciones"}, {"apps": "Aplicaciones"}, {"categories": "Categorías"},
                {"devices": "Dispositivos"}, {"emblems": "Emblemas"}, {"emotes": "Emoticones"}, {"mimetypes": "Contenidos"},
                {"places": "Lugares"}, {"status": "Estatus"}]
        },
        sendErrorFlag: {
            init: true,
            check: "Boolean"
        },
        showErrorResponse: {
            init: true,
            check: "Boolean"
        },
        treeLeftWidget: {
            init: false,
            check: "Boolean"
        },
        soundStart: {
            init: true,
            check: "Boolean"
        },
        soundChat: {
            init: true,
            check: "Boolean"
        },
        showErrorDialogs: {
            init: true,
            check: "Boolean"
        },
        showDetError: {
            init: true,
            check: "Boolean"
        },
        shakeOnValidate: {
            init: true,
            check: "Boolean"
        },
        saveLists: {
            init: true,
            check: "Boolean"
        },
        sendOnEnter: {
            init: true,
            check: "Boolean"
        },
        showInitialPage: {
            init: false,
            check: "Boolean"
        },
        rpcTimeout: {
            init: 20000000,
            check: "Integer"
        },
        chatNumberMessages: {
            init: 10,
            check: "Integer"
        },
        showChatAtInit: {
            init: false,
            check: "Boolean"
        },
        startAlertsAtInit: {
            init: false,
            check: "Boolean"
        },
        hideButtonsText: {
            init: false,
            check: "Boolean"
        },
        showLogo: {
            init: true,
            check: "Boolean"
        },
        randomColors: {
            init: null,
            check: "Array"
        },
        notifications: {
            init: true,
            check: "Boolean"
        },
        notificationsType: {
            init: "W3C",
            check: "String"
        },
        notificationsSound: {
            init: false,
            check: "Boolean"
        },
        notificationsAnimation: {
            init: true,
            check: "Boolean"
        },
        searchOnInput: {
            init: true,
            check: "Boolean"
        },
        timeNotifications: {
            init: 1000000,
            check: "Integer"
        },
        modeCamera: {
            init: [{"id": "size", "nombre": "size", "param": "true"}]
        },
        modeCkeditor: {
            init: [{"id": "simple", "nombre": "simple", "param": "false"}, {"id": "simple", "nombre": "simple", "param": "false"}]
        },
        modeUploader: {
            init: [{"id": "fullPath", "nombre": "fullPath", "param": "false"}, {"id": "rename", "nombre": "rename", "param": "false"},
                {"id": "rename_random", "nombre": "rename_random", "param": "false"}]
        },
        modeTextField: {
            init: [{"id": "search", "nombre": "search", "param": "false"}, {"id": "money", "nombre": "money", "param": "false"},
                {"id": "integer", "nombre": "integer", "param": "false"}, {"id": "string", "nombre": "string", "param": "false"},
                {"id": "lowerCase", "nombre": "lowerCase", "param": "false"}, {"id": "upperCase", "nombre": "upperCase", "param": "false"},
                {"id": "speech", "nombre": "speech", "param": "false"}, {"id": "email", "nombre": "email", "param": "false"},
                {"id": "maxCharacteres", "nombre": "maxCharacteres", "param": "true"}]
        },
        modeTextArea: {
            init: [{"id": "maxCharacteres", "nombre": "maxCharacteres", "param": "true"}, {"id": "integer", "nombre": "integer", "param": "false"},
                {"id": "string", "nombre": "string", "param": "false"}, {"id": "speech", "nombre": "speech", "param": "false"},
                {"id": "numeric", "nombre": "numeric", "param": "false"}, {"id": "lowerCase", "nombre": "lowerCase", "param": "false"},
                {"id": "upperCase", "nombre": "upperCase", "param": "false"}]
        },
        modeSelectListCheck: {
            init: [{"id": "maxItems", "nombre": "maxItems", "param": "true"}]
        },
        userGooglePlugin: {
            init: true,
            check: "Boolean"
        },
        imageNoExists: {
            init: "/nwlib6/img/img_no_existe.png"
        },
        imageFileAll: {
            init: "/nwlib6/img/fileall.png"
        },
        imagesExtensions: {
            init: ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "ico", "ICO"]
        },
        filesExtensions: {
            init: ["doc", "docx", "xml", "excel", "pdf", "xls", "xlsx", "DOC", "DOCX",
                "XML", "EXCEL", "PDF", "XLS", "XLSX", "csv", "CSV", "odt", "ODT"]
        },
        tabIndex: {
            init: 1,
            check: "Integer"
        },
        popupNotConnected: {
            init: null,
            check: "qx.ui.popup.Popup"
        },
        popupLoading: {
            init: null,
            check: "qx.ui.popup.Popup"
        },
        paddingTreeWidget: {
            init: 2
        }
    },
    statics: {
        getManyCompanies: function getManyCompanies() {
            var self = this.getInstance();
            return self.getManyCompanies();
        },
        setManyCompanies: function setManyCompanies(bool) {
            var self = this.getInstance();
            self.setManyCompanies(bool);
        },
        getEncodeRpcBase64: function getEncodeRpcBase64() {
            var self = this.getInstance();
            return self.getEncodeRpcBase64();
        },
        setEncodeRpcBase64: function setEncodeRpcBase64(bool) {
            var self = this.getInstance();
            self.setEncodeRpcBase64(bool);
        },
        getSignerModel: function getSignerModel() {
            var self = this.getInstance();
            return self.getSignerModel();
        },
        setSignerModel: function setSignerModel(model) {
            var self = this.getInstance();
            return self.setSignerModel(model);
        },
        getQxnwVersionStr: function getQxnwVersionStr() {
            var self = this.getInstance();
            return self.getQxnwVersionStr();
        },
        getNwlibVersionStr: function getNwlibVersionStr() {
            var self = this.getInstance();
            return self.getNwlibVersionStr();
        },
        getDateTimeFormat: function getDateTimeFormat(country) {
            var self = this.getInstance();
            var locales = self.getLocales();
            var founded = false;
            for (var i = 0; i < locales.length; i++) {
                if (locales[i].name == country) {
                    founded = true;
                    return locales[i].dateTimeFormat;
                }
            }
            if (founded === false) {
                return locales[0].dateTimeFormat;
            }
        },
        getDateFormat: function getDateFormat(country) {
            var self = this.getInstance();
            var locales = self.getLocales();
            for (var i = 0; i < locales.length; i++) {
                if (locales[i].name == country) {
                    return locales[i].dateFormat;
                }
            }
        },
        setSyncLocalSettings: function setSyncLocalSettings(v) {
            var self = this.getInstance();
            self.setSyncLocalSettings(v);
        },
        getSyncLocalSettings: function getSyncLocalSettings() {
            var self = this.getInstance();
            return self.getSyncLocalSettings();
        },
        setShowDestroyObjects: function setShowDestroyObjects(is_debug) {
            var self = this.getInstance();
            return self.setShowDestroyObjects(is_debug);
        },
        getShowDestroyObjects: function getShowDestroyObjects() {
            var self = this.getInstance();
            return self.getShowDestroyObjects();
        },
        setShowStorageDebug: function setShowStorageDebug(is_debug) {
            var self = this.getInstance();
            return self.setShowStorageDebug(is_debug);
        },
        getShowStorageDebug: function getShowStorageDebug() {
            var self = this.getInstance();
            return self.getShowStorageDebug();
        },
        setShowRpcDebug: function setShowRpcDebug(is_debug) {
            var self = this.getInstance();
            return self.setShowRpcDebug(is_debug);
        },
        getShowRpcDebug: function getShowRpcDebug() {
            var self = this.getInstance();
            return self.getShowRpcDebug();
        },
        getRandomTip: function getRandomTip() {
            var self = this.getInstance();
            var tips = [
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Trabajando..."), haveImage: false},
                {text: self.tr("Para ordenar un listado <br />dar click sobre el encabezado de una columna"), haveImage: false},
                {text: self.tr("Para filtrar datos click derecho sobre el encabezado de una columna"), haveImage: false},
                {text: self.tr("En todo el software tienes ayuda \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAsCAMAAAD//3BWAAABXFBMVEXr6+vw+f5mZmbd3d2pyuGlx+CbwdzExMSVvdmfxN3r9vzm8vrh7/jc7PbX6fTN4vDD2+yRute00eXR5fGvzuSvzuPY2djI3u291+m51Oetydy51ejZ2tm5urjI3u6+1+mgxN3m5ubb3N2Quteenp5tbW3Y2NZ/f3/o6Ojj4+Pa293Z2tvX1dLR0tHS5fLv7+7d3+DMzs36+vn29vbj7O/h4eDc3d7b3Nrc0s3IysnGyMLr46L053Xd3dmXudCUts/byMfn48K9vruztLHtqqnKoJuZmpqLkZXx5ovxhYXx4my/hmzp02juNjbx8fHk7PDq6ury8OGuyt3u1dPZ2dKnwNHvysmeuMn0xsXQxsTo47jv6bXNwqn06pvwnJvbnJrp4JW2p4/Xi4XUxIHFsYDXhIDu4nz26Xq9fGvKaGbNpWXSmGDTYl7yWFjLYlHCZE/hUE/IS0XlPj3vKirsqtWCAAABhklEQVRIx+3VZ0/CUBiG4Qou3IgWVARbW6QFZC/Ze7v33nv7/xML5PRtOLWN+pW7OSF5kiunISEQ3VoN/NEwrEYxlsEMUwz0KBYoMp2GFYhya2yn0fSopukaZeMi25nNZpec8coYMshxFEXZhWgZEyVljc1ma94SXpcz80FiqW2GIJIjnS2iJXjJLBobMsOQg8tUr6Le43LMzUtmMOjdRiAyFq9dun35+/oRLZnxe0Yh8/njzdfZQaNSi2sls2jCyIxBDmpl6zlNPJxGNkKSWTRO9G6GZUMr4VMwPq971UVwdo8BdjDonnFIMPuFiLuwG/F7JLNoXMgYLUajcJoPn3n6fEk7843XE48Fdvx7m4D4WPzt3eevfNTLHskM9yBjsppMwmk+NHV4d53LXVRv/bQVdmSyTmRm5sTH6+C3aToUSiTo6A7syFBZZCahWWhvE2b8tzA9pfbgplc13PSphhvdgk6nfHDTrxpm2OSgSkm20zCl1KJer//5pErM//5LtL+P6EZ8A7glUMFBsli4AAAAAElFTkSuQmCC'><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Puede sumar los <br /> valores de una columna con la opción 'cálculos'\n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAA/CAMAAAA49+aYAAABUFBMVEXr6+vw8PDd3d3MzMzTzMzZ1NTQycnX0tLu7e3i39/g3d3p6Ojc19fl4uLUz8/Uzs7d2dne2trb19fm5OTn5eXk4uL/AAAzMzPm5eXvs7M2NjbZ2dnwqKjOzs5bWlpEREQ5OTkpKSn+EBCHhYUcHBxpaGgoKCgiIiLJxsa7ubmKiYlMS0vBv7/yoKD/CQns4ODFw8O3tbVramplZGRWVVX9HBzt3NzU0tLSz8/LysqPjY37Ly8uLi4mJibb2tqgnp6bmZmXlpZ6enpvbm5TUlL5RETt1dXvu7urqqqop6f0hISDgoL0eXnu0dHQzc3wtrampKSjoaGSkZF3dnb1dXX3aWn3XFzvxMTwv7/vurrwuLjymZn0f39iYWH5UlI/Pz8+PT3g3t7f3Nywra3yl5fykpL0iIj6Ojr9IiLwr6/xpaXzjY34TEztzMzzi4v2Y2Pzn4jHAAAD/ElEQVRo3uzWPYuDQBDG8SdJaXsMiLHZ3t1qbRbSaUAiNr4kKlZ5T+7u+3dnQsgZ0kfQ+XdTDfODFcFxI2868sBxY2/Ez2A6ZQAGYAAGYAAGwFh7Afi+CmnOAAq9g01zdLrPA6wLYB3F3gtoA6RrjBHAIw+w9rGVC5HdD95reVU+RfBoeZt3R2kSxAcpUgykLsCKQtw6mVNFZXtwQlEhsn+ADaVhIFSmfbsJMYxeAWLcigOtyWsPXpEC8ARoZx8VJVsy2RoDqQtwpi1g/S5z6Sd3gJR8KKWoRvUE2FKJTWpoKAJdAMuIyAvIbkSY06U92Ka6EDlkEAaPJ7CKD1rVmSqowjDqAiBshDRzlFpcAunRHJEWjcKP0DUlj4/gYY3SSJF/YRjxjxADMAADPAEcd/bxXKevve8AzgKTj4eF09feNwAXkx6C29feN4DZpJdmfe1lgL/2za21USAMw7O42c2McVejYrCsGtR4ykU9gFFMzekiIVByuA5J2///H3ZSalyw7UVt6sXOM7zKfAw8+F4OSAp4u4AkyvqqX0/wgQKAscfPpfItnb95/JoFtC9oU9BeWQ/tr4AqvbSVJe32Umn3xPbVeaUAUNAzWuc9PdQAwEnN8BQ9RXIO6L0smQL4VKjSK1jTBQBLBaQBGE8Xsg6AK6lTCbhzgFPMNifNS+p7qwXQFxQ1j/HL0Z6zy+56WUD7Gr08ieJxS9dhJj0zuwyo0ssbwnFJrxTaDej+jI4NaA9iPpJpfU7jvMxGY4qeqvW91QIE/rx6OGLqGcet4Gj8Oaki8N62Nxrz/J3AB+vi3IfeUJEwiniZU6UXGrwvixuFd02hP+SFcbJT+F4u83og4LzMphEvPBg3tb3VAhiRYS7hJpbjawyDk4YM462YkSXGoapm6+LMxzJSJUkdlXuq9D4YDKPoG0V0TaZvMzhrU2RwJ3rA4BSzEJ+17NreagGwIFlBzGLnyxAuNZiGEHobeG9BM3yE5hrWw5FlB5ZQpffRgNDu7yKom7B/C3FSBcJcPu/hrJjtFhB2jVZtb7UAVDC0cu7xaeAkVoxMDbkHhLwNSiyk6MiR9qgmk8m/O6r03hn4sZcipIdocItw/P6I9SQ0UVH3ZL7M7PEtcr363moBHFuslToYqDnHzuWFLrPugWO9LWdb7JOkHfLxluU+cVGlt2vgZ5xF7DrkBkP2nHmmujIbe8dof5lNNNkb1vdWC+h0Ox2c7te+qXe9rW5npV7HWy2g1QjUe17b8luHoHUNXingZyNQ73pdKVvYP6/BKwX8+t3EopryVi9EvjfCn6a81Sux+x8NcH/TlJdcipJrcVIAKYAUQAr4fz+dQCAQCATy5yj5cxSAvxgQEJIKTC6xAAAAAElFTkSuQmCC'><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Es posible ordenar el ancho de las columnas con la opción \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAiCAMAAAAEcluKAAAAbFBMVEXr6+sAgACdoKCanZ3wr2F8f36bnZ7is4eDhoSRk5J+gYC/wcGMj42XmJWTlZSKjIp5e3pkZ2aOkZCIiomXmpmFiId1eXd0dnRrbm3q6Obo1cXmzLXlxajjrnpvcnDurF/ck1OwsK5rb21fY2EWLGurAAAApklEQVQ4y+XS7Q6CIBSAYZMgQOVTwW+t7v8eo+XSP4fW2qrN5yd7BztnJD9ziNhmCWjXmeKUUo6VHy9a12CWpQtCEMrALEUhQWUhmJFWgFmZB1JaW1WUspePkvij5yIQLJeUK68/XYhzCmPl/FhrfY0shNyhhwyelDEhmMmljU5qeIAXBsy6fj3qOyhrp+PG1EK3DfPpaR7gvTXrUfNnv/fLWUTyjhtbKgh5tVM3XwAAAABJRU5ErkJggg=='><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Puede generar informes como tablas dinámicas con la opción \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAkCAMAAAAkYj0PAAABuVBMVEXr6+vd3d3MzMzHx8e9vbzOzs7w8PDLy8m5ubkwMDApKSni4uK4uLY9PT3p6Oja2tjU1NTAwL+5urg2NjYmJibi4ODY2Ng6OjozMzPW1tbW1tMnJyfm5eXl4+PDw8Otra2Hh4eCgoJxcXFcXFzq6urd2dna1dXY0tHOz8y3t7Ozs7GwsK14eHhVVVVISEhAQEAdHR3e3t7c3NrU1NDVz8/Szc3GxsO/v722trOrq6mioqKNjY36aWnIV1dNTU0kJCQiIiLt7e3g3d3f29vZ2NbQy8rMysZPfrd5e6Ofn599fX39bm6XbG1jY2P1YWHpX1/1W1vdWFjzV1d5RVPxUlLvTU3qRUVFRUUsLCx7YyXn5+NqlsnPyMhcisC6urpVgLdhhLa1tbFId7FEdK7LrK2/qKVyeqS/nZmYmJilmpeWlpZ8kJaedJK5kpDEjo4yVItEV4l/f39ATn+kf3ysfny/Z3mKXnata3XIom1lZWWiZGTCZGO4ZGPuYmJ2TWCRnVvjWVme4FjlVFbpTU3PSEiORUSLgEOdlkLNQUGnpz3XTznkODgyMjKC1y9zWy6YKSl+kieYIyKpCwsqOuEqAAACJ0lEQVRIx+3WV2/aUBjG8SceMcQLMMvsAAkFykxYZWbvpGma1b333nvv3X7i+sZ2EamqilrqBX/J8pFs/WS/OhcHvZRoJwxJNMTtBw0D6u8nAPRYAD1WXRKUGo1uGxtTWdLJsiLL5lmWlQl0nUrYHBbCxDBHGIYROfWh2aSuwvbKX6DRqMZOUuUEw1C/Yb0ktAT8KUHQWGepTIkiI4qiIw6d9V5ISSFEsq4gmZb4IAKZ+41iZj7NcxE+DAR5V0oG3ZCUl/R8PpU1eaiEzeMhLz+qP3zg19mBeViyLOwWgd8D0p4nW8otS2GJ97NNWVb+ohpBOIRcJLcjm58uFQ/E6o8XFmrLq1d0NgB4aYWlm1EgXSFbAsgB4HoYkAJzKcCRFUKNUttk/H5tCB5bkhup12rLe/ftX189pbE0lEthqU8AUudIM0C6gcHdgMtabbndbq8shPitKvQcDpXlFDZ+ekUxX9y+NHv0bgdLNwVgM9jOzkW0HWUO7MiOcMn4rZX1jY17Bw/PnLjTwUaV2Qa8uXbWuUXAGsZSEn7eCq3xcY2dLNqsZ1+9/Pjh+cWZk2eedLAg065MAu0sgryUMcG6KUmD0JuY0L/2eCUx/fXds/efnx6bvbaIbhoaUlnKQ5XjzM3vP769fXP1xpr8j1gftUuJOP96e/vL2iKDrhoeJtBeH8mZGBbdswYUixnCjhrEjhrCFgqGsFNTNAzoUMGJX/u/D6J9RoSfvdROa6TFjskAAAAASUVORK5CYII='><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Puede crear nuevas funciones en los listados con la opción \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAnCAMAAACylgF9AAAAh1BMVEXr6+vd3d0AgADp6ekAAABbV07m5uZiXlUICAjY2NfU1NJeWlBWUkjy8vJ+fHRSUlJZVUvk5OPGxcPCwcCysa+tra2hn5qRkI2IiIiKiIGIhX50cWk0NDQrKysXFxcQEBDGxsatq6elpaWSkpKVk42BgYFvb292c2tkZGRLS0tBQUEbGxsCAgKMYoQTAAAAsklEQVQ4y+XUtw7DMAxF0ZuIlOTu9B6n9///vkzZ5MhzwonDwSNAEIRfrH6/g+FPzK7a+nnEVHK4bL6bxD+js2ZSAcNvphGRJnUKoOOWnLVMrJYGYKZhY7wkC4er7VIHediMZEs2xWSrEUmLOcqdPIFyCdMsbG4yJx+QrtTiFmGzfqXoSa+2zkq1QWP9A/Y1gLo0vJ+xTD7tsGWHG3/+s3s2XYyJ/wQTRdCLF0WHpKKImjeQFwdylbPE9AAAAABJRU5ErkJggg=='><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Para exportar a Excel, TXT o CSV <br /> usa la opción \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAApCAMAAABtAqVhAAABWVBMVEXr6+vw8PD4+Pi2trbExMTPz8+3t7e+vr67u7u0tLTp6enLy8vIyMjd3d3y8vLBwcHCwsLc3NxNTU3Y2djt7e3f39/V1dW1tbXm5ubi4uLS0tLj4+Ovr68aGhocHBzR0tF/f38oKCi6uro8PDwyMjIkJCTb3NlHSUne39thYWE/Q0To6OfX19bT1dHQ0c3Ozs3DxcCysrKkpKN1dnZyc3Oh12w1NTXLzMmnp6dqa2pXWFc+Pz84Ozs3ODgfHx/l5eLFx8PAwMC3uLS87ouDg4NdX15FR0dCQkLJysasrKygoKCdnZ2RkZF7e3uZzWdlZWWA2ya7x66hoaGYmJitxpaWlpaHh4e16YGt24Gs6HFtbm2GvVFQUFBDRkaR5ECK4jQ0NDQtLS0pKSn39/fAwL28wbS8wbKpqamgop6svpi84paluJOj2XCV01qU0liS0FWZ4VOKxFKPzlGH9pBQAAACoklEQVRIx+3WZ2/aQBjAcYdhdsG93tU2OAZsbPbeI5AmQPZOmmY16d7r+7/onUnTKFxKGjlSK+V3EvCc4K/TvcHMvXs3Yfv9+n+201GrSaLpq+0oYzEJTl1pWy1TJrFY79v/THtt/8f3u2pXnm58vcP2F5PbzC+f5jY+MxdS0jTBMtdwoSsbl9vh87Z75LDybO75t8qh+xwvie7rpdxN5+UJo7V5gnO8WcPtk7XXrzjeIEh2nthr8vzRilMp60qBD652OgnAx+Zj8zPVIl+uqusCmchvaHcSFPAKzOY39+dOKps12SYYOz7JY7zD4WJxIDilxWCxIyy3NCFRCkZKQlBhhbri87WWjQkv2rkh0cvna+8/VD76s1oNGjhpBqtCyCodB4zGyI49sQdhvQVfuCBUXNCXhrARJhNBa3MYqGVAJruzs5BDGRlwBJC83MhA5zhWxR9is0crHFc44yKzHKcUOE9iODwLk4mg3QnA/GkBxuOaFo/He8gPCCQFgGFJHy4BVywNRMnTDwOw1QIRBwDtEFhPILC+SiaCdm6ELWTiKb7b7UItmwU9RIiSHxE51RVSc4XpbbTSRrtKTmyWUMSJkLKEmmFUUMtkImhtURZllM9mcT7V1TK14gLeEcWcNE2sHjRkMdEInTaq1bpsL1dPE14xwopiKTZfVzv97dhyhCXfl2l3YseKPb8/n3ewT7Dou5x9zKJqn4TW9mDJdrs9SCb75YNyo6lbPWPeqp5JaG0vVkq2ksfJpK4PdP24X/COqaveSWhtG+bYCl3YLQZst0FrB/zmLFrbYRKL9YHhcttpElqbNQmtHXCZIjDejkKLOV5C56h922fNx38Q1aYMF+2J8J8V82BkCns0GeP7e5wGkGyfjKGjn/rcFPPwRn4CBM2NTX9h9akAAAAASUVORK5CYII='><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Puede mantener una columna inmóvil con la opción \n\
    |                   <br /><img src='data:image/png;base64,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'><br /><br /><br /><br />")
                    , haveImage: true},
                {text: self.tr("Puede poner colores a los registros con la función \n\
                        <br /><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA2CAMAAAChp3phAAABhlBMVEXr6+vw8PDd3d3MzMzUzs7v7+/Y09PRy8vg3d3t7Ozp5+fm5OTa1dXc2Njb19fZ1NTq6enW0NDi39/e2trd2dnk4uLk4eHPyMjPycnr6urMAADPzs5yn8/Z2dn2iR5+l7pffaiR3EeE1zF31B3SuM+ar8qEpcjDob9je574oEr3lTb1fQfa2trXwdXNssrfycjJxsbJq8aTqMW4uL3AnLy7n7m/mbe1krBrh7Cwlq6d31uOz1bHU1OL0EfskTiB1yzQHhzdydrS1dm5xtmBqdTe5tOFq9N/qNN6pNLV0dGJq9Hr3dChs81/qM2kt8zLrceTrMfHvsSbrsN3p8CKob+Inr/M3bzL3bp4kreAr7XiyrO1rrNyjbPjyLCyqbDImK5wiKtpgqVWdaSanKOSlqGijaDGf5NjdI2t1oWKxHvlr3vLbm7Ea2uNzGmY013OVFiX3lLpm0+O00vmkELPNjv3lznpjjbGNjbpeDHGMTHtgi591CnlYyj0gxXVKBX1gQ/PDg7QEgcf7+V6AAABmUlEQVRIx+2WZ0/CUBSGKSBaZSigVErL3siQDTLce++99957/XOrib18Od4GQsTE5+RNmzd90nu+XVEJiItG9CcRi4v7HL0ztORHaAZSGR9JEFUEHJGPAVSaJDCQNKBKCCySMqhoLyiSyjrw/67CdsVSDpXEAqpcSD6DB+fZzMleN+q4gGp9M5rlG5a9NltymdnCFlYRC9lXt9udSp1ZL2YKalCt5QlcelmPx2M2m3PWtBj1AtTD/NMzy7IWi+Vxf3hEgFrH06bXv995vVbr8aTBYEe9APVez/HykJ43cDgEqI08t5z5dhozObr6OBX1oNrEwx34ajXiNJmMA72GMdSDqprnKL8Tc4b8xrmEydgzgXpQrVF/TyAZj4RsLfZWY2LD1YF6WEWMR52jtvbOoemltXBBLUSVrcT9n3+dcm0F5QJUDUIeXNxORtddu5thqRbVoKrVajV8FPJ+ipKqlKjjAqoKLKCqxAKqciygqsICqjIs5VAbsICqFEuFqdVYIJWmcCZFAypD63TU10BPmin9jljKzfT3+AAhUVhQK8KBYgAAAABJRU5ErkJggg=='><br /><br /><br /><br />")
                    , haveImage: true}
            ];
            var item = tips[Math.floor(Math.random() * tips.length)];
            return item;
        },
        getShowTips: function getShowTips() {
            var self = this.getInstance();
            return self.getShowTips();
        },
        setShowTips: function setShowTips(bool) {
            var self = this.getInstance();
            self.setShowTips(bool);
        },
        getPaddingTreeWidget: function getPaddingTreeWidget() {
            var self = this.getInstance();
            return self.getPaddingTreeWidget();
        },
        setPopupLoading: function setPopupLoading(popup) {
            var self = this.getInstance();
            self.setPopupLoading(popup);
        },
        getPopupLoading: function getPopupLoading() {
            var self = this.getInstance();
            return self.getPopupLoading();
        },
        counterOnPopupNotConnected: function counterOnPopupNotConnected(count) {
            var self = this.getInstance();
            var p = self.getPopupNotConnected();
            if (p == null) {
                return;
            }
            var countLabel = p.getUserData("nw_popup_not_internet");
            countLabel.setValue("Verificando conectividad con sistema central...   Intentos: " + count);
        },
        isConnected: function isConnected() {
            var self = this.getInstance();
            return self.getConnected();
        },
        setConnected: function setConnected(isConnected, resetBlockerColor) {
            var self = this.getInstance();
            var oldConnected = self.getConnected();
            if (isConnected == false && oldConnected == true) {
                var p = self.getPopupNotConnected();
                if (p == null) {
                    var baseLayout = new qx.ui.layout.HBox();
                    p = new qx.ui.popup.Popup(baseLayout).set({
                        autoHide: false,
                        padding: 5
                    });
                    var l = new qx.ui.basic.Label(p.tr("Su conexión a internet es deficiente o nula")).set({
                        rich: true,
                        textAlign: "center",
                        alignX: "center"
                    });
                    p.setUserData("nw_popup_not_internet_header", l);
                    p.add(l);
                    var countLabel = new qx.ui.basic.Label(p.tr("Verificando conectividad con sistema central...   Intentos: 0")).set({
                        rich: true,
                        textAlign: "center",
                        alignX: "center"
                    });
                    p.setUserData("nw_popup_not_internet", countLabel);
                    p.add(countLabel);
                    p.setLayout(new qx.ui.layout.VBox());
                    self.setPopupNotConnected(p);
                } else {
                    var header = p.getUserData("nw_popup_not_internet_header");
                    header.setValue(p.tr("Su conexión a internet es deficiente o nula"));
                    var countLabel = p.getUserData("nw_popup_not_internet");
                    countLabel.setValue(p.tr("Verificando conectividad con sistema central...   Intentos: 0"));
                }
                p.setBackgroundColor("#FF4000");
                var vw = qx.bom.Viewport.getWidth() / 2;
                var vh = qx.bom.Viewport.getHeight() / 2;
                p.addListener("appear", function () {
                    var bounds = p.getBounds();
                    var w = bounds.width;
                    var h = bounds.height;
                    var width = qxnw.utils.round(vw - (w / 2), 0);
                    var height = qxnw.utils.round(vh - (h / 2), 0);
                    p.moveTo(width, height);
                    qx.core.Init.getApplication().getRoot().setBlockerColor("black");
                    qx.core.Init.getApplication().getRoot().setBlockerOpacity(0.2);
                });
                p.show();
            } else {
                if (typeof resetBlockerColor === 'undefined') {
                    resetBlockerColor = true;
                }
                if (resetBlockerColor === true) {
                    qx.core.Init.getApplication().getRoot().resetBlockerColor();
                    qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
                }
                var p = self.getPopupNotConnected();
                if (p != null) {
                    p.moveTo(20, 20);
                    p.setBackgroundColor("#58FA58");
                    var header = p.getUserData("nw_popup_not_internet_header");
                    header.setValue(p.tr("Sistema central:"));
                    var countLabel = p.getUserData("nw_popup_not_internet");
                    countLabel.setValue(p.tr("Conexión restablecida"));
                    var t = new qx.event.Timer(3000);
                    t.start();
                    t.addListener("interval", function (e) {
                        this.stop();
                        p.hide();
                    });
                }
            }
            self.setConnected(isConnected);
        },
        getActualTabIndex: function getActualTabIndex() {
            var self = this.getInstance();
            var ai = self.getTabIndex();
            var up = ai + 1;
            self.setTabIndex(up);
            return ai;
        },
        getResizeMainLeftMenu: function getResizeMainLeftMenu() {
            var self = this.getInstance();
            var v = qxnw.local.getData("resizeMainLeftMenu");
            if (v == null) {
                v = self.getResizeMainLeftMenu();
            }
            return v;
        },
        setUrlOut: function setUrlOut(url) {
            var self = this.getInstance();
            return self.setUrlOut(url);
        },
        getUrlOut: function getUrlOut() {
            var self = this.getInstance();
            return self.getUrlOut();
        },
        getImageFileAll: function getImageFileAll() {
            var self = this.getInstance();
            return self.getImageFileAll();
        },
        getFilesExtensions: function getFilesExtensions() {
            var self = this.getInstance();
            return self.getFilesExtensions();
        },
        getImagesExtensions: function getImagesExtensions() {
            var self = this.getInstance();
            return self.getImagesExtensions();
        },
        getImageNoExists: function getImageNoExists() {
            var self = this.getInstance();
            return self.getImageNoExists();
        },
        getUserGooglePluginViewer: function getUserGooglePluginViewer() {
            var self = this.getInstance();
            return self.getUserGooglePlugin();
        },
        checkBackspaceClass: function checkBackspaceClass(classname, parent) {
            if (classname == "qxnw.widgets.selectTokenField"
                    || classname == "qx.ui.container.Composite"
                    || classname == parent.classname
                    || classname == "qx.ui.form.Button"
                    || classname == "qx.ui.basic.Atom"
                    || classname == "qx.ui.table.pane.Pane"
                    || classname == "qx.ui.table.headerrenderer.HeaderCell"
                    || classname == "qxnw.upload_multiple.UploadButton"
                    || classname == "qxnw.fields.selectBox"
                    || classname == "qx.ui.tabview.TabButton"
                    || classname == "qx.ui.basic.Label"
                    || classname == "qx.ui.core.Widget"
                    || classname == "qx.ui.table.columnmenu.Button"
                    || classname == "qx.ui.form.RepeatButton"
                    || classname == "qx.ui.core.scroll.ScrollSlider"
                    || classname == "qx.ui.form.ToggleButton"
                    || classname == "qx.ui.form.CheckBox"
                    || classname == "qx.ui.toolbar.Part"
                    || classname == "qx.ui.toolbar.Button"
                    || classname == "qxnw.table.table"
                    ) {
                return true;
            }
            return false;
        },
        searchIntoLocales: function searchIntoLocales(local) {
            var self = this.getInstance();
            var locales = self.getLocales();
            for (var i = 0; i < locales.length; i++) {
                if (qxnw.utils.lower(locales[i].name) == qxnw.utils.lower(local)) {
                    return locales[i];
                }
            }
        },
        setLocaleByData: function setLocaleByData(locale) {
            var self = this.getInstance();
            if (typeof locale == 'undefined') {
                return;
            }
            qxnw.local.storeOpenData("lang", locale);
            var localData = qxnw.config.searchIntoLocales(locale);
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_short": localData.cldr_date_format_short});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_medium": localData.cldr_date_format_medium});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_full": localData.cldr_date_format_full});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_long": localData.cldr_date_format_long});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_short": localData.cldr_date_time_format_short});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_medium": localData.cldr_date_time_format_medium});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_full": localData.cldr_date_time_format_full});
            qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_long": localData.cldr_date_time_format_long});
            qx.locale.Manager.getInstance().setLocale(locale);
            qxnw.local.storeOpenData("locale", localData);
            try {
                var icon = qxnw.config.execIcon(localData.icon, localData.iconType);
                if (typeof main != 'undefined') {
                    if (icon != null) {
                        if (icon != "") {
                            try {
                                main.lang_lower_atom.setLabel(self.tr("Idioma: ") + locale);
                                main.lang_lower_atom.setIcon(icon);
                                main.lang_up_image.setIcon(icon);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
        },
        getLocales: function getLocales() {
            var self = this.getInstance();
            return self.getLocales();
        },
        getWidgets: function getWidgets() {
            var self = this.getInstance();
            return self.getWidgetsDisp();
        },
        getDataTypes: function getDataTypes() {
            var self = this.getInstance();
            return self.getDataType();
        },
        getModeByWidget: function getModeByWidget(widget) {
            var self = this.getInstance();
            switch (widget) {
                case "camera":
                    return self.getModeCamera();
                    break;
                case "ckeditor":
                    return self.getModeCkeditor();
                    break;
                case "uploader":
                    return self.getModeUploader();
                    break;
                case "textField":
                    return self.getModeTextField();
                    break;
                case "textArea":
                    return self.getModeTextArea();
                    break;
                case "selectListCheck":
                    return self.getModeSelectListCheck();
                    break;
            }

        },
        getPhpThumbQuality: function getPhpThumbQuality() {
            var self = this.getInstance();
            return self.getPhpThumbQuality();
        },
        getPhpThumbPath: function getPhpThumbPath() {
            var self = this.getInstance();
            return self.getPhpThumbPath().replace("%version%", qxnw.userPolicies.getNwlibVersion());
        },
        getIconsCategories2DArray: function getIconsCategories2DArray() {
            var self = this.getInstance();
            var categories = self.getIconsCategories2DArray();
            var d = {};
            for (var i = 0; i < categories.length; i++) {
                for (var k in categories[i]) {
                    d[k] = categories[i][k];
                }
            }
            return d;
        },
        getSeassonMessage: function getSeassonMessage() {
            var self = this.getInstance();
            return self.getSeassonMessage();
        },
        getDevMessage: function getDevMessage() {
            var self = this.getInstance();
            return self.getDevMessage();
        },
        getSavePositionForm: function getSavePositionForm() {
            var self = this.getInstance();
            var v = qxnw.local.getData("save_position_form");
            if (v == null) {
                v = self.getSavePositionForm();
            }
            return v;
        },
        getSearchOnInput: function getSearchOnInput() {
            var self = this.getInstance();
            var v = qxnw.local.getData("nw_select_token_field_searchoninput");
            if (v == null) {
                v = self.getSearchOnInput();
            }
            return v;
        },
        getShowInformationOnValidate: function getShowInformationOnValidate() {
            var self = this.getInstance();
            var v = qxnw.local.getData("nw_show_information_on_validate");
            if (v == null) {
                v = self.getShowInformationOnValidate();
            }
            return v;
        },
        getNotificationsAnimation: function getNotificationsAnimation() {
            var self = this.getInstance();
            var v = qxnw.local.getData("notifications_animation");
            if (v == null) {
                v = self.getNotificationsAnimation();
            }
            return v;
        },
        getNotificationsSound: function getNotificationsSound() {
            var self = this.getInstance();
            var v = qxnw.local.getData("notifications_sound");
            if (v == null) {
                v = self.getNotificationsSound();
            }
            return v;
        },
        getNotificationsType: function getNotificationsType() {
            var self = this.getInstance();
            var v = qxnw.local.getData("notifications_type");
            if (v == null) {
                v = self.getNotificationsType();
            }
            return v;
        },
        getAddNewSubWindows: function getAddNewSubWindows() {
            var self = this.getInstance();
            var v = qxnw.local.getData("add_new_sub_windows");
            if (v == null) {
                v = self.getAddNewSubWindows();
            }
            return v;
        },
        getTimeNotifications: function getTimeNotifications() {
            var self = this.getInstance();
            var v = qxnw.local.getData("time_notifications");
            if (v == null) {
                v = self.getTimeNotifications();
            }
            return v;
        },
        getTimeUsersChatRequest: function getTimeUsersChatRequest() {
            var self = this.getInstance();
            var v = qxnw.local.getData("time_users_chat_request");
            if (v == null) {
                v = self.getTimeUsersChatRequest();
            }
            return v;
        },
        getIsGoogleMapsLoaded: function getIsGoogleMapsLoaded() {
            var self = this.getInstance();
            var v = qxnw.local.getData("google_maps_loaded");
            if (v == null) {
                v = self.getIsGoogleMapsLoaded();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        setIsCkeditorLoaded: function setIsCkeditorLoaded(bool) {
            var self = this.getInstance();
            self.setIsCkeditorLoaded(bool);
        },
        getIsCkeditorLoaded: function getIsCkeditorLoaded() {
            var self = this.getInstance();
            var v = self.getIsCkeditorLoaded();
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        setIsJitsiLoaded: function setIsJitsiLoaded(bool) {
            var self = this.getInstance();
            self.setIsJitsiLoaded(bool);
        },
        getIsJitsiLoaded: function getIsJitsiLoaded() {
            var self = this.getInstance();
            var v = self.getIsJitsiLoaded();
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getPrefixPath: function getPrefixPath() {
            var self = this.getInstance();
            return self.getPrefixPath();
        },
        setPrefixPath: function setPrefixPath(path) {
            var self = this.getInstance();
            self.setPrefixPath(path);
        },
        setShowInformationOnValidate: function setShowInformationOnValidate(bool) {
            var self = this.getInstance();
            self.setShowInformationOnValidate(bool);
        },
        getNotifications: function getNotifications() {
            var self = this.getInstance();
            var v = qxnw.local.getData("notifications");
            if (v == null) {
                v = self.getNotifications();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        setNotifications: function setNotifications(v) {
            var self = this.getInstance();
            return self.setNotifications(v);
        },
        getMenuStyle: function getMenuStyle() {
            var self = this.getInstance();
            var v = qxnw.local.getData("menu_style");
            if (v == null) {
                v = self.getMenuStyle();
            }
            return v;
        },
        setMenuStyle: function setMenuStyle(menuStyle) {
            var self = this.getInstance();
            qxnw.local.setData("menu_style", menuStyle);
            self.setMenuStyle(menuStyle);
        },
        processRandomColors: function processRandomColors(key) {
            var self = this.getInstance();
            var randomColors = self.getRandomColors();
            if (randomColors == null) {
                randomColors = [];
            }
            for (var i = 0; i < randomColors.length; i++) {
                if (key === randomColors[i]["key"]) {
                    return randomColors[i]["color"];
                }
            }
            var color = qxnw.utils.createRandomColor();
            var data = {
                key: key,
                color: color
            };
            randomColors.push(data);
            self.setRandomColors(randomColors);
            return color;
        },
        getMaxShowRows: function getMaxShowRows() {
            var self = this.getInstance();
            var v = qxnw.local.getData("max_show_rows");
            if (v == null) {
                v = self.getMaxShowRows();
            }
            return v;
        },
        getTimeChatRequest: function getTimeChatRequest() {
            var self = this.getInstance();
            var v = qxnw.local.getData("time_chat_request");
            if (v == null) {
                v = self.getTimeChatRequest();
            }
            return v;
        },
        getSoundChat: function getSoundChat() {
            var self = this.getInstance();
            var v = qxnw.local.getData("sound_chat");
            if (v == null) {
                v = self.getSoundChat();
            }
            return v;
        },
        getTreeLeftWidget: function getTreeLeftWidget() {
            var self = this.getInstance();
            var v = qxnw.local.getData("treeLeftWidget");
            if (v == null) {
                v = self.getTreeLeftWidget();
            }
            return v;
        },
        getSoundStart: function getSoundStart() {
            var self = this.getInstance();
            var v = qxnw.local.getData("soundStart");
            if (v == null) {
                v = self.getSoundStart();
            }
            return v;
        },
        getHideButtonsText: function getHideButtonsText() {
            var self = this.getInstance();
            var v = qxnw.local.getData("hide_buttons_text");
            if (v == null) {
                v = self.getHideButtonsText();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getCleanCacheAtFirst: function getCleanCacheAtFirst() {
            var self = this.getInstance();
            var v = qxnw.local.getData("cleanCacheAtFirst");
            if (v == null) {
                v = self.getCleanCacheAtFirst();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getPrinterData: function getPrinterData(method, exec) {
            var self = this.getInstance();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
            var r = rpc.exec(exec);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            return r;
        },
        getShowLogo: function getShowLogo() {
            var self = this.getInstance();
            var v = qxnw.local.getData("show_logo");
            if (v == null) {
                v = self.getShowLogo();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getStartAlertsAtInit: function getStartAlertsAtInit() {
            var self = this.getInstance();
            var v = qxnw.local.getData("start_alerts_at_init");
            if (v == null) {
                v = self.getStartAlertsAtInit();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getShowChatAtInit: function getShowChatAtInit() {
            var self = this.getInstance();
            var v = qxnw.local.getData("show_chat_at_init");
            if (v == null) {
                v = self.getShowChatAtInit();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getChatNumberMessages: function getChatNumberMessages() {
            var self = this.getInstance();
            var v = qxnw.local.getData("chat_number_messages");
            if (v == null) {
                v = self.getChatNumberMessages();
            }
            return v;
        },
        getShowInitialPage: function getShowInitialPage() {
            var self = this.getInstance();
            var v = qxnw.local.getData("show_initial_page");
            if (v == null) {
                v = self.getShowInitialPage();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getShakeOnValidate: function getShakeOnValidate() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_shake_validate");
            if (v == null) {
                v = self.getShakeOnValidate();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getSendOnEnter: function getSendOnEnter() {
            var self = this.getInstance();
            var v = qxnw.local.getData("send_on_enter");
            if (v == null) {
                v = self.getSendOnEnter();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getRpcTimeout: function getRpcTimeout() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_rpc_timeout");
            if (v == null) {
                v = self.getRpcTimeout();
            }
            return v;
        },
        setRpcTimeout: function setRpcTimeout(timeInSecs) {
            var self = this.getInstance();
            qxnw.local.setData("config_rpc_timeout", timeInSecs);
            self.setRpcTimeout(timeInSecs);
            return true;
        },
        getSaveLists: function getSaveLists() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_save_lists");
            if (v == null) {
                v = self.getSaveLists();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getShowDetErrors: function getShowDetErrors() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_show_det_errors");
            if (v == null) {
                v = self.getShowDetError();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getShowErrorDialog: function getShowErrorDialog() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_show_error_dialogs");
            if (v == null) {
                v = self.getShowErrorDialogs();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getShowErrorResponse: function getShowErrorResponse() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_show_server_response");
            if (v == null) {
                v = self.getShowErrorResponse();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        getSendErrorFlag: function getSendErrorFlag() {
            var self = this.getInstance();
            var v = qxnw.local.getData("config_ask_error_report");
            if (v == null) {
                v = self.getSendErrorFlag();
            }
            if (v === false) {
                v = false;
            } else {
                v = true;
            }
            return v;
        },
        /**
         * Try to update all the application settings
         * @return {Boolean} if the operation is sucesfull or not
         */
        updateConfig: function updateConfig() {
            window.location.reload();
            //ACTUALIZADOR DE PROPIEDADES
        },
        setIconsPath: function setIconsPath(path) {
            var self = this.getInstance();
            self.setIconsPath(path);
        },
        getIconsPath: function getIconsPath() {
            var self = this.getInstance();
            var path = self.getIconsPath();
            return path;
        },
        /**
         * Returns the icons procesed
         * @param iconName {String} 
         * @param type {String} the tipe. It can be {actions, apps, categories, etc}
         * @param addition {Integer} the added size to icons
         * @return {String} the procesed icon position
         */
        execIcon: function execIcon(iconName, type, addition) {
            var self = this.getInstance();
            if (typeof type != 'undefined' && type != 0 && type != "") {

            } else {
                type = "actions";
            }
            if (typeof addition == 'undefined' || addition == '' || addition == null) {
                addition = 0;
            }
            if (type == "qxnw") {
                var iconNWPath = self.getIconsQXNWPath().replace("#", qxnw.userPolicies.getNwlibVersion());
                var r = iconNWPath.replace("%size%", (parseInt(qxnw.config.getIconSize()) + addition).toString());
            } else {
                var r = self.getIconsPath().replace("%size%", (parseInt(qxnw.config.getIconSize()) + addition).toString()).replace("%type%", type);
            }
            var data = r.split(".");
            if (typeof iconName == 'undefined') {
                return r;
            }
            var typeCheckExt = iconName.split(".");
            r += iconName;
            if (data.length == 1 && typeCheckExt.length == 1) {
                r += ".png";
            }
            return r;
        },
        /**
         * Get the accepted font sizes
         * @returns {Array}
         */
        getFontAcceptedSizes: function getFontAcceptedSizes() {
            var self = this.getInstance();
            return self.getFontAcceptedSizes();
        },
        getIconAcceptedSizes: function getIconAcceptedSizes() {
            var self = this.getInstance();
            return self.getIconAcceptedSizes();
        },
        getFontAcceptedFamilys: function getFontAcceptedFamilys() {
            var self = this.getInstance();
            return self.getFontAcceptedFamilys();
        },
        setFontSize: function setFontSize(size) {
            var self = this.getInstance();
            self.setFontSize(size);
        },
        /**
         * Set the icon size. 
         * @param icon {Integer} the icon size
         * @returns {Boolean}
         */
        setIconSize: function setIconSize(icon) {
            var self = this.getInstance();
            var iconSizes = self.getIconAcceptedSizes();
            var val = {};
            var ok = false;
            var count = 0;
            var iconSize = null;
            for (val in iconSizes) {
                iconSize = iconSizes[count];
                if (iconSize === icon) {
                    ok = true;
                }
                count++;
            }
            if (!ok) {
                qxnw.utils.bindError("Debe seleccionar un tamaño así:");
                return false;
            }
            self.setIconSize(icon);
            try {
                qxnw.local.storeData("config_icon_size", icon);
            } catch (e) {
                qxnw.utils.bindError(e, self);
                return false;
            }
            return true;
        }
        ,
        getIconSize: function getIconSize() {
            var self = this.getInstance();
            var icon = qxnw.local.getData("config_icon_size");
            if (icon == null) {
                icon = self.getIconSize();
            }
            return icon;
        },
        getFontSize: function getFontSize() {
            var self = this.getInstance();
            var font = qxnw.local.getData("config_font_size");
            if (font == null) {
                font = self.getFontSize();
            }
            return parseInt(font);
        },
        getFontFamilys: function getFontFamilys() {
            var self = this.getInstance();
            var font = qxnw.local.getData("config_font_familys");
            if (font == null) {
                font = self.getFontFamilys();
            } else {
                font = [font];
            }
            return font;
        },
        switchTheme: function switchTheme() {
            var self = this;
            if (!self.getInstance().getIsSwitchedTheme()) {
                var theme = qxnw.local.getOpenData("config_theme");
                if (theme != null) {
                    try {
                        if (theme != qx.theme.manager.Meta.getInstance().getTheme().name) {
                            switch (theme) {
                                case "qxnw_soft":
                                    if (!self.getInstance().getIsLoadedQxnw_soft()) {
                                        //qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/light.css");
                                        self.getInstance().setIsLoadedQxnw_soft(true);
//                                        qxnw.utils.loadCss("http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,300,600,700");
                                    }
                                    break;
                                case "qx.theme.Modern":
                                    qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
                                    break;
                                case "qx.theme.Classic":
                                    qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
                                    break;
                                case "qx.theme.Simple":
                                    qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Simple);
                                    break;
                                case "qx.theme.Indigo":
                                    qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
                                    break;
                                case "qxnw.themes.aristo.Aristo":
                                    qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.aristo.Aristo);
                                    break;
                                case "qxnw.themes.darktheme.DarkTheme":
                                    qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.bernstein.Bernstein);
                                    break;
                                case "qxnw.themes.graydienttheme.GraydientTheme":
                                    qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.graydienttheme.GraydientTheme);
                                    break;
                                case "qxnw.themes.retrotheme.RetroThemeRed":
                                    qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.retrotheme.RetroThemeRed);
                                    break;
                                case "qxnw.themes.retrotheme.RetroThemeBlue":
                                    qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.retrotheme.RetroThemeBlue);
                                    break;
                            }
                        }
                    } catch (e) {
                        qxnw.utils.bindError(e, this, theme, false, false);
                    }
                }
                self.getInstance().setIsSwitchedTheme(true);
            }
        }
    }
}
);
