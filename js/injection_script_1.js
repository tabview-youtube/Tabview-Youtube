/*

MIT License

Copyright (c) 2021-2023 cyfung1031

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

  if (document.documentElement && document.documentElement.hasAttribute('tabview-unwrapjs')) {
    console.warn('Multiple instances of Tabview Youtube is attached. [0x7F02]')
    return;
  }

  document.documentElement.setAttribute('tabview-unwrapjs', '')

  let byPassPause = false;

  HTMLVideoElement.prototype.pause = ((pause) => {
    return function () {
      if (arguments.length !== 0) return pause.apply(this, arguments); // fallback
      if (byPassPause) return;
      pause.call(this);
    }
  })(HTMLVideoElement.prototype.pause);


  const querySelectorFromAnchor = HTMLElement.prototype.querySelector;
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;
  const elementAppend = HTMLElement.prototype.appendChild; // necessary for yt custom elements; due to Waterfox classic and https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/174437

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

  /** 
   * @param {HTMLIFrameElement} chatframe 
   * @param {string | null} nSrc
   *  */
  const iframeSrcReplacement = (chatframe, nSrc) => {
    Promise.resolve().then(() => {
      if (chatframe.isConnected !== true) return;
      if (typeof nSrc !== 'string') return;
      try {
        // chatframe.contentWindow.history.replaceState(chatframe.contentWindow.history.state, '', nSrc.replace(/&\d+/,'&d'));
        chatframe.contentWindow.location.replace(nSrc);
      } catch (e) {
        console.log(e);
        chatframe.setAttribute('src', nSrc);
      }
    }).catch(console.warn);
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

  function deepClean(obj) {
    if (obj === null || typeof obj !== 'object') {
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      obj[key] = null;
      deepClean(value);
    }

  }

  const xReplaceState = (s, u) => {
    history.replaceState(s, '', u);
    if (s.endpoint) {
      try {
        const ytdAppElm = document.querySelector('ytd-app');
        const ytdAppCnt = ytdAppElm.inst || ytdAppElm;
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

  const DEBUG_e32 = false;
  // const DO_REQ_CHANGE_FOR_NEXT_VIDEO = false;
  const FIX_UNCERTAIN_HISTORY_STATE = true;

  let _ceHack_calledOnce = false;
  let isLoadStartListened = false;



  DEBUG_e32 && console.log(9442, 103);

  let chatroomRendererElmWR = null

  document.addEventListener("tabview-expander-config", (evt) => {

    if (!evt || !evt.target) return;
    const expanderElm = evt.target;

    const expanderCnt = expanderElm.inst || expanderElm;

    expanderCnt.canToggleJobId = 1;
    expanderCnt.alwaysToggleable = false;
    expanderCnt.recomputeOnResize = false;
    expanderCnt.isToggled = true;
    expanderCnt.canToggle = false;
    expanderCnt.collapsedHeight = 999999;

  }, true);


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

      if (this.elmChat && this.elmChat !== chatElm && (this.loadStatus & 2) === 0 && (this.loadStatus & 4) === 0) {

        // disable this...

        // this.elmChat.classList.remove('tyt-chat-frame-ready');
        // console.log('removed tyt-chat-frame-ready')
        // setTimeout(() => {
        //   console.log('??')
        //   this.elmChat.fixChatframeContentDisplay();
        // }, 1);


        // this.elmChat.removeAttribute('tyt-iframe-loaded')
      }
      if (chatElm === null) {
        const elmChatCnt = (this.elmChat || 0).inst || this.elmChat;
        if (elmChatCnt && elmChatCnt.disconnectedCallback && elmChatCnt.isAttached === true) {

          // disable this...
          // elmChatCnt.disconnectedCallback();

          // console.log('aa', this.elmChat.isAttached)
        }
        this.elmChat = null;
        this.elmChatFrame = null;
        if (this.loadStatus & 1) this.loadStatus -= 1;
        if (this.loadStatus & 2) this.loadStatus -= 2;
        if (this.loadStatus & 4) this.loadStatus -= 4;
        this.clearVars();

      } else {

        // console.log(2242)
        // console.log('initByChat')
        if ((chatElm || 0).id !== 'chat') return;


        this.elmChat = chatElm;
        const elmChatCnt = (this.elmChat || 0).inst || this.elmChat;
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



    /** @param {boolean} b */
    setAdPlaying(b) {
      if (b) {
        this.adsState |= 2; // played once [2]
        if (this.adsState & 1) this.adsState -= 1; // reset pause [1]
        // 2|0 = 2
        if (this.ytLiveChatRendererElm) {
          this.ytLiveChatRendererElm._setIsAdPlaying(true);
        }
        if (this.elmChat) {
          this.elmChat.classList.add('tyt-chat-ads-playing')
        }
      } else {
        if (this.adsState & 2) {
          this.adsState |= 1  // 2|1 = 3; played once & paused
        }
      }
    }

    getPlayerFC() {
      let playerC = this.elmChat ? (this.elmChat.inst || this.elmChat).player : null;
      if (playerC) return playerC;

      let ytdFlexyElm = document.querySelector('ytd-watch-flexy') || 0;
      let cnt = ytdFlexyElm.inst || ytdFlexyElm;
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

      let ytdFlexyElm = document.querySelector('ytd-watch-flexy');
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
      let ytdFlexyElm = document.querySelector('ytd-watch-flexy');
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


      if (this.isChatReplay && !this.ytLiveChatRendererElm._gIxmf) {
        this.ytLiveChatRendererElm._gIxmf = 1;
        this.ytLiveChatRendererElm._setPlayerProgressSec26 = this.ytLiveChatRendererElm._setPlayerProgressSec;
        this.ytLiveChatRendererElm._setPlayerProgressSec = function (x) {
          if (x < 1e-99) x = 1e-99
          let t = this._setPlayerProgressSec26.apply(this, arguments)
          return t
        };

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
      let elm = inCR ? this.ytLiveChatRendererElm : this.ytLiveChatAppElm
      if (elm) return HTMLElement.prototype.querySelector.call(elm, query)
      return null
    }

    getEndPointClicker() {
      let p = this.queryCR('yt-live-chat-header-renderer a.yt-simple-endpoint[aria-selected="true"]', true)

      if (!p) return null
      return {
        // click: ()=>p.click()
        click: () => {

          const ytReloadContElm = HTMLElement.prototype.querySelector.call(p, 'yt-reload-continuation.style-scope.yt-dropdown-menu');
          const ytReloadContCnt = ytReloadContElm.inst || ytReloadContElm;

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
      let liveChatRendererData = (this.ytLiveChatRendererElm || 0).data
      return liveChatRendererData && liveChatRendererData.continuations && liveChatRendererData.isReplay === true
    }

    init() {
      if (this.adsState > 0) return;
      if ((this.loadStatus & 7) === 5 && this.elmChat !== null) {
        // usually not used
        // chat element found; cr found.
        // bug - no load event;
        const chatCnt = this.elmChat.inst || this.elmChat;
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






  document.addEventListener('tyt-engagement-panel-visibility-change', (evt) => {

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
        const ytdWatchFlexy = document.querySelector('ytd-watch-flexy');
        const cnt = ytdWatchFlexy.inst || ytdWatchFlexy;

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
      const cnt = this.inst || this;
      if (cnt.atStart === true) cnt.reset();
    });
  }


  function getInsObserverChipCloud() {


    let insObserver = null;
    if (window.IntersectionObserver) {

      let wm = new WeakMap();


      async function callReset(targetElm, value) {
        // target = yt-chip-cloud-renderer

        const cnt = targetElm.inst || targetElm;

        if (wm.get(targetElm) !== value) {
          wm.set(targetElm, value);
          cnt.reset();
          if (!targetElm.hasAttribute('QNJMC')) {
            targetElm.setAttribute('QNJMC', '');
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
            const cnt = target ? (target.inst || target) : 0;
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

        const cnt = targetElm.inst || targetElm;
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

          let chips = querySelectorFromAnchor.call(targetElm, 'iron-selector#chips');

          if (!chips) return;

          callReset(targetElm, chips.offsetWidth)

        }, 160)

      }

      mutObserver = new MutationObserver(function (mutationList, observer) {
        for (const mutation of mutationList) {
          let target = mutation.target;
          target = target ? (closestFromAnchor.call(target, 'yt-chip-cloud-renderer') || 0) : 0;
          const cnt = target.inst || target;
          if (cnt && cnt.reset) {
            mSet(target);
          }
        }
      })

    }

    return mutObserver;
  }



  let pageID = 0;

  let pageType = null;

  function onPageFetched(evt) {
    dsMgr._dsToggleButtonRenderer.i8KBd = 1;
    pageType = ((evt.detail || 0).pageData || 0).page;
  }

  function onPageFinished(evt) {
    if ((pageID % 2) === 1) {
      pageID++;
      translateHanlder = null;  // release the memory used for previous page
      Promise.resolve(0).then(() => {
        translateHanlder = getTranslate(); // release the memory used for previous page
      });

      let ds = document.querySelector('ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)')
      if (ds && (ds.inst || ds).isAttached === true) {
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




  // https://greasyfork.org/en/scripts/465819-api-for-customelements-in-youtube/

  // =========================

  // @name         API for CustomElements in YouTube
  // @namespace    http://tampermonkey.net/
  // @version      1.4.1
  // @description  A JavaScript tool to modify CustomElements in YouTube
  // @author       CY Fung
  // @grant        none
  // @license      MIT

  /*
  
  MIT License
  
  Copyright (c) 2023 cyfung1031
  
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

  const customYtElements = (function () {
    'use strict';

    const injectorCreationForRegistered = ((fnHandler) => {
      let mMapOfFuncs = new WeakMap();
      if (!(mMapOfFuncs instanceof WeakMap) || (typeof fnHandler !== 'function')) return console.error('[ytI] Incorrect parameters');
      const $callee = function (...args) {

        const f = fnHandler;
        if (!f) return console.error('[ytI] the injector is already destroyed.');

        const isControllerExtraction = typeof this.forwardMethods === 'function' && typeof this._registered === 'undefined';
        const isComponentRegister = typeof this._registered === 'function' && typeof this.forwardMethods === 'undefined';
        let warning = '';
        if (isControllerExtraction) {
          if (typeof this.inst !== 'object') {
            warning += '[ytI] Controller Extraction is enabled but the corresponding instance is not found.\n';
          }
        } else if (isComponentRegister) {
          //
        } else {
          warning += "[ytI] customYtElement's definition is undefined.\n";
        }
        const fnTag = f.__ytHandlerFuncName__;
        if (isControllerExtraction && fnTag !== 'forwardMethods') {
          warning += "[ytI] Unknown Error in injectorCreationForRegistered. (0x3F01)\n";
        }
        if (isComponentRegister && fnTag !== '_registered') {
          warning += "[ytI] Unknown Error in injectorCreationForRegistered. (0x3F02)\n";
        }
        const map = mMapOfFuncs;
        // CE prototype has not yet been "Object.defineProperties()"
        const res = f.call(this, ...args); // normally shall be undefined with no arguments
        // CE prototype has been "Object.defineProperties()"
        let funcs = null;
        try {
          if (warning) throw warning.trim();
          const constructor = this.constructor || null;
          if (!constructor || !constructor.prototype) throw '[ytI] CE constructor is not found or invalid.';
          // constructor.prototype.${fnTag} = f; // restore to original
          delete constructor.prototype[fnTag];
          if (constructor.prototype[fnTag] !== f) {
            constructor.prototype[fnTag] = f;
          }
          funcs = map.get(constructor) || 0;
          if (typeof funcs.length !== 'number') throw '[ytI] This injection function call is invalid.';
          console.debug(`[ytI] ${constructor.prototype.is}'s ${fnTag} has been called.`);
          map.set(constructor, null); // invalidate
          const proto = isControllerExtraction ? this.inst.constructor.prototype : constructor.prototype;
          for (const func of funcs) {
            func(proto); // developers might implement Promise, setTimeout, or requestAnimation inside the `func`.
          }
        } catch (e) {
          console.warn(e);
        } finally {
          if (funcs) funcs.length = 0;
        }
        return res;
      }
      $callee.__ytHandlerFuncName__ = fnHandler.__ytHandlerFuncName__;
      $callee.getMap = () => mMapOfFuncs; // for external
      $callee.getOriginalFunction = () => fnHandler; // for external
      $callee.destroyObject = function () {
        // in addition to GC
        mMapOfFuncs = null; // WeakMap does not require clear()
        fnHandler = null;
        this.__injector__ = null;
        this.getMap = null;
        this.getOriginalFunction = null;
        this.destroyObject = null;
      }
      // after all injected ${fnHandler} are called,
      // customElements.get('ytd-watch-flexy').prototype.${fnHandler}.__injector__.deref() will become undefined.
      const wrapped = typeof WeakRef === 'function' ? new WeakRef($callee) : $callee;
      $callee.__injector__ = wrapped; // for ${fnHandler}.__injector__
      return $callee;
    });

    const injectionPool = (ceProto, fnTag, actionFn) => { // delay prototype injection
      if (!(fnTag in ceProto)) return console.warn(`[ytI] no ${fnTag} is found in proto`);
      const fnHandler = ceProto[fnTag]; // make a copy in this nested closure.
      if (typeof fnHandler !== 'function') return console.warn(`[ytI] proto.${fnTag} is not a function`);
      let injector = null;
      if (injector = fnHandler.__injector__) {
        if (injector.deref) injector = injector.deref(); // null if ${fnTag} of all CEs are restored.
      }
      if (typeof fnHandler.__ytHandlerFuncName__ === 'string' && fnHandler.__ytHandlerFuncName__ !== fnTag) {
        return console.warn(`[ytI] Injection Function Tag Mismatched: ${fnHandler.__ytHandlerFuncName__} & ${fnTag}`);
      }
      if (!injector) {
        fnHandler.__ytHandlerFuncName__ = fnTag;
        injector = injectorCreationForRegistered(fnHandler);
        // injector.__ytHandlerFuncName__ = fnTag;
        fnHandler.__injector__ = injector.__injector__;
      } else if (typeof injector.__ytHandlerFuncName__ === 'string' && injector.__ytHandlerFuncName__ !== fnTag) {
        return console.warn(`[ytI] Injected Function Tag Mismatched: ${injector.__ytHandlerFuncName__} & ${fnTag}`);
      }
      if (typeof (injector || 0).getMap !== 'function') return console.warn('[ytI] the injector function is invalid.');
      const mapOfFuncs = injector.getMap();
      const ceConstructor = ceProto.constructor || null;
      if (!ceConstructor) return console.warn('[ytI] no constructor is found in proto');
      let funcs;
      if (!mapOfFuncs.has(ceConstructor)) {
        mapOfFuncs.set(ceConstructor, funcs = []);
        ceProto[fnTag] = injector;
      } else {
        funcs = mapOfFuncs.get(ceConstructor);
      }
      if (!funcs) return console.warn(`[ytI] ${fnTag} has already called. You can just override the properties.`);
      funcs.push(actionFn);
    }

    const postRegistered = (ytElmTag, f) => {
      const ceElmConstrcutor = customElements.get(ytElmTag);
      const proto = ((ceElmConstrcutor || 0).prototype || 0);
      if (proto && ('forwardMethods' in proto) && !('_registered' in proto)) {
        // under controller extraction, the register mechanism is different
        // register is not done in first initialization
        const createdElement = document.querySelector(ytElmTag);
        const inst = (createdElement || 0).inst;
        if (inst) {
          f(inst.constructor.prototype);
        } else {
          injectionPool(proto, 'forwardMethods', f);
        }
      } else if (proto && ('__hasRegisterFinished' in proto)) {
        f(proto);
      } else if (proto && ('_registered' in proto) && !('forwardMethods' in proto)) {
        injectionPool(proto, '_registered', f);
      } else {
        console.warn('[ytI] postRegistered is not supported.');
      }
    }

    const EVENT_KEY_ON_REGISTRY_READY = "ytI-ce-registry-created";

    const customYtElements = {
      whenRegistered(ytElmTag, immediateCallback) {
        return new Promise(resolve => {
          if (typeof customElements !== 'object' || typeof customElements.whenDefined !== 'function' || typeof customElements.get !== 'function') console.error('[ytI] customElements (native or polyfill) is not available.');
          const ceReady = () => { // ignore async result; the result in whenDefined is not the same as customElements.get
            postRegistered(ytElmTag, (proto) => {
              if (immediateCallback) immediateCallback(proto);
              resolve(proto);
            });
          }
          customElements.get(ytElmTag) ? ceReady() : customElements.whenDefined(ytElmTag).then(ceReady);
        });
      },
      onRegistryReady(callback) {
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
                  dispatchCustomEvent(this, EVENT_KEY_ON_REGISTRY_READY);
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
      }
    }

    // Export to external environment
    // try { window.customYtElements = customYtElements; } catch (error) { /* for Greasemonkey */ }
    // try { module.customYtElements = customYtElements; } catch (error) { /* for CommonJS */ }

    return customYtElements;

  })();

  // ========================

  let __debouncerResolve__ = null;
  let __targetVideoProgress__ = null;
  const { iframeToLiveChatWM, initDebouncer, createLatestProgressObject } = (() => {

    const iframeToLiveChatWM = new WeakMap();


    const initDebouncer = () => {

      let debouncer = document.querySelector('tabview-debouncer') || document.createElement('tabview-debouncer');
      debouncer.addEventListener('animationiteration', function () {
        __debouncerResolve__ && __debouncerResolve__();
        __debouncerResolve__ = null;
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
    return { iframeToLiveChatWM, initDebouncer, createLatestProgressObject }

  })();

  /* added in 2023.06.25 */
  async function fixLiveChatToggleButton() {


    const chatElm = document.querySelector('ytd-live-chat-frame');
    if (!chatElm) return;
    const chatCnt = chatElm.inst || chatElm;
    let initialDisplayState = null;
    try {
      initialDisplayState = chatCnt.data.liveChatRenderer.initialDisplayState
    } catch (e) { }
    if (typeof initialDisplayState !== 'string') return null;

    const btnElm = HTMLElement.prototype.querySelector.call(chatElm, 'ytd-toggle-button-renderer');
    const btnCnt = (btnElm || 0).inst || btnElm || 0;
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

  function fixSrc(src) {
    // cause of bug: unknown
    if (src && src.length > 253) {
      let m = /(^[^\s\%]+)continuation=([\w\-]{120,})(\%3D|\%253D)+\2(\%3D|\%253D)+(&[^\s\%]*|$)/.exec(src);
      if (m) {
        src = `${m[1]}continuation=${m[2]}&${m[5]}`;
      }
    }
    return src;
  }

  function ceHackExecution() {

    // handled by customYtElements
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





    customYtElements.whenRegistered('ytd-expander', (cProto) => {

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


    const s6 = Symbol();

    // assume initialTranscriptsRenderer is not called before ceHack()

    getRAFPromise().then(() => {
      if (translateHanlder === null)
        translateHanlder = getTranslate();
    });


    customYtElements.whenRegistered('ytd-transcript-search-panel-renderer', (cProto) => {
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


    customYtElements.whenRegistered('ytd-live-chat-frame', (cProto) => {
      let keyDefined = 'postToContentWindow' in cProto;
      // postToContentWindow is property defined during "_initializeProperties()"
      if (!keyDefined) console.warn('postToContentWindow is not defined in ytd-live-chat-frame.');
      if (typeof cProto.__$$postToContentWindow$$__ === 'function') console.warn('__$$postToContentWindow$$__ is already defined in ytd-live-chat-frame.');
      if (typeof cProto.postToContentWindow !== 'function' || cProto.postToContentWindow.length !== 1) console.warn('postToContentWindow cannot be altered');


      if (typeof cProto.__$$urlChanged$$__ === 'function') console.warn('__$$urlChanged$$__ is already defined in ytd-live-chat-frame.');
      if (typeof cProto.urlChanged !== 'function' || cProto.urlChanged.length !== 0) console.warn('urlChanged cannot be altered');


      cProto.__$$urlChanged$$__ = cProto.urlChanged;

      cProto.__urlChangedChangeCount = 0;

      cProto.urlChanged = function () {
        if (!this.player) return;
        this.__urlChangedChangeCount++;
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

          let chatApp = iframeToLiveChatWM.get(doc)
          if (!chatApp) {
            chatApp = doc.querySelector('yt-live-chat-app')
            if (chatApp) iframeToLiveChatWM.set(doc, chatApp);
          }
          if (!chatApp) return;

          if ('yt-player-video-progress' in o && Object.keys(o).length === 1) {
            __targetVideoProgress__ = o['yt-player-video-progress'];
            return this.__postToContentWindowK__.call(this, latestProgressObject);
          }

        }

        return this.__postToContentWindowK__.apply(this, arguments);
      }

      document.addEventListener('tabview-chat-fix-url-on-new-video-page', function (evt) {

        const chatElm = (evt || 0).target;
        if (!chatElm || chatElm.id !== 'chat') return;
        const chatCnt = chatElm.inst || chatElm;

        if (typeof chatCnt.fixChatframeContentDisplay !== 'function') return;
        if (!chatCnt.player) return;
        console.debug('[tyt.chat] fix chat render on changed video');
        chatCnt.fixChatframeContentDisplayWithUrlChanged(0);



      }, true);


      document.addEventListener('tabview-chat-fix-url-onload-with-empty-body', function (evt) {

        const chatElm = (evt || 0).target;
        if (!chatElm || chatElm.id !== 'chat') return;
        const chatCnt = chatElm.inst || chatElm;

        if (typeof chatCnt.fixChatframeContentDisplay !== 'function') return;
        if (!chatCnt.player) return;
        // console.debug('[tyt.chat] fix chat render when onload with empty body');
        // chat.fixChatframeContentDisplayWithUrlChanged(0);

      }, true);


      cProto.fixChatframeContentDisplay = async function (isChatExpansionChanged) {

        const iframe = this ? ((this.$ || this).chatframe || 0) : 0;

        if (!iframe || iframe.isConnected !== true) return;
        if (this.collapsed === true) return;

        let hostElement = this.hostElement || this;
        let cnt = this.inst || this;


        let isReplay = null;
        try {
          isReplay = cnt.data.liveChatRenderer.isReplay;
        } catch (e) { }

        // fix video data changed

        let dtConversationBar1
        let dtConversationBar2;

        try {

          dtConversationBar1 = window.ytInitialData.contents.twoColumnWatchNextResults.conversationBar;
          const ytdWatchFlexyElm = document.querySelector('ytd-watch-flexy');
          const ytdWatchFlexyCnt = ytdWatchFlexyElm.inst || ytdWatchFlexyElm;
          dtConversationBar2 = ytdWatchFlexyCnt.data.contents.twoColumnWatchNextResults.conversationBar;

        } catch (e) { }

        let forceUpdate = false;

        if (dtConversationBar1 && dtConversationBar2 && dtConversationBar1.liveChatRenderer && dtConversationBar2.liveChatRenderer) {

          let ct1;
          let ct2;
          let ct3;
          try {

            ct1 = dtConversationBar1.liveChatRenderer.continuations[0].reloadContinuationData.continuation;
            ct2 = dtConversationBar2.liveChatRenderer.continuations[0].reloadContinuationData.continuation;
            ct3 = cnt.data.liveChatRenderer.continuations[0].reloadContinuationData.continuation;
          } catch (e) { }
          if (typeof ct1 === 'string' && typeof ct2 === 'string' && typeof ct3 === 'string') {
            if (ct1 === ct2 && ct1 !== ct3) {
              const __data = cnt.__data || 0;
              if (isReplay === true && __data && __data.baseUrl === "/live_chat") __data.baseUrl = '/live_chat_replay';
              if (isReplay === true && __data && (__data.url || '').startsWith("/live_chat?")) __data.url = __data.url.replace('/live_chat?', '/live_chat_replay?');

              if (isReplay === false && __data && __data.baseUrl === "/live_chat_replay") __data.baseUrl = '/live_chat';
              if (isReplay === false && __data && (__data.url || '').startsWith("/live_chat_replay?")) __data.url = __data.url.replace('/live_chat_replay?', '/live_chat?');

              if (ct3.length > 120 && ct1.length > 120) {
                __data.url = __data.url.replace(ct3, ct1);
              }

              cnt.data = { liveChatRenderer: dtConversationBar2.liveChatRenderer };
              if (__data && __data.data) __data.data = cnt.data;
              try {
                cnt.notifyPath("data.liveChatRenderer");
              } catch (e) { }
              console.debug('[tyt.chat] data changed to ', dtConversationBar2.liveChatRenderer);
              forceUpdate = true;
            }
          }

        }


        let sf = '';
        try {
          sf = cnt.data.liveChatRenderer.continuations[0].reloadContinuationData.continuation
        } catch (e) {

        }

        if (!sf) return;

        let isc = getIframeSrc(iframe);

        if (typeof isc.src === 'string' && isc.src.includes('about:')) {

          const __data = cnt.__data || 0;
          if (__data) {

            let m = /(live_chat|live_chat_replay)\?continuation=([^&\/\=]+)(&[^&=?]+=[^&=?]+)*([&\/\=]\d+|)$/.exec(__data.url || '')
            if (m) {

              isc.src = __data.url;

              isc.pathname = m[1];
              isc.continuation = m[2];
              isc.spd = m[4];

            }

          }

        }

        let doReplacement = 0;

        if (forceUpdate) {

          doReplacement = 1;
        } else if (isc.continuation !== sf && isc.continuation) {
          doReplacement = 1;
        } else {
          let cDoc = null;
          try {
            cDoc = iframe.contentDocument;
          } catch (e) { }
          if (!cDoc) {
            doReplacement = 2;
          } else {

            if (cDoc.readyState === 'loading') {
              await new Promise(resolve => {

                cDoc.addEventListener('readystatechange', function () {

                  resolve && resolve();
                  resolve = null;

                }, false);

              });
              if (cDoc !== iframe.contentDocument) doReplacement = 3;
            }

            if (doReplacement === 0) {

              const contentElement = ((cDoc || 0).body || 0).firstElementChild || 0;


              if (!contentElement) {
                doReplacement = 4;
              }

            }


          }
        }

        let src = isc.src || '';

        if (!src) {
          src = (cnt.__data || 0).url || '';
          isc = _getIframeSrc(src);
        }
        if (!src || !src.includes('/live_chat')) doReplacement = 0;




        if (doReplacement > 0) {
          const src = isc.src;
          let baseSrc = src.replace(/([?&])continuation=[-\w.+$@%]+/, `$1continuation=${sf}`).replace(/\&\d+$/, '');
          if (isReplay && baseSrc.includes('/live_chat_replay?')) {
            let currentTime = 0;
            try {
              currentTime = Math.floor(cnt.player.getCurrentTime() * 1000);
            } catch (e) {
            }
            if (currentTime) {
              baseSrc = baseSrc.replace(/&playerOffsetMs=\d+/, '') + '&' + `playerOffsetMs=${currentTime}`;
            } else {
              baseSrc = baseSrc.replace(/&playerOffsetMs=\d+/, '')
            }
          }
          let nSrc = baseSrc + '&' + Date.now();
          if (isReplay === true && isc.pathname === 'live_chat') {
            // if the video in previous record was live but now it is playback (VOD).
            // then change the live_chat to live_chat_replay
            nSrc = nSrc.replace('/live_chat?', '/live_chat_replay?');
            console.debug('[tyt.chat] live_chat changed to live_chat_replay');
          } else if (isReplay === false && isc.pathname === 'live_chat_replay') {
            nSrc = nSrc.replace('/live_chat_replay?', '/live_chat?');
            console.debug('[tyt.chat] live_chat_replay changed to live_chat');
          }
          console.log({
            src,
            nSrc
          })
          iframeSrcReplacement(iframe, nSrc);
          cnt.url = nSrc.replace(/&playerOffsetMs=\d+/, '').replace(/&\d+$/, '')
          console.debug('[tyt] replaced chat url');
        }


      }

      cProto.fixChatframeContentDisplayWithUrlChanged = async function (isChatExpansionChanged) {

        try {
          this.isFrameReady = !this.isChatReplay();
        } catch (e) {
          console.warn(e)
        }
        await Promise.resolve().then(() => this.fixChatframeContentDisplay(isChatExpansionChanged)).catch(console.warn)

      }

    });



    let s32 = Symbol();
    let insObserverChipCloud = getInsObserverChipCloud();
    let mutObserverChipCloud = getMutObserverChipCloud();
    // yt-chip-cloud-renderer 


    customYtElements.whenRegistered('yt-chip-cloud-renderer', (proto) => {
      let keyDefined = 'boundChipCloudChipScrollIntoView' in proto;
      // boundChipCloudChipScrollIntoView is just value assignment after "_initializeProperties()"
      if (keyDefined) console.warn('boundChipCloudChipScrollIntoView is defined in yt-chip-cloud-renderer.');
      Object.defineProperty(proto, 'boundChipCloudChipScrollIntoView', {
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

    document.addEventListener('tyt-resize-chip-cloud', (evt) => {
      const target = ((evt || 0).target || 0);
      if (target.nodeType !== 1) return;
      const cnt = target.inst || target;
      // console.log(target)
      cnt.onResize && cnt.onResize();
    }, true)



    const getProto = (element) => {
      let proto = null;
      if (element) {
        if (element.inst) proto = element.inst.constructor.prototype;
        else proto = element.constructor.prototype;
      }
      return proto || null;
    };


    async function checkCommentCountCorrectness(data) {

      const cnt = this;
      const hostElement = this.hostElement || this;

      if (data.header && data.header.length === 1 && ((data.header[0] || 0).commentsHeaderRenderer || 0).countText) {
        const countText = data.header[0].commentsHeaderRenderer.countText;
        if (countText.runs && countText.runs.length === 2 && typeof countText.runs[0].text === 'string') {

          const countTextString = countText.runs[0].text;
          const ctString = countTextString.replace(/[,.\s]+/g, '');
          const ctNum = +ctString;
          if (ctNum >= 0 && countTextString.trim() === ctNum.toLocaleString(document.documentElement.lang)) {


            await new Promise(r => setTimeout(r, 80)); // wait comments count updated

            const n = data.contents.length;
            if (n > ctNum && hostElement.isConnected === true && cnt.isAttached === true) {

              const headerElm = querySelectorFromAnchor.call(hostElement, 'ytd-comments-header-renderer');
              const headerCnt = headerElm.inst || headerElm;

              if (headerCnt.data === data.header[0].commentsHeaderRenderer) {
                let runs = [{ text: data.contents.length.toLocaleString(document.documentElement.lang) }, countText.runs[1]];
                let m = Object.assign({}, data.header[0].commentsHeaderRenderer.countText, { runs: runs });
                headerCnt.data = Object.assign({}, headerCnt.data, { countText: m }); // update header text
                Promise.resolve().then(() => {
                  cnt.headerChanged_(); // ask to update tab count span
                })
              }

            }

          }



        }
      }
    }

    // dataChanged_ & headerChanged_ for comments counting update

    customYtElements.whenRegistered('ytd-comments', (cProto) => {
      let keyDefined = 'headerChanged_' in cProto;

      // dataChanged_ are headerChanged_ are properties defined during "_initializeProperties()"
      if (!keyDefined) console.warn('headerChanged_ is not defined in ytd-comments.');

      // dataChanged_ for cache update & clear cached count
      // const ytdCommentsP = customElements.get('ytd-comments').prototype;
      if (typeof cProto.dataChanged_ == 'function' && !('tytDataChanged_' in cProto)) {
        cProto.tytDataChanged_ = cProto.dataChanged_;
        cProto.dataChanged_ = function () {
          const cnt = this;
          const hostElement = this.hostElement || this;
          cnt.tytDataChanged_();
          const data = ((cnt.__data || 0).data || 0);
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

            checkCommentCountCorrectness.call(this, data)

          }
          dispatchCustomEvent(hostElement, 'ytd-comments-data-changed', { hasData });
        }
      }

      // headerChanged_ - new method to fetch comments count
      if (typeof cProto.headerChanged_ == 'function' && !('tytHeaderChanged_' in cProto)) {
        cProto.tytHeaderChanged_ = cProto.headerChanged_;
        cProto.headerChanged_ = function () {
          const cnt = this;
          const hostElement = this.hostElement || this;
          const data = ((cnt.__data || 0).data || 0);
          if (data) {

            checkCommentCountCorrectness.call(this, data);
            // console.log(311, data.contents.length, data.header)

          }

          cnt.tytHeaderChanged_();
          dispatchCustomEvent(hostElement, 'ytd-comments-header-changed');

        }
      }

    });

    document.addEventListener('tabview-fix-popup-refit', function () {
      // this = document

      const cProto = getProto(document.createElement('tp-yt-iron-dropdown'));
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
        const alignHost = (this.inst && (typeof this.inst.horizontalAlign || typeof this.inst.verticalAlign)) ? this.inst : this;
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

    }, false);




    /* added in 2023.06.09 */
    /* modified in 2023.08.26 */
    const regRFn = (cProto, keyA, keyB) => {

      if (cProto[keyB] || !cProto[keyA]) return;

      cProto[keyB] = cProto[keyA];

      let renderStore = new WeakMap();

      cProto[keyA] = function () {

        const cnt = this;
        const hostElement = this.hostElement || this;

        if (renderStore.get(hostElement) >= 1) return;
        renderStore.set(hostElement, 1);
        getForegroundPromise().then(() => {

          renderStore.set(hostElement, 0);

          if (cnt.hidden !== true && cnt.isAttached === true && hostElement.isConnected === true) {

            cnt[keyB]();
          }

        });

      };



    }


    /* added in 2023.06.09 */
    customYtElements.whenRegistered('yt-attributed-string', (cProto) => {
      // since DFa cannot be hacked

      regRFn(cProto, 'templatingFn', '__templatingFn__');
      regRFn(cProto, 'doIdomRender', '__doIdomRender__');

    });


    /* added in 2023.06.09 */
    customYtElements.whenRegistered('yt-button-shape', (cProto) => {
      // since DFa cannot be hacked

      regRFn(cProto, 'templatingFn', '__templatingFn__');
      regRFn(cProto, 'doIdomRender', '__doIdomRender__');

    });


    customYtElements.whenRegistered('ytd-player', (cProto) => {

      let keyDefined = 'pause' in cProto;
      if (!keyDefined) return console.warn('pause is not defined in ytd-player.');

      const pause = cProto.pause;

      cProto.pause = function () {
        if (arguments.length !== 0) return pause.apply(this, arguments); // fallback
        if (byPassPause) return;
        pause.call(this);
      };

    })

    customYtElements.whenRegistered('ytd-comment-renderer', (cProto) => {


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

  }

  function ceHack(evt) {

    if (_ceHack_calledOnce) return;
    _ceHack_calledOnce = true;

    customYtElements.onRegistryReady(ceHackExecution);

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
    let epc = querySelectorFromAnchor.call(ep, '#content');
    if (!epc) return null;

    return querySelectorFromAnchor.call(epc, 'ytd-ads-engagement-panel-content-renderer #content')
      || querySelectorFromAnchor.call(epc, 'ytd-ads-engagement-panel-content-renderer')
      || epc;

  }

  function createPanel() {

    const ytdFlexyElm = document.querySelector('ytd-watch-flexy[tyt-tab]');
    if (!ytdFlexyElm) return null;
    const ytdFlexyCnt = ytdFlexyElm.inst || ytdFlexyElm;

    /** @type {HTMLElement} */
    const newPanel = ytdFlexyCnt.createComponent_({
      "component": "ytd-engagement-panel-section-list-renderer",
      "params": {
        "isWatch": true
      }
    }, "ytd-engagement-panel-section-list-renderer", true);
    
    const newPanelHostElement = (newPanel || 0).hostElement || newPanel;
    const newPanelCnt = (newPanelHostElement || 0).inst || newPanelHostElement;


    newPanelCnt.data = {
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
    };

    newPanelHostElement.classList.add('style-scope', 'ytd-watch-flexy');

    elementAppend.call(querySelectorFromAnchor.call(ytdFlexyElm, '#panels'), newPanelHostElement);

    return newPanelHostElement;

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
          await Promise.resolve(0)
          setTimeout(() => {
              dispatchCustomEvent(document, 'genius-lyrics-actor', { action: 'reloadCurrentLyrics' });
          }, 40)
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

  document.addEventListener('getLyricsReady', function getLyricsReady() {

    const panel_cssSelector = 'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]'

    if (!document.querySelector(panel_cssSelector) && document.querySelector('ytd-watch-flexy #panels')) {
      let newPanel = createPanel();

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
          epc.innerHTML = '';
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

  }, false)


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
        dispatchCustomEvent(document, 'getLyricsReady');
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

  window.addEventListener('message', (evt) => {
    let data = ((evt || 0).data || 0);


    if (data.iAm === 'Youtube Genius Lyrics') {

      switch (data.type) {
        case 'pageready':
          showLyricsWhenReady(data);
        case 'lyricsDisplayState':
          onLyricsDisplayStateChanged(data);

      }

    }

  })

  if (document.documentElement.hasAttribute('tabview-loaded'))
    ceHack();
  else
    document.addEventListener('tabview-ce-hack', ceHack, true);




  document.addEventListener('yt-expander-less-tapped', function (evt) {

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

  document.addEventListener('tabview-fix-autocomplete', function (evt) {

    DEBUG_e32 && console.log(9442, evt.type);
    // https://cdnjs.cloudflare.com/ajax/libs/JavaScript-autoComplete/1.0.4/auto-complete.min.js

    let s = evt.target;
    if (!s.matches('[autocomplete="off"]:not([data-autocomplete-results-id])')) return;

    let sc = s.sc; //#autocomplete-suggestions 
    if (sc instanceof HTMLElement) {

      let id = Date.now();
      s.setAttribute('data-autocomplete-results-id', id);
      sc.setAttribute('data-autocomplete-input-id', id);

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

      dispatchCustomEvent(s, 'autocomplete-sc-exist');

    }

    sc = null;


  }, true);


  // initial paging -> yt-page-data-fetched
  // page changing ->  yt-page-type-changed + yt-page-data-fetched
  document.addEventListener('yt-page-type-changed', (evt) => {
    DEBUG_e32 && console.log(9442, evt.type);
    window.postMessage({
      tabview: {
        eventType: evt.type,
        eventDetail: evt.detail // in order to get the object detail
      }
    }, location.origin);
  }, false);


  function tabviewInfoTogglerOnClick(evt) {
    let isTrusted = evt.isTrusted === true;
    let dom = evt.target;
    let description = closestFromAnchor.call(dom, '#description')
    if (!description) return;
    let button = description.querySelector('#collapse[role="button"]:not([hidden]), #expand[role="button"]:not([hidden])');
    if (!button) return;
    setTimeout(() => { //setTimeout / raf required - js event issue
      button.click();
      if (isTrusted && document.fullscreenElement !== null) description.scrollIntoView(true);
      description = null;
      dom = null;
      button = null;
    }, 30);
    evt.preventDefault();
  }


  document.addEventListener('tyt-info-toggler', (evt) => {
    const node = (evt || 0).target;
    node.addEventListener('click', tabviewInfoTogglerOnClick, false)
  }, true);

  document.addEventListener('tabview-resize-comments-rows', (evt) => {
    // this = document
    //slightly delayed
    //console.log('tabview-resize-comments-rows')
    for (const ytdExpanderElm of document.querySelectorAll('#tab-comments #comments .tyt-visible-comment ytd-expander')) {
      Promise.resolve(ytdExpanderElm).then(() => {
        const ytdExpanderCnt = ytdExpanderElm.inst || ytdExpanderElm;
        ytdExpanderCnt.calculateCanCollapse(true);
      });
    }

  }, false);

  document.addEventListener('tabview-fix-info-box-tooltip', (evt) => {
    const ytdFlexy = document.querySelector('ytd-watch-flexy');
    if (!ytdFlexy) return;

    let isDuplicated = ytdFlexy.classList.contains('tabview-info-duplicated');
    if (!isDuplicated) return;

    let tooltip = document.querySelector('#bottom-row.style-scope.ytd-watch-metadata tp-yt-paper-tooltip.style-scope[role="tooltip"]');
    if (!tooltip) return;

    const tooltipHost = tooltip.inst && ('position' in tooltip.inst) ? tooltip.inst : tooltip;

    tooltipHost.position = 'top';
    tooltip.classList.add('tyt-force-left-0');
  }, false);


  // ----------------------------- ytLive / Popup / Begin -----------------------------

  // chatroomRendererElmWR
  // popupBtnId
  // mtoIframePopup

  document.addEventListener('tyt-close-popup', (evt) => {
    let cr = kRef(chatroomRendererElmWR);

    if (cr) {

      try {
        cr.closePopoutWindow();
      } catch (e) { }

    }

  }, false);

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
      const participantsElm = HTMLElement.prototype.querySelector.call(lcrElm, 'iron-pages > yt-live-chat-participant-list-renderer.yt-live-chat-renderer');
      if (!participantsElm) return;
      const participantInst = (participantsElm.inst || participantsElm);
      const participantsCnt = participantInst.constructor.prototype;
      setupParticipantsCnt(participantsCnt);
      participantInst.canShow322 = !participantsElm.matches('iron-pages > :not(slot):not(.iron-selected)')
      participantInst.onParticipantsChangedBusy322 = false; // force change
      participantInst.participantsChangeIfPending && participantInst.participantsChangeIfPending();
    }

    function setupMTO(btnElm) {
      // when btn clicked

      let btn = mWeakRef(btnElm);

      let lcrElm = kRef(chatroomRendererElmWR);
      if (!lcrElm) return;
      const lcrCnt = lcrElm.inst || lcrElm;
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
                const lcrPopupWindow = lcrElm ? (lcrElm.inst || lcrElm).popoutWindow || lcrElm.popoutWindow : null;
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
              const lcrPopupWindow = lcrElm ? (lcrElm.inst || lcrElm).popoutWindow || lcrElm.popoutWindow : null;
              popupClose.mPopupWindow = mWeakRef(lcrPopupWindow);
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

      const lcrCnt = lcrElm.inst || lcrElm;

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
      const lcrCnt = lcrElm.inst || lcrElm;


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


      const lcrCnt = lcrElm.inst || lcrElm || 0;

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


  document.addEventListener('tabview-page-rendered', () => {
    // reserved
  });




  function addPopupButton(chatElm) {
    try {


      let showHideBtn = HTMLElement.prototype.querySelector.call(chatElm, 'div#show-hide-button')
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


      let showHideBtn = HTMLElement.prototype.querySelector.call(chatElm, 'div#show-hide-button')
      if (showHideBtn) {

        let btn;
        btn = document.querySelector('tyt-iframe-popup-btn')
        if (btn) btn.remove();

      }

    } catch (e) {
      console.warn(e);
    }
  }


  document.addEventListener('tabview-chatroom-ready', async function (evt) {

    const chatElm = (evt || 0).target;
    if (!chatElm) return;

    console.debug('[tyt.iframe] ready 01')

    const currentPopupBtn = HTMLElement.prototype.querySelector.call(chatElm, 'tyt-iframe-popup-btn');
    if (currentPopupBtn) currentPopupBtn.classList.remove('tyt-btn-enabled');

    const chatCnt = chatElm.inst || chatElm;

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


    const liveChatRendererElm = cDoc.querySelector('yt-live-chat-renderer') || (await new Promise(resolve => {

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

    console.debug(`[tyt.iframe] ready 02, lcr = ${liveChatRendererElm ? 'Y' : 'N'}`)

    if (liveChatRendererElm) {
      addPopupButton(chatElm);
      ytLivePU.initByChatRenderer(liveChatRendererElm);

      const liveChatRendererCnt = liveChatRendererElm.inst || liveChatRendererElm;

      const isReplay = (liveChatRendererCnt.data || 0).isReplay;
      if (isReplay === true && typeof chatCnt.playerProgressHandler === 'function') {
        const player = chatCnt.player || 0;
        const playerState = typeof player.getPlayerState === 'function' ? player.getPlayerState() : null;
        if (playerState === 2 || playerState === -1) {
          chatCnt.playerProgressHandler();
        }
      }

    } else {
      removePopupButton(chatElm);
    }


  }, true)


  let miniview_enabled = false

  function isVideoPlaying(video) {
    return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
  }


  async function loadStartFxAsync(video) {

    let video1 = document.querySelector('#movie_player video[src]');
    let videos2 = document.querySelectorAll('ytd-browse[role="main"] video[src]');

    if (video1 !== null && videos2.length > 0) {
      if (video !== video1 && video1.paused === false) {
        if (isVideoPlaying(video1)) {
          Promise.resolve(video).then(video => video.paused === false && video.pause());
        }
      } else if (video1 === video) {

        for (const s of videos2) {
          if (s.paused === false) {
            Promise.resolve(s).then(s => s.paused === false && s.pause())
            break;
          }
        }
      } else {
        Promise.resolve(video1).then(video1 => video1.paused === false && video1.pause());
      }
    }

  }


  let loadStartFx = (evt) => {

    let video = (evt || 0).target;
    if (((video || 0).nodeName || 0) === 'VIDEO') { }
    else return;

    loadStartFxAsync(video);

  }

  globalFunc(function tabviewSwitchVideoPage(video_id) {

    if (typeof video_id !== 'string') return;

    const ytAppElm = document.querySelector('ytd-app');
    const ytAppCnt = (ytAppElm || 0).inst || ytAppElm || 0;

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

          let header = querySelectorFromAnchor.call(commentRendererElm, '#header-author');
          if (header) {

            let anchor = querySelectorFromAnchor.call(header, 'a[href*="lc="]');
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
    const ytNodeData = (ytNode.inst || ytNode).data;
    if (!ytNodeData || typeof ytNodeData !== 'object') return;
    while ((pNode = nodeParent(pNode)) instanceof HTMLElement) {
      const contents = ((pNode.inst || pNode).data || 0).contents; // data
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


      if (typeof (r1.inst || r1).data.linkedCommentBadge === 'object' && typeof (r2.inst || r2).data.linkedCommentBadge === 'undefined') {

        let p = Object.assign({}, (r1.inst || r1).data.linkedCommentBadge)

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
            const v2pCnt = v2.parent.inst || v2.parent || 0;
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
      let r1cnt = r1.inst || r1;
      let r2 = findLcComment(targetLcId).commentRendererElm;
      let r2cnt = r2.inst || r2;

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
            const playerVideo = document.querySelector('ytd-player#ytd-player video[src]');
            if (playerVideo && playerVideo.paused === false) valid = true; // home page
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
          let currentVideo = document.querySelector('#movie_player video[src]')
          if (currentVideo && currentVideo.readyState > currentVideo.HAVE_CURRENT_DATA && currentVideo.currentTime > 2.2 && currentVideo.duration - 2.2 < currentVideo.currentTime) {
            // disable miniview browsing if the media is near to the end
            endpoint = null
          }
        }
      }

      if (endpoint) {

        if (pageType === null) {
          const ytdAppElm = document.querySelector('ytd-page-manager#page-manager.style-scope.ytd-app');
          const ytdAppCnt = (ytdAppElm || 0).inst || ytdAppElm || 0;
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
      const ytdAppCnt = (ytdAppElm || 0).inst || ytdAppElm || 0;

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

  document.addEventListener("tabview-miniview-browser-enable", () => {

    if (miniview_enabled) return;

    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    if (!isPassiveArgSupport) return;

    // console.log("tabview-miniview-browser-enable");

    miniview_enabled = true;

    const ytdAppElm = document.querySelector('ytd-app');
    const ytdAppCnt = ytdAppElm.inst || ytdAppElm;


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
      let ytdFlexyElm = document.querySelector('ytd-watch-flexy')
      // let updateIcon = false
      if (ytdFlexyElm) {
        const shelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy')
        const shelfCnt = shelfElm.inst || shelfElm;

        let currentVisibile = shelfElm && shelfCnt && shelfCnt.isAttached === true && !shelfElm.classList.contains('tyt-hidden') && !shelfElm.hasAttribute('hidden')
        let tytAttr = ytdFlexyElm.hasAttribute('tyt-donation-shelf')
        if (currentVisibile) {
          if (shelfCnt.isCollapsed === true) shelfCnt.isCollapsed = false // for shelf content
        }
        if ((currentVisibile === true) ^ (tytAttr === true)) {
          if (currentVisibile) ytdFlexyElm.setAttribute('tyt-donation-shelf', '');
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
      const brCnt = (brElm || 0).inst || brElm || 0;
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
      const brHost = (brElm.inst && ('overrides' in brElm.inst)) ? brElm.inst : brElm;
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
      brCnt.notifyPath('data.style');
      if (!brHost.overrides || brHost.overrides.style) brHost.overrides = {};
    },
    onButtonAppended(brElm) {
      if (!brElm) return;
      const brHost = (brElm.inst && ('overrides' in brElm.inst)) ? brElm.inst : brElm;
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
    createToggleBtn(evt) {
      let donationShelfElm = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (!donationShelfElm) return;

      const donationShelfCnt = donationShelfElm.inst || donationShelfElm;

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
      const mastheadElm = document.querySelector('ytd-masthead#masthead');
      if (!mastheadElm) return;
      const mastheadCnt = mastheadElm.inst || mastheadElm;

      const mastheadData = mastheadCnt.data
      if (!mastheadData) return;

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
          const brCnt = brElm.inst || brElm;
          const brHost = (brElm.inst && ('overrides' in brElm.inst)) ? brElm.inst : brElm;
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
      if (donationShelfElm && (donationShelfElm.inst || donationShelfElm).isAttached === true) return;


      // console.log(4455)
      // if(!document.querySelector('#tyt-donation-shelf-toggle-btn')) return;

      /** @type {object[]} */
      const mastheadElm = document.querySelector('ytd-masthead#masthead');
      if (!mastheadElm) return;
      const mastheadCnt = mastheadElm.inst || mastheadElm;

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
      const donationShelfCnt = donationShelfElm.inst || donationShelfElm;

      if ((donationShelfCnt.detacheds || 0).swVq2 !== 1) {
        return;
      }


      /** @type {object[]} */
      const mastheadElm = document.querySelector('ytd-masthead#masthead');
      if (!mastheadElm) return;
      const mastheadCnt = mastheadElm.inst || mastheadElm;

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
        const brCnt = brElm.inst || brElm;
        const brHost = (brElm.inst && ('overrides' in brElm.inst)) ? brElm.inst : brElm;
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
      const cnt = target.inst || target;
      dsMgr._lastDSVideo = (((cnt || 0).data || 0).videoId || 0); // avoid double calling triggerDOMAppearWhenDataChanged
      HTMLElement.prototype.setAttribute.call(target, 'swVq2', '1')
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
  document.addEventListener('tabview-donation-shelf-set-visibility', dsMgr.setVisibility, false);

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
    s.setAttribute('tyt-placed-to-top', '');

    s.removeAttribute('fit-to-visible-bounds'); // related to the button position only; ignore page layout
    s.setAttribute('offset', '0'); // offset is for bottom tooltip only
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

    s.setAttribute('fit-to-visible-bounds', ''); // fix native tooltip bug due to YouTube Layout change since 2023.05.18

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

  document.addEventListener('tabview-zoom-updated', () => {
    for (const s of document.querySelectorAll('.tyt-visible-comment ytd-expander')) s.calculateCanCollapse(true);
  }, false);

  document.addEventListener('tabview-yt-data-reassign', (evt) => {
    // Example target: playlist
    const target = (evt || 0).target || 0;
    if (!target.is) return;
    const cnt = target.inst || target;
    let data = cnt.data;
    if (data) {
      cnt.data = Object.assign({}, data); // the playlist appended to tab container might lose its reorder control. 
    }
  }, true);

  document.addEventListener("tabview-fix-live-chat-toggle-btn", () => {
    fixLiveChatToggleButton();
  })

  document.addEventListener('tabview-force-chat-render-on-chat-expanded', (evt) => {

    const chatElm = (evt || 0).target;
    if (!chatElm || chatElm.id !== 'chat') return;
    const chatCnt = chatElm.inst || chatElm;

    if (typeof chatCnt.fixChatframeContentDisplay !== 'function') return;
    if (!chatCnt.player) return;
    console.debug('[tyt.chat] fix chat render on expanded chat');
    chatCnt.fixChatframeContentDisplayWithUrlChanged(1);

  }, true);

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
      const entryTime = evt.timeStamp;

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
            "entryTime": 1
          };
          xReplaceState(s, u);
          console.debug('[tyt] FIX_UNCERTAIN_HISTORY_STATE for NULL or VideoChanged state')

        }
      });



    };


  }


  document.addEventListener("tabview-plugin-loaded", () => {
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

  document.documentElement.setAttribute('tabview-unwrapjs', '1')
  if (document.documentElement.hasAttribute('plugin-tabview-youtube')) {
    dispatchCustomEvent(document, "tabview-plugin-loaded");
  }


  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();