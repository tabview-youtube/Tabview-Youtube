"use strict";

function injection_script_1() {
  
  if(!window || !window.IntersectionObserver || !window.Symbol) throw 'Your browser does not support Tabview userscript.';

  
  const querySelectorFromAnchor = HTMLElement.prototype.querySelector;
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;

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


  let calledOnce = false;

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

  //https://www.youtube.com/watch?v=Ud73fm4Uoq0


  function getTranslate(){

      
    function _snippetText(str) {
      return str.replace(/\u200b/g, '').replace(/[\xA0\x20]/g, ' ')
    }

    function snippetText(snippet) {
      let res = [];
      for (const s of snippet.runs) {
        res.push(_snippetText(s.text||''))
      }
      return res.join('\n');
    }

    const s7 = Symbol();
    const s8 = Symbol();

    function translate(initialSegments) {

      if (!initialSegments) return initialSegments;

      let res = {};
      let map = new WeakSet();

      let subTexts = {};

      for (const initialSegment of initialSegments) {
        if (!initialSegment || !initialSegment.transcriptSegmentRenderer) continue;

        let startMs = (+initialSegment.transcriptSegmentRenderer.startMs || 0)
        let endMs = (+initialSegment.transcriptSegmentRenderer.endMs || 0)

        if (startMs === endMs) {
          // effect text
          // https://www.youtube.com/watch?v=Ud73fm4Uoq0
          map.add(initialSegment)

          let text = snippetText(initialSegment.transcriptSegmentRenderer.snippet);
          if (!subTexts[startMs]) subTexts[startMs] = [];
          if (!subTexts[startMs].includes(text)) subTexts[startMs].push(text);
          continue;
        }
        let text = snippetText(initialSegment.transcriptSegmentRenderer.snippet);


        if (/^[\,\.\x60\x27\x22\u200b\xA0\x20\;\-]*$/.test(text)) {
          initialSegment[s8] = true;
          //effect only
          // https://www.youtube.com/watch?v=zLak0dxBKpM
          map.add(initialSegment)
          continue;
        }

        if (!res[text]) res[text] = [];
        res[text].push({
          startMs,
          endMs,
          initialSegment
        })

      }

      function trim2(str) {
        return str.replace(/^[\xA0\u200b\s\n\t]+|[\xA0\u200b\s\n\t]+$/g, '');
      }

      function ns2(str) {
        return str.replace(/[\xA0\u200b\s\n\t]+/g, '');
      }

      for (const text of Object.keys(res)) {

        let lastEntry = null
        for (const entry of res[text]) {

          if (lastEntry && entry) {
            if (entry.startMs - lastEntry.endMs < 5 && entry.startMs >= lastEntry.endMs) {

              lastEntry.endMs = entry.endMs
              lastEntry.initialSegment.transcriptSegmentRenderer.endMs = entry.initialSegment.transcriptSegmentRenderer.endMs
              map.add(entry.initialSegment);

              continue;
            }
          }

          lastEntry = entry

        }
      }




      let fRes = initialSegments.filter(m => !map.has(m));


      for (const segment of fRes) {
        let main_startMs = (+segment.transcriptSegmentRenderer.startMs || 0)
        let main_endMs = (+segment.transcriptSegmentRenderer.endMs || 0)
        segment.transcriptSegmentRenderer[s7] = {};
        for (const initialSegment of initialSegments) {
          if (!initialSegment) continue;
          if (initialSegment[s8]) continue;

          let startMs = (+initialSegment.transcriptSegmentRenderer.startMs || 0)
          let endMs = (+initialSegment.transcriptSegmentRenderer.endMs || 0)

          if (startMs >= main_startMs && endMs <= main_endMs) {
            let mt = snippetText(initialSegment.transcriptSegmentRenderer.snippet);
            segment.transcriptSegmentRenderer[s7][mt] = (segment.transcriptSegmentRenderer[s7][mt] || 0) + 1 + Math.abs(endMs - startMs);
          }

        }

      }


      for (const segment of fRes) {

        let snippet = segment.transcriptSegmentRenderer.snippet

        let main_str = trim2(_snippetText(snippet.runs[0].text||''));

        snippet.runs[0].text = main_str

        if (snippet.runs.length > 1) continue;  // skip multi lines


        let obj = segment.transcriptSegmentRenderer[s7]

        let rg = Object.keys(obj)

        if (rg.length <= 1) continue; // no second line

        rg = rg.map(k => ({ str: k, count: obj[k] }))
        rg.sort((a, b) => b.count - a.count)

        if (rg[1].count > 4 && ns2(rg[1].str) !== ns2(rg[0].str) && rg[1].count > rg.slice(2).map(e => e.count).reduce((a, b) => a + b, 0)) {

          let a = trim2(rg[0].str)
          let b = main_str

          //console.log(452, a,b,a===b)
          if (a === b) snippet.runs.push({ text: trim2(rg[1].str) })
        }

      }


      //console.log(fRes)



      //console.log(fRes)

      return fRes;

    }


    return translate

  }


  function getInsObserver(){


    let insObserver = null;
    if (window.IntersectionObserver) {


      let cmtWM = new WeakMap();

      let cmtObserver = new IntersectionObserver(function (entries, observer) {
        
        for (const entry of entries) {

            let h = entry.boundingClientRect.height
            if(h>10){
              // possible to get height even it is not intersecting

              let m = cmtWM.get(entry.target);
              let t= `${h}px`
              if(m!==t){
                cmtWM.set(entry.target, t)
              }

            }
            
            if(!entry.isIntersecting){
              // set CSS rule when it leaves the visible region

              let m = cmtWM.get(entry.target);
              if(m && entry.target.style.getPropertyValue("--tabview-cmt-height")!==m){

                entry.target.style.setProperty("--tabview-cmt-height",m)
              }

            }
            
        }
      },{
        threshold: [0],
        rootMargin: "-18px 0px -18px 0px"  // before fully leave the visible region

      })


      insObserver = new IntersectionObserver(function (entries, observer) {
        let count = 0
        for (const entry of entries) {
          if (entry.isIntersecting && ++count){
            /*let cHeight = (entry.boundingClientRect.height);
            let newSize = `${cHeight}px`
            if(entry.target.style['containIntrinsicHeight']!==newSize)
            entry.target.style['containIntrinsicHeight']=newSize; 
            */
            let pElm = null;
            if(pElm=entry.target.closest('ytd-comment-thread-renderer')){
              if(!cmtWM.has(pElm)) cmtObserver.observe(pElm)
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
      function mSet(target){


        let c= Date.now();
        t=c;
        setTimeout(()=>{

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
    let afm = 0;
    let afArg = null;
    const g_postToContentWindow = function () {
      if(!this.hasAttribute('yt-userscript-iframe-loaded')) return this.__$$postToContentWindow$$__.apply(this, arguments);
      if (arguments.length === 1 && "yt-player-video-progress" in arguments[0]) {

        afArg = [...arguments];
        afm++;
        if (afm === 1) {

          if(document.hasFocus()){

            requestAnimationFrame(() => {
              afm = 0;
              this.__$$postToContentWindow$$__.apply(this, afArg || arguments)
            })

          }else if(document.visibilityState=='visible'){

            setTimeout(() => {
              afm = 0;
              this.__$$postToContentWindow$$__.apply(this, afArg || arguments)
            },120)

          }else{

            setTimeout(() => {
              afm = 0;
            },800)

          }

        }

      } else {
        this.__$$postToContentWindow$$__.apply(this, arguments)
      }
    }
    return g_postToContentWindow;
  }

  let _ceHack_calledOnce = false;
  
  function ceHack(evt){

    if(_ceHack_calledOnce) return;
    _ceHack_calledOnce = true;
    console.log('ce-hack')

    if(!window.customElements) throw 'Your browser does not support Tabview userscript.';
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


  if(document.documentElement.hasAttribute('youtube-ready'))ceHack();else
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
        tabComments.scrollTop -= cTop - eTop  + Math.max(cmRenderRect.left - tabCommentsRect.left, 0)
        //note: {cmRenderRect.left - tabCommentsRect.left} is larger for reply of comments
      }
      //},30)

    }

  }, true);



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

  let cid_teaserInfo = 0;

  //console.log(78)


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


  document.documentElement.setAttribute('tabview-injection-js-1-ready','')


}

injection_script_1();