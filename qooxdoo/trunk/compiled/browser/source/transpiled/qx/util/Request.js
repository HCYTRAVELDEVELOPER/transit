(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.Uri": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tristan Koch (tristankoch)
       * Richard Sternagel (rsternagel)
  
  ************************************************************************ */

  /**
   * Static helpers for handling HTTP requests.
   */
  qx.Bootstrap.define("qx.util.Request", {
    statics: {
      /**
       * Whether URL given points to resource that is cross-domain,
       * i.e. not of same origin.
       *
       * @param url {String} URL.
       * @return {Boolean} Whether URL is cross domain.
       */
      isCrossDomain(url) {
        var result = qx.util.Uri.parseUri(url),
            location = window.location;

        if (!location) {
          return false;
        }

        var protocol = location.protocol; // URL is relative in the sense that it points to origin host

        if (!(url.indexOf("//") !== -1)) {
          return false;
        }

        if (protocol.substr(0, protocol.length - 1) == result.protocol && location.host === result.authority && location.port === result.port) {
          return false;
        }

        return true;
      },

      /**
       * Determine if given HTTP status is considered successful.
       *
       * @param status {Number} HTTP status.
       * @return {Boolean} Whether status is considered successful.
       */
      isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
      },

      /**
       * Determine if given HTTP method is valid.
       *
       * @param method {String} HTTP method.
       * @return {Boolean} Whether method is a valid HTTP method.
       */
      isMethod(method) {
        var knownMethods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "TRACE", "CONNECT", "PATCH"];
        return knownMethods.indexOf(method) !== -1 ? true : false;
      },

      /**
       * Request body is ignored for HTTP method GET and HEAD.
       *
       * See http://www.w3.org/TR/XMLHttpRequest2/#the-send-method.
       *
       * @param method {String} The HTTP method.
       * @return {Boolean} Whether request may contain body.
       */
      methodAllowsRequestBody(method) {
        return !/^(GET|HEAD)$/.test(method);
      }

    }
  });
  qx.util.Request.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Request.js.map?dt=1658886721921