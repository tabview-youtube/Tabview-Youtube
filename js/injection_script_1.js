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
function injection_script_1() {
  "use strict";

  if (!window || !window.IntersectionObserver || !window.Symbol) throw 'Please update your browser to use Tabview Youtube.';

  let __Promise__;
  try {
    __Promise__ = (async () => { })().constructor; // due to YouTube's Promise Hack
  } catch (e) {
    throw 'Please update your browser to use Tabview Youtube.';
  }


  const pageScripts = new Map();

  const FIX_liveChatPageUrl = 1; // 0 = no fix; 1 = fix all state

  let liveChatPageUrlCount = null;

  const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

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
  // const nodeFirstChild = fxOperator(Node.prototype, 'firstChild');
  // const nodeNextSibling = fxOperator(Node.prototype, 'nextSibling');

  // const elementQS = fxAPI(Element.prototype, 'querySelector');
  // const elementQSA = fxAPI(Element.prototype, 'querySelectorAll');


  /** @type {PromiseConstructor} */
  const Promise = __Promise__; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;
  const cppr = (o, p) => {
    let cnt = insp(o);
    return cnt && (p in cnt) ? cnt : o;
  };
  const cAlignHost = (o) => {
    let cnt = insp(o);
    return cnt && (('horizontalAlign' in cnt) || ('verticalAlign' in cnt)) ? cnt : o;
  };

  if (document.documentElement && document.documentElement.hasAttribute('tabview-unwrapjs')) {
    console.warn('Multiple instances of Tabview Youtube is attached. [0x7F02]')
    return;
  }

  const getYtdWatchFlexyElement = () => (document.querySelector('ytd-watch-flexy:not([hidden])') || document.querySelector('ytd-watch-flexy'));

  let byPassPause = false;

  HTMLVideoElement.prototype.pause = ((pause) => {
    return function () {
      if (arguments.length !== 0) return pause.apply(this, arguments); // fallback
      if (byPassPause) return;
      pause.call(this);
    }
  })(HTMLVideoElement.prototype.pause);


  const _querySelector = HTMLElement.prototype.__shady_native_querySelector || HTMLElement.prototype.querySelector;
  const _querySelectorAll = HTMLElement.prototype.__shady_native_querySelectorAll || HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;

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

  /** @type {globalThis.requestAnimationFrame} */
  const $requestAnimationFrame = (window.webkitRequestAnimationFrame || window.requestAnimationFrame).bind(window);

  /** @type {globalThis.cancelAnimationFrame} */
  const $cancelAnimationFrame = (window.webkitCancelAnimationFrame || window.cancelAnimationFrame).bind(window);

  const dispatchCustomEvent = (dom, type, detail) => {
    dom.dispatchEvent(detail ? new CustomEvent(type, { detail }) : new CustomEvent(type));
  }

  let _rafPromise = null;

  const getRAFPromise = () => _rafPromise || (_rafPromise = new Promise(resolve => {
    $requestAnimationFrame(hRes => {
      _rafPromise = null;
      resolve(hRes);
    });
  }));

  // /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  // /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);


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

  !window.TTP && (() => {
    // credit to Benjamin Philipp
    // original source: https://greasyfork.org/en/scripts/433051-trusted-types-helper
  
    // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------
  
    const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
    const prefix = `TTP`;
    var passThroughFunc = function (string, sink) {
      return string; // Anything passing through this function will be returned without change
    }
    var TTPName = "passthrough";
    var TTP_default, TTP = { createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc }; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
    var needsTrustedHTML = false;
    function doit() {
      try {
        if (typeof window.isSecureContext !== 'undefined' && window.isSecureContext) {
          if (window.trustedTypes && window.trustedTypes.createPolicy) {
            needsTrustedHTML = true;
            if (trustedTypes.defaultPolicy) {
              log("TT Default Policy exists");
              if (overwrite_default)
                TTP = window.trustedTypes.createPolicy("default", TTP);
              else
                TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
              TTP_default = trustedTypes.defaultPolicy;
  
              log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
            }
            else {
              TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
            }
            log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
          }
        }
      } catch (e) {
        log(e);
      }
    }
  
    function log(...args) {
      if ("undefined" != typeof (prefix) && !!prefix)
        args = [prefix + ":", ...args];
      if ("undefined" != typeof (debugging) && !!debugging)
        args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
      console.log(...args);
    }
  
    doit();
  
    // --------------------------------------------------- Trusted Types Helper ---------------------------------------------------
  
    window.TTP = TTP;
  
  })();
  
  function createHTML(s) {
    if (typeof TTP !== 'undefined' && typeof TTP.createHTML === 'function') return TTP.createHTML(s);
    return s;
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


  _setAttribute.call(document.documentElement, 'tabview-unwrapjs', '');

  const ytChatFrameSetup = new PromiseExternal();
  const ceHackDone = new PromiseExternal();
  let tabviewFixPopupRefitFn = null;

  let documentEventListen = (key, callback, ...args) => { // set to null afterwards to prevent incorrect coding
    document.addEventListener(key, callback, ...args);
  }

  let mediaModeLock = 0;
  const _getMediaElement = (i) => {
    if (mediaModeLock === 0) {
      let e = document.querySelector('.video-stream.html5-main-video') || document.querySelector('#movie_player video, #movie_player audio') || document.querySelector('body video[src], body audio[src]');
      if (e) {
        if (e.nodeName === 'VIDEO') mediaModeLock = 1;
        else if (e.nodeName === 'AUDIO') mediaModeLock = 2;
      }
    }
    if (!mediaModeLock) return null;
    if (mediaModeLock === 1) {
      switch (i) {
        case 1:
          return ('ytd-player#ytd-player video[src]');
        case 2:
          return ('ytd-browse[role="main"] video[src]');
        case 0:
        default:
          return ('#movie_player video[src]');
      }
    } else if (mediaModeLock === 2) {
      switch (i) {
        case 1:
          return ('ytd-player#ytd-player audio.video-stream.html5-main-video[src]');
        case 2:
          return ('ytd-browse[role="main"] audio.video-stream.html5-main-video[src]');
        case 0:
        default:
          return ('#movie_player audio.video-stream.html5-main-video[src]');
      }
    }
    return null;
  }
  const getMediaElement = (i) => {
    let s = _getMediaElement(i) || '';
    if (s) return document.querySelector(s);
    return null;
  }

  const getMediaElements = (i) => {
    let s = _getMediaElement(i) || '';
    if (s) return document.querySelectorAll(s);
    return [];
  }

  const _getIframeSrc = (src) => {
    let m = /(live_chat|live_chat_replay)\?continuation=([^&\/\=]+)(&[^&=?]+=[^&=?]+)*([&\/\=]\d+|)$/.exec(src || '')
    let pathname = null;
    let continuation = null;
    let spd = null;
    if (m) {
      pathname = m[1];
      continuation = m[2];
      spd = m[4];
    }
    return {
      src,
      pathname,
      continuation,
      spd
    };
  }

  /** @param {HTMLIFrameElement} iframe */
  const getIframeSrc = (iframe) => {

    let src = iframe.getAttribute('src');
    let r1 = _getIframeSrc(src);
    let { pathname, continuation, spd } = r1;

    if (!pathname || !continuation) return r1;


    let src2 = null;

    try {
      src2 = iframe.contentWindow.location.href
    } catch (e) { }
    src2 = src;

    if (typeof src2 === 'string' && src2 !== src) {
      let r2 = _getIframeSrc(src2);
      let readyState = null;
      try {
        readyState = iframe.contentDocument.readyState;
      } catch (e) { }

      if (m2 && r2.pathname === pathname && r2.continuation === continuation) {
        src = src2;
        spd = r2.spd;
      } else if (m2 && readyState === 'complete') {
        src = src2;
        pathname = r2.pathname;
        continuation = r2.continuation
        spd = r2.spd
      }
    }

    return {
      src,
      pathname,
      continuation,
      spd
    }

  }

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const clonedObj = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      clonedObj[key] = deepClone(value);
    }

    return clonedObj;
  }


  const xReplaceState = (s, u) => {
    try {
      history.replaceState(s, '', u);
    } catch (e) {
      // in case error occurs if replaceState is replaced by any external script / extension
    }
    if (s.endpoint) {
      try {
        const ytdAppElm = document.querySelector('ytd-app');
        const ytdAppCnt = insp(ytdAppElm);
        ytdAppCnt.replaceState(s.endpoint, '', u)
      } catch (e) {
      }
    }
  }

  const getForegroundPromise = () => {
    if (document.visibilityState === 'visible') return Promise.resolve();
    else {
      return getRAFPromise();
    }
  }

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

  const DEBUG_e32 = false;
  // const DO_REQ_CHANGE_FOR_NEXT_VIDEO = false;
  const FIX_UNCERTAIN_HISTORY_STATE = true;

  let _ceHack_calledOnce = false;
  let isLoadStartListened = false;



  DEBUG_e32 && console.log(9442, 103);

  let chatroomRendererElmWR = null

  pageScripts.set("tabview-expander-config", (target) => {

    if (!target) return;
    const expanderElm = target;

    const expanderCnt = insp(expanderElm);

    expanderCnt.canToggleJobId = 1;
    expanderCnt.alwaysToggleable = false;
    expanderCnt.recomputeOnResize = false;
    expanderCnt.isToggled = true;
    expanderCnt.canToggle = false;
    expanderCnt.collapsedHeight = 999999;

  });

  // top.tabviewSwitchVideoPage
  // top.tabviewDispatchEvent

  function globalFunc(f) {
    if (typeof f !== 'function') return null;
    let p = f.name || '';
    if (p.length >= 2) { } else return null;
    try {
      if (p in top) return false;
      top[p] = f;
      return true;
    } catch (e) {
      console.warn(e)
    }
  }




  class YTLiveProcessUnit {

    constructor() {
      /** @type {HTMLElement | null} */
      this.elmChat = null
      /** @type {HTMLIFrameElement | null} */
      this.elmChatFrame = null
      this.isChatReplay = null
      this.loadStatus = 0;
      this.clearVars();

      this.ytLiveMO = null
      this.adsState = 0


    }

    clearVars() {

      this.ytLiveChatAppElm = null
      /** @type {HTMLElement | null} */
      this.ytLiveChatRendererElm = null

      this.initialFetchReq = 0

    }

    initByIframe(iframe) {
      if ((iframe || 0).nodeName !== 'IFRAME') return;
      if (this.elmChatFrame === iframe) return; // this condition could be buggy; further handled in init() with (loadState & 7) === 5
      // console.log('initByIframe')
      // just to catch the iframe element; content loading determined by initByChatRenderer
      // if the iframe is changed, the initByChatRenderer must also be triggered and iframe load event will be also triggered before that.
      // if the iframe not changed, just content changed, initByChatRenderer will come out while iframe element remains the same
      this.elmChatFrame = iframe;
      // if(this.loadStatus)
      this.loadStatus |= 2; // 00000010
      this.init();
    }

    /** @param {HTMLElement | null} chatElm */
    initByChat(chatElm) {
      // this is triggered when collapsed / expanded / initial state
      // console.log('initByChat')

      if (chatElm === null) {
        this.elmChat = null;
        this.elmChatFrame = null;
        if (this.loadStatus & 1) this.loadStatus -= 1;
        if (this.loadStatus & 2) this.loadStatus -= 2;
        if (this.loadStatus & 4) this.loadStatus -= 4;
        this.clearVars();

      } else {

        if ((chatElm || 0).id !== 'chat') return;


        this.elmChat = chatElm;
        const elmChatCnt = insp(this.elmChat);
        if (elmChatCnt && elmChatCnt.connectedCallback && elmChatCnt.isAttached === false) {
          // by experience, this triggers in live playback only; livestream might implemented the correct mechanism to handle this.

          // disable this ...
          //elmChatCnt.connectedCallback();

          this.initialFetchReq = 21;
        }

        this.loadStatus |= 1 // 00000001
        if (chatElm.collapsed === true) {
          this.clearVars();
          if (this.loadStatus & 4) this.loadStatus -= 4
        } else if (this.initialFetchReq === 0) {
          this.initialFetchReq = 1;
        }

        // chat.classList.remove('tyt-chat-frame-ready')
        // chat.removeAttribute('tyt-iframe-loaded')
        this.init();
      }
    }

    lcrSetIsAdPlaying(bool) { // v4.66.0
      bool = !!bool;
      if (this.ytLiveChatRendererElm) {
        const lcrCnt = insp(this.ytLiveChatRendererElm);
        if (typeof lcrCnt._setIsAdPlaying === 'function' && lcrCnt._setIsAdPlaying.length === 1) {
          lcrCnt._setIsAdPlaying(bool);
        } else {
          console.log('yt-live-chat-renderer._setIsAdPlaying(a) is not found.');
        }
      }
      if (this.elmChat) {
        this.elmChat.classList.toggle('tyt-chat-ads-playing', bool);
      }
    }

    /** @param {boolean} b */
    setAdPlaying(b) { // see v4.2.3 & v4.2.4 ~ v4.3.x; v4.20.4 vs v4.30.0
      if (b) {
        this.adsState |= 2; // played once [2]
        if (this.adsState & 1) this.adsState -= 1; // reset pause [1]
        // 2|0 = 2
        this.lcrSetIsAdPlaying(true);
      } else {
        // action by checkAdPlaying
        if (this.adsState & 2) {
          this.adsState |= 1  // 2|1 = 3; played once & paused
        }
      }
    }

    checkAdPlaying(o) { // see v4.2.3 & v4.2.4 ~ v4.3.x; v4.20.4 vs v4.30.0
      if (!o) return
      const playerStateChange = typeof o['yt-player-state-change'] === 'number';
      if (playerStateChange) {
        if ((this.adsState & 3) === 3) {
          this.adsState = 0;
          this.lcrSetIsAdPlaying(false);
          this.init(); // init for adsState = 0
        }
      } else {
        const startID = o['yt-player-ad-start'] // string = 'xxx'
        const hasStartID = (!!startID);
        const endBool = o['yt-player-ad-end'] // boolean = true
        const hasEndBool = (!!endBool);
        const isAdsStateChange = !!(hasStartID ^ hasEndBool);  // either start or end
        isAdsStateChange && this.setAdPlaying(hasStartID);
      }
    }

    getPlayerFC() {
      let playerC = this.elmChat ? insp(this.elmChat).player : null;
      if (playerC) return playerC;

      let ytdFlexyElm = getYtdWatchFlexyElement() || 0;
      let cnt = insp(ytdFlexyElm);
      return cnt.player || 0;
    }

    initByChatRenderer(lcrElm) {
      // this is triggered when liveChatApp + Renderer ready

      // console.log('initByChatRenderer')
      if (!lcrElm) return;
      this.ytLiveChatAppElm = closestFromAnchor.call(lcrElm, 'yt-live-chat-app');
      if (!this.ytLiveChatAppElm) return;

      if (this.initialFetchReq >= 3) {
        // including  this.initialFetchReq === 21
        this.initialFetchReq = 0;
        this.initByChat(this.elmChat);
      }

      if ((this.loadStatus & 1) === 0) {
        this.ytLiveMOHandler();
      }

      this.ytLiveChatRendererElm = lcrElm; // for both playback replay and livestream
      chatroomRendererElmWR = mWeakRef(lcrElm); // avoid memory leak for live popup
      let playerFC = this.getPlayerFC();
      if (playerFC && typeof playerFC.getPresentingPlayerType === 'function') {
        const playerType = playerFC.getPresentingPlayerType();
        // 2 for ads
        // 1 for normal
        this.setAdPlaying(playerType === 2);
      }
      // console.log(771, this.adsState, this.ytLiveChatRendererElm.isAdPlaying)
      // playback replay: loading correct comments at specific time
      // livestream: control popup

      // this.setUpPlayerSeekCont();
      this.isChatReplay = this.isReplay();
      this.setupChatRenderer();
      this.loadStatus |= 4; // 00000100
      this.init();
    }

    ytLiveMOHandler() {
      // `this` is not available

      let ytdFlexyElm = getYtdWatchFlexyElement();
      if (!ytdFlexyElm) {
        console.warn('error F032');
      }
      let attr = ytdFlexyElm ? ytdFlexyElm.getAttribute('tyt-chat') : null;
      let chatElm = attr ? document.querySelector('ytd-live-chat-frame#chat') : null;
      // note: there is multiple triggering of this (with same final attr value);
      //       not sure whether the bug of tabview layout itself or the element is truly removed and reinserted.
      // the same attr would happen twice
      ytLivePU.initByChat(chatElm)
    }

    setupYtLiveMO() {
      if (this.ytLiveMO) return;
      this.ytLiveMO = new MutationObserver(this.ytLiveMOHandler);
      this.ytLiveMOHandler();
      let ytdFlexyElm = getYtdWatchFlexyElement();
      if (ytdFlexyElm) {
        this.ytLiveMO.observe(ytdFlexyElm, {
          attributes: true,
          attributeFilter: ["tyt-chat"],
          attributeOldValue: false,
          subtree: false,
          childList: false,
          characterData: false,
          characterDataOldValue: false
        })
      } else {
        console.warn('error F031');
      }
    }

    setupChatRenderer() {
      // only triggered in init

      const ytLivePU = this;

      if (this.isChatReplay) {
        const lcrCnt = insp(this.ytLiveChatRendererElm);
        if (lcrCnt && !lcrCnt._gIxmf) {
          lcrCnt._gIxmf = 1;
          if (typeof lcrCnt._setPlayerProgressSec === 'function' && lcrCnt._setPlayerProgressSec.length === 1) {
            lcrCnt._setPlayerProgressSec26 = lcrCnt._setPlayerProgressSec;
            lcrCnt._setPlayerProgressSec = function (x) {
              if (x < 1e-99) x = 1e-99
              let t = this._setPlayerProgressSec26.apply(this, arguments)
              return t
            };
          } else {
            console.log('yt-live-chat-renderer._setPlayerProgressSec(a) is not found.');
          }
        }
      }


      if (this.isChatReplay && !ytLivePU.queryCR('style#tyt-chatframe-css')) {
        let style = ytLivePU.ytLiveChatAppElm.ownerDocument.createElement('style')
        style.id = 'tyt-chatframe-css'
        style.textContent = `
          yt-live-chat-renderer[loading2] #chat.yt-live-chat-renderer::after {
            display: block;
          }
        `;

        elementAppend.call(ytLivePU.ytLiveChatAppElm, style);
      }

    }

    queryCR(query, inCR) {
      let elm = inCR ? this.ytLiveChatRendererElm : this.ytLiveChatAppElm;
      if (elm) return _querySelector.call(elm, query);
      return null
    }

    getEndPointClicker() {
      let p = this.queryCR('yt-live-chat-header-renderer a.yt-simple-endpoint[aria-selected="true"]', true)

      if (!p) return null
      return {
        // click: ()=>p.click()
        click: () => {

          const ytReloadContElm = _querySelector.call(p, 'yt-reload-continuation.style-scope.yt-dropdown-menu');
          const ytReloadContCnt = insp(ytReloadContElm);

          let getContinuationUrl = null;

          if (typeof ytReloadContCnt.getContinuationUrl === 'function') getContinuationUrl = ytReloadContCnt.getContinuationUrl.bind(ytReloadContCnt);
          else if (typeof ytReloadContElm.getContinuationUrl === 'function') getContinuationUrl = ytReloadContElm.getContinuationUrl.bind(ytReloadContElm);

          if (getContinuationUrl) {

            if (typeof ytReloadContCnt.fire === 'function') ytReloadContCnt.fire("yt-load-reload-continuation", getContinuationUrl);
            else if (typeof ytReloadContElm.fire === 'function') ytReloadContElm.fire("yt-load-reload-continuation", getContinuationUrl);

          }

        }
      }
    }

    isReplay() {
      const lcrCnt = insp(this.ytLiveChatRendererElm); // nullable
      const lcrData = lcrCnt.data || 0; // nullable
      return lcrData.continuations && lcrData.isReplay === true;
    }

    init() {
      if (this.adsState > 0) return;
      if ((this.loadStatus & 7) === 5 && this.elmChat !== null) {
        // usually not used
        // chat element found; cr found.
        // bug - no load event;
        const chatCnt = insp(this.elmChat);
        const iframe = (chatCnt.$ || chatCnt).chatframe;
        if (iframe) {
          this.elmChatFrame = null; // required
          this.initByIframe(iframe); // supplementary
          return; // init fire again in this.initByIframe
        }
      }
      if (!this.elmChat || !this.elmChatFrame) return;
      if (this.initialFetchReq === 1 && ((this.loadStatus & 6) === 6)) {

        if (this.isReplay() && this.getEndPointClicker()) {
          this.initialFetchReq = 2;
        } else {
          this.initialFetchReq = 3;
        }
      }

    }

  }


  const ytLivePU = new YTLiveProcessUnit()






  documentEventListen('tyt-engagement-panel-visibility-change', (evt) => {

    let arr = ((evt || 0).detail || 0)
    if (!arr) return
    if (!('length' in arr)) arr = [arr]

    let actions = []

    for (const entry of arr) {

      if (!entry) continue;

      let panelId = entry.panelId

      let toHide = entry.toHide
      let toShow = entry.toShow

      if (toHide === true && !toShow) {

        actions.push({
          "changeEngagementPanelVisibilityAction": {
            "targetId": panelId,
            "visibility": "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
          }
        })

      } else if (toShow === true && !toHide) {

        actions.push({
          "showEngagementPanelEndpoint": {
            "panelIdentifier": panelId
          }
        })

      }

      if (actions.length > 0) {
        const ytdWatchFlexy = getYtdWatchFlexyElement();
        const cnt = insp(ytdWatchFlexy);

        cnt.resolveCommand(
          {
            "signalServiceEndpoint": {
              "signal": "CLIENT_SIGNAL",
              "actions": actions
            }
          },

          {},
          false);
      }

    }

  }, false)


  const TRANSLATE_DEBUG = false;


  function getTranslate() {
    let snCache = new Map();

    if (TRANSLATE_DEBUG) {
      console.log(11)
    }


    /** @type {(str: string?) => string} */
    function _snippetText(str) {
      // str can be underfinded
      if (!str) return '';
      let res = snCache.get(str);
      if (res) return res;
      res = str.replace(/\u200b/g, '').replace(/[\xA0\x20]+/g, ' ').trim().replace(/\s*\n\s*/, '\n').trim();
      snCache.set(str, res);
      snCache.set(res, res);
      return res;
    }


    /** @type {(snippet: Object) => string} */
    function snippetText(snippet) {
      let runs = snippet.runs;
      if (runs.length === 1) return _snippetText(runs[0].text);

      let res = new Array(runs.length);
      let ci = 0;
      for (const s of runs) {
        res[ci++] = _snippetText(s.text);
      }
      return res.join('\n');
    }


    function _DEBUG_szz(t) {

      return t.map(x => ({
        t: x.transcriptSegmentRenderer.snippet.runs.map(x => x.text).join('//'),
        a: x.transcriptSegmentRenderer.startMs,
        b: x.transcriptSegmentRenderer.endMs
      }));
    }

    function translate(initialSegments) {
      // 2023.07.13 - fix initialSegments with transcriptSectionHeaderRenderer

      if (!initialSegments) return initialSegments;

      if (TRANSLATE_DEBUG) {
        console.log(12)
      }

      TRANSLATE_DEBUG && Promise.resolve(JSON.stringify(initialSegments)).then((r) => {

        let obj = JSON.parse(r);
        console.log(7558, 1, obj)
        return obj;
      }).then(p => {
        let obj = _DEBUG_szz(p)
        console.log(7558, 2, obj)

      })

      /** @type {Map<String, Object>} */
      let cacheTexts = new Map(); // avoid duplicate with javascript object properties
      //let mapRej = new WeakSet();

      let mh1 = new Map(); // avoid duplicate with javascript object properties
      // 1: ok
      // 2: abandoned effect text


      const fRes = [];

      const s8 = Symbol();

      for (const initialSegment of initialSegments) {
        const transcript = (initialSegment || 0).transcriptSegmentRenderer;
        if (!transcript) {
          // https://www.youtube.com/watch?v=dmHJJ5k_G-A - transcriptSectionHeaderRenderer
          fRes.push(initialSegment);
          continue;
        }

        const runs = transcript.snippet.runs
        if (!runs || runs.length === 0) {
          initialSegment[s8] = true;
          continue;
        }


        let startMs = (+transcript.startMs || 0); //integer
        let endMs = (+transcript.endMs || 0); //integer

        if (startMs === endMs) {
          // effect text
          // https://www.youtube.com/watch?v=Ud73fm4Uoq0
          //mapRej.add(initialSegment)
          continue;
        }
        if (endMs - startMs < 30) {
          continue;
        }

        const text = snippetText(transcript.snippet);
        const mh1e = mh1.get(text);
        if (mh1e == 2) continue;

        const entry = {
          startMs,
          endMs,
          initialSegment,
          text
        }


        if (!mh1e) {

          if (/^[,.\x60\x27\x22\u200b\xA0\x20;-]*$/.test(text)) {
            initialSegment[s8] = true;
            mh1.set(text, 2);
            //effect only
            // https://www.youtube.com/watch?v=zLak0dxBKpM
            //mapRej.add(initialSegment)
            continue;
          }
          mh1.set(text, 1);
        } else {

          let entryA

          if (mh1e === 1) {
            entryA = cacheTexts.get(text);

            if (entryA) {

              let timeDiff = entry.startMs - entryA.endMs;
              let bool = false;

              if (timeDiff >= 0) {

                if (timeDiff < 25) {

                  bool = true;
                } else if (timeDiff < 450 && entry.endMs - entry.startMs < 900) {
                  bool = true;
                } else if (timeDiff < 150 && entry.endMs - entry.startMs > 800) {
                  bool = true;
                }


                if (bool && entryA.endMs <= endMs && startMs <= endMs) {

                  // abandon the current entry.
                  // absorbed by previous entry
                  entryA.endMs = entry.endMs;
                  entryA.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs; // update fRes & initialSegments as well using object reference
                  //mapRej.add(entry.initialSegment);
                  continue;

                }

              } else if (entry.startMs < entryA.startMs && entryA.startMs < entry.endMs) {

                // abandon the current entry.
                // absorbed by previous entry
                if (entry.endsMs > entryA.endMs) {
                  entryA.endMs = entry.endMs;
                  entryA.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs; // update fRes & initialSegments as well using object reference
                }
                //mapRej.add(entry.initialSegment);
                continue;


              }


            }
          }


        }


        //if not abandoned
        cacheTexts.set(text, entry); //replace the previous valid entry object if any

        for (const s of runs) {
          s.text = _snippetText(s.text);
        }

        fRes.push(initialSegment);

      }

      Promise.resolve(0).then(() => {
        cacheTexts.clear();
        cacheTexts = null;
        mh1.clear();
        mh1 = null;
      });

      let sj_start = 0;
      const si_length = fRes.length;
      const sj_length = initialSegments.length;

      if (si_length === sj_length) {
        //no fix is required
        // ignore spacing fix
        return fRes;
      }

      // collect the abandon text to become second subtitle

      let invalid_sj = -1;
      for (let si = 0; si < si_length; si++) {
        const segment = fRes[si];
        let transcript = segment.transcriptSegmentRenderer;
        if (!transcript) continue; // e.g. transcriptSectionHeaderRenderer
        const runs = transcript.snippet.runs;
        if (runs.length > 1 || runs[0].text.includes('\n')) continue; // skip multi lines
        let main_startMs = (+transcript.startMs || 0);
        let main_endMs = (+transcript.endMs || 0);
        transcript = null;

        /** @type {Map<string, number>} */
        const tMap = new Map(); // avoid duplicate with javascript object properties

        // assume that it is asc-ordered array of key startMs;
        for (let sj = sj_start; sj < sj_length; sj++) {
          const initialSegment = initialSegments[sj];

          if (!initialSegment || initialSegment[s8]) continue; // should invalid_sj be set ?

          const transcriptSegementJ = initialSegment.transcriptSegmentRenderer;

          if (!transcriptSegementJ) {
            // https://www.youtube.com/watch?v=dmHJJ5k_G-A - transcriptSectionHeaderRenderer
            invalid_sj = sj; // should invalid_sj be set ?
            continue;
          }

          let startMs = (+transcriptSegementJ.startMs || 0)
          let isStartValid = startMs >= main_startMs;
          if (!isStartValid) {
            invalid_sj = sj;
            continue;
          }
          // isStartValid must be true
          if (startMs > main_endMs) {
            sj_start = invalid_sj + 1;
            break;
          }

          let endMs = (+transcriptSegementJ.endMs || 0)
          if (endMs <= main_endMs) {
            let mt = snippetText(transcriptSegementJ.snippet);
            let xv = tMap.get(mt) || 0;
            if (endMs >= startMs) {
              xv += 1 + (endMs - startMs);
            }
            tMap.set(mt, xv);
          }

        }

        if (tMap.size <= 1) continue; // no second line

        let rg = [...tMap.entries()] // N x 2 2D-array [string,number][]

        // https://www.youtube.com/watch?v=Ud73fm4Uoq0

        rg.sort((a, b) => b[1] - a[1]) //descending order of number

        let targetZ = rg[1][1];
        if (targetZ > 4) {
          let az = 0;
          let fail = false;
          for (let idx = 2, rgl = rg.length; idx < rgl; idx++) {
            az += rg[idx][1];
            if (az >= targetZ) {
              fail = true;
              break;
            }
          }
          if (!fail) {
            let nonSame = rg[1][0].replace(/\s/g, '') !== rg[0][0].replace(/\s/g, '');
            if (nonSame) {
              let a = rg[0][0];
              let b = _snippetText(runs[0].text);
              if (a === b) {
                runs.push({ text: (rg[1][0]) })
              }
            }
          }
        }
      }


      TRANSLATE_DEBUG && Promise.resolve(fRes).then((r) => {

        let obj = r;
        console.log(7559, 1, obj)
        return obj;
      }).then(p => {
        let obj = _DEBUG_szz(p)
        console.log(7559, 2, obj)

      })

      return fRes;

    }


    return translate

  }


  //const round = x => x + 0.5 << 0
  function getInsObserver() {


    let insObserver = null;
    if (window.IntersectionObserver) {


      let cmtWM = new WeakMap();

      let cmtObserver = new IntersectionObserver(function (entries, observer) {

        for (const entry of entries) {

          const threadRendererElm = entry.target;
          if (!threadRendererElm) continue;

          let h = entry.boundingClientRect.height

          let b1 = h > 10;
          let b2 = !entry.isIntersecting;
          if (!b1 && !b2) continue;

          let m = cmtWM.get(threadRendererElm);
          // m:string -> css for --tabview-cmt-height
          // m===-1: not intialized
          // m===-2: disabled
          if (m === -2) continue;


          if (b1) {
            // possible to get height even it is not intersecting

            let t = `${h.toFixed(3)}px` //123.456px
            if (m !== t) {
              cmtWM.set(threadRendererElm, t)
            }
            m = t;

          }

          // m:string -> css for --tabview-cmt-height

          if (m === -1) continue; // h is not available

          const style = threadRendererElm.style

          if (b2) {
            // set CSS rule when it leaves the visible region

            if (style.getPropertyValue("--tabview-cmt-height") !== m) {
              style.setProperty("--tabview-cmt-height", m)
            }

            threadRendererElm.classList.remove('tyt-visible-comment')

          } else {
            //invisible -> visible
            style.removeProperty("--tabview-cmt-height")
            threadRendererElm.classList.add('tyt-visible-comment')
          }

        }
      }, {
        threshold: [0],
        rootMargin: "-18px 0px -18px 0px" // before fully leave the visible region
      })

      const targets = []

      insObserver = new IntersectionObserver(function (entries, observer) {
        for (const entry of entries) {
          /// entry.target -> ytd-expander
          if (entry.isIntersecting) {
            let pElm = closestFromAnchor.call(entry.target, 'ytd-comment-thread-renderer');
            if (pElm && !cmtWM.has(pElm)) {
              let flag = -1;

              let cmRendererBGOFFSETED = closestFromAnchor.call(entry.target, 'ytd-comment-renderer#comment.ytd-comment-thread-renderer[style*="--ytd-decorated-comment-background-offset-"]');
              if (cmRendererBGOFFSETED) {
                // colored comment - https://www.youtube.com/watch?v=Ewnt9o7c1vo
                flag = -2;
              }

              cmtWM.set(pElm, flag);
              cmtObserver.observe(pElm)
            }
            targets.push(entry.target);
          }
        }
        Promise.resolve(0).then(() => {
          for (const target of targets) {
            target.calculateCanCollapse(true);
          }
          targets.length = 0
        })
      }, {
        threshold: [0],
        rootMargin: "750px 0px 750px 0px" // (top, right, bottom, left)  // +ve => enlarge intersection area
      })


    }


    return insObserver;


  }

  function ytChipCloudRendererMouseEnter() {
    getRAFPromise().then(() => {
      const cnt = insp(this);
      if (cnt.atStart === true) cnt.reset();
    });
  }


  function getInsObserverChipCloud() {


    let insObserver = null;
    if (window.IntersectionObserver) {

      let wm = new WeakMap();


      async function callReset(targetElm, value) {
        // target = yt-chip-cloud-renderer

        const cnt = insp(targetElm);

        if (wm.get(targetElm) !== value) {
          wm.set(targetElm, value);
          cnt.reset();
          if (!targetElm.hasAttribute('QNJMC')) {
            _setAttribute.call(targetElm, 'QNJMC', '');
            targetElm.addEventListener('mouseenter', ytChipCloudRendererMouseEnter, false);
          }
        }

        setTimeout(() => {
          if (cnt.atStart === true) cnt.reset();
        }, 160);

        cnt.onResize && cnt.onResize();
        // console.log(target, 332)

      }

      insObserver = new IntersectionObserver(function (entries, observer) {

        for (const entry of entries) {

          let h = entry.boundingClientRect.height
          if (h > 10 && entry.isIntersecting) {
            // possible to get height even it is not intersecting
            const target = entry.target;
            const cnt = insp(target);
            if (cnt && cnt.reset) {
              let area = Math.round(entry.boundingClientRect.width * entry.boundingClientRect.height);
              if (area > 10) {
                callReset(target, area) // yt-chip-cloud-renderer
              }
            }

          }

        }
      }, {
        threshold: [0],
        rootMargin: "0px 0px 0px 0px" // before fully leave the visible region
      })


    }


    return insObserver;


  }


  function getMutObserverChipCloud() {


    let mutObserver = null;
    if (window.MutationObserver) {

      let wm = new WeakMap();

      async function callReset(targetElm, value) {
        // target = yt-chip-cloud-renderer

        const cnt = insp(targetElm);
        if (wm.get(targetElm) !== value) {
          wm.set(targetElm, value)
          cnt.reset();
        }
        setTimeout(() => {
          if (cnt.atStart === true) cnt.reset();
        }, 160);
      }

      let t = 0;
      let cid_mset = 0;
      function mSet(targetElm) {
        // target = yt-chip-cloud-renderer

        let c = Date.now();
        t = c;
        if (cid_mset) clearTimeout(cid_mset);
        cid_mset = setTimeout(() => {

          if (t !== c) return;

          let chips = _querySelector.call(targetElm, 'iron-selector#chips');

          if (!chips) return;

          callReset(targetElm, chips.offsetWidth)

        }, 160)

      }

      mutObserver = new MutationObserver(function (mutationList, observer) {
        for (const mutation of mutationList) {
          let target = mutation.target;
          target = target ? (closestFromAnchor.call(target, 'yt-chip-cloud-renderer') || 0) : 0;
          const cnt = insp(target);
          if (cnt && cnt.reset) {
            mSet(target);
          }
        }
      })

    }

    return mutObserver;
  }


  // /-** @param {Document} cDoc *-/
  // const cDocReadyStatePromise = (cDoc) => {
  //   if (cDoc.readyState !== 'loading') return;
  //   return new Promise(resolve => {
  //     cDoc.addEventListener('readystatechange', function () {
  //       if (cDoc && cDoc.readyState && cDoc.readyState !== 'loading') {
  //         cDoc = null;
  //         resolve && resolve();
  //         resolve = null;
  //       }
  //     }, false);
  //   });
  // }


  let pageID = 0;

  let pageType = null;

  function onPageFetched(evt) {
    dsMgr._dsToggleButtonRenderer.i8KBd = 1;
    pageType = ((evt.detail || 0).pageData || 0).page;
  }

  let _mceu0 = 0;
  function onPageFinished(evt) {
    _mceu0 = Date.now() % 31536000000;
    if ((pageID % 2) === 1) {
      pageID++;
      translateHanlder = null;  // release the memory used for previous page
      Promise.resolve(0).then(() => {
        translateHanlder = getTranslate(); // release the memory used for previous page
      });

      let ds = document.querySelector('ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)')
      if (ds && insp(ds).isAttached === true) {
      } else {
        dsMgr._lastDSVideo = null; // for next video page
      }
      // console.log(!!ytLivePU.elmChat, ytLivePU.elmChat && !document.contains(ytLivePU.elmChat))
    }
  }


  function pageLoad(evt) {
    if ((pageID % 2) === 0) {
      pageID++;
    }
  }

  document.addEventListener('yt-navigate-start', pageLoad)
  document.addEventListener('yt-navigate-cache', pageLoad)
  document.addEventListener('yt-navigate-redirect', pageLoad)
  document.addEventListener('yt-page-data-fetched', onPageFetched)
  document.addEventListener('yt-navigate-finish', onPageFinished)



  let translateHanlder = null;


  // ========================================================================================================

  let __debouncerResolve__ = null;
  let __targetVideoProgress__ = null;
  const { iframeDocToLiveChat, initDebouncer, createLatestProgressObject } = (() => {
    const iframeToLiveChatWM = new WeakMap();
    const initDebouncer = () => {
      let debouncer = document.querySelector('tabview-debouncer') || document.createElement('tabview-debouncer');
      debouncer.addEventListener('animationiteration', function () {
        const f = __debouncerResolve__;
        if (f) {
          __debouncerResolve__ = null;
          f();
        }
      }, { capture: false, passive: false });
      document.documentElement.appendChild(debouncer);
      return debouncer;
    }
    const createLatestProgressObject = () => {
      const o = {};
      Object.defineProperty(o, 'yt-player-video-progress', {
        get() {
          return __targetVideoProgress__;
        },
        set(nv) {
          return true;
        },
        enumerable: true,
        configurable: true
      });
      return o
    }
    const iframeDocToLiveChat = (doc) => {
      let chatApp = iframeToLiveChatWM.get(doc)
      if (!chatApp || chatApp.isConnected === false) {
        chatApp = doc.querySelector('yt-live-chat-app')
        if (chatApp) iframeToLiveChatWM.set(doc, chatApp);
      }
      return chatApp;
    };
    return { iframeDocToLiveChat, initDebouncer, createLatestProgressObject }
  })();

  /* added in 2023.06.25 */
  async function fixLiveChatToggleButton() {


    const chatElm = document.querySelector('ytd-live-chat-frame');
    if (!chatElm) return;
    const chatCnt = insp(chatElm);
    let initialDisplayState = null;
    try {
      initialDisplayState = chatCnt.data.liveChatRenderer.initialDisplayState
    } catch (e) { }
    if (typeof initialDisplayState !== 'string') return null;

    const btnElm = _querySelector.call(chatElm, 'ytd-toggle-button-renderer');
    const btnCnt = insp(btnElm);
    const btnData = (btnCnt || 0).data;
    if (!btnData) return null;
    let isToggled = btnData.isToggled === true;

    let collapsed = chatCnt.collapsed;
    if (typeof collapsed !== 'boolean') return null;

    let b = false;
    if (initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_EXPANDED' && collapsed === true && isToggled === false) {
      b = true;
    } else if (initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_EXPANDED' && collapsed === false && isToggled === true) {
      b = true;
    } else if (initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED' && collapsed === false && isToggled === false) {
      b = true;
    } else if (initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED' && collapsed === true && isToggled === true) {
      b = true;
    }
    if (b) {
      btnCnt.data = Object.assign({}, btnData, { isToggled: !isToggled });
    }

  }

  // function fixSrc(src) {
  //   // cause of bug: unknown
  //   if (src && src.length > 253) {
  //     let m = /(^[^\s\%]+)continuation=([\w\-]{120,})(\%3D|\%253D)+\2(\%3D|\%253D)+(&[^\s\%]*|$)/.exec(src);
  //     if (m) {
  //       src = `${m[1]}continuation=${m[2]}&${m[5]}`;
  //     }
  //   }
  //   return src;
  // }


  const isCustomElementsProvided = typeof customElements !== "undefined" && typeof (customElements || 0).whenDefined === "function";

  const promiseForCustomYtElementsReady = isCustomElementsProvided ? Promise.resolve(0) : new Promise((callback) => {
    const EVENT_KEY_ON_REGISTRY_READY = "ytI-ce-registry-created";
    if (typeof customElements === 'undefined') {
      if (!('__CE_registry' in document)) {
        // https://github.com/webcomponents/polyfills/
        Object.defineProperty(document, '__CE_registry', {
          get() {
            // return undefined
          },
          set(nv) {
            if (typeof nv == 'object') {
              delete this.__CE_registry;
              this.__CE_registry = nv;
              this.dispatchEvent(new CustomEvent(EVENT_KEY_ON_REGISTRY_READY));
            }
            return true;
          },
          enumerable: false,
          configurable: true
        })
      }
      let eventHandler = (evt) => {
        document.removeEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
        const f = callback;
        callback = null;
        eventHandler = null;
        f();
      };
      document.addEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
    } else {
      callback();
    }
  });


  const _retrieveCE = async (nodeName) => {
    try {
      isCustomElementsProvided || (await promiseForCustomYtElementsReady);
      await customElements.whenDefined(nodeName);
    } catch (e) {
      console.warn(e);
    }
  }


  const retrieveCE = async (nodeName) => {
    try {
      isCustomElementsProvided || (await promiseForCustomYtElementsReady);
      await customElements.whenDefined(nodeName);
      const dummy = document.querySelector(nodeName) || document.createElement(nodeName);
      const cProto = insp(dummy).constructor.prototype;
      return cProto;
    } catch (e) {
      console.warn(e);
    }
  }

  function ceHackExecution() {

    console.debug('[tyt] ce-hack');

    let s1 = Symbol();
    //let s2 = Symbol();

    // note: after content expanded, resizing window will casue the "collapse" feature disappears.
    // this.$.content.scrollHeight>this.collapsedHeight  is used for recomputeOnResize = true 

    // new browser - 84>80 would not lead to line clamp [as using -webkit-line-clamp]
    // this.$.content.offsetHeight<this.$.content.scrollHeight is not working for collapsed content

    // f.calculateCanCollapse=function(){this.canToggle=this.shouldUseNumberOfLines?this.alwaysToggleable||this.$.content.offsetHeight<this.$.content.scrollHeight:this.alwaysToggleable||this.$.content.scrollHeight>this.collapsedHeight};
    // e.calculateCanCollapse=function(){this.canToggle=this.shouldUseNumberOfLines?this.alwaysToggleable||this.$.content.offsetHeight<this.$.content.scrollHeight:this.alwaysToggleable||this.$.content.scrollHeight>this.collapsedHeight};
    // const funcCanCollapse = function () { this.canToggle = this.shouldUseNumberOfLines && (this.alwaysCollapsed || this.collapsed) ? this.alwaysToggleable || this.$.content.offsetHeight < this.$.content.scrollHeight : this.alwaysToggleable || this.$.content.scrollHeight > this.collapsedHeight };


    const funcCanCollapse = function (s) {
      if (!s) return;
      this.canToggle = this.shouldUseNumberOfLines && (this.alwaysCollapsed || this.collapsed)
        ? this.alwaysToggleable || this.$.content.offsetHeight < this.$.content.scrollHeight
        : this.alwaysToggleable || this.$.content.scrollHeight > this.collapsedHeight
    };

    const insObserver = getInsObserver();


    function checkNoOldSecondaryData() {

      const config = (window.yt || 0).config_ || (window.ytcfg || 0).data_;
      if (config) {
        const EXPERIMENT_FLAGS = config.EXPERIMENT_FLAGS;
        const EXPERIMENTS_FORCED_FLAGS = config.EXPERIMENTS_FORCED_FLAGS;
        let b = false;
        if (EXPERIMENT_FLAGS && EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data) {

          b = true;
        } else if (EXPERIMENTS_FORCED_FLAGS && EXPERIMENTS_FORCED_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data) {

          b = true;
        }

        if (b) {
          _setAttribute.call(document.documentElement, 'tabview-no-old-secondary-data', '');
          const p = document.querySelector('body ytd-watch-flexy.style-scope:not([hidden])');
          if (p) p.appendChild(document.createElement('tabview-no-old-secondary-data'));
        }
      }
    }


    retrieveCE('ytd-expander').then((cProto) => {

      Promise.resolve().then(checkNoOldSecondaryData);

      let keyDefined = 'recomputeOnResize' in cProto;
      // recomputeOnResize is just value assignment after "_initializeProperties()"
      if (keyDefined) console.warn('recomputeOnResize is defined in ytd-expander.');

      Object.defineProperty(cProto, 'recomputeOnResize', {
        get() {
          if (this.calculateCanCollapse !== funcCanCollapse) {
            this.calculateCanCollapse = funcCanCollapse
            if (insObserver) insObserver.observe(this.hostElement || this) // throw TypeError if get from prototype.
          }
          return this[s1];
        },
        set(nv) {
          if (this.calculateCanCollapse !== funcCanCollapse) {
            this.calculateCanCollapse = funcCanCollapse
            if (insObserver) insObserver.observe(this.hostElement || this)
          }
          if (nv === false) nv = true;
          // console.log(591);
          this[s1] = nv;
        },
        enumerable: false,
        configurable: false // if redefine by YouTube, error comes and change the coding
      });

    });


    retrieveCE('ytd-structured-description-content-renderer').then((cProto) => {

      if ('scrollToSection' in cProto && typeof cProto.scrollToSection === 'function' && !cProto.scrollToSection12 && cProto.scrollToSection.length === 1) {

        // related to tabviewInfoTogglerOnClick

        cProto.scrollToSection12 = cProto.scrollToSection;

        async function scrollToSection(p, nodeInTab) {

          let btn = document.querySelector('[tyt-tab-content="#tab-info"]:not(.active)');
          if (btn) {
            btn.click();
          }
          await getDMPromise();

          if (p instanceof HTMLElement) {
            if (!document.fullscreenElement) p.scrollIntoView();
          } else {
            nodeInTab.scrollToSection12(a);
          }

        }

        cProto.scrollToSection = function (a) {
          const hostElement = this.hostElement;
          if (hostElement instanceof HTMLElement && HTMLElement.prototype.closest.call(hostElement, 'ytd-watch-metadata.ytd-watch-flexy')) {
            const nodeInTabElm = document.querySelector('#tab-info ytd-structured-description-content-renderer');
            const nodeInTabCnt = insp(nodeInTabElm);
            if (nodeInTabCnt && 'scrollToSection' in nodeInTabCnt && 'scrollToSection12' in nodeInTabCnt) {
              // let tab = HTMLElement.prototype.closest.call(nodeInTab, '#tab-info');
              let p = null;
              try {
                p = nodeInTabCnt.getSectionElement(a);
              } catch (e) {

              }
              scrollToSection(p, nodeInTabCnt);
              return;
            }
          }
          return this.scrollToSection12(a);
        }




      }

    });




    const s6 = Symbol();

    // assume initialTranscriptsRenderer is not called before ceHack()

    getRAFPromise().then(() => {
      if (translateHanlder === null)
        translateHanlder = getTranslate();
    });


    retrieveCE('ytd-transcript-search-panel-renderer').then((cProto) => {

      let keyDefined = 'initialTranscriptsRenderer' in cProto;
      // initialTranscriptsRenderer is just value assignment after "_initializeProperties()"
      if (keyDefined) console.warn('initialTranscriptsRenderer is defined in ytd-transcript-search-panel-renderer.');
      Object.defineProperty(cProto, 'initialTranscriptsRenderer', {
        get() {
          return this.__$$initialTranscriptsRenderer$$__
        },
        set(nv) {
          try {

            if (nv && nv.initialSegments && !nv.initialSegments[s6]) {
              nv[s6] = true;

              if (translateHanlder !== null) {
                nv.initialSegments = translateHanlder(nv.initialSegments)
              }
            }

          } catch (e) {
            console.log('Tabview Error', e)
          }
          this.__$$initialTranscriptsRenderer$$__ = nv;
        },
        enumerable: false,
        configurable: false // if redefine by YouTube, error comes and change the coding
      })
    });


    retrieveCE('ytd-live-chat-frame').then((cProto) => {

      let keyDefined = 'postToContentWindow' in cProto;
      // postToContentWindow is property defined during "_initializeProperties()"
      if (!keyDefined) console.warn('postToContentWindow is not defined in ytd-live-chat-frame.');
      if (typeof cProto.__$$postToContentWindow$$__ === 'function') console.warn('__$$postToContentWindow$$__ is already defined in ytd-live-chat-frame.');
      if (typeof cProto.postToContentWindow !== 'function' || cProto.postToContentWindow.length !== 1) console.warn('postToContentWindow cannot be altered');


      if (typeof cProto.__$$urlChanged$$__ === 'function') console.warn('__$$urlChanged$$__ is already defined in ytd-live-chat-frame.');
      if (typeof cProto.urlChanged !== 'function' || cProto.urlChanged.length !== 0) console.warn('urlChanged cannot be altered');

      if (typeof cProto.urlChanged === 'function' && !cProto.urlChanged66 && !cProto.urlChangedAsync12) {

        cProto.urlChanged66 = cProto.urlChanged;
        let ath = 0;
        cProto.urlChangedAsync12 = async function () {
          if (ath > 1e9) ath = 9;
          const t = ++ath;
          const chatframe = this.chatframe || (this.$ || 0).chatframe || 0;
          if (chatframe) {
            if (chatframe.contentDocument === null) await Promise.resolve('#').catch(console.warn);
            if (t !== ath) return;
            await (new Promise(r => window.setTimeout.call(window, r, '1')).catch(console.warn));
            if (t !== ath) return;
            await new Promise(resolve => {
              (new IntersectionObserver((_, observer) => {
                observer.disconnect();
                resolve('#');
              })).observe(chatframe);
            });
            if (t !== ath) return;
          }
          this.urlChanged66();
        }
        cProto.urlChanged = function () {
          this.urlChangedAsync12();
        }

      }

      cProto.__$$urlChanged$$__ = cProto.urlChanged;


      cProto.urlChanged = function () {
        console.log('[tyt] urlChanged()');
        this.__urlChanged_url82__ = this.url;
        return this.__$$urlChanged$$__();
      }

      cProto.__$$postToContentWindow$$__ = cProto.postToContentWindow;

      initDebouncer();

      const latestProgressObject = createLatestProgressObject();

      const pendingTasks = [];
      let promisePostContent = Promise.resolve();
      cProto.__postToContentWindowK__ = function (o) {
        pendingTasks.push(o);
        if (pendingTasks.length > 1) return;
        promisePostContent = promisePostContent.then(() => new Promise(async (unlock) => {

          const iframe = this ? ((this.$ || this).chatframe || 0) : 0;

          const tasks = pendingTasks.length === 1 ? [pendingTasks[0]] : pendingTasks.slice(0);
          pendingTasks.length = 0;

          if (this.isAttached === true && iframe.isConnected === true) {

            let lastTaskObject = null;
            for (const taskObject of tasks) {
              if (lastTaskObject === taskObject) continue;
              lastTaskObject = taskObject;
              const convertedObject = latestProgressObject == taskObject ? {
                'yt-player-video-progress': __targetVideoProgress__
              } : taskObject;
              this.__$$postToContentWindow$$__(convertedObject);
              await new Promise(r => setTimeout(r, 1));
            }

          }

          __debouncerResolve__ = unlock;

        })).catch(console.warn);

      };
      cProto.postToContentWindow = function (o) {
        if (!o || typeof o !== 'object') return;

        const iframe = this ? ((this.$ || this).chatframe || 0) : 0;
        if (iframe) {
          // only do hacking when iframe is defined
          let doc = null;
          try {
            doc = iframe.contentDocument
          } catch (e) { }
          if (!doc) return;

          const chatApp = iframeDocToLiveChat(doc);
          if (!chatApp) return;

          if ('yt-player-video-progress' in o) {
            let progress = o['yt-player-video-progress'];
            if (typeof progress !== 'number') {
              if (+progress > 1e-9) {
                console.log('incorrect type for yt-player-video-progress (01)', progress);
                progress = +progress;
              } else {
                console.log('incorrect type for yt-player-video-progress (02)', progress);
                progress = -1;
              }
            }
            if (progress > -1) {
              __targetVideoProgress__ = progress;
              return this.__postToContentWindowK__.call(this, latestProgressObject);
            }
          } else {
            // o['yt-player-state-change'] === 'number';
            // o['yt-player-ad-start'] // string = 'xxx'
            // o['yt-player-ad-end'] // boolean = true
            ytLivePU.checkAdPlaying(o);
          }

        }

        return this.__postToContentWindowK__.apply(this, arguments);
      }


      if (FIX_liveChatPageUrl >= 1 && typeof cProto.liveChatPageUrl === 'function' && !cProto.liveChatPageUrl159 && cProto.liveChatPageUrl.length === 4) {
        // fireSeekContinuationAtCurrentProgressDone817 related
        // urlChanged realted
        cProto.liveChatPageUrl159 = cProto.liveChatPageUrl;
        let lastUrl = null;
        liveChatPageUrlCount = 1;
        if (FIX_liveChatPageUrl === 1) { // (baseUrl, collapsed, data, forceDarkTheme)
          cProto.__IframeResetReady__ = function (ed) {
            if (this.url !== ed) {
              /** @type {DOMTokenList | null} */
              const classList = (this.hostElement || 0).classList;
              if (classList && classList.contains('tyt-chat-frame-ready')) {
                classList.remove('tyt-chat-frame-ready');
              }
            }
          };
          // liveChatPageUrl(baseUrl, collapsed, data, forceDarkTheme);
          cProto.liveChatPageUrl = function (a, b, c, d) {

            const chatframe = this.chatframe || (this.$ || 0).chatframe;

            if (!c && lastUrl && chatframe) return lastUrl; // prevent immediate url change due to data change
            if (!chatframe) c = null; // intermediate (not yet ready)
            let ed = this.liveChatPageUrl159(a, b, c, d);
            if (ed && ed.includes('/live_chat') && ed.includes('continuation=')) {
              // force url change
              const mceu0 = _mceu0;
              ed = ed.replace(/&mceu=\d+/, '');
              ed = ed.replace(/continuation=[^=&\s?]+/, (_) => {
                return `${_}&mceu=${((performance.timeOrigin + mceu0) % 31536000000)}`
              });
            }

            if (!chatframe) return ed; // intermediate (not yet ready)

            if (!ed || ed.length < 12) { // empty url
              if (b && c && c._uepoxvqe === lastUrl) { // collapsed, same url
                ed = lastUrl;
              } else { // empty url is confirmed, data is provided
                lastUrl = null;
                if (this.__IframeResetReady__) this.__IframeResetReady__(ed);
              }
            } else {
              if (ed.length > 33 && location.origin === 'https://www.youtube.com' && ed.startsWith('https://www.youtube.com/live_chat')) {
                ed = ed.substring(23);
              }
              if (lastUrl !== ed && c) {
                lastUrl = ed;
                c._uepoxvqe = ed;
                liveChatPageUrlCount++;
                if (liveChatPageUrlCount > 1e9) liveChatPageUrlCount = 9;
                if (this.__IframeResetReady__) this.__IframeResetReady__(ed);
              }
            }
            return ed;
          };
        }
        console.debug(`[tyt] FIX_liveChatPageUrl = ${FIX_liveChatPageUrl}`);
      }


      ytChatFrameSetup.resolve();

    });



    let s32 = Symbol();
    let insObserverChipCloud = getInsObserverChipCloud();
    let mutObserverChipCloud = getMutObserverChipCloud();
    // yt-chip-cloud-renderer 


    retrieveCE('yt-chip-cloud-renderer').then((cProto) => {

      let keyDefined = 'boundChipCloudChipScrollIntoView' in cProto;
      // boundChipCloudChipScrollIntoView is just value assignment after "_initializeProperties()"
      if (keyDefined) console.warn('boundChipCloudChipScrollIntoView is defined in yt-chip-cloud-renderer.');
      Object.defineProperty(cProto, 'boundChipCloudChipScrollIntoView', {
        get() {
          return this[s32];
        },
        set(nv) {
          if (insObserverChipCloud) insObserverChipCloud.observe(this.hostElement || this);
          if (mutObserverChipCloud) mutObserverChipCloud.observe(this.hostElement || this, {
            attributes: false, childList: true, subtree: true
          });
          this[s32] = nv;
        },
        enumerable: false,
        configurable: false // if redefine by YouTube, error comes and change the coding
      });


    });

    const getProto = (element) => {
      let proto = null;
      if (element) {
        proto = insp(element).constructor.prototype;
      }
      return proto || null;
    };




    // let checkCommentCountCorrectnessMZ = 0;
    // async function checkCommentCountCorrectness() {
    //   const cnt = this;
    //   const getData = () => {
    //     let data1 = ((cnt.__data || 0).data || 0);
    //     if (typeof data1 === 'object') return data1;
    //     let data2 = cnt.data;
    //     if (typeof data2 === 'object') return data2;
    //     return null;
    //   }
    //   if (checkCommentCountCorrectnessMZ > 1e9) checkCommentCountCorrectnessMZ = 9;
    //   const tid = ++checkCommentCountCorrectnessMZ;
    //   const hostElement = this.hostElement || this;
    //   let commentsCount = -1;
    //   // let targetExitTime = Date.now() + 800;
    //   await observablePromise(() => {
    //     // if(Date.now() > targetExitTime) return -1;
    //     if (tid !== checkCommentCountCorrectnessMZ) return -2;
    //     const data = getData();
    //     if ((cnt.is && data && !data.header)) return 0;
    //     return 1;
    //   }).obtain();
    //   if (tid !== checkCommentCountCorrectnessMZ) return;
    //   const data = getData();
    //   if (!data) return;
    //   const commentsHeaderRenderer = data.header && data.header.length === 1 ? ((data.header[0] || 0).commentsHeaderRenderer || 0) : 0;

    //   if (commentsHeaderRenderer && commentsHeaderRenderer.commentsCount) {

    //     if (commentsHeaderRenderer.commentsCount.runs && commentsHeaderRenderer.commentsCount.runs.length === 1 && commentsHeaderRenderer.commentsCount.runs[0].text) {
    //       let d = parseInt(commentsHeaderRenderer.commentsCount.runs[0].text, 10);
    //       if (d > -1) {
    //         commentsCount = d;
    //       }
    //     }

    //   }



    //   if (commentsCount < 0 && commentsHeaderRenderer && commentsHeaderRenderer.countText) {
    //     const countText = commentsHeaderRenderer.countText;
    //     if (countText.runs && countText.runs.length === 2 && typeof countText.runs[0].text === 'string') {

    //       const countTextString = countText.runs[0].text;
    //       const ctString = countTextString.replace(/[,.\s]+/g, '');
    //       const ctNum = parseInt(ctString, 10);
    //       if (ctNum >= 0 && countTextString.trim() === ctNum.toLocaleString(document.documentElement.lang)) {

    //         commentsCount = d;
    //       }

    //     }
    //   }

    //   if (commentsCount > -1) {


    //     // cnt.tytHeaderChanged_();
    //     // document.dispatchEvent(new CustomEvent('tyt-update-cm-count'));

    //     const countText = commentsHeaderRenderer.countText;
    //     if (countText) {


    //       await delayPn(80); // wait comments count updated

    //       const data = getData();
    //       const n = data.contents.length;
    //       if (n !== commentsCount && hostElement.isConnected === true && cnt.isAttached === true) {

    //         const headerElm = _querySelector.call(hostElement, 'ytd-comments-header-renderer');
    //         const headerCnt = insp(headerElm);

    //         if (headerCnt.data === data.header[0].commentsHeaderRenderer) {
    //           let runs = [{ text: data.contents.length.toLocaleString(document.documentElement.lang) }, countText.runs[1]];
    //           let m = Object.assign({}, data.header[0].commentsHeaderRenderer.countText, { runs: runs });
    //           headerCnt.data = Object.assign({}, headerCnt.data, { countText: m }); // update header text
    //           Promise.resolve().then(() => {
    //             cnt.headerChanged_(); // ask to update tab count span
    //           })
    //         }

    //       }
    //     }


    //   }
    // }

    async function checkCommentCountCorrectness() {
      // TODO
      // update both countText and commentsCount
    }


    // dataChanged_ & headerChanged_ for comments counting update

    retrieveCE('ytd-comments').then((cProto) => {

      if (typeof cProto.attached637 === 'function' || typeof cProto.attached !== 'function' || cProto.attached.length !== 0) {
        console.warn('define Error: attached in ytd-comments.');
        return;
      }
      cProto.attached637 = cProto.attached;

      cProto.attached = function () {
        if (typeof this.initProps637 === 'function') {
          try {
            this.initProps637();
          } catch (e) {
            console.warn(e)
          }
        }
        return this.attached637();
      }

      cProto.initProps637 = function () {

        const cProto = ((this.constructor || 0).prototype || 0);
        if (!cProto) {
          console.warn('cProto error in ytd-comments.');
          return;
        }

        cProto.initProps637 = null;

        let keyDefined = 'headerChanged_' in cProto;

        // dataChanged_ are headerChanged_ are properties defined during "_initializeProperties()"
        if (!keyDefined) console.warn('headerChanged_ is not defined in ytd-comments.');

        // dataChanged_ for cache update & clear cached count
        // const ytdCommentsP = customElements.get('ytd-comments').prototype;
        if (typeof cProto.dataChanged_ == 'function' && !('tytDataChanged_' in cProto)) {
          cProto.tytDataChanged_ = cProto.dataChanged_;
          cProto.dataChanged_ = function () {
            const cnt = this;
            cnt.tytDataChanged_();

            getRAFPromise().then(() => { // delay is required to avoid event sequence issue.

              const hostElement = this.hostElement || this;
              if (!hostElement) return;
              const data = ((cnt.__data || 0).data || 0);
              // if (!data) return;
              const hasData = (data.contents || 0) !== 0;
              if (hasData) {
                const sections = ((cnt.$ || 0).sections || 0);
                if (sections && 'triggerInitialContinuations' in sections) {
                  Promise.resolve(sections).then((sections) => {
                    sections.triggerInitialContinuations();
                  }).catch(() => { });
                  // console.log('sections.triggerInitialContinuations'); 
                  //  a[b].triggerIfNotPreviouslyTriggered() -> this.hasBeenTriggered_ || this.trigger()
                }

                checkCommentCountCorrectness.call(this)

              }
              dispatchCustomEvent(hostElement, 'ytd-comments-data-changed', { hasData });
              console.log('[tyt] ytd-comments-data-changed');

            });
          }
        }

        // headerChanged_ - new method to fetch comments count
        if (typeof cProto.headerChanged_ == 'function' && !('tytHeaderChanged_' in cProto)) {
          cProto.tytHeaderChanged_ = cProto.headerChanged_;
          cProto.headerChanged_ = function () {
            // function is called inside flushClients's propertiesChanged          
            const cnt = this;

            cnt.tytHeaderChanged_();

            getRAFPromise().then(() => { // delay is required to avoid event sequence issue.

              const hostElement = this.hostElement || this;
              if (!hostElement) return;
              const data = ((cnt.__data || 0).data || 0);
              // if (!data) return;
              if (data) {
                checkCommentCountCorrectness.call(this);
                // console.log(311, data.contents.length, data.header)
              }

              dispatchCustomEvent(hostElement, 'ytd-comments-header-changed');
              console.log('[tyt] ytd-comments-header-changed');

            });

          }
        }

        console.log('[tyt] ytd-comments props init');

      }


    });

    tabviewFixPopupRefitFn = () => {
      // this = document

      const cProto = getProto(document.querySelector('tp-yt-iron-dropdown') || document.createElement('tp-yt-iron-dropdown'));
      if (!cProto) return;

      if (cProto.__refit) return;
      let _refit = cProto.refit;
      if (typeof _refit !== 'function') return;

      // fix issue mentioned in https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/157029 
      // reproduction: click watch later without login 
      // without this, the layout coordinates and size (height) of container will become incorrect.

      cProto.__refit = _refit;
      cProto.refit = function () {
        const cnt = this;
        // const hostElement = this.hostElement || this;
        const alignHost = cAlignHost(this);
        if (alignHost.horizontalAlign || alignHost.verticalAlign) {
          let node = cnt.__restoreFocusNode
          if (node instanceof HTMLElement) {
            let nodeName = node.nodeName.toUpperCase();
            if (nodeName === 'YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER') {
              const selector = '#tab-videos ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail';
              if (HTMLElement.prototype.matches.call(node, selector)) {
                if (alignHost.horizontalAlign) alignHost.horizontalAlign = false;
                if (alignHost.verticalAlign) alignHost.verticalAlign = false;
              }
            }
          }
        }
        if (cnt.__refit) return cnt.__refit();
      };

    }




    /* added in 2023.06.09 */
    /* modified in 2023.08.26 */
    // removed in 2024.12.15
    // const regRFn = (cProto, keyA, keyB) => {

    //   if (cProto[keyB] || !cProto[keyA]) return;

    //   cProto[keyB] = cProto[keyA];

    //   let renderStore = new WeakMap();

    //   cProto[keyA] = function () {

    //     const cnt = this;
    //     const hostElement = this.hostElement || this;

    //     if (renderStore.get(hostElement) >= 1) return;
    //     renderStore.set(hostElement, 1);
    //     getForegroundPromise().then(() => {

    //       renderStore.set(hostElement, 0);

    //       if (cnt.hidden !== true && cnt.isAttached === true && hostElement.isConnected === true) {

    //         cnt[keyB]();
    //       }

    //     });

    //   };



    // }


    /* added in 2023.06.09 */
    // removed in 2024.12.15

    // retrieveCE('yt-attributed-string').then((cProto) => {

    //   // since DFa cannot be hacked

    //   regRFn(cProto, 'templatingFn', '__templatingFn__');
    //   regRFn(cProto, 'doIdomRender', '__doIdomRender__');

    // });


    /* added in 2023.06.09 */
    // removed in 2024.12.15

    // retrieveCE('yt-button-shape').then((cProto) => {

    //   // since DFa cannot be hacked

    //   regRFn(cProto, 'templatingFn', '__templatingFn__');
    //   regRFn(cProto, 'doIdomRender', '__doIdomRender__');

    // });


    retrieveCE('ytd-player').then((cProto) => {

      let keyDefined = 'pause' in cProto;
      if (!keyDefined) return console.warn('pause is not defined in ytd-player.');

      const pause = cProto.pause;

      cProto.pause = function () {
        if (arguments.length !== 0) return pause.apply(this, arguments); // fallback
        if (byPassPause) return;
        pause.call(this);
      };

    })

    retrieveCE('ytd-comment-renderer').then((cProto) => {

      let keyDefined = 'linkedCommentBadgeChanged' in cProto;
      if (!keyDefined) return console.warn('linkedCommentBadgeChanged is not defined in ytd-comment-renderer.');

      const linkedCommentBadgeChanged = cProto.linkedCommentBadgeChanged;

      cProto.linkedCommentBadgeChanged = function () {
        byPassPause = true;
        let r = linkedCommentBadgeChanged.apply(this, arguments);
        byPassPause = false;
        return r;
      };

    })

    ceHackDone.resolve();
  }

  function ceHack() {

    if (_ceHack_calledOnce) return;
    _ceHack_calledOnce = true;

    promiseForCustomYtElementsReady.then(ceHackExecution);

    // if (typeof customElements === 'undefined') throw '[tyt] Your browser does not support Tabview userscript.';
    // note: YouTube implements its on window.customElements when it detects the browser is old.


    // for DEBUG
    window.exposeCE = function (tag) {
      let ww = {}, wp = customElements.get(tag).prototype;
      for (const s of Object.keys(wp)) {
        try {
          if (typeof wp[s] == 'function') {
            ww[s] = wp[s];
          }
        } catch (e) { }
      }
      return ww;
    }

  }

  function showLyricsWhenReady(data) {

    console.assert(!!data, 'parameter "data" is not defined.')

    let lyricsIframe = document.querySelector('#lyricsiframe');
    if (lyricsIframe && document.querySelector('ytd-app') && lyricsIframe.contentDocument !== null) {

      Promise.resolve(0).then(() => {
        lyricsIframe.classList.remove('tyt-tmp-hide-lyricsiframe');

      })

    }

  }

  function getEPC(ep) {
    // @return HTMLElement

    if (!ep) return null;
    let epc = _querySelector.call(ep, '#content');
    if (!epc) return null;

    return _querySelector.call(epc, 'ytd-ads-engagement-panel-content-renderer #content')
      || _querySelector.call(epc, 'ytd-ads-engagement-panel-content-renderer')
      || epc;

  }

  function setYtData(cnt, data) {
    if (typeof cnt._setProperty === 'function') {

      cnt._setProperty('data', data);
    } else {
      cnt.data = data;
    }
  }

  async function createComponent_(ytdFlexyCnt, cz, wz, b, parentElement) {

    const newPanel = ytdFlexyCnt.createComponent_(cz, wz, b);
    // ytdFlexyCnt.deferRenderStamperBinding_(newPanel, cz, wz);

    let newPanelHostElement = (newPanel || 0).hostElement || newPanel;

    // newPanelHostElement.classList.add('style-scope', 'ytd-watch-flexy');

    elementAppend.call(parentElement, newPanelHostElement);

    if (insp(newPanelHostElement).isAttached !== true) await delayPn(1);

    let nodeNew = newPanelHostElement.cloneNode(false, false);
    newPanelHostElement.replaceWith(nodeNew);
    newPanelHostElement = nodeNew;
    return newPanelHostElement;
  }

  let createPanelMZ = 0;
  async function createPanel() {

    try {
      if (createPanelMZ > 1e9) createPanelMZ = 9;
      const tid = ++createPanelMZ;
      await _retrieveCE("ytd-engagement-panel-section-list-renderer");

      if (tid !== createPanelMZ) return;

      const ytdFlexyElm = document.querySelector('ytd-watch-flexy[tyt-tab]');
      if (!ytdFlexyElm) return null;
      const ytdFlexyCnt = insp(ytdFlexyElm);


      /** @type {HTMLElement} */
      const newPanelHostElement = await createComponent_(ytdFlexyCnt, {
        "component": "ytd-engagement-panel-section-list-renderer",
        "params": {
          "isWatch": true
        }
      }, "ytd-engagement-panel-section-list-renderer", true, _querySelector.call(ytdFlexyElm, '#panels'));

      // await delayPn(1);

      newPanelHostElement.classList.add('style-scope', 'ytd-watch-flexy');
      const newPanelCnt = insp(newPanelHostElement);

      setYtData(newPanelCnt, {
        "panelIdentifier": "engagement-panel-genius-transcript",
        "header": {
          "engagementPanelTitleHeaderRenderer": {
            "title": {
              "runs": [
                {
                  "text": "Genius Lyrics"
                }
              ]
            },
            "visibilityButton": {
              "buttonRenderer": {
                "style": "STYLE_DEFAULT",
                "size": "SIZE_DEFAULT",
                "type": "text", // default is tonal
                "isDisabled": false,
                "icon": {
                  "iconType": "CLOSE"
                },
                "accessibility": {
                  "label": "Close Genius Lyrics"
                },
                "accessibilityData": {
                  "accessibilityData": {
                    "label": "Close Genius Lyrics"
                  }
                },
                "command": {
                  "changeEngagementPanelVisibilityAction": {
                    "targetId": "engagement-panel-genius-transcript",
                    "visibility": "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
                  }
                }
              }
            }
          }
        },
        "content": {
          "adsEngagementPanelContentRenderer": {
            //"engagementPanelGeniusTranscriptRenderer":{

          }
        },
        "targetId": "engagement-panel-genius-transcript",
        "visibility": "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN",
        "loggingDirectives": {
        }
      });

      // newPanelCnt._flushClients();

      // newPanelCnt._invalidateProperties();




      return newPanelHostElement;
    } catch (e) {
      console.warn(e)
    }

  }

  let geniusLyricsVisObserver = null

  async function geniusLyricsVisObserveCbAsync(panel) {

    await Promise.resolve(0)

    let lyricsiframe = null

    if (panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN') {
      isLyricsLoading = false
      lyricsiframe = panel.querySelector('#lyricsiframe');
      dispatchCustomEvent(document, 'genius-lyrics-actor', { action: 'hideLyrics' });
      await Promise.resolve(0)
      if (lyricsiframe) {
        document.body.appendChild(lyricsiframe)
      }
    } else {
      lyricsiframe = document.querySelector('body #lyricsiframe');
      if (lyricsiframe && !lyricsiframe.matches('ytd-engagement-panel-section-list-renderer iframe')) {
        let epc = getEPC(panel);
        if (epc) {
          isLyricsLoading = false
          lyricsiframe.classList.add('tyt-tmp-hide-lyricsiframe');
          let panel = closestFromAnchor.call(epc, 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]')
          if (panel) {
            panel.classList.toggle('epanel-lyrics-loading', true);
          }
          elementAppend.call(epc, lyricsiframe);
          await Promise.resolve(0);
          setTimeout(() => {
            dispatchCustomEvent(document, 'genius-lyrics-actor', { action: 'reloadCurrentLyrics' });
          }, 40);
        }

      }

    }

  }

  function geniusLyricsVisObserveCb(mutations, observer) {

    if (!mutations || !mutations[0]) return;
    /** @type {HTMLElement} */
    let panel = mutations[0].target;
    if (!panel) return;

    geniusLyricsVisObserveCbAsync(panel);

  }

  async function getLyricsReady() {

    try {
      const panel_cssSelector = 'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]'

      if (!document.querySelector(panel_cssSelector) && document.querySelector('ytd-watch-flexy #panels')) {
        let newPanel = await createPanel();

        if (newPanel === null) {
          return
        }

        if (geniusLyricsVisObserver) {
          geniusLyricsVisObserver.takeRecords();
          geniusLyricsVisObserver.disconnect();
        } else {
          geniusLyricsVisObserver = new MutationObserver(geniusLyricsVisObserveCb)
        }

        geniusLyricsVisObserver.observe(newPanel, {
          attributes: true,
          attributeFilter: ['visibility']
        })

      }


      let elm = null;
      if (elm = document.querySelector('body > #lyricscontainer > #lyricsiframe')) {

        let panel = document.querySelector(panel_cssSelector)
        if (panel) {

          let epc = getEPC(panel);
          if (epc) {
            epc.innerHTML = createHTML('');
            elm.classList.add('tyt-tmp-hide-lyricsiframe');
            elementAppend.call(epc, elm);

            dispatchCustomEvent(document, 'tyt-engagement-panel-visibility-change', {
              panelId: "engagement-panel-genius-transcript",
              toShow: true
            });


            // panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')
          }

        }
      }

      let panel = document.querySelector(panel_cssSelector)
      if (panel) {
        panel.classList.toggle('epanel-lyrics-loading', isLyricsLoading);
      }

    } catch (e) {
      console.warn(e)
    }
  }


  let isLyricsLoading = false
  let iframeCache = null


  function onLyricsDisplayStateChanged(data) {

    console.assert(!!data, 'parameter "data" is not defined.')


    const panel_cssSelector = 'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]'

    let isLoading_current = data.visibility === 'loading';
    let changed = false

    if (isLyricsLoading !== isLoading_current) {
      isLyricsLoading = isLoading_current;
      changed = true
    }

    if (data.visibility === 'hidden') {

      let panel = document.querySelector(panel_cssSelector)
      if (panel && panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {

        dispatchCustomEvent(document, 'tyt-engagement-panel-visibility-change', {
          panelId: "engagement-panel-genius-transcript",
          toShow: true
        });


        // panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN')
      }
    } else if (data.visibility === 'loading') {

      if (changed) {

        let panel = document.querySelector(panel_cssSelector)
        if (panel) {
          panel.classList.toggle('epanel-lyrics-loading', isLyricsLoading);
        }

        let p = kRef(iframeCache)
        if (p && !p.matches('body iframe')) {
          document.body.appendChild(p)
        }

        let tmp = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]')
        if (tmp) {
          tmp.remove()
        }
        getLyricsReady();
      }
    } else if (data.visibility === 'loaded') {
      let p = document.querySelector('iframe#lyricsiframe')
      if (p) {
        iframeCache = mWeakRef(p)
      }
      let panel = document.querySelector(panel_cssSelector)
      if (panel) {
        panel.classList.toggle('epanel-lyrics-loading', isLyricsLoading);
      }
    }


  }

  function geniusLyricsMessageAsync(data) {
    switch (data.type) {
      case 'pageready':
        showLyricsWhenReady(data);
      case 'lyricsDisplayState':
        onLyricsDisplayStateChanged(data);
    }
  }

  window.addEventListener('message', (evt) => {
    const data = ((evt || 0).data || 0);

    if (data.iAm === 'Youtube Genius Lyrics') {
      Promise.resolve(data).then(geniusLyricsMessageAsync)
    }

  });

  if (document.documentElement.hasAttribute('tabview-loaded'))
    ceHack();

  pageScripts.set('tabview-ce-hack', ceHack);


  documentEventListen('yt-expander-less-tapped', function (evt) {

    DEBUG_e32 && console.log(9442, evt.type);
    // including reply of comments;
    // fix scrollTop when "show less" is tapped

    if (!evt || !evt.target) return;
    /** @type {HTMLElement} */
    let elm = evt.target;

    Promise.resolve(elm).then((elm) => {

      const selector = '#tab-comments #contents.style-scope.ytd-item-section-renderer > ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-expander#expander[max-number-of-lines]';
      if (elm.matches(selector)) {
        //setTimeout(()=>{
        let cmRenderElm = closestFromAnchor.call(elm, 'ytd-comment-renderer')
        let tabComments = closestFromAnchor.call(cmRenderElm, '#tab-comments')
        let cmRenderRect = cmRenderElm.getBoundingClientRect()
        let tabCommentsRect = tabComments.getBoundingClientRect()
        let eTop = cmRenderRect.top
        let cTop = tabCommentsRect.top

        if (cTop - eTop > 0) {
          cmRenderElm.scrollIntoView();
        }

      }

    });


  }, true);

  function scGet() {
    let t = this;
    let sc = t._sc.deref();
    if (!t.hasAttribute('autocomplete')) {
      if (sc) sc.textContent = '';
      // to make something for "document.body.removeChild(t.sc),"
      let x = new Comment();
      document.body.appendChild(x);
      setTimeout(() => {
        if (nodeParent(x)) x.remove();
        x = null;
      });
      return x;
    }
    return sc || null;
  }

  pageScripts.set('tabview-fix-autocomplete', function (target) {

    // DEBUG_e32 && console.log(9442, evt.type);
    // https://cdnjs.cloudflare.com/ajax/libs/JavaScript-autoComplete/1.0.4/auto-complete.min.js

    let s = target;
    if (!s.matches('[autocomplete="off"]:not([data-autocomplete-results-id])')) return;

    let sc = s.sc; //#autocomplete-suggestions 
    if (sc instanceof HTMLElement) {

      if (document.querySelector('autocomplete-holder')) return;

      let id = Date.now();
      _setAttribute.call(s, 'data-autocomplete-results-id', id);
      _setAttribute.call(sc, 'data-autocomplete-input-id', id);

      if (typeof WeakRef === 'function') {
        s._sc = new WeakRef(sc);
        s.sc = null;
        delete s.sc;
        Object.defineProperty(s, 'sc', {
          get: scGet,
          enumerable: true,
          configurable: true
        })
        s._scGet = () => {
          return this._sc.deref();
        }
      } else {
        s._scGet = () => {
          return this.sc;
        }
      }

      if (typeof s.updateSC == 'function') {

        window.removeEventListener('resize', s.updateSC);
        s.updateSC = function () {
          dispatchCustomEvent(this, "tyt-autocomplete-suggestions-change");
        };

      }

      dispatchCustomEvent(s, 'tyt-autocomplete-sc-exist');

    }

    sc = null;


  });


  // initial paging -> yt-page-data-fetched
  // page changing ->  yt-page-type-changed + yt-page-data-fetched
  document.addEventListener('yt-page-type-changed', (evt) => {
    DEBUG_e32 && console.log(9442, evt.type);
    window.postMessage({
      tabviewData: {
        eventType: evt.type, // yt-page-type-changed
        eventDetail: evt.detail // in order to get the object detail
      }
    }, location.origin);
  }, false);


  // related to scrollToSection
  function tabviewInfoTogglerOnClick(evt) {
    // const isTrusted = evt.isTrusted === true;
    const dom = evt.target;
    const description = closestFromAnchor.call(dom, '#description')
    if (!description) return;
    let button = description.querySelector('#collapse[role="button"]:not([hidden]), #expand[role="button"]:not([hidden])');
    if (!button) return;
    getDMPromise().then(() => { //setTimeout / raf required - js event issue
      button.click();
      // if (isTrusted && document.fullscreenElement !== null) description.scrollIntoView(true);
      button = null;
    });
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }

  pageScripts.set('tyt-info-toggler', (target) => {
    const node = target;
    node.addEventListener('click', tabviewInfoTogglerOnClick, false)
  });

  pageScripts.set('tabview-resize-comments-rows', () => {
    // this = document
    //slightly delayed
    //console.log('tabview-resize-comments-rows')
    for (const ytdExpanderElm of document.querySelectorAll('#tab-comments #comments .tyt-visible-comment ytd-expander')) {
      Promise.resolve(ytdExpanderElm).then(() => {
        const ytdExpanderCnt = insp(ytdExpanderElm);
        ytdExpanderCnt.calculateCanCollapse(true);
      });
    }

  });

  pageScripts.set('tabview-fix-info-box-tooltip', () => {
    const ytdFlexy = getYtdWatchFlexyElement();
    if (!ytdFlexy) return;

    let isDuplicated = ytdFlexy.classList.contains('tabview-info-duplicated');
    if (!isDuplicated) return;

    let tooltip = document.querySelector('#bottom-row.style-scope.ytd-watch-metadata tp-yt-paper-tooltip.style-scope[role="tooltip"]');
    if (!tooltip) return;

    const tooltipHost = cppr(tooltip, 'position');

    tooltipHost.position = 'top';
    tooltip.classList.add('tyt-force-left-0');
  });


  // ----------------------------- ytLive / Popup / Begin -----------------------------

  // chatroomRendererElmWR
  // popupBtnId
  // mtoIframePopup

  pageScripts.set('tyt-close-popup', () => {
    let cr = kRef(chatroomRendererElmWR);

    if (cr) {

      try {
        cr.closePopoutWindow();
      } catch (e) { }

    }

  });

  let popupBtnId = 0;
  let mtoIframePopup = null;

  const setupPopupButton = (evt) => {

    // console.log(334,3)
    // popupClose

    popupBtnId++
    function getV() {
      let url = ((document.querySelector('#page-manager') || 0).data || 0).url
      if (typeof url === 'string') {
        let v = /[?&]v=([^&?]+)/.exec(url)
        if (v) {
          v = v[1]
          return v
        }
      }
      return null
    }
    function isPopuped(cm) {
      return cm.matches('iron-pages > :not(slot):not(.iron-selected)')
    }
    function clearMTO() {
      // when btn appear

      if (mtoIframePopup) {
        mtoIframePopup.takeRecords()
        mtoIframePopup.disconnect()
        mtoIframePopup = null
      }

    }

    function setupParticipantsCnt(participantsCnt) {
      if (!participantsCnt.onParticipantsChanged322 && typeof participantsCnt.onParticipantsChanged === 'function' && !participantsCnt.participantsChangeIfPending) {
        participantsCnt.onParticipantsChanged322 = participantsCnt.onParticipantsChanged

        // let _lastData = null
        participantsCnt.participantsChangeIfPending = function () {

          if (this.canShow322 === true && this.showPending322 === true && this.onParticipantsChangedBusy322 === false) {
            this.onParticipantsChanged();
          }
        }
        participantsCnt.onParticipantsChanged = async function () {
          try {
            this.showPending322 = true; // refresh next time

            if (this.canShow322 !== true) return; // avoid refresh participants when the list is not shown

            if (this.onParticipantsChangedBusy322 === true) return;

            this.onParticipantsChangedBusy322 = true;

            let waiter = getRAFPromise(); // avoid frequently update

            this.onParticipantsChanged322();

            this.showPending322 = false; // refreshed

            await waiter;

          } catch (e) {
            console.warn(e)
          }

          this.onParticipantsChangedBusy322 = false;
          if (typeof this.participantsChangeIfPending === 'function') this.participantsChangeIfPending(); // unknown bug found in 2023.06.18 (FireFox)

        }

      }
    }

    function codeFixForParticipants() {
      const lcrElm = kRef(chatroomRendererElmWR);
      if (!lcrElm) return;
      const participantsElm = _querySelector.call(lcrElm, 'iron-pages > yt-live-chat-participant-list-renderer.yt-live-chat-renderer');
      if (!participantsElm) return;
      const participantInst = insp(participantsElm);
      const participantsCnt = participantInst.constructor.prototype;
      setupParticipantsCnt(participantsCnt);
      participantInst.canShow322 = !participantsElm.matches('iron-pages > :not(slot):not(.iron-selected)')
      participantInst.onParticipantsChangedBusy322 = false; // force change
      participantInst.participantsChangeIfPending && participantInst.participantsChangeIfPending();
    }

    // function iframePopupVisibilityChanged() {
    //   if (!popupClose) return;
    //   const mPopupWindow = kRef(popupClose.mPopupWindow);
    //   if (!mPopupWindow) return;
    //   if (typeof mPopupWindow.closed === 'boolean') {
    //     setTimeout(() => {
    //       if (!popupClose) return;
    //       const mPopupWindow = kRef(popupClose.mPopupWindow);
    //       if (!mPopupWindow) return;
    //       if (mPopupWindow.closed === true) {
    //         popupClose();
    //       }
    //     }, 36);
    //   }
    // }

    function iframePopupUnloaded() {
      Promise.resolve().then(() => {
        if (!popupClose) return;
        const mPopupWindow = kRef(popupClose.mPopupWindow);
        if (!mPopupWindow) return;
        if (typeof mPopupWindow.closed === 'boolean') {
          setTimeout(() => {
            if (!popupClose) return;
            const mPopupWindow = kRef(popupClose.mPopupWindow);
            if (!mPopupWindow) return;
            if (mPopupWindow.closed === true) {
              popupClose();
            }
          }, 36);
        }
      });
    }

    function setupMTO(btnElm) {
      // when btn clicked

      let btn = mWeakRef(btnElm);

      let lcrElm = kRef(chatroomRendererElmWR);
      if (!lcrElm) return;
      const lcrCnt = insp(lcrElm);
      let cmElm = lcrCnt.$['chat-messages'];
      if (!cmElm) return;


      mtoIframePopup = new MutationObserver((mutations) => {

        let cm = null;
        let required = null;
        let popuped = null;
        let toHideBtn = null;
        let toShowBtn = null;
        for (const mutation of mutations) {
          let currentHas = null;
          if (!cm) {
            cm = mutation.target;
            currentHas = cm.classList.contains('iron-selected');
          }
          let c = mutation.oldValue;
          if (typeof currentHas == 'boolean') {
            if (currentHas === true) {
              toShowBtn = true;
              if (c.indexOf('iron-selected') < 0) {
                required = true;
                popuped = false;
              }
            } else if (currentHas === false) {
              if (c.indexOf('iron-selected') >= 0) {
                const lcrElm = kRef(chatroomRendererElmWR);
                const lcrPopupWindow = lcrElm ? insp(lcrElm).popoutWindow || lcrElm.popoutWindow : null;
                if (lcrPopupWindow) {
                  required = true;
                  popuped = (popupClose.mPopupWindow === null); // no WeakRef was set
                } else {
                  toHideBtn = true;
                }
              }
            }
          }
          if (required === true) break;
        }

        /** @type {HTMLElement} */
        let btnElm = kRef(btn)

        if (toShowBtn === true && toHideBtn === null) {
          if (btnElm) btnElm.classList.add('tyt-btn-enabled')
        }

        if (required === true) {

          if (btnElm) {
            btnElm.classList.toggle('tyt-btn-popuped', popuped);

            dispatchCustomEvent(document, 'tyt-chat-popup', {
              popuped: popuped
            });
            try {
              if (!popuped && popupClose) {
                popupClose();
              }
            } catch (e) { }
          }
          if (popuped && popupClose) {
            let lcrElm = kRef(chatroomRendererElmWR);
            if (lcrElm) {
              const lcrPopupWindow = lcrElm ? insp(lcrElm).popoutWindow || lcrElm.popoutWindow : null;
              popupClose.mPopupWindow = mWeakRef(lcrPopupWindow);

              // lcrPopupWindow.removeEventListener('visibilitychange', iframePopupVisibilityChanged, false);
              // lcrPopupWindow.addEventListener('visibilitychange', iframePopupVisibilityChanged, false);
              lcrPopupWindow.removeEventListener('unload', iframePopupUnloaded, bubblePassive);
              lcrPopupWindow.addEventListener('unload', iframePopupUnloaded, bubblePassive);
            }
            lcrElm = null
          }
        } else if (required === null && toHideBtn === true && toShowBtn === null) {
          if (btnElm) btnElm.classList.remove('tyt-btn-enabled');
        }

        // resolve issue - participant list loaded causing long re-rendering time required for chat messages switching (top chats vs full chats)
        Promise.resolve(0).then(codeFixForParticipants);


      });
      mtoIframePopup.observe(cmElm, {

        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true

      });
      cmElm = null
      lcrElm = null


    }

    function isThisChatCanPopup(lcrElm) {

      let canAddBtn = false
      let cm = null

      const lcrCnt = insp(lcrElm);

      if (lcrCnt && typeof lcrCnt.openPopoutWindow === 'function' && lcrCnt.openPopoutWindow.length === 1 && typeof lcrCnt.closePopoutWindow === 'function') {


        let crData = lcrCnt.data
        if (crData) {

          let isReplay = crData.isReplay === true
          let bool = !isReplay
          // bool = true
          if (bool) {

            cm = lcrCnt.$['chat-messages'];
            if (cm && !cm.matches('iron-pages > :not(slot):not(.iron-selected)')) {
              canAddBtn = true
            }

          }
        }


      }
      return canAddBtn
    }

    let popupClose = null


    function popupBtnOnClick() {


      const lcrElm = kRef(chatroomRendererElmWR);
      const lcrCnt = insp(lcrElm);


      if (lcrElm && typeof lcrCnt.openPopoutWindow === 'function' && lcrCnt.openPopoutWindow.length === 1 && typeof lcrCnt.closePopoutWindow === 'function') {

        let v = getV()
        if (v) {
          let cm = lcrCnt.$['chat-messages'];
          if (cm) {

            let isReplay = lcrCnt.data.isReplay === true

            let url;
            if (!isReplay) {
              url = "https://www.youtube.com/live_chat?is_popout=1&v=" + v
            } else {
              url = "https://www.youtube.com/live_chat_replay?is_popout=1&v=" + v
            }
            // https://studio.youtube.com/live_chat?is_popout=1&v=


            !isPopuped(cm) ? lcrCnt.openPopoutWindow(url) : popupClose();

          }

        }


      }



    }

    async function runner(btn) {

      // console.log(334,4)

      clearMTO();
      popupClose = null;

      popupBtnId++;
      let tid = popupBtnId;
      let count = 0;

      let lcrElm = null;
      let itemScroller = null;
      while (!itemScroller) {
        if (!lcrElm) lcrElm = kRef(chatroomRendererElmWR);
        if (lcrElm) itemScroller = lcrElm.querySelector('#item-scroller.yt-live-chat-item-list-renderer');
        await getRAFPromise().then();
        if (tid !== popupBtnId) return;
        if (count++ > 200) return;
      }
      if (!document.contains(btn)) return;


      clearMTO();
      let canAddBtn = lcrElm && isThisChatCanPopup(lcrElm);
      // console.log(334,5, canAddBtn)


      const lcrCnt = insp(lcrElm);

      if (canAddBtn && typeof lcrCnt.closePopoutWindow === 'function') {


        btn.removeEventListener('click', popupBtnOnClick, false);

        popupClose = function () {

          if (!popupClose) return;
          try {
            popupClose.closePopoutWindow();
          } catch (e) { }
          let mPopupWindow = kRef(popupClose.mPopupWindow);
          popupClose.mPopupWindow = null;
          if (mPopupWindow) {
            try {
              mPopupWindow.close();
            } catch (e) { }
          }
          mPopupWindow = null;
        }
        popupClose.mPopupWindow = null;
        popupClose.closePopoutWindow = lcrCnt.closePopoutWindow.bind(lcrCnt);

        setupMTO(btn);


        btn.addEventListener('click', popupBtnOnClick, false);


        btn.classList.toggle('tyt-btn-enabled', true)



      } else {

        btn.removeEventListener('click', popupBtnOnClick, false);
        btn.classList.toggle('tyt-btn-enabled', false)

      }



      btn = null;


    }
    runner(evt.target);

  }


  // ----------------------------- ytLive / Popup / End -----------------------------


  // documentEventListen('tabview-page-rendered', () => {
  //   // reserved
  // });




  function addPopupButton(chatElm) {
    try {


      let showHideBtn = _querySelector.call(chatElm, 'div#show-hide-button')
      if (showHideBtn) {

        let btn;
        btn = document.querySelector('tyt-iframe-popup-btn')
        if (btn) btn.remove();

        btn = document.createElement('tyt-iframe-popup-btn')
        HTMLElement.prototype.appendChild.call(showHideBtn, btn)
        // console.log(334,2)
        Promise.resolve({
          target: btn
        }).then(setupPopupButton);
      }

    } catch (e) {
      console.warn(e);
    }
  }

  function removePopupButton(chatElm) {
    try {


      let showHideBtn = _querySelector.call(chatElm, 'div#show-hide-button')
      if (showHideBtn) {

        let btn;
        btn = document.querySelector('tyt-iframe-popup-btn')
        if (btn) btn.remove();

      }

    } catch (e) {
      console.warn(e);
    }
  }

  const performFireSeekContinuationAtCurrentProgress = async (seekElm, delay) => {
    if (delay) await delayPn(delay); // avoid baseURL timeoffset issue
    if (seekElm.isConnected) {
      if (liveChatPageUrlCount === null || seekElm.fireSeekContinuationAtCurrentProgressDone817 !== liveChatPageUrlCount) { // trigger once only for the same iframe
        seekElm.fireSeekContinuationAtCurrentProgressDone817 = liveChatPageUrlCount;
        const seekCnt = insp(seekElm);
        if (typeof seekCnt.fireSeekContinuationAtCurrentProgress === 'function') {
          seekCnt.fireSeekContinuationAtCurrentProgress();
        }
      }
    }
  }


  pageScripts.set('tabview-chatroom-ready', async function (target) {

    const chatElm = target;
    if (!chatElm) return;

    console.debug('[tyt.iframe] ready 01')

    const currentPopupBtn = _querySelector.call(chatElm, 'tyt-iframe-popup-btn');
    if (currentPopupBtn) currentPopupBtn.classList.remove('tyt-btn-enabled');

    const chatCnt = insp(chatElm);

    const iframe = (chatCnt.$ || chatCnt).chatframe;
    if (!iframe) return
    let cDoc = null;
    try {
      cDoc = iframe.contentDocument;
    } catch (e) { }
    if (!cDoc) return;

    Promise.resolve().then(() => {
      ytLivePU.setupYtLiveMO(); // setup when iframe is loaded; no need to setup when the video is without chatroom
      ytLivePU.elmChatFrame = null; // required
      ytLivePU.initByIframe(iframe); // main
    });

    chatElm.classList.add('tyt-chat-frame-ready');


    const lcrElm = cDoc.querySelector('yt-live-chat-renderer') || (await new Promise(resolve => {

      let cid = 0;
      let mo = new MutationObserver(() => {
        const liveChatRendererElm = cDoc.querySelector('yt-live-chat-renderer');
        if (liveChatRendererElm) {
          if (mo !== null) {
            mo.disconnect();
            mo.takeRecords();
            mo = null;
          }
          resolve && resolve(liveChatRendererElm);
          resolve = null;
          if (cid > 0) {
            clearTimeout(cid);
            cid = 0;
          }
        }
      });
      mo.observe(cDoc, { subtree: true, childList: true })
      cid = setTimeout(() => {
        if (mo !== null) {
          mo.disconnect();
          mo.takeRecords();
          mo = null;
        }
        resolve && resolve(null);
        resolve = null;
      }, 1780)

    }).catch(console.warn));

    console.debug(`[tyt.iframe] ready 02, lcr = ${lcrElm ? 'Y' : 'N'}`)

    if (lcrElm) {
      addPopupButton(chatElm);
      ytLivePU.initByChatRenderer(lcrElm);

      const lcrCnt = insp(lcrElm);

      const isReplay = (lcrCnt.data || 0).isReplay;
      if (isReplay === true && typeof chatCnt.playerProgressHandler === 'function') {
        const player = chatCnt.player || 0;
        const playerState = typeof player.getPlayerState === 'function' ? player.getPlayerState() : null;
        if (playerState === 2 || playerState === -1) {
          chatCnt.playerProgressHandler();
        } else if (playerState === 1) {
        }
        if (playerState > 0) {
          // fix VOD bug with playerOffsetMs
          const seekElm = _querySelector.call(lcrElm, 'yt-player-seek-continuation');
          if (seekElm) {
            performFireSeekContinuationAtCurrentProgress(seekElm, 300);
          }
        }
      }

    } else {
      removePopupButton(chatElm);
    }


  });


  let miniview_enabled = false

  function isVideoPlaying(video) {
    return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
  }

  async function loadStartFxAsync(newMedia) {

    let media1 = getMediaElement(0); // document.querySelector('#movie_player video[src]');
    let media2 = getMediaElements(2); // document.querySelectorAll('ytd-browse[role="main"] video[src]');

    if (media1 !== null && media2.length > 0) {
      if (newMedia !== media1 && media1.paused === false) {
        if (isVideoPlaying(media1)) {
          Promise.resolve(newMedia).then(video => video.paused === false && video.pause());
        }
      } else if (newMedia === media1) {
        for (const s of media2) {
          if (s.paused === false) {
            Promise.resolve(s).then(s => s.paused === false && s.pause())
            break;
          }
        }
      } else {
        Promise.resolve(media1).then(video1 => video1.paused === false && video1.pause());
      }
    }

  }


  let loadStartFx = (evt) => {

    let media = (evt || 0).target || 0;
    if (media.nodeName === 'VIDEO' || media.nodeName === 'AUDIO') { }
    else return;

    loadStartFxAsync(media);

  }

  globalFunc(function tabviewSwitchVideoPage(video_id) {

    if (typeof video_id !== 'string') return;

    const ytAppElm = document.querySelector('ytd-app');
    const ytAppCnt = insp(ytAppElm);

    if (typeof ytAppCnt.handleNavigate !== 'function') return;

    let req = {
      "type": 0,
      "command": {
        // "clickTrackingParams": "XXXXX",
        "commandMetadata": {
          "webCommandMetadata": {
            "url": "/watch?v=" + video_id, // required; string
            "webPageType": "WEB_PAGE_TYPE_WATCH", // required; string
            "rootVe": 3832 // required; number
          }
        },
        "watchEndpoint": {
          "videoId": video_id,
          "nofollow": true, // optional; boolean
          "watchEndpointSupportedOnesieConfig": { // optional; object
            "html5PlaybackOnesieConfig": {
            }
          }
        }
      },
      "form": {
        "tempData": {}, // required; object
        "reload": false // required; boolean
      }
    }


    /*

    let req = {
      "type": 0,
      "command": {
        "watchEndpoint": {
          "videoId": video_id
        },
        "commandMetadata": {
          "webCommandMetadata": {
            "url": "/watch?v=" + video_id,
            "rootVe": 3832,
            "webPageType": "WEB_PAGE_TYPE_WATCH"
          }
        },
        // "clickTrackingParams": "XXXXX"
      },
      "form": {
        "tempData": {
          // "itct": "XXXXX",
          "lact": 1,
          "vis": 0
        },
        "reload": false
      }
    }

    */
    ytAppCnt.handleNavigate(req);

  });


  function findLcComment(lc) {
    if (arguments.length === 1) {

      let element = document.querySelector(`#tab-comments ytd-comments ytd-comment-renderer #header-author a[href*="lc=${lc}"]`);
      if (element) {
        let commentRendererElm = closestFromAnchor.call(element, 'ytd-comment-renderer');
        if (commentRendererElm && lc) {
          return {
            lc,
            commentRendererElm
          }
        }
      }
    } else if (arguments.length === 0) {

      let element = document.querySelector(`#tab-comments ytd-comments ytd-comment-renderer > #linked-comment-badge span:not(:empty)`);
      if (element) {
        let commentRendererElm = closestFromAnchor.call(element, 'ytd-comment-renderer');
        if (commentRendererElm) {

          let header = _querySelector.call(commentRendererElm, '#header-author');
          if (header) {

            let anchor = _querySelector.call(header, 'a[href*="lc="]');
            if (anchor) {
              let href = (anchor.getAttribute('href') || '');
              let m = /[&?]lc=([\w_.-]+)/.exec(href); // dot = sub-comment
              if (m) {
                lc = m[1];
              }
            }
          }

        }
        if (commentRendererElm && lc) {
          return {
            lc,
            commentRendererElm
          }
        }
      }
    }

    return null;

  }

  function findContentsRenderer(ytNode) {

    let pNode = ytNode;
    let kNode = ytNode;
    const ytNodeData = insp(ytNode).data;
    if (!ytNodeData || typeof ytNodeData !== 'object') return;
    while ((pNode = nodeParent(pNode)) instanceof HTMLElement) {
      const contents = (insp(pNode).data || 0).contents; // data
      if (typeof contents === 'object' && typeof contents.length === 'number') {

        // console.log(pNode.data.contents, ytNode.data)

        let index = -1;

        let j = 0;
        for (const content of contents) {
          let mz = ((content.commentThreadRenderer || 0).comment || 0).commentRenderer || content.commentRenderer; // data

          if (mz && mz.commentId === ytNodeData.commentId) { // top comment or sub comment
            index = j;
            break;
          }
          j++;
        }

        return {
          parent: pNode,
          index
        }
      }
      kNode = pNode;
      if (pNode.nodeName === 'YTD-COMMENTS') break;
    }
    return null;

  }

  function lcSwapFuncA(targetLcId, currentLcId) {


    let done = 0;
    try {
      // console.log(currentLcId, targetLcId)

      let r1 = findLcComment(currentLcId).commentRendererElm;
      let r2 = findLcComment(targetLcId).commentRendererElm;


      if (typeof insp(r1).data.linkedCommentBadge === 'object' && typeof insp(r2).data.linkedCommentBadge === 'undefined') {

        let p = Object.assign({}, insp(r1).data.linkedCommentBadge)

        if (((p || 0).metadataBadgeRenderer || 0).trackingParams) {
          delete p.metadataBadgeRenderer.trackingParams;
        }

        const v1 = findContentsRenderer(r1)
        const v2 = findContentsRenderer(r2)


        if (v1.parent === v2.parent && (v2.parent.nodeName === 'YTD-COMMENTS' || v2.parent.nodeName === 'YTD-ITEM-SECTION-RENDERER')) {

        } else {
          // currently not supported
          return false;
        }



        if (v2.index >= 0) {
          if (v2.parent.nodeName === 'YTD-COMMENT-REPLIES-RENDERER') {


            if (lcSwapFuncB(targetLcId, currentLcId, p)) {
              done = 1;
            }

            done = 1;
          } else {
            const v2pCnt = insp(v2.parent);
            const v2Conents = (v2pCnt.data || 0).contents || 0;
            if (!v2Conents) console.warn('v2Conents is not found');

            v2pCnt.data = Object.assign({}, v2pCnt.data, { contents: [].concat([v2Conents[v2.index]], v2Conents.slice(0, v2.index), v2Conents.slice(v2.index + 1)) });

            if (lcSwapFuncB(targetLcId, currentLcId, p)) {
              done = 1;
            }
          }


        }



      }



    } catch (e) {
      console.warn(e)
    }
    return done === 1;
  }


  function lcSwapFuncB(targetLcId, currentLcId, _p) {

    let done = 0;
    try {

      let r1 = findLcComment(currentLcId).commentRendererElm;
      let r1cnt = insp(r1);
      let r2 = findLcComment(targetLcId).commentRendererElm;
      let r2cnt = insp(r2);

      const r1d = r1cnt.data;
      let p = Object.assign({}, _p)
      r1d.linkedCommentBadge = null;
      delete r1d.linkedCommentBadge;

      let q = Object.assign({}, r1d);
      q.linkedCommentBadge = null;
      delete q.linkedCommentBadge;

      r1cnt.data = Object.assign({}, q);
      r2cnt.data = Object.assign({}, r2cnt.data, { linkedCommentBadge: p });

      done = 1;

    } catch (e) {
      console.warn(e)
    }
    return done === 1;
  }

  const handleNavigateFactory = (handleNavigate) => {

    return function (req) {

      const $this = this;
      const $arguments = arguments;

      let endpoint = null;

      if (req && req.command && (req.command.commandMetadata || 0).webCommandMetadata && req.command.watchEndpoint) {
        let videoId = req.command.watchEndpoint.videoId;
        let url = req.command.commandMetadata.webCommandMetadata.url;

        if (typeof videoId === 'string' && typeof url === 'string' && url.indexOf('lc=') > 0) {

          let m = /^\/watch\?v=([\w_-]+)&lc=([\w_.-]+)$/.exec(url); // dot = sub-comment
          if (m && m[1] === videoId) {


            /*
            {
              "style": "BADGE_STYLE_TYPE_SIMPLE",
              "label": "注目のコメント",
              "trackingParams": "XXXXXX"
          }
            */

            let targetLc = findLcComment(m[2])
            let currentLc = targetLc ? findLcComment() : null;

            if (targetLc && currentLc) {


              let done = targetLc.lc === currentLc.lc ? 1 : lcSwapFuncA(targetLc.lc, currentLc.lc) ? 1 : 0

              if (done === 1) {

                xReplaceState(history.state, url);
                return;
              }
            }
          }

        }

      }
      if (req && req.command) {
        /*
            
            {
              "type": 0,
              "command": endpoint,
              "form": {
                "tempData": {},
                "reload": false
              }
            }

        */
        endpoint = req.command;

        let valid = false;

        if (endpoint && (endpoint.browseEndpoint || endpoint.searchEndpoint) && !endpoint.urlEndpoint && !endpoint.watchEndpoint) {

          if (endpoint.browseEndpoint && endpoint.browseEndpoint.browseId === "FEwhat_to_watch") {
            // valid = false;
            const playerMedia = getMediaElement(1);
            if (playerMedia && playerMedia.paused === false) valid = true; // home page
          } else if (endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata) {

            let meta = endpoint.commandMetadata.webCommandMetadata
            if (meta && /*meta.apiUrl &&*/ meta.url && meta.webPageType) {
              valid = true;
            }

          }
        }

        if (!valid) endpoint = null;

      }


      if (endpoint) {
        // user would like to switch page immediately without playing the video;
        // attribute appear after playing video for more than 2s
        if (!document.head.dataset.viTime) endpoint = null;
        else {
          let currentVideo = getMediaElement(0);
          if (currentVideo && currentVideo.readyState > currentVideo.HAVE_CURRENT_DATA && currentVideo.currentTime > 2.2 && currentVideo.duration - 2.2 < currentVideo.currentTime) {
            // disable miniview browsing if the media is near to the end
            endpoint = null
          }
        }
      }

      if (endpoint) {

        if (pageType === null) {
          const ytdAppElm = document.querySelector('ytd-page-manager#page-manager.style-scope.ytd-app');
          const ytdAppCnt = insp(ytdAppElm);
          pageType = ytdAppCnt ? (ytdAppCnt.data || 0).page : null;
        }
        if (pageType !== "watch") endpoint = null;

      }

      let btn = null;
      if (endpoint) {

        btn = document.querySelector('.tabview-normal-player #movie_player button.ytp-miniplayer-button.ytp-button');

        if (!btn) endpoint = null;

      }


      if (!endpoint) return handleNavigate.apply($this, $arguments);

      // console.log('tabview-script-handleNavigate')

      const ytdAppElm = document.querySelector('ytd-app');
      const ytdAppCnt = insp(ytdAppElm);

      let object = null;
      try {
        object = ytdAppCnt.data.response.currentVideoEndpoint.watchEndpoint || null;
      } catch (e) {
        object = null;
      }

      if (typeof object !== 'object') object = null;

      const once = { once: true }; // browsers supporting async function can also use once option.

      if (object !== null && !('playlistId' in object)) {

        let wObject = mWeakRef(object)

        const N = 3;

        let count = 0;

        /*
          
          rcb(b) => a = playlistId = undefinded
          
          var scb = function(a, b, c, d) {
                  a.isInitialized() && (B("kevlar_miniplayer_navigate_to_shorts_killswitch") ? c || d ? ("watch" !== Xu(b) && "shorts" !== Xu(b) && os(a.miniplayerEl, "yt-cache-miniplayer-page-action", [b]),
                  qs(a.miniplayerEl, "yt-deactivate-miniplayer-action")) : "watch" === Xu(b) && rcb(b) && (qt.getInstance().playlistWatchPageActivation = !0,
                  a.activateMiniplayer(b)) : c ? ("watch" !== Xu(b) && os(a.miniplayerEl, "yt-cache-miniplayer-page-action", [b]),
                  qs(a.miniplayerEl, "yt-deactivate-miniplayer-action")) : d ? qs(a.miniplayerEl, "yt-pause-miniplayer-action") : "watch" === Xu(b) && rcb(b) && (qt.getInstance().playlistWatchPageActivation = !0,
                  a.activateMiniplayer(b)))
              };

        */

        Object.defineProperty((kRef(wObject) || {}), 'playlistId', {
          get() {
            count++;
            if (count === N) {
              delete this.playlistId;
            }
            return '*';
          },
          set(value) {
            delete this.playlistId; // remove property definition
            this.playlistId = value; // assign as normal property
          },
          enumerable: false,
          configurable: true
        });

        let playlistClearout = null;

        let timeoutid = 0;
        Promise.race([
          new Promise(r => {
            timeoutid = setTimeout(r, 4000)
          }),
          new Promise(r => {
            playlistClearout = () => {
              if (timeoutid > 0) {
                clearTimeout(timeoutid);
                timeoutid = 0;
              }
              r();
            }
            document.addEventListener('yt-page-type-changed', playlistClearout, once);
          })
        ]).then(() => {

          if (timeoutid !== 0) {
            playlistClearout && document.removeEventListener('yt-page-type-changed', playlistClearout, once);
            timeoutid = 0;
          }
          playlistClearout = null;
          count = N - 1;
          let object = kRef(wObject)
          wObject = null;
          return object ? object.playlistId : null;
        })

      }

      if (!isLoadStartListened) {
        isLoadStartListened = true;
        document.addEventListener('loadstart', loadStartFx, true)
      }

      handleNavigate.apply($this, $arguments);

    }

  };

  pageScripts.set("tabview-miniview-browser-enable", () => {

    if (miniview_enabled) return;

    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    if (!isPassiveArgSupport) return;

    // console.log("tabview-miniview-browser-enable");

    miniview_enabled = true;

    const ytdAppElm = document.querySelector('ytd-app');
    const ytdAppCnt = insp(ytdAppElm);


    if (!ytdAppCnt) return;

    /*
    
    let mReq = null;
    let mReqC = 0;
    let saveAndPush = ytdApp.saveAndPush
    ytdApp.saveAndPush=function(url, command, pageData, int){
      console.log(`SaveAndPush-${!!mReq}`, this, arguments)
      return saveAndPush.apply(this,arguments)
    }
    */

    // const getFixedUrlFromRedirectedUrl = (url)=>{

    //   const currentUrl = location.pathname + location.search;
    //   if(url.startsWith('/watch?v=') && currentUrl.startsWith('/watch?v=')){
    //     console.debug('req url', url);
    //     if(!/&pp=[^\=&?]+/.test(currentUrl)) url = url.replace(/&pp=[^\=&?]+/,'');
    //     console.debug('g url', url)
    //   }
    //   return url;
    // }

    // yt-navigate enpoint

    // let skipUtil = 0;

    const cProto = ytdAppCnt.constructor.prototype;

    if (!cProto.handleNavigate) return;

    if (cProto.handleNavigate.__ma355__) return;

    cProto.handleNavigate = handleNavigateFactory(cProto.handleNavigate);

    cProto.handleNavigate.__ma355__ = 1;

  });

  const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
  // https://caniuse.com/?search=observer
  // https://caniuse.com/?search=addEventListener%20passive

  const bubblePassive = isPassiveArgSupport ? { capture: false, passive: true } : false;
  const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;


  /** @type {Map<string, Function>} */
  let handleDOMAppearFN = new Map();
  function handleDOMAppear( /** @type {string} */ fn, /** @type { listener: (this: Document, ev: AnimationEvent ) => any } */ func) {
    if (handleDOMAppearFN.size === 0) {
      document.addEventListener('animationstart', (evt) => {
        const animationName = evt.animationName;
        if (!animationName) return;
        let func = handleDOMAppearFN.get(animationName);
        if (func) func(evt);
      }, capturePassive)
    } else {
      if (handleDOMAppearFN.has(fn)) return;
    }
    handleDOMAppearFN.set(fn, func);
  }


  function detachedFunc(cnt, f) {

    if (!cnt.detacheds) {
      cnt.detacheds = []
      if (typeof cnt.detached !== 'function') console.warn('cnt.detached is not a function.')
      cnt._detached_original = cnt.detached
      cnt.detached = function () {
        let ret = this._detached_original();
        try {
          for (const s of this.detacheds) s(this);
        } catch (e) {
          console.warn(e)
        }
        return ret;
      }
    }
    cnt.detacheds.push(f)

  }


  function closestYTDButton(elm) {
    let pelm = elm;
    while (pelm) {
      if (pelm && pelm.nodeType === 1) {
        let nodeName = pelm.nodeName.toUpperCase()
        if (nodeName === 'YTD-BUTTON-RENDERER' || nodeName === 'YT-BUTTON-RENDERER') break;
      }
      pelm = nodeParent(pelm);
    }
    return pelm ? pelm : null;
  }

  const DONATION_HANDS_D = "DONATION_HANDS";
  const DONATION_HANDS_id = "donation_hands";
  const DONATION_PATH =
    `M11.6 22.4c-.6-.1-1-.4-1.4-1.2-.2-.4-.4-.6-.7-.7-.6-.2-1-.6-1.3-1.2-.2-.5-.4-.7-.6-.8-.7-.2-1.1-.6-1.4-1.2-.2-.5-.3-.6-.8-.9-.7-.3-3.8-3.3-4.3-4.3a8 
  8 0 0 1-.7-5.3A7.7 7.7 0 0 1 5 1.9c2.1-.7 4.4-.5 6.2.7l.8.4.9-.4a7.5 7.5 0 0 1 7.1-.3c1.2.6 2.5 1.9 3.1 3.1a6 6 0 0 1 .7 
  3.2c0 2.1-.5 3.4-2.3 5.2-.7.8-1.2 1.2-1.6 1.4-.5.2-.6.3-.9.9-.3.5-.4.7-1 1-.5.2-.7.4-.9.9-.3.6-.7 1-1.3 1.2-.3 0-.4.2-.6.6-.3.5-1.8 2.2-2.3 
  2.4-.4.2-.9.3-1.3.2zm1.6-1.8c1-1 1.1-1.3.7-1.8-.4-.6-.8-.4-1.9.6-.9.9-1.1 1.3-.6 1.7.5.5.9.3 1.8-.5zm-1.9-2c.6-.7.8-1 .8-1.3 0-.4-.4-.9-.8-.9a6 6 0 0 
  0-2 1.9c-.3.5.1 1.1.8 1.1.2 0 .5-.2 1.2-.8zm4.5-.7c.2-.1.3-.3.3-.6 0-.4-.2-.6-2.7-3.1l-2.6-2.9a.5.5 0 0 1 .5-.5c.2 0 1.3 1 2.9 2.6 2.7 2.7 2.7 2.7 3.1 
  2.7.6-.1.8-.4.7-.9 0-.2-1.2-1.5-2.7-3s-2.6-2.8-2.6-2.9a.5.5 0 0 1 .5-.5 31 31 0 0 1 2.9 2.7c2.4 2.4 2.7 2.7 3.1 2.7.5 0 
  .8-.3.8-.8 0-.3-.4-.8-3.1-3.5l-3.2-3.1-1.8 1.6-1.9 1.8c-.4.3-1 .3-1.8.1C7.3 10 7 9.7 6.9 9c-.1-.5-.1-.5 1.9-2.5l2.1-2.3c.2-.3.2-.3-.2-.6a6.3 6.3 0 0 
  0-4.2-1c-1.4.2-2.4.7-3.4 1.7a5.8 5.8 0 0 0-1.8 4.3c0 1.8.5 3 1.9 4.4a12.3 12.3 0 0 1 .9.8l1.3-1.1c1.3-1.3 1.7-1.4 2.5-1.2.5.1 1.1.7 3.8 3.4 3.4 3.4 
  3.5 3.5 4.1 3zm-6.5-1.4.9-1.1c0-.4-.5-.9-.9-.9-.3 0-.5.2-1.2.9-1 .9-1.1 1.2-.7 1.7.1.2.3.3.6.3.4 0 .6-.1 1.3-.9zM7 14.8c1.1-.9 1.2-1 1.1-1.5 
  0-.2-.1-.5-.3-.6-.3-.2-.4-.2-.7-.1l-1.1.9c-.8.8-.9 1.3-.5 1.7s.8.3 1.5-.4zm14.8-3A6 6 0 0 0 20 3.5a6.6 6.6 0 0 0-6.5-.1C13 3.8 8 8.6 8 8.8c0 
  .3.3.4.8.5s.5.1 2.5-1.9c1.6-1.4 2.1-1.9 2.4-1.9s1 .7 3.8 3.5l3.7 3.4c.1 0 .4-.2.6-.6z`;


  // https://www.youtube.com/watch?v=L_tg2u26tCU
  // https://www.youtube.com/watch?v=uz8dDuKVjJI

  const dsMgr = {
    onVisibilityChanged() {
      let ytdFlexyElm = getYtdWatchFlexyElement();
      // let updateIcon = false
      if (ytdFlexyElm) {
        const shelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy')
        const shelfCnt = insp(shelfElm);

        let currentVisibile = shelfElm && shelfCnt && shelfCnt.isAttached === true && !shelfElm.classList.contains('tyt-hidden') && !shelfElm.hasAttribute('hidden')
        let tytAttr = ytdFlexyElm.hasAttribute('tyt-donation-shelf')
        if (currentVisibile) {
          if (shelfCnt.isCollapsed === true) shelfCnt.isCollapsed = false // for shelf content
        }
        if ((currentVisibile === true) ^ (tytAttr === true)) {
          if (currentVisibile) _setAttribute.call(ytdFlexyElm, 'tyt-donation-shelf', '');
          else ytdFlexyElm.removeAttribute('tyt-donation-shelf');
          // updateIcon = true;
        }
        // if(updateIcon){
        //   Promise.resolve(ytdFlexyElm).then((ytdFlexyElm)=>{
        //     dsMgr.setVisibility({detail: {
        //       visibility: ytdFlexyElm.hasAttribute('tyt-donation-shelf'),
        //       flushDOM: true
        //     }})
        //   })
        // }
      }
    },
    toggleVisibility(brElm) {

      const shelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy');
      if (!shelfElm || shelfElm.hasAttribute('hidden') || !brElm) return;
      const brCnt = insp(brElm);
      if (!brCnt.data || typeof brCnt.notifyPath !== 'function') {
        console.warn('unknown error found in dsMgr.toggleVisibility()');
        return;
      }
      if (!shelfElm.classList.contains('tyt-hidden')) {
        shelfElm.classList.add('tyt-hidden'); // note: the content will be still updating with tyt-hidden => dataChanged
        brCnt.data.style = 'STYLE_DEFAULT';
      } else {
        shelfElm.classList.remove('tyt-hidden');
        brCnt.data.style = 'STYLE_BLUE_TEXT';
      }
      const brHost = cppr(brElm, 'overrides');
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
      brCnt.notifyPath('data.style');
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
    },
    onButtonAppended(brElm) {
      if (!brElm) return;
      const brHost = cppr(brElm, 'overrides');
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
      brElm.id = 'tyt-donation-shelf-toggle-btn';
      brElm.removeEventListener('click', dsMgr.shelfBtnClickHanlder, false);
      brElm.addEventListener('click', dsMgr.shelfBtnClickHanlder, false);
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
      dsMgr.onVisibilityChanged();
    },
    onDSAppended(cnt) {
      const donationShelf = (cnt || 0).hostElement || cnt || null;
      if (!donationShelf) return;

      let buttons = document.querySelector('div#buttons.ytd-masthead');
      if (buttons) {
        dsMgr.createToggleBtn();
      }

    },
    shelfBtnClickHanlder(evt) {
      let brElm = this
      dsMgr.toggleVisibility(brElm);
      dsMgr.onVisibilityChanged();
    },
    checkS(s) {

      if (!s) return false;
      let br = s.buttonRenderer;
      if (br === dsMgr._dsToggleButtonRenderer) return true;
      if (((br || 0).icon || 0).iconType === DONATION_HANDS_D) return true;
      return false;

    },
    regenTopButtons() {

      let masthead = document.querySelector('ytd-masthead#masthead')
      if (!masthead) return;

      let mastheadData = masthead.data
      if (!mastheadData) return;

      let topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;

      mastheadData.topbarButtons = null;
      masthead.notifyPath('data.topbarButtons')

      mastheadData.topbarButtons = topbarButtons;
      masthead.notifyPath('data.topbarButtons')



    },
    async createToggleBtn() {

      let donationShelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (!donationShelfElm) return;

      const donationShelfCnt = insp(donationShelfElm);

      if ((donationShelfCnt.detacheds || 0).swVq2 !== 1) {
        detachedFunc(donationShelfCnt, (s) => {
          Promise.resolve(s).then((s) => {
            if (s.isAttached === true) return;
            dsMgr._dsToggleButtonRenderer.i8KBd = 1;
            dsMgr._lastDSVideo = null;
            // if (s && typeof s.removeAttribute === 'function') s.removeAttribute('swVq2');
            dsMgr.removeToggleBtn();
            dsMgr.onVisibilityChanged();
          })
        });
        (donationShelfCnt.detacheds || 0).swVq2 = 1;
      }

      /** @type {object[]} */
      const { res, mastheadCnt, mastheadData } = await (async () => {

        for (let i = 0; i < 3; i++) {

          const mastheadElm = document.querySelector('ytd-masthead#masthead');
          if (!mastheadElm) return {};

          let mastheadCnt = insp(mastheadElm) || mastheadElm;

          let mastheadData = mastheadCnt.data

          if (mastheadData) {
            return { res: 1, mastheadElm, mastheadCnt, mastheadData };
          } else if (i === 0) {
            await getRAFPromise().then(); // background -> foreground
            await delayPn(80); // + 80ms
          } else if (i === 1) {
            await delayPn(520); // background -> foreground + 80ms+ 520ms
          }
          if (typeof IntersectionObserver !== 'undefined') {
            await new Promise((resolve) => {
              let io = new IntersectionObserver(() => {
                if (io) {
                  io.disconnect();
                  io = null;
                  resolve();
                }
              });
              io.observe(mastheadElm);
            });
          }
        }
        return {};

      })();
      if (!res) return;

      const topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;


      function addIcon(g, k) {

        let svgSet = document.querySelector(`iron-iconset-svg[name="${k}"]`)
        let defs = document.querySelector(`iron-iconset-svg[name="${k}"] defs`)
        let g1 = g.cloneNode(true);
        defs.appendChild(g1)
        svgSet._icons = null;

      }

      function createDonationHandsIcon() {
        let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        g.appendChild(path);

        g.setAttribute('id', `${DONATION_HANDS_id}`);
        const d = DONATION_PATH
        path.setAttribute('d', d);
        path.setAttribute('swVq1', '1');

        return g;
      }

      const arr = topbarButtons
      let dBtn = false
      for (const s of arr) {
        if (dsMgr.checkS(s)) {
          dBtn = s;
          break;
        }
      }

      const toggleActive = donationShelfElm.classList.contains('tyt-hidden') === false

      dsMgr._dsToggleButtonRenderer = {
        "icon": {
          "iconType": DONATION_HANDS_D,
        },
        "accessibility": {
          "accessibilityData": {
            "label": "Toggle Donation Shelf"
          }
        },
        "tooltip": "Toggle Donation Shelf",
        "style": toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT",
        "size": "SIZE_DEFAULT",
      };

      if (dBtn === false) {

        if (!document.querySelector(`iron-iconset-svg[name="yt-icons"] [id="${DONATION_HANDS_id}"]`)) {
          let g = createDonationHandsIcon();
          addIcon(g, "yt-icons");
        }

        arr.unshift({
          get buttonRenderer() {
            // console.log(4545, dsMgr._dsToggleButtonRenderer.i8KBd)
            if (dsMgr._dsToggleButtonRenderer.i8KBd === 1) {
              // regenerate after re-attachment
              dsMgr._dsToggleButtonRenderer = Object.assign({}, dsMgr._dsToggleButtonRenderer);
              dsMgr._dsToggleButtonRenderer.i8KBd = 0;
              Promise.resolve(0).then(dsMgr.regenTopButtons)
            }
            return dsMgr._dsToggleButtonRenderer
          }
        });

        // if(masthead.__dataHasAccessor && masthead.__dataHasAccessor.buttonOverrides === true) masthead.__dataHasAccessor.buttonOverrides = false;
        mastheadCnt.notifyPath("data.topbarButtons");
      } else {
        const brElm = document.querySelector('#tyt-donation-shelf-toggle-btn');
        if (brElm) {
          const brCnt = insp(brElm);
          const brHost = cppr(brElm, 'overrides');
          if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
          const data = brElm.data;
          data.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
          brCnt.notifyPath('data.style');
        } else {
          dsMgr._dsToggleButtonRenderer.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
          mastheadCnt.notifyPath("data.topbarButtons");
        }

      }

      dBtn = null

      dsMgr.onVisibilityChanged();

    },
    removeToggleBtn(evt) {

      let donationShelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (donationShelfElm && insp(donationShelfElm).isAttached === true) return;


      // console.log(4455)
      // if(!document.querySelector('#tyt-donation-shelf-toggle-btn')) return;

      /** @type {object[]} */
      const mastheadElm = document.querySelector('ytd-masthead#masthead');
      if (!mastheadElm) return;
      const mastheadCnt = insp(mastheadElm);

      const mastheadData = mastheadCnt.data
      if (!mastheadData) return;

      const topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;



      const arr = topbarButtons

      let j = -1, l = arr.length;
      for (let i = 0; i < l; i++) {
        if (j > -1) {
          arr[i - 1] = arr[i]
        } else {
          // j < 0

          let s = arr[i]

          if (dsMgr.checkS(s)) {
            j = i;
            arr[i] = null
          }
        }
      }
      // console.log(j, l)
      if (j > -1) {
        arr.length = l - 1;
        mastheadCnt.notifyPath("data.topbarButtons")
      }

      // console.log(552)

    },
    setVisibility(evt) {
      let detail = (evt || 0).detail || 0
      if (typeof detail.visibility !== 'boolean') return;

      let donationShelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (!donationShelfElm) return;
      const donationShelfCnt = insp(donationShelfElm);

      if ((donationShelfCnt.detacheds || 0).swVq2 !== 1) {
        return;
      }


      /** @type {object[]} */
      const mastheadElm = document.querySelector('ytd-masthead#masthead');
      if (!mastheadElm) return;
      const mastheadCnt = insp(mastheadElm);

      const mastheadData = mastheadCnt.data
      if (!mastheadData) return;

      const topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;


      if (!document.querySelector(`iron-iconset-svg[name="yt-icons"] [id="${DONATION_HANDS_id}"]`)) {
        return;
      }

      const arr = topbarButtons;
      let dBtn = false;
      for (const s of arr) {
        if (dsMgr.checkS(s)) {
          dBtn = s;
          break;
        }
      }

      if (dBtn === false) {
        return;
      }

      if (!dsMgr._dsToggleButtonRenderer || !dsMgr._dsToggleButtonRenderer.icon) return;


      const toggleActive = detail.visibility === true;
      const currentHidden = donationShelfElm.classList.contains('tyt-hidden');
      if (currentHidden === true && toggleActive === true) {
        donationShelfElm.classList.remove('tyt-hidden');
      } else if (currentHidden === false && toggleActive === false) {
        donationShelfElm.classList.add('tyt-hidden');
      }

      const flushDOM = detail.flushDOM === true;

      const brElm = document.querySelector('#tyt-donation-shelf-toggle-btn');
      if (brElm) {
        const brCnt = insp(brElm);
        const brHost = cppr(brElm, 'overrides');
        if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
        const data = brCnt.data;
        data.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
        brCnt.notifyPath('data.style');
      } else {
        dsMgr._dsToggleButtonRenderer.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
        flushDOM = true;
      }
      if (flushDOM) {
        dsMgr._dsToggleButtonRenderer = Object.assign({}, dsMgr._dsToggleButtonRenderer);
        mastheadCnt.notifyPath("data.topbarButtons");
      }
      // console.log(33435, dsMgr._dsToggleButtonRenderer.style)

      dBtn = null;

      dsMgr.onVisibilityChanged();

    },
    async triggerDOMAppearWhenDataChanged(cnt) {

      await Promise.resolve(0);
      const ds = (cnt || 0).hostElement || cnt || null;
      let videoId = ((cnt || 0).data || 0).videoId || 0;
      if (!videoId) return;
      let lastDSVideo = dsMgr._lastDSVideo;
      if (lastDSVideo === videoId) {
        return;
      }
      dsMgr._lastDSVideo = videoId;
      if (typeof videoId === 'string') {
        // note: this will not work for video with donation section -> switching to normal video -> switching back to this.
        cnt.disconnectedCallback(); // native bug - switch between two campaign videos -> donation money flashing
        dsMgr._dsToggleButtonRenderer.i8KBd = 1;
        ds.classList.remove('tyt-hidden');
        HTMLElement.prototype.removeAttribute.call(ds, 'swVq2');
        await Promise.resolve(0);
        cnt.connectedCallback();

        Promise.resolve(ds).then((ds) => {
          dsMgr.setVisibility({
            detail: {
              visibility: !ds.classList.has('tyt-hidden'),
              flushDOM: true
            }
          })
        })

      }

    },
    caHandler1(evt) {
      // html[tabview-unwrapjs="1"] ytd-masthead#masthead div#buttons.ytd-masthead path[swVq1="1"]
      if (!evt || !evt.target) return;
      const path = evt.target;
      if (path.getAttribute('swVq1') !== '1') return;
      path.setAttribute('swVq1', '2')
      const brElm = closestYTDButton(path)
      if (!brElm) return;
      dsMgr.onButtonAppended(brElm);
    },
    caHandler2(evt) {
      // html[tabview-unwrapjs="1"] ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty):not([swVq2="1"])
      const target = (evt || 0).target || 0;
      if (target.nodeType !== 1) return;
      const cnt = insp(target);
      dsMgr._lastDSVideo = (((cnt || 0).data || 0).videoId || 0); // avoid double calling triggerDOMAppearWhenDataChanged
      _setAttribute.call(target, 'swVq2', '1')
      dsMgr.onDSAppended(cnt);
      if (typeof cnt.dataChangedM !== 'function' && typeof cnt.dataChanged === 'function') {
        cnt.dataChangedM = cnt.dataChanged
        if (typeof cnt.updateStylesM !== 'function' && typeof cnt.updateStyles === 'function') {
          cnt.updateStylesM = cnt.updateStyles
          cnt.updateStyles = function (c) {
            let data = null;
            if (this.isAttached === true) {
              data = this.data;
              if (data) {
                if ('--progress-bar-completion' in (c || 0) && typeof data.progress !== 'number') {
                  return;
                }
              }
            }
            if (!data) dsMgr._lastDSVideo = null;
            else { return this.updateStylesM.apply(this, arguments) }
          }
        }
        cnt.dataChanged = function () {
          dsMgr.triggerDOMAppearWhenDataChanged(this);
          return cnt.dataChangedM();
        }
      }
    }

  }

  dsMgr._lastDSVideo = null;
  dsMgr._dsToggleButtonRenderer = {};
  handleDOMAppear('swVq1DOMAppended', dsMgr.caHandler1);
  handleDOMAppear('swVq2DOMAppended', dsMgr.caHandler2); // ytd-donation-shelf-renderer.ytd-watch-flexy
  // documentEventListen('tabview-donation-shelf-set-visibility', dsMgr.setVisibility, false);

  const buttonTooltipPositionProp = {
    get() {
      return 'top';
    },
    set() {

    },
    enumerable: true,
    configurable: true
  };

  function fixTooltipsK1(s) {
    _setAttribute.call(s, 'tyt-placed-to-top', '');

    s.removeAttribute('fit-to-visible-bounds'); // related to the button position only; ignore page layout
    _setAttribute.call(s, 'offset', '0'); // offset is for bottom tooltip only
    // s.style.marginTop='-82px'
    let p = s;
    while ((p = nodeParent(p)) instanceof HTMLElement) {
      // console.log(p)
      if ('buttonTooltipPosition' in p) {
        // console.log(p.nodeName)
        p.buttonTooltipPosition = 'top';
        // p.__data.buttonTooltipPosition = 'top';
        if ('__data' in p) {
          Object.defineProperty(p.__data, 'buttonTooltipPosition', buttonTooltipPositionProp);
        }
        break;
      }
    }

  }

  function fixTooltipsK2(s) {

    _setAttribute.call(s, 'fit-to-visible-bounds', ''); // fix native tooltip bug due to YouTube Layout change since 2023.05.18

  }


  async function asyncFixPrimaryInfoTooltipAppeared() {

    for (const s of document.querySelectorAll('#actions.ytd-watch-metadata tp-yt-paper-tooltip:not([tyt-placed-to-top])')) {
      // earlier than `html[tabview-unwrapjs="1"] #actions.ytd-watch-metadata tp-yt-paper-tooltip`
      fixTooltipsK1(s);
    }
    for (const s of document.querySelectorAll('#description.ytd-watch-metadata tp-yt-paper-tooltip[for="info"]:not([fit-to-visible-bounds])')) {
      // earlier than `html[tabview-unwrapjs="1"] #description.ytd-watch-metadata tp-yt-paper-tooltip`
      fixTooltipsK2(s);
    }
  }
  asyncFixPrimaryInfoTooltipAppeared();

  // for(const s of document.querySelectorAll('#actions.ytd-watch-metadata ytd-menu-renderer.ytd-watch-metadata')){
  //   k2(s);
  // }

  // for subsequent `#actions.ytd-watch-metadata tp-yt-paper-tooltip`
  handleDOMAppear('primaryInfoMenuTooltipAppear', (evt) => {
    let s = evt.target;
    fixTooltipsK1(s);
  });

  // for subsequent `#description.ytd-watch-metadata tp-yt-paper-tooltip`
  handleDOMAppear('primaryInfoDescTooltipAppear', (evt) => {
    let s = evt.target;
    fixTooltipsK2(s);
  });

  pageScripts.set('tabview-zoom-updated', () => {
    for (const s of document.querySelectorAll('.tyt-visible-comment ytd-expander')) s.calculateCanCollapse(true);
  });

  pageScripts.set('tabview-yt-data-reassign', (target) => {
    // Example target: playlist
    if (!target || !target.is) return;
    const cnt = insp(target);
    Promise.resolve().then(() => {
      const data = cnt.data;
      if (data) {
        cnt.data = Object.assign({}, data); // the playlist appended to tab container might lose its reorder control. 
      }
    });
  });

  pageScripts.set("tabview-fix-live-chat-toggle-btn", () => {
    fixLiveChatToggleButton();
  });

  globalFunc(function tabviewDispatchEvent(elmTarget, eventName, detail) {
    if (!elmTarget || typeof elmTarget.nodeType !== 'number' || typeof eventName !== 'string') return;
    if (detail && typeof detail === 'object') {
      elmTarget.dispatchEvent(new CustomEvent(eventName, { detail: detail }))
    } else {
      elmTarget.dispatchEvent(new CustomEvent(eventName))
    }
  });


  globalFunc(function tabviewSetMyDefaultTab(m) {
    top.tabviewDispatchEvent(document, 'tabview-setMyDefaultTab', { myDefaultTab: m })
  });



  let fixHistoryStatePN = null;

  if (FIX_UNCERTAIN_HISTORY_STATE) {
    // history.state cannot be amended by the replaceState.
    // require ytd-app.replaceState
    // reason: unknown
    // the history.state is also different from the isolated script's history.state

    document.addEventListener("yt-navigate-start", (evt) => { // primary

      const data = evt.detail;
      // const entryTime = evt.timeStamp;
      const entryTime = window.performance.now(); // should be mono increasing

      Promise.resolve().then(() => {

        if (data.pageType === 'watch' && data.reload === false && typeof data.url === 'string' && data.endpoint) {

          const s = {
            "endpoint": deepClone(data.endpoint),
            "savedComponentState": {},
            "entryTime": entryTime
          }
          xReplaceState(s, data.url);

          console.debug('[tyt] FIX_UNCERTAIN_HISTORY_STATE for yt-navigate-start')
        }

      });


    }, true);


    fixHistoryStatePN = () => { // fallback

      Promise.resolve().then(() => {

        const u = `${location.pathname}${location.search}`;
        let q = /^\/watch\?v=([^=?&]+)/.exec(u);
        let vid = q ? q[1] : '';

        if (vid && (history.state === null || ((((history || 0).state || 0).endpoint || 0).watchEndpoint || 0).videoId !== vid)) {

          const s = {
            "endpoint": {
              "watchEndpoint": {
                "videoId": vid,
                "watchEndpointSupportedOnesieConfig": { // optional; object
                  "html5PlaybackOnesieConfig": {
                  }
                },
                "watchEndpointSupportedPrefetchConfig": {
                  "prefetchHintConfig": {
                    "prefetchPriority": 0,
                    "countdownUiRelativeSecondsPrefetchCondition": -3
                  }
                }
              },
              "commandMetadata": {
                "webCommandMetadata": {
                  "url": u,
                  "webPageType": "WEB_PAGE_TYPE_WATCH",
                  "rootVe": 3832
                }
              }
            },
            "savedComponentState": {},
            "entryTime": window.performance.now()
          };
          if ((location.hash || '').length > 1) {
            // see https://github.com/cyfung1031/Tabview-Youtube/issues/28
            let bh = location.href;
            xReplaceState(s, u);
            try {
              history.replaceState(history.state, '', bh);
            } catch (e) { }
            // delayed timestamp #t=38s
          } else {
            xReplaceState(s, u);
          }
          console.debug('[tyt] FIX_UNCERTAIN_HISTORY_STATE for NULL or VideoChanged state')

        }
      });



    };


  }


  // documentEventListen('tabview-chat-fix-url-on-new-video-page', function (evt) {
  //   // TODO
  // }, true);

  // let r33 = null;



  /*
  const _ytIframeReloadDelay_ = window._ytIframeReloadDelay_ = window._ytIframeReloadDelay_ || (function () {
    let pIfr = 0;
    let url1 = null;
    let url2 = null;
    const pfn = resolve => {
      if (!pIfr) {
        pIfr = document.getElementById('d8y9c');
        if (!pIfr) {
          let tp = document.createElement('template');
          tp.innerHTML = '<iframe id="d8y9c" style="display:none" sandbox="allow-same-origin"></iframe>';
          pIfr = tp.content.firstElementChild;
          tp = null;
          (document.body || document.documentElement).appendChild(pIfr);
        }
      }
      pIfr.onload = resolve;
      if (!url1) url1 = URL.createObjectURL(new Blob([], { type: 'text/html' }));
      const c = url1;
      url1 = url2;
      url2 = c;
      pIfr.contentDocument.location.replace(c);
    };
    let aLock = Promise.resolve();
    return (() => {
      const p = aLock = aLock.then(() => new Promise(pfn).catch(console.warn)).then(() => {
        pIfr.onload = null;
      });
      return p.then();
    });
  })();
  */

  // documentEventListen('tabview-fix-iframe-ready', async (evt)=>{

  // })

  pageScripts.set('tabview-chat-fix-url-onload-with-empty-body', async (target) => {

    await ytChatFrameSetup.then();

    const chatElm = target;
    if (!chatElm || chatElm.id !== 'chat') return;
    const chatCnt = insp(chatElm);
    if (typeof chatCnt.urlChanged !== 'function') {
      console.log('[tyt] chatCnt.urlChanged is not a function');
      return;
    }

    console.log('[tyt] trigger chatCnt.urlChanged() due to empty body');
    if (typeof chatCnt.urlChanged66 == 'function' && typeof chatCnt.urlChanged === 'function') {
      chatCnt.urlChanged();
    } else {
      console.log('[tyt] chatCnt.urlChanged66 is not defined', chatCnt.urlChanged66);
    }

  });


  pageScripts.set('tyt-resize-chip-cloud', async (target) => {

    await ceHackDone.then();

    if (target.nodeType !== 1) return;
    const cnt = insp(target);
    // console.log(target)
    if (typeof cnt.onResize === 'function') {
      cnt.onResize();
    }
  });


  pageScripts.set('tabview-fix-popup-refit', async () => {
    await ceHackDone.then();
    if (typeof tabviewFixPopupRefitFn === 'function') {
      tabviewFixPopupRefitFn();
    }
  });


  // pageScripts.set('tabview-chat-call-urlchange', async (target) => {
  //   await ytChatFrameSetup.then();
  //   const cnt = insp(target);
  //   if (typeof cnt.urlChangedIO === 'function') {
  //     cnt.urlChangedIO();
  //   }
  // });


  document.addEventListener('tabview-page-script', function (evt) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    const id = evt.detail.id;
    if (!id) {
      console.warn(`[tyt] tabview-page-script: id "${id}" not found.`);
      return;
    }
    const target = evt.target;
    if (!target) {
      console.warn(`[tyt] tabview-page-script: target not found.`);
      return;
    }
    let func = pageScripts.get(id);
    if (func) {
      // console.log(`pageScripts::${id}`, target);
      func(target);
    } else {
      console.warn(`pageScripts::${id}`, 'not found');
    }
  }, true);

  const { onTytUpdateCMCount } = (() => {



    // (()=>{const {commentsCount, countText} =document.querySelector('ytd-comments-header-renderer').polymerController.data; return JSON.stringify({commentsCount, countText})})()
    // '{"commentsCount":{"runs":[{"text":"2.5K"}]},"countText":{"runs":[{"text":"Comments"},{"text":" 2.5K"}]}}'

    // https://www.youtube.com/watch?v=hu6y1ol9yUg
    // (()=>{const {commentsCount, countText} =document.querySelector('ytd-comments-header-renderer').polymerController.data; return JSON.stringify({commentsCount, countText})})()
    // '{"commentsCount":{"runs":[{"text":"2.7K"}]},"countText":{"runs":[{"text":"2,725"},{"text":" Comments"}]}}'

    // https://www.youtube.com/watch?v=whwe0KD_rGw
    // (()=>{const {commentsCount, countText} =document.querySelector('ytd-comments-header-renderer').polymerController.data; return JSON.stringify({commentsCount, countText})})()
    // '{"commentsCount":{"runs":[{"text":"120K"}]},"countText":{"runs":[{"text":"120,937"},{"text":" Comments"}]}}'
    // '{"commentsCount":{"runs":[{"text":"12万"}]},"countText":{"runs":[{"text":"120,937"},{"text":" 件のコメント"}]}}'
    // '{"commentsCount":{"runs":[{"text":"120.937"}]},"countText":{"runs":[{"text":"120.937"},{"text":" Kommentare"}]}}'
    // '{"commentsCount":{"runs":[{"text":"120 N"}]},"countText":{"runs":[{"text":"120.937"},{"text":" bình luận"}]}}'

    // https://www.youtube.com/watch?v=kJQP7kiw5Fk
    // (()=>{const {commentsCount, countText} =document.querySelector('ytd-comments-header-renderer').polymerController.data; return JSON.stringify({commentsCount, countText})})()
    // '{"commentsCount":{"runs":[{"text":"4.2M"}]},"countText":{"runs":[{"text":"4,257,809"},{"text":" Comments"}]}}'
    // '{"commentsCount":{"runs":[{"text":"425万"}]},"countText":{"runs":[{"text":"4,257,809"},{"text":" 件のコメント"}]}}'
    // '{"commentsCount":{"runs":[{"text":"42 લાખ"}]},"countText":{"runs":[{"text":"42,57,809"},{"text":" ટિપ્પણી"}]}}'
    // '{"commentsCount":{"runs":[{"text":"4,2 Mio."}]},"countText":{"runs":[{"text":"4.257.811"},{"text":" Kommentare"}]}}'

    function stringTest(text) {
      if (typeof text === 'string' && text.length > 0 && /\d+/.test(text) && !/\d+/.test(text.replace(/\d+([.,]\d+)?/, ''))) {
        text = text.replace(/[\s\x20\xA0\u1680\u180E\u2000-\u200d\u202f\u205f\u3000\uFEFF]+/g, ' '); // https://www.jkorpela.fi/chars/spaces.html
        let m;
        if (m = /^\s*(\d+([.,]\d+)?)(\s?)([^-.,_\s\d?#$@&^()\[\]:;"'\/\\<>*{}]+\.?)\s*$/.exec(text)) {
          return `${m[1]}${m[3]}${m[4]}`;
        }
        m = text.match(/\d+([.,]\d+)?.*?/);
        if (m) return `${m[0].trim()}`;
      }
      return "";
    }

    function tryReplace(dataText, oldNumText, oldNumInt, newNum) {

      if (dataText.includes(`${oldNumInt}`) && !/\d/.test(dataText.replace(`${oldNumInt}`, ""))) {
        return dataText.replace(`${oldNumInt}`, `${newNum}`);
      }
      return "";
    }

    function tryCorrectHeaderCount(headerCnt, commentsCountRes) {

      if (!headerCnt || !commentsCountRes) return commentsCountRes;


      let t = headerCnt.hostElement;
      if (!(t instanceof HTMLElement)) return commentsCountRes;
      while ((t = nodeParent(t)) instanceof HTMLElement) {
        if (t.is) break;
      }
      const parentCnt = t instanceof HTMLElement && t.is ? insp(t) : null;
      if (parentCnt) {
        const data = (parentCnt.__data || parentCnt).data || parentCnt.data;
        const dCount1 = (data.header || 0).length;
        const dCount2 = (data.contents || 0).length;
        if (dCount1 >= 1 && dCount2 >= 1) {

          const headerData = headerCnt.data;
          if (headerData && headerData === data.header[0].commentsHeaderRenderer) {

            const n = dCount2;
            const oldCText = commentsCountRes;
            const oldCNum = parseInt(commentsCountRes.replace(/\D/g, ''), 10);

            if (n > oldCNum && oldCNum > -1 && `${oldCText}` === `${oldCNum}` && oldCNum < 1000 && n < 1000) {
              // target: 
              //    - no format ("400" = "400")
              //    - count < 1000



              const changes = [];
              let newCText = "";

              const { commentsCount, countText } = headerData;

              if (commentsCount) {

                if (commentsCount.runs && commentsCount.runs.length === 1 && commentsCount.runs[0].text) {
                  if (newCText = tryReplace(commentsCount.runs[0].text, oldCText, oldCNum, n)) {
                    commentsCount.runs[0].text = newCText;
                  }


                  if (newCText) {
                    let m = Object.assign({}, data.header[0].commentsHeaderRenderer.commentsCount, { runs: commentsCount.runs });
                    changes.push({ commentsCount: m });
                  }

                }

              }



              if (countText) {
                if (countText.runs && countText.runs.length === 2 && typeof countText.runs[0].text === 'string' && typeof countText.runs[1].text === 'string') {

                  let text;
                  if (text = tryReplace(countText.runs[0].text, oldCText, oldCNum, n)) {
                    newCText = text;
                    countText.runs[0].text = newCText;
                  } else if (text = tryReplace(countText.runs[1].text, oldCText, oldCNum, n)) {
                    newCText = text;
                    countText.runs[1].text = newCText;
                  }

                  if (newCText) {
                    let m = Object.assign({}, data.header[0].commentsHeaderRenderer.countText, { runs: countText.runs });

                    changes.push({ countText: m });
                  }

                }
              }



              if (changes.length > 0) {

                headerCnt.data = Object.assign({}, headerCnt.data, ...changes); // update header text
                Promise.resolve().then(() => {
                  headerCnt.headerChanged_();
                });

                commentsCountRes = `${n}`;
              }

            }


            //           let runs = [{ text: data.contents.length.toLocaleString(document.documentElement.lang) }, countText.runs[1]];
            //           let m = Object.assign({}, data.header[0].commentsHeaderRenderer.countText, { runs: runs });
            //           headerCnt.data = Object.assign({}, headerCnt.data, { countText: m }); // update header text
            //           Promise.resolve().then(() => {
            //             cnt.headerChanged_(); // ask to update tab count span
            //           })
          }

        }

      }
      return commentsCountRes;

    }

    function onTytUpdateCMCount() {

      const headerElm = document.querySelector('#tab-comments ytd-comments-header-renderer');
      if (!headerElm || !headerElm.is) return;
      const headerCnt = insp(headerElm);

      let commentsCountRes = "";
      const headerCntData = headerCnt.data;
      if (!headerCntData) return;

      const { commentsCount, countText } = headerCntData;
      // let {commentsCount, countText } = JSON.parse('{"commentsCount":{"runs":[{"text":"2.5K"}]},"countText":{"runs":[{"text":"Comments"},{"text":" 2.5K"}]}}');

      if (commentsCount) {

        if (commentsCount.runs && commentsCount.runs.length === 1 && commentsCount.runs[0].text) {
          const text = stringTest(commentsCount.runs[0].text);
          if (text) {
            commentsCountRes = text;
          }
        }

      }



      if (commentsCountRes === "" && countText) {
        if (countText.runs && countText.runs.length === 2 && typeof countText.runs[0].text === 'string' && typeof countText.runs[1].text === 'string') {

          let text;
          if (text = stringTest(countText.runs[0].text)) {
            commentsCountRes = text;
          } else if (text = stringTest(countText.runs[1].text)) {
            commentsCountRes = text;
          }

        }
      }

      if (commentsCountRes) {

        commentsCountRes = tryCorrectHeaderCount(headerCnt, commentsCountRes);

        if (commentsCountRes) {

          // let tab_btn = closestDOM.call(span, '.tab-btn[tyt-tab-content="#tab-comments"]');
          // if (tab_btn) tab_btn.setAttribute('loaded-comment', 'normal');

          const countElm = document.querySelector('#tyt-cm-count');
          if (countElm) {
            countElm.textContent = commentsCountRes;
          }

        }

      }

    }

    return { onTytUpdateCMCount };

  })();

  pageScripts.set('tyt-update-cm-count', onTytUpdateCMCount);


  documentEventListen("tabview-plugin-loaded", () => {
    if (typeof fixHistoryStatePN === 'function') {
      fixHistoryStatePN();
      document.addEventListener('yt-navigate-finish', fixHistoryStatePN, true);
    }
    // ----------- avoid removeChild error {#below}.removeChild({#chat}) -----------
    let below = document.querySelector('div#below.style-scope.ytd-watch-flexy');
    if (below !== null) {
      let below__shady_removeChild = below.__shady_removeChild;
      if (typeof below__shady_removeChild == 'function' && !below.__shady_removeChild2) {
        below.__shady_removeChild2 = below__shady_removeChild;
        below.__shady_removeChild = function (a, b) {
          if (a && a.id === 'chat') {
            const aParent = nodeParent(a);
            if (aParent && '__shady_removeChild' in aParent) {
              return this.__shady_removeChild2.apply(aParent, arguments);
            }
          }
          return this.__shady_removeChild2.apply(this, arguments);
        }
      }
    }
    // -----------------------------------------------------------------------------
  }, false);

  documentEventListen = null; // avoid after call

  _setAttribute.call(document.documentElement, 'tabview-unwrapjs', '1')
  if (document.documentElement.hasAttribute('plugin-tabview-youtube')) {
    dispatchCustomEvent(document, "tabview-plugin-loaded");
  }


  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();

//# sourceURL=debug://tabview-youtube/tabview.inject1.js
