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
      "qx.tool.utils.IndexedArray": {},
      "qx.tool.compiler.Console": {},
      "qx.tool.utils.Utils": {},
      "qx.lang.Type": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
   *
   *    qooxdoo-compiler - node.js based replacement for the Qooxdoo python
   *    toolchain
   *
   *    https://github.com/qooxdoo/qooxdoo
   *
   *    Copyright:
   *      2011-2017 Zenesis Limited, http://www.zenesis.com
   *
   *    License:
   *      MIT: https://opensource.org/licenses/MIT
   *
   *      This software is provided under the same licensing terms as Qooxdoo,
   *      please see the LICENSE file in the Qooxdoo project's top-level directory
   *      for details.
   *
   *    Authors:
   *      * JBaron (Peter, @jbaron)
   *      * John Spackman (john.spackman@zenesis.com, @johnspackman)
   *
   * *********************************************************************** */
  var path = require("path");

  var fs = require("fs");

  const {
    promisify
  } = require("util");

  const readFile = promisify(fs.readFile);
  /**
   * Generates TypeScript .d.ts files
   */

  qx.Class.define("qx.tool.compiler.targets.TypeScriptWriter", {
    extend: qx.core.Object,

    construct(target) {
      qx.core.Object.constructor.call(this);
      this.__target__P_40_0 = target;
    },

    properties: {
      outputTo: {
        init: "qooxdoo.d.ts",
        check: "String"
      }
    },
    members: {
      __indent__P_40_1: "    ",
      __outputStream__P_40_2: null,
      __classes__P_40_3: null,
      __target__P_40_0: null,
      __apiCache__P_40_4: null,
      __dirname: null,
      __currentClass__P_40_5: null,

      /**
       * Generates the .d.ts file
       *
       * @param application
       *          {qx.tool.compiler.app.Application?} the application; if not
       *          provided, all classes are output
       */
      async run(application) {
        this.__apiCache__P_40_4 = {};
        await new Promise((resolve, reject) => {
          var time = new Date();
          this.__outputStream__P_40_2 = fs.createWriteStream(path.join(this.__target__P_40_0.getOutputDir(), this.getOutputTo()));
          this.write(`// Generated declaration file at ${time}\n`);
          this.writeBase().then(async () => {
            var analyser = this.__target__P_40_0.getAnalyser();

            this.__classes__P_40_3 = new qx.tool.utils.IndexedArray();

            if (application) {
              application.getDependencies().forEach(classname => {
                if (classname != "q" && classname != "qxWeb") {
                  this.__classes__P_40_3.push(classname);
                }
              });
            } else {
              analyser.getLibraries().forEach(library => {
                var symbols = library.getKnownSymbols();

                for (var name in symbols) {
                  var type = symbols[name];

                  if (type === "class" && name !== "q" && name !== "qxWeb") {
                    this.__classes__P_40_3.push(name);
                  }
                }
              });
            }

            this.__classes__P_40_3.sort();

            var lastPackageName = null;
            var classIndex = 0;

            var next = () => {
              if (classIndex >= this.__classes__P_40_3.getLength()) {
                return undefined;
              }

              var className = this.__classes__P_40_3.getItem(classIndex++);

              var pos = className.lastIndexOf(".");
              var packageName = "";

              if (pos > -1) {
                packageName = className.substring(0, pos);
              }

              if (lastPackageName != packageName) {
                if (lastPackageName !== null) {
                  this.write("}\n");
                }

                if (packageName) {
                  this.write("declare module " + packageName + " {\n");
                } else {
                  this.write("declare {\n");
                }

                lastPackageName = packageName;
              }

              return this.loadAPIFile(className).then(meta => this.writeClass(meta)).then(() => next()).catch(err => qx.tool.compiler.Console.error("Error while processing file: " + className + " error: " + err.stack));
            };

            return next().then(() => this.write("}\n")).then(() => this.__outputStream__P_40_2.end());
          }).then(resolve).catch(reject);
        });
      },

      /**
       * Write a piece of code to the declaration file
       */
      write(msg) {
        this.__outputStream__P_40_2.write(msg);
      },

      /**
       * Load a single API file
       * @async
       */
      loadAPIFile(classname) {
        if (classname === "Object" || classname === "Array" || classname === "Error") {
          return null;
        }

        if (this.__apiCache__P_40_4[classname]) {
          return Promise.resolve(this.__apiCache__P_40_4[classname]);
        }

        var fileName = path.join(this.__target__P_40_0.getOutputDir(), "transpiled", classname.replace(/\./g, "/") + ".json");
        return readFile(fileName, "UTF-8").then(content => this.__apiCache__P_40_4[classname] = JSON.parse(content)).catch(err => qx.tool.compiler.Console.error("Error parsing " + classname + ": " + err.stack));
      },

      /**
       * Write some util declarations out that will help with the rest
       * @async
       */
      writeBase() {
        return readFile(path.join(qx.tool.utils.Utils.getTemplateDir(), "TypeScriptWriter-base_declaration.txt"), "UTF-8").then(content => this.write(content));
      },

      /**
       * Do the mapping of types from Qooxdoo to TypeScript
       */
      getType(t) {
        var defaultType = "any";

        if (!t || t == "[[ Function ]]") {
          return defaultType;
        }

        if (typeof t == "object") {
          t = t.name;
        } // Check if we have a mapping for this type


        var result = qx.tool.compiler.targets.TypeScriptWriter.TYPE_MAPPINGS[t];

        if (result) {
          return result;
        }

        if (this.__classes__P_40_3.contains(t)) {
          return t;
        } // We don't know the type
        // qx.tool.compiler.Console.error("Unknown type: " + t);


        return defaultType;
      },

      /**
       * Write a constructor
       */
      writeConstructor(methodMeta) {
        this.write(this.__indent__P_40_1 + "constructor (" + this.serializeParameters(methodMeta, true) + ");\n");
      },

      /**
       * Write all the methods of a type
       */
      writeMethods(methods, classMeta, isStatic = false) {
        if (!methods || !Object.keys(methods).length) {
          return;
        }

        var IGNORE = qx.tool.compiler.targets.TypeScriptWriter.IGNORE[this.__currentClass__P_40_5.className];
        var comment = isStatic ? "Statics" : "Members";

        for (var name in methods) {
          var methodMeta = methods[name];

          if (methodMeta.type == "function") {
            var hideMethod = IGNORE && IGNORE.indexOf(name) > -1;
            var decl = "";
            comment = "";

            if (methodMeta.access) {
              if (methodMeta.access === "protected") {
                decl += "protected ";
              }

              if (methodMeta.access === "private") {
                continue;
              }
            }

            if (isStatic) {
              decl += "static ";
            }

            if (classMeta.type != "interface" && methodMeta.abstract) {
              decl += "abstract ";
              comment += "Abstract ";
            }

            if (methodMeta.mixin) {
              comment += "Mixin ";
            }

            if (methodMeta.overriddenFrom) {
              comment += "Overridden from " + methodMeta.overriddenFrom + " ";
            }

            decl += this.__escapeMethodName__P_40_6(name) + "(";
            decl += this.serializeParameters(methodMeta);
            decl += ")";
            var returnType = "void";

            if (methodMeta.jsdoc && methodMeta.jsdoc["@return"]) {
              var tag = methodMeta.jsdoc["@return"][0];

              if (tag && tag.type) {
                returnType = this.getType(tag.type);
              }
            }

            decl += ": " + returnType;

            if (comment) {
              comment = " // " + comment;
            }

            let hasDescription = methodMeta.jsdoc && methodMeta.jsdoc["@description"] && methodMeta.jsdoc["@description"][0];

            if (hasDescription) {
              this.write(this.__indent__P_40_1 + "/**\n");
              methodMeta.jsdoc["@description"][0].body.split("\n").forEach(line => {
                this.write(this.__indent__P_40_1 + " * " + line + "\n");
              });
              this.write(this.__indent__P_40_1 + " */\n");
            }

            this.write(this.__indent__P_40_1 + (hideMethod ? "// " : "") + decl + ";" + comment + "\n");
          }
        }
      },

      /**
       * Escapes the name with quote marks, only if necessary
       *
       * @param name
       *          {String} the name to escape
       * @return {String} the escaped (if necessary) name
       */
      __escapeMethodName__P_40_6(name) {
        if (!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
          return '"' + name + '"';
        }

        return name;
      },

      /**
       * Serializes all the arguments of a method. Once one parameter is optional,
       * the remaining ones are also optional (is a TypeScript requirement)
       *
       * @return {String}
       */
      serializeParameters(methodMeta, optional = false) {
        var result = "";

        if (methodMeta && methodMeta.jsdoc) {
          var params = methodMeta.jsdoc["@param"];

          if (params) {
            params.forEach((paramMeta, paramIndex) => {
              var type = "any";
              var paramName = paramMeta.paramName || "unnamed" + paramIndex;
              var decl = paramName;

              if (paramName == "varargs") {
                optional = true;
              }

              if (paramMeta.optional || optional) {
                decl += "?";
                optional = true;
              }

              decl += ": ";

              if (paramMeta.type) {
                var tmp = null;

                if (qx.lang.Type.isArray(paramMeta.type)) {
                  if (paramMeta.type.length == 1) {
                    tmp = paramMeta.type[0];
                  }
                } else {
                  tmp = paramMeta.type;
                }

                if (tmp) {
                  type = this.getType(tmp);

                  if (tmp.dimensions) {
                    type += "[]";
                  }
                }
              }

              decl += type;

              if (paramIndex > 0) {
                result += ", ";
              }

              result += decl;
            });
          }
        }

        return result;
      },

      /**
       * Write the class or interface declaration
       */
      async writeClass(meta) {
        this.__currentClass__P_40_5 = meta; // qx.tool.compiler.Console.info("Processing class " + meta.packageName + "." + meta.name);

        var extendsClause = "";

        if (meta.superClass && meta.superClass !== "Object" && meta.superClass !== "Array" && meta.superClass !== "Error") {
          let superType = this.getType(meta.superClass);

          if (superType != "any") {
            extendsClause = " extends " + superType;
          }
        }

        var type = "class "; // default for class and mixins

        if (meta.type === "interface") {
          type = "interface ";
        } else if (meta.abstract) {
          type = "abstract " + type;
        }

        this.write("  // " + meta.className + "\n");
        this.write("  " + type + meta.name + extendsClause);

        if (meta.interfaces && meta.interfaces.length) {
          this.write(" implements " + meta.interfaces.join(", "));
        }

        this.write(" {\n");

        if (meta.type == "class") {
          this.writeConstructor(meta.construct);
        }

        if (meta.isSingleton) {
          this.writeMethods({
            getInstance: {
              type: "function",
              access: "public",
              jsdoc: {
                "@return": [{
                  type: meta.className
                }]
              }
            }
          }, meta, true);
        }

        this.writeMethods(meta.statics, meta, true);
        this.writeMethods(meta.members, meta);
        this.write("\n  }\n");
        this.__currentClass__P_40_5 = null;
      },

      /**
       * Write the module declaration if any.
       */
      async writeModule(meta) {
        var moduleName = meta.packageName;

        if (moduleName) {
          this.write("declare module " + moduleName + " {\n");
        } else {
          this.write("declare ");
        }

        await this.writeClass(meta);

        if (moduleName) {
          this.write("}\n");
        }
      }

    },
    statics: {
      IGNORE: {
        "qx.ui.virtual.core.CellEvent": ["init"],
        "qx.ui.table.columnmodel.resizebehavior.Default": ["set"],
        "qx.ui.progressive.renderer.table.Widths": ["set"],
        "qx.ui.table.columnmodel.resizebehavior": ["set"],
        "qx.ui.table.pane.CellEvent": ["init"],
        "qx.ui.mobile.dialog.Manager": ["error"],
        "qx.ui.mobile.container.Navigation": ["add"],
        "qx.ui.website.Table": ["filter", "sort"],
        "qx.ui.website.DatePicker": ["init", "sort"],
        "qx.event.type.Orientation": ["init"],
        "qx.event.type.KeySequence": ["init"],
        "qx.event.type.KeyInput": ["init"],
        "qx.event.type.GeoPosition": ["init"],
        "qx.event.type.Drag": ["init"],
        "qx.bom.request.SimpleXhr": ["addListener", "addListenerOnce"],
        "qx.event.dispatch.AbstractBubbling": ["dispatchEvent"],
        "qx.event.dispatch.Direct": ["dispatchEvent"],
        "qx.event.dispatch.MouseCapture": ["dispatchEvent"],
        "qx.event.type.Native": ["init"],
        "qx.html.Element": ["removeListener", "removeListenerById"],
        "qx.html.Flash": ["setAttribute"],
        "qx.util.LibraryManager": ["get", "set"]
      },
      TYPE_MAPPINGS: {
        Widget: "qx.ui.core.Widget",
        LayoutItem: "qx.ui.core.LayoutItem",
        AbstractTreeItem: "qx.ui.tree.core.AbstractTreeItem",
        ILayer: "qx.ui.virtual.core.ILayer",
        Axis: "qx.ui.virtual.core.Axis",
        DateFormat: "qx.util.format.DateFormat",
        LocalizedString: "qx.locale.LocalizedString",
        Decorator: "qx.ui.decoration.Decorator",
        Event: "qx.event.type.Event",
        CanvasRenderingContext2D: "CanvasRenderingContext2D",
        MWidgetController: "qx.ui.list.core.MWidgetController",
        IDesktop: "qx.ui.window.IDesktop",
        IWindowManager: "qx.ui.window.IWindowManager",
        Pane: "qx.ui.virtual.core.Pane",
        Class: "qx.Class",
        Interface: "qx.Interface",
        Mixin: "qx.Mixin",
        Theme: "qx.Theme",
        Boolean: "boolean",
        String: "string",
        Color: "string",
        Font: "string",
        Function: "Function",
        Date: "Date",
        Window: "Window",
        Document: "Document",
        document: "Document",
        Stylesheet: "StyleSheet",
        Node: "Node",
        "Custom check function": "Custom check function",
        Error: "ErrorImpl",
        Element: "HTMLElement",
        RegExp: "RegExp",
        var: "any",
        Array: "qx.data.Array",
        Object: "any",
        Map: "IMap",
        Integer: "number",
        Number: "number",
        Double: "number",
        Float: "number",
        PositiveInteger: "number",
        PositiveNumber: "number"
      }
    }
  });
  qx.tool.compiler.targets.TypeScriptWriter.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=TypeScriptWriter.js.map