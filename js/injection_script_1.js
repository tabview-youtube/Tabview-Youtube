"use strict";

function injection_script_1() {
  "use strict";

  if (!window || !window.IntersectionObserver || !window.Symbol) throw 'Your browser does not support Tabview userscript.';

  if (document.documentElement.hasAttribute('tabview-unwrapjs')) return;
  document.documentElement.setAttribute('tabview-unwrapjs', '')

  const querySelectorFromAnchor = HTMLElement.prototype.querySelector;
  const querySelectorAllFromAnchor = HTMLElement.prototype.querySelectorAll;
  const closestFromAnchor = HTMLElement.prototype.closest;

  const $requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const $cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  // /** @type {(o: Object | null) => WeakRef | null} */
  const mWeakRef = typeof WeakRef === 'function' ? (o => o ? new WeakRef(o) : null) : (o => o || null); // typeof InvalidVar == 'undefined'

  // /** @type {(wr: Object | null) => Object | null} */
  const kRef = (wr => (wr && wr.deref) ? wr.deref() : wr);


  const DEBUG_e32 = false;

  let ptcBusy = false;
  let _ceHack_calledOnce = false;
  let cid_teaserInfo = 0;
  let isPageRendered = false;
  let isLoadStartListened = false;


  DEBUG_e32 && console.log(9442, 103);

  let chatroomRenderer = null

  // let lvoSymbol = Symbol();
  document.addEventListener('tabview-chatroom-ready', function (evt) {
    // trigger on every iframe loaded


    DEBUG_e32 && console.log(9442, evt.type);

    /** @type {HTMLIFrameElement} */
    let iframe = evt.target;
    if (!iframe || iframe.nodeType !== 1 || !iframe.matches('ytd-live-chat-frame #chatframe')) return;

    chatroomRenderer = null
    try{
      chatroomRenderer = mWeakRef(iframe.contentWindow.document.querySelector('yt-live-chat-renderer'))
    }catch(e){}

    try{

      document.querySelector('#chat').postToContentWindow({ 'yt-player-video-progress': document.querySelector('#movie_player video[src]').currentTime })

    }catch(e){ }
  }, true)

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
            targets.push(entry.target);
          }
        }
        Promise.resolve(0).then(()=>{
          for(const target of targets){
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

  let resetChatroomFlags = null;


  let pageID = 0;

  let pageType = null;


  function onPageFetched(evt) {


    //console.log(evt.type, pageID)

    pageType = ((evt.detail || 0).pageData || 0).page;



  }

  function onPageFinished(evt) {


    //console.log(evt.type, pageID)

    if ((pageID % 2) === 1) {
      pageID++;

      translateHanlder = null;  // release the memory used for previous page
      Promise.resolve(0).then(() => {
        translateHanlder = getTranslate(); // release the memory used for previous page
      })

    }


  }


  function pageLoad(evt) {

    //console.log(evt.type, pageID)

    if ((pageID % 2) === 0) {

      isPageRendered = false;
      pageID++;
      if (resetChatroomFlags) resetChatroomFlags();


    }

  }


  /* align content.js */

  // document.addEventListener('yt-navigate', pageLoad)
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
  document.addEventListener('yt-navigate-finish', onPageFinished)


  function getFunc_postToContentWindow() {
    DEBUG_e32 && console.log(9442, '-postToContent');
    let refreshAt = 0;
    let rfaId = 0;
    const tf_gtcw2 = function (x) {
      if (rfaId > 0) {
        rfaId = 0;
        refreshAt = Date.now() + 460;
      }
    };

    let _lastPT = 0;

    resetChatroomFlags = () => {
      _lastPT = 0;
    };

    let cnpCID = 0;
    document.addEventListener('tabview-chatroom-newpage', function (evt) {

      if (cnpCID) clearTimeout(cnpCID);
      cnpCID = 0;

      //console.log(12399,2)
      let nodeName = ((evt || 0).target || 0).nodeName
      if (nodeName !== 'YTD-LIVE-CHAT-FRAME') return;

      //console.log(12399,3)
      let chat = evt.target
      let iframe = chat.querySelector('iframe#chatframe[src]')
      if (!iframe) return;


      //let cc=3;
      cnpCID = setTimeout(function () {

        cnpCID = 0;


        //console.log(12399,4)
        let cDoc = iframe.contentDocument
        if (!cDoc) return;

        /* chat.isListeningForPlayerProgress is no longer applicable */
        if (checkChatNativeReady(chat) && cDoc.querySelector('body:empty')) {
          chat.urlChanged();

        }

        //console.log(12399,6)

      }, 46); // delay in case empty body cannot be detected


    }, true);



    let messageExist = false
    let chatDataFN = null



    function isRefreshIframeRequired(chat) {
      let res = false

      let p = chat.data
      if (p && typeof p === 'object') {

        if (p.liveChatRenderer && p.liveChatRenderer.continuations && p.liveChatRenderer.isReplay === true) {


          try {

            /** @type {HTMLIFrameElement | null} */
            let iframe = chat.querySelector('iframe')
            let idoc = iframe.contentWindow.document

            let continuation = idoc.querySelector('[aria-selected="true"] yt-reload-continuation').data.continuation

            // suck
            // let continuation = idoc.querySelector("yt-player-seek-continuation").data.continuation

            // suck
            // let continuation = idoc.querySelector("yt-live-chat-replay-continuation").data.continuation

            let cr = idoc.querySelector('yt-live-chat-renderer')
            if (typeof continuation === 'string' && cr) {
              res = { cr, continuation, chat }
            }
          } catch (e) { }

        }
      }


      return res;
    }

    async function refreshIframe2(kr) {
      let { chat, continuation, cr } = kr; 

      let a = {
        endpoint: {
          liveChatReplayEndpoint: {
            continuation: continuation // string
          }
        },
        params: {
          hidden: false // see a = N0(this, b, "reload");
        },
        // type: "seek", // "reload"
        type: "reload",
        retries: 0,
        continuationUrl: "navigateEvent", // no use; for logging message only
        createdTime: Date.now() // no use
      }
  
      (function () {
        this.requestData_(a) 
      }).call(cr);




    }

    async function refreshIframe(kr) {
      let { chat, continuation, cr } = kr;
      // let dr = cr.$$("yt-player-seek-continuation")

      /*

      yt-live-chat-app

      yt-live-chat-renderer

      reloadContinuationData

      2 x yt-reload-continuation (1 elm per each sub-menu item)
      
      1 x yt-live-chat-replay-continuation
      1 x yt-player-seek-continuation
      
      $$("yt-player-seek-continuation").fireSeekContinuationAtCurrentProgress()
      buggy

      
      timeRemainingMsecs


    "promise": {
        "state_": 1,
        "parent_": null,
        "callbackEntries_": null,
        "callbackEntriesTail_": null,
        "executing_": false,
        "hadUnhandledRejection_": false
    }

    
      let dr = cr.$$("yt-player-seek-continuation")
      let p1 =  dr.fireSeekContinuationAtCurrentProgress
      let p2 = dr.fireSeekContinuation_
      let p3 = dr.maybeFireSeekContinuation

      */

      let a = {
        endpoint: {
          liveChatReplayEndpoint: {
            continuation: continuation // string
          }
        },
        params: {
          hidden: false // see a = N0(this, b, "reload");
        },
        // type: "seek", // "reload"
        retries: 0,
        continuationUrl: "navigateEvent", // no use; for logging message only
        createdTime: Date.now() // no use
      }

      let pi = 0;
      Object.defineProperty(a, 'type', {
        get() {
          // "seek" == b.type ? By(a, "yt-live-chat-seek-start", []) : "reload" == b.type && By(a, "yt-live-chat-reload-start", []))
          // fake it as seek to make "yt-live-chat-seek-start" instead of "yt-live-chat-reload-start"
          // this is to prevent seek for "t=xxxx" by default
          // 1. make seek effect
          // 2. avoid t=xxxx
          pi++

          if (pi <= 2) return 'seek'
          return 'reload'
        },
        set(nv) {
          return true // could be read-only
        },
        enumerable: true,
        configurable: true // could be false
      });

      // let mm = { reloadContinuationData: { continuation: continuation } };

      (function () {
        // this.detached();

        // see M0.prototype.onLoadReloadContinuation_
        this.smoothedQueue_.clear();
        this.activeRequest && (this.activeRequest.promise.cancel(),
          this.activeRequest = null);
        this.nextRequest_ && (this.nextRequest_.promise.cancel(),
          this.nextRequest_ = null);

        // avoid playback cache
        this.currentPlayerState_ = {}
        this.replayBuffer_.clear()


        // see M0.prototype.onNavigate_
        this.requestData_(a)

        // cr.$$("yt-player-seek-continuation").fireSeekContinuationAtCurrentProgress()
        // cr.retry(a, null)

        // this.requestData_(a)
        // this.attached()

        // this.onLoadSeekContinuation_(new CustomEvent('yt-reload-continuation', {detail:{    endpoint: {liveChatEndpoint: {  continuation: mm }  }  }}))

      }).call(cr);


      await Promise.resolve(0)
      chat = null
      kr = null

      chatDataFN = () => {
        chatDataFN = null
        ptcBusy = false;
      }

 
      setTimeout(() => {
        if (chatDataFN && !chatDataFN.trigger) {
          try {
            chatDataFN()
            document.querySelector('#chat').postToContentWindow({ 'yt-player-video-progress': _lastPT })
          } catch (e) {
            console.warn(e)
          }
        }
      }, 800)


    }

    let postI =0

    //let reloadedCounter = 0;
    function detachIt(chat){
      chat.classList.remove('tyt-chat-frame-ready')
      addedChatFrameReady = false;
      chat.detached();
      if (chat.isAttached === true) chat.isAttached = false;
      reset(0);
    }
    function attachIt(chat){
      chat.attached();
      if (chat.isAttached === false) chat.isAttached = true;
      reset(0);
    }

    async function checkPageSwitchedForChat3(){

      let p = document.querySelector('ytd-live-chat-frame#chat[tyt-iframe-loaded]:not([collapsed])')
      if (p) {
        // reloadedCounter = 0;
        // console.log(p.isAttached, p.isFrameReady,p.isConnected)
        await new Promise(r => setTimeout(r, 300));
        if(p.collapsed===false && addedChatFrameReady === false){
          // console.log(p.isAttached, p.isFrameReady,p.isConnected)
          if(p.isAttached === true){

          }else{
            try {
              p.urlChanged();
            } catch (e) { }
          }
          
        }
      }

    }
    
    async function checkPageSwitchedForChat2(){
      
      let q = document.querySelector('ytd-live-chat-frame#chat')
      if(q) chat.classList.remove('tyt-chat-frame-ready')
      addedChatFrameReady = false;

      let p = document.querySelector('ytd-live-chat-frame#chat[tyt-iframe-loaded]:not([collapsed])')
      if (p) {
        detachIt(p);
      }
    }

    let isChatReplay = null
    document.addEventListener('yt-page-data-fetched', function (evt) {
      isChatReplay = null
      checkPageSwitchedForChat2();
    })
    document.addEventListener('yt-navigate-finish', function (evt) {
      // when chat is open, page switching
      // eg. live replay -> video -> click livestream -> expand chat -> history back to live replay

      checkPageSwitchedForChat3();
      

    }, true)

    function reset(k){
      ptcBusy = false
      chatDataFN = null
      _lastPT = 0
      messageExist = false
      postI = k;
    }

    let addedChatFrameReady = false
    document.addEventListener('tabview-chatroom-ready', function (evt) {
      // trigger on every iframe loaded
  
      reset(0);

    }, true)

    function checkChatNativeReady(chat){
      if(chat.isAttached === false) return false;
      if('isFrameReady' in chat && chat.isFrameReady !== true) return false
      return true;
    }
  

    const g_postToContentWindow = async function () {
      /*
      if(!reloadedCounter && this.isFrameReady === true) {
        reloadedCounter = 1;
      }
      */

      if (isChatReplay === null) {
        isChatReplay = ((this.data || 0).liveChatRenderer || 0).isReplay
      }
      if (isChatReplay === true) {
        if (this.collapsed === true && this.isAttached === true) {
          detachIt(this)
          return;
        }
        if (this.collapsed === false && this.isAttached === false) {
          attachIt(this)
          return;
        }
      }

      if(this.collapsed === true) return;

      

      let boolz = checkChatNativeReady(this);

      
      if (!addedChatFrameReady && boolz) {
        addedChatFrameReady = true
        this.classList.add('tyt-chat-frame-ready')
      }


      /* this.isListeningForPlayerProgress is no longer applicable */
      let pt = arguments[0]['yt-player-video-progress'];

      if(postI === 0){
        postI++
        boolz = false; // skip postI === 0
      }
      
      if (isChatReplay === false) boolz = false; // only chat replay requires yt-player-video-progress


      if (boolz && pt >= 0) {

        // if (!isPageRendered) return; // ignore the chatroom rendering if it is completely under background wihtout rendering
        // reduce memory usage; avoid tab killing

        let lastPT = _lastPT
        _lastPT = pt;

        postI++
        if (postI > 1e9) postI = 9;
        let tmp_postI= postI;

        
        if (chatDataFN) {
          pt > lastPT && chatDataFN()
        }

        while (ptcBusy) {
          await new Promise(r => window.requestAnimationFrame(r))
          if(tmp_postI!== postI) return
        }
        
      
        let cr =  kRef(chatroomRenderer);
        if (!cr) return
        while (cr.hasAttribute('loading')) {
          await new Promise(r => window.requestAnimationFrame(r))
          if(tmp_postI!== postI) return
        }



        //console.log(1723,9,ptcBusy)
        let isRefreshRequired = false;

        

        // for livechat replay, expanded the chat
       // console.log(334,9999,postI)
        
        // backward timeline => YouTube Bug - update forzen
        isRefreshRequired = pt < lastPT && lastPT - pt > 0.18 && typeof this.urlChanged == 'function';
        


        DEBUG_e32 && console.log(573, 2, pt, lastPT)


        if (isRefreshRequired) {

          let isSkip = false

          let tmp_messageExist = null
 

          let items = cr.querySelector('#items')
          if (items) {

            if (items.firstChild) {
              tmp_messageExist = true
            } else {
              tmp_messageExist = false
            }

          }



          if (tmp_messageExist === null) { isSkip = true }
          if (tmp_messageExist === false && messageExist === true) { isSkip = true }

          if (!isSkip) {
            messageExist = tmp_messageExist

            let kr = isRefreshIframeRequired(this) 

            if (kr) {
              ptcBusy = true;
              // console.log(666)
              refreshIframe(kr);
            }

            return; // skip update and wait for page refresh

          }


        }
        ptcBusy = true;

        if (chatDataFN) {
          chatDataFN.trigger = true
        }


        let exec = true;

        if (rfaId > 0 && Date.now() > refreshAt) {
          //console.log(1723,1)
          $cancelAnimationFrame(rfaId); //rfaId is still >0
          tf_gtcw2();
        } else if (rfaId === 0) {
          //console.log(1723,2)
          rfaId = $requestAnimationFrame(tf_gtcw2);
        } else {
          exec = false;

        }

        if (exec) {

          let ret = this.__$$postToContentWindow$$__(...arguments)
          DEBUG_e32 && console.log(573, 6, ret)
          await Promise.resolve(0)

        }

        ptcBusy = false;


      } else {

        //{'yt-player-state-change': 3}
        //{'yt-player-state-change': 2}
        //{'yt-player-state-change': 1}
        
        //isFrameReady is false if iframe is not shown
        this.__$$postToContentWindow$$__(...arguments)
      }
    }
    return g_postToContentWindow;
  }

  let translateHanlder = null;

  function ceHack(evt) {

    if (_ceHack_calledOnce) return;
    _ceHack_calledOnce = true;
    console.log('ce-hack')

    if (typeof customElements === 'undefined') throw 'Your browser does not support Tabview userscript.';
    // note: YouTube implements its on window.customElements when it detects the browser is old.

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

    let insObserver = getInsObserver();

    Object.defineProperty(customElements.get('ytd-expander').prototype, 'recomputeOnResize', {
      get() {
        if (this.calculateCanCollapse !== funcCanCollapse) {
          this.calculateCanCollapse = funcCanCollapse
          if (insObserver) insObserver.observe(this)
        }
        return this[s1];
      },
      set(nv) {
        if (this.calculateCanCollapse !== funcCanCollapse) {
          this.calculateCanCollapse = funcCanCollapse
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

    requestAnimationFrame(() => {
      if (translateHanlder === null)
        translateHanlder = getTranslate();
    })

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
            if (translateHanlder !== null) {
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

    let cid55 = setInterval(() => {
      let frameCE_prototype = customElements.get('ytd-live-chat-frame').prototype;
      //p&&(p.configurable=!0,Object.defineProperty(a,m,p))}}

      if (frameCE_prototype && !frameCE_prototype.__$$postToContentWindow$$__ && typeof frameCE_prototype.postToContentWindow == 'function') {
        const g_postToContentWindow = getFunc_postToContentWindow();
        frameCE_prototype.__$$postToContentWindow$$__ = frameCE_prototype.postToContentWindow
        frameCE_prototype.postToContentWindow = g_postToContentWindow
        clearInterval(cid55)
        cid55 = 0;
      }
      if (--trial55 === 0 && cid55 > 0) {
        clearInterval(cid55);
        cid55 = 0;
      }
    }, 150)


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
        if (mutObserverChipCloud) mutObserverChipCloud.observe(this, {
          attributes: false, childList: true, subtree: true
        });
        this[s32] = nv;
      },
      enumerable: false,
      configurable: false // if redefine by YouTube, error comes and change the coding
    });


    document.addEventListener('tabview-fix-popup-refit', function () {

      const P = customElements.get('tp-yt-iron-dropdown').prototype;
      if (!P) return;

      if (P.__refit) return;
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
        if (this.__refit) return this.__refit();
      };
      if (_refit) {

        // fix issue mentioned in https://greasyfork.org/en/scripts/428651-tabview-youtube/discussions/157029 
        // reproduction: click watch later without login 
        // without this, the layout coordinates and size (height) of container will become incorrect.

        P.__refit = _refit;
        P.refit = refitFunc;

      }

    }, false)

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

  function isDOMVisible(/** @type {HTMLElement} */ elem) {
    // jQuery version : https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

  /*
    let lastCall_genius_lyrics_set_title = 0 ;
    function getSimpleText(defaultMetadata) {
  
      if (typeof defaultMetadata.simpleText === 'string') return defaultMetadata.simpleText;
      if (defaultMetadata.runs) {
        let texts = defaultMetadata.runs.map(entry => entry.text);
        if (texts.length === 1 && typeof texts[0] === 'string') return texts[0];
      }
  
    }
  
  
    function get_carouselLockups(ep){
  
      if(!ep) return null;
    
      let m = null;
      try{
        m=ep.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items[2].videoDescriptionMusicSectionRenderer.carouselLockups;
      }catch(e){
        m= null;
      }
      return m;
  
    }
    */
  /*
  function getTitle(pData, onerror){


    try{

      let response = pData.response;
        
      let ep = response.engagementPanels;
      let mi = 0;

      let carouselLockups = null;

      while (mi < ep.length) {

        let m = get_carouselLockups(ep[mi]);
        if (m !== null) {
          carouselLockups = m;
          break;
        }

        mi++;

      }


      if(carouselLockups && carouselLockups.length ===1){

        let a1 = getSimpleText(carouselLockups[0].carouselLockupRenderer.infoRows[0].infoRowRenderer.defaultMetadata);
        let a2 = getSimpleText(carouselLockups[0].carouselLockupRenderer.infoRows[1].infoRowRenderer.defaultMetadata);

        //console.log(a1,a2)
        if(a1 && a2 && typeof a1 =='string' && typeof a2=='string'){

          let title = pData.playerResponse.videoDetails.title; 
          if(title && typeof title =='string'){

            a1=a1.replace(/だ/g,'だ').toLowerCase();
            a2=a2.replace(/だ/g,'だ').toLowerCase();
            title=title.replace(/だ/g,'だ').toLowerCase();
            //console.log(title, a1, a2)

            let newValue = `${a2} ${a1}`;
            return {
              title: title,
              singer: a2,
              song: a1,
              text: newValue
            }

          }

        }

      }

    }catch(e){

      if(onerror) onerror(e)

    }

    return null;

  }
  */

  function addStyleToLyricsIframe() {




    let lyricsIframe = document.querySelector('#lyricsiframe');
    let ytdApp = document.querySelector('ytd-app');
    if (!lyricsIframe || !ytdApp) return;


    if (lyricsIframe.contentDocument === null) return;



    let cStyle = getComputedStyle(ytdApp);
    let background = cStyle.getPropertyValue('--yt-spec-base-background');
    let color = cStyle.getPropertyValue('--yt-spec-text-primary');
    let bbp = cStyle.getPropertyValue('--yt-spec-brand-background-primary');
    let cfs = cStyle.getPropertyValue('--yt-caption-font-size');
    let slbc = cStyle.getPropertyValue('--ytd-searchbox-legacy-button-color');
    let fontSize = null;

    let expander = document.querySelector('ytd-expander.style-scope.ytd-video-secondary-info-renderer');
    if (expander) {

      fontSize = getComputedStyle(expander).fontSize;

    } else {
      fontSize = cStyle.fontSize;
    }
    if (typeof background == 'string' && typeof color == 'string' && background.length > 3 && color.length > 3) {

    } else {
      background = null;
      color = null;
    }

    if (typeof fontSize == 'string' && fontSize.length > 2) { }
    else {
      fontSize = null;
    }

    if (typeof bbp == 'string') {

    } else {
      bbp = null;
    }
    if (typeof cfs === 'string') {

    } else {
      cfs = null;
    }
    if (typeof slbc === 'string') {

    } else {
      slbc = null;
    }


    function addStyle(/** @type {string} */ styleText, /** @type {HTMLElement | Document} */ container) {
      const styleNode = document.createElement('style');
      //styleNode.type = 'text/css';
      styleNode.textContent = styleText;
      (container || document.documentElement).appendChild(styleNode);
      return styleNode;
    }




    let css = [`
    
    html{
      --tyt-background: ${background === null ? '' : `${background}`};
      --tyt-color: ${color === null ? '' : `${color}`};
      --tyt-font-size: ${fontSize === null ? '' : `${fontSize}`};
      --yt-spec-brand-background-primary: ${bbp === null ? '' : `${bbp}`};
      --yt-caption-font-size: ${cfs === null ? '' : `${cfs}`};
      --ytd-searchbox-legacy-button-color: ${slbc === null ? '' : `${slbc}`};
    }

    body{
      background: var(--tyt-background);
      color: var(--tyt-color);
      font-size: var(--tyt-font-size);
    }

    div[data-lyrics-container]{
      font-size: var(--tyt-font-size);
    }

    div[class*="SongPageGrid"], div[class*="SongHeader"]{
      background:none;
      padding:0;
      color: var(--tyt-color);
    }

    div[data-exclude-from-selection]{
      display:none;
    }

          
    main[class*="Container"] a[href]{
        color: var(--tyt-color) !important;
    }

    main[class*="Container"] h1[font-size][class]{
        color: var(--tyt-color);
    }

    *[class]{
        color: var(--tyt-color) !important;
    }



    div[class*="SongHeaderWithPrimis__Left"]{
      display:none;
    }

    div[class*="SongPageGriddesktop"]{
      display:block;
    }
    
    span[class*="LabelWithIcon"] > svg{
      fill: var(--tyt-color);
    }
    button[class*="LabelWithIcon"] > svg{
      fill: var(--tyt-color);
    }
    
    div[class*="Tooltip__Container"] svg{
      fill: var(--tyt-color);
    }

    #application {
      padding:28px;
    }

    div[class*="SongHeaderWithPrimis__Information"] div[class*="HeaderCreditsPrimis__Container"]{

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      justify-items: center;
    }

    div[class*="SongHeaderWithPrimis__Information"] {

      margin: 12px auto;
      max-width: 100%;
      white-space: normal;


    }

    div[class*="SongHeaderWithPrimis__Bottom"] a[href]{

      padding:0;
      margin:0;
    }
    
    div[class*="SongHeaderWithPrimis__Right"]{
      background: var(--ytd-searchbox-legacy-button-color);
      padding: 10px 18px;
    }

    div[data-lyrics-container][class*="Lyrics__Container"]{
      padding:0;
    }

    body .annotated span,
    body .annotated span:hover,
    body a[href],
    body a[href]:hover,
    body .annotated a[href],
    body .annotated a[href]:hover,
    body a[href]:focus-visible,
    body .annotated a[href]:focus-visible,
    body .annotated:hover span,
    body .annotated.highlighted span{
      background: none;
      outline: none;

    }

    a[href][class],
    span[class*="PortalTooltip"],
    div[class*="HeaderCreditsPrimis"],
    div[class*="HeaderArtistAndTracklistPrimis"]{
      font-size: inherit;
    }

    
    div[class*="SongHeaderWithPrimis__Information"] h1 + div[class*="HeaderArtistAndTracklistPrimis"] {
      font-size: 80%;
      margin-top: 10px;
      margin-bottom: 6px;
    }

    body{
      white-space: nowrap;
    }

    div[class*="MetadataStats__Stats"]{   
      display: flex;
      flex-wrap: wrap;
      white-space: nowrap;    
      row-gap: 4px;
      column-gap: 16px;
      white-space: nowrap;
      margin-top: 6px;
    }

    h1,
    div[class*="SongPage__LyricsWrapper"]{

      white-space: normal;
    }

    
    div[class*="MetadataStats__Stats"] > [class]{  
      margin-right: 0;
    }

    div[class*="SongHeaderWithPrimis__Information"] div[class*="HeaderCreditsPrimis__List"]{
      font-size:85%;
    }


    div[class*="SongHeaderWithPrimis__Information"] ~ div[class*="SongHeaderWithPrimis__PrimisContainer"]{
      display:none;
    }

    main, #application{
      --tyt-container-display: none;
    }

    div[class*="SongHeaderWithPrimis__Information"]{
      --tyt-container-display: '-NULL-';
    }

    div[class*="Footer"],
    div[class*="Leaderboard"] {
      display:none;
    }

    div[class*="SongPage__Section"] #about,
    div[class*="SongPage__Section"] #about ~ *,
    div[class*="SongPage__Section"] #comments,
    div[class*="SongPage__Section"] #comments ~ * {
      display:none;
    }
    
    div[class*="SongPage__Section"] #lyrics-root-pin-spacer {
      padding-top:12px;
    }

    `
    ].join('\n');

    //addStyle(css, lyricsIframe.contentDocument.head);

    Promise.resolve(0).then(() => {
      lyricsIframe.classList.remove('tyt-tmp-hide-lyricsiframe');

    })
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
    }

    newPanel.classList.add('style-scope', 'ytd-watch-flexy')

    querySelectorFromAnchor.call(ytdFlexyElm, '#panels').appendChild(newPanel)

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
          let panel = epc.closest('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]')
          if (panel) {
            panel.classList.toggle('epanel-lyrics-loading', true);
          }
          epc.appendChild(lyricsiframe)
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
          epc.appendChild(elm)

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
  window.addEventListener('message', (evt) => {
    let data = ((evt || 0).data || 0)

    const panel_cssSelector = 'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]'

    if (data && data.iAm === 'Youtube Genius Lyrics' && data.type === 'pageready') {
      addStyleToLyricsIframe();
    } else if (data && data.iAm === 'Youtube Genius Lyrics' && data.type === 'lyricsDisplayState') {

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


  document.addEventListener('tabview-no-duplicate-info', function (evt) {
    DEBUG_e32 && console.log(9442, evt.type);

    if (cid_teaserInfo) {
      clearInterval(cid_teaserInfo)
      cid_teaserInfo = 0;
    }
    let mid = '';

    cid_teaserInfo = setInterval(() => {

      let lineExpander = document.querySelector('ytd-watch-metadata ytd-text-inline-expander');
      let [watch_metadata, full, detail, content] = teaserInfoMatchCondition(lineExpander)

      let tid = `${content.length},${full.length},${detail.length}`
      if (mid === tid) return null;
      mid = tid;

      let b1 = content.length === full.length && full.length > detail.length && content.length > full.length - detail.length

      if (b1 && textsMatch(full, detail)) {

        let newLen = full.length - detail.length

        if (newLen > 1 && /^\s*[\u2022\u2023\u25E6\u2043\u2219\.\,]?\s*$/.test(content[newLen - 1].text || '0')) newLen--;
        content.length = newLen

        lineExpander.alwaysShowExpandButton = false;

        lineExpander.resize(true);
      }

    }, 150);


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
        if (x.parentNode) x.remove();
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
    let description = dom.closest('#description')
    if (!description) return;
    let button = description.querySelector('tp-yt-paper-button#collapse[role="button"]:not([hidden]), tp-yt-paper-button#expand[role="button"]:not([hidden])');
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

  }, false)


  document.addEventListener('tyt-close-popup', (evt) => {
    let cr = kRef(chatroomRenderer)

    if (cr) {

      try {
        cr.closePopoutWindow();
      } catch (e) { }

    }

  }, false)

  let popupBtnId = 0
  let mtoIframePopup = null
  document.addEventListener('tyt-iframe-popup-btn-setup', (evt) => {


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

  }, true)

  /*
  window.addEventListener('beforeunload',()=>{

    try{
      popupClose && popupClose();
    }catch(e){}
  },true)

  window.addEventListener('hashchange',()=>{
    
    try{
      popupClose && popupClose();
    }catch(e){}
  },true)

  window.addEventListener('popstate',()=>{
    
    try{
      popupClose && popupClose();
    }catch(e){}
  },true)
  */


  document.addEventListener('tabview-page-rendered', () => {
    isPageRendered = true;
  })


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

    ytdApp.handleNavigate = ((handleNavigate) => {

      return function (req) {

        const $this = this;
        const $arguments = arguments;

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

        const once = { once: true };

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
              delete this.playlistId;
              this.playlistId = value;
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

  })


  document.documentElement.setAttribute('tabview-unwrapjs', '1')
  if (document.documentElement.hasAttribute('plugin-tabview-youtube')) {
    document.dispatchEvent(new CustomEvent("tabview-plugin-loaded"))
  }


  //effected subtitle - https://www.youtube.com/watch?v=Ud73fm4Uoq0

}

injection_script_1();