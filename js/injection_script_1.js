"use strict";

function injection_script_1() {
  
  if(!window || !window.IntersectionObserver || !window.Symbol) throw 'Your browser does not support Tabview userscript.';

  if(document.documentElement.hasAttribute('tabview-unwrapjs'))return;
  document.documentElement.setAttribute('tabview-unwrapjs','')
  
  const querySelectorFromAnchor = HTMLElement.prototype.querySelector;
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;

  const $requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const $cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  // /** @type {(o: Object | null) => WeakRef | null} */
  // const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  // /** @type {(wr: Object | null) => Object | null} */
  // const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);
  

  
  const DEBUG_e32 = false;

  let calledOnce = false;
  let ptcBusy= false;
  let _ceHack_calledOnce = false;
  let cid_teaserInfo = 0;
  let isPageRendered = false;


  DEBUG_e32 && console.log(9442, 103);


  // let lvoSymbol = Symbol();
  document.addEventListener('tabview-chatroom-ready',function(evt){

    DEBUG_e32 && console.log(9442, evt.type);

    /** @type {HTMLIFrameElement} */
    let iframe = evt.target;
    if(!iframe || iframe.nodeType!==1 || !iframe.matches('ytd-live-chat-frame #chatframe')) return;

  },true)

  document.addEventListener('userscript-call-dom',function(evt){
    //console.log(1233)
    DEBUG_e32 && console.log(9442, evt.type);

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

    DEBUG_e32 && console.log(9442, evt.type);

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


    function szz(t) {

      return t.map(x => ({
        t: x.transcriptSegmentRenderer.snippet.runs.map(x => x.text).join('//'),
        a: x.transcriptSegmentRenderer.startMs,
        b: x.transcriptSegmentRenderer.endMs
      }));
    }

    /*
    function translateV2(initialSegments){

      let res = []
      
      let textCache = new Map();

      for (const initialSegment of initialSegments) {
        const transcript = (initialSegment || 0).transcriptSegmentRenderer;
        if (!transcript) continue;

        const runs = transcript.snippet.runs
        if (!runs || runs.length === 0) {
          continue;
        }


        let startMs = (+transcript.startMs || 0); //integer
        let endMs = (+transcript.endMs || 0); //integer


        let text = snippetText(transcript.snippet);

        let tc = textCache.get(text);

        if(!tc){

          tc =  {
            segment: initialSegment,
            startMs: startMs,
            endMs: endMs
          }

          textCache.set(text,tc);
          res.push(tc);
          
        }else{

          if(startMs - tc.endMs < 450){
            tc.endMs =endMs;
          }else{

            tc = {
              segment: initialSegment,
              startMs: startMs,
              endMs: endMs
            }
            res.push(tc);
            textCache.set(text, tc);

          }

        }


      }

      let sType = null;
      let fRes = [];
      for(const entry of res) {

        const transcript = entry.segment.transcriptSegmentRenderer;

        let duration = entry.endMs - entry.startMs

        if(duration>450){

          if(!sType) sType = typeof transcript.startMs;
          transcript.startMs =  sType=='string'?`${entry.startMs}`:entry.startMs;
          transcript.endMs =  sType=='string'?`${entry.endMs}`:entry.endMs;
  
          const runs = transcript.snippet.runs
  
          
          for (const s of runs) {
            s.text = _snippetText(s.text);
          }

          fRes.push( entry.segment );
        }


      }


      console.log(res)
      return fRes;

    }
    */

    function translate(initialSegments) {

      if (!initialSegments) return initialSegments;

      if (TRANSLATE_DEBUG) {
        console.log(12)
      }


      


      //return translateV2(initialSegments);



      /*
      temp1.map(x=>({
        t:x.transcriptSegmentRenderer.snippet.runs.map(x=>x.text).join('//'),
        a:x.transcriptSegmentRenderer.startMs,
        b:x.transcriptSegmentRenderer.endMs
      }))
      
        */

      TRANSLATE_DEBUG && Promise.resolve(JSON.stringify(initialSegments)).then((r) => {

        let obj = JSON.parse(r);
        console.log(7558, 1, obj)
        return obj;
      }).then(p => {
        let obj = szz(p)
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
        if(endMs - startMs < 30){
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





      let sj_start = 0;
      const si_length = fRes.length;
      const sj_length = initialSegments.length;


      Promise.resolve(0).then(()=>{
        cacheTexts.clear();
        cacheTexts=null;
        mh1.clear();
        mh1 = null;
      });

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

        let main_startMs = (+transcript.startMs || 0);
        let main_endMs = (+transcript.endMs || 0);
        transcript = null;
        /** @type {Map<string, number>} */
        const tMap = new Map(); // avoid duplicate with javascript object properties

        const runs = segment.transcriptSegmentRenderer.snippet.runs;
        if (runs.length > 1 || runs[0].text.includes('\n')) continue; // skip multi lines

        // assume that it is asc-ordered array of key startMs;
        for (let sj = sj_start; sj < sj_length; sj++) {
          const initialSegment = initialSegments[sj]

          if (!initialSegment || initialSegment[s8]) continue;
          //console.log(8833, 100, si, sj)

          let startMs = (+initialSegment.transcriptSegmentRenderer.startMs || 0)
          let isStartValid = startMs >= main_startMs;
          if (!isStartValid) {
            invalid_sj = sj;
            continue;
          }
          if (startMs > main_endMs) {
            sj_start = invalid_sj + 1;
            break;
          }

          //console.log(8833,si,sj)
          let endMs = (+initialSegment.transcriptSegmentRenderer.endMs || 0)

          if (isStartValid && endMs <= main_endMs) {

            //console.log(8833, 102)
            let mt = snippetText(initialSegment.transcriptSegmentRenderer.snippet);
            /*
            if(tMap.size===0 && initialSegment!==segment){
              //switch to the earilest effect text

              TRANSLATE_DEBUG && console.log(24848,
                 'main',[segment.transcriptSegmentRenderer.startMs, segment.transcriptSegmentRenderer.endMs ],
                 'initial',[initialSegment.transcriptSegmentRenderer.startMs, initialSegment.transcriptSegmentRenderer.endMs ] );

              initialSegment.transcriptSegmentRenderer.startMs = segment.transcriptSegmentRenderer.startMs;
              initialSegment.transcriptSegmentRenderer.endMs = segment.transcriptSegmentRenderer.endMs;
              initialSegment.transcriptSegmentRenderer.snippet=segment.transcriptSegmentRenderer.snippet;

              segment.transcriptSegmentRenderer = initialSegment.transcriptSegmentRenderer;
              
            }*/
            let xv = tMap.get(mt) || 0;
            if(endMs>=startMs){
              xv += 1 + (endMs - startMs);
            }
            tMap.set(mt, xv);
          }


        }

        // let lastSegment = fRes[si-1];
        // if(si-1>=0){
        //   const transcript1 = lastSegment.transcriptSegmentRenderer
        //   const transcript2 = segment.transcriptSegmentRenderer
        //   let segmentGap = (+transcript2.startMs) - (+transcript1.endMs);

        //   if(segmentGap<800){
        //     let d1 = (+transcript1.endMs)-(+transcript1.startMs);
        //     let d2 = (+transcript2.endMs)-(+transcript2.startMs);

        //     //let e1 =  (+lastSegment.endMs+k1)-(+lastSegment.startMs);
        //     //let e2 = (+segment.endMs)-(+segment.startMs-k2);

        //     /--*
        //     e1/e2 = d1/d2 && k1+k2 = segmentGap;
        //     (end1+k1 - start1 ) / (end2-start2+k2) = (end1 - start1 ) / (end2-start2) && k1+k2== segmentgap
            
        //     (end1+k1 - start1 ) * (end2-start2) = (end1 - start1 ) * (end2-start2+k2)

        //     (end1 - start1 ) * (end2-start2) + k1 * (end2-start2) = (end1 - start1 ) * (end2-start2)+(end1 - start1 ) * k2
        //      k1 * (end2-start2) =(end1 - start1 ) * k2
        //      k1/k2 =(end1 - start1 ) / (end2-start2) 
        //      *--/


        //     //  k1/k2 =(end1 - start1 ) / (end2-start2)  = A

        //     // k1+k2 = segmentGap = B

        //     // k1 = A k2
        //     // A k2 + k2 = B
        //     // k2 = B/(1+A)

        //     let kA = d1 / d2;

        //     let kB = segmentGap;

        //     let k2 = kB / (1+kA);
        //     let k1 = kA*k2;

        //     if(typeof transcript1.endsMs == 'string'){
        //       transcript1.endMs = `${+transcript1.endMs + k1}`;
        //       transcript2.startMs = `${+transcript2.startMs - k2}`;
        //     }else if(typeof transcript1.endsMs == 'number'){
        //       transcript1.endMs = +transcript1.endMs + k1;
        //       transcript2.startMs = +transcript2.startMs - k2;
        //     }




        //   }

        // }

       





        if (tMap.size <= 1) continue; // no second line

        let rg = [...tMap.entries()] // N x 2 2D-array [string,number][]

        // https://www.youtube.com/watch?v=Ud73fm4Uoq0

        rg.sort((a, b) => b[1] - a[1]) //descending order of number

        let targetZ = rg[1][1];
        if (targetZ > 4) {

          let az = 0;
          let fail = false;
          for (let idx = 2; idx < rg.length; idx++) {
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

              //console.log(452, a,b,a===b)
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
        let obj = szz(p)
        console.log(7559, 2, obj)

      })
      /*
        return new Proxy(fRes, {
          get(target, prop, receiver) {
            console.log(2266,prop);
            return Reflect.get(...arguments)
          }
        })
        */



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

          let h = entry.boundingClientRect.height
          let threadRenderer = entry.target;
          if (!threadRenderer) continue;

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

          if (b2) {
            // set CSS rule when it leaves the visible region

            if (entry.target.style.getPropertyValue("--tabview-cmt-height") !== m) {
              entry.target.style.setProperty("--tabview-cmt-height", m)
            }
            
            entry.target.classList.remove('tyt-visible-comment')

          } else {
            //invisible -> visible
            entry.target.style.removeProperty("--tabview-cmt-height")
            entry.target.classList.add('tyt-visible-comment')
          }

        }
      }, {
        threshold: [0],
        rootMargin: "-18px 0px -18px 0px" // before fully leave the visible region
      })


      insObserver = new IntersectionObserver(function (entries, observer) {
        for (const entry of entries) {
          /// entry.target -> ytd-expander
          if (entry.isIntersecting) {
            let pElm = entry.target.closest('ytd-comment-thread-renderer');
            if (pElm && !cmtWM.has(pElm)) {
              let flag = -1;

              let cmRendererBGOFFSETED = entry.target.closest('ytd-comment-renderer#comment.ytd-comment-thread-renderer[style*="--ytd-decorated-comment-background-offset-"]');
              if (cmRendererBGOFFSETED) {
                // colored comment - https://www.youtube.com/watch?v=Ewnt9o7c1vo
                flag = -2;
              }

              cmtWM.set(pElm, flag);
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

  let resetChatroomFlags = null;


  let pageID = 0;

  let pageType = null;

  function onPageFetched(evt) {
    if((pageID%2) ===1) pageID++;
    
    translateHanlder = null;  // release the memory used for previous page
    Promise.resolve(0).then(() => {
      translateHanlder = getTranslate(); // release the memory used for previous page
    })

    pageType = ((evt.detail || 0).pageData || 0).page;


  }

  function pageLoad() {

    isPageRendered = false;
    if((pageID %2) ===0) pageID++;
    if (resetChatroomFlags) resetChatroomFlags();
  }


  /* align content.js */

  document.addEventListener('yt-navigate', pageLoad)
  document.addEventListener('yt-navigate-start', pageLoad)
  document.addEventListener('yt-navigate-cache', pageLoad)
  document.addEventListener('yt-navigate-redirect', pageLoad)

  /*
  document.addEventListener('yt-navigate', resetChatroomFlags)
  document.addEventListener('yt-navigate-start', resetChatroomFlags)
  document.addEventListener('yt-player-updated', resetChatroomFlags)
  document.addEventListener('yt-page-data-fetched', onPageFetched)
  document.addEventListener('yt-navigate-finish', resetChatroomFlags)
  document.addEventListener('yt-page-data-updated', resetChatroomFlags) 
  */


  document.addEventListener('yt-page-data-fetched', onPageFetched)


  function getFunc_postToContentWindow(){
    DEBUG_e32 && console.log(9442, '-postToContent');
    let refreshAt = 0;
    let rfaId=0;
    const tf_gtcw2=function(x){
      if(rfaId > 0){
        rfaId = 0;
        refreshAt = Date.now()+460;
      }
    };

    let _lastPT = 0;
    let activeFlag = 0;
    
    resetChatroomFlags = ()=>{
      activeFlag = 0;
      _lastPT = 0;
    };

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

      


    }, true);

    let isFirstBatchMsgDispatched = false;

    const g_postToContentWindow = function () {
      //console.log(1723,8,arguments)

      if (activeFlag > 0) return; // no action when reloading
      let boolz = this.isListeningForPlayerProgress === true && this.isFrameReady === true;
      let pt = arguments[0]['yt-player-video-progress'];

      if (boolz && pt>=0) {

        if (!isPageRendered) return; // ignore the chatroom rendering if it is completely under background wihtout rendering
        // reduce memory usage; avoid tab killing

        if (ptcBusy === true) return;

        //console.log(1723,9,ptcBusy)
        let isRefreshRequired = false;

        let lastPT = _lastPT
        _lastPT = pt;
        isRefreshRequired = pt < lastPT && lastPT - pt > 0.18 && typeof this.urlChanged == 'function'; // backward timeline => YouTube Bug - update forzen

        DEBUG_e32 && console.log(573,2, pt, lastPT)


        if (isRefreshRequired) {
          
          if(!isFirstBatchMsgDispatched) return;
          // isFirstBatchMsgDispatched can be true when the page is not loaded
          isFirstBatchMsgDispatched = false;

          Promise.resolve(0).then(()=>{
            //avoid long scripting within a single call of g_postToContentWindow()


            let pageLoaded = false;

            try{
              if( this.querySelector('iframe').contentDocument.querySelector('yt-live-chat-renderer #continuations')){
                // isFirstBatchMsgDispatched was wrongly set as true
                pageLoaded=true; 
              }
            }catch(e){}
            
            
            if(!pageLoaded) return;
  
            //console.log(9371,2)
            let taf = Date.now();
            activeFlag = taf;
            ptcBusy = true;
  
  
            setTimeout(() => {
              if (taf !== activeFlag) return;
  
              // this.urlChanged()
              // this.detached();
              // this.attached();
   
                
  
                this.currentPageUrl = "";//  necessary
                this.isListeningForPlayerProgress = false;
                this.setPlayer(null);
                this.isFrameReady = false;
                this.currentPageUrl = window.location.href;
                this.setupPlayerProgressRelay();
  
                setTimeout(()=>{
                  activeFlag = 0;
                  ptcBusy = false;
                  
                }, 230) // time delay for iframe reloading
              
  
            }, 460); //just some delay - allow user operation


          })

          return; // skip update and wait for page refresh
        }
        ptcBusy = true;



        let exec = true;

        if (rfaId > 0 && Date.now() > refreshAt) {
          //console.log(1723,1)
          $cancelAnimationFrame(rfaId); //rfaId is still >0
          tf_gtcw2(); 
        } else if (rfaId === 0) {
          //console.log(1723,2)
          rfaId = $requestAnimationFrame(tf_gtcw2);
        }else{
          exec = false;

        }

        if(exec){
          isFirstBatchMsgDispatched=true; // first batch of messages are dispatched
          let ret = this.__$$postToContentWindow$$__(...arguments)
          DEBUG_e32 && console.log(573,6, ret)
        }

        ptcBusy = false;


      } else {
        
        //{'yt-player-state-change': 3}
        //{'yt-player-state-change': 2}
        //{'yt-player-state-change': 1}
        DEBUG_e32 && console.log(573,25, this.isListeningForPlayerProgress , this.isFrameReady, arguments)
        //isFrameReady is false if iframe is not shown
        this.__$$postToContentWindow$$__(...arguments)
      }
    }
    return g_postToContentWindow;
  }

  let translateHanlder = null;
  
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


    const s6 = Symbol();

    // assume initialTranscriptsRenderer is not called before ceHack()


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
            if(translateHanlder !== null){
              nv.initialSegments = translateHanlder(nv.initialSegments)
            }
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
        if (insObserverChipCloud) insObserverChipCloud.observe(this);
        if (mutObserverChipCloud) mutObserverChipCloud.observe(this,{
          attributes: false, childList: true, subtree: true 
        });
        this[s32] = nv;
      },
      enumerable: false,
      configurable: false // if redefine by YouTube, error comes and change the coding
    });


    document.addEventListener('tabview-fix-popup-refit',function(){

      const P = customElements.get('tp-yt-iron-dropdown').prototype;
      if(!P) return;

      if(P.__refit)return;
      let _refit = P.refit;
      let refitFunc = function () {
        if (this.horizontalAlign || this.verticalAlign) {
          if ((this.__restoreFocusNode || 0).matches) {
            let node = this.__restoreFocusNode
            let nodeName = node.nodeName.toUpperCase();
            if (nodeName === 'YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER') {
              if (node.matches('#tab-videos ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail')) {
                if (this.horizontalAlign) this.horizontalAlign = false;
                if (this.verticalAlign) this.verticalAlign = false;
              }
            }
          }
        }
        if(this.__refit) return this.__refit();
      };
      if (_refit) {

        // fix issue mentioned in https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/157029 
        // reproduction: click watch later without login 
        // without this, the layout coordinates and size (height) of container will become incorrect.

        P.__refit = _refit;
        P.refit = refitFunc;

      }

    },false)

    // ((P) => {

    //   let _refit = P.refit;
    //   let refitFunc = function () {
    //     if (this.horizontalAlign || this.verticalAlign) {
    //       if ((this.__restoreFocusNode || 0).matches) {
    //         let node = this.__restoreFocusNode
    //         let nodeName = node.nodeName.toUpperCase();
    //         if (nodeName === 'YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER') {
    //           if (node.matches('#tab-videos ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail')) {
    //             if (this.horizontalAlign) this.horizontalAlign = false;
    //             if (this.verticalAlign) this.verticalAlign = false;
    //           }
    //         }
    //       }
    //     }
    //     if(this.__refit) return this.__refit();
    //   };
    //   if (_refit) {

    //     // fix issue mentioned in https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/157029 
    //     // reproduction: click watch later without login 
    //     // without this, the layout coordinates and size (height) of container will become incorrect.

    //     console.log(12355)
    //     P.__refit = _refit;
    //     P.refit = refitFunc;

    //   }else{
        
    //     //let s65 = Symbol();
        
    //     console.log(12356)

    //     Object.defineProperty(P, 'refit', {
    //       get() {
    //         return refitFunc;
    //       },
    //       set(nv) {
    //         this.__refit = nv;
    //       },
    //       enumerable: false,
    //       configurable: false // if redefine by YouTube, error comes and change the coding
    //     })

    //   }
    // })(customElements.get('tp-yt-iron-dropdown').prototype);



    //     customElements.get('tp-yt-iron-dropdown').prototype.refit=function(){

    //       if(this && this.__restoreFocusNode && this.__restoreFocusNode.matches && this.__restoreFocusNode.matches('#tab-videos ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail')){

    //         var a = this.sizingTarget.scrollLeft
    //         , b = this.sizingTarget.scrollTop;
    //         this.resetFit();
    //         if(this.horizontalAlign) this.horizontalAlign= false;
    //         if(this.verticalAlign) this.verticalAlign= false;

    //         /*


    //         fit: function() {
    //             this.position();
    //             this.constrain();
    //             this.center()
    //         },

    //         center: function() {
    //             if (!this.__shouldPosition) {
    //                 this._discoverInfo();
    //                 var a = this._fitInfo.positionedBy;
    //                 if (!a.vertically || !a.horizontally) {
    //                     this.style.position = "fixed";
    //                     a.vertically || (this.style.top = "0px");
    //                     a.horizontally || (this.style.left = "0px");
    //                     var b = this.getBoundingClientRect()
    //                       , c = this.__getNormalizedRect(this.fitInto);
    //                     a.vertically || (this.style.top = c.top - b.top + (c.height - b.height) / 2 + "px");
    //                     a.horizontally || (this.style.left = c.left - b.left + (c.width - b.width) / 2 + "px")
    //                 }
    //             }
    //         },
    //         __getNormalizedRect: function(a) {
    //             return a === document.documentElement || a === window ? {
    //                 top: 0,
    //                 left: 0,
    //                 width: window.innerWidth,
    //                 height: window.innerHeight,
    //                 right: window.innerWidth,
    //                 bottom: window.innerHeight
    //             } : a.getBoundingClientRect()
    //         },

    //         */

    // /*

    //        position: function() {
    //             if (this.__shouldPosition) {
    //                 this._discoverInfo();
    //                 window.ShadyDOM && window.ShadyDOM.flush();
    //                 this.style.position = "fixed";
    //                 this.sizingTarget.style.boxSizing = "border-box";
    //                 this.style.left = "0px";
    //                 this.style.top = "0px";
    //                 var a = this.getBoundingClientRect()
    //                   , b = this.__getNormalizedRect(this.positionTarget)
    //                   , c = this.__getNormalizedRect(this.fitInto);
    //                 if (this.expandSizingTargetForScrollbars) {
    //                     var d = this.sizingTarget.offsetWidth;
    //                     var f = this.sizingTarget.offsetHeight;
    //                     var h = this.sizingTarget.clientWidth;
    //                     var l = this.sizingTarget.clientHeight
    //                 }
    //                 var n = this._fitInfo.margin;
    //                 b = this.__getPosition(this._localeHorizontalAlign, this.verticalAlign, {
    //                     width: a.width + n.left + n.right,
    //                     height: a.height + n.top + n.bottom
    //                 }, a, b, c);
    //                 var p = b.left + n.left
    //                   , r = b.top + n.top
    //                   , x = Math.min(c.right - n.right, p + a.width)
    //                   , D = Math.min(c.bottom - n.bottom, r + a.height);
    //                 p = Math.max(c.left + n.left, Math.min(p, x - this._fitInfo.sizedBy.minWidth));
    //                 r = Math.max(c.top + n.top, Math.min(r, D - this._fitInfo.sizedBy.minHeight));
    //                 x = Math.max(x - p, this._fitInfo.sizedBy.minWidth);
    //                 D = Math.max(D - r, this._fitInfo.sizedBy.minHeight);
    //                 this.sizingTarget.style.maxWidth = x + "px";
    //                 this.sizingTarget.style.maxHeight = D + "px";
    //                 p -= a.left;
    //                 a = r - a.top;
    //                 this.style.left = p + "px";
    //                 this.style.top = a + "px";
    //                 if (this.expandSizingTargetForScrollbars) {
    //                     r = this.sizingTarget.offsetHeight;
    //                     f = r - this.sizingTarget.clientHeight - (f - l);
    //                     if (0 < f) {
    //                         this.sizingTarget.style.maxHeight = Math.min(c.height - n.top - n.bottom, D + f) + "px";
    //                         f = this.sizingTarget.offsetHeight;
    //                         l = f - r;
    //                         var H;
    //                         "top" === b.verticalAlign ? H = a : "middle" === b.verticalAlign ? H = a - l / 2 : "bottom" === b.verticalAlign && (H = a - l);
    //                         H = Math.max(c.top + n.top, Math.min(H, c.bottom - n.bottom - f));
    //                         this.style.top = H + "px"
    //                     }
    //                     H = this.sizingTarget.offsetWidth;
    //                     d = H - this.sizingTarget.clientWidth - (d - h);
    //                     if (0 < d) {
    //                         void 0 !== Bsb ? h = Bsb : (h = document.createElement("div"),
    //                         Object.assign(h.style, {
    //                             overflow: "auto",
    //                             position: "fixed",
    //                             left: "0px",
    //                             top: "0px",
    //                             maxWidth: "100px",
    //                             maxHeight: "100px"
    //                         }),
    //                         f = document.createElement("div"),
    //                         f.style.width = "200px",
    //                         f.style.height = "200px",
    //                         h.appendChild(f),
    //                         document.body.appendChild(h),
    //                         Bsb = 1 < Math.abs(h.offsetWidth - 100) ? h.offsetWidth - h.clientWidth : 0,
    //                         document.body.removeChild(h),
    //                         h = Bsb);
    //                         this.sizingTarget.style.maxWidth = Math.min(c.width - n.left - n.right, x + d - h) + "px";
    //                         x = this.sizingTarget.offsetWidth + h;
    //                         d = x - H;
    //                         var L;
    //                         "left" === b.horizontalAlign ? L = p : "center" === b.horizontalAlign ? L = p - d / 2 : "right" === b.horizontalAlign && (L = p - d);
    //                         L = Math.max(c.left + n.left, Math.min(L, c.right - n.right - x));
    //                         this.style.left = L + "px"
    //                     }
    //                 }
    //             }
    //         },
    //         constrain: function() {
    //             if (!this.__shouldPosition) {
    //                 this._discoverInfo();
    //                 var a = this._fitInfo;
    //                 a.positionedBy.vertically || (this.style.position = "fixed",
    //                 this.style.top = "0px");
    //                 a.positionedBy.horizontally || (this.style.position = "fixed",
    //                 this.style.left = "0px");
    //                 this.sizingTarget.style.boxSizing = "border-box";
    //                 var b = this.getBoundingClientRect();
    //                 a.sizedBy.height || this.__sizeDimension(b, a.positionedBy.vertically, "top", "bottom", "Height");
    //                 a.sizedBy.width || this.__sizeDimension(b, a.positionedBy.horizontally, "left", "right", "Width")
    //             }
    //         },

    //         */

    //         this.fit();
    //         this.sizingTarget.scrollLeft = a;
    //         this.sizingTarget.scrollTop = b

    //         return;
    //       }

    //       var a = this.sizingTarget.scrollLeft
    //       , b = this.sizingTarget.scrollTop;
    //       this.resetFit();
    //       this.fit();
    //       this.sizingTarget.scrollLeft = a;
    //       this.sizingTarget.scrollTop = b
    //     }



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

      const ytdFlexyElm = document.querySelector('ytd-watch-flexy[tabview-selection]');
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
      const ytdFlexyElm = document.querySelector('ytd-watch-flexy[tabview-selection]');
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


  if(document.documentElement.hasAttribute('tabview-loaded'))ceHack();else
  document.addEventListener('tabview-ce-hack',ceHack, true);

  

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
        let cmRender = elm.closest('ytd-comment-renderer')
        let tabComments = cmRender.closest('#tab-comments')
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


  document.addEventListener('tabview-no-duplicate-info',function(evt){
    DEBUG_e32 && console.log(9442, evt.type);

    if(cid_teaserInfo){
      clearInterval(cid_teaserInfo)
      cid_teaserInfo=0;
    }
    let mid='';

    cid_teaserInfo = setInterval(()=>{

      let lineExpander = document.querySelector('ytd-watch-metadata ytd-text-inline-expander');
      let [watch_metadata, full, detail, content] = teaserInfoMatchCondition(lineExpander)
        
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
  
  
  document.addEventListener('tabview-fix-autocomplete',function(evt){

    DEBUG_e32 && console.log(9442, evt.type);
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
    DEBUG_e32 && console.log(9442, evt.type);
    window.postMessage({
      tabview: {
        eventType: evt.type,
        eventDetail: evt.detail // in order to get the object detail
      }
    }, location.origin);
  }, false);


  function tabviewInfoTogglerOnClick (evt){
    let dom = evt.target;
    let description = dom.closest('#description')
    if(!description) return;
    let button = description.querySelector('tp-yt-paper-button#collapse[role="button"]:not([hidden]), tp-yt-paper-button#expand[role="button"]:not([hidden])');
    if(!button) return;
    setTimeout(()=>{ //setTimeout / raf required - js event issue
      button.click();
    },30);
    evt.preventDefault();
  }


  document.addEventListener('tabview-info-toggler', (evt)=>{
    let node = (evt||0).target;
    node.addEventListener('click',tabviewInfoTogglerOnClick, false)
  }, true);

  document.addEventListener('tabview-resize-comments-rows',(evt)=>{
    //slightly delayed
    //console.log('tabview-resize-comments-rows')
    for(const s of document.querySelectorAll('#tab-comments #comments .tyt-visible-comment ytd-expander')){
      Promise.resolve(s).then(()=>{
        s.calculateCanCollapse();
      });
    }

  }, false)
  

  document.addEventListener('tabview-page-rendered', () => {
    isPageRendered = true;
  })


  let miniview_enabled = false



  document.addEventListener("tabview-miniview-browser-enable2", () => {

    if(miniview_enabled) return;

    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    if (!isPassiveArgSupport) return;

    console.log("tabview-miniview-browser-enable")

    miniview_enabled = true;

    let ytdApp = document.querySelector('ytd-app');

    if(!ytdApp) return;

    let mReq = null;
    ytdApp.handleNavigate=((handleNavigate)=>{

      return function (req) {


        console.log(req)
        if(mReq){

          req.command = mReq.command;
          mReq = null;
          return handleNavigate.call(this, req);

        } 
        console.log(req)

        let endpoint = null;
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
            if (endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata) {

              let meta = endpoint.commandMetadata.webCommandMetadata
              if (/*meta.apiUrl &&*/ meta.url && meta.webPageType) {
                valid = true;
              }

            }
          }

          if (!valid) endpoint = null;

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

        let btn; 
        if (endpoint) {

          btn = document.querySelector('.tabview-normal-player #movie_player button.ytp-miniplayer-button.ytp-button');

          if (!btn) endpoint = null;

        }

        if (!endpoint) return handleNavigate.apply(this, arguments);

        mReq = req;

        let gid = null;
        let phref = null;

        function stopVideo() {
          if (pageID !== gid) return;

          if (location.href !== phref) return;

          for (const video of document.querySelectorAll('ytd-browse video')) {
            video.pause();
          }

        }

        document.addEventListener('yt-page-data-fetched', (evt) => {

          gid = pageID
          phref = location.href;

          stopVideo();

          setTimeout(() => {
            stopVideo();
          }, 100);

          setTimeout(() => {
            stopVideo();
          }, 300);

          setTimeout(() => {
            stopVideo();
          }, 700);

        },{once:true})

        btn.click();



      };

    })(ytdApp.handleNavigate);
  });


  document.addEventListener("tabview-miniview-browser-enable", () => {

    if(miniview_enabled) return;

    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    if (!isPassiveArgSupport) return;

    console.log("tabview-miniview-browser-enable")

    miniview_enabled = true;

    let ytdApp = document.querySelector('ytd-app');

    if(!ytdApp) return;

    let isBusy = false;
    let mReq = null;
    ytdApp.handleNavigate=((handleNavigate)=>{

      return function (req) {

        //console.log(332,req)
        if(isBusy){

          arguments[0].command = mReq.command; 
          // not 100% guarantee. but it might help to not load the default page

          //console.log(arguments[0], mReq)
          return handleNavigate.apply(this, arguments);
        } 


        let endpoint = null;
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
            if (endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata) {

              let meta = endpoint.commandMetadata.webCommandMetadata
              if (/*meta.apiUrl &&*/ meta.url && meta.webPageType) {
                valid = true;
              }

            }
          }

          if (!valid) endpoint = null;

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
 
        let btn; 
        if (endpoint) {

          btn = document.querySelector('.tabview-normal-player #movie_player button.ytp-miniplayer-button.ytp-button');

          if (!btn) endpoint = null;

        }
 
        if (!endpoint) return handleNavigate.apply(this, arguments);
       

        isBusy = true;
        mReq = req;


        if (pageID > 800) pageID = (pageID % 800);

        let kid = pageID;


        let mArgs = [this, arguments];

        async function step() {

          let evtYtPageTypeChanged = await new Promise(resolve => {

            document.addEventListener('yt-page-type-changed', (evt) => {

              resolve(evt);

            }, { once: true });


            Promise.resolve(0).then(() => {
              document.documentElement.classList.add('tyt-no-display')
              btn.click();
            });

          });


          // mini player is set

          if (!(pageID <= kid + 2)) return;

          let evtYtPageDataFetched = await new Promise(resolve => {

            document.addEventListener('yt-page-data-fetched', (evt) => {

              resolve(evt);
            }, { once: true })

            // navigate url
            handleNavigate.apply(mArgs[0], mArgs[1]);

          });


          // new url page fetched

          document.documentElement.classList.remove('tyt-no-display');

          if (!(pageID <= kid + 4)) return;
          let gid = pageID;
          let phref = location.href;

          function stopVideo() {
            if (pageID !== gid) return;

            if (location.href !== phref) return;

            for (const video of document.querySelectorAll('ytd-browse video')) {
              video.pause();
            }

          }

          stopVideo();

          setTimeout(() => {
            stopVideo();
          }, 100);

          setTimeout(() => {
            stopVideo();
          }, 300);

          setTimeout(() => {
            stopVideo();
          }, 700);

          isBusy = false;

        }
        step();

        

      };

    })(ytdApp.handleNavigate);




  })


  document.documentElement.setAttribute('tabview-unwrapjs', '1')
  if (document.documentElement.hasAttribute('plugin-tabview-youtube')) {
    document.dispatchEvent(new CustomEvent("tabview-plugin-loaded"))
  }



  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();