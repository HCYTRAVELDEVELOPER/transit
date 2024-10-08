(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.data.marshal.Json": {
        "construct": true
      },
      "qx.util.AliasManager": {},
      "qx.util.ResourceManager": {},
      "qx.io.request.Xhr": {},
      "qx.lang.Type": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Tristan Koch (tristankoch)
  
  ************************************************************************ */

  /**
   * The JSON data store is responsible for fetching data from an url. The type
   * of the data has to be json.
   *
   * The loaded data will be parsed and saved in qooxdoo objects. Every value
   * of the loaded data will be stored in a qooxdoo property. The model classes
   * for the data will be created automatically.
   *
   * For the fetching itself it uses the {@link qx.io.request.Xhr} class and
   * for parsing the loaded javascript objects into qooxdoo objects, the
   * {@link qx.data.marshal.Json} class will be used.
   *
   * Please note that if you
   *
   * * upgrade from qooxdoo 1.4 or lower
   * * choose not to force the old transport
   * * use a delegate with qx.data.store.IStoreDelegate#configureRequest
   *
   * you probably need to change the implementation of your delegate to configure
   * the {@link qx.io.request.Xhr} request.
   *
   * This class only needs to be disposed if you want to abort any current I/O
   * request
   *
   */
  qx.Class.define("qx.data.store.Json", {
    extend: qx.core.Object,

    /**
     * @param url {String|null} The url where to find the data. The store starts
     *   loading as soon as the URL is give. If you want to change some details
     *   concerning the request, add null here and set the URL as soon as
     *   everything is set up.
     * @param delegate {Object?null} The delegate containing one of the methods
     *   specified in {@link qx.data.store.IStoreDelegate}.
     */
    construct(url, delegate) {
      qx.core.Object.constructor.call(this); // store the marshaler and the delegate

      this._marshaler = new qx.data.marshal.Json(delegate);
      this._delegate = delegate;

      if (url != null) {
        this.setUrl(url);
      }
    },

    events: {
      /**
       * Data event fired after the model has been created. The data will be the
       * created model.
       */
      loaded: "qx.event.type.Data",

      /**
       * Fired when a parse error (i.e. broken JSON) occurred
       * during the load. The data contains a hash of the original
       * response and the parser error (exception object).
       */
      parseError: "qx.event.type.Data",

      /**
       * Fired when an error (aborted, timeout or failed) occurred
       * during the load. The data contains the response of the request.
       * If you want more details, use the {@link #changeState} event.
       */
      error: "qx.event.type.Data"
    },
    properties: {
      /**
       * Property for holding the loaded model instance.
       */
      model: {
        nullable: true,
        event: "changeModel"
      },

      /**
       * The state of the request as an url. If you want to check if the request
       * did it’s job, use, the {@link #changeState} event and check for one of the
       * listed values.
       */
      state: {
        check: ["configured", "queued", "sending", "receiving", "completed", "aborted", "timeout", "failed"],
        init: "configured",
        event: "changeState"
      },

      /**
       * The url where the request should go to.
       */
      url: {
        check: "String",
        apply: "_applyUrl",
        event: "changeUrl",
        nullable: true
      }
    },
    members: {
      _marshaler: null,
      _delegate: null,
      __request__P_84_0: null,

      // apply function
      _applyUrl(value, old) {
        if (value != null) {
          // take care of the resource management
          value = qx.util.AliasManager.getInstance().resolve(value);
          value = qx.util.ResourceManager.getInstance().toUri(value);

          this._createRequest(value);
        }
      },

      /**
       * Get request
       *
       * @return {Object} The request.
       */
      _getRequest() {
        return this.__request__P_84_0;
      },

      /**
       * Set request.
       *
       * @param request {Object} The request.
       */
      _setRequest(request) {
        this.__request__P_84_0 = request;
      },

      /**
       * Creates and sends a GET request with the given url.
       *
       * Listeners will be added to respond to the request’s "success",
       * "changePhase" and "fail" event.
       *
       * @param url {String} The url for the request.
       */
      _createRequest(url) {
        // dispose old request
        if (this.__request__P_84_0) {
          this.__request__P_84_0.dispose();

          this.__request__P_84_0 = null;
        }

        var req = new qx.io.request.Xhr(url);

        this._setRequest(req); // request json representation


        req.setAccept("application/json"); // parse as json no matter what content type is returned

        req.setParser("json"); // register the internal event before the user has the change to
        // register its own event in the delegate

        req.addListener("success", this._onSuccess, this);
        req.addListener("parseError", this._onParseError, this); // check for the request configuration hook

        var del = this._delegate;

        if (del && qx.lang.Type.isFunction(del.configureRequest)) {
          this._delegate.configureRequest(req);
        } // map request phase to it’s own phase


        req.addListener("changePhase", this._onChangePhase, this); // add failed, aborted and timeout listeners

        req.addListener("fail", this._onFail, this);
        req.send();
      },

      /**
       * Handler called when request phase changes.
       *
       * Sets the store’s state.
       *
       * @param ev {qx.event.type.Data} The request’s changePhase event.
       */
      _onChangePhase(ev) {
        var requestPhase = ev.getData(),
            requestPhaseToStorePhase = {},
            state;
        requestPhaseToStorePhase = {
          opened: "configured",
          sent: "sending",
          loading: "receiving",
          success: "completed",
          abort: "aborted",
          timeout: "timeout",
          statusError: "failed"
        };
        state = requestPhaseToStorePhase[requestPhase];

        if (state) {
          this.setState(state);
        }
      },

      /**
       * Handler called when not completing the request successfully.
       *
       * @param ev {qx.event.type.Event} The request’s fail event.
       */
      _onFail(ev) {
        var req = ev.getTarget();
        this.fireDataEvent("error", req);
      },

      /**
       * Handler called when not completing the request successfully because
       * of parse errors.
       *
       * @param ev {qx.event.type.Data} Hash map containing the original 'request'
       *                                and the original parser 'error' exception object.
       */
      _onParseError(ev) {
        this.fireDataEvent("parseError", ev.getData());
      },

      /**
       * Handler for the completion of the requests. It invokes the creation of
       * the needed classes and instances for the fetched data using
       * {@link qx.data.marshal.Json}.
       *
       * @param ev {qx.event.type.Event} The request’s success event.
       */
      _onSuccess(ev) {
        if (this.isDisposed()) {
          return;
        }

        var req = ev.getTarget(),
            data = req.getResponse(); // check for the data manipulation hook

        var del = this._delegate;

        if (del && qx.lang.Type.isFunction(del.manipulateData)) {
          data = this._delegate.manipulateData(data);
        } // create the class


        this._marshaler.toClass(data, true);

        var oldModel = this.getModel(); // set the initial data

        this.setModel(this._marshaler.toModel(data)); // get rid of the old model

        if (oldModel && oldModel.dispose) {
          oldModel.dispose();
        } // fire complete event


        this.fireDataEvent("loaded", this.getModel()); // get rid of the request object

        if (this.__request__P_84_0) {
          this.__request__P_84_0.dispose();

          this.__request__P_84_0 = null;
        }
      },

      /**
       * Reloads the data with the url set in the {@link #url} property.
       */
      reload() {
        var url = this.getUrl();

        if (url != null) {
          this._createRequest(url);
        }
      }

    },

    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */
    destruct() {
      if (this.__request__P_84_0 != null) {
        this._disposeObjects("__request__P_84_0");
      } // The marshaler internally uses the singleton pattern
      // (constructor.$$instance.


      this._disposeSingletonObjects("_marshaler");

      this._delegate = null;
    }

  });
  qx.data.store.Json.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Json.js.map