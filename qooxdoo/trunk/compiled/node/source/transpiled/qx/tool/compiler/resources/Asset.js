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
      "qx.lang.Array": {},
      "qx.tool.utils.Promisify": {},
      "qx.tool.utils.files.Utils": {},
      "qx.tool.utils.Utils": {}
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
   *      2011-2019 Zenesis Limited, http://www.zenesis.com
   *
   *    License:
   *      MIT: https://opensource.org/licenses/MIT
   *
   *      This software is provided under the same licensing terms as Qooxdoo,
   *      please see the LICENSE file in the Qooxdoo project's top-level directory
   *      for details.
   *
   *    Authors:
   *      * John Spackman (john.spackman@zenesis.com, @johnspackman)
   *
   * *********************************************************************** */
  const path = require("upath");

  qx.Class.define("qx.tool.compiler.resources.Asset", {
    extend: qx.core.Object,

    construct(library, filename, fileInfo) {
      qx.core.Object.constructor.call(this);
      this.__library__P_35_0 = library;
      this.__filename = filename;
      this.__fileInfo__P_35_1 = fileInfo;
    },

    members: {
      /** {Library} that this asset belongs to */
      __library__P_35_0: null,

      /** {String} path within the library resources */
      __filename: null,

      /** {Object} the data in the database */
      __fileInfo__P_35_1: null,

      /** {ResourceLoader[]?} array of loaders */
      __loaders__P_35_2: null,

      /** {ResourceConverter[]?} array of converters */
      __converters__P_35_3: null,

      /** {Asset[]?} list of assets which refer to this asset (eg for image combining) */
      __metaReferees__P_35_4: null,

      /** {Asset[]?} list of assets which the meta in this asset refers to (eg for image combining) */
      __metaReferTo__P_35_5: null,

      /** {Asset[]?} list of assets which this asset depends on */
      __dependsOn__P_35_6: null,

      /** {Asset[]?} list of assets which depend on this asset */
      __dependsOnThisAsset__P_35_7: null,

      getLibrary() {
        return this.__library__P_35_0;
      },

      getFilename() {
        return this.__filename;
      },

      getFileInfo() {
        return this.__fileInfo__P_35_1;
      },

      isThemeFile() {
        return this.__fileInfo__P_35_1.resourcePath == "themePath";
      },

      getSourceFilename() {
        return path.relative(process.cwd(), this.isThemeFile() ? this.__library__P_35_0.getThemeFilename(this.__filename) : this.__library__P_35_0.getResourceFilename(this.__filename));
      },

      getDestFilename(target) {
        let filename = null;

        if (this.__converters__P_35_3) {
          filename = this.__converters__P_35_3[this.__converters__P_35_3.length - 1].getDestFilename(target, this);
        }

        return filename ? filename : path.relative(process.cwd(), path.join(target.getOutputDir(), "resource", this.__filename));
      },

      setLoaders(loaders) {
        this.__loaders__P_35_2 = loaders.length ? loaders : null;
      },

      setConverters(converters) {
        this.__converters__P_35_3 = converters.length ? converters : null;
      },

      addMetaReferee(asset) {
        if (!this.__metaReferees__P_35_4) {
          this.__metaReferees__P_35_4 = [];
        }

        if (!qx.lang.Array.contains(this.__metaReferees__P_35_4, asset)) {
          this.__metaReferees__P_35_4.push(asset);
        }
      },

      getMetaReferees() {
        return this.__metaReferees__P_35_4;
      },

      addMetaReferTo(asset) {
        if (!this.__metaReferTo__P_35_5) {
          this.__metaReferTo__P_35_5 = [];
        }

        if (!qx.lang.Array.contains(this.__metaReferTo__P_35_5, asset)) {
          this.__metaReferTo__P_35_5.push(asset);
        }
      },

      getMetaReferTo() {
        return this.__metaReferTo__P_35_5;
      },

      setDependsOn(assets) {
        if (this.__dependsOn__P_35_6) {
          this.__dependsOn__P_35_6.forEach(thatAsset => delete thatAsset.__dependsOnThisAsset__P_35_7[this.getFilename]);
        }

        if (assets && assets.length) {
          this.__dependsOn__P_35_6 = assets;
          this.__fileInfo__P_35_1.dependsOn = assets.map(asset => asset.toUri());
          assets.forEach(thatAsset => {
            if (!thatAsset.__dependsOnThisAsset__P_35_7) {
              thatAsset.__dependsOnThisAsset__P_35_7 = {};
            }

            thatAsset.__dependsOnThisAsset__P_35_7[this.getFilename()] = this;
          });
        } else {
          this.__dependsOn__P_35_6 = null;
          delete this.__fileInfo__P_35_1.dependsOn;
        }
      },

      getDependsOn() {
        return this.__dependsOn__P_35_6;
      },

      getDependsOnThisAsset() {
        return this.__dependsOnThisAsset__P_35_7 ? Object.values(this.__dependsOnThisAsset__P_35_7) : null;
      },

      async load() {
        if (this.__loaders__P_35_2) {
          this.__loaders__P_35_2.forEach(loader => loader.load(this));
        }
      },

      async sync(target) {
        let destFilename = this.getDestFilename(target);
        let srcFilename = this.getSourceFilename();

        if (this.__converters__P_35_3) {
          let doNotCopy = await qx.tool.utils.Promisify.some(this.__converters__P_35_3, converter => converter.isDoNotCopy(srcFilename));

          if (doNotCopy) {
            return;
          }
        }

        let destStat = await qx.tool.utils.files.Utils.safeStat(destFilename);

        if (destStat) {
          let filenames = [this.getSourceFilename()];

          if (this.__dependsOn__P_35_6) {
            this.__dependsOn__P_35_6.forEach(asset => filenames.push(asset.getSourceFilename()));
          }

          let needsIt = await qx.tool.utils.Promisify.some(filenames, async filename => {
            let srcStat = await qx.tool.utils.files.Utils.safeStat(filename);
            return srcStat && srcStat.mtime.getTime() > destStat.mtime.getTime();
          });

          if (!needsIt && this.__converters__P_35_3) {
            needsIt = await qx.tool.utils.Promisify.some(this.__converters__P_35_3, converter => converter.needsConvert(target, this, srcFilename, destFilename, this.isThemeFile()));
          }

          if (!needsIt) {
            return;
          }
        }

        await qx.tool.utils.Utils.makeParentDir(destFilename);

        if (this.__converters__P_35_3) {
          let dependsOn = [];

          if (this.__converters__P_35_3.length == 1) {
            dependsOn = (await this.__converters__P_35_3[0].convert(target, this, srcFilename, destFilename, this.isThemeFile())) || [];
          } else {
            let lastTempFilename = null;
            qx.tool.utils.Promisify.each(this.__converters__P_35_3, async (converter, index) => {
              let tmpSrc = lastTempFilename ? lastTempFilename : srcFilename;
              let tmpDest = index === this.__converters__P_35_3.length - 1 ? destFilename : path.join(require("os").tmpdir(), path.basename(srcFilename) + "-pass" + (index + 1) + "-");
              let tmpDependsOn = (await converter.convert(target, this, tmpSrc, tmpDest, this.isThemeFile())) || [];
              tmpDependsOn.forEach(str => dependsOn.push(str));
              lastTempFilename = tmpDest;
            });
          }

          let rm = target.getAnalyser().getResourceManager();
          dependsOn = dependsOn.map(filename => rm.getAsset(path.resolve(filename), true, this.isThemeFile())).filter(tmp => tmp !== this);
          this.setDependsOn(dependsOn);
        } else {
          await qx.tool.utils.files.Utils.copyFile(srcFilename, destFilename);
        }
      },

      toUri() {
        return this.__library__P_35_0.getNamespace() + ":" + this.__filename;
      },

      toString() {
        return this.toUri();
      }

    }
  });
  qx.tool.compiler.resources.Asset.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Asset.js.map