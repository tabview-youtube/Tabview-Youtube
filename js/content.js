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

  // const elementQS = fxAPI(Element.prototype, 'querySelector');
  // const elementQSA = fxAPI(Element.prototype, 'querySelectorAll');
  const elementNextSibling = fxOperator(Element.prototype, 'nextElementSibling');
  // const elementPrevSibling = fxOperator(Element.prototype, 'previousElementSibling');


  /** @type {PromiseConstructor} */
  const Promise = __Promise__; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const { requestAnimationFrame } = __CONTEXT__;

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
  const REPLACE_PIN_ICON = true; /* Some browsers still using the old yt-icon for pin */
  const FIX_UNCERTAIN_HISTORY_STATE = true;

  let _isPageFirstLoaded = true

  async function makeTytLock() {
    let c = 8;
    while (!document.documentElement) {
      if (--c === 0) return
      await new Promise(requestAnimationFrame)
    }
    if (_isPageFirstLoaded) document.documentElement.setAttribute('tyt-lock', '')
  }
  if (location.pathname === '/watch') makeTytLock()
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

  const nullFunc = function () { };


  const iframeCSS = (() => {

    return `
  
  body #input-panel.yt-live-chat-renderer::after {
      background: transparent;
  }
  
  .style-scope.yt-live-chat-item-list-renderer {
      box-sizing: border-box;
  }
  
  #item.style-scope.yt-live-chat-item-list-renderer,
  #item-scroller.style-scope.yt-live-chat-item-list-renderer {
      transition-delay: 42ms;
  }
  
  yt-live-chat-item-list-renderer img[alt] {
      pointer-events: auto;
  }
  
  body yt-live-chat-item-list-renderer img[alt]~tp-yt-paper-tooltip,
  body yt-live-chat-item-list-renderer #image~tp-yt-paper-tooltip {
      --paper-tooltip-delay-in: 120ms !important;
      white-space: nowrap;
  }
  
  @supports (contain: layout paint style) {

    img.style-scope.yt-img-shadow[width][height] {
        contain: size layout paint style;
    }

    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label],
    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label] > #container {
        contain: layout paint style;
    }

    yt-img-shadow#author-photo.style-scope {
        contain: layout paint style;
    }

    #items.yt-live-chat-item-list-renderer > .style-scope.yt-live-chat-item-list-renderer {
        contain: layout style;
    }

    tp-yt-paper-tooltip[style*="inset"][role="tooltip"] {
        contain: layout paint style;
    }

     
    /* YouTube Native Bug - style="height:0px; translateY(0px);" */
    yt-live-chat-banner-renderer[collapsed]:has(#contents[style*="0px;"][style*="translateY(0px);"]) #header.yt-live-chat-banner-renderer{
      position:absolute;
    }

    yt-live-chat-banner-renderer[collapsed]:has(#contents[style*="0px;"][style*="translateY(0px);"]) #contents.yt-live-chat-banner-renderer{
      height:auto !important;
      transform:initial !important;
    }

  }
  
  #chat-messages tp-yt-iron-dropdown#dropdown.style-scope.tp-yt-paper-menu-button {
      margin-right: var(--ytd-margin-12x);
  }

  tp-yt-iron-dropdown.yt-live-chat-app[vertical-align="top"] ytd-menu-popup-renderer.yt-live-chat-app {
    max-height: 60vh !important; /* override style */
  }


  html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer:not(:empty) {
      --yt-live-chat-action-panel-top-border: none;
  }

  html #panel-pages.yt-live-chat-renderer > #input-panel.yt-live-chat-renderer.iron-selected > *:first-child {
      border-top: 1px solid var(--yt-live-chat-panel-pages-border-color);
  }

  html #panel-pages.yt-live-chat-renderer {
      border-top: 0;
      border-bottom: 0;
  }

  #input-panel #picker-buttons yt-live-chat-icon-toggle-button-renderer#product-picker {
    overflow: hidden;
    contain: layout paint style;
  }

    `.trim();
  });

  let scriptEnable = false;

  let comments_loader = 0; // for comment count (might omit)

  let cmTime = 0;
  const mTime = Date.now() - 152000000;

  //let lastScrollFetch = 0;
  //let lastOffsetTop = 0;
  let mtf_forceCheckLiveVideo_disable = 0;

  let tabsUiScript_setclick = false;
  let pageFetchedData = null; // data object; for future use
  let pageFetchedDataVideoId = null; // integer; for comment checking
  let pageType = null; // pageType = 'watch', 'browse', 'playlist', ...
  let chatroomDetails = null;
  let switchTabActivity_lastTab = null

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
  }

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


  const S_GENERAL_RENDERERS = ['YTD-TOGGLE-BUTTON-RENDERER', 'YTD-MENU-RENDERER']

  let globalHook_symbols = [];
  let globalHook_hashs = {};


  let singleColumnScrolling_dt = 0;

  let isStickyHeaderEnabled = false;
  let isMiniviewForStickyHeadEnabled = false;

  let theater_mode_changed_dt = 0;
  let detailsTriggerReset = false;


  let isMakeHeaderFloatCalled = false;

  let _viTimeNum = 200;
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
  const querySelectorFromAnchor = HTMLElement.prototype.querySelector; // nodeType==1 // since 2022/07/12

  /** @type { (str: string) => (NodeList) } */
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll; // nodeType==1 // since 2022/07/12
  const closestDOM = HTMLElement.prototype.closest;
  //const elementRemove = HTMLElement.prototype.remove;
  //const elementContains = HTMLElement.prototype.contains; // since 2022/07/12
  const elementAppend = HTMLElement.prototype.appendChild; // necessary for yt custom elements; due to Waterfox classic and https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/174437

  const closestDOMX = function (child, parentSelector) {
    if (!(child instanceof HTMLElement)) return null;
    return closestDOM.call(child, parentSelector) || null;
  }

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


  function setTimeout3(f) {
    Promise.race([new Promise(r => requestAnimationFrame(r)), new Promise(r => setTimeout(r, 300))]).then(f);
  }

  const timeline = {
    // after initialized (initObserver)
    cn1: new Set(),
    cn2: new Set(),
    setTimeout( /** @type {TimerHandler} */ f,/** @type {number} */ d) {
      let cid = setTimeout(f, d);
      timeline.cn1.add(cid);
      return cid;
    },
    clearTimeout(/** @type {number} */ cid) {
      cid = +cid;
      timeline.cn1.remove(cid);
      return clearTimeout(cid);
    },
    setInterval(/** @type {TimerHandler} */ f,/** @type {number} */ d) {
      let cid = setInterval(f, d);
      timeline.cn2.add(cid);
      return cid;
    },
    clearInterval(/** @type {number} */ cid) {
      cid = +cid;
      timeline.cn2.remove(cid);
      return clearInterval(cid);
    },
    reset() {
      timeline.cn1.forEach(clearTimeout);
      timeline.cn2.forEach(clearInterval);
      timeline.cn1.clear();
      timeline.cn2.clear();
    }
  }


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

  function addStyle(/** @type {string} */ styleText, /** @type {HTMLElement | Document} */ container) {
    const styleNode = document.createElement('style');
    //styleNode.type = 'text/css';
    styleNode.textContent = styleText;
    (container || document.documentElement).appendChild(styleNode);
    return styleNode;
  }



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


  _console.log(38489)

  class Session {
    constructor(initValue) {
      this.sid = initValue;
    }
    session() {
      let pageSession = this;
      let s = pageSession.sid; // inaccessible from external
      return {
        get isValid() {
          return s === pageSession.sid;
        }
      };
    }
    set(newValue) {
      this.sid = newValue;
    }
    inc() {
      this.sid++;
    }
  }

  class Deferred {
    constructor() {
      this.reset();
    }
    debounce(f) {
      return Promise.race([this.promise]).then(f).catch(console.warn); // avoid promise.then.then.then ...
    }
    d() {
      return Promise.race([this.promise]).catch(console.warn);
    }
    reset() {
      this.resolved = false;
      this.promise = new Promise((resolve, reject) => {
        //this.reject = reject
        this._resolve = resolve
      })
    }
    resolve() {
      if (this._resolve === null) return null;
      if (this.resolved !== false) return false;
      this.resolved = true;
      this._resolve(...arguments);
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



  let pageSession = new Session(0);
  const tabsDeferred = new Deferred();
  tabsDeferred.resolve();

  let layoutStatusMutex = new Mutex();

  let sliderMutex = new Mutex();
  const renderDeferred = new Deferred(); //pageRendered
  let pageRendered = 0;
  let renderIdentifier = 0;

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

  function tabviewDispatchEvent(elmTarget, eventName, detail) {
    if (!elmTarget || typeof elmTarget.nodeType !== 'number' || typeof eventName !== 'string') return;
    if (detail && typeof detail === 'object') {
      elmTarget.dispatchEvent(new CustomEvent(eventName, { detail: detail }))
    } else {
      elmTarget.dispatchEvent(new CustomEvent(eventName))
    }
  }

  // removed in 2023.06.17
  // FireFox (Some UserScript Managers): Uncaught Error: Permission denied to access property "length" (event.detail as Object)
  // async function nativeCall(/** @type {EventTarget} */ dom, /** @type {any[]} */ detail) {
  //   //console.log(1231)
  //   dom.dispatchEvent(new CustomEvent("userscript-call-dom", { detail: detail }))
  //   //console.log(1232)
  // }

  // removed in 2023.06.17
  // async function nativeFunc(/** @type {EventTarget} */ dom, /** @type {string} */ property, /** @type {any} */ args) {
  //   dom.dispatchEvent(new CustomEvent("userscript-call-dom-func", { detail: { property, args } }))
  // }

  // async function nativeValue(dom, property, args) {
  //   dom.dispatchEvent(new CustomEvent("userscript-call-dom-value", { detail: { property, args } }))
  // }
  // async function nativeFuncStacked(/** @type {string} */ selector, /** @type {string} */ property, /** @type {any} */ args){
  //   document.dispatchEvent(new CustomEvent("userscript-call-dom-func-stacked", { detail: { selector, property, args } }))
  // }
  // async function nativeValueStacked(selector, property, args){
  //   document.dispatchEvent(new CustomEvent("userscript-call-dom-value-stacked", { detail: { selector, property, args } }))
  // }
  // async function nativeConstStacked(selector, property, args){
  //   document.dispatchEvent(new CustomEvent("userscript-call-dom-const-stacked", { detail: { selector, property, args } }))
  // }

  async function dispatchWindowResize() {
    // for youtube to detect layout resize for adjusting Player tools
    return window.dispatchEvent(new Event('resize'));
  }

  async function dispatchCommentRowResize() {

    if (pageType !== "watch") return;

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;
    if (ytdFlexyElm.getAttribute('tyt-tab') !== '#tab-comments') return;

    scriptletDeferred.debounce(() => {
      document.dispatchEvent(new CustomEvent('tabview-resize-comments-rows'));
    })


  }

  function enterPIP(video, errorHandler) {
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

    if (chatroomDetails) {
      _console.log(124234, 'c=== ')

      let chat = document.querySelector('ytd-live-chat-frame#chat');
      if (!chat) return;
      let txt = querySelectorFromAnchor.call(chat, 'span.yt-core-attributed-string[role="text"]');
      let c = (txt || 0).textContent;

      if (typeof c === 'string' && c.length > 2) {
        if (chat.hasAttribute('collapsed')) {
          _console.log(124234, 'collapsed show expand ', chatroomDetails.txt_expand)
          if (c !== chatroomDetails.txt_expand) {
            txt.textContent = chatroomDetails.txt_expand;
          }
        } else {
          _console.log(124234, 'not collapsed show collapse ', chatroomDetails.txt_collapse)
          if (c !== chatroomDetails.txt_collapse) {
            txt.textContent = chatroomDetails.txt_collapse;
          }
        }
      }
    }
  }


  function handlerTabExpanderClick() {

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

          let secondaryInner = querySelectorFromAnchor.call(secondary, '#secondary-inner.ytd-watch-flexy');

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

              let video = document.querySelector('#player video');
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

      let secondaryInner = querySelectorFromAnchor.call(secondary, '#secondary-inner.ytd-watch-flexy')

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

      setTimeout(() => {
        updateFloatingSlider()
      }, 30);

    }, false);

  }

  function addTabExpander(tabContent) {

    if (!tabContent) return null;
    let id = tabContent.id;
    if (!id || typeof id !== 'string') return null;

    if (querySelectorFromAnchor.call(tabContent, `#${id} > tabview-view-tab-expander`)) return false;

    let elm = document.createElement('tabview-view-tab-expander')
    prependTo(elm, tabContent);
    elm.innerHTML = `<div>${svgElm(16, 16, 12, 12, svgDiag1, 'svg-expand')}${svgElm(16, 16, 12, 12, svgDiag2, 'svg-collapse')}</div>`
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

    await new Promise(r => setTimeout(r, 30)); // time allowed for dom changes and value change of enableHoverSliderDetection    

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

        timeline.setTimeout(unlock, 40);

      })
    }

    function hideTabAndChat() {

      layoutStatusMutex.lockWith(unlock => {

        if (new_isTabExpanded) switchTabActivity(null)
        if (new_isExpandedChat) ytBtnCollapseChat()
        if (new_isExpandedEPanel) ytBtnCloseEngagementPanels();
        if (new_isExpandedDonationShelf) closeDonationShelf();


        timeline.setTimeout(unlock, 40);

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

    _console.log(8221, 1, chat_collapsed_changed, chat_expanded_changed, tab_expanded_changed, theater_mode_changed, column_mode_changed, fullscreen_mode_changed, epanel_expanded_changed)


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

    if (new_isFullScreen) {


      if (tab_change == LAYOUT_CHATROOM_EXPANDED && (new_layoutStatus & IF_06a) === IF_06b && statusCollapsedFalse && !column_mode_changed) {

        // two column; tab expand; chat expand; 

        switchTabActivity(null);

      }

      if (!!(tab_change & LAYOUT_CHATROOM_EXPANDED) && new_isExpandedChat) {
        //tab_change = LAYOUT_CHATROOM_EXPANDED
        //tab_change = LAYOUT_CHATROOM_EXPANDED|LAYOUT_TAB_EXPANDED


        timeline.setTimeout(() => {
          let scrollElement = document.querySelector('ytd-app[scrolling]')
          if (!scrollElement) return;
          // single column view; click button; scroll to tab content area 100%
          let chatFrame = document.querySelector('ytd-live-chat-frame#chat');
          if (chatFrame && isChatExpand()) {
            _console.log(7290, 1)
            chatFrame.scrollIntoView(true);
          }
        }, 60)

      }

      if (!!(tab_change & LAYOUT_ENGAGEMENT_PANEL_EXPANDED) && new_isExpandedEPanel) {

        timeline.setTimeout(() => {
          let scrollElement = document.querySelector('ytd-app[scrolling]')
          if (!scrollElement) return;
          // single column view; click button; scroll to tab content area 100%
          let epPanel = document.querySelector('ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])');
          if (epPanel) {
            _console.log(7290, 2)

            let pi = 50;
            let cid = setInterval(() => {
              if (--pi) epPanel.scrollIntoView(true); else clearInterval(cid)
            }, 17)
            //
          }
        }, 60)

      }


    } else if (fullscreen_mode_changed) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: true


      if (!new_isFullScreen && statusCollapsedTrue && isWideScreenWithTwoColumns() && !isTheater()) {

        showTabOrChat();
      } else if (!new_isFullScreen && statusCollapsedFalse && isWideScreenWithTwoColumns() && isTheater()) {


        if (cisChatPopupedF()) {
        } else {

          ytBtnCancelTheater();

        }
      }

    } else if ((new_layoutStatus & IF_01a) === IF_01b && !column_mode_changed && (tab_change == LAYOUT_CHATROOM_EXPANDED || tab_change == LAYOUT_ENGAGEMENT_PANEL_EXPANDED)) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater; tab collapse; chat expand; ep expand

      if (epanel_expanded_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCollapseChat();
          setTimeout(unlock, 13)
        })
      } else if (chat_collapsed_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCloseEngagementPanels();
          setTimeout(unlock, 13)
        })

      }

    } else if ((new_layoutStatus & IF_07a) === IF_07b && !column_mode_changed && (tab_change == LAYOUT_CHATROOM_EXPANDED || tab_change == LAYOUT_DONATION_SHELF_EXPANDED)) {

      // new_isFullScreen: false
      // fullscreen_mode_changed: false

      // two column; not theater; tab collapse; chat expand; ds expand

      if (ds_expanded_changed) {
        layoutStatusMutex.lockWith(unlock => {
          ytBtnCollapseChat();
          setTimeout(unlock, 13)
        })
      } else if (chat_collapsed_changed) {
        layoutStatusMutex.lockWith(unlock => {
          closeDonationShelf();
          setTimeout(unlock, 13)
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
        timeline.setTimeout(unlock, 40);
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

    let secondary = null;
    if (secondary = document.querySelector('.tabview-hover-slider-enable')) {
      secondary.dispatchEvent(new CustomEvent('tabview-hover-slider-restore'))
      //console.log(1996)
    }


    if (fullscreen_mode_changed) {
      detailsTriggerReset = true;
      setTimeout(() => {
        setHiddenStateForDesc();
      }, 80);
    }

    // resize => is-two-columns_
    if (column_mode_changed) {

      Promise.resolve(0).then(() => {

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
            timeline.setTimeout(unlock, 40);
          });
        }

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
        setTimeout3(() => {
          singleColumnScrolling(true); //initalize sticky
        });
      })
    }

    if (enableLivePopupCheck === true) {

      const new_isTwoColumnsTheater = fT(new_layoutStatus, LAYOUT_TWO_COLUMNS | LAYOUT_THEATER, 0)

      let currentIsTheaterPopupChat = new_isTwoColumnsTheater && new_isExpandedChat && isChatPopupedF()
      if (!currentIsTheaterPopupChat) {
        enableLivePopupCheck = false
        document.dispatchEvent(new CustomEvent("tyt-close-popup"))
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
                timeline.setTimeout(unlock, 40)
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
      scriptletDeferred.debounce(() => {
        document.dispatchEvent(new CustomEvent('tyt-engagement-panel-visibility-change', {
          detail: actions
        }))
        actions = null
      })
    }

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
        querySelectorFromAnchor.call(button, 'div.yt-spec-touch-feedback-shape') ||
        querySelectorFromAnchor.call(button, 'ytd-toggle-button-renderer');
      if (button) button.click();
    }
  }

  function ytBtnCollapseChat() {
    let button = document.querySelector('ytd-live-chat-frame#chat:not([collapsed]) > .ytd-live-chat-frame#show-hide-button')
    if (button) {
      button =
        querySelectorFromAnchor.call(button, 'div.yt-spec-touch-feedback-shape') ||
        querySelectorFromAnchor.call(button, 'ytd-toggle-button-renderer');
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

    _console.log(9333)
    if (!sVideosITO) {

      sVideosITO = new IntersectionObserver((entries) => {

        if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === LAYOUT_TWO_COLUMNS) return;

        _console.log(9334, entries)
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

          setTimeout(resolve, 30); // delay required to allow YouTube generate the continuation elements


        }).then(() => {

          let res = setVideosTwoColumns(2 | 4, true)

          _console.log(9335, res)

          if (res.m2 && res.m3) {
            let m4 = closestDOM.call(res.m2, 'ytd-continuation-item-renderer');
            let m5, m6;

            _console.log(9336, m4)
            if (m4) {
              m5 = querySelectorFromAnchor.call(m4, 'ytd-button-renderer.style-scope.ytd-continuation-item-renderer, yt-button-renderer.style-scope.ytd-continuation-item-renderer');

              // YouTube coding bug - correct is 'ytd-button-renderer'. If the page is redirected under single column mode, the tag become 'yt-button-renderer'
              // under 'yt-button-renderer', the 

              if (m5)
                m6 = querySelectorFromAnchor.call(m5, 'button.yt-spec-button-shape-next--call-to-action'); // main

              _console.log(9337, m4, m5, m6)

              if (m6) {
                m6.click() // generic solution
              } else if (m5) {
                m5.click(); // not sure
              } else {
                m4.dispatchEvent(new Event('yt-service-request-sent-button-renderer')); // only for correct YouTube coding
              }
            }
            m4 = null;
            m5 = null;
            m6 = null;
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

    if (!scriptEnable) return;

    let queryElement = document.querySelector('*:not(#tab-videos) > #related.ytd-watch-flexy > ytd-watch-next-secondary-results-renderer');

    let isRelocated = !!queryElement;

    if (isRelocated) {

      _console.log(3202, 2)

      let relatedElm = closestDOM.call(queryElement, '#related.ytd-watch-flexy'); // NOT NULL

      let right_tabs = document.querySelector('#right-tabs'); // can be NULL

      let tab_videos = right_tabs ? querySelectorFromAnchor.call(right_tabs, "#tab-videos") : null; // can be NULL

      if (tab_videos !== null) {

        _console.log(3202, 4)

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

    let chatroom = null;
    if (chatroom = document.querySelector('ytd-live-chat-frame#chat')) {

      const container = chatroom.parentNode.id === 'chat-container' ? chatroom.parentNode : chatroom;

      let pHolderElm = document.querySelector('tabview-view-pholder[data-positioner="before|#chat"]');

      if (!pHolderElm || pHolderElm.nextElementSibling !== container) {

        if (pHolderElm) pHolderElm.remove();

        if (document.querySelector('.YouTubeLiveFilledUpView')) {
          // no relocation
        } else {

          let rightTabs = document.querySelector('#right-tabs');
          if (rightTabs) {
            insertBeforeTo(container, rightTabs);
          }

        }

        if (!pHolderElm) {
          pHolderElm = document.createElement('tabview-view-pholder');
          pHolderElm.setAttribute('data-positioner', 'before|#chat');
        }

        insertBeforeTo(pHolderElm, container)
      }

    }

  }


  async function isDocumentInFullScreenMode() {
    return document.fullscreenElement !== null;
  }
  async function energizedByVideoTimeUpdate() {

    const isFullscreen = await isDocumentInFullScreenMode();
    if (isFullscreen) return;

    // force browser to load the videostream during playing (primarily for music videos)
    // both background and foreground

    _updateTimeAccum++;

    if ((_updateTimeAccum + _viTimeNum) % 11 === 0) {
      // console.log(document.querySelector('video').currentTime) // 2.55, 2.64, 3.12, ...
      // about 2.66s

      if (_viTimeNum > 211) {
        // around 30.9s ~ 31.9s
        _viTimeNum = 200;
        _updateTimeAccum = (_updateTimeAccum % 8) + 1; // reset to 1 ~ 8
        postMessage({ tabviewEnergized: true }, 'https://www.youtube.com'); // post message to make alive
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

    /** @type {HTMLElement} */
    let searchBox, autoComplete;
    searchBox = this;
    this.removeEventListener('autocomplete-sc-exist', handlerAutoCompleteExist, false)
    let domId = this.getAttribute('data-autocomplete-results-id')

    autoComplete = document.querySelector(`[data-autocomplete-input-id="${domId}"]`)

    if (!domId || !searchBox) return;

    let positioner = nodeNextSibling(searchBox);
    if (positioner) {
      if (positioner.nodeName.toLowerCase() !== "tabview-view-autocomplete-pos") {
        positioner = autoCompletePosCreate();
        insertAfterTo(positioner, searchBox);
      }
    } else {
      positioner = autoCompletePosCreate();
      prependTo(positioner, nodeParent(searchBox));
    }
    prependTo(autoComplete, positioner);

    setupSearchBox(searchBox, positioner);


  }

  async function setupSearchBox(searchBox, positioner) {

    let mb = getComputedStyle(searchBox).marginBottom
    let h = searchBox.offsetHeight + 'px'

    positioner.style.setProperty('--tyt-swwv-searchbox-mb', mb)
    positioner.style.setProperty('--tyt-swwv-searchbox-h', h)

    mtf_autocomplete_search()

  }

  function mtf_autocomplete_search() {
    // Youtube - Search While Watching Video

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    const autocomplete = querySelectorFromAnchor.call(ytdFlexyElm, '[placeholder-for-youtube-play-next-queue] input#suggestions-search + tabview-view-autocomplete-pos > .autocomplete-suggestions[data-autocomplete-input-id]:not([position-fixed-by-tabview-youtube])')

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
          let rafID = 0;
          searchBox.addEventListener('keydown', function (evt) {
            //cancelClickToggle = true;
            switch (evt.code) {
              case 'ArrowUp':
              case 'ArrowDown':

                let t = Date.now();
                if (rafID === 0) {
                  rafID = requestAnimationFrame(() => {
                    rafID = 0;
                    let d = Date.now();
                    if (d - t > 300) return;

                    const autocomplete = kRef(rAutoComplete);

                    let selected = querySelectorFromAnchor.call(autocomplete, '.autocomplete-suggestion.selected');
                    let bool = selected && selected !== cacheScrollIntoView;
                    cacheScrollIntoView = selected;
                    if (bool) {

                      try {
                        selected.scrollIntoView({ block: "nearest", inline: "nearest" });
                      } catch (e) { }

                    }

                  })
                }
              default:
              //
            }


          }, bubblePassive)

          searchBox.addEventListener('tyt-autocomplete-suggestions-change', function (evt) {

            //cancelClickToggle = true;
            if (evt.target !== document.activeElement) return;
            setTimeout(() => {
              const autocomplete = document.querySelector(`.autocomplete-suggestions[data-autocomplete-input-id="${this.getAttribute('data-autocomplete-results-id')}"]`);
              if (!autocomplete) return;
              const isNotEmpty = isContentNotEmpty(this, autocomplete);
              if (isNotEmpty) {
                // dont detect visibility; just set to visible
                setVisible(autocomplete, true);
              }
            }, 20);

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


  // css animation check for element relocation
  function mtf_liveChatBtnF(node) {

    if (!node || node.nodeType !== 1) return;

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    let button = node;

    if (button) {
      prependTo(button, nodeParent(button));
    }


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

    let items = querySelectorFromAnchor.call(playlist, "*:not(#tabview-playlist-wrapper) > ytd-playlist-panel-renderer#playlist:not(.ytd-miniplayer) #items.ytd-playlist-panel-renderer:not(:empty)");

    if (items !== null && playlist.nodeName.toUpperCase() === 'YTD-PLAYLIST-PANEL-RENDERER') {

      let tab_list = document.querySelector("#tab-list");

      if (!tab_list) return;

      let w = getWrapper("tabview-playlist-wrapper");
      let docFrag = new DocumentFragment();
      // avoid immediate reflow for append playlist before append to tab_list
      elementAppend.call(docFrag, w);
      elementAppend.call(w, playlist);
      elementAppend.call(tab_list, docFrag);
      docFrag = null;
      w = null;

    }
  }


  function getCountHText(elm) {
    return `${pageFetchedDataVideoId || 0}...${elm.textContent}`
  }

  // content fix - info & playlist
  // fired at begining, and keep for in case any change
  function mtf_fix_details() {

    if (!scriptEnable) return Promise.resolve(0); // in case

    return Promise.all([
      new Promise(resolve => {


        let contentToggleBtn = document.querySelector('ytd-watch-flexy #tab-info ytd-expander tp-yt-paper-button#less.ytd-expander:not([hidden]), #tab-info ytd-expander tp-yt-paper-button#more.ytd-expander:not([hidden])');

        if (contentToggleBtn) {

          (() => {
            const domElement = contentToggleBtn;
            contentToggleBtn = null;
            // if(!domElement.parentElement) return; // not working in pseudo custom element - parentNode = documentFragment
            const expander = closestDOM.call(domElement, 'ytd-watch-flexy #tab-info ytd-expander')

            if (!expander || expander.nodeType !== 1) return; // checking whether it is still on the page

            if (expander.style.getPropertyValue('--ytd-expander-collapsed-height')) {
              expander.style.setProperty('--ytd-expander-collapsed-height', '')
            }
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
            scriptletDeferred.debounce(() => {
              expander.dispatchEvent(new CustomEvent("tabview-expander-config"));
            })
            //  console.log(23131)

          })();
        }

        resolve();


      }),

      new Promise(resolve => {


        let strcturedInfo = document.querySelector('ytd-watch-flexy #tab-info ytd-structured-description-content-renderer.style-scope.ytd-video-secondary-info-renderer[hidden]')
        if (strcturedInfo) {

          (() => {

            strcturedInfo.removeAttribute('hidden');


            setTimeout(() => {


              let e = closestDOM.call(strcturedInfo, 'ytd-watch-flexy #tab-info ytd-expander');

              if (!e) return;
              let s = querySelectorAllFromAnchor.call(e, '#tab-info .more-button.style-scope.ytd-video-secondary-info-renderer[role="button"]');
              if (s.length === 1) {
                let sp = nodeParent(s[0]);
                if (sp.nodeName.toUpperCase() === 'TP-YT-PAPER-BUTTON') {
                  sp.click();
                }
              }

            }, 300)

          })();
        }


        resolve();

      }),

      new Promise(resolve => {


        // just in case the playlist is collapsed
        let playlist = document.querySelector('#tab-list ytd-playlist-panel-renderer#playlist')
        if (playlist && playlist.matches('[collapsed], [collapsible]')) {

          (() => {

            const domElement = playlist;
            playlist = null;
            // if(!domElement.parentElement || domElement.nodeType!==1) return; // not working in pseudo custom element - parentNode = documentFragment
            const tablist = closestDOM.call(domElement, 'ytd-watch-flexy #tab-list')

            if (!tablist || tablist.nodeType !== 1) return; // checking whether it is still on the page

            if (domElement.hasAttribute('collapsed')) wAttr(domElement, 'collapsed', false);
            if (domElement.hasAttribute('collapsible')) wAttr(domElement, 'collapsible', false);
          })();
        }

        resolve();


      }),

      new Promise(resolve => {


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

        resolve();

      })


    ]);


  }


  const innerCommentsFuncs = [
    // comments
    function () {

      let elm = kRef(this.elm);
      _console.log(2907, 1, !!elm)
      if (!elm) return;

      let span = document.querySelector("span#tyt-cm-count")
      let r = '0';
      let txt = elm.textContent
      if (typeof txt == 'string') {
        let m = txt.match(/[\d\,\.\s]+/)
        if (m) {
          let d = +m[0].replace(/\D+/g, '');
          let ds = d.toLocaleString(document.documentElement.lang);
          let rtxt = txt.replace(ds, '')
          if (rtxt !== txt && !/\d/.test(rtxt)) {
            r = ds;
          }
        }
      }

      if (span) {
        let tab_btn = closestDOM.call(span, '.tab-btn[tyt-tab-content="#tab-comments"]')
        if (tab_btn) tab_btn.setAttribute('loaded-comment', 'normal')
        span.textContent = r;
      }

      setCommentSection(1);
      m_last_count = getCountHText(elm);
      _console.log(2907, 2, m_last_count)
      return true;
    },
    // message
    function () {

      let elm = kRef(this.elm);
      _console.log(2907, 2, !!elm)
      if (!elm) return;

      let span = document.querySelector("span#tyt-cm-count")
      if (span) {
        let tab_btn = closestDOM.call(span, '.tab-btn[tyt-tab-content="#tab-comments"]')
        if (tab_btn) tab_btn.setAttribute('loaded-comment', 'message')
        span.textContent = '\u200B';
      }

      setCommentSection(1);
      m_last_count = getCountHText(elm);
      _console.log(2907, 2, m_last_count)
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

    _console.log(3434, pageType)
    if (pageType !== 'watch') return;


    /** @type {Array<HTMLElement>} */
    let qmElms = [...document.querySelectorAll('ytd-comments#comments #count.ytd-comments-header-renderer, ytd-comments#comments ytd-item-section-renderer.ytd-comments#sections #header ~ #contents > ytd-message-renderer.ytd-item-section-renderer')]


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
        _console.log(2907, diff)
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


    _console.log(2908, res, Q.comments_section_loaded)

    _console.log(696, res.map(e => ({

      text: kRef(e.elm).textContent,
      isNew: e.isNew,
      isLatest: e.isLatest

    })))

    if (requireResultCaching) {
      resultCommentsCountCaching(res);
    }

    return res;

  }

  function restoreFetching() {


    if (mtf_forceCheckLiveVideo_disable === 2) return;


    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;

    _console.log(2901)

    if ((ytdFlexyElm.getAttribute('tyt-comments') || '').indexOf('K') >= 0) return;

    _console.log(2902)

    let visibleComments = querySelectorFromAnchor.call(ytdFlexyElm, 'ytd-comments#comments:not([hidden])')
    if (!visibleComments) return;

    _console.log(2903)


    ytdFlexyElm.setAttribute('tyt-comments', 'Kz');

    const tabBtn = document.querySelector('[tyt-tab-content="#tab-comments"]');
    let span = querySelectorFromAnchor.call(tabBtn, 'span#tyt-cm-count');
    tabBtn.removeAttribute('loaded-comment')
    span.innerHTML = '';

    if (tabBtn) {
      setTabBtnVisible(tabBtn, true);
    }

    _console.log(2905)


  }

  function checkAndMakeNewCommentFetch() {
    if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
      fetchCounts.new.f();
      fetchCounts.fetched = true;
      fetchCommentsFinished();
      _console.log(9972, 'fetched = true')
    }
  }
  function onCommentsReady() {
    if (mtf_forceCheckLiveVideo_disable !== 2) {
      if (document.querySelector(`ytd-comments#comments`).hasAttribute('hidden')) {
        // unavailable but not due to live chat
        _disableComments();
      } else if (Q.comments_section_loaded === 0) {
        getFinalComments();
      }
    }
  }

  const resultCommentsCountCaching = (res) => {
    // update fetchCounts by res
    // indepedent of previous state of fetchCounts
    _console.log(2908, 10, res)
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

    _console.log(3901)

    if (mtoVisibility_Comments.bindElement(comments)) {
      mtoVisibility_Comments.observer.check(9);
    }


  };

  let fixLiveChatToggleButtonDispatchEventRid = 0;
  const fixLiveChatToggleButtonDispatchEvent = () => {

    let tid = ++fixLiveChatToggleButtonDispatchEventRid;
    scriptletDeferred.debounce(() => {
      if (tid === fixLiveChatToggleButtonDispatchEventRid) {
        document.dispatchEvent(new CustomEvent("tabview-fix-live-chat-toggle-btn"));
      }
    });
  }

  let forceChatRenderDispatchEventRid = 0;
  const forceChatRenderDispatchEvent = () => {

    let tid = ++forceChatRenderDispatchEventRid;
    scriptletDeferred.debounce(() => {
      if (tid === forceChatRenderDispatchEventRid) {
        document.dispatchEvent(new CustomEvent("tabview-force-chat-render"));
      }
    });

  }


  const FP = {

    mtf_attrPlaylist: (attrName, newValue) => {
      //attr mutation checker - {ytd-playlist-panel-renderer#playlist} \single
      //::attr ~ hidden    
      //console.log(1210)

      _console.log(21311)
      if (!scriptEnable) return;
      if (pageType !== 'watch') return;
      /** @type {HTMLElement|null} */
      let cssElm = es.ytdFlexy;
      if (!cssElm) return;

      _console.log(21312)

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
          _console.log(9360, 72);
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

        const chatBlock = document.querySelector('ytd-live-chat-frame#chat')
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
          timeline.setTimeout(unlock, 40);
        } else {
          unlock();
        }

        if (isCollapsed) {
          chatBlock.removeAttribute('tyt-iframe-loaded');
          // console.log(922,1)
          // buggy; this section might not be correctly executed.
          // guess no collaspe change but still iframe will distory and reload.
          let btn = document.querySelector('tyt-iframe-popup-btn')
          if (btn) btn.remove();
        } else {
          console.debug('[tyt] forceChatRenderDispatchEvent')
          forceChatRenderDispatchEvent();
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
      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {
        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;
        if (es.storeLastPanel !== found) return
        layoutStatusMutex.lockWith(unlock => {
          if (es.storeLastPanel === found && whenEngagemenetPanelVisible()) {
            timeline.setTimeout(unlock, 40);
          } else {
            unlock();
          }
        })
      })
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


    for (const elem of document.querySelectorAll('ytd-expander[tabview-expander-checked]')) {
      elem.removeAttribute('tabview-expander-checked');
    }

    mtf_chatBlockQ = null;

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
    // yt-watch-comments-ready - omitted
    // [is-two-columns_] attr changed => layout changed

    /** @type {HTMLElement | null} */
    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;

    let comments = querySelectorFromAnchor.call(ytdFlexyElm, '#primary.ytd-watch-flexy ytd-watch-metadata ~ ytd-comments#comments');
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

  function checkPlaylistForInitialization() {
    // if the page url is with playlist; renderer event might not occur.

    // playlist already added to dom; this is to set the visibility event and change hidden status

    let m_playlist = document.querySelector(`#tab-list ytd-playlist-panel-renderer#playlist:not([o3r-${sa_playlist}])`)

    // once per {ytd-playlist-panel-renderer#playlist} detection

    _console.log(3902, !!m_playlist)

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
        if (m_playlist) {
          m_playlist.dispatchEvent(new CustomEvent("tabview-playlist-data-re-assign"));
        }
        m_playlist = null;
      })
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

  }


  const _pageBeingInit = function () {

    pageSession.inc();
    if (pageSession.sid > 9e9) pageSession.sid = 9;

    fetchCounts = {
      base: null,
      new: null,
      fetched: false,
      count: null
    }
    pageFetchedData = null;
    pageFetchedDataVideoId = null;
    chatroomDetails = null;
  }

  const pageBeingInit = function () {

    if (_isPageFirstLoaded && location.pathname === '/watch') document.documentElement.setAttribute('tyt-lock', '')

    // call regardless pageType
    // run once on / before pageSeq2

    let action = 0;
    if (tabsDeferred.resolved) {
      action = 1;
    } else if (renderDeferred.resolved) {
      // in case , rarely, tabsDeferred not yet resolved but animateLoadDeferred resolved
      action = 2;
    }

    renderIdentifier++;
    if (renderIdentifier > 1e9) renderIdentifier = 9;
    renderDeferred.reset();

    if (action === 1) {
      comments_loader = 1;
      tabsDeferred.reset();
      if ((firstLoadStatus & 8) === 0) {
        innerDOMCommentsCountLoader(false); //ensure the previous record is saved
        // no need to cache to the rendering state
        _pageBeingInit();
      } else if ((firstLoadStatus & 2) === 2) {
        firstLoadStatus -= 2;
        script_inject_js1.inject();
      }
      _console.log('pageBeingInit', firstLoadStatus)
    }

    if (pageRendered === 2) {
      pageRendered = 0;
      let elmPL = document.querySelector('tabview-view-ploader');
      if (elmPL) elmPL.remove();
      pageRendered = 0;
    }

    if (!scriptletDeferred.resolved) {
      // just in case, should not happen this.
      // this is to clear the pending queue if scriptlet is not ready.
      scriptletDeferred.reset();
    }

  };

  const advanceFetch = async function () {
    if (pageType === 'watch' && !fetchCounts.new && !fetchCounts.fetched) {
      renderDeferred.resolved && innerDOMCommentsCountLoader(true);
      if (renderDeferred.resolved && !fetchCounts.new) {
        window.dispatchEvent(new Event("scroll"));
      }
    }
  };

  function getFinalComments() {

    if ((comments_loader & 3) === 3) { } else return;
    comments_loader = 0;

    let ei = 0;

    function execute() {
      //sync -> animateLoadDeferred.resolved always true

      if (!renderDeferred.resolved) return;

      _console.log(2323)

      if (Q.comments_section_loaded !== 0) return;
      if (fetchCounts.fetched) return;


      let ret = innerDOMCommentsCountLoader(true);

      if (fetchCounts.new && !fetchCounts.fetched) {
        if (fetchCounts.new.f()) {
          fetchCounts.fetched = true;
          fetchCommentsFinished();
          _console.log(9972, 'fetched = true')
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
            _console.log(9972, 'fetched = true')
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
            _console.log(9979, 'fetched = true')
            fetchCommentsFinished();
          }
          return;
        }
        return true;
      }

    }


    async function alCheckFn(ks) {

      let alCheckCount = 9;
      let alCheckInterval = 420;

      do {

        if (renderIdentifier !== ks) break;
        if (alCheckCount === 0) break;
        if (execute() !== true) break;
        --alCheckCount;

        await new Promise(r => setTimeout(r, alCheckInterval));

      } while (true)

    }
    let ks = renderIdentifier;
    renderDeferred.debounce(() => {
      if (ks !== renderIdentifier) return
      alCheckFn(ks);

    });


  }

  const { removeDuplicateInfoFn, setHiddenStateForDesc, checkDuplicatedInfo_then } = (() => {

    let g_check_detail_A = 0;
    let checkDuplicateRes = null;
    function setHiddenStateForDesc() {
      let ytdFlexyElm = es.ytdFlexy
      if (!ytdFlexyElm) return
      let hiddenBool = !document.fullscreenElement ? ytdFlexyElm.classList.contains('tabview-info-duplicated') : false
      let elm
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-text-inline-expander#description-inline-expander #plain-snippet-text')
      if (elm) {
        wAttr(elm, 'hidden', hiddenBool)
      }
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-text-inline-expander#description-inline-expander #formatted-snippet-text')
      if (elm) {
        wAttr(elm, 'hidden', hiddenBool)
      }
    }
    function checkDuplicatedInfo_then(isCheck, checkDuplicateRes) {

      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return; //unlikely

      let cssbool_c1 = false, cssbool_c2 = false;
      if (isCheck === 5) {

        if (ytdFlexyElm.matches('.tabview-info-duplicated[flexy]')) {
          cssbool_c1 = !!querySelectorFromAnchor.call(ytdFlexyElm, '#description.style-scope.ytd-watch-metadata > #description-inner:only-child');
          cssbool_c2 = !!querySelectorFromAnchor.call(ytdFlexyElm, '#tab-info ytd-expander #description.ytd-video-secondary-info-renderer');
        }

        if (typeof checkDuplicateRes === 'boolean') {
          setHiddenStateForDesc();
        }
      }

      ytdFlexyElm.setAttribute('tyt-has', `${cssbool_c1 ? 'A' : 'a'}${cssbool_c2 ? 'B' : 'b'}`);

    }

    async function checkDuplicatedInfoMay2023() {
      const firstElementSelector = "ytd-text-inline-expander#description-inline-expander";
      const secondElementSelector = "#tab-info ytd-expander #description";

      const firstElement = document.querySelector(firstElementSelector);
      const secondElement = document.querySelector(secondElementSelector);

      if (!firstElement || !secondElement) return false;
      if (firstElement.hasAttribute('hidden') || secondElement.hasAttribute('hidden')) return false;

      const asyncGetContent = async (n) => {
        return n.textContent;
      }

      const getTextContentArr = async (element) => {
        let contentArray = [];

        for (let currentNode = nodeFirstChild(element); currentNode; currentNode = nodeNextSibling(currentNode)) {

          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            if (currentNode.hasAttribute("hidden")) {
              continue;
            }
            if (currentNode.id === "snippet") {
              let allHidden = true;
              for (let child = nodeFirstChild(currentNode); child; child = nodeNextSibling(child)) {
                if (child.hasAttribute("hidden")) {
                  continue;
                }
                let trimmedTextContent = await asyncGetContent(child);
                trimmedTextContent = trimmedTextContent.trim();
                if (trimmedTextContent.length === 0) continue;
                allHidden = false;
                break;
              }
              if (allHidden) {
                continue;
              }
            }

            if (currentNode.matches('#collapse[role="button"]:not([hidden])')) {
              // break;
              continue;
            }


          } else if (currentNode.nodeType === Node.TEXT_NODE) {
          } else {
            continue;
          }

          let trimmedTextContent = await asyncGetContent(currentNode);
          trimmedTextContent = trimmedTextContent.trim();
          if (trimmedTextContent.length > 0) {
            trimmedTextContent = trimmedTextContent.replace(/\n[\n\x20]+\n/g, '\n\n');
            // "白州大根\n    \n      チャンネル登録者数 698人\n    \n  \n\n\n  動画\n  \n\n\n  \n  \n概要"
            // "白州大根\n    \n      チャンネル登録者数 698人\n    \n  \n\n\n  動画\n  \n  \n概要"
            contentArray.push(trimmedTextContent);
          }

        }

        return contentArray;
      };

      const [firstElementTextArr, secondElementTextArr] = await Promise.all([getTextContentArr(firstElement), getTextContentArr(secondElement)]);

      function isSubset(arr1, arr2) {
        const set = new Set(arr2);
        const r = arr1.every(item => set.has(item));
        set.clear();
        return r;
      }

      return isSubset(firstElementTextArr, secondElementTextArr);
    }

    async function checkDuplicatedInfo() {

      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return; //unlikely

      const targetDuplicatedInfoPanel = document.querySelector('ytd-text-inline-expander#description-inline-expander:not([hidden])');
      if (targetDuplicatedInfoPanel && !targetDuplicatedInfoPanel.closest('[hidden]')) { } else {
        return; // the layout is not required to have this checking.
      }

      let t = Date.now();
      g_check_detail_A = t;

      ytdFlexyElm.classList.toggle('tabview-info-duplicated', true) // hide first;
      let infoDuplicated = false;

      try {
        await new Promise(resolve => setTimeout(resolve, 1)); // mcrcr might be not yet initalized


        if (g_check_detail_A !== t) return;


        let clicked = false;
        await Promise.all([...document.querySelectorAll('ytd-text-inline-expander#description-inline-expander #expand[role="button"]:not([hidden])')].map(button => {
          return Promise.resolve().then(() => {
            button.click();
            clicked = true;
          });
        }));

        await Promise.resolve(0);

        infoDuplicated = await checkDuplicatedInfoMay2023();

        if (infoDuplicated === false && clicked) {

          await Promise.all([...document.querySelectorAll('ytd-text-inline-expander#description-inline-expander #collapse[role="button"]:not([hidden])')].map(button => {
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

      //ytdFlexyElm.classList.toggle('tabview-info-duplicated', infoDuplicated)
      checkDuplicateRes = infoDuplicated;

      return 5; // other than 5, duplicated check = false

    };

    const removeDuplicateInfoFn = () => {

      checkDuplicateRes = null;
      async function alCheckFn(ks) {

        let alCheckCount = 4;
        let alCheckInterval = 270;

        checkDuplicateRes = null;
        let descExpandState = null;
        let descMetaExpander = closestDOMX(document.querySelector('ytd-text-inline-expander#description-inline-expander'), 'ytd-watch-metadata');
        let descToggleBtn = null;
        let descMetaLines = null;
        if (descMetaExpander) {

          // ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata
          descMetaLines = querySelectorFromAnchor.call(descMetaExpander, 'ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata')
          if (descMetaLines) {

            descToggleBtn = querySelectorFromAnchor.call(descMetaLines, '#collapse[role="button"]:not([hidden]), #expand[role="button"]:not([hidden])');
            if (descToggleBtn) {
              if (descMetaExpander.hasAttribute('description-collapsed') && descToggleBtn.id === 'expand') {
                descExpandState = false;
              } else if (!descMetaExpander.hasAttribute('description-collapsed') && descToggleBtn.id === 'collapse') {
                descExpandState = true;
              }
            }
          }

        }
        if (descMetaExpander) {
          descMetaExpander.classList.add('tyt-tmp-hide-metainfo');
        }

        try {



          do {

            if (renderIdentifier !== ks) break;
            if (alCheckCount === 0) break;
            if (checkDuplicateRes === true) break;
            checkDuplicateRes = null;

            let res = await checkDuplicatedInfo(); //async
            if (res === 5) {

              const ytdFlexyElm = es.ytdFlexy;
              if (ytdFlexyElm) {
                if (checkDuplicateRes === true || (checkDuplicateRes === false && alCheckCount === 1)) {
                  ytdFlexyElm.classList.toggle('tabview-info-duplicated', checkDuplicateRes)
                  ytdFlexyElm.classList.toggle('tabview-info-duplicated-checked', true)
                  checkDuplicatedInfo_then(res, checkDuplicateRes);
                }
              }

            }
            --alCheckCount;

            if (checkDuplicateRes === true) break;

            await new Promise(r => setTimeout(r, alCheckInterval));

          } while (true)

          await Promise.resolve(0)

          descToggleBtn = descMetaLines ? querySelectorFromAnchor.call(descMetaLines, '#collapse[role="button"]:not([hidden]), #expand[role="button"]:not([hidden])') : null;
          if (descToggleBtn) {

            let isCollapsed = descMetaExpander.hasAttribute('description-collapsed')
            let id = descToggleBtn.id
            let b1 = descExpandState === true && isCollapsed && id === 'expand';
            let b2 = descExpandState === false && !isCollapsed && id === 'collapse';

            if (b1 || b2) {
              descToggleBtn.click();
            }

          }




        } catch (e) {

          console.warn(e)

        }

        if (descMetaExpander) {
          descMetaExpander.classList.remove('tyt-tmp-hide-metainfo');

          await Promise.resolve(0)

          let detailsIntersectioner = querySelectorFromAnchor.call(descMetaExpander, '#info-container.style-scope.ytd-watch-metadata');
          if (detailsIntersectioner) {
            Promise.resolve(detailsIntersectioner).then(detailsIntersectioner => {
              let dom = detailsIntersectioner;
              if (dom) mtoObservationDetails.bindElement(dom);
            })
          }

        }



      }
      let ks = renderIdentifier;
      renderDeferred.debounce(() => {
        if (ks !== renderIdentifier) return
        alCheckFn(ks);

      });
    }

    return { removeDuplicateInfoFn, setHiddenStateForDesc, checkDuplicatedInfo_then };

  })();


  // setupChatFrameDOM (v1) - removed in 2023.07.06 since it is buggy for page changing. subject to further review
  function setupChatFrameDOM(node) {
    // this function calls 3 times per each new video page

    // 'tyt-chat' is initialized in setupChatFrameDisplayState1()

    if (!chatroomDetails) return;
    let liveChatFrame = node || document.querySelector('ytd-live-chat-frame#chat')
    if (liveChatFrame) {

      // every per [new] {ytd-live-chat-frame#chat} detection - reset after mini-playview

      let ytdFlexyElm = es.ytdFlexy;
      if (scriptEnable && ytdFlexyElm) {
        if (mtoVisibility_Chatroom.bindElement(liveChatFrame)) {
          mtoVisibility_Chatroom.observer.check(9)
        }
      }

      liveChatFrame = null;
      ytdFlexyElm = null;

      setToggleBtnTxt(); // immediate update when page changed

      if (node !== null) {
        // button might not yet be rendered
        requestAnimationFrame(setToggleBtnTxt); // bool = true must be front page
      } else {

        // this is due to page change
        let incorrectChat = document.querySelector('ytd-watch-flexy[is-two-columns_][theater] ytd-live-chat-frame#chat:not([collapsed])')
        if (incorrectChat) {
          incorrectChat.setAttribute('collapsed', '')
        }

      }

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

  async function setupVideo(node) {
    // this can be fired even in background without tabs rendered
    const attrKey = 'gM7Cp'
    let video = querySelectorFromAnchor.call(node, `#movie_player video[src]:not([${attrKey}])`);
    if (video) {
      video.setAttribute(attrKey, '')

      video.addEventListener('timeupdate', (evt) => {
        energizedByVideoTimeUpdate();
      }, bubblePassive);

      video.addEventListener('ended', (evt) => {
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

    _console.log(evt.target.nodeName, 904, evt.type);

    if (nodeName !== 'YTD-PLAYER') return

    setupVideo(node)


    let tabsDeferredSess = pageSession.session();
    if (!scriptEnable && tabsDeferred.resolved) { }
    else tabsDeferred.debounce(() => {

      if (!tabsDeferredSess.isValid) return;
      tabsDeferredSess = null;


      if (!scriptEnable) return

      checkAndMakeNewCommentFetch();

      _console.log(2178, 4)
      pageCheck();

      domInit_comments();
      setupChatFrameDOM(null);


    });


  });

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

  function ytMicroEventsInit() {

    _console.log(902);

    handleDOMAppear('videosDOMAppended', function (evt) {
      videosDeferred.resolve();
    })

    handleDOMAppear('liveChatFrameDOMAppended', (evt) => {

      let node = evt.target;
      if (!node) return;

      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {

        // P.S. avoid immediately dom change
        // time delay to avoid attribute set after dom appended.

        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;

        setupChatFrameDOM(node); // front page
        node = null;

      })

    });

    handleDOMAppear('pageLoaderAnimation', (evt) => {
      pageRendered = 2;
      renderDeferred.resolve();
      console
      console.debug('[tyt] pageRendered')

      scriptletDeferred.debounce(() => {
        document.dispatchEvent(new CustomEvent('tabview-page-rendered'))
      })

    });


    handleDOMAppear('chatFrameToggleBtnAppended1', (evt) => {

      _console.log(5099, 'chatFrameToggleBtnAppended', evt)

      Promise.resolve(0).then(() => { // avoid immediately dom change

        let tabsDeferredSess = pageSession.session();
        if (!scriptEnable && tabsDeferred.resolved) { }
        else tabsDeferred.debounce(() => {

          if (!tabsDeferredSess.isValid) return;
          tabsDeferredSess = null;

          mtf_liveChatBtnF(evt.target);

        })

      })

    });


    DEBUG_LOG && handleDOMAppear('chatFrameToggleBtnAppended2', (evt) => {

      _console.log(5099, 'chatFrameToggleBtnAppended', evt)


    });


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
      let correctAnchor = items.querySelector(`ytd-playlist-panel-video-renderer a[href*="${s}"]`);
      if (!correctAnchor || target.contains(correctAnchor)) return;
      let correctRow = correctAnchor.closest('ytd-playlist-panel-video-renderer');
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
      elm.addEventListener('autocomplete-sc-exist', handlerAutoCompleteExist, false)
      scriptletDeferred.debounce(() => {
        elm.dispatchEvent(new CustomEvent('tabview-fix-autocomplete'));
        elm = null;
      })
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
      p.innerHTML = '<svg viewBox="0 0 12 12" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M8,2V1H3v1h1v3.8L3,7h2v2.5L5.5,10L6,9.5V7h2L7,5.8V2H8z M6,6H5V2h1V6z" class="style-scope yt-icon"></path></g></svg>';
      svg.replaceWith(p.content.firstChild);


    })

    const renderStamperFunc = {
      'YTD-PLAYLIST-PANEL-RENDERER': (node) => {
        mtf_append_playlist(node); // the true playlist is appended to the #tab-list
        checkPlaylistForInitialization();
      },
      'YTD-COMMENTS-HEADER-RENDERER': (node) => {
        comments_loader = comments_loader | 4;
        getFinalComments();
      }
    }

    globalHook('yt-rendererstamper-finished', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      // might occur before initialization

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      let node = evt.target;
      const nodeName = node.nodeName.toUpperCase();
      const func = renderStamperFunc[nodeName];

      if (typeof func !== 'function') {
        return;
      }


      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {

        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;

        func(node);
        node = null;

      });


    });

    if (REMOVE_DUPLICATE_INFO) {

      handleDOMAppear('deferredDuplicatedMetaChecker', (evt) => {

        removeDuplicateInfoFn();

      });

    }

    globalHook('yt-page-data-updated', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      _console.log(evt.target.nodeName, 904, evt.type);

      advanceFetch();

      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {

        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;

        if (!scriptEnable) return;

        checkAndMakeNewCommentFetch();


        // if the page is navigated by history back-and-forth, not all engagement panels can be catched in rendering event.



        _console.log(2178, 3)
        pageCheck();
        setupChatFrameDOM(null);

        let expander = document.querySelector('#meta-contents ytd-expander:not([tabview-expander-checked])');
        if (expander) {

          // once per $$native-info-description$$ {#meta-contents ytd-expander} detection
          // append the detailed meta contents to the tab-info

          expander.setAttribute('tabview-expander-checked', '');
          let tabInfo = document.querySelector("#tab-info");
          if (tabInfo) {
            elementAppend.call(tabInfo, expander);
          }

        }


        if (REMOVE_DUPLICATE_INFO) {

          // removeDuplicateInfoFn();

        } else {

          checkDuplicatedInfo_then(0, null);

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

        if (REMOVE_DUPLICATE_META_RECOMMENDATION) {

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

          let ks = renderIdentifier;
          renderDeferred.debounce(() => {
            if (ks !== renderIdentifier) return
            checkDuplicatedMetaRecommendation();
          })

        }

        /*
        if (REPLACE_PIN_ICON) {



        }
        */


        let renderId = renderIdentifier
        renderDeferred.debounce(() => {
          if (renderId !== renderIdentifier) return
          // domInit_teaserInfo() // YouTube obsoleted feature? 

          let h1 = document.querySelector('#below h1.ytd-watch-metadata yt-formatted-string')
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

        })


        checkPlaylistForInitialization();

        mtf_fix_details().then(() => {
          setToggleInfo();
          renderDeferred.debounce(() => {
            if (renderId !== renderIdentifier) return
            setTimeout(() => {
              //dispatchWindowResize(); //try to omit
              dispatchWindowResize(); //add once for safe
              manualResizeT();
            }, 420)
          })


          let secondary = document.querySelector('#columns.ytd-watch-flexy #secondary.ytd-watch-flexy');

          let columns = secondary ? closestDOM.call(secondary, '#columns.ytd-watch-flexy') : null;

          setupHoverSlider(secondary, columns)

          let tabInfo = document.querySelector('#tab-info');
          addTabExpander(tabInfo);

          let tabComments = document.querySelector('#tab-comments');
          addTabExpander(tabComments);


        });


      });

    });


    globalHook('yt-watch-comments-ready', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      let nodeName = evt.target.nodeName.toUpperCase()
      advanceFetch();

      comments_loader = comments_loader | 2;

      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {

        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;

        checkAndMakeNewCommentFetch();

        if (nodeName === 'YTD-WATCH-FLEXY') {
          domInit_comments();
          onCommentsReady();
        }
      });

    })


    window.addEventListener("message", (evt) => {
      if (!scriptEnable && tabsDeferred.resolved) { return }
      if (evt.origin === location.origin && evt.data.tabview) {
        let data = evt.data.tabview;
        if (data.eventType === "yt-page-type-changed") {
          let detail = data.eventDetail
          let { newPageType, oldPageType } = detail;
          if (newPageType && oldPageType) {
            let bool = false;
            if (newPageType == 'ytd-watch-flexy') {
              bool = true;
              pageType = 'watch';
            } else if (newPageType == 'ytd-browse') {
              pageType = 'browse';
            }
            document.documentElement.classList.toggle('tabview-normal-player', bool)
          }
        }
      }
    }, bubblePassive);


    globalHook('data-changed', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }

      let nodeName = (((evt || 0).target || 0).nodeName || '').toUpperCase()

      if (nodeName !== 'YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER') return;

      document.dispatchEvent(new CustomEvent("tabview-fix-popup-refit"));

    })


    DEBUG_LOG && globalHook('yt-rendererstamper-finished', (evt) => {

      if (!scriptEnable && tabsDeferred.resolved) { return }
      // might occur before initialization

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      const nodeName = evt.target.nodeName.toUpperCase();

      //  const S_GENERAL_RENDERERS = ['YTD-TOGGLE-BUTTON-RENDERER','YTD-MENU-RENDERER']
      if (S_GENERAL_RENDERERS.includes(nodeName)) {
        return;
      }

      _console.log(evt.target.nodeName, 904, evt.type, evt.detail);

    });

    DEBUG_LOG && globalHook('data-changed', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;

      let nodeName = evt.target.nodeName.toUpperCase()
      _console.log(nodeName, evt.type)

      if (nodeName === 'YTD-ITEM-SECTION-RENDERER' || nodeName === 'YTD-COMMENTS') {

        _console.log(344)

      }

    })

    DEBUG_LOG && globalHook('yt-navigate', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)

    })

    DEBUG_LOG && globalHook('ytd-playlist-lockup-now-playing-active', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-service-request-completed', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-commerce-action-done', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-execute-service-endpoint', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })


    DEBUG_LOG && globalHook('yt-request-panel-mode-change', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })


    DEBUG_LOG && globalHook('yt-visibility-refresh', (evt) => {

      if (!evt || !evt.target /*|| evt.target.nodeType !== 1*/) return;
      _console.log(evt.target.nodeName || '', evt.type)

      const ytdFlexyElm = es.ytdFlexy;
      _console.log(2784, evt.type, (ytdFlexyElm ? ytdFlexyElm.hasAttribute('hidden') : null), evt.detail)

      _console.log(evt.detail)


    })

    DEBUG_LOG && globalHook('yt-request-panel-mode-change', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('app-reset-layout', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })
    DEBUG_LOG && globalHook('yt-guide-close', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })
    DEBUG_LOG && globalHook('yt-page-data-will-change', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-retrieve-location', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-refit', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)

    })

    DEBUG_LOG && globalHook('addon-attached', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)

    })

    DEBUG_LOG && globalHook('yt-live-chat-context-menu-opened', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)

    })

    DEBUG_LOG && globalHook('yt-live-chat-context-menu-closed', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)

    })

    DEBUG_LOG && globalHook('yt-commentbox-resize', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)
    })

    DEBUG_LOG && globalHook('yt-rich-grid-layout-refreshed', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(2327, evt.target.nodeName, evt.type)
    })

    DEBUG_LOG && globalHook('animationend', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-dismissible-item-dismissed', (evt) => {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-dismissible-item-undismissed', function (evt) {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })


    DEBUG_LOG && globalHook('yt-load-next-continuation', function (evt) {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })


    DEBUG_LOG && globalHook('yt-load-reload-continuation', function (evt) {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })

    DEBUG_LOG && globalHook('yt-toggle-button', function (evt) {

      if (!evt || !evt.target || evt.target.nodeType !== 1) return;
      _console.log(evt.target.nodeName, evt.type)


    })


  }




  function addIframeStyle(cDoc) {
    if (cDoc.querySelector('#tyt-chatroom-css')) return false;
    addStyle((iframeCSS() || ''), cDoc.documentElement).id = 'tyt-chatroom-css'
    return true;
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


  function addPopupButton(chat) {
    let showHideBtn = chat.querySelector('div#show-hide-button')
    if (showHideBtn) {

      let btn;
      btn = document.querySelector('tyt-iframe-popup-btn')
      if (btn) btn.remove();

      btn = document.createElement('tyt-iframe-popup-btn')
      elementAppend.call(showHideBtn, btn)
      // console.log(334,2)
      btn.dispatchEvent(new CustomEvent('tyt-iframe-popup-btn-setup'))
    }

  }

  function iFrameContentReady(cDoc) {

    // console.log(702, 1)
    if (!cDoc) return;

    // console.log(702, 2)
    if (addIframeStyle(cDoc) === false) return;

    // console.log(702, 3)
    let frc = 0;
    let cid = 0;

    let fullReady = () => {

      // console.log(702, 4)
      if (!cDoc.documentElement.hasAttribute('style') && ++frc < 900) return;
      clearInterval(cid);

      // console.log(702, 5)
      if (!scriptEnable || !isChatExpand()) return; // v4.13.19 - scriptEnable = true in background

      // console.log(702, 6)
      let iframe = document.querySelector('body ytd-watch-flexy ytd-live-chat-frame iframe#chatframe');

      // console.log(702, 7)
      if (!iframe) return; //prevent iframe is detached from the page

      // console.log(702, 8)
      if (cDoc.querySelector('yt-live-chat-renderer #continuations')) {

        // console.log(702, 9)
        let chatFrame = document.querySelector('ytd-live-chat-frame#chat');
        if (chatFrame) {
          chatFrame.setAttribute('tyt-iframe-loaded', '')
          // console.log(711, chatFrame)

          // chatFrame.dispatchEvent(new CustomEvent("tabview-force-display-chat-replay"));
          // checkIframeDblClick(); // user request for compatible with https://greasyfork.org/en/scripts/452335
          iframe.dispatchEvent(new CustomEvent("tabview-chatroom-ready"))
          // console.log(334,1)
          addPopupButton(chatFrame)

        }
      }


    }
    cid = setInterval(fullReady, 10)
    fullReady();


  }

  let iframeLoadHookA_id = 0

  const iframeLoadHookA = function (evt) {


    let isIframe = (((evt || 0).target || 0).nodeName === 'IFRAME');

    if (isIframe && evt.target.matches('body iframe.style-scope.ytd-live-chat-frame#chatframe')) {
    } else {
      return;
    }

    let iframe = evt.target;
    let tid = ++iframeLoadHookA_id;

    // console.log(701, 2)
    new Promise(resolve => {
      if (tid !== iframeLoadHookA_id) return

      // console.log(701, 3)
      let k = 270
      let cid = setInterval(() => {

        if (tid !== iframeLoadHookA_id) return

        if (!cid) return;

        if (k-- < 1) {
          clearInterval(cid);
          cid = 0;
          return resolve(false);
        }

        let cDoc = iframe.contentDocument;
        if (!cDoc) return null;
        if (cDoc.readyState != 'complete') return;
        if (!cDoc.querySelector('body')) {
          clearInterval(cid);
          cid = 0;
          return resolve(false);
        }

        if (!cDoc.querySelector('yt-live-chat-app')) return;

        clearInterval(cid);
        cid = 0;

        if (!document.contains(iframe)) return resolve(false);

        resolve([cDoc, iframe]);

        cDoc = null

        iframe = null


      }, 17)


    }).then((res) => {


      // console.log(701, 4, res)
      if (tid !== iframeLoadHookA_id) return

      // console.log(701, 5)
      if (!res) return;

      // console.log(701, 6)

      const [cDoc, iframe] = res

      iFrameContentReady(cDoc)
      iframe.dispatchEvent(new CustomEvent('tabview-chatframe-loaded'))


    })



  }

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
  
  function convertDefaultTabFromTmpToFinal(myDefaultTab_tmp){
    
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

    materialTab.addEventListener('click', function (evt) {

      if (!evt.isTrusted) return; // prevent call from background

      if (isMiniviewForStickyHeadEnabled) {
        setTimeout(delayedClickHandler, 80);
      } else if (!isMiniviewForStickyHeadEnabled && isStickyHeaderEnabled && typeof IntersectionObserver == 'function') {
        setTimeout(delayedClickHandler, 80);
      }
      let dom = evt.target;
      if ((dom || 0).nodeType !== 1) return;

      const domInteraction = dom.getAttribute('tyt-di');
      if (domInteraction === 'q9Kjc') {
        handlerMaterialTabClick.call(dom, evt)
      } else if (domInteraction === '8rdLQ') {
        fontSizeBtnClick.call(dom, evt)
      }


    }, true)

    function updateCSS_fontsize(store) {

      if (!store) return;

      const ytdFlexyElm = es.ytdFlexy;
      if (ytdFlexyElm) {
        if (store['font-size-#tab-info']) ytdFlexyElm.style.setProperty('--ut2257-info', store['font-size-#tab-info'])
        if (store['font-size-#tab-comments']) ytdFlexyElm.style.setProperty('--ut2257-comments', store['font-size-#tab-comments'])
        if (store['font-size-#tab-videos']) ytdFlexyElm.style.setProperty('--ut2257-videos', store['font-size-#tab-videos'])
        if (store['font-size-#tab-list']) ytdFlexyElm.style.setProperty('--ut2257-list', store['font-size-#tab-list'])
        document.dispatchEvent(new CustomEvent("tabview-zoom-updated"));
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

  async function onNavigationEndAsync(isPageFirstLoaded) {

    if (pageType !== 'watch') return;

    let tdt = Date.now();
    _navigateLoadDT = tdt;

    // avoid blocking the page when youtube is initializing the page
    const promiseDelay = new Promise(requestAnimationFrame);
    const promiseVideoRendered = videosDeferred.d();

    const verifyPageState = () => {
      if (_navigateLoadDT !== tdt) {
        return -400;
      }
      if (ytEventSequence !== 3) {
        return -200;
      }

      const ytdFlexyElm = document.querySelector('ytd-watch-flexy')

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

    const related = querySelectorFromAnchor.call(ytdFlexyElm, "#related.ytd-watch-flexy");
    if (!related) return;

    // isPageFirstLoaded && console.time("Tabview Youtube Render")

    if (!document.querySelector("#right-tabs")) {
      getLangForPage();
      let docTmp = document.createElement('template');
      docTmp.innerHTML = getTabsHTML();
      let newElm = docTmp.content.firstElementChild;
      if (newElm !== null) {
        insertBeforeTo(newElm, related);
        querySelectorFromAnchor.call(newElm, '#material-tabs').addEventListener('mousemove', (evt) => {
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
    mtf_checkFlexy()

    tabsDeferred.resolve();
    FP.mtf_attrEngagementPanel(); // check whether no visible panels

    // isPageFirstLoaded && console.timeEnd("Tabview Youtube Render")

    // let ks = renderIdentifier;
    // renderDeferred.debounce(() => {
    //   if (ks !== renderIdentifier) return
    //   if (_navigateLoadDT !== tdt) return;

    //   let donationShelf = document.querySelector('ytd-watch-flexy:not([tyt-donation-shelf]) ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
    //   if (donationShelf) {
    //     // console.log(334)
    //     // ignored if event handler for tabview-donation-shelf-set-visibility is not yet hooked.
    //     setTimeout(()=>{
    //       if (ks !== renderIdentifier) return
    //       if (_navigateLoadDT !== tdt) return;
    //       // console.log(554)

    //       let donationShelf = document.querySelector('ytd-watch-flexy:not([tyt-donation-shelf]) ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden]):not(:empty)');
    //       if(!donationShelf) return;
    //       document.dispatchEvent(new CustomEvent('tabview-donation-shelf-set-visibility', {
    //         detail: {
    //           visibility: true,
    //           flushDOM: true
    //         }
    //       }));
    //     },450)
    //   }
    //   donationShelf = null;

    // })

    isPageFirstLoaded && document.documentElement.removeAttribute('tyt-lock');

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
      let span = querySelectorFromAnchor.call(tab_btn, 'span#tyt-cm-count');
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
      let span = querySelectorFromAnchor.call(tabBtn, 'span#tyt-cm-count');
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

      let elem = document.querySelector('#primary.ytd-watch-flexy #below ytd-watch-metadata #info-container.ytd-watch-metadata:first-child:not([tyt-info-toggler])')
      if (elem) {

        elem.setAttribute('tyt-info-toggler', '')
        elem.dispatchEvent(new CustomEvent('tyt-info-toggler'))

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

        await new Promise(r => setTimeout(r, 20));

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


  const mtf_attrFlexy = (mutations, observer) => {

    //attr mutation checker - $$ytdFlexyElm$$ {ytd-watch-flexy} \single
    //::attr    
    // ~ 'tyt-chat', 'theater', 'is-two-columns_', 
    // ~ 'tyt-tab', 'fullscreen', 'tyt-ep-visible', 
    // ~ 'hidden', 'is-extra-wide-video_'

    //console.log(15330, scriptEnable, es.ytdFlexy, mutations)

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

    for (const mutation of mutations) {
      new_layoutStatus = flexAttr_toLayoutStatus(new_layoutStatus, mutation.attributeName);
      _console.log(8221, 18, mutation.attributeName)
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
        setTimeout(() => {
          updateFloatingSlider();  //required for hover slider // eg video after ads
        }, 1);
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

    let timeout240 = new Promise(r => timeline.setTimeout(r, 240));
    timeout240.then(immediateCheck);

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
          chatFrame.dispatchEvent(new CustomEvent("tabview-chatroom-newpage")); //possible empty iframe is shown

        }
      } else {
        attr_chatcollapsed = initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED' ? true : false;
      }
    }

    if (chatTypeChanged) {
      mtf_chatBlockQ = chatBlockR

      _console.log(932, 2, attr_chatblock, attr_chatcollapsed)

      //LIVE_CHAT_DISPLAY_STATE_COLLAPSED
      //LIVE_CHAT_DISPLAY_STATE_EXPANDED
      let v = attr_chatblock
      if (typeof attr_chatblock == 'string') {

        if (attr_chatcollapsed === true) v = '-' + attr_chatblock
        if (attr_chatcollapsed === false) v = '+' + attr_chatblock;
      }
      wAttr(ytdFlexyElm, 'tyt-chat', v)

      _console.log(932, 3, ytdFlexyElm.hasAttribute('tyt-chat'))


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
        s |= querySelectorFromAnchor.call(elmCont, 'yt-timed-continuation') ? 1 : 0;
        s |= querySelectorFromAnchor.call(elmCont, 'yt-live-chat-replay-continuation, yt-player-seek-continuation') ? 2 : 0;
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


  const mtf_checkFlexy = () => {
    // once per $$native-ytd-watch-flexy$$ {ytd-watch-flexy} detection

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return true;


    wls.layoutStatus = 0;

    let isFlexyHidden = (ytdFlexyElm.hasAttribute('hidden'));

    if (!isFlexyHidden) {
      let rChatExist = setupChatFrameDisplayState2();
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

    let rTabSelection = [...querySelectorAllFromAnchor.call(ytdFlexyElm, '.tab-btn[tyt-tab-content]')]
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

    let ls = LAYOUT_VAILD;
    ls = flexAttr_toLayoutStatus(ls, 'theater')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-chat')
    ls = flexAttr_toLayoutStatus(ls, 'is-two-columns_')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-tab')
    ls = flexAttr_toLayoutStatus(ls, 'fullscreen')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-ep-visible')
    ls = flexAttr_toLayoutStatus(ls, 'tyt-donation-shelf')

    fixLayoutStatus(ls)

    wls.layoutStatus = ls

    mtoFlexyAttr.bindElement(ytdFlexyElm, {
      attributes: true,
      attributeFilter: ['tyt-chat', 'theater', 'is-two-columns_', 'tyt-tab', 'fullscreen', 'tyt-ep-visible', 'tyt-donation-shelf', 'hidden', 'is-extra-wide-video_'],
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

          let secondary = document.querySelector('#secondary.ytd-watch-flexy');
          if (secondary) {
            secondary.dispatchEvent(new CustomEvent('tabview-hover-slider-restore'))
            //console.log(1995)
          }


        }
      }

      ytdFlexyElm.setAttribute('tyt-tab', activeLink ? lstTab.lastTab : '')

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


      const fullScreenTabScrollIntoView = () => {
        let scrollElement = document.querySelector('ytd-app[scrolling]')
        if (!scrollElement) return;
        // single column view; click button; scroll to tab content area 100%
        let rightTabs = document.querySelector('#right-tabs');
        let pTop = rightTabs.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top
        if (rightTabs && pTop > 0 && tabBtn.classList.contains('active')) {
          rightTabs.scrollIntoView(false);
        }
      }

      _console.log(8221, 16, 1)

      if (isActiveAndVisible) {
        timeline.setTimeout(unlock, 80);
        switchTabActivity(null);
      } else {

        if (isChatExpand() && isWideScreenWithTwoColumns()) {
          ytBtnCollapseChat();
        } else if (isEngagementPanelExpanded() && isWideScreenWithTwoColumns()) {
          ytBtnCloseEngagementPanels();
        } else if (isDonationShelfExpanded() && isWideScreenWithTwoColumns()) {
          closeDonationShelf();
        }


        timeline.setTimeout(fullScreenTabScrollIntoView, 60)

        timeline.setTimeout(unlock, 80);
        switchTabActivity(tabBtn)
      }

    } else if (isWideScreenWithTwoColumns() && !isTheater() && isActiveAndVisible) {

      _console.log(8221, 16, 2)
      //optional
      timeline.setTimeout(unlock, 80);
      switchTabActivity(null);
      ytBtnSetTheater();
    } else if (isActiveAndVisible) {

      _console.log(8221, 16, 3)
      timeline.setTimeout(unlock, 80);
      switchTabActivity(null);
    } else {

      _console.log(8221, 16, 4)

      if (isChatExpand() && isWideScreenWithTwoColumns()) {
        ytBtnCollapseChat();
      } else if (isEngagementPanelExpanded() && isWideScreenWithTwoColumns()) {
        ytBtnCloseEngagementPanels();
      } else if (isDonationShelfExpanded() && isWideScreenWithTwoColumns()) {
        closeDonationShelf();
      } else if (isWideScreenWithTwoColumns() && isTheater() && !isFullScreen()) {
        ytBtnCancelTheater(); //ytd-watch-flexy attr [theater]
      }

      timeline.setTimeout(() => {
        // single column view; click button; scroll to tab content area 100%
        let rightTabs = document.querySelector('#right-tabs');
        if (!isWideScreenWithTwoColumns() && rightTabs && rightTabs.offsetTop > 0 && tabBtn.classList.contains('active')) {
          let tabButtonBar = document.querySelector('#material-tabs');
          let tabButtonBarHeight = tabButtonBar ? tabButtonBar.offsetHeight : 0;
          window.scrollTo(0, rightTabs.offsetTop - tabButtonBarHeight);
        }
      }, 60)
      // _console.log(8519)

      timeline.setTimeout(unlock, 80)
      switchTabActivity(tabBtn)

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
      let video = document.querySelector('#player video');
      if (!video) return;

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
        setTimeout(enablePIPforStickyHead, 0);
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
    } else if (new_isExpandedEPanel && querySelectorAllFromAnchor.call(ytdFlexyElm, 'ytd-watch-flexy[flexy][tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]:not([hidden])').length === 0) {
      wls.layoutStatus = new_layoutStatus & (~LAYOUT_ENGAGEMENT_PANEL_EXPANDED)
    } else if (new_isExpandedDonationShelf && querySelectorAllFromAnchor.call(ytdFlexyElm, 'ytd-donation-shelf-renderer.ytd-watch-flexy:not([hidden])').length === 0) {
      wls.layoutStatus = new_layoutStatus & (~LAYOUT_DONATION_SHELF_EXPANDED)
    }

  }


  function extractInfoFromLiveChatRenderer(liveChatRenderer) {

    let lcr = liveChatRenderer

    let data_shb = ((lcr || 0).showHideButton || 0).toggleButtonRenderer

    let default_display_state = null, txt_collapse = null, txt_expand = null;


    if (data_shb && data_shb.defaultText && data_shb.toggledText && data_shb.defaultText.runs && data_shb.toggledText.runs) {

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

    return { default_display_state, txt_collapse, txt_expand }

  }

  function newVideoPage(evt_detail) {

    //toggleBtnDC = 1;

    console.debug('[tyt] newVideoPage')

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return;

    timeline.reset();
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

        if (attr_chatblock == 'chat$live') {

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


  function pageBeingFetched(evt, isPageFirstLoaded) {

    let nodeName = (((evt || 0).target || 0).nodeName || '').toUpperCase()
    if (nodeName !== 'YTD-APP') return;

    let pageFetchedDataLocal = evt.detail;

    let d_page = ((pageFetchedDataLocal || 0).pageData || 0).page;
    if (!d_page) return;

    pageType = d_page;

    if (pageType !== 'watch') return

    let promiseChatDetails = null

    let isFirstLoad = firstLoadStatus & 8;

    if (isFirstLoad) {
      firstLoadStatus -= 8;
      document.addEventListener('load', iframeLoadHookA, capturePassive)
      ytMicroEventsInit();
    }
    // ytMicroEventsInit set
    variableResets();

    if (isFirstLoad) {

      if (ytEventSequence >= 2) {
        let docElement = document.documentElement
        if (docElement.hasAttribute('tabview-loaded')) {
          throw 'Tabview Youtube Duplicated';
        }
        docElement.setAttribute('tabview-loaded', '')

        Promise.resolve(docElement).then(docElement => {
          if (ytEventSequence >= 2) {
            docElement.dispatchEvent(new CustomEvent('tabview-ce-hack'))
            docElement = null
          }
        })

      }
    }
    // tabview-loaded delay set

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

    promiseChatDetails = Promise.resolve().then(() => {
      if (ytEventSequence >= 2) {
        let liveChatRenderer = null;
        try {
          liveChatRenderer = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer
        } catch (e) { }
        chatroomDetails = liveChatRenderer ? extractInfoFromLiveChatRenderer(liveChatRenderer) : null;
        liveChatRenderer = null; // release memory for GC, just in case
      }
    });

    let ytdFlexyElm = document.querySelector('ytd-watch-flexy')

    if (!ytdFlexyElm) return;


    ytdFlexy = mWeakRef(ytdFlexyElm);

    ytdFlexyElm = null;

    Promise.resolve(0).then(() => {

      if (ytEventSequence >= 2 && pageRendered === 0) {

        const ytdFlexyElm = es.ytdFlexy; // shall be always non-null
        if (ytdFlexyElm) {

          let elmPL = document.createElement('tabview-view-ploader');
          pageRendered = 1;
          // ytdFlexyElm.appendChild(elmPL);
          elementAppend.call(ytdFlexyElm, elmPL);
          // pageRendered keeps at 1 if the video is continuously playing at the background
          // pageRendered would not be resolve but will reset for each change of video

        }

      }

    })

    let renderId = renderIdentifier
    renderDeferred.debounce(() => {
      if (renderId !== renderIdentifier) return
      if (ytEventSequence >= 2) {
        advanceFetch(); // at least one triggering at yt-page-data-fetched
      }
    });

    Promise.race([promiseChatDetails]).then(() => {

      const ytdFlexyElm = es.ytdFlexy;
      if (ytEventSequence >= 2 && ytdFlexyElm) {
        ytdFlexyElm.classList.toggle('tyt-chat-toggleable', !!chatroomDetails);
      }

    }).then(() => {

      if (ytEventSequence >= 2) {

        let tabsDeferredSess = pageSession.session();
        if (!scriptEnable && tabsDeferred.resolved) { }
        else tabsDeferred.debounce(() => {

          if (!tabsDeferredSess.isValid) return;
          tabsDeferredSess = null;

          if (ytEventSequence >= 2 && pageFetchedDataLocal !== null) {
            domInit_comments();
            newVideoPage(pageFetchedDataLocal);
            pageFetchedDataLocal = null;
          }

        });

      }

    })

  }

  let pageSeqMutex = new Mutex()

  function pageSeq1(evt) {
    _navigateLoadDT = 0
    if (ytEventSequence !== 1) {
      ytEventSequence = 1
      pageSeqMutex.lockWith(unlock => {
        pageBeingInit();
        unlock();
      })
    }
  }

  function pageSeq2(evt) {
    _navigateLoadDT = 0

    if (ytEventSequence !== 1) {
      ytEventSequence = 1
      pageSeqMutex.lockWith(unlock => {
        pageBeingInit();
        unlock();
      })
    }
    if (ytEventSequence === 1) {
      ytEventSequence = 2


      pageType = null

      pageSeqMutex.lockWith(unlock => {

        let mIsPageFirstLoaded = _isPageFirstLoaded

        pageType = null
        // mIsPageFirstLoaded && console.time("Tabview Youtube Load")
        pageBeingFetched(evt, mIsPageFirstLoaded)
        // mIsPageFirstLoaded && console.timeEnd("Tabview Youtube Load")
        // ytMicroEventsInit set + tabview-loaded delay set
        Promise.resolve().then(() => {
          if (ytEventSequence >= 2) {
            document.documentElement.classList.toggle('tabview-normal-player', pageType === 'watch');
          }
        })
        if (pageType !== 'watch') {
          ytdFlexy = null
          chatroomDetails = null
          Promise.resolve(0).then(() => {
            if (ytEventSequence >= 2) {
              variableResets();
              emptyCommentSection();
              _console.log(9360, 75);
              tabsDeferred.reset();
              _pageBeingInit();
              tabsDeferred.resolve(); // for page initialization
            }
          })
        }

        if (_updateTimeAccum > 0) {
          let currentVideo = document.querySelector('#movie_player video[src]')
          let keep_viTime = false
          if (currentVideo && currentVideo.readyState > currentVideo.HAVE_CURRENT_DATA && currentVideo.currentTime > 2.2) {
            // allow miniview browsing
            keep_viTime = true
          }
          if (!keep_viTime) {
            _viTimeNum = 200;
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
          let mIsPageFirstLoaded = _isPageFirstLoaded
          // ytMicroEventsInit set + tabview-loaded delay set
          onNavigationEndAsync(mIsPageFirstLoaded)
          _isPageFirstLoaded = false
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

      setTimeout3(() => {
        singleColumnScrolling(true)
      })

    } else {
      // two cols

      updateFloatingSlider();

    }


  }
  //let lastResizeAt = 0;  
  let resizeCount = 0;
  window.addEventListener('resize', function (evt) {

    if (evt.isTrusted === true) {
      //console.log(evt)
      let tcw = ++resizeCount;
      Promise.resolve(0).then(() => {
        if (tcw !== resizeCount) return;
        setTimeout(() => {
          // avoid duplicate calling during resizing
          if (tcw !== resizeCount) return;

          resizeCount = 0;
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
      setTimeout(delayedClickHandler, 80);
    }

    // if(isMiniviewForStickyHeadEnabled && !isStickyHeaderEnabled && userActivation){
    //   setTimeout(restorePIPforStickyHead, 80);
    // }else if(!isMiniviewForStickyHeadEnabled && isStickyHeaderEnabled && userActivation && typeof IntersectionObserver == 'function'){
    //   setTimeout(enablePIPforStickyHead, 80);
    // }
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
    if (res.newFound === true && res.length === 1 && res[0].isLatest && res[0].isNew) {
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
      document.dispatchEvent(new CustomEvent("tabview-miniview-browser-enable"));
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


  handleDOMAppear('#tabview-controller', ()=>{}); // dummy
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


})({ requestAnimationFrame });
// console.timeEnd("Tabview Youtube Init Script")