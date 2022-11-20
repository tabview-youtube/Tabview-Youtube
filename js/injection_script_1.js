"use strict";

function injection_script_1() {
  
  if(!window || !window.IntersectionObserver || !window.Symbol) throw 'Your browser does not support Tabview userscript.';

  if(document.documentElement.hasAttribute('tabview-injection-js-1-ready'))return;
  document.documentElement.setAttribute('tabview-injection-js-1-ready','1')
  
  const querySelectorFromAnchor = HTMLElement.prototype.querySelector;
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;

  const $requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const $cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  // /** @type {(o: Object | null) => WeakRef | null} */
  // const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  // /** @type {(wr: Object | null) => Object | null} */
  // const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);
  
  let calledOnce = false;
  let ptcBusy= false;
  let _ceHack_calledOnce = false;
  let cid_teaserInfo = 0;



  // let lvoSymbol = Symbol();
  document.addEventListener('tabview-chatroom-ready',function(evt){


    /** @type {HTMLIFrameElement} */
    let iframe = evt.target;
    if(!iframe || iframe.nodeType!==1 || !iframe.matches('ytd-live-chat-frame #chatframe')) return;

  },true)

  document.addEventListener('userscript-call-dom',function(evt){
    //console.log(1233)

    if (!evt || !evt.target || !evt.detail) return;
    let dom = evt.target;

    let detail = evt.detail;
    //console.log(detail)
    if(!detail || !detail.length) return;

    for(const obj of detail){

      const {method, property, args, value} = obj
      if(method && typeof method=='string'){
        const f=dom[method];
        if(!f) console.log('This method is not supported');
        else if(args&&args.length>=1){
          try{
            f.apply(dom,args)
            
          }catch(e){
            console.log(`Dom Method Failed: ${method}`)
          }
        }else {
          try{
            f.call(dom)
            
          }catch(e){
            console.log(`Dom Method Failed: ${method}`)
          }
        }
      }else if(property && typeof property=='string'){
        if(!(property in dom)) console.log('This propert is not supported')
        else if (value===undefined) console.log('undefined value is not supported')
        else {
          
          try{
            dom[property]=value;
            
          }catch(e){
            console.log(`Dom Property Failed: ${property}`)
          }
        } 
      }

    }

  }, true)


  document.addEventListener('userscript-call-dom-func', function (evt) {

    if (!evt || !evt.target || !evt.detail) return;
    let dom = evt.target;

    let { property, args } = evt.detail;
    if (!property) return;
    let f = dom[property];
    if (typeof f != 'function') return;

    if (args && args.length > 0) f.apply(dom, args);
    else f.call(dom);

  }, true)

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





  function getTranslate() {


  /** @type {(str: string?) => string} */
    function _snippetText(str) {
      // str can be underfinded
      return str ? str.replace(/\u200b/g, '').replace(/[\xA0\x20]/g, ' ') : ''
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

    const s8 = Symbol();
    

    function translate(initialSegments) {

      if (!initialSegments) return initialSegments;

      /** @type {Map<String, Object>} */
      let cacheTexts = new Map(); // avoid duplicate with javascript object properties
      let map = new WeakSet();

      let mh1 = new Set(); // avoid duplicate with javascript object properties


      
      const fRes = [];
    
      for (const initialSegment of initialSegments) {
        let transcript = (initialSegment || 0).transcriptSegmentRenderer;
        if (!transcript) continue;

        let startMs = (+transcript.startMs || 0); //integer
        let endMs = (+transcript.endMs || 0); //integer

        if (startMs === endMs) {
          // effect text
          // https://www.youtube.com/watch?v=Ud73fm4Uoq0
          map.add(initialSegment)
          continue;
        }

        const text = snippetText(transcript.snippet);

        if (mh1.has(text) || /^[\,\.\x60\x27\x22\u200b\xA0\x20\;\-]*$/.test(text)) {
          initialSegment[s8] = true;
          mh1.add(text);
          //effect only
          // https://www.youtube.com/watch?v=zLak0dxBKpM
          map.add(initialSegment)
          continue;
        }

        
        const entry = {
          startMs,
          endMs,
          initialSegment
        }

        if (cacheTexts.has(text)) {

          let entryA = cacheTexts.get(text); // previous valid entry object

          let timeDiff = entry.startMs - entryA.endMs;
          let bool = (timeDiff < 5) ? entry.startMs >= entryA.endMs : (timeDiff < 180 && entry.startMs >= entryA.endMs && entry.endMs - entry.startMs < 800);

          if (bool) {
            // abandon the current entry.
            // absorbed by previous entry
            entryA.endMs = entry.endMs;
            entryA.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs; // update fRes & initialSegments as well using object reference
            map.add(entry.initialSegment);
            continue;
          }

        }

        //if not abandoned
        cacheTexts.set(text, entry); //replace the previous valid entry object if any
      
        fRes.push(initialSegment);


      }
      mh1 = null;


      


      let sj_start = 0;
      const si_length = fRes.length;
      const sj_length = initialSegments.length;


      if (si_length === sj_length) {
        //no fix is required
        return fRes;
      }



      
  /** @type {(str: string?) => string} */
  function trim2(str) {
    return str ? str.replace(/^[\xA0\u200b\s\n\t]+|[\xA0\u200b\s\n\t]+$/g, '') : '';
  }

/** @type {(str: string?) => string} */
  function ns2(str) {
    return str ? str.replace(/[\xA0\u200b\s\n\t]+/g, '') : '';
  }


      for (let si = 0; si < si_length; si++) {
        const segment = fRes[si];
        const transcript = segment.transcriptSegmentRenderer;

        let main_startMs = (+transcript.startMs || 0);
        let main_endMs = (+transcript.endMs || 0);
        /** @type {Map<string, number>} */
        const tMap = new Map(); // avoid duplicate with javascript object properties

        // assume that it is asc-ordered array of key startMs;
        for (let sj = sj_start; sj < sj_length; sj++) {
          const initialSegment = initialSegments[sj]

          if (!initialSegment || initialSegment[s8]) continue;
          //console.log(8833, 100, si, sj)

          let startMs = (+initialSegment.transcriptSegmentRenderer.startMs || 0)
          let isStartValid = startMs >= main_startMs;
          if (!isStartValid) continue;
          if (startMs > main_endMs) {
            sj_start = sj - 1; // ignore sj_start = -1
            if (sj_start < si + 1) sj_start = si + 1; // next si is si+1;  sj>=si
            break;
          }

          //console.log(8833,si,sj)
          let endMs = (+initialSegment.transcriptSegmentRenderer.endMs || 0)

          if (isStartValid && endMs <= main_endMs) {

            //console.log(8833, 102)
            let mt = snippetText(initialSegment.transcriptSegmentRenderer.snippet);
            let v1 = tMap.get(mt) || 0;
            let v2 = v1 + 1 + Math.abs(endMs - startMs);
            tMap.set(mt,v2);
          }


        }
        


        const runs = segment.transcriptSegmentRenderer.snippet.runs;

        let main_str = trim2(_snippetText(runs[0].text));

        runs[0].text = main_str

        if (runs.length > 1) continue;  // skip multi lines

        if (tMap.size <= 1) continue; // no second line

        let rg = [...tMap.entries()] // N x 2 2D-array [string,number][]

        // https://www.youtube.com/watch?v=Ud73fm4Uoq0

        rg.sort((a, b) => b[1] - a[1]) //descending order of number

        if (rg[1][1] > 4 && ns2(rg[1][0]) !== ns2(rg[0][0]) && rg[1][1] > rg.reduce((a, entry, idx) => (idx > 1 ? (a + entry[1]) : 0), 0)) {

          let a = trim2(rg[0][0])
          let b = main_str

          //console.log(452, a,b,a===b)
          if (a === b) runs.push({ text: trim2(rg[1][0]) })
        }


      }



      //console.log(7559, fRes)

      return fRes;

    }


    return translate

  }


  //const round = x => x + 0.5 << 0
  function getInsObserver(){


    let insObserver = null;
    if (window.IntersectionObserver) {


      let cmtWM = new WeakMap();

      let cmtObserver = new IntersectionObserver(function (entries, observer) {
        
        for (const entry of entries) {

            let h = entry.boundingClientRect.height
            let threadRenderer = entry.target;
            if(!threadRenderer) continue;

            let b1 = h>10;
            let b2 = !entry.isIntersecting;
            if(!b1 && !b2) continue;

            let m = cmtWM.get(threadRenderer);
            // m:string -> css for --tabview-cmt-height
            // m===-1: not intialized
            // m===-2: disabled
            if(m===-2) continue;


            if(b1){
              // possible to get height even it is not intersecting

              let t= `${h.toFixed(3)}px` //123.456px
              if(m!==t){
                cmtWM.set(threadRenderer, t)
              }
              m=t;

            }

            // m:string -> css for --tabview-cmt-height

            if(m===-1)continue; // h is not available
            
            if(b2){
              // set CSS rule when it leaves the visible region

              if(entry.target.style.getPropertyValue("--tabview-cmt-height")!==m){
                  entry.target.style.setProperty("--tabview-cmt-height",m)
              }

            }else{
              //invisible -> visible
              entry.target.style.removeProperty("--tabview-cmt-height")
            }
            
        }
      },{
        threshold: [0],
        rootMargin: "-18px 0px -18px 0px"  // before fully leave the visible region

      })


      insObserver = new IntersectionObserver(function (entries, observer) {
        for (const entry of entries) {
          /// entry.target -> ytd-expander
          if (entry.isIntersecting){
            let pElm = entry.target.closest('ytd-comment-thread-renderer');
            if(pElm && !cmtWM.has(pElm)){
              let flag = -1;

              let cmRendererBGOFFSETED = entry.target.closest('ytd-comment-renderer#comment.ytd-comment-thread-renderer[style*="--ytd-decorated-comment-background-offset-"]');
              if(cmRendererBGOFFSETED){
                // colored comment - https://www.youtube.com/watch?v=Ewnt9o7c1vo
                flag=-2;
              }
              
              cmtWM.set(pElm,flag);
              cmtObserver.observe(pElm)
            }
            entry.target.calculateCanCollapse();
          }
        }
      }, {
        threshold: [0],
        rootMargin: "750px 0px 750px 0px" // (top, right, bottom, left)  // +ve => enlarge intersection area
      })


    }


    return insObserver;


  }


  
  function getInsObserverChipCloud(){


    let insObserver = null;
    if (window.IntersectionObserver) {

      let wm = new WeakMap();



      async function callReset(target,value){


        if(wm.get(target)!==value){
          wm.set(target, value)
          target.reset();
          if(!target.hasAttribute('QNJMC')){
            target.setAttribute('QNJMC','')  
            target.addEventListener('mouseenter',function(){
              requestAnimationFrame(()=>{
                if(this.atStart===true) this.reset();
              })
            },false)
          }
        }
        
        setTimeout(()=>{
          if(target.atStart===true) target.reset();
        },160)

      }

      insObserver = new IntersectionObserver(function (entries, observer) {
        
        for (const entry of entries) {

            let h = entry.boundingClientRect.height
            if(h>10 && entry.isIntersecting){
              // possible to get height even it is not intersecting

              if(entry.target&&entry.target.reset){
                let area = Math.round(entry.boundingClientRect.width * entry.boundingClientRect.height);
                if(area>10){
                  callReset(entry.target,area)
                }
              }

            }
            
        }
      },{
        threshold: [0],
        rootMargin: "0px 0px 0px 0px"  // before fully leave the visible region

      })




    }


    return insObserver;


  }

  
  function getMutObserverChipCloud(){


    let mutObserver = null;
    if (window.MutationObserver) {

      let wm = new WeakMap();


      async function callReset(target,value){

        if(wm.get(target)!==value){
          wm.set(target, value)
          target.reset();
        }
        setTimeout(()=>{
          if(target.atStart===true) target.reset();
        },160)

      }

      let t = 0;
      let cid_mset = 0;
      function mSet(target){


        let c= Date.now();
        t=c;
        if(cid_mset) clearTimeout(cid_mset);
        cid_mset=setTimeout(()=>{

          if(t!==c)return;
          
          let chips = querySelectorFromAnchor.call(target, 'iron-selector#chips');

          if(!chips) return;

          callReset(target, chips.offsetWidth)

        },160)

      }


      mutObserver = new MutationObserver(function (mutationList, observer) {
        
        for (const mutation of mutationList) {

            let target = mutation.target;
            target = closestFromAnchor.call(target,'yt-chip-cloud-renderer')

            if(target&&target.reset){

              mSet(target)


            }
            
        }
      })




    }


    return mutObserver;


  }


  function getFunc_postToContentWindow(){
    let afArg = null;
    const symbol_gtcw=Symbol();
    let refreshAt = 0;
    let rfaId=0;
    const tf_gtcw=function(x){
      if(rfaId > 0){
        if(activeFlag)return;
        //console.log(1723,3,x)
        rfaId = 0;
        refreshAt = Date.now()+460;
        // Promise to allow unknown runtime error (not to block the coding)
        Promise.resolve({args:afArg, f:this.__$$postToContentWindow$$__, ths:this}).then((obj)=>{
          //arg is object reference.
          const {args, f, ths} = obj;
          f.apply(ths,args);
          //console.log(5422, args)
        })
      }
    };
    let _lastPT = 0;
    let activeFlag = 0;
    



    function resetChatroomFlags(){
      activeFlag = 0;
      _lastPT = 0;
    }

    
    document.addEventListener('yt-navigate', resetChatroomFlags)
    document.addEventListener('yt-navigate-start', resetChatroomFlags)
    document.addEventListener('yt-player-updated', resetChatroomFlags)
    document.addEventListener('yt-page-data-fetched', resetChatroomFlags)
    document.addEventListener('yt-navigate-finish', resetChatroomFlags)
    
    document.addEventListener('yt-page-data-updated', resetChatroomFlags) 



    let cnpCID = 0;
    document.addEventListener('tabview-chatroom-newpage', function(evt){

      if(cnpCID) clearTimeout(cnpCID);
      cnpCID=0;

      //console.log(12399,2)
      let nodeName =(( evt||0).target||0).nodeName
      if(nodeName!=='YTD-LIVE-CHAT-FRAME') return;
      
      //console.log(12399,3)
      let chat = evt.target 
      let iframe = chat.querySelector('iframe#chatframe[src]')
      if(!iframe) return;
      

      //let cc=3;
      cnpCID = setTimeout(function(){

        cnpCID=0;


        //console.log(12399,4)
        let cDoc = iframe.contentDocument
        if(!cDoc) return;
        
        //console.log(12399,5, chat.isFrameReady , chat.isListeningForPlayerProgress, cDoc.querySelector('body:empty'))
        
        if(chat.isFrameReady && chat.isListeningForPlayerProgress && cDoc.querySelector('body:empty')){
          chat.urlChanged();

        } 
  
        //console.log(12399,6)

      },46); // delay in case empty body cannot be detected

      


    }, true)

    const g_postToContentWindow = function () { 
      //console.log(1723,8,arguments)

      if(activeFlag>0) return;
      if(!this.hasAttribute('yt-userscript-iframe-loaded')) return this.__$$postToContentWindow$$__.apply(this, arguments);
      
      //console.log(1723,6)
      if (arguments.length === 1 && "yt-player-video-progress" in arguments[0]) {

        //console.log(1723,9,ptcBusy)
        let pt = arguments[0]['yt-player-video-progress'];
        let isRefreshRequired = false;
        
        let lastPT = _lastPT
        _lastPT = pt;
        isRefreshRequired = pt<lastPT && lastPT-pt>0.99 && typeof this.urlChanged == 'function'; // backward timeline => YouTube Bug - update forzen
        

        
        if(isRefreshRequired){
          //console.log(9371,2)
          let taf= Date.now();
          activeFlag=taf;
          ptcBusy = true;
          
          setTimeout(()=>{
            if(taf!==activeFlag) return;
            
            // this.urlChanged()
            // this.detached();
            // this.attached();
            
            this.currentPageUrl = "";//  necessary
            this.isListeningForPlayerProgress = false;
            this.setPlayer(null);
            this.isFrameReady = false
            this.currentPageUrl = window.location.href;
            this.setupPlayerProgressRelay()

            let ptcF=()=>{
              
              if(taf!==activeFlag) return;
              if(this.isFrameReady===true){
                ptcBusy = false;
                activeFlag=false;
              }else{
                setTimeout(ptcF,46);
              }
            };
            setTimeout(ptcF,46); //just some delay - allow page loading
          },460); //just some delay - allow user operation
          if(this.isFrameReady===true) this.isFrameReady=false;
          return; // skip update and wait for page refresh
        }else if(ptcBusy === true) return;
        else{
          ptcBusy = true;
        }
        

        afArg=[{'yt-player-video-progress':pt}];
      
        //let curTime = 0;
        
        if(rfaId>0 && (curTime=Date.now())>refreshAt){
          //console.log(1723,1)
          $cancelAnimationFrame(rfaId);
          if(this[symbol_gtcw]) this[symbol_gtcw](); // this[symbol_gtcw] always return function
        }else if (rfaId === 0) {
          //console.log(1723,2)
          if(!this[symbol_gtcw]) this[symbol_gtcw]=tf_gtcw.bind(this)
          rfaId=$requestAnimationFrame(this[symbol_gtcw]);
        }
        
        ptcBusy = false;
        

      } else {
        this.__$$postToContentWindow$$__.apply(this, arguments)
      } 
    }
    return g_postToContentWindow;
  }

  
  function ceHack(evt){

    if(_ceHack_calledOnce) return;
    _ceHack_calledOnce = true;
    console.log('ce-hack')

    if(typeof customElements === 'undefined') throw 'Your browser does not support Tabview userscript.';
    // note: YouTube implements its on window.customElements when it detects the browser is old.

    let s1 = Symbol();
    //let s2 = Symbol();

    // note: after content expanded, resizing window will casue the "collapse" feature disappears.
    // this.$.content.scrollHeight>this.collapsedHeight  is used for recomputeOnResize = true 
    //let f1= function(){this.canToggle=!this.recomputeOnResize&&this.shouldUseNumberOfLines?this.alwaysToggleable||this.$.content.offsetHeight<this.$.content.scrollHeight:this.alwaysToggleable||this.$.content.scrollHeight>this.collapsedHeight};
    // new browser - 84>80 would not lead to line clamp [as using -webkit-line-clamp]
    // this.$.content.offsetHeight<this.$.content.scrollHeight is not working for collapsed content

    let f1 = function () { this.canToggle = this.shouldUseNumberOfLines && (this.alwaysCollapsed || this.collapsed) ? this.alwaysToggleable || this.$.content.offsetHeight < this.$.content.scrollHeight : this.alwaysToggleable || this.$.content.scrollHeight > this.collapsedHeight };

    let insObserver = getInsObserver();


    Object.defineProperty(customElements.get('ytd-expander').prototype, 'recomputeOnResize', {
      get() {
        if (this.calculateCanCollapse !== f1) {
          this.calculateCanCollapse = f1
          if (insObserver) insObserver.observe(this)
        }
        return this[s1];
      },
      set(nv) {
        if (this.calculateCanCollapse !== f1) {
          this.calculateCanCollapse = f1
          if (insObserver) insObserver.observe(this)
        }
        if (nv === false) nv = true;
        this[s1] = nv;
      },
      enumerable: false,
      configurable: false // if redefine by YouTube, error comes and change the coding
    });


    let translate = getTranslate();

    const s6 = Symbol();

    Object.defineProperty(customElements.get('ytd-transcript-search-panel-renderer').prototype, 'initialTranscriptsRenderer', {
      get() {
        return this.__$$initialTranscriptsRenderer$$__
      },
      set(nv) {
        try {

          if (nv && nv.initialSegments && !nv.initialSegments[s6]) {
            nv[s6] = true;
            //console.log(955, 'translate')
            //console.log(343,JSON.parse(JSON.stringify(nv)), nv.initialSegments.length)
            nv.initialSegments = translate(nv.initialSegments)
            //console.log(344,nv, nv.initialSegments.length)
          }

        } catch (e) {
          console.log('Tabview Error', e)
        }
        this.__$$initialTranscriptsRenderer$$__ = nv;
      },
      enumerable: false,
      configurable: false // if redefine by YouTube, error comes and change the coding
    })


    let trial55 = 20;

    let cid55 = setInterval(()=>{
      let frameCE_prototype = customElements.get('ytd-live-chat-frame').prototype;
      //p&&(p.configurable=!0,Object.defineProperty(a,m,p))}}

      if(frameCE_prototype && !frameCE_prototype.__$$postToContentWindow$$__ && typeof frameCE_prototype.postToContentWindow == 'function'){
        const g_postToContentWindow = getFunc_postToContentWindow();
        frameCE_prototype.__$$postToContentWindow$$__ = frameCE_prototype.postToContentWindow
        frameCE_prototype.postToContentWindow = g_postToContentWindow
        clearInterval(cid55)
        cid55=0;
      }
      if(--trial55===0 && cid55>0){
        clearInterval(cid55);
        cid55=0;
      }
    },150)



    let s32 = Symbol();
    let insObserverChipCloud = getInsObserverChipCloud();
    let mutObserverChipCloud = getMutObserverChipCloud();
    // yt-chip-cloud-renderer
    Object.defineProperty(customElements.get('yt-chip-cloud-renderer').prototype, 'boundChipCloudChipScrollIntoView', {
      get() {
        return this[s32];
      },
      set(nv) {
        if (insObserverChipCloud) insObserverChipCloud.observe(this)
        if (mutObserverChipCloud) mutObserverChipCloud.observe(this,{
          attributes: false, childList: true, subtree: true 
        })
        this[s32] = nv;
      },
      enumerable: false,
      configurable: false // if redefine by YouTube, error comes and change the coding
    });

 


  }

  function textsMatch(runs1,runs2){

    let i=runs1.length-runs2.length;
    if(i<0) return false;
    let j=0;
    while(i<runs1.length && j<runs2.length){
      if(runs1[i].text!==runs2[j].text)return false;
      i++;
      j++;
    }
    return true;

  }


  function teaserInfoMatchCondition (lineExpander){

    if(!lineExpander) return null;
    let watch_metadata = lineExpander.__dataHost;
    if(!watch_metadata || watch_metadata === lineExpander) return null;
    if(!watch_metadata.__data || !watch_metadata.__data.descriptionText || !watch_metadata.__data.videoSecondaryInfoRenderer ) return null;



    let full = watch_metadata.__data.descriptionText.runs
    let detail = watch_metadata.__data.videoSecondaryInfoRenderer.description.runs
    let content = lineExpander.text.runs

    return [ watch_metadata, full, detail, content]


  }

  function isDOMVisible(/** @type {HTMLElement} */ elem) {
    // jQuery version : https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

  
  document.documentElement.addEventListener('engagement-panel-genius-lyrics', function () {
  
    function getEPC(ep) {

      if (!ep) return null;
      let epc = querySelectorFromAnchor.call(ep,'#content');
      if (!epc) return null;

      let epc1 = querySelectorFromAnchor.call(epc,'ytd-ads-engagement-panel-content-renderer #content')
      let epc2 = querySelectorFromAnchor.call(epc,'ytd-ads-engagement-panel-content-renderer')

      return epc1 || epc2 || epc;

    }

    if (calledOnce) return;
    calledOnce = true


    // ENGAGEMENT_PANEL_VISIBILITY_EXPANDED

    function createPanel(){

      let ytdFlexyElm = document.querySelector('ytd-watch-flexy[tabview-selection]');
      if(!ytdFlexyElm) return null;


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
      }

      newPanel.classList.add('style-scope','ytd-watch-flexy')

      querySelectorFromAnchor.call(ytdFlexyElm,'#panels').appendChild(newPanel)

      return newPanel;


    }

    let count = 0;
    function $f() {

      if (++count > 30) return;
      let ytdFlexyElm = document.querySelector('ytd-watch-flexy[tabview-selection]');
      if (!ytdFlexyElm) return setTimeout($f, 100);

      

      function closeBtn() {
        return document.querySelector('#lyricscontainer > .lyricsnavbar > a.lctc-hide') || null;
      }

      const visObserver = new MutationObserver(function (mutations, observer) {

        if (!mutations || !mutations[0]) return;
        /** @type {HTMLElement} */
        let panel = mutations[0].target;
        if (!panel) return;
        if (panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN') {
          setTimeout(function(){

            let hideBtn = closeBtn();
            if (hideBtn) hideBtn.dispatchEvent(new Event("click"));
          },30);
          //panel.querySelector('#lyricsiframe').remove();
        }

      })

      const panel_cssSelector = 'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]'
      
      let isLoading = false

      let tf = null;
      const closeClick = function(){
        let panel = document.querySelector(panel_cssSelector)
        if ( panel && panel.getAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')) {
          panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN')
        }
      }
      setInterval(tf=()=>{

        if(!document.querySelector(panel_cssSelector) && document.querySelector('ytd-watch-flexy #panels')){
          let newPanel = createPanel();
          visObserver.takeRecords();
          visObserver.disconnect();

          visObserver.observe(newPanel, {
            attributes: true,
            attributeFilter: ['visibility']
          })
        }

        
        let isLoading_current = !!document.querySelector('.loadingspinner, .loadingspinnerholder');

        if(isLoading!==isLoading_current){
          isLoading = isLoading_current;
          
          let panel = document.querySelector(panel_cssSelector)
          if(panel){
            panel.classList.toggle('epanel-lyrics-loading', isLoading);
          }
        
        }



        let elm = null;
        if (elm = document.querySelector('body > #lyricscontainer > #lyricsiframe')) {

          let panel = document.querySelector(panel_cssSelector)
          if(panel) {
              
            let epc = getEPC(panel);
            if(epc) {

              epc.innerHTML = '';
              epc.appendChild(elm)
              panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')
            }

          }
        }

        
  
        for(const clickable of document.querySelectorAll('#lyricscontainer > .lyricsnavbar > a:not([lctc])')){
          let lctc = clickable.textContent.toLocaleLowerCase()
          clickable.setAttribute('lctc', lctc)
          if(/\bhide\b/.test(lctc)){
            clickable.classList.add('lctc-hide')
            clickable.addEventListener('click',closeClick,false)
          }
        }


      },250)
      tf();
      

    }
    $f();

  })
  document.documentElement.setAttribute('w-engagement-panel-genius-lyrics', '')


  if(document.documentElement.hasAttribute('tabview-loaded'))ceHack();else
  document.addEventListener('tabview-ce-hack',ceHack, true)

  

  document.addEventListener('yt-expander-less-tapped', function (evt) {

    // including reply of comments;
    // fix scrollTop when "show less" is tapped

    if (!evt || !evt.target) return;
    /** @type {HTMLElement} */
    let elm = evt.target;
    if (elm.matches('#tab-comments #contents.style-scope.ytd-item-section-renderer > ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-expander#expander[max-number-of-lines]')) {
      //setTimeout(()=>{
      let cmRender = elm.closest('ytd-comment-renderer')
      let tabComments = cmRender.closest('#tab-comments')
      let cmRenderRect = cmRender.getBoundingClientRect()
      let tabCommentsRect = tabComments.getBoundingClientRect()
      let eTop = cmRenderRect.top
      let cTop = tabCommentsRect.top
      
      if (cTop - eTop > 0) {
        cmRender.scrollIntoView();
        //tabComments.scrollTop -= cTop - eTop  + Math.max(cmRenderRect.left - tabCommentsRect.left, 0)
        //note: {cmRenderRect.left - tabCommentsRect.left} is larger for reply of comments
      }
      
      //},30)

    }

  }, true);


  document.addEventListener('tabview-no-duplicate-info',function(evt){

    if(cid_teaserInfo){
      clearInterval(cid_teaserInfo)
      cid_teaserInfo=0;
    }
    let mid='';

    cid_teaserInfo = setInterval(()=>{

      let lineExpander = document.querySelector('ytd-watch-metadata ytd-text-inline-expander');
      let [ watch_metadata, full, detail, content] =  teaserInfoMatchCondition(lineExpander)
        
      let tid = `${content.length},${full.length},${detail.length}`
      if(mid===tid) return null;
      mid=tid;

      let b1 = content.length===full.length && full.length>detail.length && content.length>full.length-detail.length

      if(b1 && textsMatch(full,detail)){

        let newLen = full.length-detail.length

          if(newLen>1 && /^\s*[\u2022\u2023\u25E6\u2043\u2219\.\,]?\s*$/.test(content[newLen-1].text||'0')) newLen--;
          content.length=newLen

          lineExpander.alwaysShowExpandButton=false;

          lineExpander.resize(true);
      }

    },150);


  },true);
  
  
  document.addEventListener('tabview-fix-autocomplete',function(){

      // https://cdnjs.cloudflare.com/ajax/libs/JavaScript-autoComplete/1.0.4/auto-complete.min.js

      for(const s of document.querySelectorAll('[autocomplete="off"]:not([data-autocomplete-results-id])')){


          let sc = s.sc;
          if(sc instanceof HTMLElement){

              let id=Date.now();
              s.setAttribute('data-autocomplete-results-id',id);
              sc.setAttribute('data-autocomplete-input-id', id);
              
              if(typeof WeakRef === 'function'){
                  s._sc=new WeakRef(sc);
                  s.sc=null;
                  delete s.sc;
                  Object.defineProperty(s,'sc',{
                      get: function() { return s._sc.deref()||null; },
                      enumerable: true,
                      configurable: true
                  })
              }

              if(sc.hasAttribute('autocomplete-disable-updatesc') && typeof s.updateSC =='function'){

                  window.removeEventListener('resize', s.updateSC);
                  s.updateSC=function(){};

              }

              sc.dispatchEvent(new CustomEvent('autocomplete-sc-exist'));


          }

      }

  }, false);
 
  
  // initial paging -> yt-page-data-fetched
  // page changing ->  yt-page-type-changed + yt-page-data-fetched
  document.addEventListener('yt-page-type-changed', (evt) => {
    window.postMessage({
      tabview: {
        eventType: evt.type,
        eventDetail: evt.detail // in order to get the object detail
      }
    }, location.origin);
  }, false)


  document.documentElement.setAttribute('tabview-injection-js-1-ready','2')

  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();