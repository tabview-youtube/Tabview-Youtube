"use strict";

function injection_script_1() {

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

  document.addEventListener('userscript-call-dom-value', function(evt) {

      if (!evt || !evt.target || !evt.detail) return;
      let dom = evt.target;
 
      let { property, args } = evt.detail;
      if (!property) return;
      dom[property] = args;
 
    }, true)

*/
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
  /*
  document.addEventListener('userscript-call-dom-value-stacked', function(evt) {

      if (!evt || !evt.target || !evt.detail) return;
      let document = evt.target;

      let { selector, property, args } = evt.detail;
      if (!selector||!property) return;
      let elements = document.querySelectorAll(selector);
      for(const element of elements){
          element[property] = args;
      }

    }, false)

    document.addEventListener('userscript-call-dom-const-stacked', function(evt) {

      if (!evt || !evt.target || !evt.detail) return;
      let document = evt.target;

      let { selector, property, args } = evt.detail;
      if (!selector||!property) return;
      let elements = document.querySelectorAll(selector);
      const singleConfig = {
          get(){return args;},
          set(nv){},
          enumerable: true,
          configurable: true
        }
        console.log(453,elements)
      for(const element of elements){
          Object.defineProperty(element, property, singleConfig );
      }

    }, false)
    */


  let s1 = Symbol();
  //let s2 = Symbol();

  // note: after content expanded, resizing window will casue the "collapse" feature disappears.
  // this.$.content.scrollHeight>this.collapsedHeight  is used for recomputeOnResize = true 
  //let f1= function(){this.canToggle=!this.recomputeOnResize&&this.shouldUseNumberOfLines?this.alwaysToggleable||this.$.content.offsetHeight<this.$.content.scrollHeight:this.alwaysToggleable||this.$.content.scrollHeight>this.collapsedHeight};
  // new browser - 84>80 would not lead to line clamp [as using -webkit-line-clamp]
  // this.$.content.offsetHeight<this.$.content.scrollHeight is not working for collapsed content

  let f1 = function () { this.canToggle = this.shouldUseNumberOfLines && (this.alwaysCollapsed || this.collapsed) ? this.alwaysToggleable || this.$.content.offsetHeight < this.$.content.scrollHeight : this.alwaysToggleable || this.$.content.scrollHeight > this.collapsedHeight };

  let insObserver = null;
  if (window.IntersectionObserver) {

    insObserver = new IntersectionObserver(function (entries, observer) {
      let count = 0
      for (const entry of entries) {
        if (entry.isIntersecting && ++count) entry.target.calculateCanCollapse();
      }
    }, {
      threshold: [0]
    })


  }
  Object.defineProperty(HTMLElement.prototype, 'recomputeOnResize', {
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
    configurable: true
  });


  let calledOnce = false;

  document.documentElement.addEventListener('engagement-panel-genius-lyrics', function () {

    function getEPC(ep) {

      if (!ep) return null;
      let epc = ep.querySelector('#content');
      if (!epc) return null;

      let epc1 = epc.querySelector('ytd-ads-engagement-panel-content-renderer #content')
      let epc2 = epc.querySelector('ytd-ads-engagement-panel-content-renderer')

      return epc1 || epc2 || epc;

    }

    if (calledOnce) return;
    calledOnce = true


    // ENGAGEMENT_PANEL_VISIBILITY_EXPANDED

    let count = 0;
    setTimeout(function $f() {

      if (++count > 30) return;
      let ytdFlexyElm = document.querySelector('ytd-watch-flexy[tabview-selection]');
      if (!ytdFlexyElm) return setTimeout($f, 100);

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

      ytdFlexyElm.querySelector('#panels').appendChild(newPanel)

      function closeBtn() {
        let hideBtns = null;
        if (hideBtns = document.querySelectorAll('#lyricscontainer > .lyricsnavbar > a')) {
          for (const hideBtn of hideBtns) {
            if (/\bhide\b/i.test(hideBtn.textContent)) return hideBtn;
          }
        }
      }

      new MutationObserver(function (mutations, observer) {

        if (!mutations || !mutations[0]) return;
        let panel = mutations[0].target;
        if (!panel) return;
        //console.log(panel)
        setTimeout(function () {
          if (panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN') {
            let hideBtn = closeBtn();
            if (hideBtn) hideBtn.dispatchEvent(new Event("click"));
          }
        }, 22);

      }).observe(newPanel, {
        attributes: true
      })

      new MutationObserver(function () {
        let panel = document.querySelector('ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]')
        if (panel) {
          let lyricscontainer = document.querySelector('body > #lyricscontainer')
          if (!lyricscontainer && panel.getAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')) {
            panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN')
          }
        }
      }).observe(document.body, {
        childList: true
      })

      setInterval(function () {
        let elm = null;
        if (elm = document.querySelector('body>#lyricscontainer>#lyricsiframe')) {
          let panel = document.querySelector('ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-genius-transcript"]')
          let epc = getEPC(panel);
          epc.innerHTML = '';
          epc.appendChild(elm)
          panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')
        }
      }, 400)

    }, 100)

  })
  document.documentElement.setAttribute('w-engagement-panel-genius-lyrics', '')

  function removeChildren(cssSelector, parentNode) {
    let elements = parentNode.querySelectorAll(cssSelector);
    let fragment = document.createDocumentFragment();
    fragment.textContent = ' ';
    fragment.firstChild.replaceWith(...elements);
  }
  function removeDOMs(elements) {
    let fragment = document.createDocumentFragment();
    fragment.textContent = ' ';
    fragment.firstChild.replaceWith(...elements);
  }


  function chain(elm, ...args) {
    if (!elm) return;
    for (const s of args) {
      let tmp = elm[s]
      if (!tmp) return tmp || null
      elm = tmp;
    }
    return elm;
  }


  //https://www.youtube.com/watch?v=Ud73fm4Uoq0


  function _snippetText(str) {
    return str.replace(/\u200b/g, '').replace(/[\xA0\x20]/g, ' ')
  }

  function snippetText(snippet) {
    let res = [];
    for (const s of snippet.runs) {
      res.push(_snippetText(s.text))
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

      let main_str = trim2(_snippetText(snippet.runs[0].text));

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
    }
  })



  let afm = 0;
  let afArg = null;
  const g_postToContentWindow = function () {
    if (arguments.length === 1 && "yt-player-video-progress" in arguments[0]) {

      afArg = [...arguments];
      afm++;
      if (afm === 1) {


        requestAnimationFrame(() => {
          afm = 0;
          this.__$$postToContentWindow$$__.apply(this, afArg || arguments)
        })
      }

    } else {
      this.__$$postToContentWindow$$__.apply(this, arguments)
    }
  }

  setInterval(function () {

    let tmp;
    tmp = document.querySelector('ytd-live-chat-frame#chat');
    if (tmp && !tmp.__$$postToContentWindow$$__ && typeof tmp.postToContentWindow == 'function' && tmp.postToContentWindow !== g_postToContentWindow) {
      tmp.__$$postToContentWindow$$__ = tmp.postToContentWindow
      tmp.postToContentWindow = g_postToContentWindow
    }



  }, 150)

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

  }, true)


}

injection_script_1();