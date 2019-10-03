exports["fennch"]=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=7)}([function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}n(5);var a=function(){function e(t,n){var o=this;r(this,e),this.abortController=n||new AbortController,t instanceof Promise?this.promise=t:this.promise=new Promise((function(e,n){return t(e,n,o.abortController.signal)}))}return i(e,[{key:"then",value:function(){var t;return new e((t=this.promise).then.apply(t,arguments),this.abortController)}},{key:"catch",value:function(){var t;return new e((t=this.promise).catch.apply(t,arguments),this.abortController)}},{key:"finally",value:function(){var e;return(e=this.promise).finally.apply(e,arguments)}},{key:"abort",value:function(){return this.abortController.abort()}}]),e}();a.resolve=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new a(Promise.resolve.apply(Promise,n),e)},a.reject=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;return new a(Promise.reject(t),e)},a.race=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new a(Promise.race.apply(Promise,n),e)},a.all=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new a(Promise.all.apply(Promise,n),e)},t["a"]=a},function(e,t,n){"use strict";function r(e,t,n,r,o,i,a){try{var u=e[i](a),c=u.value}catch(l){return void n(l)}u.done?t(c):Promise.resolve(c).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,i){var a=e.apply(t,n);function u(e){r(a,o,i,u,c,"next",e)}function c(e){r(a,o,i,u,c,"throw",e)}u(void 0)}))}}function i(e){return e.includes("json")?"json":e.includes("text")?"text":"blob"}function a(e,t){return u.apply(this,arguments)}function u(){return u=o(regeneratorRuntime.mark((function e(t,n){var r,o,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r=null,o=null,!(t instanceof n)){e.next=41;break}if(204!==t.status||!t.ok){e.next=5;break}return e.abrupt("return",{body:r,error:o});case 5:a=i(t.headers.get("Content-Type")),e.t0=a,e.next="json"===e.t0?9:"text"===e.t0?19:29;break;case 9:return e.prev=9,e.next=12,t.json();case 12:r=e.sent,e.next=18;break;case 15:e.prev=15,e.t1=e["catch"](9),o=e.t1;case 18:return e.abrupt("break",39);case 19:return e.prev=19,e.next=22,t.text();case 22:r=e.sent,e.next=28;break;case 25:e.prev=25,e.t2=e["catch"](19),o=e.t2;case 28:return e.abrupt("break",39);case 29:return e.prev=29,e.next=32,t.blob();case 32:r=e.sent,e.next=38;break;case 35:e.prev=35,e.t3=e["catch"](29),o=e.t3;case 38:return e.abrupt("break",39);case 39:e.next=42;break;case 41:o=t;case 42:return e.abrupt("return",{body:r,error:o});case 43:case"end":return e.stop()}}),e,null,[[9,15],[19,25],[29,35]])}))),u.apply(this,arguments)}function c(e){return function(){var t=o(regeneratorRuntime.mark((function t(n,r){var o,i,u,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a(n,e);case 2:return o=t.sent,i=o.body,u=o.error,c=!1,"AbortError"===n.name&&(c=!0),t.abrupt("return",new Proxy(n,{get:function(e,t){switch(t){case"request":return r;case"body":return i;case"cancel":return c;case"error":return u;case"raw":return n;default:return e[t]}},set:function(e,t,n){return"body"===t&&(i=n,!0)}}));case 8:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}n.d(t,"a",(function(){return c}))},function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var r=n(3),o=n.n(r);function i(e,t){return c(e)||u(e,t)||a()}function a(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done);r=!0)if(n.push(a.value),t&&n.length===t)break}catch(c){o=!0,i=c}finally{try{r||null==u["return"]||u["return"]()}finally{if(o)throw i}}return n}}function c(e){if(Array.isArray(e))return e}function l(e){return l="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function s(e){return y(e)||p(e)||f()}function f(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function p(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function y(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}function b(e){var t=new Proxy(e,{get:function(t,n){return"raw"===n?"function"===typeof e.raw?e.raw.bind(t):e:n===Symbol.iterator?t[Symbol.iterator].bind(t):"function"===typeof t[n]?new Proxy(t[n],{apply:function(e,n,r){return e.call.apply(e,[t].concat(s(r)))}}):t.has(n)?t.get(n):t[n]},set:function(e,t,n){return e.has(t)?e.set(t,n):e.append(t,n),!0},deleteProperty:function(e,t){return e.has(t)&&e.delete(t),!0},has:function(e,t){return e.has(t)},ownKeys:function(e){return e.keys()},enumerate:function(e){return e.keys()}});return t}function v(e,t,n){return new Proxy(e,{get:function(r,i){if("function"===typeof r[i])return new Proxy(r[i],{apply:function(e,t,n){return e.call.apply(e,[r].concat(s(n)))}});switch(i){case"raw":return e.raw?e.raw:e;case"headers":return b(r[i]);case"abortController":return n;case"params":var a=r.url.split("?")[1];return a?o.a.parse(a):null;case"body":return t;default:return r[i]}},set:function(e,t,n){switch(t){case"headers":var r=!0,o=!1,a=void 0;try{for(var u,c=e.headers.keys()[Symbol.iterator]();!(r=(u=c.next()).done);r=!0){var s=u.value;e.headers.delete(s)}}catch(f){o=!0,a=f}finally{try{r||null==c.return||c.return()}finally{if(o)throw a}}return n&&"object"===l(n)&&Object.entries(n).forEach((function(t){var n=i(t,2),r=n[0],o=n[1];e.headers.append(r,o)})),!0;default:e[t]=n}}})}function d(e,t,n){return function(n){var r=null;if(n instanceof e){var i=n.abortController||new t,a=i.signal&&"object"===l(i.signal)&&Object.getPrototypeOf(i.signal);"AbortSignal"!==a.constructor.name&&Object.defineProperty(a.constructor,"name",{value:"AbortSignal",configurable:!0});var u=n.raw?n.raw.clone():n.clone(),c=new e(u,{signal:i.signal});r=v(c,n.body,i)}else{var s=n.baseUri,f=n.path,p=n.mode,y=n.method,b=n.globalHeaders,d=n.headers,h=n.params,g=n.body,m=n.arrayFormat,w=n.abortController,j="".concat(s).concat(f).concat(h?"?"+o.a.stringify(h,{arrayFormat:m}):"");if(y=y?"del"===y?"DELETE":y.toUpperCase():"GET","GET"!==y&&"HEAD"!==y){var O=[Blob,FormData].reduce((function(e,t){return g instanceof t}));g=O?g:JSON.stringify(g)}var x=w.signal&&"object"===l(w.signal)&&Object.getPrototypeOf(w.signal);"AbortSignal"!==x.constructor.name&&Object.defineProperty(x.constructor,"name",{value:"AbortSignal",configurable:!0});var P=new e(j,{method:y,body:g,mode:p,signal:w.signal});r=v(P,g,w);var S=Object.assign({},b,d);r.headers=S}return r}}},function(e,t){e.exports=require("qs")},function(e,t){function n(e){return n="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(o){"object"===("undefined"===typeof window?"undefined":n(window))&&(r=window)}e.exports=r},function(e,t,n){"use strict";(function(e){var t=n(8),r="undefined"!==typeof self?self:"undefined"!==typeof window?window:"undefined"!==typeof e?e:void 0;r&&("undefined"===typeof r.AbortController&&(r.AbortController=t.AbortController),"undefined"===typeof r.AbortSignal&&(r.AbortSignal=t.AbortSignal))}).call(this,n(4))},function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(0);function o(){var e={register:function(e){var t=this;return this.interceptors.push(e),function(){return t.unregister(e)}},unregister:function(e){var t=this.interceptors.indexOf(e);t>=0&&this.interceptors.splice(t,1)},clear:function(){this.interceptors=[]},interceptRequest:function(e){var t=r["a"].resolve(e.abortController,e);return this.interceptors.forEach((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.request,r=e.requestError;"function"===typeof n&&(t=t.then((function(e){return n(e)}))),"function"===typeof r&&(t=t.catch(r))})),t},interceptResponse:function(e,t){var n=r["a"].resolve(e,t),o=this.interceptors.slice().reverse();return o.forEach((function(e){var t=e.response,r=e.responseError;"function"===typeof t&&(n=n.then(t)),"function"===typeof r&&(n=n.catch(r))})),n},interceptors:[]};return e}},function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"default",(function(){return b})),n.d(t,"APromise",(function(){return v})),n.d(t,"makeCreateFResponse",(function(){return d})),n.d(t,"makeCreateFRequest",(function(){return h}));var r=n(6),o=n(0),i=n(1),a=n(2);function u(e,t,n,r,o,i,a){try{var u=e[i](a),c=u.value}catch(l){return void n(l)}u.done?t(c):Promise.resolve(c).then(r,o)}function c(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){u(i,r,o,a,c,"next",e)}function c(e){u(i,r,o,a,c,"throw",e)}a(void 0)}))}}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(n,!0).forEach((function(t){f(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function f(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e){return p="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}n(5);var y=["get","head","post","put","del","delete","options","patch"];function b(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{parseErr:null,headers:{},baseUri:"",mode:"cors",arrayFormat:"indices",auth:{},timeout:0},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,u={opts:t},l=n||e.fetch,f=n&&n.Request||e.Request,b=n&&n.Response||e.Response,v=(n&&n.Headers||e.Headers,Object(a["a"])(f,AbortController,AbortSignal)),d=Object(i["a"])(b);u.interceptor=Object(r["a"])();var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t&&("object"!==p(t)||Array.isArray(t)))throw new TypeError("`options` must be an object");if(t=s({},u.opts,{},t),"string"!==typeof e)throw new TypeError("`path` must be a string");var n=new AbortController,r=v({baseUri:t.baseUri,path:e,mode:t.mode,method:t.method,globalHeaders:u.opts.headers,headers:t.headers,params:t.params,body:t.body,arrayFormat:u.opts.arrayFormat,abortController:n});return r},g=function(t){var r=new o["a"](function(){var r=c(regeneratorRuntime.mark((function r(o,i){var a,c,s,f,p;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,u.interceptor.interceptRequest(t);case 3:if(t=r.sent,a=null,n===e.fetch){r.next=13;break}return c=Object.getOwnPropertySymbols(t),s=t[c[1]].parsedURL.href,r.next=10,l(s,t.raw);case 10:a=r.sent,r.next=16;break;case 13:return r.next=15,l(t.raw);case 15:a=r.sent;case 16:return r.next=18,d(a,t);case 18:return f=r.sent,r.next=21,u.interceptor.interceptResponse(t.abortController,f);case 21:f=r.sent,o(f),r.next=31;break;case 25:return r.prev=25,r.t0=r["catch"](0),r.next=29,d(r.t0,t);case 29:p=r.sent,i(p);case 31:case"end":return r.stop()}}),r,null,[[0,25]])})));return function(e,t){return r.apply(this,arguments)}}(),t.abortController),i=t.timeout||u.opts.timeout;if(i>0){var a=null,s=new Promise((function(e,t){a=setTimeout((function(){clearTimeout(a),t(new Error("Timeout exceeded"))}),i)}));return o["a"].race(t.abortController,[r,s]).then((function(e){return e}),(function(e){return e&&"Timeout exceeded"===e.message&&r.abort(),Promise.reject(e)}))}return r},m=function(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=h(t,s({},n,{method:e}));return u.req(r)}};return u.req=function(e){return g(v(e))},y.forEach((function(e){u[e]=m(e)})),u}var v=o["a"],d=i["a"],h=a["a"]}.call(this,n(4))},function(e,t,n){"use strict";function r(e){return r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}function u(e,t){return!t||"object"!==r(t)&&"function"!==typeof t?c(e):t}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e){return l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},l(e)}function s(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}function f(e,t){return f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},f(e,t)}Object.defineProperty(t,"__esModule",{value:!0});var p=n(9),y=function(e){function t(){throw o(this,t),u(this,l(t).call(this)),new TypeError("AbortSignal cannot be constructed directly")}return s(t,e),a(t,[{key:"aborted",get:function(){var e=d.get(this);if("boolean"!==typeof e)throw new TypeError("Expected 'this' to be an 'AbortSignal' object, but got ".concat(null===this?"null":r(this)));return e}}]),t}(p.EventTarget);function b(){var e=Object.create(y.prototype);return p.EventTarget.call(e),d.set(e,!1),e}function v(e){!1===d.get(e)&&(d.set(e,!0),e.dispatchEvent({type:"abort"}))}p.defineEventAttribute(y.prototype,"abort");var d=new WeakMap;Object.defineProperties(y.prototype,{aborted:{enumerable:!0}}),"function"===typeof Symbol&&"symbol"===r(Symbol.toStringTag)&&Object.defineProperty(y.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortSignal"});var h=function(){function e(){o(this,e),g.set(this,b())}return a(e,[{key:"abort",value:function(){v(m(this))}},{key:"signal",get:function(){return m(this)}}]),e}(),g=new WeakMap;function m(e){var t=g.get(e);if(null==t)throw new TypeError("Expected 'this' to be an 'AbortController' object, but got ".concat(null===e?"null":r(e)));return t}Object.defineProperties(h.prototype,{signal:{enumerable:!0},abort:{enumerable:!0}}),"function"===typeof Symbol&&"symbol"===r(Symbol.toStringTag)&&Object.defineProperty(h.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortController"}),t.AbortController=h,t.AbortSignal=y,t.default=h,e.exports=h,e.exports.AbortController=e.exports["default"]=h,e.exports.AbortSignal=y},function(e,t,n){"use strict";function r(e){return r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}Object.defineProperty(t,"__esModule",{value:!0});var o=new WeakMap,i=new WeakMap;function a(e){var t=o.get(e);return console.assert(null!=t,"'this' is expected an Event object, but got",e),t}function u(e){null==e.passiveListener?e.event.cancelable&&(e.canceled=!0,"function"===typeof e.event.preventDefault&&e.event.preventDefault()):"undefined"!==typeof console&&"function"===typeof console.error&&console.error("Unable to preventDefault inside passive event listener invocation.",e.passiveListener)}function c(e,t){o.set(this,{eventTarget:e,event:t,eventPhase:2,currentTarget:e,canceled:!1,stopped:!1,immediateStopped:!1,passiveListener:null,timeStamp:t.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:!1,enumerable:!0});for(var n=Object.keys(t),r=0;r<n.length;++r){var i=n[r];i in this||Object.defineProperty(this,i,l(i))}}function l(e){return{get:function(){return a(this).event[e]},set:function(t){a(this).event[e]=t},configurable:!0,enumerable:!0}}function s(e){return{value:function(){var t=a(this).event;return t[e].apply(t,arguments)},configurable:!0,enumerable:!0}}function f(e,t){var n=Object.keys(t);if(0===n.length)return e;function r(t,n){e.call(this,t,n)}r.prototype=Object.create(e.prototype,{constructor:{value:r,configurable:!0,writable:!0}});for(var o=0;o<n.length;++o){var i=n[o];if(!(i in e.prototype)){var a=Object.getOwnPropertyDescriptor(t,i),u="function"===typeof a.value;Object.defineProperty(r.prototype,i,u?s(i):l(i))}}return r}function p(e){if(null==e||e===Object.prototype)return c;var t=i.get(e);return null==t&&(t=f(p(Object.getPrototypeOf(e)),e),i.set(e,t)),t}function y(e,t){var n=p(Object.getPrototypeOf(t));return new n(e,t)}function b(e){return a(e).immediateStopped}function v(e,t){a(e).eventPhase=t}function d(e,t){a(e).currentTarget=t}function h(e,t){a(e).passiveListener=t}c.prototype={get type(){return a(this).event.type},get target(){return a(this).eventTarget},get currentTarget(){return a(this).currentTarget},composedPath:function(){var e=a(this).currentTarget;return null==e?[]:[e]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return a(this).eventPhase},stopPropagation:function(){var e=a(this);e.stopped=!0,"function"===typeof e.event.stopPropagation&&e.event.stopPropagation()},stopImmediatePropagation:function(){var e=a(this);e.stopped=!0,e.immediateStopped=!0,"function"===typeof e.event.stopImmediatePropagation&&e.event.stopImmediatePropagation()},get bubbles(){return Boolean(a(this).event.bubbles)},get cancelable(){return Boolean(a(this).event.cancelable)},preventDefault:function(){u(a(this))},get defaultPrevented(){return a(this).canceled},get composed(){return Boolean(a(this).event.composed)},get timeStamp(){return a(this).timeStamp},get srcElement(){return a(this).eventTarget},get cancelBubble(){return a(this).stopped},set cancelBubble(e){if(e){var t=a(this);t.stopped=!0,"boolean"===typeof t.event.cancelBubble&&(t.event.cancelBubble=!0)}},get returnValue(){return!a(this).canceled},set returnValue(e){e||u(a(this))},initEvent:function(){}},Object.defineProperty(c.prototype,"constructor",{value:c,configurable:!0,writable:!0}),"undefined"!==typeof window&&"undefined"!==typeof window.Event&&(Object.setPrototypeOf(c.prototype,window.Event.prototype),i.set(window.Event.prototype,c));var g=new WeakMap,m=1,w=2,j=3;function O(e){return null!==e&&"object"===r(e)}function x(e){var t=g.get(e);if(null==t)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return t}function P(e){return{get:function(){var t=x(this),n=t.get(e);while(null!=n){if(n.listenerType===j)return n.listener;n=n.next}return null},set:function(t){"function"===typeof t||O(t)||(t=null);var n=x(this),r=null,o=n.get(e);while(null!=o)o.listenerType===j?null!==r?r.next=o.next:null!==o.next?n.set(e,o.next):n.delete(e):r=o,o=o.next;if(null!==t){var i={listener:t,listenerType:j,passive:!1,once:!1,next:null};null===r?n.set(e,i):r.next=i}},configurable:!0,enumerable:!0}}function S(e,t){Object.defineProperty(e,"on".concat(t),P(t))}function E(e){function t(){T.call(this)}t.prototype=Object.create(T.prototype,{constructor:{value:t,configurable:!0,writable:!0}});for(var n=0;n<e.length;++n)S(t.prototype,e[n]);return t}function T(){if(!(this instanceof T)){if(1===arguments.length&&Array.isArray(arguments[0]))return E(arguments[0]);if(arguments.length>0){for(var e=new Array(arguments.length),t=0;t<arguments.length;++t)e[t]=arguments[t];return E(e)}throw new TypeError("Cannot call a class as a function")}g.set(this,new Map)}T.prototype={addEventListener:function(e,t,n){if(null!=t){if("function"!==typeof t&&!O(t))throw new TypeError("'listener' should be a function or an object.");var r=x(this),o=O(n),i=o?Boolean(n.capture):Boolean(n),a=i?m:w,u={listener:t,listenerType:a,passive:o&&Boolean(n.passive),once:o&&Boolean(n.once),next:null},c=r.get(e);if(void 0!==c){var l=null;while(null!=c){if(c.listener===t&&c.listenerType===a)return;l=c,c=c.next}l.next=u}else r.set(e,u)}},removeEventListener:function(e,t,n){if(null!=t){var r=x(this),o=O(n)?Boolean(n.capture):Boolean(n),i=o?m:w,a=null,u=r.get(e);while(null!=u){if(u.listener===t&&u.listenerType===i)return void(null!==a?a.next=u.next:null!==u.next?r.set(e,u.next):r.delete(e));a=u,u=u.next}}},dispatchEvent:function(e){if(null==e||"string"!==typeof e.type)throw new TypeError('"event.type" should be a string.');var t=x(this),n=e.type,r=t.get(n);if(null==r)return!0;var o=y(this,e),i=null;while(null!=r){if(r.once?null!==i?i.next=r.next:null!==r.next?t.set(n,r.next):t.delete(n):i=r,h(o,r.passive?r.listener:null),"function"===typeof r.listener)try{r.listener.call(this,o)}catch(a){"undefined"!==typeof console&&"function"===typeof console.error&&console.error(a)}else r.listenerType!==j&&"function"===typeof r.listener.handleEvent&&r.listener.handleEvent(o);if(b(o))break;r=r.next}return h(o,null),v(o,0),d(o,null),!o.defaultPrevented}},Object.defineProperty(T.prototype,"constructor",{value:T,configurable:!0,writable:!0}),"undefined"!==typeof window&&"undefined"!==typeof window.EventTarget&&Object.setPrototypeOf(T.prototype,window.EventTarget.prototype),t.defineEventAttribute=S,t.EventTarget=T,t.default=T,e.exports=T,e.exports.EventTarget=e.exports["default"]=T,e.exports.defineEventAttribute=S}])["default"];