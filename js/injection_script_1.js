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

  const $requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const $cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  // /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  // /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);

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

  const xReplaceState=(s, u)=>{
    history.replaceState(s, '', u);
    if(s.endpoint){
      try {
        document.querySelector('ytd-app').replaceState(s.endpoint, '', u)
      }catch(e){
      }
    }
  }


  const DEBUG_e32 = false;
  // const DO_REQ_CHANGE_FOR_NEXT_VIDEO = false;
  const FIX_UNCERTAIN_HISTORY_STATE = true;

  let _ceHack_calledOnce = false;
  let isLoadStartListened = false;


  DEBUG_e32 && console.log(9442, 103);

  let chatroomRenderer = null

  document.addEventListener("tabview-expander-config", (evt) => {

    if (!evt || !evt.target) return;
    let dom = evt.target;

    /*
    nativeCall(expander, [
      { 'property': 'canToggleJobId', 'value': 1 }, // false disable calculateCanCollapse in childrenChanged
      { 'property': 'alwaysToggleable', 'value': false }, // this is checked in childrenChanged
      { 'property': 'recomputeOnResize', 'value': false }, // no need to check toggleable
      { 'property': 'isToggled', 'value': true }, // show full content
      { 'property': 'canToggle', 'value': false }, // hide show more or less btn
      { 'property': 'collapsedHeight', 'value': 999999 } // disable collapsed height check
    ])
    */

    dom.canToggleJobId = 1;
    dom.alwaysToggleable = false;
    dom.recomputeOnResize = false;
    dom.isToggled = true;
    dom.canToggle = false;
    dom.collapsedHeight = 999999;

  }, true);


  /*
  document.addEventListener('userscript-call-dom', function (evt) {

    DEBUG_e32 && console.log(9442, evt.type);

    if (!evt || !evt.target || !evt.detail) return;
    let dom = evt.target;

    let detail = evt.detail;
    //console.log(detail)
    if (!detail || !detail.length) return;

    for (const obj of detail) {

      const { method, property, args, value } = obj
      if (method && typeof method == 'string') {
        const f = dom[method];
        if (!f) console.log('This method is not supported');
        else if (args && args.length >= 1) {
          try {
            f.apply(dom, args)

          } catch (e) {
            console.log(`Dom Method Failed: ${method}`)
          }
        } else {
          try {
            f.call(dom)

          } catch (e) {
            console.log(`Dom Method Failed: ${method}`)
          }
        }
      } else if (property && typeof property == 'string') {
        if (!(property in dom)) console.log('This propert is not supported')
        else if (value === undefined) console.log('undefined value is not supported')
        else {

          try {
            dom[property] = value;

          } catch (e) {
            console.log(`Dom Property Failed: ${property}`)
          }
        }
      }

    }

  }, true)
  */


  // document.addEventListener('userscript-call-dom-func', function (evt) {

  //   DEBUG_e32 && console.log(9442, evt.type);

  //   if (!evt || !evt.target || !evt.detail) return;
  //   let dom = evt.target;

  //   let { property, args } = evt.detail;
  //   if (!property) return;
  //   let f = dom[property];
  //   if (typeof f != 'function') return;

  //   if (args && args.length > 0) f.apply(dom, args);
  //   else f.call(dom);

  // }, true)

  /*
  document.addEventListener('userscript-call-dom-func-stacked', function (evt) {

    if (!evt || !evt.target || !evt.detail) return;
    let document = evt.target;

    let { selector, property, args } = evt.detail;
    if (!selector || !property) return;
    let elements = document.querySelectorAll(selector);
    for (const element of elements) {
      let f = element[property];
      if (typeof f != 'function') return;
      if (args && args.length > 0) f.apply(element, args);
      else f.call(element);
    }

  }, false)
  */





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






  const pm1 = (progress) => (progress > 1e-9 ? progress - 1e-99 : Math.max(progress || 0, 0));

  class YTLiveProcessUnit {

    constructor() {
      /** @type {HTMLElement | null} */
      this.elmChat = null
      /** @type {HTMLIFrameElement | null} */
      this.elmChatFrame = null
      this.isChatReplay = null
      this.loadStatus = 0
      this.renderedVideoProgress = null
      this.requestedVideoProgress = null
      this.clearVars(0);

      this.postI = 0
      this.isChatMessageCanDisplay = false
      this.cnpCID = 0
      this.handlerPageDataFetched = null

      this.ytLiveMO = null
      this.adsState = 0

      this.keepOriginalPTCW = false;
      this.ytInitialChecked = false;

    }

    clearVars(t) {

      /** @type {HTMLElement | null} */
      this.ytInitialChecked = false;
      this.keepOriginalPTCW = false; // reset
      this.ytLiveChatApp = null
      /** @type {HTMLElement | null} */
      this.ytLiveChatRenderer = null

      this.initialFetchReq = 0

      this.renderBusyS = 0;
      this.renderBusyR = 0;
      this.renderStarted = 0;

      if (t === 0) {

        this.seekWaiterResolves = []
        this.reloadWaiterResolves = []
        this.loadingWaiterResolves = []
      } else {

        this.seekWaiterResolves.length = 0
        this.reloadWaiterResolves.length = 0
        this.loadingWaiterResolves.length = 0
      }


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

    /** @param {HTMLElement | null} chat */
    initByChat(chat) {
      // this is triggered when collapsed / expanded / initial state
      // console.log('initByChat')

      if (this.elmChat && this.elmChat !== chat && (this.loadStatus & 2) === 0 && (this.loadStatus & 4) === 0) {
        this.elmChat.classList.remove('tyt-chat-frame-ready');
        // this.elmChat.removeAttribute('tyt-iframe-loaded')
      }
      if (chat === null) {
        if (this.elmChat && this.elmChat.disconnectedCallback && this.elmChat.isAttached === true) {
          this.elmChat.disconnectedCallback();
          // console.log('aa', this.elmChat.isAttached)
        }
        this.elmChat = null;
        this.elmChatFrame = null;
        if (this.loadStatus & 1) this.loadStatus -= 1;
        if (this.loadStatus & 2) this.loadStatus -= 2;

        if (this.loadStatus & 16) this.loadStatus -= 16
        if (this.loadStatus & 32) this.loadStatus -= 32

        this.renderedVideoProgress = null;


        this.clearVars();
        if (this.loadStatus & 4) this.loadStatus -= 4;

      } else {

        // console.log(2242)
        // console.log('initByChat')
        if ((chat || 0).id !== 'chat') return;
        // if(this.initialFetchReq === 21) return;

        // console.log(this.initialFetchReq)


        this.elmChat = chat;
        if (this.elmChat && this.elmChat.connectedCallback && this.elmChat.isAttached === false) {
          // by experience, this triggers in live playback only; livestream might implemented the correct mechanism to handle this.
          this.elmChat.connectedCallback();
          this.initialFetchReq = 21;
        }

        this.loadStatus |= 1 // 00000001
        if (this.loadStatus & 16) this.loadStatus -= 16
        if (this.loadStatus & 32) this.loadStatus -= 32
        if (chat.collapsed === true) {
          this.renderedVideoProgress = null
          this.clearVars();
          if (this.loadStatus & 4) this.loadStatus -= 4
        } else if (this.initialFetchReq === 0) {
          this.initialFetchReq = 1
          // console.log(this.renderedVideoProgress, this.ytLiveChatRenderer ,this.ytLiveChatApp, this.loadStatus.toString(2) )
        } else if (this.initialFetchReq === 21) {
          // url changed
          // this fire mutiple times until initByChatRenderer reset it.
          this.chatUrlChanged();
        }

        // chat.classList.remove('tyt-chat-frame-ready')
        // chat.removeAttribute('tyt-iframe-loaded')
        this.init();
      }
    }



    setAdPlaying(b) {
      if (typeof b !== 'boolean') return;
      if (b === true) {
        this.adsState |= 2; // played once [2]
        if (this.adsState & 1) this.adsState -= 1; // reset pause [1]
        // 2|0 = 2
        if (this.ytLiveChatRenderer) {
          this.ytLiveChatRenderer._setIsAdPlaying(true);
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

    initByChatRenderer(cr) {
      // this is triggered when liveChatApp + Renderer ready

      // console.log('initByChatRenderer')
      if (!cr) return;
      this.ytInitialChecked = false;
      this.keepOriginalPTCW = false; // reset
      this.ytLiveChatApp = closestFromAnchor.call(cr, 'yt-live-chat-app')
      if (!this.ytLiveChatApp) return;



      if (this.initialFetchReq >= 3) {
        // including  this.initialFetchReq === 21
        this.initialFetchReq = 0;
        this.initByChat(this.elmChat);
      }

      if ((this.loadStatus & 1) === 0) {
        this.ytLiveMOHandler();
      }

      this.ytLiveChatRenderer = cr // for both playback replay and livestream
      chatroomRenderer = mWeakRef(cr) // avoid memory leak for live popup
      let ytdFlexyElm = document.querySelector('ytd-watch-flexy')
      if (ytdFlexyElm) {
        let playerData = ytdFlexyElm.player || 0
        if (typeof playerData.getPresentingPlayerType === 'function') {
          let playerType = playerData.getPresentingPlayerType()
          // 2 for ads
          // 1 for normal
          this.setAdPlaying(playerType === 2);
        }
      }
      // console.log(771, this.adsState, this.ytLiveChatRenderer.isAdPlaying)
      // playback replay: loading correct comments at specific time
      // livestream: control popup

      this.setUpPlayerSeekCont();
      this.isChatReplay = this.isReplay()
      this.setupChatRenderer()
      this.loadStatus |= 4 // 00000100
      this.init();
    }

    // async ytLiveMOHandler() {
    ytLiveMOHandler() {
      // `this` is not available

      /*
      ytLivePU.ytLiveMOHandlerI++;
      if (ytLivePU.ytLiveMOHandlerI > 1e9) ytLivePU.ytLiveMOHandlerI = 9;

      let ti = ytLivePU.ytLiveMOHandlerI;
      // avoid loading in background and multiple calling
      await new Promise(window.requestAnimationFrame)
      if (ti !== ytLivePU.ytLiveMOHandlerI) return;

      */

      let chat = null

      let ytdFlexyElm = document.querySelector('ytd-watch-flexy');
      if (!ytdFlexyElm) {
        console.warn('error F032')
      }
      let attr = ytdFlexyElm ? ytdFlexyElm.getAttribute('tyt-chat') : null

      if (attr) {
        chat = document.querySelector('ytd-live-chat-frame#chat');
      }
      // note: there is multiple triggering of this (with same final attr value);
      //       not sure whether the bug of tabview layout itself or the element is truly removed and reinserted.
      // the same attr would happen twice
      ytLivePU.initByChat(chat)
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
        console.warn('error F031')
      }
    }

    createCMWaiter() {
      // render (seek/reload) start/sucess/fail when yt-action is triggered
      const ytLivePU = this
      return new Promise(resolve => {
        if (ytLivePU.renderBusyS === 1 && ytLivePU.renderBusyR === 0) {
          this.seekWaiterResolves.push(resolve)
        } else if (ytLivePU.renderBusyR === 1 && ytLivePU.renderBusyS === 0) {
          this.reloadWaiterResolves.push(resolve)
        } else {
          if (ytLivePU.renderBusyR + ytLivePU.renderBusyS !== 0) {
            console.log(ytLivePU.renderBusyR, ytLivePU.renderBusyS)
          }
          resolve()
        }
      })
    }

    createLoadingWaiter() {
      // loading finished when yt-action is triggered
      const ytLivePU = this
      return new Promise(resolve => {
        if (ytLivePU.ytLiveChatRenderer.hasAttribute('loading')) {
          this.loadingWaiterResolves.push(resolve)
        } else {
          resolve()
        }
      })
    }

    async chatUrlChanged() {
      // this function is usually enforced when the chat is expand in livestream and click history back button to video with live chat playback.
      // first call not effect; only take effect in second call.
      await Promise.resolve(0)
      let chat = this.elmChat
      if (chat && this.initialFetchReq === 21 && chat.collapsed === false) {
        let cr = this.ytLiveChatRenderer
        if (cr) {
          this.initialFetchReq = 1
          this.initByChatRenderer(cr);
          return false
        } else {
          // this.initialFetchReq = 1

          chat.urlChanged(); // neccessary
          return true
        }
      }
      this.initialFetchReq = 0
      return null
    }

    setUpPlayerSeekCont(shadow) {

      const ytLivePU = this

      // player seek cont will be replaced frenquently when list content is updated
      // re-hook by each yt-action if replaced

      let playerSeekCont = this.queryCR("yt-player-seek-continuation")

      if (!playerSeekCont) return;

      if (playerSeekCont.uxTqc) return;
      playerSeekCont.uxTqc = 1;
      // console.log(333)

      let fixer = shadow ? null : (f, ek) => {
        return function () {
          if (this.previousProgressSec === 0) this.previousProgressSec = 1e-99
          // console.log( 'cxxs', arguments)
          //if (ek) console.log(arguments)
          let t = f.apply(this, arguments)
          if (this.previousProgressSec === 0) this.previousProgressSec = 1e-99
          return t
        }
      }

      playerSeekCont.maybeFireSeekContinuation = shadow ? shadow.maybeFireSeekContinuation : fixer(playerSeekCont.maybeFireSeekContinuation, 1)
      playerSeekCont.playerProgressSecChanged_ = shadow ? shadow.playerProgressSecChanged_ : fixer(playerSeekCont.playerProgressSecChanged_)
      playerSeekCont.fireSeekContinuation_ = shadow ? shadow.fireSeekContinuation_ : fixer(playerSeekCont.fireSeekContinuation_)

      fixer = null;

      playerSeekCont.detached = shadow ? shadow.detached : ((f) => {

        return function () {

          let ret = f.call(this);
          Promise.resolve(0).then(() => {
            ytLivePU.setUpPlayerSeekCont(this);
          })
          return ret;

        }


      })(playerSeekCont.detached)

      shadow = null

    }

    actionEventHandler(evt) {
      // console.log(evt)

      let target = (evt || 0).target;
      if (!target || target.isConnected === false) {
        return;
      }

      const d = (evt || 0).detail || 0;
      // console.log('yt-action', d.actionName)
      // console.log(d)

      let m3 = 0
      if (d.actionName === 'yt-live-chat-actions') {
        m3 = 1
        // console.log(d)
      } else if (d.actionName === 'yt-live-chat-replay-progress') {
        m3 = 1;
      }

      let m1 = 0;
      let m2 = 0;

      let isRenderStarted = ytLivePU.renderStarted >= 1;

      if (d.actionName === 'yt-live-chat-seek-success') {
        if (isRenderStarted) {
          m1 = 1
          m2 = 1
          ytLivePU.renderBusyS--
        }
      } else if (d.actionName === 'yt-live-chat-seek-start') {
        ytLivePU.renderBusyS++;
        ytLivePU.renderStarted = 1;
      } else if (d.actionName === 'yt-live-chat-reload-start') {
        ytLivePU.renderBusyR++;
        ytLivePU.renderStarted = 1;
      } else if (d.actionName === 'yt-live-chat-reload-success') {
        if (isRenderStarted) {
          m1 = 2
          m2 = 1
          ytLivePU.renderBusyR--
        }
      } else if (d.actionName === 'yt-live-chat-seek-fail') {
        if (isRenderStarted) {
          m1 = 1
          m2 = 1
          ytLivePU.renderBusyS--
        }
      } else if (d.actionName === 'yt-live-chat-reload-fail') {
        if (isRenderStarted) {
          m1 = 2
          ytLivePU.renderBusyR--
        }
      } else if (d.actionName === 'yt-live-chat-continuation-behavior-reload-success') {
        if (isRenderStarted) {
          m2 = 1
        }
      }

      if (m1) {

        m3 = 1;


        if (ytLivePU.renderBusyR < 0 || ytLivePU.renderBusyS < 0) {
          console.warn('render count error: ', ytLivePU.renderBusyR, ytLivePU.renderBusyS)
        }


        let u = 0;
        const resolves = m1 === 1 ? ytLivePU.seekWaiterResolves : ytLivePU.reloadWaiterResolves
        for (const resolve of resolves) {

          if (!u) resolves.length = 0;
          u++


          resolve();

        }

      }


      if (m2) {



        let u = 0;
        const resolves = ytLivePU.loadingWaiterResolves;
        for (const resolve of resolves) {

          if (!u) resolves.length = 0;
          u++


          resolve();

        }

      }



    }

    setupChatRenderer() {
      // only triggered in init

      const ytLivePU = this


      if (this.isChatReplay && !this.ytLiveChatRenderer._gIxmf) {
        this.ytLiveChatRenderer._gIxmf = 1;
        this.renderBusyS = 0;
        this.renderBusyR = 0;
        this.renderStarted = 0;

        this.ytLiveChatRenderer._setPlayerProgressSec = ((f) => {

          return function (x) {
            if (x === 0) x = 1e-99
            let t = f.apply(this, arguments)
            return t
          }

        })(this.ytLiveChatRenderer._setPlayerProgressSec);


        /*
        this.ytLiveChatRenderer.onLoadSeekContinuation_ = ((f) => {

          return function (a,b) {
            console.log(a,b)
            let t = f.apply(this, arguments)
            return t
          }

        })(this.ytLiveChatRenderer.onLoadSeekContinuation_);
        */


        this.ytLiveChatRenderer.removeEventListener('yt-action', ytLivePU.actionEventHandler, false);
        this.ytLiveChatRenderer.addEventListener('yt-action', ytLivePU.actionEventHandler, false);



      }


      if (this.isChatReplay && !ytLivePU.queryCR('style#tyt-chatframe-css')) {
        let style = ytLivePU.ytLiveChatApp.ownerDocument.createElement('style')
        style.id = 'tyt-chatframe-css'
        style.textContent = `
          yt-live-chat-renderer[loading2] #chat.yt-live-chat-renderer::after {
            display: block;
          }
          
          `;


        elementAppend.call(ytLivePU.ytLiveChatApp, style);
      }

    }



    /**
     * @param {number} a
     * @return {undefined}
     */
    playerProgressChangedForStatusSeek(a) {
      // console.log('playerProgressChangedForStatusSeek')
      // just update the variables according to the native method; no specific use. 
      // just play safe

      if (this.data.isReplay && !this.isAdPlaying) {
        this.currentPlayerState_ = {};
        /** @type {number} */
        let r = 1E3 * a;
        /** @type {string} */
        this.currentPlayerState_.playerOffsetMs = Math.floor(r).toString();
        let replayCont = this.$$("yt-live-chat-replay-continuation");
        let seekCont = this.$$("yt-player-seek-continuation");
        this._setPlayerProgressSec(a);
        if (seekCont) {
          seekCont.previousProgressSec = a;
          // this._setIsSeeking(true);
          this.replayBuffer_.clear();
        } else if (!this.isSeeking_) {
          if (replayCont && this.replayBuffer_.lastVideoOffsetTimeMsec) {
            /** @type {number} */
            replayCont.timeRemainingMsecs = this.replayBuffer_.lastVideoOffsetTimeMsec - r;
          }
          this.immediatelyApplyLiveChatActions([]);
        }

      }
    }

    statusSeek(pt) {
      // console.log('statusSeek')
      const ytLivePU = this
      // see playerProgressChangedForStatusSeek

      // if (pt < 1) pt = 1; // <0, 0.0 ~ 0.999 not accepted

      let cr = ytLivePU.ytLiveChatRenderer
      if (!cr) {
        console.warn('cr is not found')
        return
      }

      try {

        // cr.playerProgressChanged_(pt)
        this.playerProgressChangedForStatusSeek.call(cr, pt)

      } catch (e) { }

    }



    async sReload(endPointClicker) {
      // this is to perform the reload cont with simplified mechanism to make the process faster

      // console.log('sReload')
      const ytLivePU = this
      try {

        let cr = ytLivePU.ytLiveChatRenderer || 0
        if (typeof cr.handleReloadSuccess_ != 'function') {
          console.warn('cr.handleReloadSuccess_ is not a function.')
          return
        }

        let q = cr.triggerReloadContinuation
        if (q) cr.triggerReloadContinuation = function () { }

        ytLivePU.renderedVideoProgress = null

        endPointClicker.click();
        await Promise.resolve(0); // allow triggering of yt-live-chat-reload-start
        await ytLivePU.createCMWaiter(); // expect that renderBusyR = 1

        ytLivePU.prepareReload();

        if (q) {
          cr.triggerReloadContinuation = q
          cr.triggerReloadContinuation()
        }
        if (ytLivePU.elmChat.collapsed === true) return
        cr.handleReloadSuccess_()

      } catch (e) {
        console.warn(e)
      }

    }

    queryCR(query, inCR) {
      let elm = inCR ? this.ytLiveChatRenderer : this.ytLiveChatApp
      if (elm) return HTMLElement.prototype.querySelector.call(elm, query)
      return null
    }

    queryAllCR(query, inCR) {
      let elm = inCR ? this.ytLiveChatRenderer : this.ytLiveChatApp
      if (elm) return HTMLElement.prototype.querySelectorAll.call(elm, query)
      return null
    }

    dispatchYtAction(elm, detail) {

      let customEvent = new CustomEvent("yt-action", { bubbles: true, cancelable: false, composed: true, detail: detail })
      elm.dispatchEvent(customEvent);
    }

    directVideoProgress(progress) {
      // instead of postToContentWindow, directly call DOM method(s) of the chat renderer

      // if (progress < 1) progress = 1

      try {

        if ('playerProgressChanged_' in this.ytLiveChatRenderer) {


          this.ytLiveChatRenderer.playerProgressChanged_(progress)

        } else {
          this.dispatchYtAction(
            this.queryCR('yt-iframed-player-events-relay'),
            {
              actionName: "yt-live-player-video-progress",
              args: [progress],
              optionalAction: true,
              returnValue: []
            }
          );
        }

        // console.log(5656533)
        return true
      } catch (e) {
        console.warn(e);
      }

      return false;


    }


    /*
    // not accurate
    async seekRender(pt){


      if(!this.elmChat || !this.ytLiveChatRenderer) return
            

      let ret = false;
      let playerSeekCont = this.queryCR('yt-player-seek-continuation')
      if (playerSeekCont) {
        // force fireSeekContinuation_ at the begining
        // if('previousProgressSec' in playerSeekCont && !playerSeekCont.previousProgressSec) playerSeekCont.previousProgressSec = 1e99
        // playerSeekCont.previousProgressSec = 1e99 // 1e-9

        playerSeekCont.fireSeekContinuation_(pt)
        ret = true

      }

      if (ret === false) {
        this.elmChat.__$$postToContentWindow$$__({ 'yt-player-video-progress': pt })
      }
      this.renderedVideoProgress = pt
      await Promise.resolve(0)
      if (!ytLivePU.isChatMessageCanDisplay) {
        ytLivePU.isChatMessageCanDisplay = true
        await this.awaitLoading()
        this.elmChat.classList.add('tyt-chat-frame-ready')
      }

      this.triggeredPTC2();


    }

    */

    async actualRender(pt) {

      const ytLivePU = this
      try {

        if (!this.elmChat || !this.ytLiveChatRenderer) return



        if (this.renderedVideoProgress === null) {

          let playerSeekCont = this.queryCR('yt-player-seek-continuation')
          if (playerSeekCont) {
            // force fireSeekContinuation_ at the begining
            // if('previousProgressSec' in playerSeekCont && !playerSeekCont.previousProgressSec) playerSeekCont.previousProgressSec = 1e99
            // playerSeekCont.previousProgressSec = 1e99 // 1e-9

            playerSeekCont.fireSeekContinuation_(pt)

          }

        }

        let ret = this.directVideoProgress(pt)
        if (ret === false) {
          this.elmChat.__$$postToContentWindow$$__({ 'yt-player-video-progress': pt })
        }
        this.renderedVideoProgress = pt
        await Promise.resolve(0)
        if (!ytLivePU.isChatMessageCanDisplay) {
          ytLivePU.isChatMessageCanDisplay = true
          await this.createLoadingWaiter()
          // await this.awaitLoading()
          this.elmChat.classList.add('tyt-chat-frame-ready')
        }

        this.triggeredPTC2();


      } catch (e) {
        console.warn(e)
      }
    }

    videoCurrentTime() {

      let video = document.querySelector('#movie_player video[src]')
      return video.currentTime
    }

    async initReload(endPointClicker) {

      const ytLivePU = this
      // the initial chat messages usually wrong; 
      // this force the full reload at the begining.
      try {

        if (!endPointClicker) return

        if (this.initialFetchReq !== 2) return;

        let progress = ytLivePU.videoCurrentTime();
        // if (progress < 1) progress = 1;

        // console.log('initReload')

        ytLivePU.ytLiveChatRenderer.setAttribute('loading2', '')

        // const progressM1 =   progress - 1.04;
        const progressM1 = pm1(progress);
        ytLivePU.prepareReload()
        // await Promise.resolve(0);
        ytLivePU.clearList();
        ytLivePU.clearTickerList();
        ytLivePU.statusSeek(progressM1);
        ytLivePU.ytLiveChatRenderer._setIsSeeking(false);
        ytLivePU.ytLiveChatRenderer._setPlayerProgressSec(progressM1);

        // ytLivePU.prepareReload()
        ytLivePU.renderedVideoProgress = null;
        await ytLivePU.sReload(endPointClicker);
        await Promise.resolve(0);
        if (this.initialFetchReq !== 2) return;
        ytLivePU.clearList();
        ytLivePU.clearTickerList();
        ytLivePU.ytLiveChatRenderer._setIsSeeking(false);
        ytLivePU.ytLiveChatRenderer._setPlayerProgressSec(progressM1);

        ytLivePU.isChatMessageCanDisplay = false
        await this.actualRender(progress);
        await Promise.resolve(0)
        await ytLivePU.createCMWaiter();
        if (this.initialFetchReq !== 2) return;

        ytLivePU.ytLiveChatRenderer.removeAttribute('loading2')

        this.initialFetchReq = 3;


        if (`${ytLivePU.requestedVideoProgress}` !== `${ytLivePU.renderedVideoProgress}`) {
          this.elmChat.postToContentWindow({ 'yt-player-video-progress': ytLivePU.videoCurrentTime() })
        }


      } catch (e) {
        console.warn(e)
      }


    }

    getEndPointClicker() {
      let p = this.queryCR('yt-live-chat-header-renderer a.yt-simple-endpoint[aria-selected="true"]', true)

      if (!p) return null
      return {
        // click: ()=>p.click()
        click: () => {

          let ytReloadCont = HTMLElement.prototype.querySelector.call(p, 'yt-reload-continuation.style-scope.yt-dropdown-menu')
          let getContinuationUrl = ytReloadCont.getContinuationUrl.bind(ytReloadCont)
          // ytReloadCont.fire("yt-load-reload-continuation", getContinuationUrl);

          // ytReloadCont.trigger();
          ytReloadCont.fire("yt-load-reload-continuation", getContinuationUrl);


        }
      }
    }

    prepareReload() {
      // empty the pending request/queue as reload action

      (function () {

        this.smoothedQueue_.clear();
        this.activeRequest && (this.activeRequest.promise.cancel(),
          this.activeRequest = null);
        this.nextRequest_ && (this.nextRequest_.promise.cancel(),
          this.nextRequest_ = null);

        // avoid playback cache
        this.currentPlayerState_ = {}
        this.replayBuffer_.clear()

        // this._setPlayerProgressSec(a);
        // this._setIsSeeking(!0),

      }).call(this.ytLiveChatRenderer);

    }

    isReplay() {
      let liveChatRendererData = (this.ytLiveChatRenderer || 0).data
      return liveChatRendererData && liveChatRendererData.continuations && liveChatRendererData.isReplay === true
    }

    init() {
      if (this.adsState > 0) return;
      if ((this.loadStatus & 7) === 5 && this.elmChat !== null) {
        // usually not used
        // chat element found; cr found.
        // bug - no load event;
        let iframe = HTMLElement.prototype.querySelector.call(this.elmChat, 'iframe#chatframe')
        // console.log(944,2, iframe)
        if (iframe) {
          this.elmChatFrame = null; // required
          this.initByIframe(iframe); // supplementary
          return // init fire again in this.initByIframe
        }
      }
      if (!this.elmChat || !this.elmChatFrame) return;
      if (this.initialFetchReq === 1 && ((this.loadStatus & 6) === 6)) {
        this.initialFetchReq = 2;
        let endPointClicker = this.isReplay() ? this.getEndPointClicker() : null
        if (endPointClicker) {
          // console.log(933, 9)
          this.initReload(endPointClicker)
        } else {
          this.initialFetchReq = 3;
        }
      }

    }

    checkAdPlaying(arg0) {
      if (!arg0) return
      let startID = arg0['yt-player-ad-start'] // string = 'xxx'
      let endBool = arg0['yt-player-ad-end'] // boolean = true

      let playerStateChange = typeof arg0['yt-player-state-change'] === 'number';

      if (playerStateChange) {

        if ((this.adsState & 3) === 3 && (this.loadStatus & 19) === 3) {
          this.adsState = 0;

          if (this.ytLiveChatRenderer) {
            this.ytLiveChatRenderer._setIsAdPlaying(false);
          }

          if (this.elmChat) {
            this.elmChat.classList.remove('tyt-chat-ads-playing')
          }

          this.init()
        }

      } else if (((!!startID) ^ (!!endBool)) === 1) {

        let b = (!!startID) ? true : false;

        // console.log(555, this.adsState)


        this.setAdPlaying(b);



      }
    }

    triggeredPTC1() {
      // just reserved for future purpose
      if (!this.ytLiveChatRenderer) return;
      if (this.loadStatus & 8) return;
      this.loadStatus |= 8 // 00001000
      this.init();
    }

    triggeredPTC2() {
      // just reserved for future purpose
      if (this.loadStatus & 16) return;
      this.loadStatus |= 16 // 00010000
      this.init();

    }

    handlerChatRoomNewPage(evt) {
      // to be removed

      // if (this.cnpCID) clearTimeout(this.cnpCID);
      // this.cnpCID = 0;

      // //console.log(12399,2)
      // let nodeName = ((evt || 0).target || 0).nodeName
      // if (nodeName !== 'YTD-LIVE-CHAT-FRAME') return;

      // //console.log(12399,3)
      // let chat = evt.target
      // let iframe = chat.querySelector('iframe#chatframe[src]')
      // if (!iframe) return;


      // //let cc=3;
      // this.cnpCID = setTimeout(function () {

      //   this.cnpCID = 0;


      //   //console.log(12399,4)
      //   let cDoc = iframe.contentDocument
      //   if (!cDoc) return;

      //   /* chat.isListeningForPlayerProgress is no longer applicable */
      //   if (ytLivePU.checkChatNativeReady(chat) && cDoc.querySelector('body:empty')) {
      //     chat.urlChanged();
      //   }

      // }, 46); // delay in case empty body cannot be detected


    }

    _handlerPageDataFetched() {

      const ytLivePU = this

      // reset stuff once video (page) is changed

      // ytLivePU.elmChat = null
      // ytLivePU.elmChatFrame = null
      ytLivePU.isChatReplay = null
      ytLivePU.loadStatus = 0;
      ytLivePU.requestedVideoProgress = null
      ytLivePU.renderedVideoProgress = null
      ytLivePU.clearVars()
      ytLivePU.adsState = 0

      if (ytLivePU.elmChat) {
        ytLivePU.elmChat.classList.remove('tyt-chat-frame-ready');
        ytLivePU.elmChat.classList.remove('tyt-chat-ads-playing');
      }


      // let chat = ytLivePU.elmChat
      // console.log(33, chat)
      // if (chat && chat.collapsed === false) {
      //   console.log(34)
      //   try {
      //     // chat.attached();
      //     ytLivePU.initialFetchReq = 21
      //   } catch (e) { }
      // }
      // console.log(35, ytLivePU.initialFetchReq)
      // chat = null

    }

    async fakeReload() {
      // reserved for future reference.
      const ytLivePU = this;

      ytLivePU.dispatchYtAction(ytLivePU.ytLiveChatRenderer, {
        actionName: "yt-live-chat-pause-replay",
        args: null,
        optionalAction: true,
        returnValue: []
      })
      ytLivePU.dispatchYtAction(ytLivePU.ytLiveChatRenderer, {
        actionName: "yt-live-chat-reload-start",
        args: [],
        optionalAction: true,
        returnValue: []
      })
      ytLivePU.dispatchYtAction(ytLivePU.ytLiveChatRenderer, {
        actionName: "yt-live-chat-actions",
        args: [[]],
        optionalAction: false,
        returnValue: []
      })
      ytLivePU.dispatchYtAction(ytLivePU.ytLiveChatRenderer, {
        actionName: "yt-live-chat-reload-success",
        args: [],
        optionalAction: true,
        returnValue: []
      })

      ytLivePU.ytLiveChatRenderer.triggerReloadContinuation();

    }

    clearList() {
      // clear chat body messages

      let list = this.queryCR('yt-live-chat-item-list-renderer#live-chat-item-list-panel', true)
      if (list && list.clearList) list.clearList();

    }

    clearTickerList() {
      // clear chat header messages
      let list = this.queryCR('yt-live-chat-ticker-renderer.yt-live-chat-renderer', true)
      if (list && list.clearList) list.clearList();

    }
    async timelineBackward() {
      const ytLivePU = this
      let tLoadStatus = this.loadStatus
      let progress = ytLivePU.requestedVideoProgress;
      let tmp_postI = ytLivePU.postI;
      const isInvalidOps = () => (tmp_postI !== ytLivePU.postI || ytLivePU.loadStatus !== tLoadStatus || ytLivePU.elmChat.collapsed === true)

      try {



        // if (pt < 1) pt = 1;

        await new Promise(requestAnimationFrame);
        if (isInvalidOps()) return;

        let endPointClicker = ytLivePU.getEndPointClicker()

        if (endPointClicker) {
          ytLivePU.initialFetchReq = 9;


          if (ytLivePU.isChatMessageCanDisplay) {
            ytLivePU.isChatMessageCanDisplay = false
            // ytLivePU.elmChat.classList.remove('tyt-chat-frame-ready')
          }

          // console.log('timelineBackward')

          ytLivePU.ytLiveChatRenderer.setAttribute('loading2', '')

          let progressM1;

          // const progressM1 = progress - 1.04;
          progress = ytLivePU.requestedVideoProgress;
          progressM1 = pm1(progress)
          ytLivePU.prepareReload()
          ytLivePU.clearList();
          ytLivePU.clearTickerList();
          ytLivePU.statusSeek(progressM1);
          ytLivePU.ytLiveChatRenderer._setIsSeeking(false);
          ytLivePU.ytLiveChatRenderer._setPlayerProgressSec(progressM1);
          if (isInvalidOps()) return;
          // ytLivePU.ytLiveChatRenderer.handleChatSeekSuccess_()

          ytLivePU.renderedVideoProgress = null;
          await ytLivePU.sReload(endPointClicker); // await ytLivePU.fakeReload();
          // ytLivePU.queryCR('yt-player-seek-continuation').fireSeekContinuationAtCurrentProgress()
          await Promise.resolve(0);
          progress = ytLivePU.requestedVideoProgress;
          progressM1 = pm1(progress)

          ytLivePU.prepareReload()
          ytLivePU.clearList();
          ytLivePU.clearTickerList();
          ytLivePU.ytLiveChatRenderer._setIsSeeking(false);
          // ytLivePU.ytLiveChatRenderer._setPlayerProgressSec(progressM1);
          if (isInvalidOps()) return;
          let actualRenderProgress = ytLivePU.requestedVideoProgress
          let doNext = false

          ytLivePU.isChatMessageCanDisplay = false
          await ytLivePU.actualRender(actualRenderProgress)
          await Promise.resolve(0);
          if (isInvalidOps()) return;

          await ytLivePU.createCMWaiter();
          if (isInvalidOps()) return;

          ytLivePU.ytLiveChatRenderer.removeAttribute('loading2')

          if (ytLivePU.initialFetchReq !== 9) return;

          ytLivePU.initialFetchReq = 3;

          // this.ytLiveChatRenderer.handleLiveChatActions = q3

          if (doNext) ytLivePU.elmChat.postToContentWindow({ 'yt-player-video-progress': ytLivePU.videoCurrentTime() })

        } else {

          ytLivePU.initialFetchReq = 3;
        }


      } catch (e) {
        console.warn(e)
      }


    }


    checkChatNativeReady(chat) {
      if (chat.isAttached === false) return false;
      if ('isFrameReady' in chat && chat.isFrameReady !== true) return false
      // this.isListeningForPlayerProgress is no longer applicable
      return true;
    }


    getFunc_postToContentWindow() {
      const ytLivePU = this
      let refreshAt = 0;
      let rfaId = 0;
      const tf_gtcw2 = function (x) {
        if (rfaId > 0) {
          rfaId = 0;
          refreshAt = Date.now() + 460;
        }
      };

      ytLivePU.postI = 0
      ytLivePU.handlerPageDataFetched = ytLivePU._handlerPageDataFetched

      document.addEventListener('tabview-chatroom-newpage', ytLivePU.handlerChatRoomNewPage, true);

      const g_postToContentWindow = async function () {

        try {
          // console.log(6223, arguments)
          ytLivePU.checkAdPlaying(arguments[0])


          ytLivePU.triggeredPTC1();
          let isChatReplay = ytLivePU.isChatReplay

          const pt = (isChatReplay === true) ? arguments[0]['yt-player-video-progress'] : undefined
          const isVideoProgress = (pt !== undefined)

          if (ytLivePU.adsState > 0 && isVideoProgress === true) return;

          if (isVideoProgress === true) {
            /*
            if (ytLivePU.renderedVideoProgress > pt && pt < 3) {
              pt = 3 //minimum for seeking
            }
            */
            ytLivePU.requestedVideoProgress = pt
          }


          if (ytLivePU.initialFetchReq === 2 || ytLivePU.initialFetchReq === 9) return;
          if (this.collapsed === true) return;



          let boolz = false;
          if (ytLivePU.ytLiveChatApp && !this.ytInitialChecked && !ytLivePU.keepOriginalPTCW) {
            // check on the first call.
            ytLivePU.keepOriginalPTCW = !!ytLivePU.ytLiveChatApp.querySelector('#hyperchat');
          }
          if (ytLivePU.ytLiveChatApp && ytLivePU.loadStatus > 0) {
            // no longer check new element
            this.ytInitialChecked = true;
          }

          if (!ytLivePU.keepOriginalPTCW) {
            // if other script for chat such as hyperchat is used,
            // the chat optimization provided by Tabview Youtube will be disabled

            // let pt = arguments[0]['yt-player-video-progress'];
            if (isChatReplay === null) return;
            else if (isChatReplay === false) {
              // boolz = false; // only chat replay requires yt-player-video-progress
              if (isVideoProgress === true) return;
            } else if (isVideoProgress === true) {
              // isChatReplay === true
              if (ytLivePU.initialFetchReq !== 3) return;
              boolz = ytLivePU.checkChatNativeReady(this) && pt >= 0;
            }

          }


          if (boolz) {
            // isChatReplay === true
            // checkChatNativeReady(this) && pt >= 0;

            ytLivePU.postI++
            if (ytLivePU.postI > 1e9) ytLivePU.postI = 9;

            let tmp_postI = ytLivePU.postI;

            let cr = ytLivePU.ytLiveChatRenderer;
            if (!cr) return;

            await ytLivePU.createLoadingWaiter()

            if (tmp_postI !== ytLivePU.postI) return;


            // console.log(ytLivePU.requestedVideoProgress , ytLivePU.renderedVideoProgress)



            if (ytLivePU.requestedVideoProgress < ytLivePU.renderedVideoProgress && ytLivePU.requestedVideoProgress >= 0 && ytLivePU.renderedVideoProgress >= 0 && ytLivePU.renderedVideoProgress !== null) {

              if (Math.abs(ytLivePU.requestedVideoProgress - ytLivePU.renderedVideoProgress) < 0.001) {
                // js Bug?  ytLivePU.requestedVideoProgress = 5122.329545  & ytLivePU.renderedVideoProgress = 5122.329545454545
              } else {
                ytLivePU.timelineBackward();
              }
              return;
            }




            let exec = true;
            if (rfaId > 0 && Date.now() > refreshAt) {
              $cancelAnimationFrame(rfaId); //rfaId is still >0
              tf_gtcw2();
            } else if (rfaId === 0) {
              rfaId = $requestAnimationFrame(tf_gtcw2);
            } else {
              exec = false;
            }

            if (ytLivePU.initialFetchReq !== 3) return;
            if (exec) {
              ytLivePU.initialFetchReq = 8;
              await ytLivePU.actualRender(pt);
              // if (pt < 1) ytLivePU.fireSeekContinuationAtCurrentProgress()
              await Promise.resolve(0);
              await ytLivePU.createCMWaiter();
              if (ytLivePU.initialFetchReq !== 8) return;
              ytLivePU.initialFetchReq = 3;
              if (`${pt}` !== `${ytLivePU.requestedVideoProgress}` && ytLivePU.elmChat) {
                ytLivePU.elmChat.postToContentWindow({ 'yt-player-video-progress': ytLivePU.videoCurrentTime() })
              }
            }

          } else {

            //{'yt-player-state-change': 3}
            //{'yt-player-state-change': 2}
            //{'yt-player-state-change': 1}

            //isFrameReady is false if iframe is not shown
            this.__$$postToContentWindow$$__(...arguments)
          }

        } catch (e) {
          console.warn(e)
        }

      }
      return g_postToContentWindow;
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

        document.querySelector('ytd-watch-flexy').resolveCommand(
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
        if (!transcript) continue;

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

          if (/^[\,\.\x60\x27\x22\u200b\xA0\x20\;\-]*$/.test(text)) {
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
        const runs = transcript.snippet.runs;
        if (runs.length > 1 || runs[0].text.includes('\n')) continue; // skip multi lines
        let main_startMs = (+transcript.startMs || 0);
        let main_endMs = (+transcript.endMs || 0);
        transcript = null;

        /** @type {Map<string, number>} */
        const tMap = new Map(); // avoid duplicate with javascript object properties

        // assume that it is asc-ordered array of key startMs;
        for (let sj = sj_start; sj < sj_length; sj++) {
          const initialSegment = initialSegments[sj]

          if (!initialSegment || initialSegment[s8]) continue;

          const transcriptSegementJ = initialSegment.transcriptSegmentRenderer

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

          const threadRenderer = entry.target;
          if (!threadRenderer) continue;

          let h = entry.boundingClientRect.height

          let b1 = h > 10;
          let b2 = !entry.isIntersecting;
          if (!b1 && !b2) continue;

          let m = cmtWM.get(threadRenderer);
          // m:string -> css for --tabview-cmt-height
          // m===-1: not intialized
          // m===-2: disabled
          if (m === -2) continue;


          if (b1) {
            // possible to get height even it is not intersecting

            let t = `${h.toFixed(3)}px` //123.456px
            if (m !== t) {
              cmtWM.set(threadRenderer, t)
            }
            m = t;

          }

          // m:string -> css for --tabview-cmt-height

          if (m === -1) continue; // h is not available

          const style = threadRenderer.style

          if (b2) {
            // set CSS rule when it leaves the visible region

            if (style.getPropertyValue("--tabview-cmt-height") !== m) {
              style.setProperty("--tabview-cmt-height", m)
            }

            threadRenderer.classList.remove('tyt-visible-comment')

          } else {
            //invisible -> visible
            style.removeProperty("--tabview-cmt-height")
            threadRenderer.classList.add('tyt-visible-comment')
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


  function getInsObserverChipCloud() {


    let insObserver = null;
    if (window.IntersectionObserver) {

      let wm = new WeakMap();


      async function callReset(target, value) {


        if (wm.get(target) !== value) {
          wm.set(target, value)
          target.reset();
          if (!target.hasAttribute('QNJMC')) {
            target.setAttribute('QNJMC', '')
            target.addEventListener('mouseenter', function () {
              requestAnimationFrame(() => {
                if (this.atStart === true) this.reset();
              })
            }, false)
          }
        }

        setTimeout(() => {
          if (target.atStart === true) target.reset();
        }, 160)

      }

      insObserver = new IntersectionObserver(function (entries, observer) {

        for (const entry of entries) {

          let h = entry.boundingClientRect.height
          if (h > 10 && entry.isIntersecting) {
            // possible to get height even it is not intersecting

            if (entry.target && entry.target.reset) {
              let area = Math.round(entry.boundingClientRect.width * entry.boundingClientRect.height);
              if (area > 10) {
                callReset(entry.target, area)
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


      async function callReset(target, value) {

        if (wm.get(target) !== value) {
          wm.set(target, value)
          target.reset();
        }
        setTimeout(() => {
          if (target.atStart === true) target.reset();
        }, 160)

      }

      let t = 0;
      let cid_mset = 0;
      function mSet(target) {


        let c = Date.now();
        t = c;
        if (cid_mset) clearTimeout(cid_mset);
        cid_mset = setTimeout(() => {

          if (t !== c) return;

          let chips = querySelectorFromAnchor.call(target, 'iron-selector#chips');

          if (!chips) return;

          callReset(target, chips.offsetWidth)

        }, 160)

      }

      mutObserver = new MutationObserver(function (mutationList, observer) {
        for (const mutation of mutationList) {
          let target = mutation.target;
          target = closestFromAnchor.call(target, 'yt-chip-cloud-renderer')
          if (target && target.reset) {
            mSet(target)
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
    ytLivePU.postI++;
    pageType = ((evt.detail || 0).pageData || 0).page;
    if (ytLivePU.handlerPageDataFetched) ytLivePU.handlerPageDataFetched();
  }

  function onPageFinished(evt) {
    if ((pageID % 2) === 1) {
      pageID++;
      translateHanlder = null;  // release the memory used for previous page
      Promise.resolve(0).then(() => {
        translateHanlder = getTranslate(); // release the memory used for previous page
      })
      ytLivePU.postI++;

      let ds = document.querySelector('ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)')
      if (ds && ds.isAttached === true) {
      } else {
        dsMgr._lastDSVideo = null; // for next video page
      }
      // console.log(!!ytLivePU.elmChat, ytLivePU.elmChat && !document.contains(ytLivePU.elmChat))
    }
  }


  function pageLoad(evt) {
    if ((pageID % 2) === 0) {
      pageID++;
      ytLivePU.postI++;
      let chat = ytLivePU.elmChat
      if (chat && chat.collapsed === false) {
        try {
          // chat.detached();
        } catch (e) { }
      }
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
      }
    }

    // Export to external environment
    // try { window.customYtElements = customYtElements; } catch (error) { /* for Greasemonkey */ }
    // try { module.customYtElements = customYtElements; } catch (error) { /* for CommonJS */ }

    return customYtElements;

  })();

  // ========================


  /* added in 2023.06.25 */
  async function fixLiveChatToggleButton() {


    let elm = document.querySelector('ytd-live-chat-frame');
    let initialDisplayState = null;
    try {
      initialDisplayState = elm.data.liveChatRenderer.initialDisplayState
    } catch (e) { }
    if (typeof initialDisplayState !== 'string') return null;

    let btn = HTMLElement.prototype.querySelector.call(elm, 'ytd-toggle-button-renderer');
    let btnData = (btn || 0).data;
    if (!btnData) return null;
    let isToggled = btnData.isToggled === true;

    let collapsed = elm.collapsed;
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
      btn.data = Object.assign({}, btn.data, { isToggled: !isToggled });
    }

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


    // console.log(customElements.get('ytd-expander').prototype.recomputeOnResize) // undefined

    // delayPropsSetup(customElements.get('ytd-expander').prototype).push( ()=>{
    //   console.log(592, customElements.get('ytd-expander').prototype.recomputeOnResize); // 592 -> 591 ...
    // })





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

    requestAnimationFrame(() => {
      if (translateHanlder === null)
        translateHanlder = getTranslate();
    })


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
      const g_postToContentWindow = ytLivePU.getFunc_postToContentWindow();
      cProto.__$$postToContentWindow$$__ = cProto.postToContentWindow;
      cProto.postToContentWindow = g_postToContentWindow;
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



    const getProto = (element) => {
      let proto = null;
      if (element) {
          if (element.inst) proto = element.inst.constructor.prototype;
          else proto = element.constructor.prototype;
      }
      return proto || null;
  };

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
          const hasData = (((cnt.__data || 0).data || 0).contents || 0) !== 0;
          if (hasData) {
            const sections = ((cnt.$ || 0).sections || 0);
            if (sections && 'triggerInitialContinuations' in sections) {
              Promise.resolve(sections).then((sections)=>{
                sections.triggerInitialContinuations();
              }).catch(()=>{});
              // console.log('sections.triggerInitialContinuations'); 
              //  a[b].triggerIfNotPreviouslyTriggered() -> this.hasBeenTriggered_ || this.trigger()
            }
          }
          hostElement.dispatchEvent(new CustomEvent('ytd-comments-data-changed', { detail: { hasData } }));
        }
      }

      // headerChanged_ - new method to fetch comments count
      if (typeof cProto.headerChanged_ == 'function' && !('tytHeaderChanged_' in cProto)) {
        cProto.tytHeaderChanged_ = cProto.headerChanged_;
        cProto.headerChanged_ = function () {
          const cnt = this;
          const hostElement = this.hostElement || this;
          cnt.tytHeaderChanged_();
          hostElement.dispatchEvent(new CustomEvent('ytd-comments-header-changed'));
        }
      }


    });

    document.addEventListener('tabview-fix-popup-refit', function () {

      const cProto = getProto(document.createElement('tp-yt-iron-dropdown'));
      if (!cProto) return;

      if (cProto.__refit) return;
      let _refit = cProto.refit;
      if(typeof _refit !== 'function') return;

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
    const regRFn = (cProto, keyA, keyB) => {

      if (cProto[keyB] || !cProto[keyA]) return;

      cProto[keyB] = cProto[keyA];

      let renderStore = new WeakMap();

      cProto[keyA] = function () {

        const cnt = this;
        const hostElement = this.hostElement || this;

        if (renderStore.get(hostElement) >= 1) return;
        renderStore.set(hostElement, requestAnimationFrame(() => {
          renderStore.set(hostElement, 0);

          if (hostElement.hidden !== true && hostElement.isAttached === true && hostElement.isConnected === true) {

            cnt[keyB]();
          }

        }));

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


    /* added in 2023.06.25 */
    customYtElements.whenRegistered('ytd-live-chat-frame', (cProto) => {

      let crid = 0;

      cProto.__forceChatRender2__ = async function () {

        const cnt = this;
        const hostElement = this.hostElement || this;

        const isYtChatLiveAppLoaded = () => {

          let ytChatLiveApp = null;
          try {
            ytChatLiveApp = cnt.$.chatframe.contentWindow.document.querySelector('yt-live-chat-app')
          } catch (e) { }

          return ytChatLiveApp !== null;
        }

        if (isYtChatLiveAppLoaded()) return;

        let trid = ++crid;
        const f = () => {
          
          if (trid === crid && hostElement.isConnected === true && hostElement.collapsed === false) {
            if (isYtChatLiveAppLoaded()) return;

            cnt.visibilityObserverForChild_ = null; cnt.localVisibilityObserver_ = null;
            cnt.visibilityOptionVisible_ = null; cnt.visibilityOptionHidden_ = null; cnt.visibilityOptionPrescan_ = null;
            cnt.childCache_ = new Set;
            cnt.playerListeners_ = new Map;
            cnt.openPopupConfig = null; cnt.hostElement = hostElement; cnt.polymerController = cnt;
            // this.detached();this.attached();
            // this.created();



            this.detached(); /* this.created(); */ this.attached();
            Promise.resolve().then(() => {

              const chatframe = (cnt.$ || 0).chatframe;

              if (this.isChatReplay() === false && chatframe && hostElement.isConnected === true && hostElement.collapsed === false && chatframe.isConnected === true) {
                let src = chatframe.getAttribute('src');
                let m = /live_chat\?continuation=[^&\/\=]+([&\/\=].*|)$/.exec(src || '')
                if (m) {
                  let k = m[1];
                  if (k === '&z' || k === '') {
                    chatframe.setAttribute('src', src.replace(/&z$/, '') + '&');
                  } else if (k === '&') {
                    chatframe.setAttribute('src', src + 'z');
                  }
                }
              }

            });

            return true;
          }
          return false;
        }

        // let executed = f() === true;
        let executed = false;
        if (!executed) {
          requestAnimationFrame(f);
        }

      };

      cProto.__forceChatRender__ = cProto.__forceChatRender2__;

      (() => {
        let elm = document.querySelector('ytd-live-chat-frame');
        if(elm){
          let cnt = elm.inst || elm;
          cnt.__forceChatRender__ && cnt.__forceChatRender__();
        }
        elm = null;
      })();


    }, true);


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

    /*
      let ww = {}, wp = customElements.get('ytd-comments').prototype; for (const s of Object.keys(wp)){
          try{
          if (typeof  wp[s] == 'function') {
              ww[s] = wp[s]; }
          }catch(e){}
      } 
      */

  }

  /*
  function textsMatch(runs1, runs2) {

    let i = runs1.length - runs2.length;
    if (i < 0) return false;
    let j = 0;
    while (i < runs1.length && j < runs2.length) {
      if (runs1[i].text !== runs2[j].text) return false;
      i++;
      j++;
    }
    return true;

  }


  function teaserInfoMatchCondition(lineExpander) {

    if (!lineExpander) return null;
    let watch_metadata = lineExpander.__dataHost;
    if (!watch_metadata || watch_metadata === lineExpander) return null;
    if (!watch_metadata.__data || !watch_metadata.__data.descriptionText || !watch_metadata.__data.videoSecondaryInfoRenderer) return null;


    let full = watch_metadata.__data.descriptionText.runs
    let detail = watch_metadata.__data.videoSecondaryInfoRenderer.description.runs
    let content = lineExpander.text.runs

    return [watch_metadata, full, detail, content]


  }

  */

  function showLyricsWhenReady(data) {

    console.assert(!!data, 'parameter "data" is not defined.')

    let lyricsIframe = document.querySelector('#lyricsiframe');
    let ytdApp = document.querySelector('ytd-app');
    if (lyricsIframe && ytdApp && lyricsIframe.contentDocument !== null) {

      Promise.resolve(0).then(() => {
        lyricsIframe.classList.remove('tyt-tmp-hide-lyricsiframe');

      })

    }

  }

  function getEPC(ep) {

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

    /** @type {HTMLElement} */
    let newPanel = ytdFlexyElm.createComponent_({
      "component": "ytd-engagement-panel-section-list-renderer",
      "params": {
        "isWatch": true
      }
    }, "ytd-engagement-panel-section-list-renderer", true);

    newPanel.data = {
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

    newPanel.classList.add('style-scope', 'ytd-watch-flexy');

    elementAppend.call(querySelectorFromAnchor.call(ytdFlexyElm, '#panels'), newPanel);

    return newPanel;

  }

  let geniusLyricsVisObserver = null

  async function geniusLyricsVisObserveCbAsync(panel) {

    await Promise.resolve(0)

    let lyricsiframe = null

    if (panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN') {
      isLyricsLoading = false
      lyricsiframe = panel.querySelector('#lyricsiframe');
      document.dispatchEvent(new CustomEvent('genius-lyrics-actor', { detail: { action: 'hideLyrics' } }))
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
            document.dispatchEvent(new CustomEvent('genius-lyrics-actor', { detail: { action: 'reloadCurrentLyrics' } }))
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

          document.dispatchEvent(new CustomEvent('tyt-engagement-panel-visibility-change', {
            detail: {
              panelId: "engagement-panel-genius-transcript",
              toShow: true
            }
          }))


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


        document.dispatchEvent(new CustomEvent('tyt-engagement-panel-visibility-change', {
          detail: {
            panelId: "engagement-panel-genius-transcript",
            toHide: true
          }
        }))


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
        document.dispatchEvent(new CustomEvent('getLyricsReady'));
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
    let data = ((evt || 0).data || 0)


    if (data.iAm === 'Youtube Genius Lyrics') {

      switch (data.type) {
        case 'pageready':
          showLyricsWhenReady(data);
        case 'lyricsDisplayState':
          onLyricsDisplayStateChanged(data);

      }

    }

  })

  if (document.documentElement.hasAttribute('tabview-loaded')) ceHack(); else
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
        let cmRender = closestFromAnchor.call(elm, 'ytd-comment-renderer')
        let tabComments = closestFromAnchor.call(cmRender, '#tab-comments')
        let cmRenderRect = cmRender.getBoundingClientRect()
        let tabCommentsRect = tabComments.getBoundingClientRect()
        let eTop = cmRenderRect.top
        let cTop = tabCommentsRect.top

        if (cTop - eTop > 0) {
          cmRender.scrollIntoView();
        }

      }

    })


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
          this.dispatchEvent(new CustomEvent('tyt-autocomplete-suggestions-change'));
        };

      }

      s.dispatchEvent(new CustomEvent('autocomplete-sc-exist'));

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
    let node = (evt || 0).target;
    node.addEventListener('click', tabviewInfoTogglerOnClick, false)
  }, true);

  document.addEventListener('tabview-resize-comments-rows', (evt) => {
    //slightly delayed
    //console.log('tabview-resize-comments-rows')
    for (const s of document.querySelectorAll('#tab-comments #comments .tyt-visible-comment ytd-expander')) {
      Promise.resolve(s).then(() => {
        s.calculateCanCollapse(true);
      });
    }

  }, false);


  // ----------------------------- ytLive / Popup / Begin -----------------------------

  // chatroomRenderer
  // popupBtnId
  // mtoIframePopup

  document.addEventListener('tyt-close-popup', (evt) => {
    let cr = kRef(chatroomRenderer);

    if (cr) {

      try {
        cr.closePopoutWindow();
      } catch (e) { }

    }

  }, false);

  let popupBtnId = 0;
  let mtoIframePopup = null;
  document.addEventListener('tyt-iframe-popup-btn-setup', (evt) => {

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

    function codeFixForParticipants() {
      let cr = kRef(chatroomRenderer)
      if (!cr) return;
      let participants = HTMLElement.prototype.querySelector.call(cr, 'iron-pages > yt-live-chat-participant-list-renderer.yt-live-chat-renderer');
      if (!participants) return;
      participants.canShow322 = !participants.matches('iron-pages > :not(slot):not(.iron-selected)')
      // console.log('canShow322', participants.canShow322)

      if (!participants.onParticipantsChanged322 && typeof participants.onParticipantsChanged === 'function') {
        participants.onParticipantsChanged322 = participants.onParticipantsChanged

        // let _lastData = null
        participants.participantsChangeIfPending = function () {

          if (this.canShow322 === true && this.showPending322 === true && this.onParticipantsChangedBusy322 === false) {
            this.onParticipantsChanged();
          }
        }
        participants.onParticipantsChanged = async function () {
          try {
            this.showPending322 = true; // refresh next time

            if (this.canShow322 !== true) return; // avoid refresh participants when the list is not shown

            if (this.onParticipantsChangedBusy322 === true) return;

            this.onParticipantsChangedBusy322 = true;

            let waiter = new Promise(window.requestAnimationFrame); // avoid frequently update

            this.onParticipantsChanged322()

            this.showPending322 = false; // refreshed

            await waiter;

          } catch (e) {
            console.warn(e)
          }



          this.onParticipantsChangedBusy322 = false;
          if (typeof this.participantsChangeIfPending === 'function') this.participantsChangeIfPending(); // unknown bug found in 2023.06.18 (FireFox)



        }

      }

      participants.onParticipantsChangedBusy322 = false; // force change
      participants.participantsChangeIfPending();

      participants = null
      cr = null


    }

    function setupMTO(btn) {
      // when btn clicked

      btn = mWeakRef(btn)

      let cr = kRef(chatroomRenderer)
      if (!cr) return;
      let cm = cr.querySelector('#chat-messages')
      if (!cm) return;


      mtoIframePopup = new MutationObserver((mutations) => {

        let cm = null
        let required = null
        let popuped = null
        let toHideBtn = null
        let toShowBtn = null
        for (const mutation of mutations) {
          let currentHas = null
          if (!cm) {
            cm = mutation.target
            currentHas = cm.classList.contains('iron-selected')
          }
          let c = mutation.oldValue
          if (typeof currentHas == 'boolean') {
            if (currentHas === true) {
              toShowBtn = true
              if (c.indexOf('iron-selected') < 0) {
                required = true
                popuped = false
              }
            } else if (currentHas === false) {
              if (c.indexOf('iron-selected') >= 0) {
                let cr = kRef(chatroomRenderer)
                if (cr && cr.popoutWindow) {
                  required = true
                  popuped = (popupClose.mPopupWindow === null) // no WeakRef was set
                } else {
                  toHideBtn = true
                }
                cr = null
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
            btnElm.classList.toggle('tyt-btn-popuped', popuped)
            document.dispatchEvent(new CustomEvent('tyt-chat-popup', {
              detail: {
                popuped: popuped
              }
            }))
            try {
              if (!popuped && popupClose) {
                popupClose();
              }
            } catch (e) { }
          }
          if (popuped && popupClose) {
            let cr = kRef(chatroomRenderer)
            if (cr) {
              popupClose.mPopupWindow = mWeakRef(cr.popoutWindow)
            }
            cr = null
          }
        } else if (required === null && toHideBtn === true && toShowBtn === null) {
          if (btnElm) btnElm.classList.remove('tyt-btn-enabled')
        }

        // resolve issue - participant list loaded causing long re-rendering time required for chat messages switching (top chats vs full chats)
        // Promise.resolve(0).then(()=>{
        //   let cr = kRef(chatroomRenderer)
        //   if(!cr) return;
        //   let participants = HTMLElement.prototype.querySelector.call(cr, 'iron-pages > yt-live-chat-participant-list-renderer.yt-live-chat-renderer');
        //   if(participants){
        //     if (participants.matches('iron-pages > :not(slot):not(.iron-selected):not(:empty)')) {
        //       participants.textContent = '';
        //     }
        //   }
        // })

        // resolve issue - participant list loaded causing long re-rendering time required for chat messages switching (top chats vs full chats)
        Promise.resolve(0).then(codeFixForParticipants);


      })
      mtoIframePopup.observe(cm, {

        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true

      })
      cm = null
      cr = null


    }

    function isThisChatCanPopup(cr) {

      let canAddBtn = false
      let cm = null

      if (cr && typeof cr.openPopoutWindow === 'function' && cr.openPopoutWindow.length === 1 && typeof cr.closePopoutWindow === 'function') {


        let crData = cr.data
        if (crData) {

          let isReplay = crData.isReplay === true
          let bool = !isReplay
          // bool = true
          if (bool) {

            cm = cr.querySelector('#chat-messages')
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


      let cr = kRef(chatroomRenderer)

      if (cr && typeof cr.openPopoutWindow === 'function' && cr.openPopoutWindow.length === 1 && typeof cr.closePopoutWindow === 'function') {

        let v = getV()
        if (v) {
          let cm = cr.querySelector('#chat-messages')
          if (cm) {

            let isReplay = cr.data.isReplay === true

            let url;
            if (!isReplay) {
              url = "https://www.youtube.com/live_chat?is_popout=1&v=" + v
            } else {
              url = "https://www.youtube.com/live_chat_replay?is_popout=1&v=" + v
            }
            // https://studio.youtube.com/live_chat?is_popout=1&v=


            !isPopuped(cm) ? cr.openPopoutWindow(url) : popupClose();

          }

        }


      }



    }

    async function runner(btn) {

      // console.log(334,4)

      clearMTO()
      popupClose = null

      popupBtnId++
      let tid = popupBtnId
      let count = 0

      let cr = null
      let itemScroller = null
      while (!itemScroller) {
        if (!cr) cr = kRef(chatroomRenderer)
        if (cr) itemScroller = cr.querySelector('#item-scroller.yt-live-chat-item-list-renderer')
        await new Promise(resolve => window.requestAnimationFrame(resolve));
        if (tid !== popupBtnId) return
        if (count++ > 200) return
      }
      if (!document.contains(btn)) return


      clearMTO()
      let canAddBtn = isThisChatCanPopup(cr)
      // console.log(334,5, canAddBtn)


      if (canAddBtn) {


        btn.removeEventListener('click', popupBtnOnClick, false);

        popupClose = function () {

          if (!popupClose) return
          try {
            popupClose.closePopoutWindow()
          } catch (e) { }
          let mPopupWindow = kRef(popupClose.mPopupWindow)
          popupClose.mPopupWindow = null
          if (mPopupWindow) {
            try {
              mPopupWindow.close()
            } catch (e) { }
          }
          mPopupWindow = null
        }
        popupClose.mPopupWindow = null
        popupClose.closePopoutWindow = cr.closePopoutWindow.bind(cr)

        setupMTO(btn)


        btn.addEventListener('click', popupBtnOnClick, false);


        btn.classList.toggle('tyt-btn-enabled', true)



      } else {

        btn.removeEventListener('click', popupBtnOnClick, false);
        btn.classList.toggle('tyt-btn-enabled', false)

      }



      btn = null


    }
    runner(evt.target)

  }, true);


  // ----------------------------- ytLive / Popup / End -----------------------------


  document.addEventListener('tabview-page-rendered', () => {
    // reserved
  });


  document.addEventListener('tabview-chatframe-loaded', function (evt) {

    let iframe = evt.target
    if (!iframe) return

    ytLivePU.setupYtLiveMO(); // setup when iframe is loaded; no need to setup when the video is without chatroom
    ytLivePU.elmChatFrame = null; // required
    ytLivePU.initByIframe(iframe); // main


  }, true)

  document.addEventListener('tabview-chatroom-ready', function (evt) {

    let iframe = evt.target
    if (!iframe) return
    ytLivePU.initByChatRenderer(iframe.contentWindow.document.querySelector('yt-live-chat-renderer'));


    if (ytLivePU.isChatMessageCanDisplay === true) {
      ytLivePU.isChatMessageCanDisplay = false
      let chat = ytLivePU.elmChat;
      chat && chat.classList.remove('tyt-chat-frame-ready')
    }

    ytLivePU.postI = 0;

    if (ytLivePU.isChatReplay && ytLivePU.elmChat) {
      // ytLivePU.elmChat.postToContentWindow({ 'yt-player-video-progress': ytLivePU.videoCurrentTime() })
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

    let ytApp = document.querySelector('ytd-app');
    if (!ytApp || typeof ytApp.handleNavigate !== 'function') return;

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
    ytApp.handleNavigate(req);

  });


  function findLcComment(lc) {
    if (arguments.length === 1) {

      let element = document.querySelector(`#tab-comments ytd-comments ytd-comment-renderer #header-author a[href*="lc=${lc}"]`);
      if (element) {
        let commentRenderer = closestFromAnchor.call(element, 'ytd-comment-renderer');
        if (commentRenderer && lc) {
          return {
            lc,
            commentRenderer
          }
        }
      }
    } else if (arguments.length === 0) {

      let element = document.querySelector(`#tab-comments ytd-comments ytd-comment-renderer > #linked-comment-badge span:not(:empty)`);
      if (element) {
        let commentRenderer = closestFromAnchor.call(element, 'ytd-comment-renderer');
        if (commentRenderer) {

          let header = querySelectorFromAnchor.call(commentRenderer, '#header-author');
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
        if (commentRenderer && lc) {
          return {
            lc,
            commentRenderer
          }
        }
      }
    }

    return null;

  }

  function findContentsRenderer(ytNode) {

    let pNode = ytNode;
    let kNode = ytNode;
    const ytNodeData = ytNode.data
    if (!ytNodeData || typeof ytNodeData !== 'object') return;
    while ((pNode = nodeParent(pNode)) instanceof HTMLElement) {
      const contents = (pNode.data || 0).contents
      if (typeof contents === 'object' && typeof contents.length === 'number') {

        // console.log(pNode.data.contents, ytNode.data)

        let index = -1;

        let j = 0;
        for (const content of contents) {
          let mz = ((content.commentThreadRenderer || 0).comment || 0).commentRenderer || content.commentRenderer;

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

      let r1 = findLcComment(currentLcId).commentRenderer;
      let r2 = findLcComment(targetLcId).commentRenderer;


      if (typeof r1.data.linkedCommentBadge === 'object' && typeof r2.data.linkedCommentBadge === 'undefined') {

        let p = Object.assign({}, r1.data.linkedCommentBadge)

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
          const v2Conents = v2.parent.data.contents
          if (v2.parent.nodeName === 'YTD-COMMENT-REPLIES-RENDERER') {


            if (lcSwapFuncB(targetLcId, currentLcId, p)) {
              done = 1;
            }

            done = 1;
          } else {


            v2.parent.data = Object.assign({}, v2.parent.data, { contents: [].concat([v2Conents[v2.index]], v2Conents.slice(0, v2.index), v2Conents.slice(v2.index + 1)) });

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

      let r1 = findLcComment(currentLcId).commentRenderer;
      let r2 = findLcComment(targetLcId).commentRenderer;

      let p = Object.assign({}, _p)
      r1.data.linkedCommentBadge = null;
      delete r1.data.linkedCommentBadge;

      let q = Object.assign({}, r1.data);
      q.linkedCommentBadge = null;
      delete q.linkedCommentBadge;

      r1.data = Object.assign({}, q);
      r2.data = Object.assign({}, r2.data, { linkedCommentBadge: p });

      done = 1;

    } catch (e) {
      console.warn(e)
    }
    return done === 1;
  }


  document.addEventListener("tabview-miniview-browser-enable", () => {

    if (miniview_enabled) return;

    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    if (!isPassiveArgSupport) return;

    // console.log("tabview-miniview-browser-enable");

    miniview_enabled = true;

    let ytdApp = document.querySelector('ytd-app');

    if (!ytdApp) return;

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

    if (ytdApp.handleNavigate.__ma355__) return;

    ytdApp.handleNavigate = ((handleNavigate) => {

      return function (req) {

        // if (((req || 0).command || 0).watchEndpoint && !req.command.watchEndpoint.watchEndpointSupportedOnesieConfig) {
        //   req.command.watchEndpoint.watchEndpointSupportedOnesieConfig = { // optional; object
        //     "html5PlaybackOnesieConfig": {
        //     }
        //   };
        // }


        // if(DO_REQ_CHANGE_FOR_NEXT_VIDEO && req && req.type === 0 && req.command && req.command.commandMetadata && req.command.watchEndpoint && req.form){

        //   const commandMetadata = req.command.commandMetadata;
        //   const webCommandMetadata = commandMetadata.webCommandMetadata;
        //   const watchEndpoint =  req.command.watchEndpoint;
        //   const form =req.form;

        //   if(webCommandMetadata && webCommandMetadata.rootVe===3832 && (webCommandMetadata.url||'').startsWith('/watch?v=') && webCommandMetadata.webPageType==="WEB_PAGE_TYPE_WATCH" ){


        //     if(!(skipUtil>Date.now()) && form.tempData && form.reload===false && watchEndpoint.videoId && watchEndpoint.playerParams){

        //       // console.log(567)
        //       const video_id = watchEndpoint.videoId;



        //       let rUrl = getFixedUrlFromRedirectedUrl(webCommandMetadata.url);
        //       if(rUrl!==webCommandMetadata.url){
        //         console.debug('rUrl', webCommandMetadata.url,  rUrl);
        //         webCommandMetadata.url = rUrl;
        //       }

        //       delete watchEndpoint.playerParams;

        //       /*
        //       let ytdPlayer = document.querySelector('ytd-player#ytd-player')
        //       if(ytdPlayer && ytdPlayer.$$){

        //         let m = ytdPlayer.$$('video');
        //         let btn = ytdPlayer.$$('.ytp-play-button');

        //         if(m && btn && m.paused === true){

        //           const play = m.play;
        //           let p1 = new Promise(resolve =>{

        //             m.play = function(){
        //               resolve();
        //               return play.apply(this, arguments);
        //             }

        //           });



        //           btn.click();

        //           const __req__ = req;
        //           p1.then(()=>{
        //             delete m.play;
        //             if(m.play!==play) m.play = play;
        //             setTimeout(()=>{
        //               skipUtil = Date.now() + 80;
        //               console.log(552, __req__)
        //               this.handleNavigate(__req__);
        //             },800)
        //           })

        //           return;

        //         }


        //       }
        //       */



        //       if(  (webCommandMetadata.url||'').indexOf('list=')<0 &&  (location.search||'').indexOf('list=')<0 &&  (webCommandMetadata.url||'').indexOf('lc=')<0  ){



        //         console.debug('changed req');
        //         arguments[0] = req = {
        //           "type": 0,
        //           "command": {
        //             // "clickTrackingParams": "XXXXX",
        //             "commandMetadata": {
        //               "webCommandMetadata": {
        //                 "url": "/watch?v=" + video_id, // required; string
        //                 "webPageType": "WEB_PAGE_TYPE_WATCH", // required; string
        //                 "rootVe": 3832 // required; number
        //               }
        //             },
        //             "watchEndpoint": {
        //               "videoId": video_id,
        //               "nofollow": true, // optional; boolean
        //               "watchEndpointSupportedOnesieConfig": { // optional; object
        //                 "html5PlaybackOnesieConfig": {
        //                 }
        //               }
        //             }
        //           },
        //           "form": {
        //             "tempData": {}, // required; object
        //             "reload": false // required; boolean
        //           }
        //         }


        //       }






        //     }


        //   }


        // }

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
              valid = false;
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
            pageType = document.querySelector('ytd-page-manager#page-manager.style-scope.ytd-app');
            if (pageType) {
              pageType = (pageType.data || 0).page;
            }
          }
          if (pageType !== "watch") endpoint = null;

        }

        let btn = null;
        if (endpoint) {

          btn = document.querySelector('.tabview-normal-player #movie_player button.ytp-miniplayer-button.ytp-button');

          if (!btn) endpoint = null;

        }

        // if (!endpoint){

        //   console.log(1234, arguments.length)
        //   if(arguments.length!==1){
        //     return handleNavigate.apply($this, $arguments);
        //   }
        //   const jReq = new Proxy( deepClone(req), {
        //     get(target, prop){
        //       console.log('ssx -get', prop)
        //       return target[prop]
        //     },
        //     set(target, prop, value){
        //       console.log('ssx -set', prop, value)
        //       target[prop]=value;
        //       return true;
        //     }
        //   })

        // return handleNavigate.call($this, jReq)

        // } 

        if (!endpoint) return handleNavigate.apply($this, $arguments);

        // console.log('tabview-script-handleNavigate')

        let ytdApp = document.querySelector('ytd-app');

        let object = null;
        try {
          object = ytdApp.data.response.currentVideoEndpoint.watchEndpoint || null;
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

    })(ytdApp.handleNavigate);

    ytdApp.handleNavigate.__ma355__ = 1;

  })


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
        let func = handleDOMAppearFN.get(evt.animationName);
        if (func) func(evt);
      }, capturePassive)
    } else {
      if (handleDOMAppearFN.has(fn)) return;
    }
    handleDOMAppearFN.set(fn, func);
  }


  function detachedFunc(elm, f) {

    if (!elm.detacheds) {
      elm.detacheds = []
      if (typeof elm.detached !== 'function') console.warn('elm.detached is not a function.')
      elm._detached_original = elm.detached
      elm.detached = function () {
        let ret = this._detached_original();
        try {
          for (const s of this.detacheds) s(this);
        } catch (e) {
          console.warn(e)
        }
        return ret;
      }
    }
    elm.detacheds.push(f)

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
        let shelf = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy')
        let currentVisibile = shelf && shelf.isAttached === true && !shelf.classList.contains('tyt-hidden') && !shelf.hasAttribute('hidden')
        let tytAttr = ytdFlexyElm.hasAttribute('tyt-donation-shelf')
        if (currentVisibile) {
          if (shelf.isCollapsed === true) shelf.isCollapsed = false // for shelf content
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
    toggleVisibility(br) {

      let shelf = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy');
      if (!shelf || shelf.hasAttribute('hidden') || !br) return;
      if (!br.data || typeof br.notifyPath !== 'function') {
        console.warn('unknown error found in dsMgr.toggleVisibility()');
        return;
      }
      if (!shelf.classList.contains('tyt-hidden')) {
        shelf.classList.add('tyt-hidden'); // note: the content will be still updating with tyt-hidden => dataChanged
        br.data.style = 'STYLE_DEFAULT';
      } else {
        shelf.classList.remove('tyt-hidden');
        br.data.style = 'STYLE_BLUE_TEXT';
      }
      if (!br.overrides || br.overrides.style) br.overrides = {}
      br.notifyPath('data.style')
      if (!br.overrides || br.overrides.style) br.overrides = {}
    },
    onButtonAppended(br) {
      if (!br) return;
      if (!br.overrides || br.overrides.style) br.overrides = {}
      br.id = 'tyt-donation-shelf-toggle-btn'
      br.removeEventListener('click', dsMgr.shelfBtnClickHanlder, false)
      br.addEventListener('click', dsMgr.shelfBtnClickHanlder, false)
      if (!br.overrides || br.overrides.style) br.overrides = {}
      dsMgr.onVisibilityChanged();
    },
    onDSAppended(donationShelf) {
      if (!donationShelf) return;

      let buttons = document.querySelector('div#buttons.ytd-masthead');
      if (buttons) {
        dsMgr.createToggleBtn();
      }

    },
    shelfBtnClickHanlder(evt) {
      let br = this
      dsMgr.toggleVisibility(br);
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
      let donationShelf = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (!donationShelf) return;

      if ((donationShelf.detacheds || 0).swVq2 !== 1) {
        detachedFunc(donationShelf, (s) => {
          Promise.resolve(s).then((s) => {
            if (s.isAttached === true) return;
            dsMgr._dsToggleButtonRenderer.i8KBd = 1;
            dsMgr._lastDSVideo = null;
            // if (s && typeof s.removeAttribute === 'function') s.removeAttribute('swVq2');
            dsMgr.removeToggleBtn();
            dsMgr.onVisibilityChanged();
          })
        });
        (donationShelf.detacheds || 0).swVq2 = 1;
      }

      /** @type {object[]} */
      let masthead = document.querySelector('ytd-masthead#masthead')
      if (!masthead) return;

      let mastheadData = masthead.data
      if (!mastheadData) return;

      let topbarButtons = mastheadData.topbarButtons
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

      let arr = topbarButtons
      let dBtn = false
      for (const s of arr) {
        if (dsMgr.checkS(s)) {
          dBtn = s;
          break;
        }
      }

      const toggleActive = donationShelf.classList.contains('tyt-hidden') === false

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
      }

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
        masthead.notifyPath("data.topbarButtons");
      } else {
        let br = document.querySelector('#tyt-donation-shelf-toggle-btn');
        if (br) {
          if (!br.overrides || br.overrides.style) br.overrides = {};
          let data = br.data;
          data.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
          br.notifyPath('data.style');
        } else {
          dsMgr._dsToggleButtonRenderer.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
          masthead.notifyPath("data.topbarButtons");
        }

      }

      dBtn = null

      dsMgr.onVisibilityChanged();

    },
    removeToggleBtn(evt) {

      let donationShelf = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (donationShelf && donationShelf.isAttached === true) return;


      // console.log(4455)
      // if(!document.querySelector('#tyt-donation-shelf-toggle-btn')) return;

      /** @type {object[]} */
      let masthead = document.querySelector('ytd-masthead#masthead')
      if (!masthead) return;

      let mastheadData = masthead.data
      if (!mastheadData) return;

      let topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;



      let arr = topbarButtons

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
        masthead.notifyPath("data.topbarButtons")
      }

      // console.log(552)

    },
    setVisibility(evt) {
      let detail = (evt || 0).detail || 0
      if (typeof detail.visibility !== 'boolean') return;

      let donationShelf = document.querySelector('ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
      if (!donationShelf) return;

      if ((donationShelf.detacheds || 0).swVq2 !== 1) {
        return;
      }

      /** @type {object[]} */
      let masthead = document.querySelector('ytd-masthead#masthead')
      if (!masthead) return;

      let mastheadData = masthead.data
      if (!mastheadData) return;

      let topbarButtons = mastheadData.topbarButtons
      if (!topbarButtons) return;

      if (!document.querySelector(`iron-iconset-svg[name="yt-icons"] [id="${DONATION_HANDS_id}"]`)) {
        return;
      }

      let arr = topbarButtons
      let dBtn = false
      for (const s of arr) {
        if (dsMgr.checkS(s)) {
          dBtn = s;
          break;
        }
      }

      if (dBtn === false) {
        // if the page is switched; the topbarButtons will be updated before the donation shelf is removed.
        // if(donationShelf.isAttached === false) donationShelf.classList.remove('tyt-hidden');
        // dsMgr._dsToggleButtonRenderer = {};
        // dsMgr.onVisibilityChanged();
        return;
      }

      if (!dsMgr._dsToggleButtonRenderer || !dsMgr._dsToggleButtonRenderer.icon) return;


      const toggleActive = detail.visibility === true
      const currentHidden = donationShelf.classList.contains('tyt-hidden')
      if (currentHidden === true && toggleActive === true) {
        donationShelf.classList.remove('tyt-hidden');
      } else if (currentHidden === false && toggleActive === false) {
        donationShelf.classList.add('tyt-hidden');
      }

      let flushDOM = detail.flushDOM === true

      let br = document.querySelector('#tyt-donation-shelf-toggle-btn');
      if (br) {
        if (!br.overrides || br.overrides.style) br.overrides = {};
        let data = br.data;
        data.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
        br.notifyPath('data.style');
      } else {
        dsMgr._dsToggleButtonRenderer.style = toggleActive ? "STYLE_BLUE_TEXT" : "STYLE_DEFAULT";
        flushDOM = true;
      }
      if (flushDOM) {
        dsMgr._dsToggleButtonRenderer = Object.assign({}, dsMgr._dsToggleButtonRenderer);
        masthead.notifyPath("data.topbarButtons");
      }
      // console.log(33435, dsMgr._dsToggleButtonRenderer.style)

      dBtn = null

      dsMgr.onVisibilityChanged();

    },
    async triggerDOMAppearWhenDataChanged(ds) {

      await Promise.resolve(0);
      let videoId = ((ds || 0).data || 0).videoId || 0;
      if (!videoId) return;
      let lastDSVideo = dsMgr._lastDSVideo;
      if (lastDSVideo === videoId) {
        return;
      }
      dsMgr._lastDSVideo = videoId;
      if (typeof videoId === 'string') {
        // note: this will not work for video with donation section -> switching to normal video -> switching back to this.
        ds.disconnectedCallback(); // native bug - switch between two campaign videos -> donation money flashing
        dsMgr._dsToggleButtonRenderer.i8KBd = 1;
        ds.classList.remove('tyt-hidden');
        HTMLElement.prototype.removeAttribute.call(ds, 'swVq2');
        await Promise.resolve(0);
        ds.connectedCallback();

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
      const br = closestYTDButton(path)
      if (!br) return;
      dsMgr.onButtonAppended(br);
    },
    caHandler2(evt) {
      // html[tabview-unwrapjs="1"] ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty):not([swVq2="1"])
      const target = (evt || 0).target || 0;
      if (target.nodeType !== 1) return;
      dsMgr._lastDSVideo = (((target || 0).data || 0).videoId || 0); // avoid double calling triggerDOMAppearWhenDataChanged
      HTMLElement.prototype.setAttribute.call(target, 'swVq2', '1')
      dsMgr.onDSAppended(target);
      if (typeof target.dataChangedM !== 'function' && typeof target.dataChanged === 'function') {
        target.dataChangedM = target.dataChanged
        if (typeof target.updateStylesM !== 'function' && typeof target.updateStyles === 'function') {
          target.updateStylesM = target.updateStyles
          target.updateStyles = function (c) {
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
        target.dataChanged = function () {
          dsMgr.triggerDOMAppearWhenDataChanged(this);
          return this.dataChangedM();
        }
      }
    }

  }

  dsMgr._lastDSVideo = null
  dsMgr._dsToggleButtonRenderer = {}
  handleDOMAppear('swVq1DOMAppended', dsMgr.caHandler1)
  handleDOMAppear('swVq2DOMAppended', dsMgr.caHandler2)
  document.addEventListener('tabview-donation-shelf-set-visibility', dsMgr.setVisibility, false)


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

  document.addEventListener('tabview-playlist-data-re-assign', (evt) => {
    let target = evt.target;
    if (!target) return;
    let data = target.data;
    if (data) {
      target.data = Object.assign({}, data); // the playlist appended to tab container might lose its reorder control. 
    }
  }, true);

  document.addEventListener("tabview-fix-live-chat-toggle-btn", () => {
    fixLiveChatToggleButton();
  })

  document.addEventListener('tabview-force-chat-render', () => {

    let elm;
    elm = elm || document.querySelector('ytd-live-chat-frame');
    elm && elm.__forceChatRender__ && elm.__forceChatRender__();
    elm = null;
  })

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

          console.debug('FIX_UNCERTAIN_HISTORY_STATE 02')
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
          console.debug('FIX_UNCERTAIN_HISTORY_STATE 01')

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
    document.dispatchEvent(new CustomEvent("tabview-plugin-loaded"))
  }


  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();