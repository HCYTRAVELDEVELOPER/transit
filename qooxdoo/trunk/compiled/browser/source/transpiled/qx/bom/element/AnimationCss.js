(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.CssAnimation": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.Event": {},
      "qx.bom.element.Style": {},
      "qx.log.Logger": {},
      "qx.lang.String": {},
      "qx.bom.element.AnimationHandle": {},
      "qx.bom.element.Transform": {},
      "qx.bom.Style": {},
      "qx.bom.client.OperatingSystem": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "load": true,
          "className": "qx.bom.client.CssAnimation"
        },
        "qx.debug": {
          "load": true
        },
        "os.name": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class is responsible for applying CSS3 animations to plain DOM elements.
   *
   * The implementation is mostly a cross-browser wrapper for applying the
   * animations, including transforms. If the browser does not support
   * CSS animations, but you have set a keep frame, the keep frame will be applied
   * immediately, thus making the animations optional.
   *
   * The API aligns closely to the spec wherever possible.
   *
   * http://www.w3.org/TR/css3-animations/
   *
   * {@link qx.bom.element.Animation} is the class, which takes care of the
   * feature detection for CSS animations and decides which implementation
   * (CSS or JavaScript) should be used. Most likely, this implementation should
   * be the one to use.
   */
  qx.Bootstrap.define("qx.bom.element.AnimationCss", {
    statics: {
      // initialization
      __sheet__P_55_0: null,
      __rulePrefix__P_55_1: "Anni",
      __id__P_55_2: 0,

      /** Static map of rules */
      __rules__P_55_3: {},

      /** The used keys for transforms. */
      __transitionKeys__P_55_4: {
        scale: true,
        rotate: true,
        skew: true,
        translate: true
      },

      /** Map of cross browser CSS keys. */
      __cssAnimationKeys__P_55_5: qx.core.Environment.get("css.animation"),

      /**
       * This is the main function to start the animation in reverse mode.
       * For further details, take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animateReverse(el, desc, duration) {
        return this._animate(el, desc, duration, true);
      },

      /**
       * This is the main function to start the animation. For further details,
       * take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animate(el, desc, duration) {
        return this._animate(el, desc, duration, false);
      },

      /**
       * Internal method to start an animation either reverse or not.
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be
       *   reversed.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      _animate(el, desc, duration, reverse) {
        this.__normalizeDesc__P_55_6(desc); // debug validation


        {
          this.__validateDesc__P_55_7(desc);
        } // reverse the keep property if the animation is reverse as well

        var keep = desc.keep;

        if (keep != null && (reverse || desc.alternate && desc.repeat % 2 == 0)) {
          keep = 100 - keep;
        }

        if (!this.__sheet__P_55_0) {
          this.__sheet__P_55_0 = qx.bom.Stylesheet.createElement();
        }

        var keyFrames = desc.keyFrames;

        if (duration == undefined) {
          duration = desc.duration;
        } // if animations are supported


        if (this.__cssAnimationKeys__P_55_5 != null) {
          var name = this.__addKeyFrames__P_55_8(keyFrames, reverse);

          var style = name + " " + duration + "ms " + desc.timing + " " + (desc.delay ? desc.delay + "ms " : "") + desc.repeat + " " + (desc.alternate ? "alternate" : "");
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_55_5["start-event"], this.__onAnimationStart__P_55_9);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_55_5["iteration-event"], this.__onAnimationIteration__P_55_10);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_55_5["end-event"], this.__onAnimationEnd__P_55_11);
          {
            if (qx.bom.element.Style.get(el, "display") == "none") {
              qx.log.Logger.warn(el, "Some browsers will not animate elements with display==none");
            }
          }
          el.style[qx.lang.String.camelCase(this.__cssAnimationKeys__P_55_5["name"])] = style; // use the fill mode property if available and suitable

          if (keep && keep == 100 && this.__cssAnimationKeys__P_55_5["fill-mode"]) {
            el.style[this.__cssAnimationKeys__P_55_5["fill-mode"]] = "forwards";
          }
        }

        var animation = new qx.bom.element.AnimationHandle();
        animation.desc = desc;
        animation.el = el;
        animation.keep = keep;
        el.$$animation = animation; // additional transform keys

        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, desc.origin);
        } // fallback for browsers not supporting animations


        if (this.__cssAnimationKeys__P_55_5 == null) {
          window.setTimeout(function () {
            qx.bom.element.AnimationCss.__onAnimationEnd__P_55_11({
              target: el
            });
          }, 0);
        }

        return animation;
      },

      /**
       * Handler for the animation start.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationStart__P_55_9(e) {
        if (e.target.$$animation) {
          e.target.$$animation.emit("start", e.target);
        }
      },

      /**
       * Handler for the animation iteration.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationIteration__P_55_10(e) {
        // It could happen that an animation end event is fired before an
        // animation iteration appears [BUG #6928]
        if (e.target != null && e.target.$$animation != null) {
          e.target.$$animation.emit("iteration", e.target);
        }
      },

      /**
       * Handler for the animation end.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationEnd__P_55_11(e) {
        var el = e.target;
        var animation = el.$$animation; // ignore events when already cleaned up

        if (!animation) {
          return;
        }

        var desc = animation.desc;

        if (qx.bom.element.AnimationCss.__cssAnimationKeys__P_55_5 != null) {
          // reset the styling
          var key = qx.lang.String.camelCase(qx.bom.element.AnimationCss.__cssAnimationKeys__P_55_5["name"]);
          el.style[key] = "";
          qx.bom.Event.removeNativeListener(el, qx.bom.element.AnimationCss.__cssAnimationKeys__P_55_5["name"], qx.bom.element.AnimationCss.__onAnimationEnd__P_55_11);
        }

        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, "");
        }

        qx.bom.element.AnimationCss.__keepFrame__P_55_12(el, desc.keyFrames[animation.keep]);

        el.$$animation = null;
        animation.el = null;
        animation.ended = true;
        animation.emit("end", el);
      },

      /**
       * Helper method which takes an element and a key frame description and
       * applies the properties defined in the given frame to the element. This
       * method is used to keep the state of the animation.
       * @param el {Element} The element to apply the frame to.
       * @param endFrame {Map} The description of the end frame, which is basically
       *   a map containing CSS properties and values including transforms.
       */
      __keepFrame__P_55_12(el, endFrame) {
        // keep the element at this animation step
        var transforms;

        for (var style in endFrame) {
          if (style in qx.bom.element.AnimationCss.__transitionKeys__P_55_4) {
            if (!transforms) {
              transforms = {};
            }

            transforms[style] = endFrame[style];
          } else {
            el.style[qx.lang.String.camelCase(style)] = endFrame[style];
          }
        } // transform keeping


        if (transforms) {
          qx.bom.element.Transform.transform(el, transforms);
        }
      },

      /**
       * Preprocessing of the description to make sure every necessary key is
       * set to its default.
       * @param desc {Map} The description of the animation.
       */
      __normalizeDesc__P_55_6(desc) {
        if (!desc.hasOwnProperty("alternate")) {
          desc.alternate = false;
        }

        if (!desc.hasOwnProperty("keep")) {
          desc.keep = null;
        }

        if (!desc.hasOwnProperty("repeat")) {
          desc.repeat = 1;
        }

        if (!desc.hasOwnProperty("timing")) {
          desc.timing = "linear";
        }

        if (!desc.hasOwnProperty("origin")) {
          desc.origin = null;
        }
      },

      /**
       * Debugging helper to validate the description.
       * @signature function(desc)
       * @param desc {Map} The description of the animation.
       */
      __validateDesc__P_55_7: qx.core.Environment.select("qx.debug", {
        true(desc) {
          var possibleKeys = ["origin", "duration", "keep", "keyFrames", "delay", "repeat", "timing", "alternate"]; // check for unknown keys

          for (var name in desc) {
            if (!(possibleKeys.indexOf(name) != -1)) {
              qx.Bootstrap.warn("Unknown key '" + name + "' in the animation description.");
            }
          }

          if (desc.keyFrames == null) {
            qx.Bootstrap.warn("No 'keyFrames' given > 0");
          } else {
            // check the key frames
            for (var pos in desc.keyFrames) {
              if (pos < 0 || pos > 100) {
                qx.Bootstrap.warn("Keyframe position needs to be between 0 and 100");
              }
            }
          }
        },

        default: null
      }),

      /**
       * Helper to add the given frames to an internal CSS stylesheet. It parses
       * the description and adds the key frames to the sheet.
       * @param frames {Map} A map of key frames that describe the animation.
       * @param reverse {Boolean} <code>true</code>, if the key frames should
       *   be added in reverse order.
       * @return {String} The generated name of the keyframes rule.
       */
      __addKeyFrames__P_55_8(frames, reverse) {
        var rule = ""; // for each key frame

        for (var position in frames) {
          rule += (reverse ? -(position - 100) : position) + "% {";
          var frame = frames[position];
          var transforms; // each style

          for (var style in frame) {
            if (style in this.__transitionKeys__P_55_4) {
              if (!transforms) {
                transforms = {};
              }

              transforms[style] = frame[style];
            } else {
              var propName = qx.bom.Style.getPropertyName(style);
              var prefixed = propName !== null ? qx.bom.Style.getCssName(propName) : "";
              rule += (prefixed || style) + ":" + frame[style] + ";";
            }
          } // transform handling


          if (transforms) {
            rule += qx.bom.element.Transform.getCss(transforms);
          }

          rule += "} ";
        } // cached shorthand


        if (this.__rules__P_55_3[rule]) {
          return this.__rules__P_55_3[rule];
        }

        var name = this.__rulePrefix__P_55_1 + this.__id__P_55_2++;
        var selector = this.__cssAnimationKeys__P_55_5["keyframes"] + " " + name;
        qx.bom.Stylesheet.addRule(this.__sheet__P_55_0, selector, rule);
        this.__rules__P_55_3[rule] = name;
        return name;
      },

      /**
       * Internal helper to reset the cache.
       */
      __clearCache__P_55_13() {
        this.__id__P_55_2 = 0;

        if (this.__sheet__P_55_0) {
          this.__sheet__P_55_0.ownerNode.remove();

          this.__sheet__P_55_0 = null;
          this.__rules__P_55_3 = {};
        }
      }

    },

    defer(statics) {
      // iOS 8 seems to stumble over the old sheet object on tab
      // changes or leaving the browser [BUG #8986]
      if (qx.core.Environment.get("os.name") === "ios" && parseInt(qx.core.Environment.get("os.version")) >= 8) {
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) {
            statics.__clearCache__P_55_13();
          }
        }, false);
      }
    }

  });
  qx.bom.element.AnimationCss.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AnimationCss.js.map?dt=1658886720224