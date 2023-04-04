const totalDaySeconds = 86400;
const totalWeekSeconds = 604800;
const daySeconds = 86400;
const hourSeconds = 3600;
const minuteSeconds = 60;

const dayAngle = 51.4285714286; // 360 deg / 7 days

var script = {
  name: "DayClock",
  props: {},
  data() {
    return {
      activeDay: 0,
      weekPercentage: 0,
      dayPercentage: 0,
      weekNumber: 0,
      showPercentages: false,
      isUpdateClockActive: true,
      isDebugActive: false
    };
  },
  computed: {
    clockArmStyle() {
      return {
        transform: `rotate(${360 * this.weekPercentage}deg)`
      };
    },
    clockArmStyleText() {
      return {
        transform: `rotate(${360 * this.weekPercentage}deg)`
      };
    },
    clockArmInnerStyleText() {
      return {
        transform: `rotate(${-360 * this.weekPercentage}deg)`
      };
    },
    clockDayInfoStyle() {
      return {
        transform: `rotate(${-dayAngle / 2 + this.activeDay * dayAngle}deg)`
      };
    },
    clockDayInfoTextStyle() {
      return {
        transform: `rotate(${dayAngle / 2 + this.activeDay * -dayAngle}deg)`
      };
    },
    dayPercentageDisplay() {
      return Math.round(100 * this.dayPercentage);
    },
    weekPercentageDisplay() {
      return Math.round(100 * this.weekPercentage);
    }
  },
  methods: {
    updateClock(getDateMethod) {
      let { date, d, h, m, s } = getDateMethod();

      if (d === 0) d = 7; // Sunday is last

      let currentDaySeconds = h * hourSeconds + m * minuteSeconds + s;
      let currentWeekSeconds =
        (d - 1) * daySeconds + h * hourSeconds + m * minuteSeconds + s;

      this.activeDay = d;
      this.dayPercentage = currentDaySeconds / totalDaySeconds;
      this.weekPercentage = currentWeekSeconds / totalWeekSeconds;
      this.weekNumber = getWeekNumber(date);

      let title = `${this.weekPercentageDisplay}% Week`;
      document.title = title;
    },
    debugChangeRandeSlider(event) {
      let date = new Date();
      let first = new Date(2020, 1, 3, 0, 0, 0).getTime();
      let last = new Date(2020, 1, 9, 23, 59, 59).getTime();

      let day = rangeMap(event.target.value, 0, 100, first, last);

      let debugDate = new Date(day);

      this.updateClock(() => ({
        date, // for correct week number
        d: debugDate.getDay(),
        h: debugDate.getHours(),
        m: debugDate.getMinutes(),
        s: debugDate.getSeconds()
      }));
    },
    debugToggle() {
      this.isDebugActive = !this.isDebugActive;
      if (this.isDebugActive) this.isUpdateClockActive = false;
      if (!this.isDebugActive) this.isUpdateClockActive = true;
    }
  },
  created() {
    this.updateClock(getDate);
  },
  mounted() {
    const second = 1000;
    this.intervalKey = setInterval(() => {
      this.isUpdateClockActive && this.updateClock(getDate);
    }, 10 * second);
  },
  beforeDestroy() {
    clearInterval(this.intervalKey);
  }
};

function getDate() {
  let date = new Date();

  return {
    date,
    d: date.getDay(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
}

// https://stackoverflow.com/a/6117889/815507
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

// map value x in range [a,b] to [c,d]
function rangeMap(x, a, b, c, d) {
  if (a === b) return c;
  if (c === d) return c;
  return ((x - a) / (b - a)) * (d - c) + c;
}

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "clock" }, [
    _c("div", { staticClass: "container" }, [
      _c("div", { staticClass: "days-pie-chart" }, [
        _c("div", { class: [{ active: _vm.activeDay === 1 }, "day day--1"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 2 }, "day day--2"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 3 }, "day day--3"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 4 }, "day day--4"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 5 }, "day day--5"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 6 }, "day day--6"] }, [
          _c("div")
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 7 }, "day day--7"] }, [
          _c("div")
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "days" }, [
        _c("div", { class: [{ active: _vm.activeDay === 1 }, "day day--1"] }, [
          _vm._m(0)
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 2 }, "day day--2"] }, [
          _vm._m(1)
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 3 }, "day day--3"] }, [
          _c(
            "p",
            { staticClass: "text", attrs: { "aria-label": "wednesday" } },
            [
              _c("i", [_vm._v("w")]),
              _c("i", [_vm._v("e")]),
              _c(
                "i",
                {
                  staticClass: "no-click-highlight",
                  on: { dblclick: _vm.debugToggle }
                },
                [_vm._v("d")]
              )
            ]
          )
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 4 }, "day day--4"] }, [
          _vm._m(2)
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 5 }, "day day--5"] }, [
          _vm._m(3)
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 6 }, "day day--6"] }, [
          _vm._m(4)
        ]),
        _vm._v(" "),
        _c("div", { class: [{ active: _vm.activeDay === 7 }, "day day--7"] }, [
          _vm._m(5)
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "days-pie-chart-center-circle" }),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showPercentages,
              expression: "showPercentages"
            }
          ],
          staticClass: "clock-day-info",
          style: _vm.clockDayInfoStyle
        },
        [
          _c("div", { staticClass: "day", style: _vm.clockDayInfoTextStyle }, [
            _c("div", [
              _c("span", { staticClass: "number" }, [
                _vm._v(_vm._s(_vm.dayPercentageDisplay))
              ]),
              _c("span", [_vm._v("%")])
            ])
          ])
        ]
      ),
      _vm._v(" "),
      _c("button", {
        staticClass: "clock-arm button",
        style: _vm.clockArmStyle,
        attrs: { "aria-label": "toggle percentage text" },
        on: {
          click: function($event) {
            _vm.showPercentages = !_vm.showPercentages;
          }
        }
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showPercentages,
              expression: "showPercentages"
            }
          ],
          staticClass: "clock-arm-text",
          style: _vm.clockArmStyleText
        },
        [
          _c(
            "div",
            {
              staticClass: "clock-arm-text-inner",
              style: _vm.clockArmInnerStyleText
            },
            [
              _c("div", [
                _c("div", [_vm._v("Week " + _vm._s(_vm.weekNumber))]),
                _vm._v(" "),
                _c("span", { staticClass: "number" }, [
                  _vm._v(_vm._s(_vm.weekPercentageDisplay))
                ]),
                _c("span", [_vm._v("%")])
              ])
            ]
          )
        ]
      )
    ]),
    _vm._v(" "),
    _vm.isDebugActive
      ? _c("div", { staticClass: "debug" }, [
          _c("span", [_vm._v("Debug: ")]),
          _vm._v(" "),
          _c("label", [
            _vm._v("auto-update clock:\n      "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.isUpdateClockActive,
                  expression: "isUpdateClockActive"
                }
              ],
              attrs: { type: "checkbox" },
              domProps: {
                checked: Array.isArray(_vm.isUpdateClockActive)
                  ? _vm._i(_vm.isUpdateClockActive, null) > -1
                  : _vm.isUpdateClockActive
              },
              on: {
                change: function($event) {
                  var $$a = _vm.isUpdateClockActive,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false;
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v);
                    if ($$el.checked) {
                      $$i < 0 && (_vm.isUpdateClockActive = $$a.concat([$$v]));
                    } else {
                      $$i > -1 &&
                        (_vm.isUpdateClockActive = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)));
                    }
                  } else {
                    _vm.isUpdateClockActive = $$c;
                  }
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "range", min: "0", max: "100", step: "1" },
            on: { input: _vm.debugChangeRandeSlider }
          }),
          _vm._v(" "),
          _c("button", { on: { click: _vm.debugToggle } }, [_vm._v("close")])
        ])
      : _vm._e()
  ])
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("p", { staticClass: "text", attrs: { "aria-label": "monday" } }, [
      _c("i", [_vm._v("m")]),
      _c("i", [_vm._v("o")]),
      _c("i", [_vm._v("n")])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "p",
      { staticClass: "text", attrs: { "aria-label": "tuesday" } },
      [_c("i", [_vm._v("t")]), _c("i", [_vm._v("u")]), _c("i", [_vm._v("e")])]
    )
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "p",
      { staticClass: "text", attrs: { "aria-label": "thursday" } },
      [_c("i", [_vm._v("t")]), _c("i", [_vm._v("h")]), _c("i", [_vm._v("u")])]
    )
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("p", { staticClass: "text", attrs: { "aria-label": "friday" } }, [
      _c("i", [_vm._v("f")]),
      _c("i", [_vm._v("r")]),
      _c("i", [_vm._v("i")])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "p",
      { staticClass: "text", attrs: { "aria-label": "saturday" } },
      [_c("i", [_vm._v("s")]), _c("i", [_vm._v("a")]), _c("i", [_vm._v("t")])]
    )
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("p", { staticClass: "text", attrs: { "aria-label": "sunday" } }, [
      _c("i", [_vm._v("s")]),
      _c("i", [_vm._v("u")]),
      _c("i", [_vm._v("n")])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-023e18e2_0", { source: "* {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  font-size: 100%;\n}\n*,\n:before,\n:after {\n  box-sizing: border-box;\n}\nbody {\n  font-family: \"Roboto Mono\", monospace;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #2c3e50;\n  overflow: hidden;\n  background: radial-gradient(transparent, rgba(255, 200, 255, 0.4));\n}\n.container {\n  width: 80vmin;\n  height: 80vmin;\n  border-radius: 50%;\n  overflow: hidden;\n  box-shadow: 0 0 0 1px transparent;\n  _background: white;\n}\nbutton,\n.button {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  cursor: pointer;\n  border: none;\n  box-shadow: none;\n  background: transparent;\n  outline: none;\n}\n.no-click-highlight {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  _cursor: pointer;\n}\n.clock {\n  width: 100vw;\n  height: 100vh;\n  display: grid;\n  place-items: center;\n}\n.clock-arm {\n  transform-origin: 50% 50%;\n  position: absolute;\n  top: calc(50% - 2vmin);\n  left: calc(50% - 2vmin);\n  width: 4vmin;\n  height: 4vmin;\n  background: #ff821c;\n  border-radius: 50%;\n}\n.clock-arm::before {\n  content: \"\";\n  pointer-events: none;\n  display: block;\n  position: absolute;\n  bottom: 0;\n  left: calc(50% - 2px);\n  width: 4px;\n  border-radius: 4px;\n  height: 12vmin;\n  background: #ff821c;\n  z-index: -1;\n}\n.clock-arm-text {\n  pointer-events: none;\n  position: absolute;\n  top: calc(50% - 6vmin);\n  left: calc(50% - 6vmin);\n  width: 12vmin;\n  height: 12vmin;\n  transform-origin: 50% 50%;\n}\n.clock-arm-text .clock-arm-text-inner {\n  transform-origin: 50% 50%;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 6em;\n  height: 12vmin;\n  text-align: left;\n  color: #ff821c;\n  font-weight: bold;\n  display: grid;\n  place-items: center;\n  font-size: 14px;\n}\n@media (min-height: 500px) and (min-width: 500px) {\n.clock-arm-text .clock-arm-text-inner {\n    height: 3em;\n}\n}\n@media (min-height: 500px) and (min-width: 500px) {\n.clock-arm-text .clock-arm-text-inner {\n    font-size: 16px;\n}\n}\n.clock-arm-text .number {\n  margin-right: 2px;\n}\n.clock-day-info {\n  pointer-events: none;\n  position: absolute;\n  height: 26.6666666667vmin;\n  width: 40px;\n  bottom: calc(50%);\n  left: calc(50% - 20px);\n  transform-origin: 50% 100%;\n  font-size: 14px;\n}\n@media (min-height: 500px) and (min-width: 500px) {\n.clock-day-info {\n    font-size: 16px;\n}\n}\n.clock-day-info .day {\n  line-height: 1;\n  text-align: center;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  color: white;\n  font-weight: bold;\n}\n.clock-day-info .day .number {\n  margin-right: 2px;\n}\n.days-pie-chart-center-circle {\n  display: none;\n  position: absolute;\n  top: calc(50% - 13.3333333333vmin);\n  left: calc(50% - 13.3333333333vmin);\n  width: 26.6666666667vmin;\n  height: 26.6666666667vmin;\n  background: white;\n  border-radius: 50%;\n  transform: rotate(45deg);\n  box-shadow: 0 0 0 1px transparent;\n}\n.days-pie-chart {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  transform: rotate(38.5714285714deg);\n  pointer-events: none;\n}\n.days-pie-chart .day {\n  position: absolute;\n  box-shadow: 0 0 0 1px transparent;\n  width: 80vmin;\n  height: 80vmin;\n  width: 100%;\n  height: 100%;\n  transform-origin: 100% 100%;\n  left: calc(50% - 80vmin);\n  top: calc(50% - 80vmin);\n  transition: background 500ms;\n  pointer-events: all;\n}\n.days-pie-chart .day > div {\n  position: absolute;\n  background: #ffc8ff;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  width: 100%;\n  height: 100%;\n}\n.days-pie-chart .day--1 {\n  transform: rotate(51.4285714286deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--2 {\n  transform: rotate(102.8571428572deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--3 {\n  transform: rotate(154.2857142858deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--4 {\n  transform: rotate(205.7142857144deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--5 {\n  transform: rotate(257.142857143deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--6 {\n  transform: rotate(308.5714285716deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--7 {\n  transform: rotate(360.0000000002deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day.active {\n  background: radial-gradient(transparent, #ff821c, transparent);\n}\n.days-pie-chart .day.active > div {\n  background: transparent;\n}\n.days {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  transform: rotate(-26deg);\n}\n.days .day {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  text-align: center;\n  color: gray;\n  transition: color 500ms;\n}\n.days .day--1 {\n  transform: rotate(51.4285714286deg);\n}\n.days .day--2 {\n  transform: rotate(102.8571428572deg);\n}\n.days .day--3 {\n  transform: rotate(154.2857142858deg);\n}\n.days .day--4 {\n  transform: rotate(205.7142857144deg);\n}\n.days .day--5 {\n  transform: rotate(257.142857143deg);\n}\n.days .day--6 {\n  transform: rotate(308.5714285716deg);\n}\n.days .day--7 {\n  transform: rotate(360.0000000002deg);\n}\n.days .day.active {\n  color: white;\n}\n.days .day .text {\n  pointer-events: all;\n  padding-top: 3vmin;\n  user-select: none;\n  text-transform: uppercase;\n  font-weight: bold;\n  outline: 1px solid transparent;\n  line-height: 1;\n}\n.days .day .text i {\n  font-size: 8vmin;\n  line-height: inherit;\n  font-style: normal;\n  display: inline-block;\n  min-width: 0.8em;\n  _outline: 1px solid transparent;\n}\n.days .day .text i:nth-child(1) {\n  transform: rotate(-12deg);\n}\n.days .day .text i:nth-child(2) {\n  transform: translateY(-1vmin);\n}\n.days .day .text i:nth-child(3) {\n  transform: rotate(12deg);\n}\n.days .day--3 .text, .days .day--4 .text, .days .day--5 .text {\n  padding-top: 0;\n  padding-bottom: 3vmin;\n  transform: rotate(0.5turn);\n}\n.days .day--3 .text i:nth-child(1), .days .day--4 .text i:nth-child(1), .days .day--5 .text i:nth-child(1) {\n  transform: rotate(12deg);\n}\n.days .day--3 .text i:nth-child(2), .days .day--4 .text i:nth-child(2), .days .day--5 .text i:nth-child(2) {\n  transform: translateY(1vmin);\n}\n.days .day--3 .text i:nth-child(3), .days .day--4 .text i:nth-child(3), .days .day--5 .text i:nth-child(3) {\n  transform: rotate(-12deg);\n}\n.debug {\n  position: absolute;\n  top: 4px;\n  right: 4px;\n}\n.debug input[type=range] {\n  margin-left: 2px;\n  margin-right: 6px;\n}\n.debug button {\n  box-shadow: 0 0 0 1px gray;\n  padding: 4px 8px;\n}\n\n/*# sourceMappingURL=pen.vue.map */", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue","pen.vue"],"names":[],"mappings":"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","file":"pen.vue","sourcesContent":["<template>\n  <div class=\"clock\">\n    <div class=\"container\">\n      <div class=\"days-pie-chart\">\n        <div :class=\"[{ active: activeDay === 1 }, 'day day--1']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 2 }, 'day day--2']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 3 }, 'day day--3']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 4 }, 'day day--4']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 5 }, 'day day--5']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 6 }, 'day day--6']\">\n          <div></div>\n        </div>\n        <div :class=\"[{ active: activeDay === 7 }, 'day day--7']\">\n          <div></div>\n        </div>\n      </div>\n\n      <div class=\"days\">\n        <div :class=\"[{ active: activeDay === 1 }, 'day day--1']\">\n          <p class=\"text\" aria-label=\"monday\"><i>m</i><i>o</i><i>n</i></p>\n        </div>\n        <div :class=\"[{ active: activeDay === 2 }, 'day day--2']\">\n          <p class=\"text\" aria-label=\"tuesday\"><i>t</i><i>u</i><i>e</i></p>\n        </div>\n        <div :class=\"[{ active: activeDay === 3 }, 'day day--3']\">\n          <p class=\"text\" aria-label=\"wednesday\">\n            <i>w</i><i>e</i\n            ><i class=\"no-click-highlight\" @dblclick=\"debugToggle\">d</i>\n          </p>\n        </div>\n        <div :class=\"[{ active: activeDay === 4 }, 'day day--4']\">\n          <p class=\"text\" aria-label=\"thursday\"><i>t</i><i>h</i><i>u</i></p>\n        </div>\n        <div :class=\"[{ active: activeDay === 5 }, 'day day--5']\">\n          <p class=\"text\" aria-label=\"friday\"><i>f</i><i>r</i><i>i</i></p>\n        </div>\n        <div :class=\"[{ active: activeDay === 6 }, 'day day--6']\">\n          <p class=\"text\" aria-label=\"saturday\"><i>s</i><i>a</i><i>t</i></p>\n        </div>\n        <div :class=\"[{ active: activeDay === 7 }, 'day day--7']\">\n          <p class=\"text\" aria-label=\"sunday\"><i>s</i><i>u</i><i>n</i></p>\n        </div>\n      </div>\n\n      <div class=\"days-pie-chart-center-circle\"></div>\n\n      <div\n        class=\"clock-day-info\"\n        :style=\"clockDayInfoStyle\"\n        v-show=\"showPercentages\"\n      >\n        <div class=\"day\" :style=\"clockDayInfoTextStyle\">\n          <div>\n            <span class=\"number\">{{ dayPercentageDisplay }}</span\n            ><span>%</span>\n          </div>\n        </div>\n      </div>\n      <button\n        class=\"clock-arm button\"\n        :style=\"clockArmStyle\"\n        @click=\"showPercentages = !showPercentages\"\n        aria-label=\"toggle percentage text\"\n      ></button>\n      <div\n        class=\"clock-arm-text\"\n        :style=\"clockArmStyleText\"\n        v-show=\"showPercentages\"\n      >\n        <div class=\"clock-arm-text-inner\" :style=\"clockArmInnerStyleText\">\n          <div>\n            <div>Week {{ weekNumber }}</div>\n            <span class=\"number\">{{ weekPercentageDisplay }}</span\n            ><span>%</span>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"debug\" v-if=\"isDebugActive\">\n      <span>Debug: </span>\n      <label\n        >auto-update clock:\n        <input type=\"checkbox\" v-model=\"isUpdateClockActive\"\n      /></label>\n      <input\n        type=\"range\"\n        min=\"0\"\n        max=\"100\"\n        step=\"1\"\n        @input=\"debugChangeRandeSlider\"\n      />\n      <button @click=\"debugToggle\">close</button>\n    </div>\n  </div>\n</template>\n\n<script>\nconst totalDaySeconds = 86400;\nconst totalWeekSeconds = 604800;\nconst daySeconds = 86400;\nconst hourSeconds = 3600;\nconst minuteSeconds = 60;\n\nconst dayAngle = 51.4285714286; // 360 deg / 7 days\n\nexport default {\n  name: \"DayClock\",\n  props: {},\n  data() {\n    return {\n      activeDay: 0,\n      weekPercentage: 0,\n      dayPercentage: 0,\n      weekNumber: 0,\n      showPercentages: false,\n      isUpdateClockActive: true,\n      isDebugActive: false\n    };\n  },\n  computed: {\n    clockArmStyle() {\n      return {\n        transform: `rotate(${360 * this.weekPercentage}deg)`\n      };\n    },\n    clockArmStyleText() {\n      return {\n        transform: `rotate(${360 * this.weekPercentage}deg)`\n      };\n    },\n    clockArmInnerStyleText() {\n      return {\n        transform: `rotate(${-360 * this.weekPercentage}deg)`\n      };\n    },\n    clockDayInfoStyle() {\n      return {\n        transform: `rotate(${-dayAngle / 2 + this.activeDay * dayAngle}deg)`\n      };\n    },\n    clockDayInfoTextStyle() {\n      return {\n        transform: `rotate(${dayAngle / 2 + this.activeDay * -dayAngle}deg)`\n      };\n    },\n    dayPercentageDisplay() {\n      return Math.round(100 * this.dayPercentage);\n    },\n    weekPercentageDisplay() {\n      return Math.round(100 * this.weekPercentage);\n    }\n  },\n  methods: {\n    updateClock(getDateMethod) {\n      let { date, d, h, m, s } = getDateMethod();\n\n      if (d === 0) d = 7; // Sunday is last\n\n      let currentDaySeconds = h * hourSeconds + m * minuteSeconds + s;\n      let currentWeekSeconds =\n        (d - 1) * daySeconds + h * hourSeconds + m * minuteSeconds + s;\n\n      this.activeDay = d;\n      this.dayPercentage = currentDaySeconds / totalDaySeconds;\n      this.weekPercentage = currentWeekSeconds / totalWeekSeconds;\n      this.weekNumber = getWeekNumber(date);\n\n      let title = `${this.weekPercentageDisplay}% Week`;\n      document.title = title;\n    },\n    debugChangeRandeSlider(event) {\n      let date = new Date();\n      let first = new Date(2020, 1, 3, 0, 0, 0).getTime();\n      let last = new Date(2020, 1, 9, 23, 59, 59).getTime();\n\n      let day = rangeMap(event.target.value, 0, 100, first, last);\n\n      let debugDate = new Date(day);\n\n      this.updateClock(() => ({\n        date, // for correct week number\n        d: debugDate.getDay(),\n        h: debugDate.getHours(),\n        m: debugDate.getMinutes(),\n        s: debugDate.getSeconds()\n      }));\n    },\n    debugToggle() {\n      this.isDebugActive = !this.isDebugActive;\n      if (this.isDebugActive) this.isUpdateClockActive = false;\n      if (!this.isDebugActive) this.isUpdateClockActive = true;\n    }\n  },\n  created() {\n    this.updateClock(getDate);\n  },\n  mounted() {\n    const second = 1000;\n    this.intervalKey = setInterval(() => {\n      this.isUpdateClockActive && this.updateClock(getDate);\n    }, 10 * second);\n  },\n  beforeDestroy() {\n    clearInterval(this.intervalKey);\n  }\n};\n\nfunction getDate() {\n  let date = new Date();\n\n  return {\n    date,\n    d: date.getDay(),\n    h: date.getHours(),\n    m: date.getMinutes(),\n    s: date.getSeconds()\n  };\n}\n\n// https://stackoverflow.com/a/6117889/815507\nfunction getWeekNumber(d) {\n  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));\n  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));\n  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));\n  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);\n  return weekNo;\n}\n\n// map value x in range [a,b] to [c,d]\nfunction rangeMap(x, a, b, c, d) {\n  if (a === b) return c;\n  if (c === d) return c;\n  return ((x - a) / (b - a)) * (d - c) + c;\n}\n</script>\n\n<style lang=\"scss\">\n$color-1: #ff821c; //hotpink;\n$color-2: #ff821c; //deeppink;\n$color-3: #ffc8ff;\n$size: 80vmin;\n$day-angle: 51.4285714286deg; // 360 deg / 7 days\n$day-skew: 38.5714285714deg; // 90 deg - $day-angle\n$border-color: black;\n$border-color: transparent;\n$clock-arm-size: 4vmin;\n$clock-arm-size-width: 4px;\n$clock-arm-size-height: 12vmin;\n\n$font-size: 8vmin;\n$font-y: 1vmin;\n$font-deg: 12deg;\n$font-air: 3vmin;\n\n// @debug 'hello from SCSS';\n\n* {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  font-size: 100%;\n}\n*,\n:before,\n:after {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: \"Roboto Mono\", monospace;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #2c3e50;\n  overflow: hidden;\n  background: radial-gradient(transparent, rgba($color-3, 0.4));\n}\n\n.container {\n  width: $size;\n  height: $size;\n  border-radius: 50%;\n  overflow: hidden;\n  box-shadow: 0 0 0 1px $border-color;\n  _background: white;\n}\n\nbutton,\n.button {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  cursor: pointer;\n  border: none;\n  box-shadow: none;\n  background: transparent;\n  outline: none;\n}\n\n.no-click-highlight {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  _cursor: pointer;\n}\n\n.clock {\n  width: 100vw;\n  height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n.clock-arm {\n  transform-origin: 50% 50%;\n  position: absolute;\n  top: calc(50% - #{$clock-arm-size / 2});\n  left: calc(50% - #{$clock-arm-size / 2});\n  width: $clock-arm-size;\n  height: $clock-arm-size;\n  background: $color-2;\n  border-radius: 50%;\n\n  &::before {\n    content: \"\";\n    pointer-events: none;\n    display: block;\n    position: absolute;\n    bottom: 0;\n    left: calc(50% - #{$clock-arm-size-width/2});\n    width: $clock-arm-size-width;\n    border-radius: $clock-arm-size-width;\n    height: $clock-arm-size-height;\n    background: $color-2;\n    z-index: -1;\n  }\n}\n.clock-arm-text {\n  $size: 12vmin;\n\n  pointer-events: none;\n  position: absolute;\n  top: calc(50% - #{$size/2});\n  left: calc(50% - #{$size/2});\n  width: $size;\n  height: $size;\n  transform-origin: 50% 50%;\n  .clock-arm-text-inner {\n    transform-origin: 50% 50%;\n    position: absolute;\n    top: 100%;\n    left: 0;\n    width: 6em;\n    height: $size;\n    @media (min-height: 500px) and (min-width: 500px) {\n      height: 3em;\n    }\n    text-align: left;\n    color: $color-2;\n    font-weight: bold;\n    display: grid;\n    place-items: center;\n    font-size: 14px;\n    @media (min-height: 500px) and (min-width: 500px) {\n      font-size: 16px;\n    }\n  }\n\n  .number {\n    margin-right: 2px;\n  }\n}\n\n.clock-day-info {\n  pointer-events: none;\n  position: absolute;\n  height: $size / 3;\n  width: 40px;\n  bottom: calc(50%);\n  left: calc(50% - 20px);\n  transform-origin: 50% 100%;\n  font-size: 14px;\n  @media (min-height: 500px) and (min-width: 500px) {\n    font-size: 16px;\n  }\n\n  .day {\n    line-height: 1;\n    text-align: center;\n    border-radius: 50%;\n    display: grid;\n    place-items: center;\n    width: 40px;\n    height: 40px;\n    color: white;\n    font-weight: bold;\n    .number {\n      margin-right: 2px;\n    }\n  }\n}\n\n.days-pie-chart-center-circle {\n  display: none;\n  $size2: $size / 3;\n  position: absolute;\n  top: calc(50% - #{$size2 / 2});\n  left: calc(50% - #{$size2 / 2});\n  width: $size2;\n  height: $size2;\n  background: white;\n  border-radius: 50%;\n  transform: rotate(45deg);\n  box-shadow: 0 0 0 1px $border-color;\n}\n\n.days-pie-chart {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: $size;\n  height: $size;\n  transform: rotate($day-skew);\n  pointer-events: none;\n\n  .day {\n    position: absolute;\n    box-shadow: 0 0 0 1px $border-color;\n    width: $size;\n    height: $size;\n    width: 100%;\n    height: 100%;\n    transform-origin: 100% 100%;\n    left: calc(50% - #{$size});\n    top: calc(50% - #{$size});\n    transition: background 500ms;\n    pointer-events: all;\n\n    > div {\n      position: absolute;\n      background: rgba($color-3, 1);\n      top: 0;\n      left: 0;\n      border-radius: 50%;\n      width: 100%;\n      height: 100%;\n    }\n\n    @for $i from 1 through 7 {\n      &--#{$i} {\n        transform: rotate($day-angle * $i) skew($day-skew);\n      }\n    }\n\n    &.active {\n      background: radial-gradient(transparent, rgba($color-1, 1), transparent);\n      > div {\n        background: transparent;\n      }\n    }\n  }\n}\n\n.days {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: $size;\n  height: $size;\n  transform: rotate(-26deg);\n\n  .day {\n    pointer-events: none;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: $size;\n    height: $size;\n    text-align: center;\n    color: gray;\n    transition: color 500ms;\n\n    @for $i from 1 through 7 {\n      &--#{$i} {\n        transform: rotate($day-angle * $i);\n      }\n    }\n\n    &.active {\n      color: white;\n    }\n\n    .text {\n      pointer-events: all;\n      padding-top: $font-air;\n      user-select: none;\n      text-transform: uppercase;\n\n      font-weight: bold;\n      outline: 1px solid $border-color;\n      line-height: 1;\n\n      i {\n        font-size: $font-size;\n        line-height: inherit;\n        font-style: normal;\n        display: inline-block;\n        min-width: 0.8em;\n        _outline: 1px solid $border-color;\n\n        &:nth-child(1) {\n          transform: rotate(-$font-deg);\n        }\n        &:nth-child(2) {\n          transform: translateY(-$font-y);\n        }\n        &:nth-child(3) {\n          transform: rotate($font-deg);\n        }\n      }\n    }\n    &--3,\n    &--4,\n    &--5 {\n      .text {\n        padding-top: 0;\n        padding-bottom: $font-air;\n        transform: rotate(0.5turn);\n\n        i {\n          &:nth-child(1) {\n            transform: rotate($font-deg);\n          }\n          &:nth-child(2) {\n            transform: translateY($font-y);\n          }\n          &:nth-child(3) {\n            transform: rotate(-$font-deg);\n          }\n        }\n      }\n    }\n  }\n}\n\n.debug {\n  position: absolute;\n  top: 4px;\n  right: 4px;\n  input[type=\"range\"] {\n    margin-left: 2px;\n    margin-right: 6px;\n  }\n  button {\n    box-shadow: 0 0 0 1px gray;\n    padding: 4px 8px;\n  }\n}\n</style>\n","* {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  font-size: 100%;\n}\n\n*,\n:before,\n:after {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: \"Roboto Mono\", monospace;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #2c3e50;\n  overflow: hidden;\n  background: radial-gradient(transparent, rgba(255, 200, 255, 0.4));\n}\n\n.container {\n  width: 80vmin;\n  height: 80vmin;\n  border-radius: 50%;\n  overflow: hidden;\n  box-shadow: 0 0 0 1px transparent;\n  _background: white;\n}\n\nbutton,\n.button {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  cursor: pointer;\n  border: none;\n  box-shadow: none;\n  background: transparent;\n  outline: none;\n}\n\n.no-click-highlight {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  _cursor: pointer;\n}\n\n.clock {\n  width: 100vw;\n  height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\n.clock-arm {\n  transform-origin: 50% 50%;\n  position: absolute;\n  top: calc(50% - 2vmin);\n  left: calc(50% - 2vmin);\n  width: 4vmin;\n  height: 4vmin;\n  background: #ff821c;\n  border-radius: 50%;\n}\n.clock-arm::before {\n  content: \"\";\n  pointer-events: none;\n  display: block;\n  position: absolute;\n  bottom: 0;\n  left: calc(50% - 2px);\n  width: 4px;\n  border-radius: 4px;\n  height: 12vmin;\n  background: #ff821c;\n  z-index: -1;\n}\n\n.clock-arm-text {\n  pointer-events: none;\n  position: absolute;\n  top: calc(50% - 6vmin);\n  left: calc(50% - 6vmin);\n  width: 12vmin;\n  height: 12vmin;\n  transform-origin: 50% 50%;\n}\n.clock-arm-text .clock-arm-text-inner {\n  transform-origin: 50% 50%;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 6em;\n  height: 12vmin;\n  text-align: left;\n  color: #ff821c;\n  font-weight: bold;\n  display: grid;\n  place-items: center;\n  font-size: 14px;\n}\n@media (min-height: 500px) and (min-width: 500px) {\n  .clock-arm-text .clock-arm-text-inner {\n    height: 3em;\n  }\n}\n@media (min-height: 500px) and (min-width: 500px) {\n  .clock-arm-text .clock-arm-text-inner {\n    font-size: 16px;\n  }\n}\n.clock-arm-text .number {\n  margin-right: 2px;\n}\n\n.clock-day-info {\n  pointer-events: none;\n  position: absolute;\n  height: 26.6666666667vmin;\n  width: 40px;\n  bottom: calc(50%);\n  left: calc(50% - 20px);\n  transform-origin: 50% 100%;\n  font-size: 14px;\n}\n@media (min-height: 500px) and (min-width: 500px) {\n  .clock-day-info {\n    font-size: 16px;\n  }\n}\n.clock-day-info .day {\n  line-height: 1;\n  text-align: center;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  color: white;\n  font-weight: bold;\n}\n.clock-day-info .day .number {\n  margin-right: 2px;\n}\n\n.days-pie-chart-center-circle {\n  display: none;\n  position: absolute;\n  top: calc(50% - 13.3333333333vmin);\n  left: calc(50% - 13.3333333333vmin);\n  width: 26.6666666667vmin;\n  height: 26.6666666667vmin;\n  background: white;\n  border-radius: 50%;\n  transform: rotate(45deg);\n  box-shadow: 0 0 0 1px transparent;\n}\n\n.days-pie-chart {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  transform: rotate(38.5714285714deg);\n  pointer-events: none;\n}\n.days-pie-chart .day {\n  position: absolute;\n  box-shadow: 0 0 0 1px transparent;\n  width: 80vmin;\n  height: 80vmin;\n  width: 100%;\n  height: 100%;\n  transform-origin: 100% 100%;\n  left: calc(50% - 80vmin);\n  top: calc(50% - 80vmin);\n  transition: background 500ms;\n  pointer-events: all;\n}\n.days-pie-chart .day > div {\n  position: absolute;\n  background: #ffc8ff;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  width: 100%;\n  height: 100%;\n}\n.days-pie-chart .day--1 {\n  transform: rotate(51.4285714286deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--2 {\n  transform: rotate(102.8571428572deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--3 {\n  transform: rotate(154.2857142858deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--4 {\n  transform: rotate(205.7142857144deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--5 {\n  transform: rotate(257.142857143deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--6 {\n  transform: rotate(308.5714285716deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day--7 {\n  transform: rotate(360.0000000002deg) skew(38.5714285714deg);\n}\n.days-pie-chart .day.active {\n  background: radial-gradient(transparent, #ff821c, transparent);\n}\n.days-pie-chart .day.active > div {\n  background: transparent;\n}\n\n.days {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  transform: rotate(-26deg);\n}\n.days .day {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 80vmin;\n  height: 80vmin;\n  text-align: center;\n  color: gray;\n  transition: color 500ms;\n}\n.days .day--1 {\n  transform: rotate(51.4285714286deg);\n}\n.days .day--2 {\n  transform: rotate(102.8571428572deg);\n}\n.days .day--3 {\n  transform: rotate(154.2857142858deg);\n}\n.days .day--4 {\n  transform: rotate(205.7142857144deg);\n}\n.days .day--5 {\n  transform: rotate(257.142857143deg);\n}\n.days .day--6 {\n  transform: rotate(308.5714285716deg);\n}\n.days .day--7 {\n  transform: rotate(360.0000000002deg);\n}\n.days .day.active {\n  color: white;\n}\n.days .day .text {\n  pointer-events: all;\n  padding-top: 3vmin;\n  user-select: none;\n  text-transform: uppercase;\n  font-weight: bold;\n  outline: 1px solid transparent;\n  line-height: 1;\n}\n.days .day .text i {\n  font-size: 8vmin;\n  line-height: inherit;\n  font-style: normal;\n  display: inline-block;\n  min-width: 0.8em;\n  _outline: 1px solid transparent;\n}\n.days .day .text i:nth-child(1) {\n  transform: rotate(-12deg);\n}\n.days .day .text i:nth-child(2) {\n  transform: translateY(-1vmin);\n}\n.days .day .text i:nth-child(3) {\n  transform: rotate(12deg);\n}\n.days .day--3 .text, .days .day--4 .text, .days .day--5 .text {\n  padding-top: 0;\n  padding-bottom: 3vmin;\n  transform: rotate(0.5turn);\n}\n.days .day--3 .text i:nth-child(1), .days .day--4 .text i:nth-child(1), .days .day--5 .text i:nth-child(1) {\n  transform: rotate(12deg);\n}\n.days .day--3 .text i:nth-child(2), .days .day--4 .text i:nth-child(2), .days .day--5 .text i:nth-child(2) {\n  transform: translateY(1vmin);\n}\n.days .day--3 .text i:nth-child(3), .days .day--4 .text i:nth-child(3), .days .day--5 .text i:nth-child(3) {\n  transform: rotate(-12deg);\n}\n\n.debug {\n  position: absolute;\n  top: 4px;\n  right: 4px;\n}\n.debug input[type=range] {\n  margin-left: 2px;\n  margin-right: 6px;\n}\n.debug button {\n  box-shadow: 0 0 0 1px gray;\n  padding: 4px 8px;\n}\n\n/*# sourceMappingURL=pen.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;