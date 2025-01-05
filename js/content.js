/*

MIT License

Copyright (c) 2021-2024 cyfung1031

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
  let s = s => s;
  trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
}

const defaultPolicy = (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy) || { createHTML: s => s };
function createHTML(s) {
  return defaultPolicy.createHTML(s);
}

let trustHTMLErr = null;
try {
  document.createElement('div').innerHTML = createHTML('1');
} catch (e) {
  trustHTMLErr = e;
}

if (trustHTMLErr) {
  console.log(`trustHTMLErr`, trustHTMLErr);
  trustHTMLErr(); // exit userscript
}

if (typeof window === 'object') {
  function script3278() {
    const DISABLE_FLAGS_SHADYDOM_FREE = true;

    /**
     * 
     * Minified Code from https://greasyfork.org/en/scripts/475632-ytconfighacks/code (ytConfigHacks)
     * Date: 2024.04.17
     * Minifier: https://www.toptal.com/developers/javascript-minifier
     * 
     */
    (() => {
      let e = "undefined" != typeof unsafeWindow ? unsafeWindow : this instanceof Window ?
        this : window; if (!e._ytConfigHacks) {
          let t = 4; class n extends Set {
            add(e) {
              if (t <= 0) return console.warn(
                "yt.config_ is already applied on the page."); "function" == typeof e && super.add(e)
            }
          } let a = (async () => { })()
            .constructor, i = e._ytConfigHacks = new n, l = () => { let t = e.ytcsi.originalYtcsi; t && (e.ytcsi = t, l = null) },
            c = null, o = () => {
              if (t >= 1) {
                let n = (e.yt || 0).config_ || (e.ytcfg || 0).data_ || 0; if ("string" == typeof n.
                  INNERTUBE_API_KEY && "object" == typeof n.EXPERIMENT_FLAGS) for (let a of (--t <= 0 && l && l(), c = !0, i)) a(n)
              }
            }, f = 1,
            d = t => {
              if (t = t || e.ytcsi) return e.ytcsi = new Proxy(t, { get: (e, t, n) => "originalYtcsi" === t ? e : (o(), c && --f <= 0 && l && l(), e[t]) })
                , !0
            }; d() || Object.defineProperty(e, "ytcsi", {
              get() { }, set: t => (t && (delete e.ytcsi, d(t)), !0), enumerable: !1, configurable: !0
            }); let { addEventListener: s, removeEventListener: y } = Document.prototype; function r(t) {
              o(),
                t && e.removeEventListener("DOMContentLoaded", r, !1)
            } new a(e => {
              if ("undefined" != typeof AbortSignal) s.call(document,
                "yt-page-data-fetched", e, { once: !0 }), s.call(document, "yt-navigate-finish", e, { once: !0 }), s.call(document, "spfdone", e,
                  { once: !0 }); else {
                let t = () => {
                  e(), y.call(document, "yt-page-data-fetched", t, !1), y.call(document, "yt-navigate-finish", t, !1),
                    y.call(document, "spfdone", t, !1)
                }; s.call(document, "yt-page-data-fetched", t, !1), s.call(document, "yt-navigate-finish", t, !1),
                  s.call(document, "spfdone", t, !1)
              }
            }).then(o), new a(e => {
              if ("undefined" != typeof AbortSignal) s.call(document, "yt-action", e,
                { once: !0, capture: !0 }); else { let t = () => { e(), y.call(document, "yt-action", t, !0) }; s.call(document, "yt-action", t, !0) }
            }).then(o),
              a.resolve().then(() => { "loading" !== document.readyState ? r() : e.addEventListener("DOMContentLoaded", r, !1) })
        }
    })();

    let configOnce = false;
    window._ytConfigHacks.add((config_) => {
      if (configOnce) return;
      configOnce = true;

      const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS || 0;
      const EXPERIMENTS_FORCED_FLAGS = config_.EXPERIMENTS_FORCED_FLAGS || 0;
      for (const flags of [EXPERIMENT_FLAGS, EXPERIMENTS_FORCED_FLAGS]) {
        if (flags) {
          flags.kevlar_watch_metadata_refresh_no_old_secondary_data = false;
          flags.live_chat_overflow_hide_chat = false;
          flags.web_watch_chat_hide_button_killswitch = false;
          flags.web_watch_theater_chat = false; // for re-openable chat (ytd-watch-flexy's liveChatCollapsed is always undefined)
          flags.suppress_error_204_logging = true;
          flags.kevlar_watch_grid = false;  // A/B testing for watch grid

          if (DISABLE_FLAGS_SHADYDOM_FREE) {
            flags.enable_shadydom_free_scoped_node_methods = false;
            flags.enable_shadydom_free_scoped_query_methods = false;
            flags.enable_shadydom_free_scoped_readonly_properties_batch_one = false;
            flags.enable_shadydom_free_parent_node = false;
            flags.enable_shadydom_free_children = false;
            flags.enable_shadydom_free_last_child = false;
          }
        }
      }

    });


    // ---- << this.overscrollConfig HACK >>  -----

    // 2024.04.19 - Playlist in Single Column Mode cannot be scrolled correctly.

    /*

      ;function gZb(a, b) {
          b = void 0 === b ? !0 : b;
          a.addEventListener("wheel", hZb);
          a.overscrollConfig = {
              cooldown: b
          }
      }
      function iZb(a) {
          a.overscrollConfig = void 0;
          a.removeEventListener("wheel", hZb)
      }
      function hZb(a) {
          var b = a.deltaY
            , c = a.target
            , d = null;
          if (window.Polymer && window.Polymer.Element) {
              if (c = a.path || a.composedPath && a.composedPath()) {
                  c = g(c);
                  for (var e = c.next(); !e.done && (e = e.value,
                  !jZb(e, b)); e = c.next())
                      if (e.overscrollConfig) {
                          d = e;
                          break
                      }
              }
          } else
              for (; c && !jZb(c, b); ) {
                  if (c.overscrollConfig) {
                      d = c;
                      break
                  }
                  c = c.parentElement
              }
          d && (b = d.overscrollConfig,
          b.cooldown ? (d = a.deltaY,
          c = b.lastDeltaY || 0,
          b.lastDeltaY = d,
          e = b.lastStopped || 0,
          c && e && 0 < c == 0 < d ? Math.abs(c) >= Math.abs(d) ? (d = e + 1200,
          c = !1) : (d = e + 600,
          c = !0) : (d = Date.now() + 600,
          c = !0),
          d > Date.now() && (a.preventDefault(),
          c && (b.lastStopped = Date.now()))) : a.preventDefault())
      }
    */

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
    // const indr = o => insp(o).$ || o.$ || 0;

    // let [YouTube JS Engine Tamer] to hack the addEventListener first
    new Promise(resolve => {
      document.addEventListener('yt-action', resolve, { once: true, capture: true });
    }).then(() => {

      if (typeof EventTarget.prototype.addEventListener52178 !== 'function' && typeof EventTarget.prototype.addEventListener === 'function') {

        EventTarget.prototype.addEventListener52178 = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function (type, callback, option = void 0) {
          // M-tabview-youtube.52178
          if (type === 'wheel' && !option && typeof callback === 'function' && this.overscrollConfigDisable === void 0) {
            try {
              this.overscrollConfigDisable = true;
              delete this.overscrollConfig;
              Object.defineProperty(this, 'overscrollConfig', { get() { return undefined }, set(nv) { return true }, configurable: true, enumerable: false });
              const cnt = insp(this);
              if (cnt !== this) {
                delete cnt.overscrollConfig;
                Object.defineProperty(cnt, 'overscrollConfig', { get() { return undefined }, set(nv) { return true }, configurable: true, enumerable: false });
              }
            } catch (e) { }
          }
          return this.addEventListener52178(type, callback, option);
        }

        // Object.defineProperty( HTMLElement.prototype, 'overscrollConfig' , {get(){return undefined}, set(nv){return true}, configurable: true, enumerable: false})

      }

    });


    // ---- << this.overscrollConfig HACK >>  -----


  }
  let mbutton = document.createElement('button');
  mbutton.setAttribute('onclick', `(${script3278})()`);
  mbutton.click();

}

-(function (__CONTEXT__) {
  'use strict';

  let __Promise__;
  try {
    __Promise__ = (async () => { })().constructor; // due to YouTube's Promise Hack
  } catch (e) {
    throw 'Please update your browser to use Tabview Youtube.';
  }

  const fxOperator = (proto, propertyName) => {
    let propertyDescriptorGetter = null;
    try {
      propertyDescriptorGetter = Object.getOwnPropertyDescriptor(proto, propertyName).get;
    } catch (e) { }
    return typeof propertyDescriptorGetter === 'function' ? (e) => propertyDescriptorGetter.call(e) : (e) => e[propertyName];
  };

  const fxAPI = (proto, propertyName) => {
    const methodFunc = proto[propertyName];
    return typeof methodFunc === 'function' ? (e, ...args) => methodFunc.apply(e, args) : (e, ...args) => e[propertyName](...args);
  };

  const nodeParent = fxOperator(Node.prototype, 'parentNode');
  const nodeFirstChild = fxOperator(Node.prototype, 'firstChild');
  const nodeNextSibling = fxOperator(Node.prototype, 'nextSibling');
  const nodePrevSibling = fxOperator(Node.prototype, 'previousSibling');

  // const elementQS = fxAPI(Element.prototype, 'querySelector');
  // const elementQSA = fxAPI(Element.prototype, 'querySelectorAll');
  const elementNextSibling = fxOperator(Element.prototype, 'nextElementSibling');
  // const elementPrevSibling = fxOperator(Element.prototype, 'previousElementSibling');

  const docFragmentCreate = Document.prototype.createDocumentFragment;
  const docFragmentAppend = DocumentFragment.prototype.append;
  // const docFragmentPrepend = DocumentFragment.prototype.prepend;

  /** @type {PromiseConstructor} */
  const Promise = __Promise__; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const { requestAnimationFrame, cancelAnimationFrame } = __CONTEXT__;

  let _rafPromise = null;

  const getRAFPromise = () => _rafPromise || (_rafPromise = new Promise(resolve => {
    requestAnimationFrame(hRes => {
      _rafPromise = null;
      resolve(hRes);
    });
  }));

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  if (inIframe()) return;

  if (document.documentElement && document.documentElement.hasAttribute('plugin-tabview-youtube')) {
    console.warn('Multiple instances of Tabview Youtube is attached. [0x7F01]')
    return;
  }

  const createPipeline = () => {
    let pipelineMutex = Promise.resolve();
    const pipelineExecution = fn => {
      return new Promise((resolve, reject) => {
        pipelineMutex = pipelineMutex.then(async () => {
          let res;
          try {
            res = await fn();
          } catch (e) {
            console.log('error_F1', e);
            reject(e);
          }
          resolve(res);
        }).catch(console.warn);
      });
    };
    return pipelineExecution;
  };
  const iframePipeline = createPipeline();

  
  /*
  const observablePromise = (proc, timeoutPromise) => {
    let promise = null;
    return {
      obtain() {
        if (!promise) {
          promise = new Promise(resolve => {
            let mo = null;
            const f = () => {
              let t = proc();
              if (t) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve(t);
              }
            }
            mo = new MutationObserver(f);
            mo.observe(document, { subtree: true, childList: true })
            f();
            timeoutPromise && timeoutPromise.then(() => {
              resolve(null)
            });
          });
        }
        return promise
      }
    }
  }
  */


  //if (!$) return;

  /**
   * SVG resources:
   * <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
   */

  const scriptVersionForExternal = '2022/12/04';

  const isMyScriptInChromeRuntime = () => typeof GM === 'undefined' && typeof ((((window || 0).chrome || 0).runtime || 0).getURL) === 'function';
  const isGMAvailable = () => typeof GM !== 'undefined' && !isMyScriptInChromeRuntime();

  // https://yqnn.github.io/svg-path-editor/
  // https://vecta.io/nano

  const svgComments = `<path d="M80 27H12A12 12 90 0 0 0 39v42a12 12 90 0 0 12 12h12v20a2 2 90 0 0 3.4 2L47 93h33a12 
  12 90 0 0 12-12V39a12 12 90 0 0-12-12zM20 47h26a2 2 90 1 1 0 4H20a2 2 90 1 1 0-4zm52 28H20a2 2 90 1 1 0-4h52a2 2 90 
  1 1 0 4zm0-12H20a2 2 90 1 1 0-4h52a2 2 90 1 1 0 4zm36-58H40a12 12 90 0 0-12 12v6h52c9 0 16 7 16 16v42h0v4l7 7a2 2 90 
  0 0 3-1V71h2a12 12 90 0 0 12-12V17a12 12 90 0 0-12-12z"/>`.trim();

  const svgVideos = `<path d="M89 10c0-4-3-7-7-7H7c-4 0-7 3-7 7v70c0 4 3 7 7 7h75c4 0 7-3 7-7V10zm-62 2h13v10H27V12zm-9 
  66H9V68h9v10zm0-56H9V12h9v10zm22 56H27V68h13v10zm-3-25V36c0-2 2-3 4-2l12 8c2 1 2 4 0 5l-12 8c-2 1-4 0-4-2zm25 
  25H49V68h13v10zm0-56H49V12h13v10zm18 56h-9V68h9v10zm0-56h-9V12h9v10z"/>`.trim();

  const svgInfo = `<path d="M30 0C13.3 0 0 13.3 0 30s13.3 30 30 30 30-13.3 30-30S46.7 0 30 0zm6.2 46.6c-1.5.5-2.6 
  1-3.6 1.3a10.9 10.9 0 0 1-3.3.5c-1.7 0-3.3-.5-4.3-1.4a4.68 4.68 0 0 1-1.6-3.6c0-.4.2-1 .2-1.5a20.9 20.9 90 0 1 
  .3-2l2-6.8c.1-.7.3-1.3.4-1.9a8.2 8.2 90 0 0 .3-1.6c0-.8-.3-1.4-.7-1.8s-1-.5-2-.5a4.53 4.53 0 0 0-1.6.3c-.5.2-1 
  .2-1.3.4l.6-2.1c1.2-.5 2.4-1 3.5-1.3s2.3-.6 3.3-.6c1.9 0 3.3.6 4.3 1.3s1.5 2.1 1.5 3.5c0 .3 0 .9-.1 1.6a10.4 10.4 
  90 0 1-.4 2.2l-1.9 6.7c-.2.5-.2 1.1-.4 1.8s-.2 1.3-.2 1.6c0 .9.2 1.6.6 1.9s1.1.5 2.1.5a6.1 6.1 90 0 0 1.5-.3 9 9 90 
  0 0 1.4-.4l-.6 2.2zm-3.8-35.2a1 1 0 010 8.6 1 1 0 010-8.6z"/>`.trim();

  const svgPlayList = `<path d="M0 3h12v2H0zm0 4h12v2H0zm0 4h8v2H0zm16 0V7h-2v4h-4v2h4v4h2v-4h4v-2z"/>`.trim();

  const svgDiag1 = `<svg stroke="currentColor" fill="none"><path d="M8 2h2v2M7 5l3-3m-6 8H2V8m0 2l3-3"/></svg>`;
  const svgDiag2 = `<svg stroke="currentColor" fill="none"><path d="M7 3v2h2M7 5l3-3M5 9V7H3m-1 3l3-3"/></svg>`;

  const REMOVE_DUPLICATE_INFO = true;
  const REMOVE_DUPLICATE_META_RECOMMENDATION = true; /* https://www.youtube.com/watch?v=kGihxscQCPE */
  const MINIVIEW_BROWSER_ENABLE = true;
  const DEBUG_LOG = false;


  /*

  youtube page

    = Init::browse
      yt-page-data-fetched
      data-changed...
      yt-page-data-updated
      yt-navigate-finish
      data-changed...
      yt-watch-comments-ready
    
    = browse -> watch
      yt-player-updated
      yt-navigate
      yt-navigate-start
      yt-page-type-changed
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish
      data-changed...
      yt-page-data-updated
      data-changed...
      yt-watch-comments-ready
      data-changed...

    = watch -> watch
    = click video on meta panel // https://www.youtube.com/watch?v=UY5bp5CNhak; https://www.youtube.com/watch?v=m0WtnU8NVTo
      yt-navigate
      yt-navigate-start
      data-changed
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish
      data-changed...
      yt-page-data-updated
      data-changed...
      yt-watch-comments-ready
      data-changed...

    = watch -> browse (miniview)
      yt-navigate-cache
      yt-page-data-fetched
      yt-page-type-changed
      yt-page-data-updated
      yt-navigate-finish

    = browse (miniview)  -> watch (Restore)
      yt-navigate-cache
      yt-page-data-fetched
      yt-navigate-finish
      yt-page-type-changed
      yt-page-data-updated
      data-changed...
      yt-watch-comments-ready

    = watch -> search (miniview)
      yt-navigate
      yt-navigate-start
      data-changed
      yt-page-data-fetched
      yt-page-type-changed
      data-changed
      yt-page-data-updated
      yt-navigate-finish
      data-changed...

    = Init::search
      yt-page-data-fetched
      data-changed
      yt-page-data-updated
      yt-navigate-finish
      data-changed...
      yt-watch-comments-ready

    = Init::watch
      yt-page-data-fetched
      yt-navigate-finish
      data-changed...
      yt-page-data-updated
      data-changed...
      yt-watch-comments-ready
      yt-player-updated
      data-changed...

    = watch -> watch (history back)
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish
      data-changed...
      yt-page-data-updated
      data-changed...
      yt-watch-comments-ready

    = watch -> click video time // https://www.youtube.com/watch?v=UY5bp5CNhak; https://www.youtube.com/watch?v=m0WtnU8NVTo
      yt-navigate

  */


  function generateRandomID() {
    return Math.floor(Math.random() * 982451653 + 982451653).toString(36);
  }
  function generateRandomTimedID() {
    return `${generateRandomID()}-${Date.now().toString(36)}`;
  }


  const instanceId = generateRandomTimedID();

  const LAYOUT_VAILD = 1;

  const LAYOUT_TWO_COLUMNS = 2;
  const LAYOUT_THEATER = 4;
  const LAYOUT_FULLSCREEN = 8;
  const LAYOUT_CHATROOM = 16;
  const LAYOUT_CHATROOM_COLLAPSED = 32;
  const LAYOUT_TAB_EXPANDED = 64;
  const LAYOUT_ENGAGEMENT_PANEL_EXPANDED = 128;
  const LAYOUT_CHATROOM_EXPANDED = 256;
  const LAYOUT_DONATION_SHELF_EXPANDED = 512;


  const nonCryptoRandStr_base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const showMessages_IframeLoaded = false; // typeof GM === 'undefined';

  const nullFunc = function () { };


  let scriptEnable = false;

  let comments_loader = 0; // for comment count (might omit)

  let cmTime = 0;
  const mTime = Date.now() - 152000000;

  //let lastScrollFetch = 0;
  //let lastOffsetTop = 0;
  let mtf_forceCheckLiveVideo_disable = 0;

  let tabsUiScript_setclick = false;
  let pageFetchedDataVideoId = null; // integer; for comment checking
  let pageType = null; // pageType = 'watch', 'browse', 'playlist', ...
  let chatroomDetails = null;
  let switchTabActivity_lastTab = null;

  let lstTab = null;

  let storeLastPanel = null; // WeakRef


  let mtf_chatBlockQ = null; // for chat layout status change

  let enableHoverSliderDetection = false; // for hover slider


  let firstLoadStatus = 2 | 8; // for page init


  let m_last_count = ''; // for comment count



  let sVideosITO = null;

  /** @type {WeakRef | null} */
  let ytdFlexy = null; // WeakRef

  const Q = {}
  const SETTING_DEFAULT_TAB_0 = "#tab-videos"
  const settings = {
    defaultTab: SETTING_DEFAULT_TAB_0
  };

  const STORE_VERSION = 1;
  const STORE_key = 'userscript-tabview-settings';
  const key_default_tab = 'my-default-tab';

  let hiddenTabsByUserCSS = 0;
  let defaultTabByUserCSS = 0;
  let setupDefaultTabBtnSetting = null;
  let isCommentsTabBtnHidden = false;

  let fetchCounts = {
    base: null,
    new: null,
    fetched: false,
    count: null,
  };

  let pageLang = 'en';
  const langWords = {
    'en': {
      //'share':'Share',
      'info': 'Info',
      'videos': 'Videos',
      'playlist': 'Playlist'
    },
    'jp': {
      //'share':'共有',
      'info': '情報',
      'videos': '動画',
      'playlist': '再生リスト'
    },
    'tw': {
      //'share':'分享',
      'info': '資訊',
      'videos': '影片',
      'playlist': '播放清單'
    },
    'cn': {
      //'share':'分享',
      'info': '资讯',
      'videos': '视频',
      'playlist': '播放列表'
    },
    'du': {
      //'share':'Teilen',
      'info': 'Info',
      'videos': 'Videos',
      'playlist': 'Playlist'
    },
    'fr': {
      //'share':'Partager',
      'info': 'Info',
      'videos': 'Vidéos',
      'playlist': 'Playlist'
    },
    'kr': {
      //'share':'공유',
      'info': '정보',
      'videos': '동영상',
      'playlist': '재생목록'
    },
    'ru': {
      //'share':'Поделиться',
      'info': 'Описание',
      'videos': 'Видео',
      'playlist': 'Плейлист'
    }
  };

  const getGMT = () => {
    let m = new Date('2023-01-01T00:00:00Z');
    return m.getDate() === 1 ? `+${m.getHours()}` : `-${24 - m.getHours()}`;
  };

  function durationInfoTS(durationInfo) {
    /**
     * @type {{ hrs: number, mins: number, seconds: number }}
     */
    let _durationInfo = durationInfo
    return _durationInfo
  }

  function formatDateReqTS(req) {
    /**
     * @type {{ bd1: KDate | undefined, bd2: KDate | undefined, isSameDay: number | undefined, durationInfo: object | undefined, formatDates: object | undefined }}
     */
    let _req = req
    return _req
  }

  function liveDurationLocaleEN(durationInfo) {

    const { hrs, mins, seconds } = durationInfoTS(durationInfo)
    let ret = []
    ret.push(`Length:`)
    if (hrs > 0) ret.push(`${hrs} ${hrs === 1 ? 'hour' : 'hours'}`)
    if (mins > 0) ret.push(`${mins} ${mins === 1 ? 'minute' : 'minutes'}`)
    if (seconds !== null) ret.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)
    return ret.join(' ')
  }

  /* liveDurationLocaleEN by ChatGPT @ 2023.05.11 */
  function liveDurationLocaleJP(durationInfo) {

    const { hrs, mins, seconds } = durationInfoTS(durationInfo);
    let ret = [];
    ret.push(`長さ：`);
    if (hrs > 0) ret.push(`${hrs}時間`);
    if (mins > 0) ret.push(`${mins}分`);
    if (seconds !== null) ret.push(`${seconds}秒`);
    return ret.join('');

  }

  function formatDateResultEN(type, req) {

    const { bd1, bd2, durationInfo, formatDates } = formatDateReqTS(req)

    switch (type) {
      case 0x200:
        return [
          `The livestream was in ${bd1.lokStringDateEN()} from ${bd1.lokStringTime()} to ${bd2.lokStringTime()}. [GMT${getGMT()}]`,
          liveDurationLocaleEN(durationInfo)
        ].join('\n');
      case 0x210:
        return [
          `The livestream was from ${bd1.lokStringDateEN()} ${bd1.lokStringTime()} to ${bd2.lokStringDateEN()} ${bd2.lokStringTime()}. [GMT${getGMT()}]`,
          liveDurationLocaleEN(durationInfo)
        ].join('\n');
      case 0x300:
        return `The livestream started at ${bd1.lokStringTime()} [GMT${getGMT()}] in ${bd1.lokStringDateEN()}.`;
      case 0x600:
        return `The video was uploaded in ${formatDates.uploadDate} and published in ${formatDates.publishDate}.`;
      case 0x610:
        return `The video was uploaded in ${formatDates.uploadDate}.`;
      case 0x700:
        return `The video was published in ${formatDates.publishDate}.`;
    }
    return '';

  }

  /* formatDateResultJP by ChatGPT @ 2023.05.11 */

  function formatDateResultJP(type, req) {

    const { bd1, bd2, durationInfo, formatDates } = formatDateReqTS(req);

    switch (type) {
      case 0x200:
        return [
          `ライブ配信は${bd1.lokStringDateJP()}の${bd1.lokStringTime()}から開始し、${bd2.lokStringTime()}まで続きました。[GMT${getGMT()}]`,
          liveDurationLocaleJP(durationInfo)
        ].join('\n');
      case 0x210:
        return [
          `ライブ配信は${bd1.lokStringDateJP()}の${bd1.lokStringTime()}から${bd2.lokStringDateJP()}の${bd2.lokStringTime()}まで行われました。[GMT${getGMT()}]`,
          liveDurationLocaleJP(durationInfo)
        ].join('\n');
      case 0x300:
        return `ライブ配信は${bd1.lokStringDateJP()}の${bd1.lokStringTime()}から開始しました。[GMT${getGMT()}]`;
      case 0x600:
        return `この動画は${formatDates.uploadDate}にアップロードされ、${formatDates.publishDate}に公開されました。`;
      case 0x610:
        return `この動画は${formatDates.uploadDate}にアップロードされました。`;
      case 0x700:
        return `この動画は${formatDates.publishDate}に公開されました。`;
    }
    return '';

  }

  function getFormatDateResultFunc() {
    switch (getLang()) {
      case 'jp':
        return formatDateResultJP;
      case 'en':
      default:
        return formatDateResultEN;
    }
  }


  // const S_GENERAL_RENDERERS = ['YTD-TOGGLE-BUTTON-RENDERER', 'YTD-MENU-RENDERER']

  let globalHook_symbols = [];
  let globalHook_hashs = {};


  let singleColumnScrolling_dt = 0;

  let isStickyHeaderEnabled = false;
  let isMiniviewForStickyHeadEnabled = false;

  let theater_mode_changed_dt = 0;
  let detailsTriggerReset = false;


  let isMakeHeaderFloatCalled = false;

  let _viTimeNum = 203;
  let _updateTimeAccum = 0;

  /** @type {WeakMap<HTMLElement>} */
  let loadedCommentsDT = new WeakMap();



  // for weakref variable management
  const es = {
    get ytdFlexy() {
      /** @type { HTMLElement | null } */
      let res = kRef(ytdFlexy);
      return res;
    },
    get storeLastPanel() {
      /** @type { HTMLElement | null } */
      let res = kRef(storeLastPanel);
      return res;
    }
  }


  const _console = new Proxy(console, {
    get(target, prop, receiver) {
      if (!DEBUG_LOG && prop === 'log') {
        return nullFunc
      }
      return Reflect.get(...arguments)
    }
  });

  let generalLog901 = !DEBUG_LOG ? 0 : (evt) => {
    _console.log(901, evt.type)
  }
  const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
  // https://caniuse.com/?search=observer
  // https://caniuse.com/?search=addEventListener%20passive

  const bubblePassive = isPassiveArgSupport ? { capture: false, passive: true } : false;
  const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;


  /** @type { (str: string) => (HTMLElement | null) } */
  const _querySelector = HTMLElement.prototype.__shady_native_querySelector || HTMLElement.prototype.querySelector; // nodeType==1 // since 2022/07/12

  /** @type { (str: string) => (NodeList) } */
  const _querySelectorAll = HTMLElement.prototype.__shady_native_querySelectorAll || HTMLElement.prototype.querySelectorAll; // nodeType==1 // since 2022/07/12
  const closestDOM = HTMLElement.prototype.closest;
  //const elementRemove = HTMLElement.prototype.remove;
  //const elementContains = HTMLElement.prototype.contains; // since 2022/07/12

  const querySelectorFromAnchorX = function (parent, childSelector) {
    if (!(parent instanceof HTMLElement)) return null;
    return _querySelector.call(parent, childSelector) || null;
  }
  const closestDOMX = function (child, parentSelector) {
    if (!(child instanceof HTMLElement)) return null;
    return closestDOM.call(child, parentSelector) || null;
  }


  const { elementAppend, _setAttribute, _insertBefore } = (() => {
    let elementAppend = HTMLElement.prototype.appendChild;
    try {
      elementAppend = ShadyDOM.nativeMethods.appendChild || elementAppend;
    } catch (e) { }
    let _setAttribute = Element.prototype.setAttribute;
    try {
      _setAttribute = ShadyDOM.nativeMethods.setAttribute || _setAttribute;
    } catch (e) { }
    let _insertBefore = Node.prototype.insertBefore;
    try {
      _insertBefore = ShadyDOM.nativeMethods.insertBefore || _insertBefore;
    } catch (e) { }
    return { elementAppend, _setAttribute, _insertBefore };
  })();


  const getDMHelper = () => {
    let _dm = document.getElementById('d-m');
    if (!_dm) {
      _dm = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      _dm.id = 'd-m';
      _insertBefore.call(document.documentElement, _dm, document.documentElement.firstChild);
    }
    const dm = _dm;
    dm._setAttribute = _setAttribute;
    let j = 0;
    let attributeName_;
    while (dm.hasAttribute(attributeName_ = `dm-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`)) {
      // none
    }
    const attributeName = attributeName_;
    let qr = null;
    const mo = new MutationObserver(() => {
      if (qr !== null) {
        if (j > 8) j = 0;
        qr = (qr(), null);
      }
    });
    mo.observe(document, { childList: true, subtree: true, attributes: true });
    return (resolve) => {
      if (!qr) dm._setAttribute(attributeName, ++j);
      return qr = resolve;
      // return qr = afInterupter = resolve;
    };
  };
  const dmPN = getDMHelper();

  let _dmPromise = null;
  const getDMPromise = () => {
    return (_dmPromise || (_dmPromise = (new Promise(dmPN)).then(() => {
      _dmPromise = null;
    })))
  };

  /**
   * 
   * @param {number} f bit flag
   * @param {number} w bit flag (with)
   * @param {number} wo bit flag (without)
   * @returns 
   */
  const fT = function (f, w, wo) {
    return (f & (w | wo)) === w
  }

  /* globals WeakRef:false */

  /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);


  // function prettyElm(/** @type {Element} */ elm) {
  //   if (!elm || !elm.nodeName) return null;
  //   const eId = elm.id || null;
  //   const eClsName = elm.className || null;
  //   return [elm.nodeName.toLowerCase(), typeof eId == 'string' ? "#" + eId : '', typeof eClsName == 'string' ? '.' + eClsName.replace(/\s+/g, '.') : ''].join('').trim();
  // }

  // function extractTextContent(/** @type {Node} */ elm) {
  //   return elm.textContent.replace(/\s+/g, '').replace(/[^\da-zA-Z\u4E00-\u9FFF\u00C0-\u00FF\u00C0-\u02AF\u1E00-\u1EFF\u0590-\u05FF\u0400-\u052F\u0E00-\u0E7F\u0600-\u06FF\u0750-\u077F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3040-\u30FF\u31F0-\u31FF]/g, '')
  // }

  function addScript(/** @type {string} */ scriptText) {
    const scriptNode = document.createElement('script');
    scriptNode.type = 'text/javascript';
    scriptNode.textContent = scriptText;
    try {
      document.documentElement.appendChild(scriptNode);
    } catch (e) {
      console.log('addScript Error', e)
    }
    return scriptNode;
  }

  function addScriptByURL(/** @type {string} */ scriptURL) {
    const scriptNode = document.createElement('script');
    scriptNode.type = 'text/javascript';
    scriptNode.src = scriptURL;
    try {
      document.documentElement.appendChild(scriptNode);
    } catch (e) {
      console.log('addScriptByURL Error', e)
    }
    return scriptNode;
  }

  // function addStyle(/** @type {string} */ styleText, /** @type {HTMLElement | Document} */ container) {
  //   const styleNode = document.createElement('style');
  //   //styleNode.type = 'text/css';
  //   styleNode.textContent = styleText;
  //   (container || document.documentElement).appendChild(styleNode);
  //   return styleNode;
  // }



  /*

  yt-action yt-add-element-to-app yt-autonav-pause-blur yt-autonav-pause-focus
yt-autonav-pause-guide-closed yt-autonav-pause-guide-opened yt-autonav-pause-player
yt-autonav-pause-player-ended yt-autonav-pause-scroll yt-autoplay-on-changed
yt-close-tou-form yt-consent-bump-display-changed yt-focus-searchbox
yt-get-context-provider yt-guide-close yt-guide-hover yt-guide-toggle
yt-history-load yt-history-pop yt-load-invalidation-continuation
yt-load-next-continuation yt-load-reload-continuation yt-load-tou-form
yt-masthead-height-changed yt-navigate yt-navigate-cache yt-navigate-error
yt-navigate-finish yt-navigate-redirect yt-navigate-set-page-offset
yt-navigate-start yt-next-continuation-data-updated yt-open-hotkey-dialog
yt-open-tou-form-loading-state yt-page-data-fetched yt-page-data-updated
yt-page-data-will-update yt-page-manager-navigate-start yt-page-navigate-start
yt-page-type-changed yt-player-attached yt-player-detached yt-player-released
yt-player-requested yt-player-updated yt-popup-canceled yt-popup-closed
yt-popup-opened yt-preconnect-urls yt-register-action yt-report-form-closed
yt-report-form-opened yt-request-panel-mode-change yt-retrieve-location
yt-service-request-completed yt-service-request-error yt-service-request-sent
yt-set-theater-mode-enabled yt-show-survey yt-subscription-changed
yt-swatch-changed yt-theater-mode-allowed yt-unregister-action yt-update-title
yt-update-unseen-notification-count yt-viewport-scanned yt-visibility-refresh

*/


  // _console.log(38489)

  class ControllerIDInner {
    constructor() {
      this.q = 0;
    }
    set(v) {
      this.q = v
    }
    valueOf() {
      return this.q;
    }
    inc() {
      if (++this.q > 1e9) this.q = 9;
      return this.q;
    }
  }

  const ControllerID = () => {
    return new ControllerIDInner();
  }


  const psId = ControllerID();
  psId.auto = false;

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  const tabsInsertedPromise = new PromiseExternal();

  let chatController = {
    allowChatControl: true
  };

  class Deferred {
    constructor() {
      this.reset();
    }
    debounce(f, controllerId) {
      let g = f;
      if (controllerId) {
        const tid = controllerId.auto === false ? controllerId.valueOf() : controllerId.inc();
        g = () => (tid === controllerId.valueOf() ? f() : 0);
      }
      return this.promise.then().then(g).catch(console.warn); // avoid promise.then.then.then ...
    }
    d() {
      return this.promise.then().catch(console.warn);
    }
    reset() {
      this.resolved = false;
      this.promise = new PromiseExternal();
    }
    resolve() {
      if (this.resolved !== false) return false;
      this.resolved = true;
      this.promise.resolve(...arguments);
      return true;
    }
  }

  class Mutex {

    constructor() {
      this.p = Promise.resolve()
    }

    lockWith(f) {

      this.p = this.p.then(() => {
        return new Promise(f).catch(console.warn)
      })
    }

  }

  const rfKey = Symbol();

  const ffReflection = (o, c) => {
    // see https://github.com/erosman/support/issues/526
    if (o.constructor !== c) {
      const a = c[rfKey] || (c[rfKey] = Object.keys(Object.getOwnPropertyDescriptors(c.prototype)));
      for (const k of a) {
        o[k] = c.prototype[k];
      }
    }
  }

  /* FireMonkey unable to extend MutationObserver correctly */
  class AttributeMutationObserver extends MutationObserver {
    constructor(flist) {
      super((mutations, observer) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes') {
            this.checker(mutation.target, mutation.attributeName)
          }
        }
      })
      this.flist = flist;
      this.res = {}
      ffReflection(this, AttributeMutationObserver);
    }

    takeRecords() {
      super.takeRecords();
    }
    disconnect() {
      this._target = null;
      super.disconnect();
    }
    observe(/** @type {Node} */ target) {
      if (this._target) return;
      //console.log(123124, target)
      this._target = mWeakRef(target);

      //console.log(123125, kRef(this._target))
      const options = {
        attributes: true,
        attributeFilter: Object.keys(this.flist),
        //attributeFilter: [ "status", "username" ],
        attributeOldValue: true
      }
      super.observe(target, options)
    }
    checker(/** @type {Node} */ target,/** @type {string} */ attributeName) {
      let nv = target.getAttribute(attributeName);
      if (this.res[attributeName] !== nv) {
        this.res[attributeName] = nv
        let f = this.flist[attributeName];
        if (f) f(attributeName, nv);

      }
    }
    check(delay = 0) {
      setTimeout(() => {
        let target = kRef(this._target)
        if (target !== null) {
          for (const key of Object.keys(this.flist)) {
            this.checker(target, key)
          }
        } else {
          console.log('target is null') //disconnected??
        }
        target = null;
      }, delay)
    }
  }

  class KDate extends Date {

    constructor(...args) {
      super(...args)
      this.dayBack = false
    }

    browserSupported() {

    }

    lokStringDateEN() {
      const d = this

      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let date = d.getDate()

      let sy = y < 1000 ? (`0000${y}`).slice(-4) : '' + y

      let sm = m < 10 ? '0' + m : '' + m
      let sd = date < 10 ? '0' + date : '' + date

      return `${sy}.${sm}.${sd}`

    }

    lokStringDateJP() {
      const d = this

      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let date = d.getDate()

      let sy = y < 1000 ? (`0000${y}`).slice(-4) : '' + y

      let sm = m < 10 ? '0' + m : '' + m
      let sd = date < 10 ? '0' + date : '' + date

      return `${sy}/${sm}/${sd}`

    }

    lokStringTime() {
      const d = this

      let h = d.getHours()
      let m = d.getMinutes()

      const k = this.dayBack

      if (k) h += 24

      let sh = h < 10 ? '0' + h : '' + h
      let sm = m < 10 ? '0' + m : '' + m

      return `${sh}:${sm}`

    }

  }

  console.assert('browserSupported' in (new KDate()),
    { error: "0x87FF", errorMsg: "Your userscript manager is not supported. FireMonkey is not recommended." }
  );

  if (!('browserSupported' in (new KDate()))) return;

  let chromeCSSFiles = null;

  try {
    const o = [{
      id: 'tabview-css-content',
      path: 'css/style_content.css'
    }, {
      id: 'tabview-css-chat',
      path: 'css/style_chat.css'
    }, {
      id: 'tabview-css-control',
      path: 'css/style_control.css'
    }];

    for (const e of o) e.url = chrome.runtime.getURL(e.path) || '';

    chromeCSSFiles = o;

  } catch (e) { }

  if (chromeCSSFiles) {
    const target = document.head || document.documentElement;
    for (const { path, url, id } of chromeCSSFiles) {

      if (url && typeof url === 'string' && url.length > 4) {

        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        target.appendChild(link);

      }

    }
    chromeCSSFiles = null;

  }

  /*

  function fixTheaterChat1() {
    let incorrectChat = document.querySelector('ytd-watch-flexy[is-two-columns_][theater] ytd-live-chat-frame#chat:not([collapsed])')
    if (incorrectChat) {
      scriptletDeferred.debounce(()=>{
        incorrectChat.dispatchEvent(new CustomEvent("collapsed-true"));
      });
    }
  }


  function fixTheaterChat2() {
    let incorrectChat = document.querySelector('ytd-watch-flexy[is-two-columns_][theater] ytd-live-chat-frame#chat[collapsed]')
    if (incorrectChat) {
      scriptletDeferred.debounce(()=>{
        incorrectChat.dispatchEvent(new CustomEvent("collapsed-false"));
      });
    }
  }
  */


  function fixTheaterChat1A() {
    let incorrectChat = document.querySelector('ytd-watch-flexy[is-two-columns_][theater] ytd-live-chat-frame#chat:not([collapsed])')
    if (incorrectChat) {
      ytBtnCollapseChat();
    }
  }


  function fixTheaterChat2A() {
    let incorrectChat = document.querySelector('ytd-watch-flexy[is-two-columns_][theater] ytd-live-chat-frame#chat[collapsed]')
    if (incorrectChat) {
      ytBtnExpandChat();
    }
  }

  function check1885() {

    if (chatController.ytlstmTheaterMode) {
      if (document.fullscreenElement || document.querySelector('ytd-watch-flexy[fullscreen]')) {
        chatController.allowChatControl = true;
        chatController.ytlstmTheaterMode = false;
        return;
      }
    }
    if (chatController.allowChatControl) {
      if (document.body.hasAttribute('data-ytlstm-theater-mode')) {
        chatController.allowChatControl = false;
        chatController.ytlstmTheaterMode = true;
      }
    } else {
      if (!document.body.hasAttribute('data-ytlstm-theater-mode')) {
        chatController.allowChatControl = true;
        chatController.ytlstmTheaterMode = false;
      }
    }
  }

  function check1886() {

    let cssContentNode = document.getElementById('tabview-css-content')
    if (!cssContentNode) return;
    let cssChatNode = document.getElementById('tabview-css-chat')
    if (!cssChatNode) return;

    if (cssContentNode.disabled === false) {
      if (chatController.ytlstmTheaterMode) {
        cssContentNode.disabled = true;
        cssChatNode.disabled = true;
        let t = document.querySelector('.youtube-genius-lyrics-found-hide-btn');
        if (t) t.click();
        ytBtnCloseEngagementPanels();
        return 1;
      }
    } else if (cssContentNode.disabled === true) {
      if (!chatController.ytlstmTheaterMode) {
        cssContentNode.disabled = false;
        cssChatNode.disabled = false;
        return 2;
      }
    }

  }

  function dnsPrefetch() {

    function linker(link, rel, href, _as) {
      return new Promise(resolve => {
        if (!link) link = document.createElement('link');
        link.rel = rel;
        if (_as) link.setAttribute('as', _as);
        link.onload = function () {
          resolve({
            link: this,
            success: true
          })
          this.remove();
        };
        link.onerror = function () {
          resolve({
            link: this,
            success: false
          });
          this.remove();
        };
        link.href = href;
        (document.head || document.documentElement).appendChild(link);
        link = null;
      });
    }

    new Promise(resolve => {

      if (document.documentElement) {
        resolve();
      } else {

        let mo = new MutationObserver(() => {
          if (mo !== null && document.documentElement) {
            mo.takeRecords();
            mo.disconnect();
            mo = null;
            resolve();
          }
        });
        mo.observe(document, { childList: true, subtree: false })

      }

    }).then(() => {

      const hosts = [
        'https://i.ytimg.com',
        'https://www.youtube.com',
        'https://rr2---sn-5n5ip-ioqd.googlevideo.com',
        'https://googlevideo.com',
        'https://accounts.youtube.com',
        'https://jnn-pa.googleapis.com',
        'https://googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.gstatic.com',
        'https://yt3.ggpht.com',
        'https://yt4.ggpht.com'
      ]
      for (const h of hosts) {


        linker(null, 'preconnect', h);

      }



    });
  }
  dnsPrefetch();

  const tabsDeferred = new Deferred();
  tabsDeferred.resolve();

  const discardableFn = function (f) { // logic to be reviewed; unstable
    if (!scriptEnable && tabsDeferred.resolved) { } // ignore all before first yt-navigate-finished
    else tabsDeferred.debounce(f, psId);
  }

  let layoutStatusMutex = new Mutex();

  let sliderMutex = new Mutex();
  const renderDeferred = new Deferred(); //pageRendered
  let pageRendered = 0;
  let renderIdentifier = ControllerID();
  renderIdentifier.auto = false;

  const scriptletDeferred = new Deferred();


  function scriptInjector(script_id, url_chrome, response_id) {

    let res = {
      script_id: script_id,
      inject: function () {

        let res = this, script_id = this.script_id;

        if (!document.querySelector(`script#${script_id}`)) {
          if (res.runtime_url) {
            addScriptByURL(res.runtime_url).id = script_id;
          } else {
            addScript(`${res.injection_script}`).id = script_id;
          }
        }

      }
    }
    res.script_id = script_id;

    if (isMyScriptInChromeRuntime()) {
      res.runtime_url = window.chrome.runtime.getURL(url_chrome)
    } else {
      res.injection_script = GM_getResourceText(response_id);
    }

    return res;


  }

  const script_inject_js1 = scriptInjector(
    'userscript-tabview-injection-1',
    'js/injection_script_1.js',
    "injectionJS1");

  let scriptReady = false;
  scriptletDeferred.debounce(() => {
    scriptReady = true;
  });
  const sendToPageScriptPendings = new Map();
  async function sendToPageScript(element, id, ...args) {
    if (!scriptReady) {
      const tid = (sendToPageScriptPendings.get(id) || 0) + 1
      sendToPageScriptPendings.set(id, tid);
      await scriptletDeferred.d();
      const cid = sendToPageScriptPendings.get(id);
      if (tid !== cid) return;
    }
    element.dispatchEvent(new CustomEvent("tabview-page-script", {
      detail: {
        id: id,
        args: args.length ? args : null
      }
    }));
  }


  function nonCryptoRandStr(/** @type {number} */ n) {
    const result = new Array(n);
    const baseStr = nonCryptoRandStr_base;
    const bLen = baseStr.length;
    for (let i = 0; i < n; i++) {
      let t = null
      do {
        t = baseStr.charAt(Math.floor(Math.random() * bLen));
      } while (i === 0 && 10 - t > 0)
      result[i] = t;
    }
    return result.join('');
  }

  const uidMAP = new Map();

  function uidGEN(s) {
    let uid = uidMAP.get(s);
    if (!uid) {
      const uidStore = ObserverRegister.uidStore;
      do {
        uid = nonCryptoRandStr(5);
      } while (uidStore[uid])
      uidMAP.set(s, uid);
    }
    return uid;
  }

  /**
   * Class definition
   * @property {string} propName - propriety description
   * ...
   */
  class ObserverRegister {

    constructor(/** @type {()=>MutationObserver | IntersectionObserver} */ observerCreator) {
      let uid = null;
      const uidStore = ObserverRegister.uidStore;
      do {
        uid = nonCryptoRandStr(5);
      } while (uidStore[uid])
      uidStore[uid] = true;

      /**
       * uid is the unique string for each observer
       * @type {string}
       * @public
       */
      this.uid = uid;

      /**
       * observerCreator is a function to create the observer
       * @type {Function}
       * @public
       */
      this.observerCreator = observerCreator

      /**
       * observer is the actual observer object
       * @type {MutationObserver | IntersectionObserver}
       * @public
       */
      this.observer = null;
      this.bindCount = 0;
      ffReflection(this, ObserverRegister);
    }
    bindElement(/** @type {HTMLElement} */ elm, ...args) {
      if (elm.hasAttribute(`o3r-${this.uid}`)) return false;
      elm.setAttribute(`o3r-${this.uid}`, '')
      this.bindCount++;
      if (this.observer === null) {
        this.observer = this.observerCreator();
      }
      this.observer.observe(elm, ...args)
      return true
    }
    clear(/** @type {boolean} */ flag) {
      if (this.observer !== null) {
        //const uidStore = ObserverRegister.uidStore;
        if (flag === true) {
          this.observer.takeRecords();
          this.observer.disconnect();
        }
        this.observer = null;
        this.bindCount = 0;
        for (const s of document.querySelectorAll(`[o3r-${this.uid}]`)) s.removeAttribute(`o3r-${this.uid}`)
        //uidStore[this.uid]=false;
        //this.uid = null;
      }
    }
  }

  /**
 * 'uidStore' is the static store of strings used.
 * @static
 */
  ObserverRegister.uidStore = {}; // backward compatible with FireFox 55.


  const mtoObservationDetails = new ObserverRegister(() => {
    return new IntersectionObserver(ito_details, {
      root: null,
      rootMargin: "0px"
    })
  });


  const mtoFlexyAttr = new ObserverRegister(() => {
    return new MutationObserver(mtf_attrFlexy)
  });

  const mtoBodyAttr = new ObserverRegister(() => {
    return new MutationObserver(mtf_attrBody)
  });

  const mtoVisibility_EngagementPanel = new ObserverRegister(() => {
    return new MutationObserver(FP.mtf_attrEngagementPanel)
  });

  const mtoVisibility_Playlist = new ObserverRegister(() => {
    return new AttributeMutationObserver({
      "hidden": FP.mtf_attrPlaylist
    })
  })
  const sa_playlist = mtoVisibility_Playlist.uid;

  const mtoVisibility_Comments = new ObserverRegister(() => {
    return new AttributeMutationObserver({
      "hidden": FP.mtf_attrComments
    })
  })
  const sa_comments = mtoVisibility_Comments.uid;


  const mtoVisibility_Chatroom = new ObserverRegister(() => {
    return new AttributeMutationObserver({
      "collapsed": FP.mtf_attrChatroom
    })
  })
  // const sa_chatroom = mtoVisibility_Chatroom.uid;




  function isDOMVisible(/** @type {HTMLElement} */ elem) {
    // jQuery version : https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

  function isNonEmptyString(s) {
    return typeof s == 'string' && s.length > 0;
  }

  async function dispatchWindowResize() {
    // for youtube to detect layout resize for adjusting Player tools
    return window.dispatchEvent(new Event('resize'));
  }

  async function dispatchCommentRowResize() {

    if (pageType !== "watch") return;

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;
    if (ytdFlexyElm.getAttribute('tyt-tab') !== '#tab-comments') return;

    sendToPageScript(document, 'tabview-resize-comments-rows');


  }

  function enterPIP(video, errorHandler) { // ignore audio
    return new Promise(resolve => {
      if (video && typeof video.requestPictureInPicture === 'function' && typeof document.exitPictureInPicture === 'function') {
        if (isVideoPlaying(video) && document.pictureInPictureElement === null) {
          video.requestPictureInPicture().then(res => {
            resolve(true);
          }).catch((e) => {
            if (errorHandler === undefined) console.warn(e);
            else if (typeof errorHandler == 'function') errorHandler(e);
            resolve(false);
          });
        } else {
          resolve(false);
        }
      } else {
        resolve(null);
      }
    })
  }

  function exitPIP() {
    if (document.pictureInPictureElement !== null && typeof document.exitPictureInPicture === 'function') {
      document.exitPictureInPicture().then(res => {

      }).catch(console.warn)
    }
  }

  function setToggleBtnTxt() {

    if (chatroomDetails && typeof chatroomDetails.txt_expand === 'string' && typeof chatroomDetails.txt_collapse === 'string') { // toggle button (show-hide-button)
      // _console.log(124234, 'c=== ')

      let chat = document.querySelector('ytd-live-chat-frame#chat');
      if (!chat) return;
      let txt = _querySelector.call(chat, 'span.yt-core-attributed-string[role="text"]');
      let c = (txt || 0).textContent;

      if (typeof c === 'string' && c.length > 2) {
        if (chat.hasAttribute('collapsed')) {
          // _console.log(124234, 'collapsed show expand ', chatroomDetails.txt_expand)
          if (c !== chatroomDetails.txt_expand) {
            txt.textContent = chatroomDetails.txt_expand;
          }
        } else {
          // _console.log(124234, 'not collapsed show collapse ', chatroomDetails.txt_collapse)
          if (c !== chatroomDetails.txt_collapse) {
            txt.textContent = chatroomDetails.txt_collapse;
          }
        }
      }
    } else if (chatroomDetails && typeof chatroomDetails.txt_expand === 'string') { // show button only


      let chat = document.querySelector('ytd-live-chat-frame#chat');
      if (!chat) return;
      let txt = _querySelector.call(chat, 'span.yt-core-attributed-string[role="text"]');
      let c = (txt || 0).textContent;

      if (typeof c === 'string' && c.length > 2) {
        if (chat.hasAttribute('collapsed')) {
          // _console.log(124234, 'collapsed show expand ', chatroomDetails.txt_expand)
          if (c !== chatroomDetails.txt_expand) {
            txt.textContent = chatroomDetails.txt_expand;
          }
        }
      }

    }
  }


  function handlerTabExpanderClick() {

    scriptletDeferred.debounce(() => {




      async function b() {

        let h1 = document.documentElement.clientHeight;
        let h2 = (document.querySelector('#right-tabs') || 0).clientHeight;

        await Promise.resolve(0);
        if (h1 > 300 && h2 > 300) {
          let ratio = h2 / h1; // positive below 1.0

          return ratio;
        }
        return 0;
      }

      async function a() {


        let secondary = document.querySelector('#secondary.ytd-watch-flexy');
        if (secondary) {


          if (!secondary.classList.contains('tabview-hover-slider-enable')) {

            let secondaryInner = _querySelector.call(secondary, '#secondary-inner.ytd-watch-flexy');

            if (secondaryInner) {

              if (!secondary.classList.contains('tabview-hover-slider')) {
                // without hover

                //let rect = secondary.getBoundingClientRect();
                //let rectI = secondaryInner.getBoundingClientRect();

                secondaryInner.style.setProperty('--tabview-slider-right', `${getSecondaryInnerRight()}px`)

              }

              let ratio = await b();
              if (ratio > 0.0 && ratio <= 1.0) {

                secondaryInner.style.setProperty('--ytd-watch-flexy-sidebar-width-d', `${Math.round(100 * ratio * 10) / 10}vw`);
                secondary.classList.add('tabview-hover-slider');
                secondary.classList.add('tabview-hover-slider-enable');

                let video = document.querySelector('#player video'); // ignore audio
                enterPIP(video);

              }

            }


          } else {


            secondary.dispatchEvent(new CustomEvent("tabview-hover-slider-restore"));
            //console.log(1994)

          }

          // no animation event triggered for hover -> enable
          dispatchCommentRowResize();

        }



      }


      a();


    })


  }

  let global_columns_end_ito = null;

  function setupHoverSlider(secondary, columns) {

    if (!secondary || !columns) return;
    let attrName = `o4r-${uidGEN('tabview-hover-slider-restore')}`;

    if (secondary.hasAttribute(attrName)) return;
    secondary.setAttribute(attrName, '');

    let elmB = document.querySelector('tabview-view-secondary-xpander');
    if (!elmB) {
      elmB = document.createElement('tabview-view-secondary-xpander');
      prependTo(elmB, secondary);
    }

    let elmA = document.querySelector('tabview-view-columns-endpos');
    if (elmA) elmA.remove();
    elmA = document.createElement('tabview-view-columns-endpos');

    let itoA = new IntersectionObserver((entries) => {
      let t = null;
      let w = enableHoverSliderDetection
      for (const entry of entries) {
        if (entry.rootBounds === null) continue;
        let bcr = entry.boundingClientRect;
        let rb = entry.rootBounds;
        t = !entry.isIntersecting && (bcr.left > rb.right) && (rb.left <= 0);
        // if entries.length>1 (unlikely); take the last intersecting
        // supplement cond 1. ensure the col element is in the right side
        // supplement cond 2. ensure column is wide enough for overflow checking
        // it can also avoid if the layout change happened but attribute not yet changed during the intersection observation
      }

      let columns = document.querySelector('#columns.style-scope.ytd-watch-flexy');
      if (columns) columns.classList.toggle('tyt-column-overflow', t);

      if (w !== t && t !== null) {
        // t can be true when the layout enters single column mode
        enableHoverSliderDetection = t;
      }
      //console.log(entries, enableHoverSliderDetection, t)
    })
    elementAppend.call(columns, elmA); // append to dom first before observe
    if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) {
      //to trigger observation at the time layout being changed
      itoA.observe(elmA);
    }
    global_columns_end_ito = itoA;


    secondary.addEventListener('tabview-hover-slider-restore', function (evt) {

      let secondary = evt.target;

      if (!secondary.classList.contains('tabview-hover-slider-enable')) return;

      let secondaryInner = _querySelector.call(secondary, '#secondary-inner.ytd-watch-flexy')

      if (!secondaryInner) return;

      if (secondary.classList.contains('tabview-hover-slider-hover')) {

        Promise.resolve(0).then(() => {
          secondaryInner.style.removeProperty('--ytd-watch-flexy-sidebar-width-d');
        }).then(() => {
          secondary.classList.remove('tabview-hover-slider-enable')
          exitPIP();
        })

      } else {

        let secondary = evt.target;
        secondary.classList.remove('tabview-hover-slider')
        secondary.classList.remove('tabview-hover-slider-enable')

        secondaryInner.style.removeProperty('--ytd-watch-flexy-sidebar-width-d');
        secondaryInner.style.removeProperty('--tabview-slider-right')

        exitPIP();

      }

      getDMPromise().then(() => {
        updateFloatingSlider()
      });

    }, false);

  }

  function addTabExpander(tabContent) {

    if (!tabContent) return null;
    let id = tabContent.id;
    if (!id || typeof id !== 'string') return null;

    if (_querySelector.call(tabContent, `#${id} > tabview-view-tab-expander`)) return false;

    let elm = document.createElement('tabview-view-tab-expander')
    prependTo(elm, tabContent);
    elm.innerHTML = createHTML(`<div>${svgElm(16, 16, 12, 12, svgDiag1, 'svg-expand')}${svgElm(16, 16, 12, 12, svgDiag2, 'svg-collapse')}</div>`);
    elm.addEventListener('click', handlerTabExpanderClick, false);
    return true;

  }

  function getColumnOverflowWidth() {

    let screenWidth = document.documentElement.getBoundingClientRect().width;

    let posElm1 = document.querySelector('#secondary.style-scope.ytd-watch-flexy + tabview-view-columns-endpos');

    if (posElm1) {

      let offset = posElm1.getBoundingClientRect().x - screenWidth;
      return offset

    }
    return null
  }

  function getSecondaryInnerRight() {

    let posElm1 = document.querySelector('#secondary.style-scope.ytd-watch-flexy + tabview-view-columns-endpos');

    let posElm2 = document.querySelector('#secondary.style-scope.ytd-watch-flexy > tabview-view-secondary-xpander');

    if (posElm1 && posElm2) {

      let offset = posElm1.getBoundingClientRect().x - posElm2.getBoundingClientRect().right;
      return offset

    }
    return null

  }

  const setFloatingSliderOffset = (secondaryInner) => {


    let posElm1 = document.querySelector('#secondary.style-scope.ytd-watch-flexy + tabview-view-columns-endpos');

    let posElm2 = document.querySelector('#secondary.style-scope.ytd-watch-flexy > tabview-view-secondary-xpander');

    if (posElm1 && posElm2) {

      let offset = getColumnOverflowWidth();

      let k = 1.0
      if (offset >= 125) {
        k = 1.0
      } else if (offset >= 75) {
        k = 1.0;
      } else if (offset >= 25) {
        k = 0.25;
      } else {
        k = 0.0
      }
      secondaryInner.style.setProperty('--tabview-slider-offset-k2', `${k}`);
      secondaryInner.style.setProperty('--tabview-slider-offset', `${offset}px`) // unnecessary 

      let oriWidth = posElm2.getBoundingClientRect().width;
      secondaryInner.style.setProperty('--tabview-slider-ow', `${oriWidth}px`)

      let s1 = 'var(--ytd-watch-flexy-sidebar-width-d)';
      // new width 

      let s2 = `var(--tabview-slider-ow)`;
      // ori width - youtube changing the code -> not reliable to use css prop.

      let s3 = `${offset}px`;
      // how many px wider than the page

      secondaryInner.style.setProperty('--tabview-slider-offset-actual', `calc(${s1} - ${s2} + ${s3})`)

    }

  }

  async function updateFloatingSlider_A(secondaryInner) {

    // [is-extra-wide-video_]
    await getDMPromise(); // time allowed for dom changes and value change of enableHoverSliderDetection    

    let secondary = nodeParent(secondaryInner);
    if (!secondary) return;

    if (secondary.classList.contains('tabview-hover-slider-enable')) {
      return;
    }

    if (!secondary.matches('#columns.ytd-watch-flexy #primary.ytd-watch-flexy ~ #secondary.ytd-watch-flexy')) {
      return;
    }

    const bool = enableHoverSliderDetection === true;
    const hasClassHover = secondary.classList.contains('tabview-hover-slider-hover') === true;

    if (bool || hasClassHover) {
    } else {
      return;
    }

    await Promise.resolve(0);

    secondary.classList.add('tabview-hover-final')

    if (hasClassHover && !bool) {
      secondaryInner.style.removeProperty('--tabview-slider-right')
      secondaryInner.style.removeProperty('--tabview-slider-offset')
    } else {

      if (!hasClassHover) {
        secondaryInner.style.setProperty('--tabview-slider-right', `${getSecondaryInnerRight()}px`)
      }

      setFloatingSliderOffset(secondaryInner);
    }

    if (bool ^ hasClassHover) {
      secondary.classList.toggle('tabview-hover-slider', bool)
      secondary.classList.toggle('tabview-hover-slider-hover', bool)
    }

    await Promise.resolve(0);


    setTimeout(() => {
      secondary.classList.remove('tabview-hover-final')
    }, 350)


  }


  function updateFloatingSlider() {

    let secondaryInner = document.querySelector('ytd-watch-flexy[flexy][is-two-columns_] #secondary-inner.ytd-watch-flexy')

    if (!secondaryInner) return;

    let secondary = nodeParent(secondaryInner);
    if (!secondary) return;

    if (secondary.classList.contains('tabview-hover-slider-enable')) {
      return;
    }

    let t = document.documentElement.clientWidth; //integer

    sliderMutex.lockWith(unlock => {

      let v = document.documentElement.clientWidth; //integer

      if (t === v && secondaryInner.matches('body ytd-watch-flexy[flexy][is-two-columns_] #secondary-inner.ytd-watch-flexy')) {

        updateFloatingSlider_A(secondaryInner).then(unlock);
      } else {
        unlock();
      }

    })

  }

  // iframe loadprocess interupted when expanded -> collasped
  async function checkChatIframeOnExpanded() {
    const iframe = document.getElementById('chatframe');
    if (!(iframe instanceof HTMLIFrameElement)) return;
    if (((iframeLoadStatusWM.get(iframe) || 0) % 2) === 1) return;
    await iframePipeline(() => { });
    if (((iframeLoadStatusWM.get(iframe) || 0) % 2) === 1) return;
    let iframeLocation;
    try {
      iframeLocation = iframe.contentDocument.location;
    } catch (e) { }
    if (!iframeLocation) return;
    if (iframeLocation.href.includes('youtube.com')) {

      await iframePipeline(async () => {
        if (((iframeLoadStatusWM.get(iframe) || 0) % 2) === 1) return;
        await iframeLoadHookHandlerPromise.then();
        if (iframe.isConnected === true && iframe.matches('body iframe.style-scope.ytd-live-chat-frame#chatframe')) {
          await iframeLoadProcess(iframe);
        }
      });

    }

    // console.log(1421, iframeLocation.href);
  }


  const canScrollIntoViewWithOptions = (() => {

    const element = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let i = 0;
    try {
      element.scrollIntoView({
        get behavior() { i++ },
        get block() { i++ }
      });
    } catch (e) {

    }
    return i === 2;


  })();
  // Chrome >= 61, Edge >= 79, Firefox >= 36, Opera >=48, Safari >=14

  /** @param {Element} elm */
  const stableScroll = async (elm, options) => {

    const f = (p) => `${p.height}|${p.width}|${p.left}|${p.top}`
    let i = 0;
    while (i++ < 4) {
      const p = elm.getBoundingClientRect();
      const ps = f(p);
      const rr = new Promise(resolve => {
        document.addEventListener('scroll', resolve, {
          capture: true, passive: true, once: true
        })
      });
      elm.scrollIntoView(options);
      await rr;
      await new Promise(resolve => {
        let io = new IntersectionObserver(() => {
          resolve();
          io.disconnect();
          io = null;
        });
        io.observe(elm)
      });
      const q = elm.getBoundingClientRect();
      const qs = f(q);

      if (ps === qs) break;
    }


  }

  const fullScreenTabScrollIntoView = canScrollIntoViewWithOptions ? () => {
    const scrollElement = document.querySelector('ytd-app[scrolling]')
    const b = scrollElement && isFullScreen() && isWideScreenWithTwoColumns() && (isChatExpand() || isTabExpanded() || isEngagementPanelExpanded() || isDonationShelfExpanded());
    if (!b) return;
    // single column view; click button; scroll to tab content area 100%
    const rightTabs = document.querySelector('#right-tabs');
    const pTop = rightTabs.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top
    if (rightTabs && pTop > 0) {
      const secondaryInner = rightTabs.closest('#secondary-inner');
      if (secondaryInner && secondaryInner.getBoundingClientRect().height < document.documentElement.clientHeight && document.documentElement.clientHeight > 80) {
        stableScroll(secondaryInner, { behavior: "instant", block: "end", inline: "nearest" });
      }
    }
  } : null;


  function setToActiveTab(defaultTab) {
    if (isTheater() && isWideScreenWithTwoColumns()) return;
    const jElm = document.querySelector(`a[tyt-tab-content="${switchTabActivity_lastTab}"]:not(.tab-btn-hidden)`) ||
      document.querySelector(`a[tyt-tab-content="${(defaultTab || settings.defaultTab)}"]:not(.tab-btn-hidden)`) ||
      document.querySelector(`a[tyt-tab-content="${(SETTING_DEFAULT_TAB_0)}"]:not(.tab-btn-hidden)`) ||
      document.querySelector("a[tyt-tab-content]:not(.tab-btn-hidden)") ||
      null;

    switchTabActivity(jElm);
    return !!jElm;
  }

  let enableLivePopupCheck = false

  function layoutStatusChanged(/** @type {number} */ old_layoutStatus, /** @type {number} */ new_layoutStatus) {


    if ((new_layoutStatus & LAYOUT_TWO_COLUMNS) === 0) makeHeaderFloat();

    //if (old_layoutStatus === new_layoutStatus) return;

    const cssElm = es.ytdFlexy;

    if (!cssElm) return;


    const BF_TWOCOL_N_THEATER = LAYOUT_TWO_COLUMNS | LAYOUT_THEATER

    let new_isExpandedChat = !!(new_layoutStatus & LAYOUT_CHATROOM_EXPANDED)
    let new_isCollapsedChat = !!(new_layoutStatus & LAYOUT_CHATROOM_COLLAPSED) && !!(new_layoutStatus & LAYOUT_CHATROOM)

    let new_isTabExpanded = !!(new_layoutStatus & LAYOUT_TAB_EXPANDED);
    let new_isFullScreen = !!(new_layoutStatus & LAYOUT_FULLSCREEN);
    let new_isExpandedEPanel = !!(new_layoutStatus & LAYOUT_ENGAGEMENT_PANEL_EXPANDED);
    let new_isExpandedDonationShelf = !!(new_layoutStatus & LAYOUT_DONATION_SHELF_EXPANDED);

    function showTabOrChat() {

      layoutStatusMutex.lockWith(unlock => {

        if (lstTab.lastPanel == '#chatroom') {

          if (new_isTabExpanded) switchTabActivity(null)
          if (!new_isExpandedChat) ytBtnExpandChat();

        } else if (lstTab.lastPanel && lstTab.lastPanel.indexOf('#engagement-panel-') == 0) {

          if (new_isTabExpanded) switchTabActivity(null)
          if (!new_isExpandedEPanel) ytBtnOpenEngagementPanel(lstTab.lastPanel);

        } else if (lstTab.lastPanel == '#donation-shelf') {

          if (new_isTabExpanded) switchTabActivity(null)
          if (!new_isExpandedDonationShelf) openDonationShelf();

        } else {

          if (new_isExpandedChat) ytBtnCollapseChat()
          if (!new_isTabExpanded) setToActiveTab();

        }
        getDMPromise().then(unlock);

      })
    }

    function hideTabAndChat() {

      layoutStatusMutex.lockWith(unlock => {

        if (new_isTabExpanded) switchTabActivity(null)
        if (new_isExpandedChat) ytBtnCollapseChat()
        if (new_isExpandedEPanel) ytBtnCloseEngagementPanels();
        if (new_isExpandedDonationShelf) closeDonationShelf();

        getDMPromise().then(unlock);

      })

    }

    const statusCollapsedFalse = !!(new_layoutStatus & (LAYOUT_TAB_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED | LAYOUT_CHATROOM_EXPANDED))
    const statusCollapsedTrue = !statusCollapsedFalse

    let changes = (old_layoutStatus & LAYOUT_VAILD) ? old_layoutStatus ^ new_layoutStatus : 0;

    let chat_collapsed_changed = !!(changes & LAYOUT_CHATROOM_COLLAPSED)
    let chat_expanded_changed = !!(changes & LAYOUT_CHATROOM_EXPANDED)
    let tab_expanded_changed = !!(changes & LAYOUT_TAB_EXPANDED)
    let theater_mode_changed = !!(changes & LAYOUT_THEATER)
    let column_mode_changed = !!(changes & LAYOUT_TWO_COLUMNS)
    let fullscreen_mode_changed = !!(changes & LAYOUT_FULLSCREEN)
    let epanel_expanded_changed = !!(changes & LAYOUT_ENGAGEMENT_PANEL_EXPANDED)
    let ds_expanded_changed = !!(changes & LAYOUT_DONATION_SHELF_EXPANDED)

    // _console.log(8221, 1, chat_collapsed_changed, chat_expanded_changed, tab_expanded_changed, theater_mode_changed, column_mode_changed, fullscreen_mode_changed, epanel_expanded_changed)


    //console.log(169, 1, chat_collapsed_changed, tab_expanded_changed)
    //console.log(169, 2, new_isExpandedChat, new_isCollapsedChat, new_isTabExpanded)

    let BF_LayoutCh_Panel = (changes & (LAYOUT_TAB_EXPANDED | LAYOUT_CHATROOM_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED))
    let tab_change = BF_LayoutCh_Panel;
    let isChatOrTabExpandTriggering = !!((new_layoutStatus) & BF_LayoutCh_Panel);
    let isChatOrTabCollaspeTriggering = !!((~new_layoutStatus) & BF_LayoutCh_Panel);


    const moreThanOneShown = (new_isTabExpanded + new_isExpandedChat + new_isExpandedEPanel + new_isExpandedDonationShelf) > 1


    const base_twoCol_NoTheather_chatExpand_a = LAYOUT_TWO_COLUMNS | LAYOUT_THEATER | LAYOUT_CHATROOM | LAYOUT_CHATROOM_COLLAPSED
    const base_twoCol_NoTheather_chatExpand_b = LAYOUT_TWO_COLUMNS | 0 | LAYOUT_CHATROOM | 0

    // two column; not theater; tab collapse; chat expand; ep expand
    const IF_01a = base_twoCol_NoTheather_chatExpand_a | LAYOUT_TAB_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED;
    const IF_01b = base_twoCol_NoTheather_chatExpand_b | 0 | LAYOUT_ENGAGEMENT_PANEL_EXPANDED;


    // two column; not theater; tab collapse; chat expand; ep expand
    const IF_07a = base_twoCol_NoTheather_chatExpand_a | LAYOUT_TAB_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED;
    const IF_07b = base_twoCol_NoTheather_chatExpand_b | 0 | LAYOUT_DONATION_SHELF_EXPANDED;


    // two column; not theater;
    const IF_02a = BF_TWOCOL_N_THEATER;
    const IF_02b = LAYOUT_TWO_COLUMNS;

    // two column; not theater; tab expand; chat expand; 
    const IF_03a = base_twoCol_NoTheather_chatExpand_a | LAYOUT_TAB_EXPANDED;
    const IF_03b = base_twoCol_NoTheather_chatExpand_b | LAYOUT_TAB_EXPANDED;


    // two column; tab expand; chat expand; 
    const IF_06a = LAYOUT_TWO_COLUMNS | LAYOUT_TAB_EXPANDED | LAYOUT_CHATROOM | LAYOUT_CHATROOM_COLLAPSED;
    const IF_06b = LAYOUT_TWO_COLUMNS | LAYOUT_TAB_EXPANDED | LAYOUT_CHATROOM | 0;


    // two column; theater;
    const IF_04a = BF_TWOCOL_N_THEATER;
    const IF_04b = BF_TWOCOL_N_THEATER;

    // not fullscreen; two column; not theater; not tab expand; not EP expand; not expand chat; not donation shelf
    const IF_05a = LAYOUT_FULLSCREEN | LAYOUT_TWO_COLUMNS | LAYOUT_THEATER | LAYOUT_TAB_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED | LAYOUT_CHATROOM_EXPANDED;
    const IF_05b = 0 | LAYOUT_TWO_COLUMNS | 0 | 0 | 0 | 0 | 0;

    let _isChatPopupedF = null
    let isChatPopupedF = () => {
      return _isChatPopupedF === null ? (_isChatPopupedF = cssElm.classList.contains('tyt-chat-popup')) : _isChatPopupedF
    }

    if (chat_expanded_changed && new_isExpandedChat) {
      checkChatIframeOnExpanded();
    }

    const checkForMoreThanOne = () => {

      if (moreThanOneShown && (new_layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) {

        layoutStatusMutex.lockWith(unlock => {
          if (new_isTabExpanded && lstTab.lastPanel === null) {
            if (new_isExpandedChat) ytBtnCollapseChat();
            if (new_isExpandedEPanel) ytBtnCloseEngagementPanels();
            if (new_isExpandedDonationShelf) closeDonationShelf();
          } else if (lstTab.lastPanel) {
            let lastPanel = lstTab.lastPanel || '';
            if (typeof lastPanel !== 'string') lastPanel = '';
            if (new_isExpandedChat && lastPanel !== '#chatroom') ytBtnCollapseChat();
            if (new_isExpandedEPanel && lastPanel.indexOf('#engagement-panel-') < 0) ytBtnCloseEngagementPanels();
            if (new_isExpandedDonationShelf && lastPanel !== '#donation-shelf') closeDonationShelf();
            switchTabActivity(null);
          }
          getDMPromise().then(unlock);
        });
      }
    }

    let waitingPromise = Promise.resolve();

    if (new_isFullScreen) {


      if (tab_change == LAYOUT_CHATROOM_EXPANDED && (new_layoutStatus & IF_06a) === IF_06b && statusCollapsedFalse && !column_mode_changed) {

        // two column; tab expand; chat expand; 

        switchTabActivity(null);

      }

      if (!!(tab_change & LAYOUT_CHATROOM_EXPANDED) && new_isExpandedChat) {
        //tab_change = LAYOUT_CHATROOM_EXPANDED
        //tab_change = LAYOUT_CHATROOM_EXPANDED|LAYOUT_TAB_EXPANDED


        /*
        triggered by iframe close, not by button click
        */


        canScrollIntoViewWithOptions && waitingPromise.then(async () => {
          await getDMPromise();
          let scrollElement = document.querySelector('ytd-app[scrolling]')
          if (!scrollElement) return;
          // single column view; click button; scroll to tab content area 100%
          let chatFrame = document.querySelector('ytd-live-chat-frame#chat');
          if (chatFrame && isChatExpand()) {
            // _console.log(7290, 1)
            fullScreenTabScrollIntoView();
          }
        })

      }

      if (!!(tab_change & LAYOUT_ENGAGEMENT_PANEL_EXPANDED) && new_isExpandedEPanel) {

        waitingPromise.then(async () => {
          await getDMPromise();
          let scrollElement = document.querySelector('ytd-app[scrolling]')
          if (!scrollElement) return;
          // single column view; click button; scroll to tab content area 100%
          let epPanel = document.querySelector('ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])');
          if (epPanel) {
            // _console.log(7290, 2)

            let pi = 50;
            let cid = setInterval(() => {
              if (--pi) epPanel.scrollIntoView(true); else clearInterval(cid)
            }, 17)
            //
          }
        })

      }


    } else if (fullscreen_mode_changed) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: true


      if (!new_isFullScreen && statusCollapsedTrue && isWideScreenWithTwoColumns() && !isTheater()) {

        showTabOrChat();
      } else if (!new_isFullScreen && statusCollapsedFalse && isWideScreenWithTwoColumns() && isTheater()) {

        if (isChatPopupedF()) {
        } else {

          ytBtnCancelTheater();

        }
      }

      if (!new_isFullScreen && statusCollapsedFalse && isWideScreenWithTwoColumns()) {
        // check more than one shown

        Promise.resolve().then(checkForMoreThanOne);
      }

    } else if ((new_layoutStatus & IF_01a) === IF_01b && !column_mode_changed && (tab_change == LAYOUT_CHATROOM_EXPANDED || tab_change == LAYOUT_ENGAGEMENT_PANEL_EXPANDED)) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater; tab collapse; chat expand; ep expand

      if (epanel_expanded_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCollapseChat();
          getDMPromise().then(unlock);
        })
      } else if (chat_collapsed_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCloseEngagementPanels();
          getDMPromise().then(unlock);
        })

      }

    } else if ((new_layoutStatus & IF_07a) === IF_07b && !column_mode_changed && (tab_change == LAYOUT_CHATROOM_EXPANDED || tab_change == LAYOUT_DONATION_SHELF_EXPANDED)) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater; tab collapse; chat expand; ds expand

      if (ds_expanded_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCollapseChat();
          getDMPromise().then(unlock);
        })
      } else if (chat_collapsed_changed) {
        layoutStatusMutex.lockWith(unlock => {
          closeDonationShelf();
          getDMHelper().then(unlock);
        })

      }

    } else if (!tab_change && column_mode_changed && (new_layoutStatus & IF_02a) === IF_02b && moreThanOneShown) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater;
      // moreThanOneShown

      showTabOrChat();

    } else if (tab_change == LAYOUT_CHATROOM_EXPANDED && (new_layoutStatus & IF_03a) === IF_03b && statusCollapsedFalse && !column_mode_changed) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater; tab expand; chat expand; 

      switchTabActivity(null);

    } else if (isChatOrTabExpandTriggering && (new_layoutStatus & IF_04a) === IF_04b && statusCollapsedFalse && (changes & BF_TWOCOL_N_THEATER) === 0) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      ytBtnCancelTheater();

    } else if ((new_layoutStatus & IF_04a) === IF_04b && statusCollapsedFalse) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      if (isChatPopupedF()) {

      } else {

        hideTabAndChat();
      }

    } else if (isChatOrTabCollaspeTriggering && (new_layoutStatus & IF_02a) === IF_02b && statusCollapsedTrue && !column_mode_changed) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      if (tab_change == LAYOUT_ENGAGEMENT_PANEL_EXPANDED) {

        lstTab.lastPanel = null;

        if (new_isFullScreen) {

        } else {
          showTabOrChat();
        }
      } else if (tab_change == LAYOUT_DONATION_SHELF_EXPANDED) {

        lstTab.lastPanel = null;

        if (new_isFullScreen) {

        } else {
          showTabOrChat();
        }
      } else if (tab_change == LAYOUT_CHATROOM_EXPANDED) {

        lstTab.lastPanel = null;

        if (new_isFullScreen) {

        } else {
          showTabOrChat();
        }
      } else {


        if (new_isFullScreen) {

        } else {

          ytBtnSetTheater();

        }

      }

    } else if (!tab_change && !!(changes & BF_TWOCOL_N_THEATER) && (new_layoutStatus & IF_02a) === IF_02b && statusCollapsedTrue) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      showTabOrChat();

    } else if ((new_layoutStatus & IF_05a) === IF_05b) {
      // bug fix for restoring from mini player

      layoutStatusMutex.lockWith(unlock => {
        setToActiveTab();
        getDMPromise().then(unlock);
      });

    }

    if (theater_mode_changed) {
      let tdt = Date.now();
      theater_mode_changed_dt = tdt
      setTimeout(() => {
        if (theater_mode_changed_dt !== tdt) return;
        updateFloatingSlider();
      }, 130)
    }

    let secondaryElement = null;
    if (secondaryElement = document.querySelector('.tabview-hover-slider-enable')) {
      scriptletDeferred.debounce(() => {
        secondaryElement.isConnected && secondaryElement.dispatchEvent(new CustomEvent('tabview-hover-slider-restore'))
      });
    }


    if (fullscreen_mode_changed) {
      detailsTriggerReset = true;
      getDMPromise().then(setHiddenStateForDesc);
    }

    // resize => is-two-columns_
    if (column_mode_changed) {

      Promise.resolve(0).then(() => {

        checkForMoreThanOne();

        pageCheck();
        if (global_columns_end_ito !== null) {
          //to trigger observation at the time layout being changed
          if ((new_layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) {
            let endpos = document.querySelector('tabview-view-columns-endpos')
            if (endpos !== null) {
              global_columns_end_ito.observe(endpos)
            }
          } else {
            global_columns_end_ito.disconnect();
          }
        }
        getDMPromise().then(() => {
          singleColumnScrolling(true); //initalize sticky
        });
      })
    }

    if (enableLivePopupCheck === true) {

      const new_isTwoColumnsTheater = fT(new_layoutStatus, LAYOUT_TWO_COLUMNS | LAYOUT_THEATER, 0)

      let currentIsTheaterPopupChat = new_isTwoColumnsTheater && new_isExpandedChat && isChatPopupedF()
      if (!currentIsTheaterPopupChat) {
        enableLivePopupCheck = false;
        sendToPageScript(document, "tyt-close-popup");
      }

    }


  }

  function fixLayoutStatus(x) {
    const new_isExpandedChat = !(x & LAYOUT_CHATROOM_COLLAPSED) && (x & LAYOUT_CHATROOM)
    return new_isExpandedChat ? (x | LAYOUT_CHATROOM_EXPANDED) : (x & ~LAYOUT_CHATROOM_EXPANDED);
  }

  const wls = new Proxy({
    /** @type {number | null} */
    layoutStatus: undefined
  }, {
    get: function (target, prop) {
      return target[prop];
    },
    set: function (target, prop, value) {
      if (prop == 'layoutStatus') {

        if (value === 0) {
          target[prop] = value;
          return true;
        } else if (target[prop] === value) {
          return true;
        } else {
          if (!target.layoutStatus_pending) {
            target.layoutStatus_pending = true;
            const old_layoutStatus = target[prop];
            target[prop] = value;
            layoutStatusMutex.lockWith(unlock => {
              target.layoutStatus_pending = false;
              let new_layoutStatus = target[prop];
              if (old_layoutStatus !== new_layoutStatus) {
                layoutStatusChanged(old_layoutStatus, new_layoutStatus);
                getDMPromise().then(unlock);
              } else {
                unlock();
              }
            })
            return true;
          }
        }
      }
      target[prop] = value;
      return true;
    },
    has: function (target, prop) {
      return (prop in target);
    }
  });

  const svgElm = (w, h, vw, vh, p, m) => `<svg${m ? ` class=${m}` : ''} width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${p}</svg>`

  function isVideoPlaying(video) {
    return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
  }

  function wAttr(elm, attr, kv) {
    if (elm) {
      if (kv === true) {
        elm.setAttribute(attr, '');
      } else if (kv === false) {
        elm.removeAttribute(attr);
      } else if (kv === null) {
        //;
      } else if (typeof kv == 'string') {
        elm.setAttribute(attr, kv);
      }
    }
  }

  function setTabBtnVisible(tabBtn, toVisible) {
    let doClassListChange = false;
    if (tabBtn.getAttribute('tyt-tab-content') === '#tab-comments') {
      isCommentsTabBtnHidden = !toVisible;
      if ((hiddenTabsByUserCSS & 2) !== 2) {
        doClassListChange = true;
      }
    } else {
      doClassListChange = true;
    }
    if (doClassListChange) {
      if (toVisible) {
        tabBtn.classList.remove("tab-btn-hidden");
      } else {
        tabBtn.classList.add("tab-btn-hidden");
      }
    }
  }

  function hideTabBtn(tabBtn) {
    //console.log('hideTabBtn', tabBtn)
    let isActiveBefore = tabBtn.classList.contains('active');
    setTabBtnVisible(tabBtn, false);
    if (isActiveBefore) {
      setToActiveTab();
    }
  }

  // function hasAttribute(obj, key) {
  //   return obj && obj.hasAttribute(key);
  // }

  function isTheater() {
    const cssElm = es.ytdFlexy;
    return (cssElm && cssElm.hasAttribute('theater'))
  }

  function isFullScreen() {
    const cssElm = es.ytdFlexy;
    return (cssElm && cssElm.hasAttribute('fullscreen'))
  }

  function isTabExpanded() {
    const cssElm = es.ytdFlexy;
    return cssElm && (cssElm.getAttribute('tyt-tab') || '').charAt(0) === '#'
  }

  function isChatExpand() {
    const cssElm = es.ytdFlexy;
    return cssElm && (cssElm.getAttribute('tyt-chat') || '').charAt(0) === '+'
  }

  function isWideScreenWithTwoColumns() {
    const cssElm = es.ytdFlexy;
    return (cssElm && cssElm.hasAttribute('is-two-columns_'))
  }


  function isAnyActiveTab() {
    return document.querySelector('#right-tabs .tab-btn.active') !== null
  }
  // function isAnyActiveTab2() {
  //   return document.querySelectorAll('#right-tabs .tab-btn.active').length > 0
  // }

  function isEngagementPanelExpanded() { //note: not checking the visual elements
    const cssElm = es.ytdFlexy;
    return (cssElm && +cssElm.getAttribute('tyt-ep-visible') > 0)
  }

  function isDonationShelfExpanded() {
    const cssElm = es.ytdFlexy;
    return (cssElm && cssElm.hasAttribute('tyt-donation-shelf'))
  }

  const engagementIdMap = new Map();
  let engagementIdNext = 1; // max 1 << 62

  function engagement_panels_() {

    let res = [];
    // let shownRes = [];

    let v = 0;
    // let k = 1;
    // let count = 0;

    for (const ePanel of document.querySelectorAll(
      `ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility]:not([hidden])`
    )) {
      let targetId = ePanel.getAttribute('target-id')
      if (typeof targetId !== 'string') continue;
      let eId = engagementIdMap.get(targetId)
      if (!eId) {
        engagementIdMap.set(targetId, eId = engagementIdNext)
        if (engagementIdNext === (1 << 62)) {
          engagementIdNext = 1;
          console.warn('engagementId reached 1 << 62')
        } else {
          engagementIdNext = engagementIdNext << 1;
        }
      }
      // console.log(55,eId, targetId)

      let visibility = ePanel.getAttribute('visibility') //ENGAGEMENT_PANEL_VISIBILITY_EXPANDED //ENGAGEMENT_PANEL_VISIBILITY_HIDDEN

      let k = eId
      switch (visibility) {
        case 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED':
          v |= k;
          // count++;
          // shownRes.push(ePanel)
          res.push({ ePanel, k, visible: true });
          break;
        case 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN':
          res.push({ ePanel, k, visible: false });
          break;
        default:
          res.push({ ePanel, k, visible: false });
      }

      //k = k << 1;

    }
    return { list: res, value: v };
    // return { list: res, value: v, count: count, shownRes };
  }


  function ytBtnOpenEngagementPanel(/** @type {number | string} */ panel_id) {

    // console.log(panel_id)
    if (typeof panel_id == 'string') {
      panel_id = panel_id.replace('#engagement-panel-', '');
      panel_id = parseInt(panel_id);
    }
    if (panel_id >= 0) { } else return false;

    let panels = engagement_panels_();
    // console.log(panels)

    let actions = []
    for (const { ePanel, k, visible } of panels.list) {
      if ((panel_id & k) === k) {
        if (!visible) {
          actions.push({
            panelId: ePanel.getAttribute('target-id'),
            toShow: true
          })
        }
      } else {
        if (visible) {
          actions.push({
            panelId: ePanel.getAttribute('target-id'),
            toHide: true
          })
        }
      }
    }

    if (actions.length > 0) {
      // console.log(4545,actions)
      const _actions = actions;
      scriptletDeferred.debounce(() => {
        document.dispatchEvent(new CustomEvent('tyt-engagement-panel-visibility-change', {
          detail: _actions
        }));
      });
    }
    actions = null;

  }

  function ytBtnCloseEngagementPanel(/** @type {HTMLElement} */ s) {
    //ePanel.setAttribute('visibility',"ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");

    let panelId = s.getAttribute('target-id')
    scriptletDeferred.debounce(() => {
      document.dispatchEvent(new CustomEvent('tyt-engagement-panel-visibility-change', {
        detail: {
          panelId,
          toHide: true
        }
      }))
    })

  }

  function ytBtnCloseEngagementPanels() {
    if (isEngagementPanelExpanded()) {
      for (const s of document.querySelectorAll(
        `ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility]:not([hidden])`
      )) {
        if (s.getAttribute('visibility') == "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED") ytBtnCloseEngagementPanel(s);
      }
    }
  }

  function openDonationShelf() {
    if (!isDonationShelfExpanded()) {
      let btn = document.querySelector('#tyt-donation-shelf-toggle-btn')
      if (btn) {
        btn.click();
        return true;
      }
    }
    return false;
  }
  function closeDonationShelf() {
    if (isDonationShelfExpanded()) {
      let btn = document.querySelector('#tyt-donation-shelf-toggle-btn')
      if (btn) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  function ytBtnSetTheater() {
    if (!isTheater()) {
      const sizeBtn = document.querySelector('ytd-watch-flexy #ytd-player button.ytp-size-button')
      if (sizeBtn) sizeBtn.click();
    }
  }

  function ytBtnCancelTheater() {
    if (isTheater()) {
      const sizeBtn = document.querySelector('ytd-watch-flexy #ytd-player button.ytp-size-button')
      if (sizeBtn) sizeBtn.click();
    }
  }

  function ytBtnExpandChat() {
    let button = document.querySelector('ytd-live-chat-frame#chat[collapsed] > .ytd-live-chat-frame#show-hide-button')
    if (button) {
      button =
        _querySelector.call(button, 'div.yt-spec-touch-feedback-shape') ||
        _querySelector.call(button, 'ytd-toggle-button-renderer');
      if (button) button.click();
    }
  }

  function ytBtnCollapseChat() {
    let button = document.querySelector('ytd-live-chat-frame#chat:not([collapsed]) > .ytd-live-chat-frame#show-hide-button')
    if (button) {
      button =
        _querySelector.call(button, 'div.yt-spec-touch-feedback-shape') ||
        _querySelector.call(button, 'ytd-toggle-button-renderer');
      if (button) button.click();
    }
  }


  async function makeVideosAutoLoad2() {
    let sVideosList = document.querySelector('ytd-watch-flexy #tab-videos [placeholder-videos]');

    if (!sVideosList) return null;

    //let ab = sVideosList.getAttribute('tabview-videos-autoload')
    await Promise.resolve(0);

    let endPosDOM = document.querySelector('tabview-view-videos-endpos')
    if (endPosDOM) endPosDOM.remove(); // just in case
    endPosDOM = document.createElement('tabview-view-videos-endpos')
    insertAfterTo(endPosDOM, sVideosList);

    await Promise.resolve(0);


    //sVideosList.setAttribute('tabview-videos-autoload', '1')

    // _console.log(9333)
    if (!sVideosITO) {

      sVideosITO = new IntersectionObserver((entries) => {

        if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) return;

        // _console.log(9334, entries)
        if (entries.length !== 1) return;
        if (entries[0].isIntersecting !== true) return;
        let elm = ((entries[0] || 0).target || 0);
        if (!elm) return;
        elm = null;
        entries = null;

        new Promise(resolve => {

          // compatibile with Search While Watching Video
          let isSearchGeneratedWithHiddenContinuation = !!document.querySelector('#related.style-scope.ytd-watch-flexy ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy ytd-compact-video-renderer.yt-search-generated.style-scope.ytd-item-section-renderer ~ ytd-continuation-item-renderer.style-scope.ytd-item-section-renderer[hidden]');
          if (isSearchGeneratedWithHiddenContinuation) return;

          // native YouTube coding use different way to handle custom videos, unknown condition for the continutation loading.
          let isOtherChipSelected = !!document.querySelector('ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy yt-chip-cloud-renderer.style-scope.yt-related-chip-cloud-renderer yt-chip-cloud-chip-renderer.style-scope.yt-chip-cloud-renderer[aria-selected="false"] ~ [aria-selected="true"]')
          if (isOtherChipSelected) return;

          getDMPromise().then(resolve); // delay required to allow YouTube generate the continuation elements


        }).then(() => {

          let res = setVideosTwoColumns(2 | 4, true)

          // _console.log(9335, res)

          if (res.m2 && res.m3) {
            const m4 = closestDOM.call(res.m2, 'ytd-continuation-item-renderer');

            if (m4) {


              const m5 = _querySelector.call(m4, 'ytd-button-renderer.style-scope.ytd-continuation-item-renderer, yt-button-renderer.style-scope.ytd-continuation-item-renderer');

              // YouTube coding bug - correct is 'ytd-button-renderer'. If the page is redirected under single column mode, the tag become 'yt-button-renderer'
              // under 'yt-button-renderer', the 

              const m6 = querySelectorFromAnchorX(m5, 'button.yt-spec-button-shape-next--call-to-action'); // main

              // _console.log(9337, m4, m5, m6)

              if (m6) {
                m6.click() // generic solution
              } else if (m5) {
                m5.click(); // not sure
              } else {
                m4.dispatchEvent(new Event('yt-service-request-sent-button-renderer')); // only for correct YouTube coding
              }
            }
          }
          res = null;

        });

      }, {
        rootMargin: `0px`, // refer to css margin-top:-30vh
        threshold: [0]
      })
      sVideosITO.observe(endPosDOM);
    } else {
      sVideosITO.disconnect();
      sVideosITO.observe(endPosDOM);
    }


  }


  function fixTabs() {

    scriptletDeferred.debounce(() => {


      // if(document.documentElement.hasAttribute('p355')) return;

      if (!scriptEnable) return;

      let queryElement = document.querySelector('*:not(#tab-videos) > #related.ytd-watch-flexy > ytd-watch-next-secondary-results-renderer');

      let isRelocated = !!queryElement;

      if (isRelocated) {
        // if(1885) return;

        // _console.log(3202, 2)

        let relatedElm = closestDOM.call(queryElement, '#related.ytd-watch-flexy'); // NOT NULL

        let right_tabs = document.querySelector('#right-tabs'); // can be NULL

        let tab_videos = querySelectorFromAnchorX(right_tabs, "#tab-videos"); // can be NULL

        if (tab_videos !== null) {

          // _console.log(3202, 4)

          let target_container = document.querySelector('ytd-watch-flexy:not([is-two-columns_]) #primary-inner.ytd-watch-flexy, ytd-watch-flexy[is-two-columns_] #secondary-inner.ytd-watch-flexy')
          if (target_container) elementAppend.call(target_container, right_tabs) // last-child

          elementAppend.call(tab_videos, relatedElm);
          // no any other element set these attr. only init / relocation
          relatedElm.setAttribute('placeholder-for-youtube-play-next-queue', '')
          relatedElm.setAttribute('placeholder-videos', '')

          makeVideosAutoLoad2();

        }

      }

      /** @type {HTMLElement | null} */
      check1885();
      if (!chatController.allowChatControl) return;

      let chatroom = null;
      if (chatroom = document.querySelector('ytd-live-chat-frame#chat')) {

        const container = chatroom.parentNode.id === 'chat-container' ? chatroom.parentNode : chatroom;

        let pHolderElm = document.querySelector('tabview-view-pholder[data-positioner="before|#chat"]');

        if (!pHolderElm || pHolderElm.nextElementSibling !== container) {


          if (pHolderElm) pHolderElm.remove();



          // if (1885 && document.body.hasAttribute('data-ytlstm-theater-mode')) {

          // } else 
          if (document.querySelector('.YouTubeLiveFilledUpView')) {
            // no relocation
          } else {

            let rightTabs = document.querySelector('#right-tabs');
            // console.log(28784, rightTabs.previousSibling)
            if (rightTabs && rightTabs.previousSibling !== container) {
              const parentNode = rightTabs.parentNode;
              let useDefault = true;
              if (parentNode === container.parentNode && parentNode instanceof HTMLElement
                && typeof docFragmentCreate === 'function'
                && typeof docFragmentAppend === 'function') {
                const previousNodes = [];
                const nextNodes = [];
                let dv = 0;
                for (let node = parentNode.firstChild; node instanceof Node; node = node.nextSibling) {
                  if (node === rightTabs) {
                    dv |= 1;
                  } else if (node === container) {
                    dv |= 2;
                  } else {
                    if (node instanceof HTMLIFrameElement || (node instanceof Element && node.querySelector('iframe'))) {
                      dv |= 4;
                      break;
                    }
                    if (dv & 1) {
                      nextNodes.push(node);
                    } else {
                      previousNodes.push(node);
                    }
                  }
                }
                if (dv === 3 && (previousNodes.length + nextNodes.length) < 8000) {
                  if (previousNodes.length > 0) {
                    const nw1 = docFragmentCreate.call(document);
                    docFragmentAppend.call(nw1, ...previousNodes);
                    parentNode.insertBefore(nw1, parentNode.firstChild);
                  }
                  const nw2 = docFragmentCreate.call(document);
                  docFragmentAppend.call(nw2, rightTabs, ...nextNodes);
                  parentNode.appendChild(nw2);
                  // parentNode.replaceChildren(...previousNodes, container, rightTabs, ...nextNodes);
                  useDefault = false;
                }
              }
              if (useDefault) {

                // console.log(28784, [...parentNode.childNodes])
                insertBeforeTo(container, rightTabs);
                // const _chatroom = chatroom;
                // _chatroom && (async ()=>{
                //   await scriptletDeferred.d();
                //   if (typeof webkitRequestAnimationFrame === 'function' && typeof mozRequestAnimationFrame === 'undefined') {
                //     await new Promise(r => setTimeout(r, 650));  // 650ms to avoid Brave Bug
                //   }

                //   // sendToPageScript(_chatroom, "tabview-chat-call-urlchange");

                // })();
              }
            }

          }

          if (!pHolderElm) {
            pHolderElm = document.createElement('tabview-view-pholder');
            pHolderElm.setAttribute('data-positioner', 'before|#chat');
          }

          insertBeforeTo(pHolderElm, container)
        }

      }


    })

  }


  async function isDocumentInFullScreenMode() {
    return document.fullscreenElement !== null;
  }
  // let zatt = Date.now();

  const dbId = `ep5wbmokDB-${instanceId}`
  async function tabviewEnergizedFn() {

    let db;
    const indexedDB = window.indexedDB;
    try {
      let dbReq = indexedDB.open(dbId, 3);
      db = await new Promise((resolve, reject) => {
        dbReq.onupgradeneeded = function (event) {
          /** @type {IDBDatabase} */
          const db = event.target.result;
          let objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("email", "email", { unique: true });
          objectStore = null;
          db.deleteObjectStore("customers");
          resolve(db);
        }
        dbReq.onsuccess = function (event) {
          const db = event.target.result;
          resolve(db);
        }
        dbReq.onerror = function () {
          reject();
        }
      });
    } finally {
      if (db) db.close();
    }
    try {
      let request = indexedDB.deleteDatabase(dbId);
      await new Promise((resolve, reject) => {
        request.onsuccess = function (event) {
          resolve(1);
        };
        request.onerror = function (event) {
          resolve(-1);
        };
        request.onblocked = function (event) {
          resolve(-2);
        };
      });
    } catch (e) {
    }

    postMessage({ tabviewEnergized: true }, 'https://www.youtube.com'); // post message to make alive

  }

  async function energizedByMediaTimeUpdate() {

    const isFullscreen = await isDocumentInFullScreenMode();
    if (isFullscreen) return;

    // force browser to load the videostream during playing (primarily for music videos)
    // both background and foreground

    _updateTimeAccum++;

    if (_updateTimeAccum >= 88000000 && (_updateTimeAccum % 88000000) === 0) _updateTimeAccum = 0;

    if ((_updateTimeAccum + _viTimeNum) % 11 === 0) {
      // console.log(document.querySelector('video').currentTime) // 2.55, 2.64, 3.12, ...
      // about 2.66s

      if (_viTimeNum > 208) {
        _viTimeNum = 200;
        _updateTimeAccum = (_updateTimeAccum % 8) + 1; // reset to 1 ~ 8
      }

      document.head.dataset.viTime = `${_viTimeNum + 1}`;
      await Promise.resolve(0)
      _viTimeNum = +document.head.dataset.viTime || 0;
    }


  }

  function autoCompletePosCreate() {

    let positioner = document.createElement("tabview-view-autocomplete-pos");
    let oldPositioner = document.querySelector("tabview-view-autocomplete-pos");
    if (oldPositioner) oldPositioner.remove();
    return positioner
  }

  function handlerAutoCompleteExist() {
    // Youtube - Search While Watching Video

    if (document.querySelector('autocomplete-holder')) return;

    /** @type {HTMLElement} */
    let searchBox, autoComplete;
    searchBox = this;
    this.removeEventListener('tyt-autocomplete-sc-exist', handlerAutoCompleteExist, false)
    let domId = this.getAttribute('data-autocomplete-results-id')

    autoComplete = document.querySelector(`[data-autocomplete-input-id="${domId}"]`)

    if (!domId || !searchBox) return;

    let positioner = nodePrevSibling(searchBox);
    if (!positioner || positioner.nodeName.toLowerCase() !== "tabview-view-autocomplete-pos") {
      positioner = autoCompletePosCreate();
      insertBeforeTo(positioner, searchBox);
    }
    prependTo(autoComplete, positioner);

    setupSearchBox(searchBox, positioner);

  }

  async function setupSearchBox(searchBox, positioner) {

    let h = searchBox.offsetHeight + 'px'

    positioner.style.setProperty('--tyt-swwv-searchbox-h', h)

    mtf_autocomplete_search()

  }

  function mtf_autocomplete_search() {
    // Youtube - Search While Watching Video

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    const autocomplete = _querySelector.call(ytdFlexyElm, '[placeholder-for-youtube-play-next-queue] #suggestions-search-container tabview-view-autocomplete-pos > .autocomplete-suggestions[data-autocomplete-input-id]:not([position-fixed-by-tabview-youtube])')

    if (autocomplete) {

      const searchBox = document.querySelector('[placeholder-for-youtube-play-next-queue] input#suggestions-search')


      if (searchBox) {

        const rAutoComplete = mWeakRef(autocomplete);

        function setVisible(autocomplete, b) {
          autocomplete.style.display = (b ? 'block' : 'none');
        }

        function isContentNotEmpty(searchbox, autocomplete) {
          return (searchbox.value || '').length > 0 && (autocomplete.textContent || '').length > 0;
        }

        nodeParent(autocomplete).setAttribute('position-fixed-by-tabview-youtube', '');
        autocomplete.setAttribute('position-fixed-by-tabview-youtube', '');
        autocomplete.setAttribute('userscript-scrollbar-render', '')

        //let cancelClickToggle = false;

        if (!searchBox.hasAttribute('is-set-click-to-toggle')) {
          searchBox.setAttribute('is-set-click-to-toggle', '')

          searchBox.addEventListener('click', function () {

            Promise.resolve(0).then(() => {

              const autocomplete = kRef(rAutoComplete);

              if (!autocomplete) return;

              const isNotEmpty = isContentNotEmpty(this, autocomplete);

              if (isNotEmpty) {

                let elmVisible = isDOMVisible(autocomplete);

                if (elmVisible) {
                  setVisible(autocomplete, false)
                }
                else {
                  setVisible(autocomplete, true)
                }

              }

            })

          }, bubblePassive)

          let cacheScrollIntoView = null;
          let rafXC = 0;
          searchBox.addEventListener('keydown', function (evt) {
            //cancelClickToggle = true;
            switch (evt.code) {
              case 'ArrowUp':
              case 'ArrowDown':

                let t = Date.now();
                if (rafXC === 0) {
                  getRAFPromise().then(() => {
                    rafXC = 0;
                    let d = Date.now();
                    if (d - t > 300) return;

                    const autocomplete = kRef(rAutoComplete);
                    if (!autocomplete) return;

                    let selected = _querySelector.call(autocomplete, '.autocomplete-suggestion.selected');
                    let bool = selected && selected !== cacheScrollIntoView;
                    cacheScrollIntoView = selected;
                    if (bool) {

                      try {
                        selected.scrollIntoView({ block: "nearest", inline: "nearest" });
                      } catch (e) { }

                    }

                  });
                  rafXC = 1;
                }
              default:
              //
            }


          }, bubblePassive)

          searchBox.addEventListener('tyt-autocomplete-suggestions-change', function (evt) {

            //cancelClickToggle = true;
            if (evt.target !== document.activeElement) return;
            getDMPromise().then(() => {
              const autocomplete = document.querySelector(`.autocomplete-suggestions[data-autocomplete-input-id="${this.getAttribute('data-autocomplete-results-id')}"]`);
              if (!autocomplete) return;
              const isNotEmpty = isContentNotEmpty(this, autocomplete);
              if (isNotEmpty) {
                // dont detect visibility; just set to visible
                setVisible(autocomplete, true);
              }
            });

          }, bubblePassive)

        }

      }

    }

  }

  const insertBeforeTo = HTMLElement.prototype.before ? (elm, target) => {
    if (!target || !elm) return null;
    // using before
    HTMLElement.prototype.before.call(target, elm);
    return true;
  } : (elm, target) => {
    if (!target || !elm) return null;
    // using insertBefore
    try {
      HTMLElement.prototype.insertBefore.call(nodeParent(target), elm, target);
      return true;
    } catch (e) {
      console.log('element insert failed in old browser CE')
    }
    return false;
  }

  const insertAfterTo = HTMLElement.prototype.after ? (elm, target) => {
    if (!target || !elm) return null;
    // using after
    HTMLElement.prototype.after.call(target, elm);
    return true;
  } : (elm, target) => {
    if (!target || !elm) return null;
    // using insertBefore
    try {
      HTMLElement.prototype.insertBefore.call(nodeParent(target), elm, nodeNextSibling(target));
      return true;
    } catch (e) {
      console.log('element insert failed in old browser CE')
    }
    return false;
  }

  const prependTo = HTMLElement.prototype.prepend ? (elm, target) => {
    if (!target || !elm) return null;
    // using prepend
    HTMLElement.prototype.prepend.call(target, elm);
    return true;
  } : (elm, target) => {
    if (!target || !elm) return null;
    // using insertBefore
    try {
      HTMLElement.prototype.insertBefore.call(target, elm, nodeFirstChild(target));
      return true;
    } catch (e) {
      console.log('element insert failed in old browser CE')
    }
    return false;
  }

  const appends = HTMLElement.prototype.append ? (target, ...args) => {
    HTMLElement.prototype.append.call(target, ...args);
    return true;
  } : (target, ...args) => {
    for (const s of args) {
      target.appendChild(s)
    }
    return true;
  }




  function getWrapper(wrapperId) {
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = wrapperId;
    }
    return wrapper;
  }

  // continuous check for element relocation
  // fired at begining & window resize, etc
  // might moved to #primary
  function mtf_append_playlist(/** @type {HTMLElement | null} */ playlist) {

    if (playlist === null) {
      playlist = document.querySelector('ytd-watch-flexy[playlist] *:not(#tabview-playlist-wrapper) > ytd-playlist-panel-renderer.style-scope.ytd-watch-flexy#playlist:not(.ytd-miniplayer)');
      // this playlist is highly possible to have '#items'
      if (!playlist) return;
    }

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    let items = _querySelector.call(playlist, "*:not(#tabview-playlist-wrapper) > ytd-playlist-panel-renderer#playlist:not(.ytd-miniplayer) #items.ytd-playlist-panel-renderer:not(:empty)");

    if (items !== null && playlist.nodeName.toUpperCase() === 'YTD-PLAYLIST-PANEL-RENDERER') {

      let tab_list = document.querySelector("#tab-list");

      if (!tab_list) return;

      let w = getWrapper("tabview-playlist-wrapper");
      let docFrag = new DocumentFragment();
      // avoid immediate reflow for append playlist before append to tab_list
      docFrag.appendChild(w);
      elementAppend.call(w, playlist);
      elementAppend.call(tab_list, docFrag);
      docFrag = null;
      w = null;

    }
  }


  function getCountHText(elm) {
    return `${pageFetchedDataVideoId || 0}...${elm.textContent}`
  }

  function mtf_fix_collapsible_playlist() {

    // just in case the playlist is collapsed
    let playlist = document.querySelector('#tab-list ytd-playlist-panel-renderer#playlist')
    if (playlist && playlist.matches('[collapsed], [collapsible]')) {

      const domElement = playlist;
      playlist = null;
      // if(!domElement.parentElement || domElement.nodeType!==1) return; // not working in pseudo custom element - parentNode = documentFragment
      const tablist = closestDOM.call(domElement, 'ytd-watch-flexy #tab-list')

      if (!tablist || tablist.nodeType !== 1) return; // checking whether it is still on the page

      if (domElement.hasAttribute('collapsed')) wAttr(domElement, 'collapsed', false);
      if (domElement.hasAttribute('collapsible')) wAttr(domElement, 'collapsible', false);

    }
  }

  // content fix - info & playlist
  // fired at begining, and keep for in case any change
  async function mtf_fix_details() {

    if (!scriptEnable) return 0; // in case

    await scriptletDeferred.d();
    await Promise.all([
      Promise.resolve().then(() => {

        let contentToggleBtn = document.querySelector('ytd-watch-flexy #tab-info ytd-expander tp-yt-paper-button#less.ytd-expander:not([hidden]), #tab-info ytd-expander tp-yt-paper-button#more.ytd-expander:not([hidden])');

        if (contentToggleBtn) {

          const domElement = contentToggleBtn;
          contentToggleBtn = null;
          // if(!domElement.parentElement) return; // not working in pseudo custom element - parentNode = documentFragment
          const expander = closestDOM.call(domElement, 'ytd-watch-flexy #tab-info ytd-expander')

          if (!expander || expander.nodeType !== 1) return; // checking whether it is still on the page

          if (expander.style.getPropertyValue('--ytd-expander-collapsed-height')) {
            expander.style.setProperty('--ytd-expander-collapsed-height', '')
          }
          sendToPageScript(expander, "tabview-expander-config");

        }

      }),

      Promise.resolve().then(() => {

        let strcturedInfo = document.querySelector('ytd-watch-flexy #tab-info ytd-structured-description-content-renderer.style-scope.ytd-video-secondary-info-renderer')
        if (strcturedInfo) {
          const isHidden = closestDOM.call(strcturedInfo, '[hidden]');
          if (isHidden) {
            if (strcturedInfo.hasAttribute('hidden')) strcturedInfo.removeAttribute('hidden');
            const descriptionElement = closestDOM.call(strcturedInfo, 'ytd-expander.style-scope.ytd-video-secondary-info-renderer #description.style-scope.ytd-video-secondary-info-renderer');
            if (descriptionElement && descriptionElement.hasAttribute('hidden')) {
              descriptionElement.removeAttribute('hidden');
            }
          }
          isHidden && setTimeout(() => {
            let e = closestDOM.call(strcturedInfo, 'ytd-watch-flexy #tab-info ytd-expander');
            if (!e) return;
            let s = _querySelectorAll.call(e, '#tab-info .more-button.style-scope.ytd-video-secondary-info-renderer[role="button"]');
            if (s.length === 1) {
              let sp = nodeParent(s[0]);
              if (sp.nodeName.toUpperCase() === 'TP-YT-PAPER-BUTTON') {
                sp.click();
              }
            }
          }, 300);
        }

      }),

      Promise.resolve().then(() => {


        let subscribersCount = document.querySelector('#primary.ytd-watch-flexy #below ytd-watch-metadata #owner #owner-sub-count');

        if (subscribersCount) {
          if (!subscribersCount.hasAttribute('title')) {
            // assume YouTube native coding would not implement [title]

            let ytdWatchMetaDataElm = closestDOM.call(subscribersCount, 'body #primary.ytd-watch-flexy #below ytd-watch-metadata:not([tabview-uploader-hover])');
            if (ytdWatchMetaDataElm) {
              ytdWatchMetaDataElm.setAttribute('tabview-uploader-hover', '')
              let _h = 0;
              ytdWatchMetaDataElm.addEventListener('transitionend', function (evt) {
                // no css selector rule required; no delay js function call required

                let selection = evt.propertyName === 'background-position-y' ? 1 : evt.propertyName === 'background-position-x' ? 2 : 0;

                if (selection && evt.target) {
                  let cssRoot = this; // no querySelector is required
                  if (cssRoot.classList.contains('tabview-uploader-hover')) {
                    if (evt.target.id !== 'owner') return;
                    cssRoot.classList.toggle('tabview-uploader-hover', false);
                  }
                }

                if (selection === 1) { // string comparision only

                  // If the cursor initially stayed at the owner info area, 
                  // the mechanism will be broken
                  // so implement the true leave detection at their parent

                  let isHover = evt.elapsedTime < 0.03; // 50ms @normal; 10ms @hover;

                  let cssRoot = this; // no querySelector is required
                  if (!isHover) {
                    // 50ms is slowest than sub element leave effect
                    if (_h > 0) cssRoot.classList.toggle('tabview-uploader-hover', false) // even the order is incorrect, removal of class is safe.
                    _h = 0; // in case
                  } else if (isHover) {
                    // 10ms is faster than sub element hover effect
                    // no removal of class in case browser's transition implemention order is incorrect
                    _h = 0; // in case
                  }

                } else if (selection === 2) { // string comparision only

                  //from one element to another element; hover effect of 2nd element transition end first.
                  // _h: 0 -> 1 -> 2 -> 1

                  let isHover = evt.elapsedTime < 0.03; // 40ms @normal; 20ms @hover;
                  if (isHover) _h++; else _h--;
                  let cssRoot = this; // no querySelector is required
                  if (_h <= 0) {
                    cssRoot.classList.toggle('tabview-uploader-hover', false)
                    _h = 0; // in case
                  } else if (_h === 1) {
                    cssRoot.classList.toggle('tabview-uploader-hover', true)
                  }

                }

              }, capturePassive) // capture the hover effect inside the cssRoot
            }

          }
          subscribersCount.setAttribute('title', subscribersCount.textContent); // set at every page update

        }

      })


    ]);


  }


  const innerCommentsFuncs = [
    // comments
    function () {

      let elm = kRef(this.elm);
      // _console.log(2907, 1, !!elm)
      if (!elm) return;

      let span = document.querySelector("span#tyt-cm-count")
      // let r = '0';
      // let txt = elm.textContent
      // if (typeof txt == 'string') {
      //   let m = txt.match(/[\d\,\.\s]+/)
      //   if (m) {
      //     let d = +m[0].replace(/\D+/g, '');
      //     let ds = d.toLocaleString(document.documentElement.lang);
      //     let rtxt = txt.replace(ds, '')
      //     if (rtxt !== txt && !/\d/.test(rtxt)) {
      //       r = ds;
      //     }
      //   }
      // }

      if (span) {
        let tab_btn = closestDOM.call(span, '.tab-btn[tyt-tab-content="#tab-comments"]')
        if (tab_btn) tab_btn.setAttribute('loaded-comment', 'normal');
        sendToPageScript(document, 'tyt-update-cm-count');
        // span.textContent = r;
      }


      setCommentSection(1);
      m_last_count = getCountHText(elm);
      // _console.log(2907, 2, m_last_count)
      return true;
    },
    // message
    function () {

      let elm = kRef(this.elm);
      // _console.log(2907, 2, !!elm)
      if (!elm) return;

      let span = document.querySelector("span#tyt-cm-count")
      if (span) {
        let tab_btn = closestDOM.call(span, '.tab-btn[tyt-tab-content="#tab-comments"]')
        if (tab_btn) tab_btn.setAttribute('loaded-comment', 'message')
        span.textContent = '\u200B';
      }

      setCommentSection(1);
      m_last_count = getCountHText(elm);
      // _console.log(2907, 2, m_last_count)
      return true;
    }
  ]


  let innerDOMCommentsCountTextCache = null;
  /**
   * 
   * @param {boolean} [requireResultCaching]
   * @returns 
   */
  function innerDOMCommentsCountLoader(requireResultCaching) {
    // independent of tabs initialization
    // f() is executed after tabs being ready

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    // _console.log(3434, pageType)
    if (pageType !== 'watch') return;

    /** @type {HTMLElement | null} */
    const qtElm = document.querySelector('ytd-comments#comments');
    if (!qtElm) return;

    /** @type {Array<HTMLElement>} */
    const qmElms = _querySelectorAll.call(qtElm, '#count.ytd-comments-header-renderer, ytd-item-section-renderer.ytd-comments#sections #header ~ #contents > ytd-message-renderer.ytd-item-section-renderer');

    const eTime = +`${Date.now() - mTime}00`;

    let res = new Array(qmElms.length);
    res.newFound = false;


    let ci = 0;
    let latest = -1;

    let retrival = cmTime;
    cmTime = eTime;

    for (const qmElm of qmElms) {

      let mgz = 0
      if (qmElm.id === 'count') {
        //#count.ytd-comments-header-renderer
        mgz = 1;

      } else if ((qmElm.textContent || '').trim()) {
        //ytd-message-renderer.ytd-item-section-renderer
        mgz = 2;
        // it is possible to get the message before the header generation.
        // sample link - https://www.youtube.com/watch?v=PVUZ8Nvr1ic
        // sample link - https://www.youtube.com/watch?v=yz8AiQc1Bk8
      }

      if (mgz > 0) {


        let lastUpdate = loadedCommentsDT.get(qmElm) || 0;
        let diff = retrival - lastUpdate
        // _console.log(2907, diff)
        let isNew = (diff > 4 || diff < -4);
        if (!isNew) {
          loadedCommentsDT.set(qmElm, eTime);
        } else {
          loadedCommentsDT.set(qmElm, eTime + 1);
          res.newFound = true;
          latest = ci;
        }

        res[ci] = {
          elm: mWeakRef(qmElm),
          isNew: isNew,
          isLatest: false, //set afterwards
          f: innerCommentsFuncs[mgz - 1]
        }

        if (DEBUG_LOG) {
          res[ci].status = mgz;
          res[ci].text = qmElm.textContent;
        }

        ci++;

      }

    }
    if (res.length > ci) res.length = ci;

    if (latest >= 0) {

      res[latest].isLatest = true;


      let elm = kRef(res[latest].elm);
      if (elm)
        innerDOMCommentsCountTextCache = elm.textContent;

    } else if (res.length === 1) {

      let qmElm = kRef(res[0].elm);
      let t = null;
      if (qmElm) {

        let t = qmElm.textContent;
        if (t !== innerDOMCommentsCountTextCache) {


          loadedCommentsDT.set(qmElm, eTime + 1);
          res.newFound = true;

          res[0].isNew = true;
          latest = 0;

          res[latest].isLatest = true;

        }

        innerDOMCommentsCountTextCache = t;


      }


    }


    // _console.log(2908, res, Q.comments_section_loaded)

    // _console.log(696, res.map(e => ({

    //   text: kRef(e.elm).textContent,
    //   isNew: e.isNew,
    //   isLatest: e.isLatest

    // })))

    if (requireResultCaching) {
      resultCommentsCountCaching(res);
    }

    return res;

  }

  function restoreFetching() {


    if (mtf_forceCheckLiveVideo_disable === 2) return;


    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;

    // _console.log(2901)

    if ((ytdFlexyElm.getAttribute('tyt-comments') || '').indexOf('K') >= 0) return;

    // _console.log(2902)

    let visibleComments = _querySelector.call(ytdFlexyElm, 'ytd-comments#comments:not([hidden])')
    if (!visibleComments) return;

    // _console.log(2903)


    ytdFlexyElm.setAttribute('tyt-comments', 'Kz');

    const tabBtn = document.querySelector('[tyt-tab-content="#tab-comments"]');
    let span = _querySelector.call(tabBtn, 'span#tyt-cm-count');
    tabBtn.removeAttribute('loaded-comment')
    span.innerHTML = createHTML('');

    if (tabBtn) {
      setTabBtnVisible(tabBtn, true);
    }

    // _console.log(2905)


  }

  function checkAndMakeNewCommentFetch() {
    if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
      fetchCounts.new.f();
      fetchCounts.fetched = true;
      fetchCommentsFinished();
      // _console.log(9972, 'fetched = true')
    }
  }
  function onCommentsReady(e) {
    // e => from commentsHeaderAppended
    let b = false;
    if (e && mtf_forceCheckLiveVideo_disable !== 2 && document.querySelector('ytd-comments#comments:not([hidden])')) {
      // 'YTD-COMMENTS-HEADER-RENDERER', native DOM
      setCommentSection(0);
      checkAndMakeNewCommentFetch();
      b = true;
    }
    _onCommentsReady(b);
  }

  function _onCommentsReady(b) {
    if (mtf_forceCheckLiveVideo_disable !== 2) {
      if (document.querySelector('ytd-comments#comments').hasAttribute('hidden')) {
        // unavailable but not due to live chat
        _disableComments();
      } else if (Q.comments_section_loaded === 0) {
        if (b || (comments_loader & 3) === 3) {
          getFinalComments();
        }
      }
    }
  }

  const resultCommentsCountCaching = (res) => {
    // update fetchCounts by res
    // indepedent of previous state of fetchCounts
    // _console.log(2908, 10, res)
    if (!res) return;
    fetchCounts.count = res.length;
    //if(fetchCounts.new && !document.documentElement.contains(fetchCounts.new.elm)) fetchCounts.new = null;
    //if(fetchCounts.base && !document.documentElement.contains(fetchCounts.base.elm)) fetchCounts.base = null;
    if (fetchCounts.new) return;
    let newFound = res.newFound;
    if (!newFound) {
      if (res.length === 1) {
        fetchCounts.base = res[0];
        return false;
      }
    } else if (res.length === 1) {
      fetchCounts.new = res[0];
      return true;
    } else if (res.length > 1) {
      for (const entry of res) {
        if (entry.isLatest === true && entry.isNew) {
          fetchCounts.new = entry;
          return true;
        }
      }
    }
  }

  const domInit_comments = () => {


    let comments = document.querySelector(`ytd-comments#comments:not([o3r-${sa_comments}])`);
    if (!comments) return;

    // once per {ytd-comments#comments} detection

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    if (mtoVisibility_Comments.bindElement(comments)) {
      mtoVisibility_Comments.observer.check(9);
    }


  };

  const fixLiveChatToggleButtonDispatchEvent = () => {
    sendToPageScript(document, "tabview-fix-live-chat-toggle-btn");
  }

  // let chatroomAttrCollapseCount = 0;

  const FP = {

    mtf_attrPlaylist: (attrName, newValue) => {
      //attr mutation checker - {ytd-playlist-panel-renderer#playlist} \single
      //::attr ~ hidden    
      //console.log(1210)

      // _console.log(21311)
      if (!scriptEnable) return;
      if (pageType !== 'watch') return;
      /** @type {HTMLElement|null} */
      let cssElm = es.ytdFlexy;
      if (!cssElm) return;

      // _console.log(21312)

      let playlist = document.querySelector('#tab-list ytd-playlist-panel-renderer#playlist'); // can be null if it is manually triggered
      let isAnyPlaylistExist = playlist && !playlist.hasAttribute('hidden');
      const tabBtn = document.querySelector('[tyt-tab-content="#tab-list"]');
      //console.log(1212.2, isPlaylistHidden, playlist.getAttribute('hidden'))
      if (tabBtn) {
        //console.log('attr playlist changed')
        let isPlaylistTabHidden = tabBtn.classList.contains('tab-btn-hidden')
        if (isPlaylistTabHidden && isAnyPlaylistExist) {
          //console.log('attr playlist changed - no hide')
          tabBtn.classList.remove("tab-btn-hidden");
        } else if (!isPlaylistTabHidden && !isAnyPlaylistExist) {
          //console.log('attr playlist changed - add hide')
          hideTabBtn(tabBtn);
        }
      }
      /* visible layout for triggering hidden removal */

    },
    mtf_attrComments: (attrName, newValue) => {
      //attr mutation checker - {ytd-comments#comments} \single
      //::attr ~ hidden

      // *** consider this can happen immediately after pop state. timeout / interval might clear out.

      renderDeferred.resolved && innerDOMCommentsCountLoader(true);
      // this is triggered by mutationobserver, the comment count update might have ouccred

      if (pageType !== 'watch') return;

      let comments = document.querySelector('ytd-comments#comments')
      const tabBtn = document.querySelector('[tyt-tab-content="#tab-comments"]');
      if (!comments || !tabBtn) return;
      let isCommentHidden = comments.hasAttribute('hidden')
      //console.log('attr comments changed')


      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;

      if (mtf_forceCheckLiveVideo_disable === 2) {

      } else if (!isCommentHidden) {

        ytdFlexyElm.setAttribute('tyt-comments', 'Kv');
        if (!fetchCounts.fetched) {
          emptyCommentSection();
        }
        //_console.log(9360, 71);
        setTabBtnVisible(tabBtn, true); //if contains

      } else if (isCommentHidden) {

        ytdFlexyElm.setAttribute('tyt-comments', 'Kh');
        if (pageType === 'watch' && Q.comments_section_loaded === 1) {
          emptyCommentSection();
          // _console.log(9360, 72);
        }

      }


    },

    mtf_attrChatroom: () => {
      //attr mutation checker - {ytd-live-chat-frame#chat} \single
      //::attr ~ collapsed

      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;
      if (pageType !== 'watch') return;

      setToggleBtnTxt();

      layoutStatusMutex.lockWith(unlock => {

        const chatBlock = document.querySelector('ytd-live-chat-frame#chat');
        /** @type {HTMLElement | null} */
        const cssElm = es.ytdFlexy;
        if (!chatBlock || !cssElm) {
          unlock();
          return;
        }

        if (pageType !== 'watch') {
          unlock();
          return;
        }

        let newAttrV = '';
        //mtf_attrChatroom => chat exist => tyt-chat non-null

        let isCollapsed = !!chatBlock.hasAttribute('collapsed');

        let currentAttr = cssElm.getAttribute('tyt-chat');

        if (currentAttr !== null) { //string     // [+-]?[az]+[az\$]+
          let isPlusMinus = currentAttr.charCodeAt(0) < 46; // 43 OR 45
          if (isPlusMinus) newAttrV = currentAttr.substring(1);
        }

        if (isCollapsed) newAttrV = `-${newAttrV}`;
        if (!isCollapsed) newAttrV = `+${newAttrV}`;

        wAttr(cssElm, 'tyt-chat', newAttrV);


        if (typeof newAttrV === 'string' && !isCollapsed) lstTab.lastPanel = '#chatroom';

        if (!isCollapsed && isAnyActiveTab() && isWideScreenWithTwoColumns() && !isTheater()) {
          switchTabActivity(null);
          getDMPromise().then(unlock);
        } else {
          unlock();
        }

        if (isCollapsed) {
          // ++chatroomAttrCollapseCount;
          // chatBlock.removeAttribute('tyt-iframe-loaded');
          chatBlock.classList.remove('tyt-chat-frame-ready');
          // console.log(922,1)
          // buggy; this section might not be correctly executed.
          // guess no collapse change but still iframe will distory and reload.
          let btn = document.querySelector('tyt-iframe-popup-btn')
          if (btn) btn.remove();
        } else {

          const iframe = _querySelector.call(chatBlock, 'body iframe.style-scope.ytd-live-chat-frame#chatframe');
          // console.log("iframe.xx",501,iframe)
          // showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 0B');
          if (iframe) Promise.resolve(iframe).then(iframeToVisible); // fix empty

        }

        fixLiveChatToggleButtonDispatchEvent();

      })


    },

    mtf_attrEngagementPanel: ( /** @type {MutationRecord[]} */ mutations, /** @type {MutationObserver} */ observer) => {
      //attr mutation checker - {ytd-engagement-panel-section-list-renderer} \mutiple
      //::attr ~ visibility

      const cssElm = es.ytdFlexy;
      if (!scriptEnable || !cssElm) return;
      let found = null
      if (mutations === 9) {
        found = observer
      } else {
        if (document.querySelector('ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])')) {
          // do nothing
        } else {
          mtoVisibility_EngagementPanel.clear(true)
          storeLastPanel = null;
          wAttr(cssElm, 'tyt-ep-visible', false);
        }
        return
      }
      let nextValue = engagement_panels_().value;
      let previousValue = +cssElm.getAttribute('tyt-ep-visible') || 0;
      if (nextValue === 0 || previousValue === nextValue) return
      cssElm.setAttribute('tyt-ep-visible', nextValue);
      lstTab.lastPanel = `#engagement-panel-${nextValue}`;
      storeLastPanel = mWeakRef(found)
      discardableFn(() => {
        if (es.storeLastPanel !== found) return
        layoutStatusMutex.lockWith(unlock => {
          if (es.storeLastPanel === found && whenEngagemenetPanelVisible()) {
            getDMPromise().then(unlock);
          } else {
            unlock();
          }
        });
      });
    }

  }


  function variableResets() {

    // reset variables when it is confirmed a new page is loaded

    lstTab =
    {
      lastTab: null, //tab-xxx
      lastPanel: null,
      last: null
    };

    scriptEnable = false;
    ytdFlexy = null;
    wls.layoutStatus = 0;

    mtoVisibility_Playlist.clear(true)
    mtoVisibility_Comments.clear(true)

    mtoVisibility_Chatroom.clear(true)
    mtoFlexyAttr.clear(true)
    mtoBodyAttr.clear(true)


    mtf_chatBlockQ = null;

  }



  function contentExtractor(elm) {
    if (!(elm instanceof HTMLElement)) {
      return null;
    }
    let m = elm.textContent;
    let isEmpty = m.trim().length === 0;
    if (isEmpty) return null;
    let s = elm.nodeName;
    let id = elm.id;
    if (id) s += '#' + id;
    return s + '\n' + m;
  }

  async function checkDuplicatedMetaRecommendation() {
    let mainContent0 = document.querySelector('#primary.ytd-watch-flexy #above-the-fold.ytd-watch-metadata');
    let mainContent1 = document.querySelector('#tab-info ytd-expander > #content');
    if (mainContent0 && mainContent1) {
      const hashedContents = new Set();
      for (let s1 = elementNextSibling(mainContent1); s1 instanceof HTMLElement; s1 = elementNextSibling(s1)) {
        let m = contentExtractor(s1);
        if (m === null) continue;
        hashedContents.add(m);
      }

      for (let s0 = elementNextSibling(mainContent0); s0 instanceof HTMLElement; s0 = elementNextSibling(s0)) {
        let m = contentExtractor(s0);
        if (m !== null && hashedContents.has(m)) {
          s0.classList.add('tyt-hidden-duplicated-meta');
        } else {
          s0.classList.remove('tyt-hidden-duplicated-meta');
        }
      }
      hashedContents.clear();
    }
  }

  const elementMapper = new WeakMap();


  const isContentDuplicationCheckAllow = () => {
    return document.querySelectorAll('[tyt-info-expander-placeholder]').length === 1 && document.querySelectorAll('[tyt-info-expander-content]').length === 1;
  }

  let waitForContentReady = new PromiseExternal(); // dummy initial value

  async function removeContentMismatch() {

    if (!document.querySelector('#tab-info')) return;
    const dmysOnPage = document.querySelectorAll('[tyt-info-expander-placeholder]');
    if (dmysOnPage.length === 1) {

      const dmyElm = dmysOnPage[0];
      const expander = elementMapper.get(dmyElm);
      if (!expander) return;

      for (const s of document.querySelectorAll('[tyt-info-expander-content]')) {
        if (expander !== s) s.remove();
      }
      if (expander.isConnected === false) {
        document.querySelector('#tab-info').appendChild(expander);
      }

      isContentDuplicationCheckAllow() && waitForContentReady.resolve();

    }


  }

  function getWord(tag) {
    return langWords[pageLang][tag] || langWords['en'][tag] || '';
  }


  function getTabsHTML() {

    const sTabBtnVideos = `${svgElm(16, 16, 90, 90, svgVideos)}<span>${getWord('videos')}</span>`;
    const sTabBtnInfo = `${svgElm(16, 16, 60, 60, svgInfo)}<span>${getWord('info')}</span>`;
    const sTabBtnPlayList = `${svgElm(16, 16, 20, 20, svgPlayList)}<span>${getWord('playlist')}</span>`;

    let str1 = `
        <paper-ripple class="style-scope yt-icon-button">
            <div id="background" class="style-scope paper-ripple" style="opacity:0;"></div>
            <div id="waves" class="style-scope paper-ripple"></div>
        </paper-ripple>
        `;

    let str_fbtns = `
    <div class="font-size-right">
    <div class="font-size-btn font-size-plus" tyt-di="8rdLQ">
    <svg width="12" height="12" viewbox="0 0 50 50" preserveAspectRatio="xMidYMid meet" 
    stroke="currentColor" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-size">
      <path d="M12 25H38M25 12V38"/>
    </svg>
    </div><div class="font-size-btn font-size-minus" tyt-di="8rdLQ">
    <svg width="12" height="12" viewbox="0 0 50 50" preserveAspectRatio="xMidYMid meet"
    stroke="currentColor" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-size">
      <path d="M12 25h26"/>
    </svg>
    </div>
    </div>
    `.replace(/[\r\n]+/g, '');

    const str_tabs = [
      `<a id="tab-btn1" tyt-di="q9Kjc" tyt-tab-content="#tab-info" class="tab-btn${(hiddenTabsByUserCSS & 1) === 1 ? ' tab-btn-hidden' : ''}">${sTabBtnInfo}${str1}${str_fbtns}</a>`,
      `<a id="tab-btn3" tyt-di="q9Kjc" tyt-tab-content="#tab-comments" class="tab-btn${(hiddenTabsByUserCSS & 2) === 2 ? ' tab-btn-hidden' : ''}">${svgElm(16, 16, 120, 120, svgComments)}<span id="tyt-cm-count"></span>${str1}${str_fbtns}</a>`,
      `<a id="tab-btn4" tyt-di="q9Kjc" tyt-tab-content="#tab-videos" class="tab-btn${(hiddenTabsByUserCSS & 4) === 4 ? ' tab-btn-hidden' : ''}">${sTabBtnVideos}${str1}${str_fbtns}</a>`,
      `<a id="tab-btn5" tyt-di="q9Kjc" tyt-tab-content="#tab-list" class="tab-btn tab-btn-hidden">${sTabBtnPlayList}${str1}${str_fbtns}</a>`
    ].join('');

    let addHTML = `
        <div id="right-tabs">
            <tabview-view-pos-thead></tabview-view-pos-thead>
            <header>
                <div id="material-tabs">
                    ${str_tabs}
                </div>
            </header>
            <div class="tab-content">
                <div id="tab-info" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
                <div id="tab-comments" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
                <div id="tab-videos" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
                <div id="tab-list" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
            </div>
        </div>
        `;

    return addHTML;

  }


  function getLang() {

    let lang = 'en';
    let htmlLang = ((document || 0).documentElement || 0).lang || '';
    switch (htmlLang) {
      case 'en':
      case 'en-GB':
        lang = 'en';
        break;
      case 'de':
      case 'de-DE':
        lang = 'du';
        break;
      case 'fr':
      case 'fr-CA':
      case 'fr-FR':
        lang = 'fr';
        break;
      case 'zh-Hant':
      case 'zh-Hant-HK':
      case 'zh-Hant-TW':
        lang = 'tw';
        break;
      case 'zh-Hans':
      case 'zh-Hans-CN':
        lang = 'cn';
        break;
      case 'ja':
      case 'ja-JP':
        lang = 'jp';
        break;
      case 'ko':
      case 'ko-KR':
        lang = 'kr';
        break;
      case 'ru':
      case 'ru-RU':
        lang = 'ru';
        break;
      default:
        lang = 'en';
    }

    return lang;

  }

  function getLangForPage() {

    let lang = getLang();

    if (langWords[lang]) pageLang = lang; else pageLang = 'en';

  }

  // function checkEvtTarget(evt, nodeNames) {
  //   return nodeNames.includes((((evt || 0).target || 0).nodeName || 0));
  // }

  function pageCheck() {
    // yt-player-updated
    // yt-page-data-updated
    // [is-two-columns_] attr changed => layout changed

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    const rootDom = document.documentElement;
    rootDom.setAttribute('sxmq8', rootDom.getAttribute('sxmq8') === '1' ? '0' : '1');
    console.log('sxmq8 r1', document.documentElement.getAttribute('sxmq8') );

    let comments = _querySelector.call(ytdFlexyElm, '#primary.ytd-watch-flexy ytd-watch-metadata ~ ytd-comments#comments');
    if (comments) {
      let tabComments = document.querySelector('#tab-comments');
      if (tabComments) {
        elementAppend.call(tabComments, comments);
      }
    }

    mtf_append_playlist(null); // playlist relocated after layout changed

    fixTabs();

    mtf_autocomplete_search();

  }

  function globalHook(eventType, func) {
    if (!func) return;

    const count = (globalHook_hashs[eventType] || 0) + 1;

    globalHook_hashs[eventType] = count;

    const s = globalHook_symbols[count - 1] || (globalHook_symbols[count - 1] = Symbol());

    document.addEventListener(eventType, function (evt) {
      if (evt[s]) return;
      evt[s] = true;
      Promise.resolve().then(() => {
        func(evt);
      })

    }, capturePassive)

  }

  async function makeHeaderFloat() {
    if (isMakeHeaderFloatCalled) return;
    isMakeHeaderFloatCalled = true;
    await Promise.resolve(0);


    const [header, headerP, navElm] = await Promise.all([
      Promise.resolve().then(() => document.querySelector("#right-tabs header")),

      Promise.resolve().then(() => document.querySelector("#right-tabs tabview-view-pos-thead")),

      Promise.resolve().then(() => document.querySelector('#masthead-container, #masthead'))

    ]);


    let ito_dt = 0;
    let ito = new IntersectionObserver((entries) => {

      let xyStatus = null;

      //console.log(entries);

      let xRect = null;
      let rRect = null;

      for (const entry of entries) {
        if (!entry.boundingClientRect || !entry.rootBounds) continue; // disconnected from DOM tree
        if (!entry.isIntersecting && entry.boundingClientRect.y <= entry.rootBounds.top && entry.boundingClientRect.y < entry.rootBounds.bottom) {
          xyStatus = 2;
          xRect = entry.boundingClientRect;
          rRect = entry.rootBounds;
        } else if (entry.isIntersecting && entry.boundingClientRect.y >= entry.rootBounds.top && entry.boundingClientRect.y < entry.rootBounds.bottom) {
          xyStatus = 1;
          xRect = entry.boundingClientRect;
          rRect = entry.rootBounds;
        }
      }
      let p = wls.layoutStatus;
      //console.log(document.documentElement.clientWidth)
      if (xyStatus !== null) {

        if (xyStatus === 2 && isStickyHeaderEnabled === true) {

        } else if (xyStatus === 1 && isStickyHeaderEnabled === false) {

        } else {
          singleColumnScrolling2(xyStatus, xRect.width, {
            left: xRect.left,
            right: rRect.width - xRect.right
          });
        }

      }

      let tdt = Date.now();
      ito_dt = tdt;
      setTimeout(() => {
        if (ito_dt !== tdt) return;
        if (p !== wls.layoutStatus) singleColumnScrolling();
      }, 300)

    },
      {
        rootMargin: `0px 0px 0px 0px`,
        threshold: [0]
      })

    ito.observe(headerP)

  }

  function setupVideoTitleHover() {

    let h1 = document.querySelector('#below h1.ytd-watch-metadata yt-formatted-string');
    if (h1) {


      let s = '';

      try {
        if (formatDates && Object.keys(formatDates).length > 0) {

          function getDurationInfo(bd1, bd2) {

            let bdd = bd2 - bd1
            let hrs = Math.floor(bdd / 3600000)
            bdd = bdd - hrs * 3600000
            let mins = Math.round(bdd / 60000)
            let seconds = null
            if (mins < 10 && hrs === 0) {
              mins = Math.floor(bdd / 60000)
              bdd = bdd - mins * 60000
              seconds = Math.round(bdd / 1000)
              if (seconds === 0) seconds = null
            }

            return { hrs, mins, seconds }

          }

          const formatDateResult = getFormatDateResultFunc();

          if (formatDates.broadcastBeginAt && formatDates.isLiveNow === false) {

            let bd1 = new KDate(formatDates.broadcastBeginAt)
            let bd2 = formatDates.broadcastEndAt ? new KDate(formatDates.broadcastEndAt) : null

            let isSameDay = 0
            if (bd2 && bd1.toLocaleDateString() === bd2.toLocaleDateString()) {
              isSameDay = 1

            } else if (bd2 && +bd2 > +bd1 && bd2 - bd1 < 86400000) {

              if (bd1.getHours() >= 6 && bd2.getHours() < 6) {
                isSameDay = 2
              }

            }

            let durationInfo = getDurationInfo(bd1, bd2)
            if (isSameDay > 0) {

              bd2.dayBack = (isSameDay === 2)

              s = formatDateResult(0x200, { bd1, bd2, isSameDay, durationInfo, formatDates })

            } else if (bd2 && isSameDay === 0) {

              s = formatDateResult(0x210, { bd1, bd2, isSameDay, durationInfo, formatDates })

            }


          } else if (formatDates.broadcastBeginAt && formatDates.isLiveNow === true) {

            let bd1 = new KDate(formatDates.broadcastBeginAt)

            s = formatDateResult(0x300, { bd1, formatDates })

          } else {
            if (formatDates.uploadDate) {

              if (formatDates.publishDate && formatDates.publishDate !== formatDates.uploadDate) {

                s = formatDateResult(0x600, { formatDates })
              } else {
                s = formatDateResult(0x610, { formatDates })

              }
            } else if (!formatDates.uploadDate && formatDates.publishDate) {

              s = formatDateResult(0x700, { formatDates })


            }
          }


        }
      } catch (e) {
        s = '';
      }

      if (s) {
        h1.setAttribute('data-title-details', s)
      } else {
        h1.removeAttribute('data-title-details')
      }

    }

  }

  const skPlayListDataReassign = ControllerID();

  function checkPlaylistForInitialization() {
    // if the page url is with playlist; renderer event might not occur.

    // playlist already added to dom; this is to set the visibility event and change hidden status

    let m_playlist = document.querySelector(`#tab-list ytd-playlist-panel-renderer#playlist:not([o3r-${sa_playlist}])`)

    // once per {ytd-playlist-panel-renderer#playlist} detection

    // _console.log(3902, !!m_playlist)

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) { }
    else if (m_playlist) {

      if (mtoVisibility_Playlist.bindElement(m_playlist)) {
        mtoVisibility_Playlist.observer.check(9); // delay check required for browser bug - hidden changed not triggered 
      }
      let playlist_wr = mWeakRef(m_playlist);
      scriptletDeferred.debounce(() => {
        let m_playlist = kRef(playlist_wr);
        playlist_wr = null;
        if (m_playlist && m_playlist.isConnected === true) {
          sendToPageScript(m_playlist, "tabview-yt-data-reassign");
        }
        m_playlist = null;
      }, skPlayListDataReassign)
      m_playlist = null;

    }

    FP.mtf_attrPlaylist();

    Promise.resolve(0).then(() => {
      // ['tab-btn', 'tab-btn', 'tab-btn active', 'tab-btn tab-btn-hidden']
      // bug
      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;
      if (!switchTabActivity_lastTab && (ytdFlexyElm.getAttribute('tyt-tab') + '').indexOf('#tab-') === 0 && location.pathname === '/watch') {
        if (/[\?\&]list=[\w\-\_]+/.test(location.search)) {
          if (setToActiveTab('#tab-list')) switchTabActivity_lastTab = '#tab-list';
        } else if (/[\?\&]lc=[\w\-\_]+/.test(location.search)) {
          if (setToActiveTab('#tab-comments')) switchTabActivity_lastTab = '#tab-comments';
        }
      }
    })

    Promise.resolve(0).then(() => {
      mtf_fix_collapsible_playlist();
    });

  }


  const _pageBeingInit = function () {

    psId.inc(); // add one

    fetchCounts = {
      base: null,
      new: null,
      fetched: false,
      count: null
    }
    pageFetchedDataVideoId = null;
    chatroomDetails = null;
  }

  const pageBeingInit = function () {
    // trigger at pageSeq1/2: yt-navigate-start / yt-navigate-cache / yt-navigate-redirect / yt-page-data-fetched

    // call regardless pageType
    // run once on / before pageSeq2 (yt-page-data-fetched)

    const rootDom = document.documentElement;
    // rootDom.setAttribute('sxmq7', rootDom.getAttribute('sxmq7') === '1' ? '0' : '1');
    rootDom.setAttribute('sxmq8', rootDom.getAttribute('sxmq8') === '1' ? '0' : '1');
    rootDom.removeAttribute('pnzgu');

    console.log('sxmq8 r2', document.documentElement.getAttribute('sxmq8') );

    infoContentDS = 0;
    renderIdentifier.inc(); // add 1
    renderDeferred.reset(); // clear quene of pending renderDeferreds


    if (!scriptletDeferred.resolved && (firstLoadStatus & 2) === 2) {
      // insert on first pageBeingInit(), regardless pageType
      firstLoadStatus -= 2;
      script_inject_js1.inject();
    } else if (pageRendered === 2) { // (pageRendered = 2 after pageSeq2)
      // reset on 2nd+ pageBeingInit(), regardless pageType
      pageRendered = 0;
      let elmPL = document.querySelector('tabview-view-ploader');
      if (elmPL) elmPL.remove();
      // tabview-view-ploader is appended in pageBeingFetched (pageSeq2: yt-page-data-fetched)
    }

    if (tabsDeferred.resolved) {
      comments_loader = 1;
      tabsDeferred.reset(); // tabsDeferred.resolve() again in yt-navigate-finish[page=watch]
      if ((firstLoadStatus & 8) === 0) {
        innerDOMCommentsCountLoader(false); //ensure the previous record is saved
        // no need to cache to the rendering state
        _pageBeingInit();
      }
      // _console.log('pageBeingInit', firstLoadStatus)
    }

  };

  function getFinalComments() {

    comments_loader = 0;

    let ei = 0;

    function execute() {
      //sync -> animateLoadDeferred.resolved always true

      if (!renderDeferred.resolved) return;

      // _console.log(2323)

      if (Q.comments_section_loaded !== 0) return;
      if (fetchCounts.fetched) return;


      let ret = innerDOMCommentsCountLoader(true);

      if (fetchCounts.new && !fetchCounts.fetched) {
        if (fetchCounts.new.f()) {
          fetchCounts.fetched = true;
          fetchCommentsFinished();
          // _console.log(9972, 'fetched = true')
        }
        return;
      }


      ei++;

      if (fetchCounts.base && !fetchCounts.new && !fetchCounts.fetched && fetchCounts.count === 1) {


        let elm = kRef(fetchCounts.base.elm);
        let txt = elm ? getCountHText(elm) : null;
        let condi1 = ei > 7;
        let condi2 = txt === m_last_count;
        if (condi1 || condi2) {

          if (fetchCounts.base.f()) {
            fetchCounts.fetched = true;
            fetchCommentsFinished();
            // _console.log(9972, 'fetched = true')
          }

        }

      }

      if (!fetchCounts.fetched) {
        if (ei > 7) {
          let elm = ret.length === 1 ? kRef(ret[0].elm) : null;
          let txt = elm ? getCountHText(elm) : null;
          if (elm && txt !== m_last_count) {
            fetchCounts.base = null;
            fetchCounts.new = ret[0];
            fetchCounts.new.f();
            fetchCounts.fetched = true;
            // _console.log(9979, 'fetched = true')
            fetchCommentsFinished();
          }
          return;
        }
        return true;
      }

    }


    async function alCheckFn(ks) {

      let alCheckInterval = 420;

      for (let alCheckCount = 9; --alCheckCount > 0;) {

        if (renderIdentifier.valueOf() !== ks) break;
        if (execute() !== true) break;

        await new Promise(r => setTimeout(r, alCheckInterval));

      }

    }

    let ks = renderIdentifier.valueOf();
    renderDeferred.debounce(() => {
      if (ks !== renderIdentifier.valueOf()) return
      if (mvideoState & 32) return;
      mvideoState |= 32;
      alCheckFn(ks);

    });


  }

  const { removeDuplicateInfoFn, setHiddenStateForDesc } = (() => {

    let g_check_detail_A = 0;
    function setHiddenStateForDesc() {
      let ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return;
      let hiddenBool = !document.fullscreenElement ? ytdFlexyElm.classList.contains('tabview-info-duplicated') : false;
      let elm;
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-text-inline-expander#description-inline-expander.ytd-watch-metadata #plain-snippet-text');
      if (elm) {
        wAttr(elm, 'hidden', hiddenBool);
      }
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-text-inline-expander#description-inline-expander.ytd-watch-metadata #formatted-snippet-text');
      if (elm) {
        wAttr(elm, 'hidden', hiddenBool);
      }
    }
    function checkDuplicatedInfo_then() {

      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return; //unlikely

      let cssbool_c1 = false, cssbool_c2 = false;

      if (ytdFlexyElm.matches('.tabview-info-duplicated[flexy]')) {
        cssbool_c1 = !!_querySelector.call(ytdFlexyElm, '#description.style-scope.ytd-watch-metadata > #description-inner:only-child');
        cssbool_c2 = !!_querySelector.call(ytdFlexyElm, '#tab-info ytd-expander #description.ytd-video-secondary-info-renderer');
      }

      setHiddenStateForDesc();

      ytdFlexyElm.setAttribute('tyt-has', `${cssbool_c1 ? 'A' : 'a'}${cssbool_c2 ? 'B' : 'b'}`);

    }

    async function contentPairSet(firstElement, secondElement) {

      // const firstElementSelector = "ytd-text-inline-expander#description-inline-expander";
      // const secondElementSelector = "#tab-info ytd-expander #description";

      // const firstElement = document.querySelector(firstElementSelector);
      // const secondElement = document.querySelector(secondElementSelector);
      if (firstElement && secondElement) {

        // checked that e1 e2 shall be considered with matching pair
        firstElement.setAttribute('tyt-du744', '');
        secondElement.setAttribute('tyt-du744', '');
      }

    }

    async function _checkDuplicatedInfoAug2023(_firstElement, _secondElement, spk) {
      /** @type {HTMLElement} */
      const firstElement = _firstElement;
      /** @type {HTMLElement} */
      const secondElement = _secondElement;

      // dont detect the content change of main info box
      // if second info box is checked okay before, skip
      if (firstElement.hasAttribute('tyt-du744') || secondElement.hasAttribute('tyt-du744')) return true; // assume still ok as we checked before

      if (!firstElement || !secondElement) return false;
      if (firstElement.hasAttribute('hidden') || secondElement.hasAttribute('hidden')) return false;

      const isCryptoRandomUUIDAvailable = typeof crypto === 'object' && typeof crypto.randomUUID === 'function' ? `${crypto.randomUUID()}` : '';
      const isReplaceAllAvailable = typeof String.prototype.replaceAll === 'function';
      const doNameReplace = isCryptoRandomUUIDAvailable && isReplaceAllAvailable;

      let nameText = doNameReplace ? (sessionStorage.getItem('js-yt-usernames') || '') : '';

      {
        const ownerEndpoints = document.querySelectorAll('#owner a.yt-simple-endpoint[href]');
        let handle = null;
        let displayName = null;
        for (const anchor of ownerEndpoints) {
          if (displayName === null && anchor.firstElementChild === null && (anchor.textContent || "").length > 0) {
            displayName = anchor.textContent
          }
          let m;
          if (handle === null && (m = /\/(\@[-_a-zA-Z0-9.]{3,30})(\/|$)/.exec(anchor.getAttribute('href')))) {
            handle = m[1];
          }
        }

        if (handle !== null && displayName !== null) {
          if (nameText.indexOf(`\n${handle}\t`) < 0 && `${nameText}\n`.indexOf(`\t${displayName}\n`) < 0) {
            nameText = `\n${handle}\t${displayName}\n${nameText}`.trim();
          }
        }
      }

      const replaceArr = [];

      let rid;
      if (nameText) {
        do {
          rid = crypto.randomUUID();
        } while (nameText.includes(rid));
        let nni = 0;
        const nameMap = new Map();
        for (const nameTextS of nameText.split('\n')) {
          if (nameTextS.length < 4) continue;
          const nameTextA = nameTextS.split('\t');
          const m = nameTextA[1].replaceAll(' ', '');
          let t = nameMap.get(m);
          if (!t) {
            t = ++nni;
            nameMap.set(m, t);
          }
          replaceArr.push([nameTextA[0], t]);
          replaceArr.push([m, t]);
        }
        nameMap.clear();
        if (replaceArr.length > 1) replaceArr.sort((a, b) => b[0].length - a[0].length);
      }

      const fixNameConversion = doNameReplace && rid && replaceArr.length > 0
        ? (text) => {
          if (typeof text === 'string') {
            text = text.replaceAll(' ', '');
            for (const s of replaceArr) {
              const w = `[[${rid}::${s[1]}]]`;
              text = text.replaceAll(s[0], w);
            }
          }
          return text;
        }
        : (text) => text;

      const hiddenTexts = new Map();

      const hiddenTextReplacement = (element) => {

        for (const hiddenElement of _querySelectorAll.call(element, '[hidden]')) {

          const walker = document.createTreeWalker(hiddenElement, NodeFilter.SHOW_TEXT, null, null);
          let node;
          while (node = walker.nextNode()) {
            const text = node.nodeValue;
            if (text && !text.startsWith('\uF204')) {
              hiddenTexts.set(node, text);
              node.nodeValue = `\uF204${text.replace(/[\uF204\uF205]/g, '')}\uF205`;
            }
          }

        }

      }


      const addContent = (currentNode, contentArray) => {

        if (currentNode instanceof HTMLElement) {
          hiddenTextReplacement(currentNode);
        }

        /** @type {string} */
        let trText = currentNode.textContent.trim();
        let withText = trText.length > 0;
        if (withText && trText.includes('\uF204')) {
          trText = trText.replace(/\uF204[^\uF204\uF205]+\uF205/g, '');
          trText = trText.replace(/[\uF204\uF205]/g, '');
          withText = trText.length > 0;
        }
        if (withText) {
          trText = trText.replace(/\n[\n\x20]+\n/g, '\n\n');
          trText = trText.replace(/[\u0020\u00A0\u16A0\u180E\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
          trText = trText.replace(/[\u200b\uFEFF]/g, '');
          let loop = 64;
          while (loop-- > 0) {
            const before = trText;
            trText = trText.replace(/([\u1000-\uDF77])\x20([\x21-\x7E])/g, '$1$2'); // 中英文之间加空白 ?
            trText = trText.replace(/([\x21-\x7E])\x20([\u1000-\uDF77])/g, '$1$2'); // 中英文之间加空白 ?
            if (before === trText) loop = 0;
          }
          // "白州大根\n    \n      チャンネル登録者数 698人\n    \n  \n\n\n  動画\n  \n\n\n  \n  \n概要"
          // "白州大根\n    \n      チャンネル登録者数 698人\n    \n  \n\n\n  動画\n  \n  \n概要"
          trText = fixNameConversion(trText);
          trText = trText.replace(/[,，.。、]/g, ' ');
          trText = trText.replace(/[#＃]/g, '#');
          trText = trText.replace(/[*＊]/g, '*');
          trText = trText.replace(/[「」『』”’＜＞"'<>\[\]\{\}]/g, '"');
          trText = trText.replace(/[:：]/g, ':');
          trText = trText.replace(/\s+/g, ' ');
          // trText = trText.replace(/[1234567890１２３４５６７８９０]/g, '0');
          trText = trText.trim();
          if (trText) contentArray.push(trText);
        }
      }

      const filterNode = (currentNode) => {


        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          if (currentNode.nodeName === "STYLE") {
            // <style is-scoped>
            return false;
          }
          if (currentNode.getAttribute('role') === 'button') { // .role is not working in Firefox
            // tp-yt-paper-button#expand-sizer
            // currentNode.matches('#collapse[role="button"]:not([hidden])')

            return false;
          }
          if (currentNode.hasAttribute("hidden")) {

            return false;
          }
          if (currentNode.id === "snippet") {
            let allHidden = true;
            for (let child = nodeFirstChild(currentNode); child; child = nodeNextSibling(child)) {
              if (filterNode(child) === false) continue;
              if (child.textContent.trim().length === 0) continue;
              allHidden = false;
              break;
            }
            if (allHidden) {
              return false;
            }
          }

        } else if (currentNode.nodeType === Node.TEXT_NODE) {
        } else {
          return false;
        }

        return true;
      }


      const getTextContentArr = async (element, contentArray = []) => {

        try {

          await Promise.resolve();

          for (let currentNode = nodeFirstChild(element); currentNode; currentNode = nodeNextSibling(currentNode)) {

            if (filterNode(currentNode) === false) continue;

            if (currentNode instanceof HTMLElement && currentNode.firstElementChild && !currentNode.nodeName.includes("-")) {
              await getTextContentArr(currentNode, contentArray);
            } else {
              addContent(currentNode, contentArray);
            }

            await Promise.resolve();
          }

        } catch (e) {
          console.log(e)
        }

        // if (spk) return [contentArray.join(' ').replace(/\s+/g, ' ').trim()];
        return contentArray;
      };

      hiddenTexts.clear();
      const [firstElementTextArr, secondElementTextArr] = await Promise.all([getTextContentArr(firstElement), getTextContentArr(secondElement)]);
      hiddenTexts.forEach((t, text) => {
        if ((text.nodeValue || '') === `\uF204${t.replace(/[\uF204\uF205]/g, '')}\uF205`) text.nodeValue = t;
      });
      hiddenTexts.clear();

      if (typeof GM === 'undefined') {

        console.log(7191, firstElementTextArr)
        console.log(7192, secondElementTextArr)

        if (firstElementTextArr.length === secondElementTextArr.length) {

          let n = firstElementTextArr.length;
          const texts = [];
          for (let j = 0; j < n; j++) {
            let text1 = firstElementTextArr[j];
            let text2 = secondElementTextArr[j];
            let s1 = text1.split(/([\w\-]+)/)
            let s2 = text2.split(/([\w\-]+)/)
            let kn = Math.min(s1.length, s2.length);
            let p = -1;
            for (let k = 0; k < kn; k++) {
              if (s1[k] !== s2[k]) break
              p = k;
            }
            if (p >= 0) {
              text1 = s1.slice(p + 1).join('');
              text2 = s2.slice(p + 1).join('');
            }
            texts.push([text1, text2])
          }
          console.log(7194, texts)

        }

      }

      /**
       @param {any[]} arr1 
       @param {any[]} arr2 */
      function isSubset(arr1, arr2) {
        const set = new Set(arr2);
        const r = arr1.every(item => set.has(item));
        set.clear();
        return r;
      }

      // console.log(828, window.dbx1 = firstElementTextArr, window.dbx2 = secondElementTextArr);

      // document.documentElement.setAttribute('firstElementTextArr', JSON.stringify(firstElementTextArr))
      // document.documentElement.setAttribute('secondElementTextArr', JSON.stringify(secondElementTextArr))
      // window.dbx1 = JSON.parse(document.documentElement.getAttribute('firstElementTextArr'))
      // window.dbx2 = JSON.parse(document.documentElement.getAttribute('secondElementTextArr'))
      const result = isSubset(firstElementTextArr, secondElementTextArr);

      if (result) {

        contentPairSet(firstElement, secondElement);

      }

      return result;
    }
    async function checkDuplicatedInfoAug2023(targetDuplicatedInfoPanel) {
      // ytd-text-inline-expander#description-inline-expander:not([hidden])
      const firstElementSelector = "ytd-text-inline-expander#description-inline-expander"; // ytd-text-inline-expander#description-inline-expander.ytd-watch-metadata
      const secondElementSelector = "#tab-info ytd-expander #description";

      const firstElement = targetDuplicatedInfoPanel || document.querySelector(firstElementSelector);
      const secondElement = document.querySelector(secondElementSelector);

      if (!firstElement || !secondElement) return false;

      return await _checkDuplicatedInfoAug2023(firstElement, (secondElement.closest('ytd-expander') || secondElement), false);
    }
    // document.addEventListener('dbx', ()=>{
    //   console.log(window.dbx1)
    //   console.log(window.dbx2)
    // }, true);

    async function checkDuplicatedInfo() {

      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return; //unlikely

      const targetDuplicatedInfoPanels = [...document.querySelectorAll('ytd-text-inline-expander#description-inline-expander:not([hidden])')].filter((e) => {

        // playlist WL page -> video -> buggy
        // 0: ytd-text-inline-expander#description-inline-expander.style-scope.ytd-playlist-header-renderer
        // 1: ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata

        return !closestDOM.call(e, '[hidden]');
      });
      if (targetDuplicatedInfoPanels.length !== 1) return;
      const targetDuplicatedInfoPanel = targetDuplicatedInfoPanels[0];

      let t = Date.now();
      g_check_detail_A = t;

      ytdFlexyElm.classList.toggle('tabview-info-duplicated', true) // hide first;
      let infoDuplicated = false;

      try {
        await getDMPromise(); // mcrcr might be not yet initalized

        if (g_check_detail_A !== t) return;

        let clicked = false;
        let promise = null;
        await Promise.all([..._querySelectorAll.call(targetDuplicatedInfoPanel, '#expand[role="button"]:not([hidden])')].map(button => {
          return Promise.resolve().then(() => {
            promise = promise || new Promise(resolve => {
              let mo = new MutationObserver(() => {
                mo.disconnect();
                mo = null;
                resolve();
              });
              mo.observe(targetDuplicatedInfoPanel, { subtree: true, childList: true })
            });
            button.click();
            clicked = true;
          });
        }));
        if (promise) await promise.then();
        if (typeof IntersectionObserver !== 'undefined') {
          await new Promise(resolve => {
            let io = new IntersectionObserver(() => {
              io.disconnect();
              io = null;
              resolve();
            });
            io.observe(targetDuplicatedInfoPanel);
          });
        }

        await Promise.resolve(0);

        infoDuplicated = await checkDuplicatedInfoAug2023(targetDuplicatedInfoPanel);

        if (infoDuplicated === false && clicked) {

          await Promise.all([..._querySelectorAll.call(targetDuplicatedInfoPanel, '#collapse[role="button"]:not([hidden])')].map(button => {
            return Promise.resolve().then(() => {
              button.click();
            });
          }));

        }

      } catch (e) {

        ytdFlexyElm.classList.toggle('tabview-info-duplicated', false) // error => unhide
      }

      console.debug('[tyt] Have any details with duplicated information been found?', (infoDuplicated ? 'Yes' : 'No'));

      if (g_check_detail_A !== t) return;

      return { ok: 1, infoDuplicated }; // other than 5, duplicated check = false

    };

    const removeDuplicateInfoFn = (b) => {

      async function alCheckFn(ks) {

        let alCheckInterval = 270;

        let descExpandState = null;
        const descToggleBtnSelector = '#collapse[role="button"]:not([hidden]), #expand[role="button"]:not([hidden])';
        const descMetaExpander = closestDOMX(document.querySelector('ytd-watch-metadata ytd-text-inline-expander#description-inline-expander'), 'ytd-watch-metadata');
        const descMetaLines = querySelectorFromAnchorX(descMetaExpander, 'ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata'); // ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata
        const descToggleBtnA = querySelectorFromAnchorX(descMetaLines, descToggleBtnSelector);

        if (descToggleBtnA) {
          if (descMetaExpander.hasAttribute('description-collapsed') && descToggleBtnA.id === 'expand') {
            descExpandState = false;
          } else if (!descMetaExpander.hasAttribute('description-collapsed') && descToggleBtnA.id === 'collapse') {
            descExpandState = true;
          }
        }
        if (descMetaExpander) {
          descMetaExpander.classList.add('tyt-tmp-hide-metainfo');
        }

        try {

          for (let alCheckCount = 2; alCheckCount-- > 0;) {
            // await removeOldExpanders();
            // await removeContentMismatch();
            await getRAFPromise().then();

            if (renderIdentifier.valueOf() !== ks) break;

            const res = await checkDuplicatedInfo(); //async

            if (res && res.ok) {
              const infoDuplicated = res.infoDuplicated;
              const isFinalResult = infoDuplicated || alCheckCount === 0;
              if (isFinalResult) {
                const ytdFlexyElm = es.ytdFlexy;
                if (ytdFlexyElm) {
                  ytdFlexyElm.classList.toggle('tabview-info-duplicated', infoDuplicated)
                  ytdFlexyElm.classList.toggle('tabview-info-duplicated-checked', true)
                  checkDuplicatedInfo_then();
                  sendToPageScript(document, 'tabview-fix-info-box-tooltip');
                }
                break;
              }
            }

            await new Promise(r => setTimeout(r, alCheckInterval));

          }

          await Promise.resolve(0);

          const descToggleBtnB = typeof descExpandState === 'boolean' ? querySelectorFromAnchorX(descMetaLines, descToggleBtnSelector) : null;
          if (descToggleBtnB) {

            const isCollapsed = descMetaExpander.hasAttribute('description-collapsed');
            const id = descToggleBtnB.id;
            const b = descExpandState ? (isCollapsed && id === 'expand') : (!isCollapsed && id === 'collapse');

            if (b) {
              descToggleBtnB.click();
            }

          }

        } catch (e) {

          console.warn(e)

        }

        if (descMetaExpander) {
          descMetaExpander.classList.remove('tyt-tmp-hide-metainfo');

          await Promise.resolve(0)

          const detailsIntersectioner = _querySelector.call(descMetaExpander, '#info-container.style-scope.ytd-watch-metadata') || _querySelector.call(descMetaExpander, '#ytd-watch-info-text.style-scope.ytd-watch-metadata') || null;
          if (detailsIntersectioner) {
            Promise.resolve(detailsIntersectioner).then(dom => {
              if (dom) mtoObservationDetails.bindElement(dom);
            })
          }

        }

      }
      let ks = renderIdentifier.valueOf();
      renderDeferred.debounce(() => {
        if (ks !== renderIdentifier.valueOf()) return
        if (document.fullscreenElement) return;
        if (!b) {
          if (mvideoState & 1) return;
          mvideoState |= 1;
        }
        alCheckFn(ks);

      });
    }

    return { removeDuplicateInfoFn, setHiddenStateForDesc };

  })();

  let udm = 0;
  async function deferredDuplicatedMetaCheckerFn(b) {

    udm = 0;
    await scriptletDeferred.d();
    if (REMOVE_DUPLICATE_META_RECOMMENDATION) {
      checkDuplicatedMetaRecommendation();
    }
    waitForContentReady = new PromiseExternal();
    isContentDuplicationCheckAllow() ? waitForContentReady.resolve() : (await waitForContentReady.then());
    await removeContentMismatch(); // play safe
    removeDuplicateInfoFn(b);
    udm = 1;
  }

  function addVisibilityCheckToChatroom(liveChatFrame) {

    // every per [new] {ytd-live-chat-frame#chat} detection - reset after mini-playview

    if (!(liveChatFrame instanceof Element)) return;

    const ytdFlexyElm = es.ytdFlexy;
    if (scriptEnable && ytdFlexyElm && mtoVisibility_Chatroom.bindElement(liveChatFrame)) {
      mtoVisibility_Chatroom.observer.check(9)
    }

  }

  // setupChatFrameDOM (v1) - removed in 2023.07.06 since it is buggy for page changing. subject to further review
  function setupChatFrameDOM(node) {
    // this function calls 3 times per each new video page

    // 'tyt-chat' is initialized in setupChatFrameDisplayState1()

    const liveChatFrame = node || document.querySelector('ytd-live-chat-frame#chat');
    if (!liveChatFrame) return;
    addVisibilityCheckToChatroom(liveChatFrame);

    // there can be liveChatFrame but without chatroomDetails if Chat is disabled.
    // eg https://www.youtube.com/watch?v=f8tIZpZ3hG0

    if (!chatroomDetails) return;

    // every per [new] {ytd-live-chat-frame#chat} detection - reset after mini-playview

    setToggleBtnTxt(); // immediate update when page changed

    if (node !== null) {
      // button might not yet be rendered
      getRAFPromise().then(setToggleBtnTxt); // bool = true must be front page
    } else {

      // this is due to page change
      layoutStatusMutex.lockWith(unlock => {
        if (!document.fullscreenElement) fixTheaterChat1A();
        getDMPromise().then(unlock);
      });

    }

  }

  function whenEngagemenetPanelVisible() {

    const layoutStatus = wls.layoutStatus;
    if ((layoutStatus & (LAYOUT_TWO_COLUMNS | LAYOUT_THEATER)) === LAYOUT_TWO_COLUMNS) {

      if (layoutStatus & LAYOUT_TAB_EXPANDED) {
        switchTabActivity(null);
        return true;
      } else if (layoutStatus & LAYOUT_CHATROOM_EXPANDED) {
        ytBtnCollapseChat();
        return true;
      }

    }

    return false;

  }


  function removeFocusOnLeave(evt) {
    let node = (evt || 0).target || 0
    let activeElement = document.activeElement || 0
    if (node.nodeType === 1 && activeElement.nodeType === 1) {
      Promise.resolve().then(() => {
        if (node.contains(activeElement)) {
          activeElement.blur();
        }
      })
    }
  }

  async function setupMedia(node) {
    // this can be fired even in background without tabs rendered
    const attrKey = 'gM7Cp'
    let media = _querySelector.call(node, `#movie_player video[src]:not([${attrKey}])`);
    media = media || _querySelector.call(node, `#movie_player audio.video-stream.html5-main-video[src]:not([${attrKey}])`);
    if (media) {
      media.setAttribute(attrKey, '')

      media.addEventListener('timeupdate', (evt) => {
        energizedByMediaTimeUpdate();
      }, bubblePassive);

      media.addEventListener('ended', (evt) => {
        // scrollIntoView => auto start next video
        // otherwise it cannot auto paly next
        if (pageType === 'watch') {
          let elm = evt.target;
          Promise.resolve(elm).then((elm) => {
            if (pageType === 'watch') {
              let scrollElm = closestDOM.call(elm, '#player') || closestDOM.call(elm, '#ytd-player') || elm;
              // background applicable
              scrollElm.scrollIntoView(false);
              scrollElm = null
            }
            elm = null
          });
        }

      }, bubblePassive)

    }
  }


  globalHook('yt-player-updated', (evt) => {

    const node = ((evt || 0).target) || 0

    if (node.nodeType !== 1) return;

    const nodeName = node.nodeName.toUpperCase();

    // _console.log(evt.target.nodeName, 904, evt.type);

    if (nodeName !== 'YTD-PLAYER') return

    setupMedia(node)

    discardableFn(() => {  // might discarded since it runs earlier than tabs insertion

      if (!scriptEnable) return

      checkAndMakeNewCommentFetch();
      pageCheck();

      domInit_comments();
      setupChatFrameDOM(null);

    });


  });

  const appendExpander = () => {
    
    console.log('d950')

    const rid = `${renderIdentifier.valueOf()}`; // string type integer id

    const targets = document.querySelectorAll(`[bsptu="${rid}"]`); // ignore all appearance in previous paging

    console.log('d951', targets.length)
    if (!targets.length) return;
    for (const target of targets) {
      // expect only one node; other measures for more than one node

      const nodeName = target.nodeName.toLowerCase();

      let dummy = nodeName === 'yt-dummy-532' ? target : null;
      let expander0 = dummy ? elementMapper.get(dummy) : null;
      if (expander0 && closestDOM.call(expander0, '#tab-info')) continue;
      console.log('d952', target)
      const expander = expander0 || (nodeName === 'ytd-expander' ? target : null);
      if (expander) {

        let qt = 0;

        // once per $$native-info-description$$ {#meta-contents ytd-expander} detection
        // append the detailed meta contents to the tab-info

        const tabInfo = document.querySelector("#tab-info");
        if (tabInfo) {
          qt = 1;

          if (!expander.hasAttribute('tyt-info-expander-content')) {
            qt = 2;
            expander.setAttribute('tyt-info-expander-content', '');
            const dmy = document.createElement('yt-dummy-532'); // to detemine the content change by youtube engine
            dmy.setAttribute('tyt-info-expander-placeholder', '');
            expander.replaceWith(dmy);
            elementMapper.set(expander, dmy); // interlink
            elementMapper.set(dmy, expander); // interlink

            const parentRoot = closestDOM.call(dmy, '[hidden]'); // only detect if the traditional block is hidden
            if (parentRoot) {
              qt = 3;
              moInfoContent.observe(parentRoot.parentNode, { subtree: true, childList: true });
            }

          }
          elementAppend.call(tabInfo, expander);
        }
        




        removeContentMismatch();
        console.log('d953', qt)


      }


    }
  }

  let infoContentDS = 0;


  const infoContentForTab = () => {
    console.log('d945', infoContentDS)

    if (mvideoState & 2) return;
    mvideoState |= 2;
    console.log('d946', infoContentDS)
    document.documentElement.removeAttribute('pnzgu'); // just in case
    appendExpander();
    if (REMOVE_DUPLICATE_META_RECOMMENDATION) checkDuplicatedMetaRecommendation();

    mtf_fix_details().then(() => {
      setToggleInfo();
      renderDeferred.debounce(() => {
        if (mvideoState & 8) return;
        mvideoState |= 8;
        setTimeout(() => {
          //dispatchWindowResize(); //try to omit
          dispatchWindowResize(); //add once for safe
          manualResizeT();
        }, 420)
      }, renderIdentifier)


      let secondary = document.querySelector('#columns.ytd-watch-flexy #secondary.ytd-watch-flexy');

      let columns = closestDOMX(secondary, '#columns.ytd-watch-flexy');

      setupHoverSlider(secondary, columns)

      let tabInfo = document.querySelector('#tab-info');
      addTabExpander(tabInfo);

      let tabComments = document.querySelector('#tab-comments');
      addTabExpander(tabComments);


      document.documentElement.setAttribute('pnzgu', '');

    }).catch(console.warn);



  }


  function tabviewControllerFn(controllerId, val) {
    val = +val;
    if (val > -1 && val >= 0) {
      if (controllerId === 'tabviewTabsHideController') {
        hiddenTabsByUserCSS = val;

        let btn;
        btn = document.querySelector('[tyt-tab-content="#tab-info"]')
        if (btn) btn.classList.toggle('tab-btn-hidden', ((hiddenTabsByUserCSS & 1) === 1));

        btn = document.querySelector('[tyt-tab-content="#tab-comments"]')
        if (btn) {
          if ((hiddenTabsByUserCSS & 2) === 2) {
            btn.classList.toggle('tab-btn-hidden', true);
          } else {
            btn.classList.toggle('tab-btn-hidden', isCommentsTabBtnHidden);
          }
        }
        btn = document.querySelector('[tyt-tab-content="#tab-videos"]');
        if (btn) btn.classList.toggle('tab-btn-hidden', ((hiddenTabsByUserCSS & 4) === 4));

        let activeHiddenBtn = document.querySelector('[tyt-tab-content^="#"].active.tab-btn-hidden');
        if (activeHiddenBtn) {
          setToActiveTab();
        }

      } else if (controllerId === 'tabviewDefaultTabController') {
        defaultTabByUserCSS = val;
        if (setupDefaultTabBtnSetting) setupDefaultTabBtnSetting();
      }
    }
  }


  /** @type {Map<string, Function>} */
  let handleDOMAppearFN = new Map();
  function handleDOMAppear( /** @type {string} */ fn, /** @type { listener: (this: Document, ev: AnimationEvent ) => any } */ func) {
    if (handleDOMAppearFN.size === 0) {
      document.addEventListener('animationstart', (evt) => {
        const animationName = evt.animationName;
        if (!animationName) return;
        let idx = -1;
        let func = handleDOMAppearFN.get(animationName);
        if (func) func(evt);
        else {
          let idx = animationName.indexOf('Controller-');
          if (idx > 0) {
            let j = idx + 'Controller'.length;
            tabviewControllerFn(animationName.substring(0, j), animationName.substring(j + 1));
          }
        }
      }, capturePassive)
    } else {
      if (handleDOMAppearFN.has(fn)) return;
    }
    handleDOMAppearFN.set(fn, func);
  }





  const moInfoContent = new MutationObserver(() => {

    removeContentMismatch();
  });

  function ytMicroEventsInit() {

    // _console.log(902);

    handleDOMAppear('videosDOMAppended', function (evt) {
      videosDeferred.resolve();
    })

    handleDOMAppear('liveChatFrameDOMAppended', (evt) => {
      // $$ html[tyt-deferred] ytd-live-chat-frame#chat $$

      let node = evt.target;
      if (node) setupChatFrameDOM(node); // front page

    });

    const skIdPageRenderedEventDispatch = ControllerID();

    handleDOMAppear('pageLoaderAnimation', (evt) => {

      pageRendered = 2;
      renderDeferred.resolve();
      console.debug('[tyt] pageRendered');

      scriptletDeferred.debounce(() => {
        // document.dispatchEvent(new CustomEvent('tabview-page-rendered'));
        getDMPromise().then(() => {
          document.dispatchEvent(new CustomEvent("yt-watch-comments-ready")); // immediately render comments when tab is switched from background
        });
      }, skIdPageRenderedEventDispatch);

    });



    const metaContentSetup = () => {
      console.log('d943', infoContentDS)
      setupVideoTitleHover();
      let ks = renderIdentifier.valueOf();
      scriptletDeferred.debounce(() => {
        console.log('d944', infoContentDS)
        if (ks === renderIdentifier.valueOf()) infoContentForTab();
      });
    };

    const wmId1 = ControllerID();
    const wmHandler1 = (evt) => {
      renderDeferred.debounce(() => {
        infoContentDS |= 1;
        setTimeout(() => {
          if (infoContentDS === 3) {
            infoContentDS |= 4;
            Promise.resolve().then(metaContentSetup);
          }
        }, 8)
      }, wmId1);
    }
    handleDOMAppear('watchMetaFrameReady1', wmHandler1);
    handleDOMAppear('watchMetaFrameReady2', wmHandler1);

    const wmId2 = ControllerID();
    const wmHandler2 = (evt) => {
      // sxmq8
      const target = evt.target;
      renderDeferred.debounce(() => {
        infoContentDS |= 2;
        target.isConnected && target.setAttribute('bsptu', renderIdentifier.valueOf());
        setTimeout(() => {
          if (infoContentDS === 3) {
            infoContentDS |= 4;
            Promise.resolve().then(metaContentSetup);
          }
        }, 8)
      }, wmId2);
    }
    handleDOMAppear('watchMetaContentReady1', wmHandler2);
    handleDOMAppear('watchMetaContentReady2', wmHandler2);

    handleDOMAppear('fixInvisibleInfoBug', (evt) => evt.target.removeAttribute('hidden'));


    handleDOMAppear('commentsHeaderAppended1', onCommentsReady);
    handleDOMAppear('commentsHeaderAppended2', onCommentsReady);

    handleDOMAppear('fixPlaylistLocation1', (evt) => { // used as a fallback to play safe. overall strategy to be reviewed

      const n = evt.target;
      if (closestDOM.call(n, '#tab-list')) return;

      mtf_append_playlist(n); // the true playlist is appended to the #tab-list
      checkPlaylistForInitialization();

    });

    const onChatFrameToggleBtnAppended = (evt) => {
      // $$ html[tyt-deferred] ytd-live-chat-frame#chat>.ytd-live-chat-frame#show-hide-button $$
      // $$ except html[tyt-deferred] ytd-live-chat-frame#chat>.ytd-live-chat-frame#show-hide-button:first-child $$

      const button = evt.target;

      if (!button || button.nodeType !== 1) return;

      /** @type {HTMLElement | null} */
      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;

      prependTo(button, nodeParent(button));

    };

    handleDOMAppear('chatFrameToggleBtnAppended1', onChatFrameToggleBtnAppended);
    handleDOMAppear('chatFrameToggleBtnAppended2', onChatFrameToggleBtnAppended);


    handleDOMAppear('epDOMAppended', async (evt) => {
      try {
        let node = evt.target;

        let eps = document.querySelectorAll('ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])')

        if (eps && eps.length > 0) {

          if (eps.length > 1) {
            let p = 0;
            for (const ep of eps) {
              if (ep !== node) {
                ytBtnCloseEngagementPanel(ep)
                p++
              }
            }
            if (p > 0) {
              await Promise.resolve(0)
            }
          }

          FP.mtf_attrEngagementPanel(9, node);

          Promise.resolve().then(() => {

            mtoVisibility_EngagementPanel.bindElement(node, {
              attributes: true,
              attributeFilter: ['visibility'],
              attributeOldValue: true
            })

            node.removeEventListener('mouseleave', removeFocusOnLeave, false)
            node.addEventListener('mouseleave', removeFocusOnLeave, false)

          })

        }


      } catch (e) { }

    })

    handleDOMAppear('playlistRowDOMSelected', (evt) => {
      if (!evt) return;
      let target = evt.target;
      if (!target) return;
      let items = nodeParent(target);
      if (!items || items.id !== 'items') return;
      let m = /\/watch\?v=[^\&]+\&/.exec(location.href || '')
      if (!m) return;
      let s = m[0] + "";
      if (!s || s.length <= 10) return;
      let correctAnchor = _querySelector.call(items, `ytd-playlist-panel-video-renderer a[href*="${s}"]`);
      if (!correctAnchor || target.contains(correctAnchor)) return;
      let correctRow = closestDOM.call(correctAnchor, 'ytd-playlist-panel-video-renderer');
      if (!correctRow) return;
      target.removeAttribute('selected');
      correctRow.setAttribute('selected', '');
    });

    let _tabviewSiderAnimated = false;

    handleDOMAppear('tabviewSiderAnimation', (evt) => {
      if (!_tabviewSiderAnimated) {
        _tabviewSiderAnimated = true;
        dispatchCommentRowResize();
      }
    })

    handleDOMAppear('tabviewSiderAnimationNone', (evt) => {
      if (_tabviewSiderAnimated) {
        _tabviewSiderAnimated = false;
        dispatchCommentRowResize();
      }
    })

    handleDOMAppear('SearchWhileWatchAutocomplete', (evt) => { // Youtube - Search While Watching Video
      let elm = evt.target;
      if (elm.hasAttribute('tyt-found')) return;
      elm.setAttribute('tyt-found', '');
      let container = document.createElement('div');
      container.id = 'suggestions-search-container';
      elm.replaceWith(container);
      container.appendChild(elm);
      elm.addEventListener('tyt-autocomplete-sc-exist', handlerAutoCompleteExist, false);
      scriptletDeferred.debounce(() => {
        elm.isConnected && sendToPageScript(elm, 'tabview-fix-autocomplete');
        elm = null;
      });
    })

    handleDOMAppear('rydTooltipAppear', (evt) => {
      document.documentElement.classList.add('return-youtube-dislike');
    })

    handleDOMAppear('oldYtIconPinAppeared', (evt) => {
      /* added in May 2023 - 2023.05.19 */

      /*
      from 
        <svg style="pointer-events: none; display: block; width: 100%; height: 100%;" focusable="false" width="24" viewBox="0 0 24 24" height="24"><path d="M16 11V3h1V2H7v1h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2zm1 3H7v-.59l1.71-1.71.29-.29V3h6v8.41l.29.29L17 13.41V14z"></path></svg> 

      to 
        <svg viewBox="0 0 12 12" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M8,2V1H3v1h1v3.8L3,7h2v2.5L5.5,10L6,9.5V7h2L7,5.8V2H8z M6,6H5V2h1V6z" class="style-scope yt-icon"></path></g></svg>

      */

      let svg = evt.target;
      let p = document.createElement('template');
      p.innerHTML = createHTML('<svg viewBox="0 0 12 12" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M8,2V1H3v1h1v3.8L3,7h2v2.5L5.5,10L6,9.5V7h2L7,5.8V2H8z M6,6H5V2h1V6z" class="style-scope yt-icon"></path></g></svg>');
      svg.replaceWith(p.content.firstChild);


    })


    globalHook('yt-rendererstamper-finished', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      // might occur before initialization

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      let node = evt.target;
      const nodeName = node.nodeName.toUpperCase();

      if (nodeName === 'YTD-PLAYLIST-PANEL-RENDERER' || nodeName === 'YTD-COMMENTS-HEADER-RENDERER') {

        discardableFn(() => {

          const n = node;
          node = null;

          if (nodeName === 'YTD-PLAYLIST-PANEL-RENDERER') {
            mtf_append_playlist(n); // the true playlist is appended to the #tab-list
            checkPlaylistForInitialization();
          } else if (nodeName === 'YTD-COMMENTS-HEADER-RENDERER') {
            if ((comments_loader & 3) === 3) getFinalComments();
          }

        });

      }



    });

    if (REMOVE_DUPLICATE_INFO) {

      handleDOMAppear('deferredDuplicatedMetaChecker', () => {
        deferredDuplicatedMetaCheckerFn();
      });

    }

    globalHook('yt-page-data-updated', (evt) => {

      if (REMOVE_DUPLICATE_INFO && udm) {

        if (location.pathname === '/watch') deferredDuplicatedMetaCheckerFn(1);
      }

      // if (!scriptEnable && tabsDeferred.resolved) { return }
      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      discardableFn(() => { // might discard if yt-navigate-finish not yet called

        // if the page is navigated by history back-and-forth, not all engagement panels can be catched in rendering event.

        if (!scriptEnable) return;

        checkAndMakeNewCommentFetch();
        pageCheck();
        setupChatFrameDOM(null);
        checkPlaylistForInitialization();

      });

    });



    async function onWatchCommentsReady(b) {
      await tabsInsertedPromise.then();
      await scriptletDeferred.d();
      checkAndMakeNewCommentFetch();

      if (b) {
        domInit_comments();
        _onCommentsReady();
      }

    }

    globalHook('yt-watch-comments-ready', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      const nodeName = evt.target.nodeName.toUpperCase()

      comments_loader = comments_loader | 2;

      onWatchCommentsReady(nodeName === 'YTD-WATCH-FLEXY');

    });

    function ytPageTypeChangedAsync(detail) {
      const { newPageType, oldPageType } = detail;
      if (newPageType && oldPageType) {
        let bool = false;
        if (newPageType == 'ytd-watch-flexy') {
          bool = true;
          pageType = 'watch';
        } else if (newPageType == 'ytd-browse') {
          pageType = 'browse';
        }
        document.documentElement.classList.toggle('tabview-normal-player', bool);
      }
    }
    window.addEventListener('message', (evt) => {
      if (!scriptEnable && tabsDeferred.resolved) { return }
      if (evt.origin === location.origin) {
        const data = evt.data.tabviewData || 0;
        if (data.eventType === "yt-page-type-changed") {
          Promise.resolve(data.eventDetail || {}).then(ytPageTypeChangedAsync);
        }
      }
    }, bubblePassive);

    let isTabviewFixPopupRefitCalled = false;

    globalHook('data-changed', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }

      let nodeName = (((evt || 0).target || 0).nodeName || '').toUpperCase()

      if (nodeName !== 'YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER') return;

      if (!isTabviewFixPopupRefitCalled) {
        isTabviewFixPopupRefitCalled = true;
        sendToPageScript(document, "tabview-fix-popup-refit");
      }


    });


    // DEBUG_LOG && globalHook('yt-rendererstamper-finished', (evt) => {

    //   if (!scriptEnable && tabsDeferred.resolved) { return }
    //   // might occur before initialization

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;

    //   const nodeName = evt.target.nodeName.toUpperCase();

    //   //  const S_GENERAL_RENDERERS = ['YTD-TOGGLE-BUTTON-RENDERER','YTD-MENU-RENDERER']
    //   if (S_GENERAL_RENDERERS.includes(nodeName)) {
    //     return;
    //   }

    //   // _console.log(evt.target.nodeName, 904, evt.type, evt.detail);

    // });

    // DEBUG_LOG && globalHook('data-changed', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;

    //   let nodeName = evt.target.nodeName.toUpperCase()
    //   // _console.log(nodeName, evt.type)

    //   if (nodeName === 'YTD-ITEM-SECTION-RENDERER' || nodeName === 'YTD-COMMENTS') {

    //     _console.log(344)

    //   }

    // })

    // DEBUG_LOG && globalHook('yt-navigate', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)

    // })

    // DEBUG_LOG && globalHook('ytd-playlist-lockup-now-playing-active', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-service-request-completed', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-commerce-action-done', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-execute-service-endpoint', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })


    // DEBUG_LOG && globalHook('yt-request-panel-mode-change', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })


    // DEBUG_LOG && globalHook('yt-visibility-refresh', (evt) => {

    //   if (!evt || !evt.target /*|| evt.target.nodeType !== 1*/) return;
    //   _console.log(evt.target.nodeName || '', evt.type)

    //   const ytdFlexyElm = es.ytdFlexy;
    //   _console.log(2784, evt.type, (ytdFlexyElm ? ytdFlexyElm.hasAttribute('hidden') : null), evt.detail)

    //   _console.log(evt.detail)


    // })

    // DEBUG_LOG && globalHook('yt-request-panel-mode-change', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('app-reset-layout', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })
    // DEBUG_LOG && globalHook('yt-guide-close', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })
    // DEBUG_LOG && globalHook('yt-page-data-will-change', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-retrieve-location', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-refit', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)

    // })

    // DEBUG_LOG && globalHook('addon-attached', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)

    // })

    // DEBUG_LOG && globalHook('yt-live-chat-context-menu-opened', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)

    // })

    // DEBUG_LOG && globalHook('yt-live-chat-context-menu-closed', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)

    // })

    // DEBUG_LOG && globalHook('yt-commentbox-resize', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)
    // })

    // DEBUG_LOG && globalHook('yt-rich-grid-layout-refreshed', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(2327, evt.target.nodeName, evt.type)
    // })

    // DEBUG_LOG && globalHook('animationend', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-dismissible-item-dismissed', (evt) => {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-dismissible-item-undismissed', function (evt) {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })


    // DEBUG_LOG && globalHook('yt-load-next-continuation', function (evt) {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })


    // DEBUG_LOG && globalHook('yt-load-reload-continuation', function (evt) {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })

    // DEBUG_LOG && globalHook('yt-toggle-button', function (evt) {

    //   if (!evt || !evt.target || evt.target.nodeType !== 1) return;
    //   _console.log(evt.target.nodeName, evt.type)


    // })


  }


  function chatFrameContentDocument() {
    // non-null if iframe exist && contentDocument && readyState = complete
    /** @type {HTMLIFrameElement | null} */
    let iframe = document.querySelector('ytd-live-chat-frame iframe#chatframe');
    if (!iframe) return null; //iframe must be there
    /** @type {Document | null} */
    let cDoc = null;
    try {
      cDoc = iframe.contentDocument;
    } catch (e) { }
    if (!cDoc) return null;
    if (cDoc.readyState != 'complete') return null; //we must wait for its completion

    return cDoc;

  }

  function chatFrameElement(/** @type {string} */ cssSelector) {
    let cDoc = chatFrameContentDocument();
    if (!cDoc) return null;
    /** @type {HTMLElement | null} */
    let elm = null;
    try {
      elm = cDoc.querySelector(cssSelector)
    } catch (e) {
      console.log('iframe error', e)
    }
    return elm;
  }

  const iframeLoadControllerId = ControllerID();
  let iframeLoadHookHandlerPromise = new PromiseExternal();
  const iframeLoadHookHandler = function (evt) {

    const target = (evt || 0).target;
    const iframe = target instanceof HTMLIFrameElement ? target : null;
    if (!iframe || iframe.id !== 'chatframe') return;

    iframePipeline(async () => {
      await iframeLoadHookHandlerPromise.then();
      if (iframe.matches('body iframe.style-scope.ytd-live-chat-frame#chatframe')) {
        await iframeLoadProcess(iframe);
      }
    })
  };

  document.addEventListener('load', iframeLoadHookHandler, capturePassive);

  // const onIframeSrcReplaced = function (evt) {
  //   const isIframe = (((evt || 0).target || 0).nodeName === 'IFRAME');
  //   const iframe = isIframe ? evt.target : null;
  //   if (!iframe || !iframe.matches('body iframe.style-scope.ytd-live-chat-frame#chatframe')) {
  //     return;
  //   }
  //   Promise.resolve(iframe).then(iframeLoadProcess); // in order to set ready
  // };

  let ix93 = 0;
  const iframeLoadStatusWM = new WeakMap;
  // fresh load [determine body empty state]
  const iframeLoadProcess = async function (_iframe) {

    const iframe = _iframe;

    if (ix93 > 1e9) ix93 = 9;
    const t93 = ++ix93;
    iframeLoadStatusWM.set(iframe, t93 * 2);

    await scriptletDeferred.d();
    // iframe.dispatchEvent(new CustomEvent('yt-live-chat-iframe-fix-polymer'));
    await tabsInsertedPromise.then();
    if (t93 !== ix93) return;
    await getRAFPromise().then();
    if (t93 !== ix93) return;
    await renderDeferred.d();

    if (t93 !== ix93) return;


    if (iframe.isConnected !== true) return;

    // console.log("iframe.xx",1235, iframe)

    const chat = closestDOM.call(iframe, 'ytd-live-chat-frame#chat');

    // console.log('chat', chat)
    if (!chat) return;

    // console.log("iframe.xx",1236, chat)

    if (chat.hasAttribute('collapsed')) return;
    showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 10');

    const tid = iframeLoadControllerId.inc();

    // console.log("iframe.xx",1237, chat)


    const cDoc = await new Promise((resolve) => {

      let timeoutCount = 250;
      let cid = 0;
      const tf = () => {
        let exitLoop;
        if (tid !== iframeLoadControllerId.valueOf() || --timeoutCount < 0) {
          exitLoop = true;
        } else if (chat.isConnected === true && iframe.isConnected === true && !chat.hasAttribute('collapsed')) {
          exitLoop = false;
        } else {
          exitLoop = true;
        }

        let cDoc = null;
        if (!exitLoop) {

          if (HTMLElement.prototype.closest.call(iframe, '[hidden]')) return;
          if (!HTMLElement.prototype.closest.call(iframe, '#columns.style-scope.ytd-watch-flexy')) return;
          try {
            cDoc = iframe.contentDocument;
          } catch (e) {
          }
          if (!cDoc) return;
          // if (cDoc.readyState === 'loading') return;
          if (!cDoc.body) return;

        }

        resolve && resolve(cDoc);
        resolve = null;
        cid && clearInterval(cid);
        cid = 0;

      }
      tf();
      if (resolve !== null) {
        cid = setInterval(tf, 17);
      }


    }).catch(console.warn);

    if (t93 !== ix93) return;

    showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 11');

    if (tid !== iframeLoadControllerId.valueOf() || !cDoc) {
      return;
    }

    showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 12');

    if (chat.hasAttribute('collapsed') || iframe.isConnected !== true) {
      return;
    }

    if (cDoc && (cDoc.readyState === 'loading' || !(cDoc.body || 0).firstElementChild)) {
      await new Promise(r => setTimeout(r, 50));
    }

    if (chat.hasAttribute('collapsed') || iframe.isConnected !== true) {
      return;
    }


    if (t93 !== ix93) return;

    showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 13');

    // console.log("iframe.xx",1238, chat)

    const contentElement = (cDoc.body || 0).firstElementChild;

    if (contentElement) {

      showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 20');

      if (!scriptEnable || !isChatExpand()) return; // v4.13.19 - scriptEnable = true in background
      if (!(iframe instanceof HTMLIFrameElement) || iframe.isConnected !== true) return; //prevent iframe is detached from the page
      let isCorrectDoc = false;
      try {
        isCorrectDoc = iframe.contentDocument === cDoc;
      } catch (e) { }

      showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 21');
      if (isCorrectDoc) {
        let chatFrame = closestDOM.call(iframe, 'ytd-live-chat-frame#chat');
        if (chatFrame) {
          showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 22');
          // chatFrame.setAttribute('tyt-iframe-loaded', '');
          sendToPageScript(chatFrame, 'tabview-chatroom-ready');
          iframeLoadStatusWM.set(iframe, t93 * 2 + 1);
        }
      }

    } else if (!contentElement) {

      showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 30');

      // e.g. when restore from mini view to watch page

      // tabview-chat-fix-url-onload-with-empty-body

      // iframe.removeEventListener('iframe-src-replaced', onIframeSrcReplaced, false);
      // iframe.addEventListener('iframe-src-replaced', onIframeSrcReplaced, false);

      setTimeout(() => {
        if (t93 !== ix93) return;
        try {
          if (chat.isConnected && !chat.hasAttribute('collapsed') && chat.contains(iframe)) {
            const cDoc = iframe.contentDocument;
            if (cDoc) {
              const cBody = cDoc.body;
              if (cBody && cBody.firstElementChild === null) {
                sendToPageScript(chat, "tabview-chat-fix-url-onload-with-empty-body");
              }
            }
          }
        } catch (e) {
          console.warn(e);
        }
      }, 230);

    }


  };

  // collapsed -> expanded [already loaded with location.replace]
  const iframeToVisible = async function (_iframe) {
    const iframe = _iframe;
    if (iframe.isConnected !== true || !(iframe instanceof HTMLIFrameElement)) return;
    if (((iframeLoadStatusWM.get(iframe) || 0) % 2) !== 1) {
      return;
    }
    const chat = closestDOM.call(iframe, 'ytd-live-chat-frame#chat');
    if (!chat) return;
    if (chat.hasAttribute('collapsed') || iframe.isConnected !== true) {
      return;
    }
    let cDoc = 0;
    try {
      cDoc = iframe.contentDocument;
    } catch (e) { }

    const contentElement = (cDoc.body || 0).firstElementChild;

    if (!contentElement) return;

    if (!scriptEnable || !isChatExpand()) return; // v4.13.19 - scriptEnable = true in background

    sendToPageScript(chat, 'tabview-chatroom-ready');

  };

  async function restorePIPforStickyHead() {
    // after a trusted user action, PIP can be cancelled.
    // this is to ensure enterPIP can be re-excecuted

    if (isMiniviewForStickyHeadEnabled && !isStickyHeaderEnabled && userActivation) {
      userActivation = false;
      exitPIP();
    }
  }

  let videosDeferred = new Deferred();

  let _navigateLoadDT = 0;

  function delayedClickHandler() {

    if (isMiniviewForStickyHeadEnabled && !isStickyHeaderEnabled) {
      restorePIPforStickyHead();
    } else if (!isMiniviewForStickyHeadEnabled && isStickyHeaderEnabled && typeof IntersectionObserver == 'function') {
      enablePIPforStickyHead();
    }

  }

  function convertDefaultTabFromTmpToFinal(myDefaultTab_tmp) {

    let myDefaultTab_final = null
    if (myDefaultTab_tmp && typeof myDefaultTab_tmp === 'string' && /^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab_tmp)) {
      if (document.querySelector(`.tab-btn[tyt-tab-content="${myDefaultTab_tmp}"]`)) myDefaultTab_final = myDefaultTab_tmp;
    }

    return myDefaultTab_final;
  }

  function getConfiguredDefaultTab(store) {
    let myDefaultTab;
    if (defaultTabByUserCSS === 1) {
      myDefaultTab = '#tab-info';
    } else if (defaultTabByUserCSS === 2) {
      myDefaultTab = '#tab-comments';
    } else if (defaultTabByUserCSS === 3) {
      myDefaultTab = '#tab-videos';
    } else {
      store = store || getStore();
      myDefaultTab = store[key_default_tab];
    }
    return myDefaultTab;
  }

  function setupTabBtns() {

    const materialTab = document.querySelector("#material-tabs")
    if (!materialTab) return;

    if (tabsUiScript_setclick) return;
    tabsUiScript_setclick = true;

    let fontSizeBtnClick = null;

    materialTab.addEventListener('click', async function (evt) {

      const dom = evt.target;
      if ((dom || 0).nodeType !== 1) return;

      await getRAFPromise().then(); // prevent execution in background
      await scriptletDeferred.d();

      if (dom.isConnected !== true) return;

      let b = isMiniviewForStickyHeadEnabled || (isStickyHeaderEnabled && typeof IntersectionObserver == 'function');
      if (b) {
        getDMPromise().then(delayedClickHandler);
      }

      const domInteraction = dom.getAttribute('tyt-di');
      if (domInteraction === 'q9Kjc') {
        handlerMaterialTabClick.call(dom, evt);
      } else if (domInteraction === '8rdLQ') {
        fontSizeBtnClick && fontSizeBtnClick.call(dom, evt);
      }

    }, true);

    function updateCSS_fontsize(store) {

      if (!store) return;

      const ytdFlexyElm = es.ytdFlexy;
      if (ytdFlexyElm) {
        if (store['font-size-#tab-info']) ytdFlexyElm.style.setProperty('--ut2257-info', store['font-size-#tab-info'])
        if (store['font-size-#tab-comments']) ytdFlexyElm.style.setProperty('--ut2257-comments', store['font-size-#tab-comments'])
        if (store['font-size-#tab-videos']) ytdFlexyElm.style.setProperty('--ut2257-videos', store['font-size-#tab-videos'])
        if (store['font-size-#tab-list']) ytdFlexyElm.style.setProperty('--ut2257-list', store['font-size-#tab-list'])
        sendToPageScript(document, "tabview-zoom-updated");
      }

    }

    fontSizeBtnClick = function (evt) {

      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();

      /** @type {HTMLElement | null} */
      let dom = evt.target;
      if (!dom) return;

      let value = dom.classList.contains('font-size-plus') ? 1 : dom.classList.contains('font-size-minus') ? -1 : 0;

      let active_tab_content = closestDOM.call(dom, '[tyt-tab-content]').getAttribute('tyt-tab-content');

      let store = getStore();
      let settingKey = `font-size-${active_tab_content}`
      if (!store[settingKey]) store[settingKey] = 1.0;
      if (value < 0) store[settingKey] -= 0.05;
      else if (value > 0) store[settingKey] += 0.05;
      if (store[settingKey] < 0.1) store[settingKey] = 0.1;
      else if (store[settingKey] > 10) store[settingKey] = 10.0;
      setStore(store);

      store = getStore();
      updateCSS_fontsize(store);

    }

    function loadDefaultTabBtnSettingToMem(store) {
      let myDefaultTab = getConfiguredDefaultTab(store);
      myDefaultTab = myDefaultTab ? convertDefaultTabFromTmpToFinal(myDefaultTab) : null;
      if (myDefaultTab) {
        settings.defaultTab = myDefaultTab;
      }
    }

    let store = getStore();
    updateCSS_fontsize(store);
    loadDefaultTabBtnSettingToMem(store);
    setupDefaultTabBtnSetting = function () {
      let myDefaultTab = getConfiguredDefaultTab();
      myDefaultTab = myDefaultTab ? convertDefaultTabFromTmpToFinal(myDefaultTab) : null;
      if (myDefaultTab) {
        settings.defaultTab = myDefaultTab;
      } else {
        settings.defaultTab = SETTING_DEFAULT_TAB_0;
      }
    }

  }

  function setMyDefaultTab(myDefaultTab) {
    myDefaultTab = convertDefaultTabFromTmpToFinal(myDefaultTab);
    let store = getStore();
    if (myDefaultTab) {
      store[key_default_tab] = myDefaultTab;
      settings.defaultTab = myDefaultTab;
    } else {
      delete store[key_default_tab];
      settings.defaultTab = SETTING_DEFAULT_TAB_0;
    }
    setStore(store);
  }

  document.addEventListener('tabview-setMyDefaultTab', function (evt) {

    let myDefaultTab_tmp = ((evt || 0).detail || 0).myDefaultTab

    setMyDefaultTab(myDefaultTab_tmp)

  }, false)

  function loadFrameHandler(evt) {
    let target = (evt || 0).target;
    if (target instanceof HTMLIFrameElement && target.id === 'chatframe') {
      fixLiveChatToggleButtonDispatchEvent();
    }
  }
  async function onNavigationEndAsync() {

    await scriptletDeferred.d();

    if (pageType !== 'watch') return;

    Promise.resolve().then(setupVideoTitleHover);

    // infoContentSetup();

    let tdt = Date.now();
    _navigateLoadDT = tdt;

    // avoid blocking the page when youtube is initializing the page
    const promiseDelay = getRAFPromise().then();
    const promiseVideoRendered = videosDeferred.d();

    const verifyPageState = () => {
      if (_navigateLoadDT !== tdt) {
        return -400;
      }
      if (ytEventSequence !== 3) {
        return -200;
      }

      const ytdFlexyElm = document.querySelector('ytd-watch-flexy:not([hidden])') || document.querySelector('ytd-watch-flexy');

      if (!ytdFlexyElm) {
        ytdFlexy = null;
        return -100;
      } else {
        ytdFlexy = mWeakRef(ytdFlexyElm);
        return 0;
      }


    }

    let pgState = verifyPageState();
    if (pgState < 0) return;

    let scriptEnableTemp = scriptEnable;
    scriptEnable = true; // avoid locking the other parts of script (see v4.13.19)
    await Promise.all([promiseVideoRendered, promiseDelay]);
    pgState = verifyPageState();
    if (pgState < 0) {
      scriptEnable = scriptEnableTemp;
      if (!ytdFlexy) scriptEnable = false;
      return;
    }
    pgState = null;
    const ytdFlexyElm = kRef(ytdFlexy);

    if (!ytdFlexyElm) {
      ytdFlexy = null;
      scriptEnable = false;
      return;
    }

    fixLiveChatToggleButtonDispatchEvent();
    document.removeEventListener('load', loadFrameHandler, true);
    document.addEventListener('load', loadFrameHandler, true);

    const related = _querySelector.call(ytdFlexyElm, "#related.ytd-watch-flexy");
    if (!related) return;


    if (!document.querySelector("#right-tabs")) {
      getLangForPage();
      let docTmp = document.createElement('template');
      docTmp.innerHTML = createHTML(getTabsHTML());
      let newElm = docTmp.content.firstElementChild;
      if (newElm !== null) {
        insertBeforeTo(newElm, related);
        _querySelector.call(newElm, '#material-tabs').addEventListener('mousemove', (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
        }, true);
        setupTabBtns();
        console.debug('[tyt] #right-tabs inserted')
      }
      docTmp.textContent = '';
      docTmp = null;
    }

    if (!ytdFlexyElm.hasAttribute('tyt-tab')) ytdFlexyElm.setAttribute('tyt-tab', '')

    // append the next videos 
    // it exists as "related" is already here
    fixTabs();

    let switchToDefaultTabNotAllowed = false;

    if (document.querySelector('ytd-watch-flexy[tyt-chat^="+"]')) {
      switchToDefaultTabNotAllowed = true;
    } else if (document.querySelector('ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])')) {
      switchToDefaultTabNotAllowed = true;
    } else if (document.querySelector('ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)')) {
      switchToDefaultTabNotAllowed = true;
    }

    if (switchToDefaultTabNotAllowed) {
      switchTabActivity(null);
    } else {
      setToActiveTab(); // just switch to the default tab
    }


    mtoFlexyAttr.clear(true)
    mtoBodyAttr.clear(true)
    mtf_checkFlexy()

    document.documentElement.setAttribute('tyt-deferred', '')
    tabsDeferred.resolve();
    tabsInsertedPromise.resolve();
    FP.mtf_attrEngagementPanel(); // check whether no visible panels


  }


  function fetchCommentsFinished() {
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;
    if (mtf_forceCheckLiveVideo_disable === 2) return;
    ytdFlexyElm.setAttribute('tyt-comments', 'L');
    _console.log(2909, 1)
  }

  function setCommentSection( /** @type {number} */ value) {

    Q.comments_section_loaded = value;
    if (value === 0 && fetchCounts) {
      fetchCounts.fetched = false; // unknown bug
    }

  }


  function emptyCommentSection() {
    let tab_btn = document.querySelector('.tab-btn[tyt-tab-content="#tab-comments"]')
    if (tab_btn) {
      let span = _querySelector.call(tab_btn, 'span#tyt-cm-count');
      tab_btn.removeAttribute('loaded-comment')
      if (span) {
        span.textContent = '';
      }
    }
    setCommentSection(0);
    _console.log(7233, 'comments_section_loaded = 0')
  }


  function _disableComments() {


    _console.log(2909, 1)
    if (!scriptEnable) return;
    let cssElm = es.ytdFlexy;
    if (!cssElm) return;

    _console.log(2909, 2)


    let comments = document.querySelector('ytd-comments#comments')
    if (mtf_forceCheckLiveVideo_disable === 2) {
      // earlier than DOM change
    } else {
      if (comments && !comments.hasAttribute('hidden')) return; // visible comments content)
    }

    _console.log(2909, 4)
    if (Q.comments_section_loaded === 2) return; //already disabled

    setCommentSection(2);

    _console.log(2909, 5)

    let tabBtn = document.querySelector('.tab-btn[tyt-tab-content="#tab-comments"]');
    if (tabBtn) {
      let span = _querySelector.call(tabBtn, 'span#tyt-cm-count');
      tabBtn.removeAttribute('loaded-comment')
      if (!tabBtn.classList.contains('tab-btn-hidden')) {
        //console.log('hide', comments, comments && comments.hasAttribute('hidden'))
        hideTabBtn(tabBtn)
      }
      if (span) {
        span.textContent = '';
      }
    }

    cssElm.setAttribute('tyt-comments', 'D');

    _console.log(2909, 10)


  }

  function setToggleInfo() {
    scriptletDeferred.d().then(() => {
      const elem = document.querySelector('#primary.ytd-watch-flexy #below ytd-watch-metadata #info-container.ytd-watch-metadata:first-child') || document.querySelector('#primary.ytd-watch-flexy #below ytd-watch-metadata #ytd-watch-info-text.ytd-watch-metadata:first-child') || null;
      if (elem && !elem.hasAttribute('tyt-info-toggler')) {
        elem.setAttribute('tyt-info-toggler', '');
        sendToPageScript(elem, 'tyt-info-toggler');
      }
    });
  }

  function flexyAttr_toggleFlag(mFlag, b, flag) {
    return b ? (mFlag | flag) : (mFlag & ~flag);
  }

  function flexAttr_toLayoutStatus(nls, attributeName) {

    let attrElm, b, v;
    switch (attributeName) {
      case 'theater':
        b = isTheater();
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_THEATER);
        break;
      case 'tyt-chat':
        attrElm = es.ytdFlexy;
        v = attrElm.getAttribute('tyt-chat');

        if (v !== null && v.charAt(0) === '-') {
          nls = flexyAttr_toggleFlag(nls, true, LAYOUT_CHATROOM | LAYOUT_CHATROOM_COLLAPSED);
        } else {
          nls = flexyAttr_toggleFlag(nls, v !== null, LAYOUT_CHATROOM);
          nls = flexyAttr_toggleFlag(nls, false, LAYOUT_CHATROOM_COLLAPSED);
        }

        break;
      case 'is-two-columns_':
        b = isWideScreenWithTwoColumns();
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_TWO_COLUMNS);
        break;

      case 'tyt-tab':
        attrElm = es.ytdFlexy;
        b = isNonEmptyString(attrElm.getAttribute('tyt-tab'));
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_TAB_EXPANDED);
        break;

      case 'fullscreen':
        attrElm = es.ytdFlexy;
        b = attrElm.hasAttribute('fullscreen');
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_FULLSCREEN);
        break;

      case 'tyt-ep-visible':
        attrElm = es.ytdFlexy;
        v = attrElm.getAttribute('tyt-ep-visible');
        b = (+v > 0)
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_ENGAGEMENT_PANEL_EXPANDED);
        break;

      case 'tyt-donation-shelf':
        attrElm = es.ytdFlexy;
        b = attrElm.hasAttribute('tyt-donation-shelf');
        nls = flexyAttr_toggleFlag(nls, b, LAYOUT_DONATION_SHELF_EXPANDED);
        break;

    }

    return nls;


  }



  function ito_details(entries, observer) {
    if (!detailsTriggerReset) return;
    if (!entries || entries.length !== 1) return; // unlikely
    let entry = entries[0];
    //console.log(entries)
    if (entry.isIntersecting === true) {

      if (fT(wls.layoutStatus, LAYOUT_TWO_COLUMNS | LAYOUT_FULLSCREEN, 0) === false) return;

      let dom = entry.target;
      if (!dom) return; //unlikely

      let bool = false;
      let descClickable = null;

      if (fT(wls.layoutStatus, 0, LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED | LAYOUT_CHATROOM_EXPANDED | LAYOUT_TAB_EXPANDED) === false) {
        descClickable = closestDOM.call(dom, '#description.item.style-scope.ytd-watch-metadata')
        if (descClickable) {
          detailsTriggerReset = false;
          bool = true;
        }
      }

      async function runAsync(dom, bool) {

        if (bool) {
          let descClickable = closestDOM.call(dom, '#description.item.style-scope.ytd-watch-metadata')
          if (descClickable) {
            descClickable.click();
          }
        }

        await getDMPromise();

        let pInner, nw = null;
        try {
          let x = closestDOM.call(dom, '#description.item.style-scope.ytd-watch-metadata');
          let h2 = x.offsetHeight;
          pInner = closestDOM.call(x, '#primary-inner')
          let h1 = pInner.offsetHeight;
          x.setAttribute('userscript-scrollbar-render', '')
          if (h1 > h2 && h2 > 0 && h1 > 0) nw = h1 - h2
        } catch (e) { }
        if (pInner) {
          pInner.style.setProperty('--tyt-desc-top-h', `${nw ? nw : 0}px`)
        }
      }

      runAsync(dom, bool);


    }

  }

  function immediateCheck() {


    if (!scriptEnable) return;

    if (fT(wls.layoutStatus, LAYOUT_TWO_COLUMNS, LAYOUT_TAB_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED | LAYOUT_THEATER | LAYOUT_FULLSCREEN | LAYOUT_CHATROOM_EXPANDED)) {
      setToActiveTab();
    }

  }

  // let _ctlPromise = null;

  // const getCTLPromise = () => {

  //   if(!_ctlPromise) _ctlPromise = new PromiseExternal();


  //   const ytdFlexyElm = es.ytdFlexy;
  //   if (!scriptEnable || !ytdFlexyElm || !wls.layoutStatus) {
  //     _ctlPromise.resolve();
  //   }else{
  //     ytdFlexyElm.setAttribute('tyt-ctl', ytdFlexyElm.getAttribute('tyt-ctl') === '1' ? '0' : '1')
  //   }

  //   return _ctlPromise;

  // };


  // const triggerCTL = ()=>{
  //   _ctlPromise && _ctlPromise.resolve();
  //   _ctlPromise = null
  // }

  let updateFlexyStateRequired = false;
  const updateFlexyStateFn = () => {
    updateFlexyStateRequired = false;
    es.ytdFlexy && layoutStatusMutex.lockWith(unlock => {
      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return;
      const isFlexyHidden = ytdFlexyElm.hasAttribute('hidden');
      if (isFlexyHidden) return;
      setChatroomState();
      mtf_checkFlexy_(LAYOUT_VAILD);
      unlock();
    });
  }
  const mtf_attrFlexy = (mutations, observer) => {

    // if(document.documentElement.hasAttribute('p355')) return;


    //attr mutation checker - $$ytdFlexyElm$$ {ytd-watch-flexy} \single
    //::attr    
    // ~ 'tyt-chat', 'theater', 'is-two-columns_', 
    // ~ 'tyt-tab', 'fullscreen', 'tyt-ep-visible', 
    // ~ 'hidden', 'is-extra-wide-video_'

    //console.log(15330, scriptEnable, es.ytdFlexy, mutations)


    if (mutations && mutations.length >= 1) {
      let b = 0;
      for (const mutation of mutations) {
        if (mutation.attributeName === 'hidden') {
          b = 1;
          break;
        }
      }
      if (b) {
        updateFlexyStateRequired = true;
      }
    }

    if (!scriptEnable) return;

    const cssElm = es.ytdFlexy;
    if (!cssElm) return;

    if (!mutations) return;


    const old_layoutStatus = wls.layoutStatus
    if (old_layoutStatus === 0) return;
    let new_layoutStatus = old_layoutStatus;

    let checkedChat = false;
    let mss = 0;
    let dcall = 0;
    // let resolveCTL = false;

    check1885();
    if (!chatController.allowChatControl) {

      // for (const mutation of mutations) {

      //   if(mutation.attributeName === 'tyt-ctl') {
      //     resolveCTL = true;
      //     continue;
      //   }
      // }
      // if(resolveCTL) triggerCTL();
      return;
    }

    for (const mutation of mutations) {

      // if(mutation.attributeName === 'tyt-ctl') {
      //   resolveCTL = true;
      //   continue;
      // }

      // if(1885 && document.body.hasAttribute('data-ytlstm-theater-mode')) continue;
      new_layoutStatus = flexAttr_toLayoutStatus(new_layoutStatus, mutation.attributeName);
      // _console.log(8221, 18, mutation.attributeName)
      if (mutation.attributeName === 'tyt-chat') {

        if (!checkedChat) {
          checkedChat = true; // avoid double call

          if ((cssElm.getAttribute('tyt-chat') || '').indexOf('chat$live') >= 0) {
            // assigned new attribute - "chat$live" => disable comments section

            //console.log(3712,2)
            _disableComments();
          }

          if (!cssElm.hasAttribute('tyt-chat')) {
            // might or might not collapsed before
            dcall |= 1;
          }
        }

      } else if (mutation.attributeName === 'tyt-ep-visible') {
        // assume any other active component such as tab content and chatroom

        if (+(cssElm.getAttribute('tyt-ep-visible') || 0) === 0 && +mutation.oldValue > 0) {
          dcall |= 2;
        }

        if (mss === 0) mss = 1;
        else mss = -1;

      } else if (mutation.attributeName === 'tyt-donation-shelf') {
        // assume any other active component such as tab content and chatroom

        // console.log(4545, cssElm.hasAttribute('tyt-donation-shelf'))
        if (!(cssElm.hasAttribute('tyt-donation-shelf'))) {
          dcall |= 4;
        } else {
          lstTab.lastPanel = '#donation-shelf'
          switchTabActivity(null);
          // console.log(55)
        }
        if (mss === 0) mss = 2;
        else mss = -1;

      } else if (mutation.attributeName === 'is-extra-wide-video_') {
        getDMPromise().then(updateFloatingSlider); //required for hover slider // eg video after ads
      }

    }

    new_layoutStatus = fixLayoutStatus(new_layoutStatus);

    if (new_layoutStatus !== old_layoutStatus) {

      if (fT(new_layoutStatus, LAYOUT_TWO_COLUMNS, LAYOUT_TAB_EXPANDED | LAYOUT_THEATER | LAYOUT_CHATROOM_EXPANDED)) {
        if (mss === 1) {
          if (fT(new_layoutStatus, LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED, 0)) {
            closeDonationShelf();
          }
        } else if (mss === 2) {
          if (fT(new_layoutStatus, LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED, 0)) {
            ytBtnCloseEngagementPanels();
          }
        }
      }
      wls.layoutStatus = new_layoutStatus

    }


    (async () => {
      await getDMPromise();
      layoutStatusMutex.lockWith(unlock => {
        immediateCheck();
        unlock();
      });
    })();


  }

  const mtf_attrBody = (mutations, observer) => {

    getDMPromise().then(() => {

      layoutStatusMutex.lockWith(unlock => {

        check1885();
        check1886();

        if (chatController.allowChatControl) {
          mtf_checkFlexy_(wls.layoutStatus);
          fixTabs();
        }


        if (document.fullscreenElement) {
          unlock();
        } else if (wls.layoutStatus & LAYOUT_THEATER) {
          if (chatController.allowChatControl) {
            fixTheaterChat1A();
          } else {
            fixTheaterChat2A();
          }
          getDMPromise().then(unlock);
        } else {
          unlock();
        }

      });

    });


  }

  function setupChatFrameDisplayState1(chatBlockR, initialDisplayState) {


    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    let chatTypeChanged = mtf_chatBlockQ !== chatBlockR;

    let attr_chatblock = chatBlockR === 1 ? 'chat$live' : chatBlockR === 3 ? 'chat$playback' : false;
    let attr_chatcollapsed = false;


    if (attr_chatblock) {
      let chatFrame = document.querySelector('ytd-live-chat-frame#chat')
      if (chatFrame) {
        attr_chatcollapsed = chatFrame.hasAttribute('collapsed');
        if (!attr_chatcollapsed) {

          //nativeFunc(p,'setupPlayerProgressRelay')
          //if(!p.isFrameReady)
          //nativeFunc(p, "urlChanged")
          //console.log(12399,1)
          // chatFrame.dispatchEvent(new CustomEvent("tabview-chatroom-newpage")); //possible empty iframe is shown

        }
      } else {
        attr_chatcollapsed = initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED' ? true : false;
      }
    }

    if (chatTypeChanged) {
      mtf_chatBlockQ = chatBlockR

      // _console.log(932, 2, attr_chatblock, attr_chatcollapsed)

      //LIVE_CHAT_DISPLAY_STATE_COLLAPSED
      //LIVE_CHAT_DISPLAY_STATE_EXPANDED
      let v = attr_chatblock
      if (typeof attr_chatblock == 'string') {

        if (attr_chatcollapsed === true) v = '-' + attr_chatblock
        if (attr_chatcollapsed === false) v = '+' + attr_chatblock;
      }
      wAttr(ytdFlexyElm, 'tyt-chat', v)

      // _console.log(932, 3, ytdFlexyElm.hasAttribute('tyt-chat'))


    }

    return { attr_chatblock, attr_chatcollapsed, chatTypeChanged }
  }

  function setupChatFrameDisplayState2() {

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return null;

    // this is a backup solution only; should be abandoned

    let attr_chatblock = null
    let attr_chatcollapsed = null;

    const elmChat = document.querySelector('ytd-live-chat-frame#chat')
    let elmCont = null;
    if (elmChat) {
      elmCont = chatFrameElement('yt-live-chat-renderer #continuations')


      let s = 0;
      if (elmCont) {
        //not found if it is collapsed.
        s |= _querySelector.call(elmCont, 'yt-timed-continuation') ? 1 : 0;
        s |= _querySelector.call(elmCont, 'yt-live-chat-replay-continuation, yt-player-seek-continuation') ? 2 : 0;
        //s |= elmCont.querySelector('yt-live-chat-restricted-participation-renderer')?4:0;
        if (s == 1) {
          attr_chatblock = 'chat$live';
        } else if (s == 2) attr_chatblock = 'chat$playback';

        if (s == 1) {
          let cmCountElm = document.querySelector("span#tyt-cm-count")
          if (cmCountElm) cmCountElm.textContent = '';
        }

      } else if (!ytdFlexyElm.hasAttribute('tyt-chat')) {
        // live chat frame but type not known

        attr_chatblock = '';

      }
      //keep unknown as original    


      let isCollapsed = !!elmChat.hasAttribute('collapsed');
      attr_chatcollapsed = isCollapsed;

    } else {
      attr_chatblock = false;
      attr_chatcollapsed = false;

    }

    return { attr_chatblock, attr_chatcollapsed }

  }


  const mtf_checkFlexy_ = (ls) => {

    const ls0 = ls;

    ls = flexAttr_toLayoutStatus(ls, 'theater')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-chat')
    ls = flexAttr_toLayoutStatus(ls, 'is-two-columns_')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-tab')
    ls = flexAttr_toLayoutStatus(ls, 'fullscreen')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-ep-visible')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-donation-shelf')

    fixLayoutStatus(ls);

    if (ls0 !== ls) {
      wls.layoutStatus = ls
    }

  }

  const setChatroomState = () => {
    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;
    const rChatExist = setupChatFrameDisplayState2();
    if (rChatExist) {
      let { attr_chatblock, attr_chatcollapsed } = rChatExist;
      if (attr_chatblock === null) {
        //remove attribute if it is unknown
        attr_chatblock = false;
        attr_chatcollapsed = false;
      }
      let v = attr_chatblock;
      if (typeof v === 'string') {
        if (attr_chatcollapsed === true) v = '-' + v;
        if (attr_chatcollapsed === false) v = '+' + v;
      }
      wAttr(ytdFlexyElm, 'tyt-chat', v)
    }
  }

  const mtf_checkFlexy = () => {
    // once per $$native-ytd-watch-flexy$$ {ytd-watch-flexy} detection

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return true;


    if (typeof wls.layoutStatus === 'undefined' || !(wls.layoutStatus & LAYOUT_VAILD)) {
      wls.layoutStatus = 0;
    }

    const isFlexyHidden = (ytdFlexyElm.hasAttribute('hidden'));

    if (!isFlexyHidden) {
      setChatroomState();
    }

    let rTabSelection = [..._querySelectorAll.call(ytdFlexyElm, '.tab-btn[tyt-tab-content]')]
      .map(elm => ({ elm, hidden: elm.classList.contains('tab-btn-hidden') }));

    if (rTabSelection.length === 0) {
      wAttr(ytdFlexyElm, 'tyt-tab', false);
    } else {
      rTabSelection = rTabSelection.filter(entry => entry.hidden !== true); // all available tabs
      if (rTabSelection.length === 0) wAttr(ytdFlexyElm, 'tyt-tab', '');
    }
    rTabSelection = null;

    let rEP = engagement_panels_();
    if (rEP && rEP.list.length > 0) {
      wAttr(ytdFlexyElm, 'tyt-ep-visible', `${rEP.value}`);
    } else {
      wAttr(ytdFlexyElm, 'tyt-ep-visible', false);
    }

    mtf_checkFlexy_(LAYOUT_VAILD);

    mtoFlexyAttr.bindElement(ytdFlexyElm, {
      attributes: true,
      attributeFilter: [/*'tyt-ctl',*/ 'tyt-chat', 'theater', 'is-two-columns_', 'tyt-tab', 'fullscreen', 'tyt-ep-visible', 'tyt-donation-shelf', 'hidden', 'is-extra-wide-video_'],
      attributeOldValue: true
    })
    mtoBodyAttr.bindElement(document.body, {
      attributes: true,
      attributeFilter: ['data-ytlstm-theater-mode'],
      attributeOldValue: true
    })

    let columns = document.querySelector('ytd-page-manager#page-manager #columns.ytd-watch-flexy')
    if (columns) {
      wAttr(columns, 'userscript-scrollbar-render', true);
    }

    immediateCheck()

    return false;
  }

  document.addEventListener('tabview-fix-layout', () => {

    immediateCheck()

  }, false)


  function switchTabActivity(activeLink) {

    //console.log(4545, activeLink)
    if (!scriptEnable) return;

    const ytdFlexyElm = es.ytdFlexy;

    if (!ytdFlexyElm) return;

    if (activeLink && activeLink.classList.contains('tab-btn-hidden')) return; // not allow to switch to hide tab

    //if (isTheater() && isWideScreenWithTwoColumns()) activeLink = null;


    function runAtEnd() {

      if (activeLink) {
        lstTab.lastTab = activeLink.getAttribute('tyt-tab-content')
        lstTab.lastPanel = null;

        if (!document.querySelector(`${lstTab.lastTab}.tab-content-cld tabview-view-tab-expander`)) {

          scriptletDeferred.debounce(() => {

            let secondary = document.querySelector('#secondary.ytd-watch-flexy');
            if (secondary) {
              secondary.dispatchEvent(new CustomEvent('tabview-hover-slider-restore'))
              //console.log(1995)
            }

          })

        }
      }

      const newTag = activeLink ? lstTab.lastTab : '';

      ytdFlexyElm.setAttribute('tyt-tab', newTag)

      if (newTag === '#tab-videos') {



        let t = document.querySelector('#tab-videos yt-chip-cloud-renderer')
        if (t) {
          scriptletDeferred.debounce(() => {
            t.isConnected && sendToPageScript(t, 'tyt-resize-chip-cloud');
            t = null;
          })
        }

      }


    }

    const links = document.querySelectorAll('#material-tabs a[tyt-tab-content]');

    //console.log(701, activeLink)

    for (const link of links) {
      let content = document.querySelector(link.getAttribute('tyt-tab-content'));
      if (link && content) {
        if (link !== activeLink) {
          link.classList.remove("active");
          content.classList.add("tab-content-hidden");
          if (!content.hasAttribute("tyt-hidden")) {
            content.setAttribute("tyt-hidden", ""); // for https://greasyfork.org/en/scripts/456108
          }
        } else {
          link.classList.add("active");
          if (content.hasAttribute("tyt-hidden")) {
            content.removeAttribute("tyt-hidden"); // for https://greasyfork.org/en/scripts/456108
          }
          content.classList.remove("tab-content-hidden");
        }
      }
    }

    runAtEnd();


  }


  function getStore() {
    let s = localStorage[STORE_key];
    function resetStore() {
      let ret = {
        version: 1,
      };
      localStorage[STORE_key] = JSON.stringify(ret);
      return ret;
    }
    if (!s) return resetStore();
    let obj = null;
    try {
      obj = JSON.parse(s);
    } catch (e) { }
    return obj && obj.version === STORE_VERSION ? obj : resetStore();
  }

  function setStore(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.version !== STORE_VERSION) return false;
    localStorage[STORE_key] = JSON.stringify(obj);
    return true;
  }



  async function handlerMaterialTabClickInner(tabBtn) {

    await Promise.resolve(0);

    const layoutStatusMutexUnlock = await new Promise(resolve => {
      layoutStatusMutex.lockWith(unlock => {
        resolve(unlock)
      })
    });

    // locked
    let unlock = layoutStatusMutexUnlock; // function of unlock inside layoutStatusMutex

    //console.log(8515)
    switchTabActivity_lastTab = tabBtn.getAttribute('tyt-tab-content');

    let isActiveAndVisible = tabBtn.classList.contains('tab-btn') && tabBtn.classList.contains('active') && !tabBtn.classList.contains('tab-btn-hidden')

    _console.log(8221, 15, isActiveAndVisible)

    if (isFullScreen()) {

      _console.log(8221, 16, 1)

      if (isActiveAndVisible) {
        getDMPromise().then(unlock);
        switchTabActivity(null);
      } else {

        if (isChatExpand() && isWideScreenWithTwoColumns()) {
          ytBtnCollapseChat();
        } else if (isEngagementPanelExpanded() && isWideScreenWithTwoColumns()) {
          ytBtnCloseEngagementPanels();
        } else if (isDonationShelfExpanded() && isWideScreenWithTwoColumns()) {
          closeDonationShelf();
        }

        !!(async () => {
          if (canScrollIntoViewWithOptions) {
            await getDMPromise();
            fullScreenTabScrollIntoView();
          }
          await getDMPromise();
          unlock();
        })();
        switchTabActivity(tabBtn)
      }

    } else if (isWideScreenWithTwoColumns() && !isTheater() && isActiveAndVisible) {
      switchTabActivity(null);
      ytBtnSetTheater();
      getDMPromise().then(unlock);
    } else if (isActiveAndVisible) {
      switchTabActivity(null);
      getDMPromise().then(unlock);
    } else {

      if (isChatExpand() && isWideScreenWithTwoColumns()) {
        ytBtnCollapseChat();
      } else if (isEngagementPanelExpanded() && isWideScreenWithTwoColumns()) {
        ytBtnCloseEngagementPanels();
      } else if (isDonationShelfExpanded() && isWideScreenWithTwoColumns()) {
        closeDonationShelf();
      } else if (isWideScreenWithTwoColumns() && isTheater() && !isFullScreen()) {
        ytBtnCancelTheater(); //ytd-watch-flexy attr [theater]
      }

      switchTabActivity(tabBtn)


      !!(async () => {
        await getDMPromise();
        // single column view; click button; scroll to tab content area 100%
        let rightTabs = document.querySelector('#right-tabs');
        if (!isWideScreenWithTwoColumns() && rightTabs && rightTabs.offsetTop > 0 && tabBtn.classList.contains('active') && rightTabs.hasAttribute('tyt-stickybar')) {
          let tabButtonBar = document.querySelector('#material-tabs');
          let tabButtonBarHeight = tabButtonBar ? tabButtonBar.offsetHeight : 0;
          window.scrollTo(0, rightTabs.offsetTop - tabButtonBarHeight); // scrollIntoView
        }
        await getDMPromise();
        unlock();
      })();

    }


  }

  function handlerMaterialTabClick(/** @type {MouseEvent} */ evt) {

    //console.log(8510)
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return null;

    let tabBtn = this;

    if (!tabBtn.hasAttribute('tyt-tab-content')) return;

    /** @type {HTMLElement | null} */
    let dom = evt.target;
    if (!dom) return;

    if (dom.classList.contains('font-size-btn')) return;


    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();

    handlerMaterialTabClickInner(tabBtn);


  }

  function onVideoLeavePictureInPicuture() {
    isMiniviewForStickyHeadEnabled = false;
  }


  let videoPlayerInsectObserver = null;
  let videoInsected = false;


  async function enablePIPforStickyHead() {
    // use async & await to avoid handler took 60ms

    if (!isMiniviewForStickyHeadEnabled && isStickyHeaderEnabled && userActivation && typeof IntersectionObserver == 'function') {
      let video = document.querySelector('#player video'); // ignore audio mode
      if (!video) return;

      const vRect = video.getBoundingClientRect();
      if (!(vRect.top < 0 && vRect.height > 100 && vRect.bottom < vRect.height * 0.25)) return; // avoid conflic with YouTube Mobile Mode in YouTube Live Borderless

      await Promise.resolve(0)
      const pageClientWidth = document.documentElement.clientWidth;
      if (pageClientWidth + 320 < screen.width && pageClientWidth > 320 && !document.querySelector('#rCbM3')) {


        await Promise.resolve(0)
        // desktop or notebook can use this feature

        // --------------------------------------------------------
        // ignore user activation error
        enterPIP(video, null).then(r => {
          if (r === true) {

            userActivation = false;
            isMiniviewForStickyHeadEnabled = true;
          }
        });
        // --------------------------------------------------------
        video.removeEventListener('leavepictureinpicture', onVideoLeavePictureInPicuture, false);
        video.addEventListener('leavepictureinpicture', onVideoLeavePictureInPicuture, false);

        if (!video.hasAttribute('NOL4j')) {
          video.setAttribute('NOL4j', "");


          await Promise.resolve(0)

          let callback = (entries) => {


            let lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.isIntersecting === true) {

              videoInsected = true;

              if (isMiniviewForStickyHeadEnabled && !isStickyHeaderEnabled && userActivation && videoInsected) {
                restorePIPforStickyHead();
              }

            } else {
              videoInsected = false;
            }

          };

          if (!videoPlayerInsectObserver) {
            videoPlayerInsectObserver = new IntersectionObserver(callback, {
              root: null,
              rootMargin: "0px",
              threshold: 0.25
            });
          }

          videoPlayerInsectObserver.takeRecords();
          videoPlayerInsectObserver.disconnect();

          videoPlayerInsectObserver.observe(video);


        }

      }
    }
  }

  function setStickyHeader(targetElm, bool, getWidthHeight, getLeftRight) {

    //if(isStickyHeaderEnabled===bool) return; // no update

    if (bool === true) {
      const { width, height } = getWidthHeight();
      targetElm.style.setProperty("--tyt-stickybar-w", width + 'px')
      targetElm.style.setProperty("--tyt-stickybar-h", height + 'px')
      const res = getLeftRight();
      if (res) {

        targetElm.style.setProperty("--tyt-stickybar-l", (res.left) + 'px')
        targetElm.style.setProperty("--tyt-stickybar-r", (res.right) + 'px')

      }
      wAttr(targetElm, 'tyt-stickybar', true);
      isStickyHeaderEnabled = true;

      if (!isMiniviewForStickyHeadEnabled && isStickyHeaderEnabled && userActivation && typeof IntersectionObserver == 'function') {
        getDMPromise().then(enablePIPforStickyHead);
      }

    } else if (bool === false) {

      wAttr(targetElm, 'tyt-stickybar', false);
      isStickyHeaderEnabled = false;


    }


  }

  const singleColumnScrolling = async function () {
    //makeHeaderFloat
    // required for 1) init 2) layout change 3) resizing

    if (!scriptEnable || pageType !== 'watch') return;


    let isTwoCol = (wls.layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS;
    if (isTwoCol) {

      if (isStickyHeaderEnabled) {

        let targetElm = document.querySelector("#right-tabs");
        setStickyHeader(targetElm, false, null, null);
      }
      return;
    }

    let pageY = scrollY;


    let tdt = Date.now();
    singleColumnScrolling_dt = tdt;


    _console.log(7891, 'scrolling')

    function getXYStatus(res) {

      const [navHeight, elmY] = res;

      let xyz = [elmY + navHeight, pageY, elmY - navHeight]

      let xyStatus = 0
      if (xyz[1] < xyz[2] && xyz[2] < xyz[0]) {
        // 1
        xyStatus = 1
      }

      if (xyz[0] > xyz[1] && xyz[1] > xyz[2]) {

        //2
        xyStatus = 2

      }

      if (xyz[2] < xyz[0] && xyz[0] < xyz[1]) {
        // 3

        xyStatus = 3


      }

      return xyStatus;
    }

    let [targetElm, header, navElm] = await Promise.all([
      Promise.resolve().then(() => document.querySelector("#right-tabs")),

      Promise.resolve().then(() => document.querySelector("#right-tabs header")),

      Promise.resolve().then(() => document.querySelector('#masthead-container, #masthead')),

    ]);

    function emptyForGC() {
      targetElm = null;
      header = null;
      navElm = null;
    }

    if (!targetElm || !header) {
      return emptyForGC();
    }
    if (singleColumnScrolling_dt !== tdt) return emptyForGC();

    let res2 = await Promise.all([
      Promise.resolve().then(() => navElm ? navElm.offsetHeight : 0),
      Promise.resolve().then(() => targetElm.offsetTop)
    ])

    if (res2 === null) return emptyForGC();

    if (singleColumnScrolling_dt !== tdt) return emptyForGC();


    const xyStatus = getXYStatus(res2);


    function getLeftRight() {

      let thp = document.querySelector('tabview-view-pos-thead');
      if (thp) {

        let rect = thp.getBoundingClientRect()
        if (rect) {
          return {
            left: rect.left,
            right: document.documentElement.clientWidth - rect.right
          };
        }
      }
      return null;
    }

    let bool = (xyStatus == 2 || xyStatus == 3) ? true : ((xyStatus == 1) ? false : null);

    function getWidthHeight() {
      return { width: targetElm.offsetWidth, height: header.offsetHeight };
    }

    setStickyHeader(targetElm, bool, getWidthHeight, getLeftRight);


    emptyForGC();

  };


  const singleColumnScrolling2 = async function (xyStatus, width, xRect) {
    //makeHeaderFloat

    if (!scriptEnable || pageType !== 'watch') return;


    if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) {
      return;
    }

    let [targetElm, header] = await Promise.all([
      Promise.resolve().then(() => document.querySelector("#right-tabs")),
      Promise.resolve().then(() => document.querySelector("#right-tabs header"))
    ]);

    function emptyForGC() {
      targetElm = null;
      header = null;
    }


    if (!targetElm || !header) {
      return emptyForGC();
    }

    function getLeftRight() {
      return xRect;
    }

    let bool = (xyStatus == 2 || xyStatus == 3) ? true : ((xyStatus == 1) ? false : null);

    function getWidthHeight() {
      return { width: (width || targetElm.offsetWidth), height: header.offsetHeight };
    }

    setStickyHeader(targetElm, bool, getWidthHeight, getLeftRight);

    emptyForGC();

  };


  function resetBuggyLayoutForNewVideoPage() {

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;

    //(flexy is visible and watch video page) 

    scriptEnable = true;

    _console.log(27056)

    let new_layoutStatus = wls.layoutStatus

    new_layoutStatus & (LAYOUT_CHATROOM_COLLAPSED | LAYOUT_CHATROOM)

    const new_isExpandedChat = !(new_layoutStatus & LAYOUT_CHATROOM_COLLAPSED) && !!(new_layoutStatus & LAYOUT_CHATROOM)
    const new_isCollapsedChat = !!(new_layoutStatus & LAYOUT_CHATROOM_COLLAPSED) && !!(new_layoutStatus & LAYOUT_CHATROOM)

    const new_isTwoColumns = new_layoutStatus & LAYOUT_TWO_COLUMNS;
    const new_isTheater = new_layoutStatus & LAYOUT_THEATER;
    const new_isTabExpanded = new_layoutStatus & LAYOUT_TAB_EXPANDED;
    const new_isFullScreen = new_layoutStatus & LAYOUT_FULLSCREEN;
    const new_isExpandedEPanel = new_layoutStatus & LAYOUT_ENGAGEMENT_PANEL_EXPANDED;
    const new_isExpandedDonationShelf = new_layoutStatus & LAYOUT_DONATION_SHELF_EXPANDED;

    const nothingShown = !new_isTabExpanded && !new_isExpandedChat && !new_isExpandedEPanel && !new_isExpandedDonationShelf

    if (ytdFlexyElm.getAttribute('tyt-tab') === '' && new_isTwoColumns && !new_isTheater && nothingShown && !new_isFullScreen) {
      // e.g. engage panel removed after miniview and change video
      setToActiveTab();
    } else if (new_isExpandedEPanel && _querySelectorAll.call(ytdFlexyElm, 'ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])').length === 0) {
      wls.layoutStatus = new_layoutStatus & (~LAYOUT_ENGAGEMENT_PANEL_EXPANDED)
    } else if (new_isExpandedDonationShelf && _querySelectorAll.call(ytdFlexyElm, 'ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden])').length === 0) {
      wls.layoutStatus = new_layoutStatus & (~LAYOUT_DONATION_SHELF_EXPANDED)
    }

  }


  function extractInfoFromLiveChatRenderer(liveChatRenderer) {

    const lcr = liveChatRenderer

    const data_shb = ((lcr || 0).showHideButton || 0).toggleButtonRenderer

    const data_sb = !data_shb ? ((lcr || 0).showButton || 0).buttonRenderer : null // only show button

    let default_display_state = null, txt_collapse = null, txt_expand = null;

    if (!data_shb && data_sb && data_sb.text && typeof data_sb.text.simpleText === 'string') {

      if (lcr.initialDisplayState == "LIVE_CHAT_DISPLAY_STATE_EXPANDED") {
        default_display_state = lcr.initialDisplayState
      } else if (lcr.initialDisplayState == "LIVE_CHAT_DISPLAY_STATE_COLLAPSED") {
        default_display_state = lcr.initialDisplayState
      }
      txt_expand = data_sb.text.simpleText;

    } else if (data_shb && data_shb.defaultText && data_shb.toggledText && data_shb.defaultText.runs && data_shb.toggledText.runs) {

      if (data_shb.defaultText.runs.length === 1 && data_shb.toggledText.runs.length === 1) {

        if (lcr.initialDisplayState == "LIVE_CHAT_DISPLAY_STATE_EXPANDED") {

          default_display_state = lcr.initialDisplayState

          txt_collapse = (data_shb.defaultText.runs[0] || 0).text // COLLAPSE the area

          txt_expand = (data_shb.toggledText.runs[0] || 0).text // expand the area

        } else if (lcr.initialDisplayState == "LIVE_CHAT_DISPLAY_STATE_COLLAPSED") {
          default_display_state = lcr.initialDisplayState

          txt_expand = (data_shb.defaultText.runs[0] || 0).text // expand the area

          txt_collapse = (data_shb.toggledText.runs[0] || 0).text // COLLAPSE the area
        }


        if (typeof txt_expand == 'string' && typeof txt_collapse == 'string' && txt_expand.length > 0 && txt_collapse.length > 0) {

        } else {
          txt_expand = null;
          txt_collapse = null;
        }
      }

    }

    if (lcr && (!default_display_state)) {
      console.log('[tyt] Unable to obtain showHideButton data');
    }

    return { default_display_state, txt_collapse, txt_expand }

  }

  // added in 2024.07.05
  // see https://greasyfork.org/scripts/428651/discussions/250256
  const notWaitingRoom = () => {

    // https://www.youtube.com/watch?v=fDL2UhbysVk
    // live waiting room: dont hide for chat$live

    if (!formatDates) {
      return true; // assumption based
    }

    if (formatDates && formatDates.broadcastBeginAt && !formatDates.broadcastEndAt && formatDates.isLiveNow === false) return false;

    return true;
  }

  const dpeChatRefreshCounter = ControllerID();
  // let proceedingChatFrameVideoID = '';
  // let newVideoPageCACC = -1;
  let mvideoState = 0;

  function newVideoPage(evt_detail) {

    //toggleBtnDC = 1;

    console.debug('[tyt] newVideoPage');
    // Promise.resolve().then(setupVideoTitleHover);
    mvideoState = 0;
    // console.debug('[tyt] debug ym-01-0')

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;

    layoutStatusMutex = new Mutex();

    let liveChatRenderer = null;
    let isReplay = null;

    if (pageType !== 'watch') return; // scriptEnable -> pageType shall be always 'watch'
    resetBuggyLayoutForNewVideoPage();

    try {
      liveChatRenderer = evt_detail.pageData.response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer
    } catch (e) { }
    if (liveChatRenderer) {
      if (liveChatRenderer.isReplay === true) isReplay = true;
    }

    pageFetchedDataVideoId = ((((evt_detail || 0).pageData || 0).playerResponse || 0).videoDetails || 0).videoId || 0;


    const fvid = pageFetchedDataVideoId;
    const tyid = dpeChatRefreshCounter.inc();
    // proceedingChatFrameVideoID = '';
    // newVideoPageCACC = chatroomAttrCollapseCount;
    // console.debug('[tyt] debug ym-01-1')

    const getPromise = () => {
      return new Promise(resolve => {
        let mo = new MutationObserver(() => {
          if (resolve && mo) {
            mo.disconnect();
            mo.takeRecords();
            mo = null;
            resolve();
            resolve = null;
          }
        });
        mo && mo.observe(document.documentElement, { attributes: true, attributeFilter: ['sxmq8'] });
      });
    }

    const promise = getPromise();

    const rootDom = document.documentElement;
    rootDom.setAttribute('sxmq8', rootDom.getAttribute('sxmq8') === '1' ? '0' : '1');
    console.log('sxmq8 r3', document.documentElement.getAttribute('sxmq8') );

    promise.then(() => {

      const promise = getPromise();
      const rootDom = document.documentElement;
      rootDom.setAttribute('sxmq8', rootDom.getAttribute('sxmq8') === '1' ? '0' : '1');
      console.log('sxmq8 r4', document.documentElement.getAttribute('sxmq8') );

      promise.then(() => {

        // console.debug('[tyt] debug ym-01-2')
        if (fvid !== pageFetchedDataVideoId) return;

        // console.debug('[tyt] debug ym-01-3')
        if (tyid !== dpeChatRefreshCounter.valueOf()) return;

        // console.debug('[tyt] debug ym-01-4')
        dpeChatRefreshCounter.inc();
        const chat = document.querySelector('ytd-live-chat-frame#chat');
        if (chat && !chat.hasAttribute('collapsed')) {
          // proceedingChatFrameVideoID = fvid;

          // console.debug('[tyt] debug ym-01-5')


          // dpeNewUrlChat(chat); // force replace url

          const iframe = _querySelector.call(chat, 'body iframe.style-scope.ytd-live-chat-frame#chatframe');
          // console.log("iframe.xx",501,iframe)
          // showMessages_IframeLoaded && console.debug('[tyt.iframe] loaded 0D');
          if (iframe) Promise.resolve(iframe).then(iframeToVisible); // fix empty

        }

      });

    });


    const chatBlockR = liveChatRenderer ? (isReplay ? 3 : 1) : 0
    const initialDisplayState = liveChatRenderer ? liveChatRenderer.initialDisplayState : null;


    liveChatRenderer = null; // release memory for GC, just in case

    let f = () => {

      _console.log(932, 1, 1)
      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;

      _console.log(932, 1, 2)
      if (pageType !== 'watch') return;

      _console.log(932, 1, 3)


      let displayState = setupChatFrameDisplayState1(chatBlockR, initialDisplayState);

      let { attr_chatblock, attr_chatcollapsed, chatTypeChanged } = displayState;


      if (pageType === 'watch') { // reset info when hidden

        let elm_storeLastPanel = es.storeLastPanel;

        if (!elm_storeLastPanel) storeLastPanel = null;
        else if (!isDOMVisible(elm_storeLastPanel)) {
          storeLastPanel = null;
          ytBtnCloseEngagementPanels();
        }

      }

      if (chatTypeChanged) {

        if (attr_chatblock == 'chat$live' && notWaitingRoom()) {

          _console.log(932, 4)

          mtf_forceCheckLiveVideo_disable = 2;

          //console.log(3712,1)

          _disableComments();


        } else {

          const tabBtn = document.querySelector('[tyt-tab-content="#tab-comments"].tab-btn-hidden')
          if (tabBtn) {
            emptyCommentSection();
            _console.log(9360, 74);
            setTabBtnVisible(tabBtn, true);
          } else {
            setCommentSection(0);
          }

          mtf_forceCheckLiveVideo_disable = 0;

          _console.log(7234, 'comments_section_loaded = 0')
          restoreFetching();


        }


      } else {

        // restore Fetching only

        if (mtf_forceCheckLiveVideo_disable !== 2 && (attr_chatblock === false || attr_chatblock === 'chat$playback')) {

          emptyCommentSection();
          _console.log(9360, 77);
          mtf_forceCheckLiveVideo_disable = 0;
          _console.log(7235, 'comments_section_loaded = 0')
          restoreFetching();

        }

      }


      checkAndMakeNewCommentFetch();

    }

    f();

  }

  function setVideosTwoColumns(/** @type {number} */ flag, /** @type {boolean} */ bool) {

    //two columns to one column

    /*
        [placeholder-videos] ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy

        is-two-columns =""  => no is-two-columns
        
        
        
        [placeholder-videos] tp-yt-paper-spinner#spinner.style-scope.ytd-continuation-item-renderer
        
        no hidden => hidden =""
        
        
        [placeholder-videos] div#button.style-scope.ytd-continuation-item-renderer
        
        
        hidden ="" => no hidden
        

        */

    let cssSelector1 = '[placeholder-videos] ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy'

    let cssSelector2 = '[placeholder-videos] tp-yt-paper-spinner#spinner.style-scope.ytd-continuation-item-renderer'

    let cssSelector3 = '[placeholder-videos] div#button.style-scope.ytd-continuation-item-renderer'

    let res = {}
    if (flag & 1) {
      res.m1 = document.querySelector(cssSelector1)
      if (res.m1) wAttr(res.m1, 'is-two-columns', bool ? '' : false);
    }

    if (flag & 2) {
      res.m2 = document.querySelector(cssSelector2)
      if (res.m2) wAttr(res.m2, 'hidden', bool ? false : '');
    }

    if (flag & 4) {
      res.m3 = document.querySelector(cssSelector3)
      if (res.m3) wAttr(res.m3, 'hidden', bool ? '' : false);
    }

    return res


  }


  // ---------------------------------------------------------------------------------------------

  // ---- EVENTS ----

  let ytEventSequence = 0
  let formatDates = null

  function setupFormatDates(pageFetchedDataLocal) {

    formatDates = {}
    try {
      formatDates.publishDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.publishDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.uploadDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.uploadDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.publishDate2 = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.dateText.simpleText
    } catch (e) { }
    // 2022/12/31

    if (typeof formatDates.publishDate2 === 'string' && formatDates.publishDate2 !== formatDates.publishDate) {
      formatDates.publishDate = formatDates.publishDate2
      formatDates.uploadDate = null
    }

    try {
      formatDates.broadcastBeginAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.startTimestamp
    } catch (e) { }
    try {
      formatDates.broadcastEndAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.endTimestamp
    } catch (e) { }
    try {
      formatDates.isLiveNow = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.isLiveNow
    } catch (e) { }

  }

  function pageBeingFetched(evt) {

    let nodeName = (((evt || 0).target || 0).nodeName || '').toUpperCase()
    if (nodeName !== 'YTD-APP') return;

    const pageFetchedDataLocal = evt.detail;

    let d_page = ((pageFetchedDataLocal || 0).pageData || 0).page;
    if (!d_page) return;

    pageType = d_page;

    if (pageType !== 'watch') return

    let isFirstLoad = firstLoadStatus & 8;

    if (isFirstLoad) {
      firstLoadStatus -= 8;
      iframeLoadHookHandlerPromise.resolve();
      document.addEventListener('load', iframeLoadHookHandler, capturePassive);
      ytMicroEventsInit();
    }
    // ytMicroEventsInit set
    variableResets();

    if (isFirstLoad && ytEventSequence >= 2) {

      scriptletDeferred.debounce(() => {

        let docElement = document.documentElement
        if (docElement.hasAttribute('tabview-loaded')) {
          throw 'Tabview Youtube Duplicated';
        }
        docElement.setAttribute('tabview-loaded', '')

        Promise.resolve(docElement).then(docElement => {
          if (ytEventSequence >= 2) {
            sendToPageScript(docElement, 'tabview-ce-hack')
            docElement = null
          }
        });

      });

    }
    // tabview-loaded delay set

    setupFormatDates(pageFetchedDataLocal);

    const promiseChatDetails = Promise.resolve(pageFetchedDataLocal).then((pageFetchedDataLocal) => {
      if (ytEventSequence >= 2) {
        let liveChatRenderer = null;
        try {
          liveChatRenderer = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer
        } catch (e) { }
        chatroomDetails = liveChatRenderer ? extractInfoFromLiveChatRenderer(liveChatRenderer) : null;
      }
    }).then();


    let tmpElm = es.ytdFlexy;
    if (tmpElm && tmpElm.isConnected === true && tmpElm.nodeName.toLowerCase() === 'ytd-watch-flexy') {
      // currently, tmpElm is null; to be reviewed
    } else {
      // update global ref
      ytdFlexy = mWeakRef(document.querySelector('ytd-watch-flexy:not([hidden])') || document.querySelector('ytd-watch-flexy'));
    }
    tmpElm = null;

    if (!es.ytdFlexy) return;

    Promise.resolve(0).then(() => {

      const ytdFlexyElm = es.ytdFlexy; // shall be always non-null

      if (ytEventSequence >= 2 && pageRendered === 0 && ytdFlexyElm && ytdFlexyElm.isConnected === true) {

        // trigger renderDeferred.resolve();
        let elmPL = document.createElement('tabview-view-ploader');
        pageRendered = 1;
        // ytdFlexyElm.appendChild(elmPL);
        elementAppend.call(ytdFlexyElm, elmPL);
        // pageRendered keeps at 1 if the video is continuously playing at the background
        // pageRendered would not be resolve but will reset for each change of video

      } else if (ytEventSequence >= 2 && pageRendered === 1 && ytdFlexyElm && ytdFlexyElm.isConnected === true) {
        // 511, [3, 1, true]
      } else {
        console.warn(511, [ytEventSequence, pageRendered, !!ytdFlexyElm])
      }

    });

    let _pageFetchedDataLocal = pageFetchedDataLocal;
    promiseChatDetails.then(() => {

      const ytdFlexyElm = es.ytdFlexy;
      if (ytEventSequence >= 2 && ytdFlexyElm) {
        ytdFlexyElm.classList.toggle('tyt-chat-toggleable', !!chatroomDetails);
      }

      if (ytEventSequence >= 2) {

        discardableFn(() => { // assume tyt-deferred

          const pageFetchedDataLocal = _pageFetchedDataLocal;
          _pageFetchedDataLocal = null;
          if (ytEventSequence >= 2 && pageFetchedDataLocal !== null) {
            domInit_comments();
            newVideoPage(pageFetchedDataLocal);
          }

        });

      }

    });

    if (updateFlexyStateRequired) updateFlexyStateFn();

  }

  let pageSeqMutex = new Mutex()

  function pageSeq1(evt) {
    _navigateLoadDT = 0
    if (ytEventSequence !== 1) {
      ytEventSequence = 1
      pageSeqMutex.lockWith(unlock => {
        // regardless pageType
        pageBeingInit();
        unlock();
      })
    }
  }

  function pageSeq2(evt) {
    _navigateLoadDT = 0;

    if (ytEventSequence !== 1) {
      ytEventSequence = 1;
      pageSeqMutex.lockWith(unlock => {
        // regardless pageType
        pageBeingInit();
        unlock();
      })
    }
    if (ytEventSequence === 1) {
      ytEventSequence = 2;

      pageType = null;

      pageSeqMutex.lockWith(unlock => {
        // regardless pageType

        pageType = null;
        pageBeingFetched(evt);
        // ytMicroEventsInit set + tabview-loaded delay set

        if (pageType !== 'watch') {
          ytdFlexy = null;
          chatroomDetails = null;
        }

        Promise.resolve().then(() => {
          const isWatch = pageType === 'watch';
          const isEventSeqOK = ytEventSequence >= 2;
          if (!isWatch) {
            ytdFlexy = null;
            chatroomDetails = null;
          }
          if (!isWatch && isEventSeqOK) {
            variableResets();
            emptyCommentSection();
            tabsDeferred.reset();
            _pageBeingInit();
            tabsDeferred.resolve(); // for page initialization
          }
          if (isEventSeqOK) {
            document.documentElement.classList.toggle('tabview-normal-player', isWatch);
          }
        });

        if (_updateTimeAccum > 0) {
          const currentVideo = document.querySelector('#movie_player video[src]')
          let keep_viTime = false
          if (currentVideo && currentVideo.readyState > currentVideo.HAVE_CURRENT_DATA && currentVideo.currentTime > 2.2) {
            // allow miniview browsing
            keep_viTime = true
          }
          if (!keep_viTime) {
            _viTimeNum = 203;
            _updateTimeAccum = 0;
            delete document.head.dataset.viTime;
          }
        }

        unlock();
      })
    }

  }

  function pageSeq3(evt) {
    _navigateLoadDT = 0

    if (ytEventSequence === 2) {
      ytEventSequence = 3

      pageSeqMutex.lockWith(unlock => {
        if (pageType === 'watch') {
          // ytMicroEventsInit set + tabview-loaded delay set
          onNavigationEndAsync();
        }


        unlock();
      })
    }
  }


  document.addEventListener('yt-navigate-start', pageSeq1, bubblePassive)
  document.addEventListener('yt-navigate-cache', pageSeq1, bubblePassive)
  document.addEventListener('yt-navigate-redirect', pageSeq1, bubblePassive)
  document.addEventListener('yt-page-data-fetched', pageSeq2, bubblePassive)
  document.addEventListener("yt-navigate-finish", pageSeq3, bubblePassive)
  //yt-navigate-redirect
  //yt-page-data-fetched
  //yt-navigate-error
  //yt-navigate-start
  //yt-page-manager-navigate-start
  //yt-navigate
  //yt-navigate-cache

  globalHook('yt-page-data-fetched', generalLog901)
  //globalHook('yt-rendererstamper-finished',generalLog901)
  globalHook('yt-page-data-updated', generalLog901)
  globalHook('yt-player-updated', generalLog901)
  globalHook('yt-watch-comments-ready', generalLog901)
  globalHook('yt-page-type-changed', generalLog901)
  globalHook('data-changed', generalLog901)
  globalHook('yt-navigate-finish', generalLog901)
  globalHook('yt-navigate-redirect', generalLog901)
  globalHook('yt-navigate-error', generalLog901)
  globalHook('yt-navigate-start', generalLog901)
  globalHook('yt-page-manager-navigate-start', generalLog901)
  globalHook('yt-navigate', generalLog901)
  globalHook('yt-navigate-cache', generalLog901)


  // ---------------------------------------------------------------------------------------------


  function manualResizeT() {

    if (!scriptEnable) return;
    if (pageType !== 'watch') return;
    //lastResizeAt = Date.now();

    if ((wls.layoutStatus & LAYOUT_FULLSCREEN) === LAYOUT_FULLSCREEN) {

    } else if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === 0) {
      // single col

      getDMPromise().then(() => {
        singleColumnScrolling(true)
      });

    } else {
      // two cols

      updateFloatingSlider();

    }


  }
  //let lastResizeAt = 0;  
  const resizeCount = ControllerID();
  window.addEventListener('resize', function (evt) {

    if (evt.isTrusted === true) {
      //console.log(evt)
      let tcw = resizeCount.inc();
      Promise.resolve(0).then(() => {
        if (tcw !== resizeCount.valueOf()) return;
        setTimeout(() => {
          // avoid duplicate calling during resizing
          if (tcw !== resizeCount.valueOf()) return;

          resizeCount.set(0);
          manualResizeT();
          dispatchCommentRowResize();
        }, 160);
      });
    }

  }, bubblePassive)


  document.addEventListener("tyt-chat-popup", (evt) => {

    let detail = (evt || 0).detail
    if (!detail) return
    const { popuped } = detail
    if (typeof popuped !== 'boolean') return;

    let ytdFlexyElm = es.ytdFlexy
    if (!ytdFlexyElm) return

    ytdFlexyElm.classList.toggle('tyt-chat-popup', popuped)
    if (popuped === true) {
      enableLivePopupCheck = true;
      ytBtnSetTheater()
    } else {
      enableLivePopupCheck = false;
      ytBtnCancelTheater()
    }

  })



  let doingSelectionChange = false;
  document.addEventListener("keyup", (evt) => {
    if (!evt || !evt.target || !evt.key) return;
    if (doingSelectionChange) {
      if (!evt.shiftKey || evt.key.indexOf("Shift") == 0) {
        doingSelectionChange = false;
      }
    }
  })

  document.addEventListener("keydown", (evt) => {
    if (!evt || !evt.target || !evt.key) return;
    if (evt.shiftKey && evt.key.indexOf("Arrow") == 0) {
      try {
        if (doingSelectionChange || !window.getSelection().isCollapsed) {
          evt.stopImmediatePropagation();
          evt.stopPropagation();
          doingSelectionChange = true;
        }

      } catch (e) {

      }
    }
  }, true);

  let userActivation = false;

  document.addEventListener('click', function () {
    userActivation = true;


    if (isMiniviewForStickyHeadEnabled && !isStickyHeaderEnabled && userActivation && videoInsected) {
      getDMPromise().then(delayedClickHandler);
    }

  });

  // new comment count fetch way
  document.addEventListener('ytd-comments-data-changed', function (evt) {
    const hasData = (evt.detail || 0).hasData;
    if (hasData === false) {
      // this is much effective to clear the counting text
      emptyCommentSection();
    }
    innerDOMCommentsCountLoader(true);
    checkAndMakeNewCommentFetch();
  }, true);

  document.addEventListener('ytd-comments-header-changed', function () {
    const res = innerDOMCommentsCountLoader(true);
    if (res && res.newFound === true && res.length === 1 && res[0].isLatest && res[0].isNew) {
      if (renderDeferred.resolved && fetchCounts.new) {
        // force refresh count dom
        fetchCounts.fetched = false;
        Q.comments_section_loaded = 0;
      }
    }
    checkAndMakeNewCommentFetch();
  }, true);

  document.addEventListener("tabview-plugin-loaded", () => {

    scriptletDeferred.resolve();

    if (MINIVIEW_BROWSER_ENABLE) {
      sendToPageScript(document, "tabview-miniview-browser-enable");
    }


  }, false)

  if (isGMAvailable() && typeof GM_registerMenuCommand === 'function') {

    let dialog = null;
    function createDialog() {

      const _themeProps_ = {
        dialogBackgroundColor: '#f6f6f6',
        dialogBackgroundColorDark: '#23252a',
        backdropColor: '#b5b5b568',
        textColor: '#111111',
        textColorDark: '#f0f3f4',
        zIndex: 60000,
        fontSize: '10pt',
        dialogMinWidth: '32px',
        dialogMinHeight: '24px',
      };

      class VJSD extends VanillaJSDialog {

        get themeProps() {
          return _themeProps_
        }

        isDarkTheme() {
          return document.documentElement.hasAttribute('dark');
        }

        onBeforeShow() {
          const es = this.es;
          if ('checkboxSelectionDisplay' in es) {
            es.checkboxSelectionDisplay.textContent = '';
          }
          const setDefaultTabTick = (myDefaultTab) => {
            for (const checkbox of document.getElementsByName('tabview-tab-default')) {
              checkbox.checked = checkbox.value === myDefaultTab;
            }
          }
          function getDefaultTabBtnSetting(store) {
            if (!store) { } else {
              let myDefaultTab = store[key_default_tab];
              if (!myDefaultTab || typeof myDefaultTab !== 'string' || !/^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab)) {
              } else {
                if (document.querySelector(`.tab-btn[tyt-tab-content="${myDefaultTab}"]`)) return setDefaultTabTick(myDefaultTab);
              }
            }
            setDefaultTabTick(null);
          }
          let store = getStore();
          getDefaultTabBtnSetting(store);
        }

        onFirstCreation() {

          const S = this.S; /* this is the global method */

          /* on top of the setup function, override the icon widget on global method */
          S.widgets.icon = (iconTag) => {
            return S.ce('i', { className: 'vjsd-icon fa-solid fa-' + iconTag });
          }

          /* you might also overide `S.importCSS` by the use of Userscript Manager's import */
          S.importCSS(
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css#sha512=SgaqKKxJDQ/tAUAAXzvxZz33rmn7leYDYfBP+YoMRSENhf3zJyx3SBASt/OfeQwBHA1nxMis7mM3EV/oYT6Fdw==',
            // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/solid.min.css#sha512=yDUXOUWwbHH4ggxueDnC5vJv4tmfySpVdIcN1LksGZi8W8EVZv4uKGrQc0pVf66zS7LDhFJM7Zdeow1sw1/8Jw=='
          );

          /* load CSS files, etc - You might overide the `getTheme()` in VanillaJSDialog */
          this.themeSetup();
        }

        /* init is called after setup function is called */
        init() {
          const S = this.S; /* this is the global method */

          const es = this.es; /* this is a store for HTMLElements binded to this dialog */

          es.dialog = S.ce('div', {
            className: 'vjsd-dialog'
          }, {
            '__vjsd__': ''
          });

          es.dialog.append(
            es.header = S.ce('div', {
              className: 'vjsd-dialog-header vjsd-hflex'
            }),
            es.body = S.ce('div', {
              className: 'vjsd-dialog-body vjsd-gap-2 vjsd-overscroll-none vjsd-vflex'
            }),
            es.footer = S.ce('div', {
              className: 'vjsd-dialog-footer vjsd-hflex'
            }),

          );

          es.header.append(
            S.widgets.icon('circle-info', (a) => {

            }),
            S.widgets.title('Tabview Youtube - Change Default Tab', {
              className: 'vjsd-flex-fill'
            }),
            S.widgets.buttonIcon('square-xmark', {
              'vjsd-clickable': '#dialogXmark'
            })
          );

          const checkBoxChanged = () => {
            let elmChoice1 = [...document.getElementsByName('tabview-tab-default')].filter(e => e.checked).map(e => e.value);
            console.assert(elmChoice1.length <= 1);
            es.checkboxSelectionDisplay.textContent = elmChoice1.length === 1 ? `The default tab will be set to ${elmChoice1[0]}` : `The default tab will be reset.`;
          }

          es.body.append(
            S.widgets.labeledRadio('vjsd-checkbox1 vjsd-checkbox-tick', 'Info', (elmLabel, elmInput) => {
              elmInput.name = 'tabview-tab-default';
              elmInput.value = '#tab-info';
              es.checkbox1 = elmInput;
              elmInput.addEventListener('change', checkBoxChanged)
              elmLabel.style.fontSize = '200%';
            }),
            S.widgets.labeledRadio('vjsd-checkbox1 vjsd-checkbox-tick', 'Comment', (elmLabel, elmInput) => {
              elmInput.name = 'tabview-tab-default';
              elmInput.value = '#tab-comments';
              es.checkbox2 = elmInput;
              elmInput.addEventListener('change', checkBoxChanged)
              elmLabel.style.fontSize = '200%';
            }),
            S.widgets.labeledRadio('vjsd-checkbox1 vjsd-checkbox-tick', 'Video', (elmLabel, elmInput) => {
              elmInput.name = 'tabview-tab-default';
              elmInput.value = '#tab-videos';
              es.checkbox3 = elmInput;
              elmInput.addEventListener('change', checkBoxChanged)
              elmLabel.style.fontSize = '200%';
            }),
            es.checkboxSelectionDisplay = S.ce('div', { className: 'vjsd-custom-widget' })
          );

          const onXMarkClicked = () => {
            this.dismiss();
          }

          const onClearClicked = () => {
            es.checkbox1.checked = false;
            es.checkbox2.checked = false;
            es.checkbox3.checked = false;
            checkBoxChanged();
          }

          const onConfirmClicked = () => {
            let myDefaultTab = null;
            for (const checkbox of document.getElementsByName('tabview-tab-default')) {
              if (checkbox.checked) myDefaultTab = checkbox.value;
            }
            myDefaultTab = myDefaultTab || null;
            console.log(myDefaultTab)
            setMyDefaultTab(myDefaultTab);
            this.dismiss();
          }

          const onCancelClicked = () => {
            this.dismiss();
          }

          es.footer.append(
            es.clearButton = S.widgets.button('Clear', {
              'vjsd-clickable': '#clear'
            }),
            S.widgets.space(),
            S.widgets.button('Cancel', {
              'vjsd-clickable': '#cancel'
            }),
            S.widgets.button('Confirm', {
              'vjsd-clickable': '#confirm'
            }),
          )

          this.clickable('#cancel', onCancelClicked)
          this.clickable('#clear', onClearClicked)
          this.clickable('#confirm', onConfirmClicked)
          this.clickable('#dialogXmark', onXMarkClicked);

          this.backdrop = 'dismiss';
          document.body.appendChild(es.dialog)
        }
      }

      VJSD.setup1();
      return new VJSD();
    }

    GM_registerMenuCommand("Change Default Tab", function () {
      dialog = dialog || createDialog();
      dialog.show();
    });

    /*
  GM_registerMenuCommand("Default Tab: NULL", function () {
    setMyDefaultTab(null);
  });
  GM_registerMenuCommand("Default Tab: Info", function () {
    setMyDefaultTab("#tab-info");
  });
  GM_registerMenuCommand("Default Tab: Comments", function () {
    setMyDefaultTab("#tab-comments");
  });
  GM_registerMenuCommand("Default Tab: Video", function () {
    setMyDefaultTab("#tab-videos");
  });
  */
  }


  handleDOMAppear('#tabview-controller', () => { }); // dummy
  document.documentElement.appendChild(document.createElement('tabview-controller')).id = 'tabview-tabs-hide-controller';
  document.documentElement.appendChild(document.createElement('tabview-controller')).id = 'tabview-default-tab-controller';

  document.documentElement.setAttribute('plugin-tabview-youtube', `${scriptVersionForExternal}`)
  if (document.documentElement.getAttribute('tabview-unwrapjs')) {
    document.dispatchEvent(new CustomEvent("tabview-plugin-loaded"))
  }


  // function nestedObjectFlatten(prefix, obj) {
  //   let ret = {};
  //   let _prefix = prefix ? `${prefix}.` : '';
  //   let isObject = (obj && typeof obj == 'object' && obj.constructor.name == 'Object');
  //   let isArray = (obj && typeof obj == 'object' && obj.constructor.name == 'Array');
  //   const f = (k, v) => {
  //     let isObject = (v && typeof v == 'object' && v.constructor.name == 'Object');
  //     let isArray = (v && typeof v == 'object' && v.constructor.name == 'Array');
  //     if (isObject || isArray) {
  //       let r = nestedObjectFlatten(k, v)
  //       for (const w in r) {
  //         ret[`${_prefix}${w}`] = r[w];
  //       }
  //     } else {
  //       ret[`${_prefix}${k}`] = v;
  //     }
  //   }
  //   if (isObject) {
  //     for (const k in obj) {
  //       let v = obj[k];
  //       f(k, v);
  //     }
  //   } else if (isArray) {
  //     let idx = 0;
  //     for (const v of obj) {
  //       let k = `[${idx}]`;
  //       f(k, v);
  //       idx++;
  //     }
  //   }
  //   return ret;
  // }

  /*

  for(const p of document.querySelectorAll('ytd-watch-flexy *')){ let m = p.data; if(!m)continue; console.log(m)}

  function objec

  */


  //Object.keys($0).filter(key=>!(key in $0.constructor.prototype))

  //Object.getOwnPropertyNames(window).filter(k=>k.startsWith('HTML'))
  //Object.getOwnPropertyNames(window).filter(k=>k.startsWith('HTML')).filter(k=>$0 instanceof window[k])


  /* --------------------------- browser's bug in -webkit-box ----------------------------------------- */

  /*
   fix bug for comment section - version 1.8.7 
  This issue is the bug in browser's rendering
   I guess, this is due to the lines clamp with display:-webkit-box 
   use stupid coding to let it re-render when its content become visible
   
  /*

  ytd-expander[should-use-number-of-lines][collapsed] > #content.ytd-expander {
      color: var(--yt-spec-text-primary);
      display: -webkit-box;
      overflow: hidden;
      max-height: none;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--ytd-expander-max-lines, 4);
  }

  // v1.8.36 imposed a effective solution for fixing this bug

  */

  /* --------------------------- browser's bug in -webkit-box ----------------------------------------- */


  /**
   * 


f.initChildrenObserver=function(){var a=this;this.observer=new MutationObserver(function(){return a.childrenChanged()});
this.observer.observe(this.$.content,{subtree:!0,childList:!0,attributes:!0});this.childrenChanged()};
f.childrenChanged=function(){var a=this;this.alwaysToggleable?this.canToggle=this.alwaysToggleable:this.canToggleJobId||(this.canToggleJobId=window.requestAnimationFrame(function(){$h(function(){a.canToggleJobId=0;a.calculateCanCollapse()})}))};


f.onIronResize=function(){this.recomputeOnResize&&this.childrenChanged()};


onButtonClick_:function(){this.fire("yt-close-upsell-dialog")},
computeHasHeader_:function(a){return!!a.headerBackgroundImage}});var geb;var heb;var ieb;var jeb;var xI=function(){var a=L.apply(this,arguments)||this;a.alignAuto=!1;a.collapsed=!0;a.isToggled=!1;a.alwaysCollapsed=!1;a.canToggle=!0;a.collapsedHeight=80;a.disableToggle=!1;a.alwaysToggleable=!1;a.reversed=!1;a.shouldUseNumberOfLines=!1;a.recomputeOnResize=!1;a.canToggleJobId=0;return a};
n(xI,L);f=xI.prototype;f.alwaysToggleableChanged=function(){this.alwaysToggleable&&(this.canToggle=!0)};


f.calculateCanCollapse=function(){this.canToggle=this.shouldUseNumberOfLines?this.alwaysToggleable||this.$.content.offsetHeight<this.$.content.scrollHeight:this.alwaysToggleable||this.$.content.scrollHeight>this.collapsedHeight};
f.detachObserver=function(){this.observer&&this.observer.disconnect()};

   * 
   * 
   * 
   */


})({
  requestAnimationFrame: (typeof webkitRequestAnimationFrame === 'function' ? webkitRequestAnimationFrame : requestAnimationFrame),
  cancelAnimationFrame: (typeof webkitRequestAnimationFrame === 'function' ? webkitRequestAnimationFrame : requestAnimationFrame)
});
// console.timeEnd("Tabview Youtube Init Script")

//# sourceURL=debug://tabview-youtube/tabview.content.js
