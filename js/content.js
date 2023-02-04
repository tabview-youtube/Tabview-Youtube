"use strict";
// console.time("Tabview Youtube Init Script")
-(function mainBody() {
  'use strict';

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  if (inIframe()) return;

  if(document.documentElement && document.documentElement.hasAttribute('plugin-tabview-youtube')){
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
  const MINIVIEW_BROWSER_ENABLE = true;
  const DEBUG_LOG = false;

  
  let _isPageFirstLoaded = true

  async function makeTytLock() {
    let c = 8;
    while (!document.documentElement) {
      if(--c === 0) return
      await new Promise(window.requestAnimationFrame)
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
  body {
      --tabview-msg-cursor: default;
      --tabview-msg-pointer-events: none;
      --tabview-img-pointer-events: auto;
  }
  
  body.tabview-allow-pointer-events {
      --tabview-msg-cursor: '-NULL-';
      --tabview-msg-pointer-events: '-NULL-';
      --tabview-img-pointer-events: '-NULL-';
  }
  
  body #input-panel.yt-live-chat-renderer::after {
      background: transparent;
  }
  
  .style-scope.yt-live-chat-item-list-renderer {
      box-sizing: border-box;
  }
  
  yt-live-chat-text-message-renderer:nth-last-child(-n+30):hover #menu.yt-live-chat-text-message-renderer {
      transition-delay: 87ms;
  }
  
  yt-live-chat-text-message-renderer #menu.yt-live-chat-text-message-renderer {
      transition-delay: 1ms;
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
  
  #items.style-scope.yt-live-chat-item-list-renderer>yt-live-chat-text-message-renderer.yt-live-chat-item-list-renderer {
      --tabview-chat-message-display: block;
      --tabview-chat-message-mt: 2px;
      --tabview-chat-message-mb: 4px;
  }
  
  #message.yt-live-chat-text-message-renderer {
      display: var(--tabview-chat-message-display);
      margin-top: var(--tabview-chat-message-mt);
      margin-bottom: var(--tabview-chat-message-mb);
  }
  
  [collapsed] #message.yt-live-chat-text-message-renderer {
      --tabview-chat-message-display: 'VOID';
      --tabview-chat-message-mt: 'VOID';
      --tabview-chat-message-mb: 'VOID';
  }
  
  
  @supports (contain: layout paint style) {

    /*
    contain: layout paint style;
    // #item-offset uses transform, it is buggy in Opera 93.0 with contain: layout & paint
    */

    body yt-live-chat-app {
        contain: size layout paint style;
        /* content-visibility: auto; */
        transform: translate3d(0, 0, 0);
        overflow: hidden;
    }

    #items.style-scope.yt-live-chat-item-list-renderer{
        contain: layout paint style;
    }

    #item-offset.style-scope.yt-live-chat-item-list-renderer {
        contain: style;
    }

    #item-scroller.style-scope.yt-live-chat-item-list-renderer {
        contain: size style;
    }

    #contents.style-scope.yt-live-chat-item-list-renderer,
    #chat.style-scope.yt-live-chat-renderer,
    img.style-scope.yt-img-shadow[width][height] {
        contain: size layout paint style;
    }

    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label],
    .style-scope.yt-live-chat-ticker-renderer[role="button"][aria-label]>#container {
        contain: layout paint style;
    }


    yt-img-shadow#author-photo.style-scope {
        contain: layout paint style;
        /*
        content-visibility: auto;
        contain-intrinsic-size: 24px 24px;
        */
    }

    yt-live-chat-text-message-renderer:not([author-is-owner]) #author-photo.style-scope.yt-live-chat-text-message-renderer,
    yt-live-chat-text-message-renderer:not([author-is-owner]) yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer {
        pointer-events: var(--tabview-msg-pointer-events);
    }

    yt-live-chat-text-message-renderer:not([author-is-owner]) span#message.style-scope.yt-live-chat-text-message-renderer>img.emoji.yt-formatted-string.style-scope.yt-live-chat-text-message-renderer {
        cursor: var(--tabview-msg-cursor);
    }


    yt-live-chat-text-message-renderer:not([author-is-owner]) span#message.style-scope.yt-live-chat-text-message-renderer,
    yt-live-chat-paid-message-renderer #message.yt-live-chat-paid-message-renderer,
    yt-live-chat-text-message-renderer:not([author-is-owner]) #timestamp.style-scope.yt-live-chat-text-message-renderer,
    yt-live-chat-membership-item-renderer #header-content.style-scope.yt-live-chat-membership-item-renderer,
    yt-live-chat-membership-item-renderer #timestamp.style-scope.yt-live-chat-membership-item-renderer,
    yt-live-chat-paid-message-renderer #header-content.yt-live-chat-paid-message-renderer,
    yt-live-chat-paid-message-renderer #timestamp.style-scope.yt-live-chat-paid-message-renderer,
    yt-live-chat-paid-sticker-renderer #content.style-scope.yt-live-chat-paid-sticker-renderer,
    yt-live-chat-paid-sticker-renderer #timestamp.style-scope.yt-live-chat-paid-sticker-renderer {
        cursor: var(--tabview-msg-cursor);
        pointer-events: var(--tabview-msg-pointer-events);
    }

    yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer,
    yt-live-chat-membership-item-renderer.style-scope.yt-live-chat-item-list-renderer,
    yt-live-chat-paid-message-renderer.style-scope.yt-live-chat-item-list-renderer,
    yt-live-chat-banner-manager.style-scope.yt-live-chat-item-list-renderer {
        contain: layout style;
    }

    tp-yt-paper-tooltip[style*="inset"][role="tooltip"] {
        contain: layout paint style;
    }

    /*
    yt-live-chat-banner-renderer[collapsed] #contents, yt-live-chat-banner-renderer[collapsed] #contents * {

      content-visibility: visible !important;
      contain: none !important;

    }
    */

     
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

    `.trim();
  });


  let iframePointEventsAllow = false; // default to discard unnecessary mouse events for iframe

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

  function durationLocaleEN(durationInfo) {

    const { hrs, mins, seconds } = durationInfoTS(durationInfo)
    let ret = []
    ret.push(`Duration:`)
    if (hrs > 0) ret.push(`${hrs} ${hrs === 1 ? 'hour' : 'hours'}`)
    if (mins > 0) ret.push(`${mins} ${mins === 1 ? 'minute' : 'minutes'}`)
    if (seconds !== null) ret.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)
    return ret.join(' ')
  }

  function formatDateResultEN(type, req) {

    const { bd1, bd2, durationInfo, formatDates } = formatDateReqTS(req)

    switch (type) {
      case 0x200:
        return [
          `The livestream was in ${bd1.lokStringDate()} from ${bd1.lokStringTime()} to ${bd2.lokStringTime()}. [GMT${getGMT()}]`,
          durationLocaleEN(durationInfo)
        ].join('\n');
      case 0x210:
        return [
          `The livestream was from ${bd1.lokStringDate()} ${bd1.lokStringTime()} to ${bd2.lokStringDate()} ${bd2.lokStringTime()}. [GMT${getGMT()}]`,
          durationLocaleEN(durationInfo)
        ].join('\n');
      case 0x300:
        return `The livestream started at ${bd1.lokStringTime()} [GMT${getGMT()}] in ${bd1.lokStringDate()}.`;
      case 0x600:
        return `The video was uploaded in ${formatDates.uploadDate} and published in ${formatDates.publishDate}.`;
      case 0x610:
        return `The video was uploaded in ${formatDates.uploadDate}.`;
      case 0x700:
        return `The video was published in ${formatDates.publishDate}.`;
    }
    return '';

  }

  const S_GENERAL_RENDERERS = ['YTD-TOGGLE-BUTTON-RENDERER', 'YTD-MENU-RENDERER']

  let globalHook_symbols = [];
  let globalHook_hashs = {};


  let singleColumnScrolling_dt = 0;

  let isStickyHeaderEnabled = false;

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
    cn1: {},
    cn2: {},
    setTimeout( /** @type {TimerHandler} */ f,/** @type {number} */ d) {
      let cid = setTimeout(f, d)
      timeline.cn1[cid] = true
      return cid;
    },
    clearTimeout(/** @type {number} */ cid) {
      timeline.cn1[cid] = false; return clearTimeout(cid)
    },
    setInterval(/** @type {TimerHandler} */ f,/** @type {number} */ d) {
      let cid = setInterval(f, d);
      timeline.cn2[cid] = true
      return cid;
    },
    clearInterval(/** @type {number} */ cid) {
      timeline.cn2[cid] = false; return clearInterval(cid)
    },
    reset() {
      for (let cid in timeline.cn1) timeline.cn1[cid] && clearTimeout(cid)
      for (let cid in timeline.cn2) timeline.cn2[cid] && clearInterval(cid)
      timeline.cn1 = {}
      timeline.cn2 = {}
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
        return new Promise(f)
      }).catch(console.warn)
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


    lokStringDate() {
      const d = this

      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let date = d.getDate()

      let sy = y < 1000 ? (`0000${y}`).slice(-4) : '' + y

      let sm = m < 10 ? '0' + m : '' + m
      let sd = date < 10 ? '0' + date : '' + date

      return `${sy}.${sm}.${sd}`

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
  ObserverRegister.uidStore = {}; //backward compatible with FireFox 55.


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

  async function nativeCall(/** @type {EventTarget} */ dom, /** @type {any[]} */ detail) {
    //console.log(1231)
    dom.dispatchEvent(new CustomEvent("userscript-call-dom", { detail: detail }))
    //console.log(1232)
  }

  async function nativeFunc(/** @type {EventTarget} */ dom, /** @type {string} */ property, /** @type {any} */ args) {
    dom.dispatchEvent(new CustomEvent("userscript-call-dom-func", { detail: { property, args } }))
  }

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

  function enterPIP(video) {
    if (video && typeof video.requestPictureInPicture === 'function' && isVideoPlaying(video)) {
      if (document.pictureInPictureElement === null && typeof document.exitPictureInPicture === 'function') {
        video.requestPictureInPicture().then(res => {

        }).catch(console.warn)
      }
    }
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
    columns.appendChild(elmA); // append to dom first before observe
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

    let secondary = secondaryInner.parentNode;
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

    let secondary = secondaryInner.parentNode;
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
    let isChatPopupedF = ()=>{
      return _isChatPopupedF===null ? ( _isChatPopupedF = cssElm.classList.contains('tyt-chat-popup') ) : _isChatPopupedF
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
       

        if(cisChatPopupedF()){
        }else{

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

  function hideTabBtn(tabBtn) {
    //console.log('hideTabBtn', tabBtn)
    let isActiveBefore = tabBtn.classList.contains('active');
    tabBtn.classList.add("tab-btn-hidden");
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
    if (!isDonationShelfExpanded()){
      let btn = document.querySelector('#tyt-donation-shelf-toggle-btn')
      if(btn){
        btn.click();
        return true;
      }
    }
    return false;
  }
  function closeDonationShelf() {
    if (isDonationShelfExpanded()){
      let btn = document.querySelector('#tyt-donation-shelf-toggle-btn')
      if(btn){
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
        if (target_container) target_container.appendChild(right_tabs) // last-child

        tab_videos.appendChild(relatedElm);
        // no any other element set these attr. only init / relocation
        relatedElm.setAttribute('placeholder-for-youtube-play-next-queue', '')
        relatedElm.setAttribute('placeholder-videos', '')

        makeVideosAutoLoad2();

      }

    }


    /** @type {HTMLElement | null} */
    let chatroom = null;
    if (chatroom = document.querySelector('*:not([data-positioner="before|#chat"]) + ytd-live-chat-frame#chat, ytd-live-chat-frame#chat:first-child')) {

      let pHolderElm = document.querySelector('tabview-view-pholder[data-positioner="before|#chat"]');
      if (pHolderElm) pHolderElm.remove();

      if (document.querySelector('.YouTubeLiveFilledUpView')) {
        // no relocation
      } else {

        let rightTabs = document.querySelector('#right-tabs');
        if (rightTabs) {
          insertBeforeTo(chatroom, rightTabs);
        }

      }

      if (!pHolderElm) {
        pHolderElm = document.createElement('tabview-view-pholder');
        pHolderElm.setAttribute('data-positioner', 'before|#chat');
      }

      insertBeforeTo(pHolderElm, chatroom)

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

  function autoCompletePosCreate(){
    
    let positioner = document.createElement("tabview-view-autocomplete-pos");
    let oldPositioner = document.querySelector("tabview-view-autocomplete-pos");
    if(oldPositioner) oldPositioner.remove();
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

    let positioner = searchBox.nextSibling;
    if (positioner) {
      if (positioner.nodeName.toLowerCase() !== "tabview-view-autocomplete-pos") {
        positioner = autoCompletePosCreate();
        insertAfterTo(positioner, searchBox);
      }
    } else {
      positioner = autoCompletePosCreate();
      prependTo(positioner, searchBox.parentNode);
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

        autocomplete.parentNode.setAttribute('position-fixed-by-tabview-youtube', '');
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
      HTMLElement.prototype.insertBefore.call(target.parentNode, elm, target);
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
      HTMLElement.prototype.insertBefore.call(target.parentNode, elm, target.nextSibling);
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
      HTMLElement.prototype.insertBefore.call(target, elm, target.firstChild);
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
      prependTo(button, button.parentNode);
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
      docFrag.appendChild(w);
      w.appendChild(playlist);
      tab_list.appendChild(docFrag);
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
            nativeCall(expander, [
              { 'property': 'canToggleJobId', 'value': 1 }, // false disable calculateCanCollapse in childrenChanged
              { 'property': 'alwaysToggleable', 'value': false }, // this is checked in childrenChanged
              { 'property': 'recomputeOnResize', 'value': false }, // no need to check toggleable
              { 'property': 'isToggled', 'value': true }, // show full content
              { 'property': 'canToggle', 'value': false }, // hide show more or less btn
              { 'property': 'collapsedHeight', 'value': 999999 } // disable collapsed height check
            ])

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
                let sp = s[0].parentNode
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


        let subscribersCount = document.querySelector('#primary.ytd-watch-flexy #below ytd-watch-metadata #owner #owner-sub-count')

        if (subscribersCount) {
          if (!subscribersCount.hasAttribute('title')) {
            // assume YouTube native coding would not implement [title]

            let ytdWatchMetaDataElm = closestDOM.call(subscribersCount, 'body #primary.ytd-watch-flexy #below ytd-watch-metadata[modern-metapanel-order]:not([tabview-uploader-hover])');
            if (ytdWatchMetaDataElm) {
              ytdWatchMetaDataElm.setAttribute('tabview-uploader-hover', '')
              let _h = 0;
              ytdWatchMetaDataElm.addEventListener('transitionend', function (evt) {
                // no css selector rule required; no delay js function call required

                if (evt.propertyName === 'background-position-y') { // string comparision only

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

                } else if (evt.propertyName === 'background-position-x') { // string comparision only

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
        let m = txt.match(/[\d\,\s]+/)
        if (m) {
          r = m[0].trim()
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
  function innerDOMCommentsCountLoader() {
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
      tabBtn.classList.remove("tab-btn-hidden")
    }

    _console.log(2905)


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

  const domInit_teaserInfo = () => {
    //obsolete?

    let teaserInfo = document.querySelector('#description-and-actions.style-scope.ytd-watch-metadata > #description ytd-text-inline-expander:not([tabview-removed-duplicate])');

    if (!teaserInfo) return;

    // for Teaser UI
    // once per {#description-and-actions.style-scope.ytd-watch-metadata > #description > ytd-text-inline-expander} detection

    const ytdFlexyElm = es.ytdFlexy;
    if (!scriptEnable || !ytdFlexyElm) return;
    let addedInfo = document.querySelector('#tab-info ytd-expander[tabview-info-expander]');

    if (!addedInfo) return;

    scriptletDeferred.debounce(() => {

      teaserInfo.setAttribute('tabview-removed-duplicate', '')
      teaserInfo.dispatchEvent(new CustomEvent('tabview-no-duplicate-info'))

    })


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

      renderDeferred.resolved && resultCommentsCountCaching(innerDOMCommentsCountLoader());
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
        tabBtn.classList.remove("tab-btn-hidden") //if contains

      } else if (isCommentHidden) {

        ytdFlexyElm.setAttribute('tyt-comments', 'Kh');
        if (pageType === 'watch' && Q.comments_section_loaded === 1) {
          emptyCommentSection();
          _console.log(9360, 72);
        }

      }


    },

    mtf_attrChatroom: (attrName, newValue) => {
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
          if(btn) btn.remove();
        }

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


    for (const elem of document.querySelectorAll('ytd-expander[tabview-info-expander]')) {
      elem.removeAttribute('tabview-info-expander');
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
      `<a id="tab-btn1" tyt-di="q9Kjc" tyt-tab-content="#tab-info" class="tab-btn">${sTabBtnInfo}${str1}${str_fbtns}</a>`,
      `<a id="tab-btn3" tyt-di="q9Kjc" tyt-tab-content="#tab-comments" class="tab-btn">${svgElm(16, 16, 120, 120, svgComments)}<span id="tyt-cm-count"></span>${str1}${str_fbtns}</a>`,
      `<a id="tab-btn4" tyt-di="q9Kjc" tyt-tab-content="#tab-videos" class="tab-btn">${sTabBtnVideos}${str1}${str_fbtns}</a>`,
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
                <div id="tab-info" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-comments" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-videos" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-list" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
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
        tabComments.appendChild(comments);
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
      new Promise(() => {
        func(evt);
      })

    }, capturePassive)

  }

  async function makeHeaderFloat() {
    if (isMakeHeaderFloatCalled) return;
    isMakeHeaderFloatCalled = true;
    await Promise.resolve(0);


    const [header, headerP, navElm] = await Promise.all([
      new Promise(f => f(document.querySelector("#right-tabs header"))),

      new Promise(f => f(document.querySelector("#right-tabs tabview-view-pos-thead"))),

      new Promise(f => f(document.querySelector('#masthead-container, #masthead')))

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
        mtoVisibility_Playlist.observer.check(9); //delay check required for browser bug - hidden changed not triggered 
      }
      m_playlist = null;

    }

    FP.mtf_attrPlaylist();

    Promise.resolve(0).then(() => {
      // ['tab-btn', 'tab-btn', 'tab-btn active', 'tab-btn tab-btn-hidden']
      // bug
      const ytdFlexyElm = es.ytdFlexy;
      if (!scriptEnable || !ytdFlexyElm) return;
      if (!switchTabActivity_lastTab && (ytdFlexyElm.getAttribute('tyt-tab') + '').indexOf('#tab-') === 0 && /https\:\/\/www\.youtube\.com\/watch.*[\?\&]list=[\w\-\_]+/.test(location.href)) {
        if (setToActiveTab('#tab-list')) switchTabActivity_lastTab = '#tab-list';
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

    if(_isPageFirstLoaded && location.pathname==='/watch') document.documentElement.setAttribute('tyt-lock', '')

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
        innerDOMCommentsCountLoader(); //ensure the previous record is saved
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
      renderDeferred.resolved && resultCommentsCountCaching(innerDOMCommentsCountLoader());
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


      let ret = innerDOMCommentsCountLoader();
      resultCommentsCountCaching(ret);

      if (fetchCounts.new && !fetchCounts.fetched) {

        _console.log(4512, 4, Q.comments_section_loaded, fetchCounts.new, !fetchCounts.fetched)
        if (fetchCounts.new.f()) {
          fetchCounts.fetched = true;
          _console.log(9972, 'fetched = true')
          fetchCommentsFinished();
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
            _console.log(9972, 'fetched = true')
            //return true;
            fetchCommentsFinished();
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


  let g_check_detail_A = 0;
  let checkDuplicateRes = null;
  function setHiddenStateForDesc(){
    let ytdFlexyElm = es.ytdFlexy
    if (!ytdFlexyElm) return
    let hiddenBool = !document.fullscreenElement ? ytdFlexyElm.classList.contains('tabview-info-duplicated') : false
    let elm
    elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-watch-metadata.ytd-watch-flexy[modern-metapanel] #description #plain-snippet-text')
    if (elm) {
      wAttr(elm, 'hidden', hiddenBool)
    }
    elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-watch-metadata.ytd-watch-flexy[modern-metapanel] #description #formatted-snippet-text')
    if (elm) {
      wAttr(elm, 'hidden', hiddenBool)
    }
  }
  function checkDuplicatedInfo_then(isCheck, checkDuplicateRes) {

    const ytdFlexyElm = es.ytdFlexy;
    if (!ytdFlexyElm) return; //unlikely

    let cssbool_c1 = false, cssbool_c2 = false, cssbool_c3 = false;
    if (isCheck === 5) {

      if (ytdFlexyElm.matches('.tabview-info-duplicated[flexy]')) {
        cssbool_c1 = !!querySelectorFromAnchor.call(ytdFlexyElm, '#description.style-scope.ytd-watch-metadata > #description-inner:only-child');
        cssbool_c2 = !!querySelectorFromAnchor.call(ytdFlexyElm, '#tab-info ytd-expander #description.ytd-video-secondary-info-renderer');
        cssbool_c2 = !!querySelectorFromAnchor.call(ytdFlexyElm, '#tab-info ytd-expander ytd-rich-metadata-renderer.ytd-rich-metadata-row-renderer');
      }

      if (typeof checkDuplicateRes === 'boolean') {
        setHiddenStateForDesc();
      }
    }

    ytdFlexyElm.setAttribute('tyt-has', `${cssbool_c1 ? 'A' : 'a'}${cssbool_c2 ? 'B' : 'b'}${cssbool_c3 ? 'C' : 'c'}`);

  }
  function checkDuplicatedInfo(req) {
    // console.log('checkDuplicatedInfo')


    async function checkDuplicatedInfoContentEqual(desc1, desc2) {
      // basically desc1 and desc2 are content identical
      // however, class name order could be different

      let txt1 = new Promise(r => r(desc1.textContent))

      let txt2 = new Promise(r => r(desc2.textContent))


      let [res1, res2] = await Promise.all([txt1, txt2]);

      return { res: res1 === res2 }
    }

    async function checkDuplicatedInfoInner() {

      const ytdFlexyElm = es.ytdFlexy;
      if (!ytdFlexyElm) return; //unlikely

      let t = Date.now();
      g_check_detail_A = t;

      ytdFlexyElm.classList.toggle('tabview-info-duplicated', true) // hide first;

      await new Promise(resolve => setTimeout(resolve, 1)); // mcrcr might be not yet initalized


      if (g_check_detail_A !== t) return;

      let elm
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-watch-metadata.ytd-watch-flexy[modern-metapanel] #description #plain-snippet-text')
      if (elm) {
        wAttr(elm, 'hidden', false)
      }
      elm = document.querySelector('.tabview-info-duplicated-checked[flexy] ytd-watch-metadata.ytd-watch-flexy[modern-metapanel] #description #formatted-snippet-text')
      if (elm) {
        wAttr(elm, 'hidden', false)
      }
      await Promise.resolve(0);

      // the class added before can be removed from the external coding

      function mrcrf(mrcr) {
        let tmp;
        if (mrcr) {
          if (tmp = querySelectorFromAnchor.call(mrcr, '#always-shown[hidden]:empty')) tmp.removeAttribute('hidden')
          if (tmp = querySelectorFromAnchor.call(mrcr, '#collapsible[hidden]:empty')) tmp.removeAttribute('hidden')
        }
      }

      let mrcr1 = document.querySelector('ytd-watch-metadata.ytd-watch-flexy[modern-metapanel] > ytd-metadata-row-container-renderer.style-scope.ytd-watch-metadata')
      mrcrf(mrcr1);
      await Promise.resolve(0);
      let mrcr2 = document.querySelector('ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer.style-scope.ytd-video-secondary-info-renderer')
      mrcrf(mrcr2);
      await Promise.resolve(0);

      let desc1 = null;
      let desc2 = document.querySelector('ytd-expander.ytd-video-secondary-info-renderer #description.style-scope.ytd-video-secondary-info-renderer > yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer[split-lines]:not(:empty)');
      await Promise.resolve(0);

      if (desc2 && desc2.firstElementChild === null) {
        // plainText = true;
        desc1 = document.querySelector('ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata #plain-snippet-text.ytd-text-inline-expander');
      }
      if (!desc1) desc1 = document.querySelector('ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata yt-formatted-string#formatted-snippet-text.style-scope.ytd-text-inline-expander:not(:empty)');
      await Promise.resolve(0);

      if (desc1) {
        let parentContainer = req.descMetaLines;
        // hidden

        // example video
        // https://www.youtube.com/watch?v=R65uouhSYJ0

        if (parentContainer) {

          let m = querySelectorFromAnchor.call(parentContainer, 'ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata yt-formatted-string[split-lines].ytd-text-inline-expander');

          if (m) {

            if (m.hasAttribute('hidden')) {

              let expandBtn = querySelectorFromAnchor.call(parentContainer, 'tp-yt-paper-button#expand.ytd-text-inline-expander:not([hidden])');

              if (expandBtn) {

                expandBtn.click();
                await new Promise(r => setTimeout(r, 30));
                if (!m.hasAttribute('hidden')) desc1 = m;
              }

            } else {

              desc1 = m;

            }

          }

        }
      }

      //console.log(desc1, desc2)

      let infoDuplicated = true;

      let mb1 = null, mb2 = null;

      if (desc2 === null && desc1 !== null && desc1.textContent === '') {
        // example: https://www.youtube.com/watch?v=l9m3OpH9pbI
        desc1 = null
      }

      if ((desc1 === null) ^ (desc2 === null)) {
        infoDuplicated = false;
      } else if ((mrcr1 === null) ^ (mrcr2 === null)) {
        infoDuplicated = false;
      } else {

        await Promise.all([

          (mrcr1 !== mrcr2 && mrcr1 !== null && mrcr2 !== null) ?
            checkDuplicatedInfoContentEqual(mrcr1, mrcr2).then((o) => {
              //console.log('mrcr', o.res)
              let { res, pNodeA, pNodeB } = o;
              mb1 = res;

              if (res !== true) infoDuplicated = false;
            }) : null,

          (desc1 !== desc2 && desc1 !== null && desc2 !== null) ?
            checkDuplicatedInfoContentEqual(desc1, desc2).then((o) => {
              //console.log('desc', o.res)
              let { res, pNodeA, pNodeB } = o;
              mb2 = res;

              if (!mb2) {
                // console.log('mb2', desc1, desc2, desc1.textContent, desc2.textContent)
              }

              if (res !== true) infoDuplicated = false;

            }) : null

        ]);

      }
      req = null;

      console.log('[tyt] modern-info-duplicate', `(r, b1, b2) = (${infoDuplicated ? 1 : 0}, ${mb1 ? 1 : 0}, ${mb2 ? 1 : 0})`, `${infoDuplicated && mb1 && mb2 ? 'Success' : 'Failed'}`)

      if (g_check_detail_A !== t) return;

      //ytdFlexyElm.classList.toggle('tabview-info-duplicated', infoDuplicated)
      checkDuplicateRes = infoDuplicated;

      return 5; // other than 5, duplicated check = false

    };


    return checkDuplicatedInfoInner();


  }


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
      new Promise(() => {
        if (node.contains(activeElement)) {
          activeElement.blur();
        }
      })
    }
  }

  async function setupVideo(node){
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

      if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
        fetchCounts.new.f();
        fetchCounts.fetched = true;

        fetchCommentsFinished();
        _console.log(9972, 'fetched = true')
      }

      _console.log(2178, 4)
      pageCheck();

      domInit_comments();
      setupChatFrameDOM(null);


    });


  });

  function ytMicroEventsInit() {

    _console.log(902)

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
      console.log('[tyt] pageRendered')

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

          new Promise(() => {

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

        if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
          fetchCounts.new.f();
          fetchCounts.fetched = true;

          fetchCommentsFinished();
          _console.log(9972, 'fetched = true')
        }


        // if the page is navigated by history back-and-forth, not all engagement panels can be catched in rendering event.



        _console.log(2178, 3)
        pageCheck();
        setupChatFrameDOM(null);

        let expander = document.querySelector('#meta-contents ytd-expander:not([tabview-info-expander])');
        if (expander) {

          // once per $$native-info-description$$ {#meta-contents ytd-expander} detection
          // append the detailed meta contents to the tab-info

          expander.setAttribute('tabview-info-expander', '');
          let tabInfo = document.querySelector("#tab-info");
          if (tabInfo) {
            tabInfo.appendChild(expander);
          }

        }


        if (REMOVE_DUPLICATE_INFO) {


          checkDuplicateRes = null;
          async function alCheckFn(ks) {

            let alCheckCount = 4;
            let alCheckInterval = 270;

            checkDuplicateRes = null;
            let descExpandState = null;
            let descMetaExpander = document.querySelector('ytd-watch-metadata[modern-metapanel][clickable-description]');
            let descToggleBtn = null;
            let descMetaLines = null;
            if (descMetaExpander) {

              // ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata
              descMetaLines = querySelectorFromAnchor.call(descMetaExpander, 'ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata')
              if (descMetaLines) {

                descToggleBtn = querySelectorFromAnchor.call(descMetaLines, 'tp-yt-paper-button#collapse[role="button"]:not([hidden]), tp-yt-paper-button#expand[role="button"]:not([hidden])');
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

            try{

                
              let req = {
                descExpandState,
                descMetaExpander,
                descToggleBtn,
                descMetaLines
              }

              do {

                if (renderIdentifier !== ks) break;
                if (alCheckCount === 0) break;
                if (checkDuplicateRes === true) break;
                checkDuplicateRes = null;

                let res = await checkDuplicatedInfo(req); //async
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

              descToggleBtn = descMetaLines ? querySelectorFromAnchor.call(descMetaLines, 'tp-yt-paper-button#collapse[role="button"]:not([hidden]), tp-yt-paper-button#expand[role="button"]:not([hidden])') : null;
              if (descToggleBtn) {

                let isCollapsed = descMetaExpander.hasAttribute('description-collapsed')
                let id = descToggleBtn.id
                let b1 = descExpandState === true && isCollapsed && id === 'expand';
                let b2 = descExpandState === false && !isCollapsed && id === 'collapse';

                if (b1 || b2) {
                  descToggleBtn.click();
                }

              }

              
              req = null;


            }catch(e){

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

        } else {

          checkDuplicatedInfo_then(0, null);

        }

        let renderId = renderIdentifier
        renderDeferred.debounce(() => {
          if (renderId !== renderIdentifier) return
          domInit_teaserInfo() // YouTube obsoleted feature? 


          let h1 = document.querySelector('#below h1.ytd-watch-metadata yt-formatted-string')
          if (h1) {


            let s = '';
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

              const formatDateResult = formatDateResultEN

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

            if (s) {
              h1.setAttribute('data-title-details', s)
            } else {
              h1.removeAttribute('data-title-details')
            }

          }

        })


        checkPlaylistForInitialization();

        mtf_fix_details().then(() => {
          // setKeywords();
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

        if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
          fetchCounts.new.f();
          fetchCounts.fetched = true;

          fetchCommentsFinished();
          _console.log(9972, 'fetched = true')
        }

        if (nodeName === 'YTD-WATCH-FLEXY') {
          domInit_comments();
          if (mtf_forceCheckLiveVideo_disable !== 2) {
            _console.log(3713, Q.comments_section_loaded, fetchCounts.fetched, 'fetch comments')
            if (document.querySelector(`ytd-comments#comments`).hasAttribute('hidden')) {
              // unavailable apart from live chat
              _disableComments();
              _console.log(3713, 3, 'comments hidden')
            } else if (Q.comments_section_loaded === 0) {
              getFinalComments();
            }
          }
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


  function forceDisplayChatReplay() {
    let items = chatFrameElement('yt-live-chat-item-list-renderer #items');
    if (items && items.childElementCount !== 0) return;

    let videoElm = document.querySelector('ytd-player#ytd-player video');

    let ct = videoElm.currentTime;
    if (ct >= 0 && !videoElm.ended && videoElm.readyState > videoElm.HAVE_CURRENT_DATA) {
      let chat = document.querySelector('ytd-live-chat-frame#chat');
      if (chat) {
        nativeFunc(chat, "postToContentWindow", [{ "yt-player-video-progress": ct }])
      }
    }

  }

  function checkIframeDblClick() {
    setTimeout(() => {

      let Itemslist = chatFrameElement('#contents.yt-live-chat-renderer');
      if (Itemslist && typeof Itemslist.ondblclick === 'function') iframePointEventsAllow = true;

      if (iframePointEventsAllow) {
        chatFrameElement('body').classList.add('tabview-allow-pointer-events');
      }

    }, 300)
  }

  function addPopupButton(chat) {
    let showHideBtn = chat.querySelector('div#show-hide-button')
    if (showHideBtn) {

      let btn;
      btn = document.querySelector('tyt-iframe-popup-btn')
      if (btn) btn.remove();

      btn = document.createElement('tyt-iframe-popup-btn')
      showHideBtn.appendChild(btn)
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
      if (!scriptEnable || !isChatExpand()) return;

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


          // console.log(702, 10)
          forceDisplayChatReplay();
          checkIframeDblClick(); // user request for compatible with https://greasyfork.org/en/scripts/452335
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

  let videosDeferred = new Deferred();

  let _navigateLoadDT = 0;

  function setupTabBtns(){

    const materialTab = document.querySelector("#material-tabs")
    if (!materialTab) return;

    if (tabsUiScript_setclick) return;
    tabsUiScript_setclick = true;

    let fontSizeBtnClick = null;

    materialTab.addEventListener('click', function (evt) {

      if (!evt.isTrusted) return; // prevent call from background
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

    

    function getDefaultTabBtnSetting(store){
      
      if (!store) return;
      let myDefaultTab=  store[key_default_tab];
      if (!myDefaultTab || typeof myDefaultTab !== 'string' || !/^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab)) return;
      if (document.querySelector(`.tab-btn[tyt-tab-content="${myDefaultTab}"]:not(.tab-btn-hidden)`)) settings.defaultTab = myDefaultTab;

    }

    let store = getStore();
    updateCSS_fontsize(store);
    getDefaultTabBtnSetting(store);

  }

  function setMyDefaultTab(myDefaultTab_tmp){

    let myDefaultTab_final = null
    if (myDefaultTab_tmp && typeof myDefaultTab_tmp === 'string' && /^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab_tmp)){
      if (document.querySelector(`.tab-btn[tyt-tab-content="${myDefaultTab_tmp}"]`)) myDefaultTab_final = myDefaultTab_tmp;
    }

    let store = getStore();
    if(myDefaultTab_final) {
      store[key_default_tab] = myDefaultTab_final;
      settings.defaultTab = myDefaultTab_final;
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

  async function onNavigationEndAsync(isPageFirstLoaded) {

    if (pageType !== 'watch') return


    let tdt = Date.now();
    _navigateLoadDT = tdt;

    // avoid blocking the page when youtube is initializing the page
    const promiseDelay = new Promise(requestAnimationFrame)
    const promiseVideoRendered = videosDeferred.d()
    await Promise.all([promiseVideoRendered, promiseDelay])

    if (_navigateLoadDT !== tdt) return;
    if (ytEventSequence !== 3) return;

    const ytdFlexyElm = document.querySelector('ytd-watch-flexy')

    if (!ytdFlexyElm) {
      ytdFlexy = null
      return;
    }

    scriptEnable = true;

    ytdFlexy = mWeakRef(ytdFlexyElm)

    const related = querySelectorFromAnchor.call(ytdFlexyElm, "#related.ytd-watch-flexy");
    if (!related) return;

    // isPageFirstLoaded && console.time("Tabview Youtube Render")

    if (!document.querySelector("#right-tabs")) {
      getLang();
      let docTmp = document.createElement('template');
      docTmp.innerHTML = getTabsHTML();
      let newElm = docTmp.content.firstElementChild;
      if (newElm !== null) {
        insertBeforeTo(newElm, related);
        querySelectorFromAnchor.call(newElm, '#material-tabs').addEventListener('mousemove', (evt)=>{
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
        }, true);
        setupTabBtns();
        console.log('[tyt] #right-tabs inserted')
      }
      docTmp.textContent = '';
      docTmp = null;
    }

    if (!ytdFlexyElm.hasAttribute('tyt-tab')) ytdFlexyElm.setAttribute('tyt-tab', '')

    // append the next videos 
    // it exists as "related" is already here
    fixTabs();
    
    let switchToDefaultTabNotAllowed = false;

    if (document.querySelector('ytd-watch-flexy[tyt-chat^="+"]')){
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

    isPageFirstLoaded && document.documentElement.removeAttribute('tyt-lock')

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


  function setKeywords() {

    return;

    if (typeof String.prototype.replacei !== 'function') {
      // reference: https://stackoverflow.com/questions/7313395/case-insensitive-replace-all
      String.replacei = String.prototype.replacei = function (rep, rby) {
        var pos = this.toLowerCase().indexOf(rep.toLowerCase());
        return pos == -1 ? this : this.substring(0, pos) + rby(this.substring(pos, pos + rep.length)) + this.substring(pos + rep.length);
      };
    }

    let data = pageFetchedData;
    console.log(data)


    let keywords = ((((data || 0).pageData || 0).playerResponse || 0).videoDetails || 0).keywords;
    console.log(keywords)

    if (keywords && keywords.length > 0) {


      let title = '';

      try {
        title = ((((data || 0).pageData || 0).response || 0).contents || 0).twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.title.runs[0].text;
        if (typeof title !== 'string') title = '';
      } catch (e) { }

      let strText = title;

      let tabsDeferredSess = pageSession.session();
      if (!scriptEnable && tabsDeferred.resolved) { }
      else tabsDeferred.debounce(() => {

        if (!tabsDeferredSess.isValid) return;
        tabsDeferredSess = null;


        let res = [];
        for (const keyword of keywords) {
          if (strText.toUpperCase().includes(keyword.toUpperCase())) {
            res.push(keyword);
          }
        }
        if (res.length > 0) {
          console.log('tabview video keywords', res)
          window.postMessage({
            tabview: {
              eventType: 0x3700,
              eventDetail: {
                keywords: res
              }
            }
          }, location.origin);
        }



        let strElms = document.querySelectorAll('#title.ytd-watch-metadata yt-formatted-string.style-scope.ytd-watch-metadata');
        //console.log(keywords,strElms)
        for (const strElm of strElms) {
          if (strElm.id == 'super-title' || strElm.id == 'original-info') {

          } else {
            if (strElm.querySelector('*')) {

            } else {
              /** @type{string} */
              let strText = strElm.textContent;
              if (strText) {

                let res = [];
                for (const keyword of keywords) {
                  if (strText.toUpperCase().includes(keyword.toUpperCase())) {
                    res.push(keyword);
                  }
                }
                if (res.length > 0) {
                  console.log('tabview video keywords', res)

                  if (res.length > 1) res.sort((a, b) => { return b.length - a.length });
                  let usedKeywords = {};
                  for (const s of res) {
                    strText = strText.replacei(s, ((s) => {
                      usedKeywords[s] = true;
                      return `\n${s}\n`
                    }))
                  }
                  strText = strText.replace(`\n\n+`, '\n')
                  let retElms = strText.split('\n').map(w => {
                    let elm = document.createElement('tabview-txt')
                    if (usedKeywords[w]) elm.classList.add('tabview-title-keyword')
                    elm.textContent = w;
                    return elm
                  })

                  let p = querySelectorFromAnchor.call(strElm.parentNode, '.tabview-txt');

                  if (!p) {
                    p = strElm.cloneNode(false)
                    p.classList.add('tabview-txt')
                    strElm.after(p);
                  } else {
                    strElm.after(p);
                  }

                  requestAnimationFrame(() => {

                    p.textContent = 'x';
                    p.firstChild.replaceWith(...retElms);
                    p.removeAttribute('is-empty')
                    strElm.setAttribute('is-empty', '')

                  })


                }
                break;
              }
            }
          }
        }

      })

    }


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
        if(pInner){
          pInner.style.setProperty('--tyt-desc-top-h', `${nw ? nw : 0}px`)
        }
      }

      runAsync(dom, bool);


    }

  }

  function immediateCheck() {


    if (!scriptEnable) return;

    if(fT(wls.layoutStatus, LAYOUT_TWO_COLUMNS, LAYOUT_TAB_EXPANDED | LAYOUT_ENGAGEMENT_PANEL_EXPANDED | LAYOUT_DONATION_SHELF_EXPANDED | LAYOUT_THEATER | LAYOUT_FULLSCREEN | LAYOUT_CHATROOM_EXPANDED)){
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

  document.addEventListener('tabview-fix-layout',()=>{
    
    immediateCheck()

  },false)


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
        } else {
          link.classList.add("active");
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
      new Promise(f => f(document.querySelector("#right-tabs"))),

      new Promise(f => f(document.querySelector("#right-tabs header"))),

      new Promise(f => f(document.querySelector('#masthead-container, #masthead'))),

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
      new Promise(f => f(navElm ? navElm.offsetHeight : 0)),
      new Promise(f => f(targetElm.offsetTop))
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
      new Promise(f => f(document.querySelector("#right-tabs"))),
      new Promise(f => f(document.querySelector("#right-tabs header")))
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

    console.log('[tyt] newVideoPage')

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
            tabBtn.classList.remove("tab-btn-hidden")
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


      if (renderDeferred.resolved && Q.comments_section_loaded === 0 && fetchCounts.new && !fetchCounts.fetched) {
        fetchCounts.new.f();
        fetchCounts.fetched = true;
        _console.log(9972, 'fetched = true')

        fetchCommentsFinished();
      }

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

    let nodeName = (((evt||0).target||0).nodeName||'').toUpperCase()
    if (nodeName !== 'YTD-APP') return;

    let pageFetchedDataLocal = evt.detail;

    let d_page = ((pageFetchedDataLocal||0).pageData||0).page;
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

    formatDates={}
    try{
      formatDates.publishDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.publishDate
    }catch(e){}
    // 2022-12-30

    try{
      formatDates.uploadDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.uploadDate
    }catch(e){}
    // 2022-12-30

    try{
      formatDates.publishDate2 = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.dateText.simpleText
    }catch(e){}
    // 2022/12/31

    if(typeof formatDates.publishDate2==='string' && formatDates.publishDate2 !== formatDates.publishDate){
      formatDates.publishDate = formatDates.publishDate2
      formatDates.uploadDate = null
    }

    try{
      formatDates.broadcastBeginAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.startTimestamp
    }catch(e){}
    try{
      formatDates.broadcastEndAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.endTimestamp
    }catch(e){}
    try{
      formatDates.isLiveNow = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.isLiveNow
    }catch(e){}

    promiseChatDetails = new Promise(resolve => {
      if (ytEventSequence >= 2) {
        let liveChatRenderer = null;
        try {
          liveChatRenderer = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer
        } catch (e) { }
        chatroomDetails = liveChatRenderer ? extractInfoFromLiveChatRenderer(liveChatRenderer) : null;
        liveChatRenderer = null; // release memory for GC, just in case
      }
      resolve(0)
    })

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
          ytdFlexyElm.appendChild(elmPL);
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
      pageSeqMutex.lockWith(unlock=>{
        pageBeingInit();
        unlock();
      })
    }
  }

  function pageSeq2(evt) {
    _navigateLoadDT = 0

    if (ytEventSequence !== 1) {
      ytEventSequence = 1
      pageSeqMutex.lockWith(unlock=>{
        pageBeingInit();
        unlock();
      })
    }
    if (ytEventSequence === 1) {
      ytEventSequence = 2

      
      pageType = null
      
      pageSeqMutex.lockWith(unlock=>{
        
        let mIsPageFirstLoaded = _isPageFirstLoaded
        
        pageType = null
        // mIsPageFirstLoaded && console.time("Tabview Youtube Load")
        pageBeingFetched(evt, mIsPageFirstLoaded)
        // mIsPageFirstLoaded && console.timeEnd("Tabview Youtube Load")
        // ytMicroEventsInit set + tabview-loaded delay set
        new Promise(() => {
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


  function manualResizeT(){

    if (!scriptEnable) return;
    if (pageType !== 'watch') return;
    //lastResizeAt = Date.now();

    if((wls.layoutStatus & LAYOUT_FULLSCREEN) === LAYOUT_FULLSCREEN ){

    }else if ((wls.layoutStatus & LAYOUT_TWO_COLUMNS) === 0) {
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
      Promise.resolve(0).then(()=>{
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


  document.addEventListener("tyt-chat-popup",(evt)=>{

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

  document.addEventListener("tabview-plugin-loaded",()=>{

    scriptletDeferred.resolve();

    if(MINIVIEW_BROWSER_ENABLE){
      document.dispatchEvent(new CustomEvent("tabview-miniview-browser-enable"));
    }

  }, false)

  if (isGMAvailable() && typeof GM_registerMenuCommand === 'function') {
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
  }


  document.documentElement.setAttribute('plugin-tabview-youtube', `${scriptVersionForExternal}`)
  if(document.documentElement.getAttribute('tabview-unwrapjs')){
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


})();
// console.timeEnd("Tabview Youtube Init Script")