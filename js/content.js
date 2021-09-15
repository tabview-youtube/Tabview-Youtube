-(function(){

    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if(inIframe())return;

    if(!$) return;

    /**
     * SVG resources:
     * <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
     */

    const scriptVersionForExternal = '2021/07/03';

    const svgComments = `
    <path d="M40.068,13.465L5.93,13.535c-3.27,0-5.93,2.66-5.93,5.93v21.141c0,3.27,2.66,5.929,5.93,5.929H12v10
    c0,0.413,0.254,0.784,0.64,0.933c0.117,0.045,0.239,0.067,0.36,0.067c0.276,0,0.547-0.115,0.74-0.327l9.704-10.675l16.626-0.068
    c3.27,0,5.93-2.66,5.93-5.929V19.395C46,16.125,43.34,13.465,40.068,13.465z M10,23.465h13c0.553,0,1,0.448,1,1s-0.447,1-1,1H10
    c-0.553,0-1-0.448-1-1S9.447,23.465,10,23.465z M36,37.465H10c-0.553,0-1-0.448-1-1s0.447-1,1-1h26c0.553,0,1,0.448,1,1
    S36.553,37.465,36,37.465z M36,31.465H10c-0.553,0-1-0.448-1-1s0.447-1,1-1h26c0.553,0,1,0.448,1,1S36.553,31.465,36,31.465z"/>
    <path d="M54.072,2.535L19.93,2.465c-3.27,0-5.93,2.66-5.93,5.93v3.124l26.064-0.054c4.377,0,7.936,3.557,7.936,7.93v21.07v0.071
    v2.087l3.26,3.586c0.193,0.212,0.464,0.327,0.74,0.327c0.121,0,0.243-0.022,0.36-0.067c0.386-0.149,0.64-0.52,0.64-0.933v-10h1.07
    c3.27,0,5.93-2.66,5.93-5.929V8.465C60,5.195,57.34,2.535,54.072,2.535z"/>
    `.trim();

    const svgVideos = `<path d="M298,33c0-13.255-10.745-24-24-24H24C10.745,9,0,19.745,0,33v232c0,13.255,10.745,24,24,24h250c13.255,0,24-10.745,24-24V33
    z M91,39h43v34H91V39z M61,259H30v-34h31V259z M61,73H30V39h31V73z M134,259H91v-34h43V259z M123,176.708v-55.417
    c0-8.25,5.868-11.302,12.77-6.783l40.237,26.272c6.902,4.519,6.958,11.914,0.056,16.434l-40.321,26.277
    C128.84,188.011,123,184.958,123,176.708z M207,259h-43v-34h43V259z M207,73h-43V39h43V73z M268,259h-31v-34h31V259z M268,73h-31V39
    h31V73z"/>`.trim();

    const svgInfo = `<path d="M11.812,0C5.289,0,0,5.289,0,11.812s5.289,11.813,11.812,11.813s11.813-5.29,11.813-11.813
    S18.335,0,11.812,0z M14.271,18.307c-0.608,0.24-1.092,0.422-1.455,0.548c-0.362,0.126-0.783,0.189-1.262,0.189
    c-0.736,0-1.309-0.18-1.717-0.539s-0.611-0.814-0.611-1.367c0-0.215,0.015-0.435,0.045-0.659c0.031-0.224,0.08-0.476,0.147-0.759
    l0.761-2.688c0.067-0.258,0.125-0.503,0.171-0.731c0.046-0.23,0.068-0.441,0.068-0.633c0-0.342-0.071-0.582-0.212-0.717
    c-0.143-0.135-0.412-0.201-0.813-0.201c-0.196,0-0.398,0.029-0.605,0.09c-0.205,0.063-0.383,0.12-0.529,0.176l0.201-0.828
    c0.498-0.203,0.975-0.377,1.43-0.521c0.455-0.146,0.885-0.218,1.29-0.218c0.731,0,1.295,0.178,1.692,0.53
    c0.395,0.353,0.594,0.812,0.594,1.376c0,0.117-0.014,0.323-0.041,0.617c-0.027,0.295-0.078,0.564-0.152,0.811l-0.757,2.68
    c-0.062,0.215-0.117,0.461-0.167,0.736c-0.049,0.275-0.073,0.485-0.073,0.626c0,0.356,0.079,0.599,0.239,0.728
    c0.158,0.129,0.435,0.194,0.827,0.194c0.185,0,0.392-0.033,0.626-0.097c0.232-0.064,0.4-0.121,0.506-0.17L14.271,18.307z
    M14.137,7.429c-0.353,0.328-0.778,0.492-1.275,0.492c-0.496,0-0.924-0.164-1.28-0.492c-0.354-0.328-0.533-0.727-0.533-1.193
    c0-0.465,0.18-0.865,0.533-1.196c0.356-0.332,0.784-0.497,1.28-0.497c0.497,0,0.923,0.165,1.275,0.497
    c0.353,0.331,0.53,0.731,0.53,1.196C14.667,6.703,14.49,7.101,14.137,7.429z"/>`.trim();

    const svgPlayList = `
    <rect x="0" y="64" width="256" height="42.667"/>
    <rect x="0" y="149.333" width="256" height="42.667"/>
    <rect x="0" y="234.667" width="170.667" height="42.667"/>
    <polygon points="341.333,234.667 341.333,149.333 298.667,149.333 298.667,234.667 213.333,234.667 213.333,277.333 
    298.667,277.333 298.667,362.667 341.333,362.667 341.333,277.333 426.667,277.333 426.667,234.667"/>
    `.trim();

    // --- Youtube Video Testing : 
    // Square Video: https://www.youtube.com/watch?v=L0RXVnRbFg8 
    // Square Video: https://www.youtube.com/watch?v=bK_rKhMIotU
    // ---


    const LAYOUT_TWO_COLUMNS=1;
    const LAYOUT_THEATER=2;
    const LAYOUT_FULLSCREEN=4;
    const LAYOUT_CHATROOM=8;
    const LAYOUT_CHATROOM_COLLASPED=16;
    const LAYOUT_TAB_EXPANDED = 32;
    const LAYOUT_ENGAGEMENT_PANEL_EXPAND = 64;

    const mtoInterval1=40;
    const mtoInterval2=150;

    let lastVideoURL = null;

    
    const WeakRef = window.WeakRef;
    const mWeakRef=WeakRef?(o=>o?new WeakRef(o):null):(o=>o||null);
    const kRef = (wr=>(wr&&wr.deref)?wr.deref():wr);

    let cmItem = null;

    
    function tracer(key, cmp){
        if(cmp>0) return tracer[key]===cmp;
        return (tracer[key]=Date.now());
    }

    function racer(key, f){
        let now = Date.now();
        const kTime = `${key}$$1`
        let t=racer[kTime]||0;

        if(now<t){
            const kCount = `${key}$$2`;
            racer[kCount]=(racer[kCount]||0)+1;
            if(racer[kCount]===1){
                let g = f;
                requestAnimationFrame(()=>{
                    racer[kCount]=0;
                    g();
                    g=null;
                })
            }
        }else{
            racer[kTime]=now+16;
            f();
        }
    }

    class ScriptEF {
        constructor() {
            this._id = scriptEC;
        }
        isValid() {
            return this._id === scriptEC;
        }
    }
    
    class Timeout {
    
        set(f, d, repeatCount) {
            if (this.cid > 0) return;
            let sEF = new ScriptEF();
            if (repeatCount > 0) {
    
                let rc = repeatCount;
                const g = () => {
                    this.cid = 0;
                    if (!sEF.isValid()) return;
                    let res = f();
                    if (--rc <= 0) return;
                    if (res === true) this.cid = setTimeout(g, d);
                }
                g();

            } else {
    
                const g = () => {
                    this.cid = 0;
                    if (!sEF.isValid()) return;
                    if (f() === true) this.cid = setTimeout(g, d);
                }
                this.cid = setTimeout(g, d);
            }
        }
    
        clear() {
            if (this.cid > 0) clearTimeout(this.cid);
        }
    
        isEmpty() {
            return !this.cid
        }
    
    
    }
    
    class Mutex{
        
        constructor(){
            this.p=Promise.resolve()
        }
        
        lockWith(f){
            
            this.p=this.p.then(()=>{
                return new Promise(f)
            }).catch(console.warn)
        }

    }



    function prettyElm(elm) {
        if (!elm || !elm.nodeName) return null;
        const eId = elm.id || null;
        const eClsName = elm.className || null;
        return [elm.nodeName.toLowerCase(), typeof eId == 'string' ? "#" + eId : '', typeof eClsName == 'string' ? '.' + eClsName.replace(/\s+/g, '.') : ''].join('').trim();
    }
    function extractTextContent(elm){
        return elm.textContent.replace(/\s+/g,'').replace(/[^\da-zA-Z\u4E00-\u9FFF\u00C0-\u00FF\u00C0-\u02AF\u1E00-\u1EFF\u0590-\u05FF\u0400-\u052F\u0E00-\u0E7F\u0600-\u06FF\u0750-\u077F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3040-\u30FF\u31F0-\u31FF]/g,'')
    }

    function addScript(scriptText) {
        const scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.textContent = scriptText;
        document.documentElement.appendChild(scriptNode);
        return scriptNode;
    }
    function addStyle(styleText, container) {
        const styleNode = document.createElement('style');
        //styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        (container||document.documentElement).appendChild(styleNode);
        return styleNode;
    }






    function isDOMVisible( elem ){
        // jQuery version : https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
        return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    }

    function isNonEmptyString(s){
        return typeof s=='string'&&s.length>0;
    }


    function nativeFunc(dom, property, args){
        dom.dispatchEvent(new CustomEvent("userscript-call-dom-func", {detail: {property, args}}))
    }
    
    function akAttr(cssElm, attrName, isNegative, flag){
        
        let u = parseInt(cssElm.getAttribute(attrName)||0)||0;
        let ak = Math.abs(u);
        
        if(ak>100 && isNegative && u<0){

        }else if(ak>100 && !isNegative && u>0){

        }else{
            if(ak<=100) {
                ak=101;
             } else {
                ak++;
                if(ak>=800) ak=101;
            }
             // 101, 102, ... 799, 101 
        }

        let s = ''+(isNegative?-ak:ak);
        flag = flag || '';

        
        cssElm.setAttribute(attrName, s+flag)
    }



    let timeout_resize_for_layout_change=new Timeout();



    function layoutStatusChanged(old_layoutStatus, new_layoutStatus) {


        if(old_layoutStatus === new_layoutStatus) return;

        const cssElm = kRef(ytdFlexy);
    
        if (!cssElm) return;
    

        const new_isExpandedChat = !(new_layoutStatus & LAYOUT_CHATROOM_COLLASPED) && (new_layoutStatus & LAYOUT_CHATROOM)
        const new_isCollaspedChat = (new_layoutStatus & LAYOUT_CHATROOM_COLLASPED) && (new_layoutStatus & LAYOUT_CHATROOM)
    
        const new_isTwoColumns = new_layoutStatus & LAYOUT_TWO_COLUMNS;
        const new_isTheater = new_layoutStatus & LAYOUT_THEATER;
        const new_isTabExpanded = new_layoutStatus & LAYOUT_TAB_EXPANDED;
        const new_isFullScreen = new_layoutStatus & LAYOUT_FULLSCREEN;
        const new_isExpandEPanel = new_layoutStatus & LAYOUT_ENGAGEMENT_PANEL_EXPAND;

        
        function showTabOrChat() {

            layoutStatusMutex.lockWith(unlock => {

                if (lastShowTab == '#chatroom') {

                    if (new_isTabExpanded) switchTabActivity(null)
                    if (!new_isExpandedChat) ytBtnExpandChat();

                } else if(lastShowTab && lastShowTab.indexOf('#engagement-panel-')==0){

                    if (new_isTabExpanded) switchTabActivity(null)
                    if (!new_isExpandEPanel) ytBtnOpenEngagementPanel(lastShowTab);
                    
                }else {

                    if (new_isExpandedChat) ytBtnCollapseChat()
                    if (!new_isTabExpanded) setToActiveTab();

                }

                setTimeout(unlock, 40);

            })
        }

        function hideTabAndChat() {

            layoutStatusMutex.lockWith(unlock => {

                if (new_isTabExpanded) switchTabActivity(null)
                if (new_isExpandedChat) ytBtnCollapseChat()
                if (new_isExpandEPanel) ytBtnCloseEngagementPanels();


                setTimeout(unlock, 40);

            })

        }


        if(new_isExpandedChat || new_isTabExpanded || new_isExpandEPanel){
            if(statusCollasped !== 1) statusCollasped = 1;
        }else{
            if(statusCollasped === 1) statusCollasped = 2;
        }

        let changes = 0;

        if(old_layoutStatus !== null )  changes = old_layoutStatus ^ new_layoutStatus;

        let chat_collasped_changed = !!(changes & LAYOUT_CHATROOM_COLLASPED)
        let tab_expanded_changed = !!(changes & LAYOUT_TAB_EXPANDED)
        let theater_mode_changed = !!(changes & LAYOUT_THEATER)
        let column_mode_changed = !!(changes & LAYOUT_TWO_COLUMNS)
        let fullscreen_mode_changed = !!(changes & LAYOUT_FULLSCREEN)
        let epanel_expanded_changed = !!(changes & LAYOUT_ENGAGEMENT_PANEL_EXPAND)
    
        let tab_change = (tab_expanded_changed?1:0)|(chat_collasped_changed?2:0)|(epanel_expanded_changed?4:0);
        
        let isChatOrTabExpandTriggering = tab_change==0?false:(
            (tab_expanded_changed && new_isTabExpanded) ||
            (chat_collasped_changed && new_isExpandedChat) ||
            (epanel_expanded_changed && new_isExpandEPanel)
            );
       
        let isChatOrTabCollaspeTriggering = tab_change==0?false:(
            (tab_expanded_changed && !new_isTabExpanded) ||
            (chat_collasped_changed && new_isCollaspedChat) ||
            (epanel_expanded_changed && !new_isExpandEPanel)
            );
           
    

        let moreThanOneShown = (new_isTabExpanded + new_isExpandedChat + new_isExpandEPanel)>1

        let requestVideoResize=false;

        if(fullscreen_mode_changed || new_isFullScreen){

        }else if(tab_change==0 && column_mode_changed && new_isTwoColumns && !new_isTheater && statusCollasped === 1 && moreThanOneShown){

            showTabOrChat();
            requestVideoResize=true;

        }else if (tab_change==2 && new_isExpandedChat && new_isTwoColumns && !new_isTheater && statusCollasped === 1 && new_isTabExpanded && !column_mode_changed) {
    
            switchTabActivity(null);
            requestVideoResize=true;
    
        } else if ( isChatOrTabExpandTriggering && new_isTwoColumns && new_isTheater && statusCollasped === 1 && !theater_mode_changed && !column_mode_changed ) {
    
            ytBtnCancelTheater();
            requestVideoResize=true;
        
        } else if (new_isTwoColumns && new_isTheater && statusCollasped === 1) {
    
            hideTabAndChat();
            requestVideoResize=true;
    
        } else if (isChatOrTabCollaspeTriggering && new_isTwoColumns && !new_isTheater && statusCollasped === 2 && !column_mode_changed ) {
    
            ytBtnSetTheater();
            requestVideoResize=true;
        
        } else if(tab_change==0 && (column_mode_changed || theater_mode_changed) && new_isTwoColumns && !new_isTheater && statusCollasped !==1){
            
            showTabOrChat();
            requestVideoResize=true;
    
        } else if(!new_isFullScreen && new_isTwoColumns && !new_isTheater && !new_isTabExpanded &&
             (new_isCollaspedChat || !new_isExpandedChat) && 
             !new_isExpandEPanel
             ){
            // bug fix for restoring from mini player

            layoutStatusMutex.lockWith(unlock => {

                if (new_isExpandedChat) ytBtnCollapseChat()
                setToActiveTab();

                setTimeout(unlock, 40);

            })
 
            requestVideoResize=true;

        } else if(tab_expanded_changed){

            requestVideoResize=true;

        }


        if(column_mode_changed && !chat_collasped_changed && new_isExpandedChat){

            runAfterExpandChat();

        }



        if(requestVideoResize){

            timeout_resize_for_layout_change.clear();
            timeout_resize_for_layout_change.set(() => {
                window.dispatchEvent(new Event('resize'))
             } , 92)
            
        }else if (timeout_resize_for_layout_change.isEmpty() && (Date.now()) - lastResizeAt > 600){
            timeout_resize_for_layout_change.set(() => {
                if((Date.now()) - lastResizeAt > 600) window.dispatchEvent(new Event('resize'));
            }, 62)
        }

       
    
    
    
    }


    const $ws={
        _layoutStatus:null,
        layoutStatus_pending:false
    }

    let wls=new class {
        get layoutStatus(){
            return this._layoutStatus;
        }
        set layoutStatus(nv){

            if(nv===null){
                this._layoutStatus=null;
                statusCollasped=0;               
                return;
            }
            if(nv === this._layoutStatus) return;

            if(!this.layoutStatus_pending) {
                this.layoutStatus_pending=true;
                const old_layoutStatus=this._layoutStatus;
                
                layoutStatusMutex.lockWith(unlock=>{

                    this.layoutStatus_pending=false;
                    const new_layoutStatus = this._layoutStatus;
                    layoutStatusChanged(old_layoutStatus, new_layoutStatus);

                    setTimeout(unlock,40)


                })
            }

            this._layoutStatus=nv;
        }
    };

    




    const svgElm = (w, h, vw, vh, p) => `<svg width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${p}</svg>`

    let settings = {
        defaultTab: "#tab-videos"
    };


    let mtoInterval = mtoInterval1;

    function isVideoPlaying(video) {
        return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    }

    function wAttr(elm, attr, kv){
        if(!elm || kv===null) {}
        else if(kv===true){ elm.setAttribute(attr,'') }
        else if(kv===false){ elm.removeAttribute(attr) }
        else if (typeof kv=='string'){ elm.setAttribute(attr, kv)  }
    }

    function hideTabBtn(tabBtn){
        var isActiveBefore = tabBtn.classList.contains('active');
        tabBtn.classList.add("tab-btn-hidden");
        if (isActiveBefore) {
            setToActiveTab();
        }
    }

    function hasAttribute(obj, key){
        return obj && obj.hasAttribute(key);
    }

    function isTheater(){
        const cssElm=kRef(ytdFlexy);
        return (cssElm && cssElm.hasAttribute('theater'))
    }

    function isFullScreen(){
        const cssElm=kRef(ytdFlexy);
        return (cssElm && cssElm.hasAttribute('fullscreen'))
    }

    function isChatExpand(){
        const cssElm=kRef(ytdFlexy);
        return cssElm && cssElm.hasAttribute('userscript-chatblock') && !cssElm.hasAttribute('userscript-chat-collapsed')
    }
    function isWideScreenWithTwoColumns(){
        const cssElm=kRef(ytdFlexy);
        return (cssElm && cssElm.hasAttribute('is-two-columns_'))
    }

    function isAnyActiveTab(){
        return $('#right-tabs .tab-btn.active').length>0
    }

    function isEngagementPanelExpanded(){
        const cssElm=kRef(ytdFlexy);
        return (cssElm && +cssElm.getAttribute('userscript-engagement-panel')>0)
    }

    function engagement_panels_(){

        let res = [];

        let v = 0, k =1, count=0;
        for(const ePanel of document.querySelectorAll('ytd-watch-flexy ytd-engagement-panel-section-list-renderer[tabview-attr-checked]')){

            let visibility = ePanel.getAttribute('visibility') //ENGAGEMENT_PANEL_VISIBILITY_EXPANDED //ENGAGEMENT_PANEL_VISIBILITY_HIDDEN

            switch(visibility){
                case 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED': v|=k; count++; res.push({ePanel, k, visible: true}); break;
                case 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN': res.push({ePanel, k, visible: false}); break;
                default: res.push({ePanel, k, visible: false});
            }

            k=k<<1;

        }
        return {list:res, value: v, count: count};
    }
    

    function ytBtnOpenEngagementPanel(panel_id){

        if(typeof panel_id =='string') {
            panel_id = panel_id.replace('#engagement-panel-','');
            panel_id = parseInt(panel_id);
        }
        if(panel_id>=0){}else return false;

        let panels = engagement_panels_();

        for(const {ePanel, k, visible} of panels.list){
            if((panel_id & k) === k) {
                if(!visible) ePanel.setAttribute('visibility',"ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            }else{
                if(visible) ytBtnCloseEngagementPanel(ePanel);
            }
        }

    }

    function ytBtnCloseEngagementPanel(s){
        //ePanel.setAttribute('visibility',"ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
        let btn = s.querySelector('ytd-watch-flexy ytd-engagement-panel-title-header-renderer #header>#visibility-button>ytd-button-renderer');
        if(btn){
            btn.click();
        }
    }
    function ytBtnCloseEngagementPanels(){
        if(isEngagementPanelExpanded()){
            for(const s of document.querySelectorAll('ytd-watch-flexy ytd-engagement-panel-section-list-renderer[tabview-attr-checked]')){
                if(s.getAttribute('visibility')=="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED") ytBtnCloseEngagementPanel(s);
            }
        }
    }

    function ytBtnSetTheater(){
        if(!isTheater()){
            const sizeBtn =  document.querySelector('ytd-watch-flexy #ytd-player button.ytp-size-button')
            if(sizeBtn) sizeBtn.click();
        }
    }
    function ytBtnCancelTheater(){
        if(isTheater()){
            const sizeBtn =  document.querySelector('ytd-watch-flexy #ytd-player button.ytp-size-button')
            if(sizeBtn) sizeBtn.click();
        }
    }

    function ytBtnExpandChat(){
        let button = document.querySelector('ytd-live-chat-frame#chat[collapsed]>.ytd-live-chat-frame#show-hide-button')
        if (button) button.querySelector('ytd-toggle-button-renderer').click();
    }
    function ytBtnCollapseChat(){
        let button = document.querySelector('ytd-live-chat-frame#chat:not([collapsed])>.ytd-live-chat-frame#show-hide-button')
        if (button) button.querySelector('ytd-toggle-button-renderer').click();
    }


    function hackImgShadow(imgShadow){
        // add to #columns and add back after loaded
        let img = imgShadow.querySelector('img')
        if(!img)return;

        let p=imgShadow.parentNode
        let z=$(imgShadow).clone()[0]; //to occupy the space
        p.replaceChild(z, imgShadow)
        $(imgShadow).prependTo('#columns'); // refer to css hack

        function onload(evt){
            if(evt) this.removeEventListener('load',onload,false)
            p.replaceChild(imgShadow, z)
            p=null;
            z=null;
            imgShadow=null;
        }

        if (img.complete) onload();
        else img.addEventListener('load',onload,false)
    }


    const Q={}
    const FOnce={}

    const $callOnceAsync=async function(key){
        if (FOnce[key] && FOnce[key]() === false) FOnce[key] = null
    }


    
    function chatFrameContentDocument(){
        // non-null if iframe exist && contentDocument && readyState = complete

        let iframe = document.querySelector('ytd-live-chat-frame iframe#chatframe');
        if(!iframe) return null; //iframe must be there
        let cDoc = null;
        try{
            cDoc = iframe.contentDocument;
        }catch(e){}
        if(!cDoc) return null;
        if(cDoc.readyState  != 'complete') return null; //we must wait for its completion

        return cDoc;

    }

    function chatFrameElement(cssSelector){
        let cDoc = chatFrameContentDocument();
        if(!cDoc) return null;
        let elm = null;
        try{
            elm = cDoc.querySelector(cssSelector)
        }catch(e){
            console.log('iframe error', e)
        }
        return elm;
    }


















    function fixTabs(){

        
        if(!scriptEnable)return;


        let queryElement=document.querySelector('*:not(#tab-videos)>#related:not([non-placeholder-videos]) > ytd-watch-next-secondary-results-renderer')

        let isRelocated = !!queryElement;



        if(isRelocated){

            let relocatedRelated = queryElement.parentNode; // NOT NULL

            let right_tabs = document.querySelector('#right-tabs');
            let tab_videos = right_tabs.querySelector("#tab-videos");

            if(!right_tabs || !tab_videos) return;

            for(const s of relocatedRelated.querySelectorAll('#related')){
                s.setAttribute('non-placeholder-videos','')
            }

            let target_container = document.querySelector('ytd-watch-flexy:not([is-two-columns_]) #primary-inner, ytd-watch-flexy[is-two-columns_] #secondary-inner')

            if(target_container) target_container.append(right_tabs) // last-child


            let videos_related = relocatedRelated; // NOT NULL
            $('[placeholder-videos]').removeAttr('placeholder-videos');
            $('[placeholder-for-youtube-play-next-queue]').removeAttr('placeholder-for-youtube-play-next-queue');

            tab_videos.appendChild(videos_related);
            let videos_results_renderer = relocatedRelated.querySelector("ytd-watch-next-secondary-results-renderer");
            if(videos_results_renderer) videos_results_renderer.setAttribute('data-dom-changed-by-tabview-youtube',scriptVersionForExternal);
            videos_related.setAttribute('placeholder-for-youtube-play-next-queue','')
            videos_related.setAttribute('placeholder-videos','')

            $('[placeholder-videos]').on("scroll", makeBodyScrollByEvt);




        }


        
                    
        let chatroom=null;
        if(chatroom=document.querySelector('*:not([data-positioner="before|#chat"]) + ytd-live-chat-frame#chat, ytd-live-chat-frame#chat:first-child')){

            let positioner = document.querySelector('tabview-youtube-positioner[data-positioner="before|#chat"]');
            if(positioner) positioner.remove();


            if(document.querySelector('.YouTubeLiveFilledUpView')){
                // no relocation
            }else{

                $(chatroom).insertBefore('#right-tabs')

            }

            
            $(positioner?positioner:document.createElement('tabview-youtube-positioner')).attr('data-positioner','before|#chat').insertBefore(chatroom)


        }


    }

    const injectionScript_fixAutoComplete=function(){

        // https://cdnjs.cloudflare.com/ajax/libs/JavaScript-autoComplete/1.0.4/auto-complete.min.js

        for(const s of document.querySelectorAll('[autocomplete="off"]:not([data-autocomplete-results-id])')){


            let sc = s.sc;
            if(sc instanceof HTMLElement){

                let id=Date.now();
                s.setAttribute('data-autocomplete-results-id',id);
                sc.setAttribute('data-autocomplete-input-id', id);
                
                if(window.WeakRef){
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

    };

    
    function handlerAutoCompleteExist(){


        let autoComplete = this;

        autoComplete.removeEventListener('autocomplete-sc-exist', handlerAutoCompleteExist, false)

        let domId= autoComplete.getAttribute('data-autocomplete-input-id')
        let searchBox = autoComplete.ownerDocument.querySelector(`[data-autocomplete-results-id="${domId}"]`)

        if(!domId || !searchBox) return;

        let positioner=searchBox.nextSibling;
        if(positioner && positioner.nodeName.toLowerCase()=="autocomplete-positioner"){
        }else if(positioner && positioner.nodeName.toLowerCase()!="autocomplete-positioner"){
            $(positioner=document.createElement("autocomplete-positioner")).insertAfter(searchBox);
        }else{
            $(positioner=document.createElement("autocomplete-positioner")).prependTo(searchBox.parentNode);
        }
        $(autoComplete).prependTo(positioner);

        positioner.style.setProperty('--sb-margin-bottom',getComputedStyle(searchBox).marginBottom)
        positioner.style.setProperty('--height',searchBox.offsetHeight + 'px')

    }

    function mtf_fixAutoCompletePosition(elmAutoComplete){

        elmAutoComplete.setAttribute('autocomplete-disable-updatesc','')
        elmAutoComplete.addEventListener('autocomplete-sc-exist',handlerAutoCompleteExist, false)

        addScript(`!!(${injectionScript_fixAutoComplete+''})()`);

    }

    function mtf_AfterFixTabs(){


        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;

        const rootElement = Q.mutationTarget || ytdFlexyElm;



        const autocomplete=rootElement.querySelector('[placeholder-for-youtube-play-next-queue] input#suggestions-search + autocomplete-positioner > .autocomplete-suggestions[data-autocomplete-input-id]:not([position-fixed-by-tabview-youtube])')

        if(autocomplete){

            const searchBox = document.querySelector('[placeholder-for-youtube-play-next-queue] input#suggestions-search')


            if(searchBox){

                
                autocomplete.parentNode.setAttribute('position-fixed-by-tabview-youtube','');
                autocomplete.setAttribute('position-fixed-by-tabview-youtube','');
                autocomplete.setAttribute('userscript-scrollbar-render','')

                if(!searchBox.hasAttribute('is-set-click-to-toggle')){
                    searchBox.setAttribute('is-set-click-to-toggle','')
                    searchBox.addEventListener('click',function(){


                        setTimeout(()=>{
                            const autocomplete=document.querySelector(`.autocomplete-suggestions[data-autocomplete-input-id="${ this.getAttribute('data-autocomplete-results-id') }"]`)

                            if(!autocomplete)return;

                            const isNotEmpty = (autocomplete.textContent||'').length>0 && (this.value||'').length>0;
                            
                            if( isNotEmpty ){

                                let elmVisible=isDOMVisible(autocomplete)

                                if(elmVisible) $(autocomplete).hide(); else  $(autocomplete).show();

                            }

                        },20);

                    })

                    let timeoutOnce_searchbox_keyup=new Timeout();
                    searchBox.addEventListener('keyup',function(){

                        timeoutOnce_searchbox_keyup.set(()=>{
                            
                            const autocomplete=document.querySelector(`.autocomplete-suggestions[data-autocomplete-input-id="${ this.getAttribute('data-autocomplete-results-id') }"]`)

                            if(!autocomplete)return;
                            

                            const isNotEmpty = (autocomplete.textContent||'').length>0 && (this.value||'').length >0
                            
                            if( isNotEmpty ){

                                let elmVisible=isDOMVisible(autocomplete)

                                if(!elmVisible) $(autocomplete).show();

                            }

                        },20);

                    })

                }



            }

        }





        
        let currentLastVideo=rootElement.querySelector('[placeholder-videos] #items ytd-compact-video-renderer:last-of-type')
        let prevLastVideo=kRef(_cachedLastVideo);

        if(prevLastVideo!==currentLastVideo && currentLastVideo){
            _cachedLastVideo=mWeakRef(currentLastVideo);
        }
        
        if(prevLastVideo!==currentLastVideo && currentLastVideo && prevLastVideo ){

            let isPrevRemoved= !prevLastVideo.parentNode


            function getVideoListHash(){

                let res = [...document.querySelectorAll('[placeholder-videos] #items ytd-compact-video-renderer')].map(renderer=>{
                    return renderer.querySelector('a[href*="watch"][href*="v="]').getAttribute('href')

                }).join('|')
                // /watch?v=XXXXX|/watch?v=XXXXXX|/watch?v=XXXXXX

                // alternative - DOM.data.videoId
                // let elms = document.querySelectorAll('[placeholder-videos] #items ytd-compact-video-renderer')
                // let res = [...elms].map(elm=>elm.data.videoId||'').join('|') ;
     
                if(res.indexOf('||')>=0){
                    res='';
                }

                return res?res:null;
            }

            if(isPrevRemoved){

                // this is the replacement of videos instead of addition
                
                const searchBox=document.querySelector('[placeholder-for-youtube-play-next-queue] input#suggestions-search')

                let currentPlayListHash= getVideoListHash() || null;

                if(!currentPlayListHash){

                }else if(!videoListBeforeSearch && searchBox){

                    videoListBeforeSearch= currentPlayListHash;
                    if(videoListBeforeSearch){
                        //console.log('fromSearch', videoListBeforeSearch)

                        requestAnimationFrame(function(){

                            let renderer = document.querySelector('[placeholder-videos] ytd-watch-next-secondary-results-renderer');
                            if(searchBox && searchBox.parentNode) searchBox.blur();

                            if(renderer){
                                let scrollParent = renderer.parentNode;
                                if(scrollParent.scrollHeight>scrollParent.offsetHeight){
                                    let targetTop = renderer.offsetTop;
                                    if(searchBox && searchBox.parentNode==scrollParent ) targetTop-=searchBox.offsetHeight
                                    scrollParent.scrollTop= targetTop - scrollParent.firstChild.offsetTop;
                                }
                            }                        
            
                        });

                    }

                }else if(videoListBeforeSearch){

                    if(currentPlayListHash != videoListBeforeSearch){

                        videoListBeforeSearch=null;
                        //console.log('fromSearch', videoListBeforeSearch)
        
        
                    }

                } 


            }

    
        }




    }

    function base_ChatExist(){
        
        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return null;

        // no mutation triggering if the changes are inside the iframe 

        // 1) Detection of #continuations inside iframe
        // iframe ownerDocument is accessible due to same origin
        // if the chatroom is collasped, no determination of live chat or replay (as no #continuations and somehow a blank iframe doc)

        // 2) Detection of meta tag
        // This is fastest but not reliable. It is somehow a bug that the navigation might not update the meta tag content
        
        // 3) Detection of HTMLElement inside video player for live video
        
        // (1)+(3) = solution

        let attr_chatblock = null
        let attr_chatcollapsed = null;
        
        const elmChat = document.querySelector('ytd-live-chat-frame#chat')
        let elmCont = null;
        if(elmChat){
            elmCont=chatFrameElement('yt-live-chat-renderer #continuations')

            let s=0;
            if(elmCont){
                //not found if it is collasped.
                s |= elmCont.querySelector('yt-timed-continuation')?1:0;
                s |= elmCont.querySelector('yt-live-chat-replay-continuation, yt-player-seek-continuation')?2:0;
                //s |= elmCont.querySelector('yt-live-chat-restricted-participation-renderer')?4:0;
                if(s==1) {
                    //console.log(7005)
                    attr_chatblock='chat-live';
                    //disableComments_LiveChat();
                }
                if(s==2) attr_chatblock='chat-playback';
                //if(s==5) attr_chatblock='chat-live-paid';

                if(s==1) $("span#tab3-txt-loader").text('');

            }
            //keep unknown as original        

        }else{
            attr_chatblock=false;
            attr_chatcollapsed=false;

        }

        return {attr_chatblock, attr_chatcollapsed}
         
    }


    function mtf_ChatExist(){

        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;

        const elmChat = document.querySelector('ytd-live-chat-frame#chat')
        let elmCont = null;
        if(elmChat){
            elmCont=chatFrameElement('yt-live-chat-renderer #continuations')
        }
        
        const chatBlockR = (elmChat?1:0)+(elmCont?2:0)
        if(Q.mtf_chatBlockQ!==chatBlockR){
            Q.mtf_chatBlockQ=chatBlockR  
            let rChatExist = base_ChatExist();
            if(rChatExist){
                let {attr_chatblock, attr_chatcollapsed} = rChatExist;
                wAttr(ytdFlexyElm, 'userscript-chatblock', attr_chatblock)
                wAttr(ytdFlexyElm, 'userscript-chat-collapsed', attr_chatcollapsed)
            }
        }
    }






    let lastScrollAt1=0;
    function makeBodyScrollByEvt(){
        let ct = Date.now();
        if(ct - lastScrollAt1 < 6) return; // avoid duplicate calling
        lastScrollAt1 = ct;
        window.dispatchEvent(new Event("scroll")); // dispatch Scroll Event to Window for content display
    }

    let lastScrollAt2 = 0;
    function makeBodyScroll() {
        let ct = Date.now();
        if(ct - lastScrollAt2 < 30) return; // avoid over triggering
        lastScrollAt2 = ct;
        requestAnimationFrame(()=>{
            window.dispatchEvent(new Event("scroll")); // ask youtube to display content
        })
    }

    let requestingComments = null
    let scrollForComments_lastStart = 0;
    function scrollForComments_TF(){
        let comments = requestingComments;
        if(!comments) return;
        if ( comments.hasAttribute('hidden')){
            window.dispatchEvent(new Event("scroll"));
        } 
        else requestingComments=null;
    }
    function scrollForComments() {
        scrollForComments_TF();
        if(!requestingComments) return;
        requestAnimationFrame(scrollForComments_TF);
        let ct = Date.now();
        if(ct - scrollForComments_lastStart < 60) return;
        scrollForComments_lastStart = ct;
        setTimeout(scrollForComments_TF, 80);
        setTimeout(scrollForComments_TF, 240);
        setTimeout(scrollForComments_TF, 870);
    }




    const mtoCs = {mtoNav:null, mtoBody:null};


    const mtoVs={}

    const mutation_target_id_list=['ytp-caption-window-container', 'items', 'button', 'movie_player', 'player-ads', 'hover-overlays', 'replies'];
    const mutation_target_class_list=['ytp-panel-menu', 'ytp-endscreen-content'];
    function isMtoOverallSkip(dTarget) {

        if(!dTarget || dTarget.nodeType!==1) return true;
        
        if(mutation_target_id_list.includes(dTarget.id)) return true;

        let className = dTarget.className.toLowerCase();
        let classNameSplit = className.split(' ');
        for (const c of classNameSplit) {
            if(mutation_target_class_list.includes(c)) return true;
        }

        return false;
    }


    const mutation_div_id_ignorelist=[
        'metadata-line',
        'ytp-caption-window-container',
        'top-level-buttons-computed',
        'microformat',
        'visibility-button',
        'info-strings',
        'action-menu',
        'reply-button-end'
    ];

    const mutation_div_class_ignorelist=[
        'badge','tp-yt-paper-tooltip','ytp-autonav-endscreen-upnext-header',
        'ytp-bound-time-left','ytp-bound-time-right','ytp-share-icon',
        'ytp-tooltip-title','annotation','ytp-copylink-icon','ytd-thumbnail',
        'paper-ripple',
        //caption
        'captions-text','caption-visual-line','ytp-caption-segment', 'ytp-caption-window-container',
        //menu
        'ytp-playlist-menu-button-text',

        'ytp-bezel-icon','ytp-bezel-text',
        'dropdown-content',
        'tp-yt-paper-menu-button','tp-yt-iron-dropdown',

        'ytd-metadata-row-renderer', // #content.ytd-metadata-row-renderer inside each of ytd-metadata-row-renderer (ytd-expander)
        'ytd-engagement-panel-section-list-renderer', // {div#content.style-scope.ytd-engagement-panel-section-list-renderer} inside each of ytd-engagement-panel-section-list-renderer

        'autocomplete-suggestions' // autocomplete-suggestions
    ];

    const mutation_target_tag_ignorelist=[
        'ytd-channel-name','tp-yt-iron-dropdown','tp-yt-paper-tooltip',
        'tp-yt-paper-listbox','yt-img-shadow','ytd-thumbnail','ytd-video-meta-block',

        'yt-icon-button','tp-yt-paper-button','yt-formatted-string','yt-icon','button','paper-ripple',

        'ytd-player-microformat-renderer',
        'ytd-engagement-panel-section-list-renderer','ytd-engagement-panel-title-header-renderer',
        'ytd-comment-renderer', 'ytd-menu-renderer', 'ytd-badge-supported-renderer',
        'ytd-subscribe-button-renderer', 'ytd-subscription-notification-toggle-button-renderer',
        'ytd-button-renderer','ytd-toggle-button-renderer',
        'yt-pdg-comment-chip-renderer','ytd-comment-action-buttons-renderer','ytd-comment-thread-renderer',
        'ytd-compact-radio-renderer','ytd-compact-video-renderer',
        'ytd-video-owner-renderer',
        'ytd-metadata-row-renderer', //ytd-metadata-row-renderer is part of the #collapsible inside ytd-expander

        'ytd-moving-thumbnail-renderer',
        'ytd-thumbnail-overlay-toggle-button-renderer',
        'ytd-thumbnail-overlay-bottom-panel-renderer','ytd-thumbnail-overlay-equalizer',
        'ytd-thumbnail-overlay-now-playing-renderer','ytd-thumbnail-overlay-resume-playback-renderer',
        'ytd-thumbnail-overlay-side-panel-renderer','ytd-thumbnail-overlay-time-status-renderer',
        'ytd-thumbnail-overlay-hover-text-renderer',

        'yt-interaction',
        'tp-yt-paper-spinner-lite','tp-yt-paper-spinner',

        'h1','h2','h3','h4','h5','span','a',

        'meta','br','script','style','link','dom-module','template'
    ];

    function isMtoTargetSkip(mutation) {
        //skip not important mutation tartget

        if (!mutation) return true;
        let {type, target} = mutation

        if (!target || target.nodeType !== 1 || type != 'childList') return true;

        let tagName = target.nodeName.toLowerCase();
        let className;
        let classNameSplit;

        if(mutation_target_tag_ignorelist.includes(tagName)) return true;

        switch (tagName) {


            case 'ytd-expander':
                if (target.id == 'expander' && Q.comments_section_loaded==1 && target.classList.contains('ytd-comment-renderer') ) return true; // load comments
                return false;

            case 'div':

                if (target.id == 'contents') {
                    return false;
                }
                if(mutation_div_id_ignorelist.includes(target.id)) return true;
                
                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    if(mutation_div_class_ignorelist.includes(c)) return true;
                }

                return false;

        }

        return false;

    } 



    // continuous check for element relocation
    function mtf_append_comments() {
            
        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;

        const rootElement = Q.mutationTarget || ytdFlexyElm;

        let comments = rootElement.querySelector('#primary ytd-watch-metadata ~ #info ~ ytd-comments#comments');
        if (comments) $(comments).appendTo('#tab-comments').attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)
    }

    // continuous check for element relocation
    function mtf_liveChatBtnF() {
        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;

        const rootElement = Q.mutationTarget || ytdFlexyElm;

        let button = rootElement.querySelector('ytd-live-chat-frame#chat>.ytd-live-chat-frame#show-hide-button:nth-child(n+2)');
        if (button) button.parentNode.insertBefore(button, button.parentNode.firstChild)
    }


    
    // continuous check for element relocation
    // fired at begining & window resize, etc
    function mtf_append_playlist(){
        
        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;

        const rootElement = Q.mutationTarget || ytdFlexyElm;

        let ple1 = rootElement.querySelector("*:not(#ytd-userscript-playlist)>ytd-playlist-panel-renderer#playlist");
        if(ple1){
            let ct = Date.now();
            let truePlaylist=null;
            let truePlaylist_items = document.querySelector('ytd-playlist-panel-renderer#playlist #items:not(:empty)');
            if(truePlaylist_items){

                let pElm  = truePlaylist_items.parentNode;
                while(pElm && pElm.nodeType===1){
                    if(pElm.id=='playlist'){
                        pElm.setAttribute('tabview-true-playlist',ct)
                        truePlaylist=pElm;
                        break;
                    }
                    pElm=pElm.parentNode;
                }

            }

            if(!truePlaylist) truePlaylist = ple1; // NOT NULL

            for(const s of document.querySelectorAll(`*:not(#ytd-userscript-playlist)>ytd-playlist-panel-renderer#playlist:not([tabview-true-playlist="${ct}"])`))
            s.parentNode.removeChild(s);

            let $wrapper = getWrapper('ytd-userscript-playlist')
            $wrapper.append(truePlaylist).appendTo(document.querySelector("#tab-list"));
            truePlaylist.setAttribute('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)
            setDisplayedPlaylist(); // relocation after re-layout

            requestAnimationFrame(()=>{
                let ytdFlexyElm = kRef(ytdFlexy);
                if(!scriptEnable || !ytdFlexyElm) return;
                if( !switchTabActivity_lastTab && (ytdFlexyElm.getAttribute('tabview-selection')+'').indexOf('#tab-')===0 && /https\:\/\/www\.youtube\.com\/watch.*[\?\&]list=[\w\-\_]+/.test(location.href) ){
                    if(setToActiveTab('#tab-list')) switchTabActivity_lastTab = '#tab-list';
                }
            })

        }
    }


    // content fix - info & playlist
    // fired at begining, and keep for in case any change
    function mtf_fix_details() {

        if(!scriptEnable)return ;

        if(no_fix_contents_until<Date.now()){
            const content = document.querySelector('#meta-contents ytd-expander>#content, #tab-info ytd-expander>#content')
            if (content) {
                no_fix_contents_until= Date.now() +3000;
                setTimeout(function(){
                    const expander = content.parentNode;

                    if (expander.hasAttribute('collapsed')) wAttr(expander,'collapsed',false);
                    expander.style.setProperty('--ytd-expander-collapsed-height','');

                    let btn1 = expander.querySelector('tp-yt-paper-button#less:not([hidden])');
                    let btn2 = expander.querySelector('tp-yt-paper-button#more:not([hidden])');

                    if (btn1) wAttr(btn1,'hidden',true);
                    if (btn2) wAttr(btn2,'hidden',true);
                },40);

            }
        }

        if(no_fix_playlist_until<Date.now()){
            // just in case the playlist is collapsed
            const playlist = document.querySelector('#tab-list ytd-playlist-panel-renderer#playlist')
            if(playlist){
                no_fix_playlist_until= Date.now() +3000;
                setTimeout(function(){
                    if(playlist.hasAttribute('collapsed')) wAttr(playlist,'collapsed',false);
                    if(playlist.hasAttribute('collapsible')) wAttr(playlist,'collapsible',false);
                },40)
            }
        }


    }



    function status_commentsHidden(){
        
        var comments=document.querySelector('ytd-comments#comments')
        if(!comments || (comments.childElementCount === 0 && comments.hasAttribute('hidden'))) return 2;
        if(comments.hasAttribute('hidden')) return 1;
        return 0;

    }


    function getFMT(ytdFlexyElm){
    

        let fmt = ["ytd-comments#comments #count.ytd-comments-header-renderer", 'ytd-item-section-renderer#sections #header ~ #contents>ytd-message-renderer'].map(s=>{
    
            let elm = ytdFlexyElm.querySelector(s)
            if(!elm) return null;
            return elm.querySelector('yt-formatted-string') || elm.closest('yt-formatted-string') || null
    
    
        });
    
        return fmt
    }
    
    function toFST(elm){
        
        if(!elm) return null;
        return elm.querySelector('yt-formatted-string') || elm.closest('yt-formatted-string') || null
    }

    
    function innerCommentsLoader(){


        const rootElement = Q.mutationTarget || kRef(ytdFlexy);
        if(!rootElement)return;

        let messageElm, messageStr, commentRenderer;
        
        if (commentRenderer = rootElement.querySelector("ytd-comments#comments #count.ytd-comments-header-renderer")) {
            
            return {
                status: 1,
                f: ()=>{

                    let span = document.querySelector("span#tab3-txt-loader")
                    Q.fetchedOnce=true;
                    let r = '0';
                    let txt = commentRenderer.textContent
                    if (typeof txt == 'string') {
                        let m = txt.match(/[\d\,\s]+/)
                        if (m) {
                            r = m[0].trim()
                            
                            
                        }
                    }
                    if(span) span.textContent = r;
                    mtoInterval=mtoInterval2;
                    setCommentSection(1);
                    cmItem=mWeakRef(toFST(commentRenderer))
                    comments_section_loaded_elm=mWeakRef(document.querySelector('ytd-comments#comments div#contents'))
                }
            }
            
        }else if((messageElm = rootElement.querySelector('ytd-item-section-renderer#sections #header ~ #contents>ytd-message-renderer'))&&(messageStr=(messageElm.textContent||'').trim())){ //ytd-message-renderer
            // it is possible to get the message before the header generation.
            return {
                status:2,
                f:()=>{
                    setTimeout(function(){
                        if(Q.fetchedOnce)return;
                        let span = document.querySelector("span#tab3-txt-loader")
                        const mainMsg= messageElm.querySelector('#message, #submessage')
                        if(mainMsg && mainMsg.textContent){
                            for(const msg of mainMsg.querySelectorAll('*:not(:empty)')){
                                if(msg.childElementCount===0 && msg.textContent) {
                                    messageStr=msg.textContent.trim()
                                    break
                                }
                            } 
                        }
                        if(span) span.textContent = messageStr;
                        mtoInterval=mtoInterval2;
                        setCommentSection(1);
                        cmItem=mWeakRef(toFST(messageElm))
                        comments_section_loaded_elm=mWeakRef(document.querySelector('ytd-comments#comments div#contents'))
                    },40);
                }
            }

        }

    }

    const FP={

        mtoNav_delayedF:() => {
        
            let {addP, removeP, mutationTarget} = Q;
        
            Q.addP = 0;
            Q.removeP = 0;
            
            let isInvalidAdding = Q.mutationTarget&& !Q.mutationTarget.parentNode

            let promisesForAddition=!scriptEnable?[]:addP > 0 && !isInvalidAdding ?[
                
                $callOnceAsync('mtf_checkFlexy'),
                $callOnceAsync('mtf_initalAttr_comments'),
                $callOnceAsync('mtf_initalAttr_playlist'),
                $callOnceAsync('mtf_initalAttr_chatroom'),
                $callOnceAsync('mtf_initalAttr_engagement_panel'),
                $callOnceAsync('mtf_advancedComments'),
                $callOnceAsync('mtf_checkDescriptionLoaded'),
                $callOnceAsync('mtf_fetchCommentsAvailable'),
                $callOnceAsync('mtf_forceCheckLiveVideo'),

                (async () => {
                    mtf_append_comments();
                })(),
        
                (async () => {
                    mtf_liveChatBtnF();
                })(),

                (async ()=>{
                    fixTabs();
                    mtf_AfterFixTabs();
                })(),
            
                (async () => {
                    mtf_append_playlist();
                })()
            ]:[];
            


            let promisesForEveryMutation=!scriptEnable?[]:[
                (async () => {
                    mtf_fix_details();
                })(),
                (async () => {
                    mtf_ChatExist();
                })()
            ];


            Promise.all([...promisesForAddition,...promisesForEveryMutation]).then(()=>{
                Q.mutationTarget = null;

                Q.mtoNav_requestNo--;
                //console.log('motnav reduced to', mtoNav_requestNo)
                if(Q.mtoNav_requestNo>0){
                    Q.mtoNav_requestNo=1;
                    setTimeout(FP.mtoNav_delayedF,mtoInterval);
                }
            })
        
        
        },

        mtoNavF: (mutations, observer) => {
            
            if(!scriptEnable)return;

            let ch = false;

            let reg = [];
            let dTarget =null;

            let wAddP=0,wRemoveP=0;

            let _last_mto_target = null;
            let _last_mto_target_valid = null;

            for (const mutation of mutations) {
                if(!mutation || !mutation.target || !mutation.target.parentNode) continue;

                let elementalMutation = false;
                let tAddP=0, tRemoveP=0;

                for (const addedNode of mutation.addedNodes){ //theoretically faster: only reading of states
                    if (addedNode.nodeType === 1) {
                        tAddP++;
                        elementalMutation = true;
                    }
                }

                for (const removedNode of mutation.removedNodes){ //theoretically faster: only reading of states
                    if (removedNode.nodeType === 1) {
                        tRemoveP++;
                        elementalMutation = true;
                    }
                }

                if(elementalMutation){ //skip all addition and removal operations without elemental changes (e.g. textNode modification)

                    if(_last_mto_target === mutation.target){
                        // due to addition and removal operations to the same DOM
                        if(_last_mto_target_valid){
                            // AddP & RemoveP is still valid
                            wAddP+=tAddP;
                            wRemoveP+=tRemoveP;
                        }
                        continue;
                    }
                    _last_mto_target = mutation.target;

                    if(isMtoTargetSkip(mutation)){
                        _last_mto_target_valid=false;
                        continue; //theoretically slower: creation of string variables
                    }else{
                        _last_mto_target_valid=true;
                        wAddP+=tAddP;
                        wRemoveP+=tRemoveP;
                    }

                    

                    ch = true;

                    reg.push(mutation);

                    if(dTarget===null) dTarget=mutation.target; //first
                    else if(dTarget===true){} //ytdFlexy
                    else if(dTarget.contains(mutation.target)){} //first node is the container to all subsequential targets
                    else {dTarget=true;} //the target is not the child of first node

                }

            }
            
            if (!ch) return; // dTarget must be true OR HTMLElement
            
            if(dTarget===true) dTarget=kRef(ytdFlexy); // major mutation occurance
            else if(dTarget === kRef(comments_section_loaded_elm) && wAddP>wRemoveP) return true; // ignore if comments are loaded (adding comments)
            else if(isMtoOverallSkip(dTarget)) return; // allow for multiple mutations at the same time - determinated after looping



            // 4 ~ 16 times per full page loading
            
            Q.addP+=wAddP;
            Q.removeP+=wRemoveP;

            if(Q.mutationTarget===null) Q.mutationTarget=dTarget;
            else if(Q.mutationTarget!=dTarget) Q.mutationTarget = kRef(ytdFlexy);

            //console.log(prettyElm(dTarget), wAddP , wRemoveP, mtoInterval)
            //console.log(prettyElm(dTarget), reg.map(m=>prettyElm(m.target)))
            //console.log(7015, performance.now())

            Q.mtoNav_requestNo++;
            if(Q.mtoNav_requestNo==1) setTimeout(FP.mtoNav_delayedF,mtoInterval);

        },


        mtoBodyF: function (mutations, observer){
            if(!scriptEnable)return;

            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes)
                    if (addedNode.nodeType === 1) {
                        if(addedNode.nodeName=="DIV" && addedNode.className.indexOf('autocomplete-suggestions')>=0){
                            mtf_fixAutoCompletePosition(addedNode)
                        }
                    }
            }

        },

        mtf_attrPlaylist:(mutations, observer)=>{

            if(!scriptEnable)return;
            let cssElm=kRef(ytdFlexy);
            if(!cssElm)return;

            var playlist=document.querySelector('ytd-playlist-panel-renderer#playlist')
            const tabBtn = document.querySelector('[userscript-tab-content="#tab-list"]');
            if(tabBtn){
                //console.log('attr playlist changed')
                if( tabBtn.classList.contains('tab-btn-hidden') && !playlist.hasAttribute('hidden') ){
                    //console.log('attr playlist changed - no hide')
                    tabBtn.classList.remove("tab-btn-hidden");
                }else if( !tabBtn.classList.contains('tab-btn-hidden') && playlist.hasAttribute('hidden') ){
                    //console.log('attr playlist changed - add hide')
                    hideTabBtn(tabBtn);
                }
            }
             /* visible layout for triggering hidden removal */ 
            akAttr(cssElm, 'tabview-youtube-playlist', playlist.hasAttribute('hidden'));
        },
        delayed_disableComments:function(){

            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return;

            if(status_commentsHidden()==2) _disableComments();

        },
        mtf_attrComments:(mutations, observer)=>{

            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return;

            var comments=document.querySelector('ytd-comments#comments')
            const tabBtn = document.querySelector('[userscript-tab-content="#tab-comments"]');
            if(!comments || !tabBtn)return;
            loadLineFix(comments)
            let isCommentHidden = comments.hasAttribute('hidden')
            //console.log('attr comments changed')


            timeout_attrComments.clear();
            $('span#tab3-txt-loader').text('');
            mtoInterval=mtoInterval1;

            if( !isCommentHidden ){

                akAttr(ytdFlexyElm,'tabview-youtube-comments', false, 'K');

                //console.log('attr comments changed - no hide')
                tabBtn.classList.remove("tab-btn-hidden") //if contains

                makeBodyScroll();
                Q.fetchedOnce = false
                FOnce.mtf_fetchCommentsAvailable = FP.mtf_fetchCommentsAvailable;
                if(Q.mutationTarget===null) $callOnceAsync('mtf_fetchCommentsAvailable');
                        
                window.requestAnimationFrame(()=>{
                    let innerCommentsLoaderRet = innerCommentsLoader();
                    if(innerCommentsLoaderRet) innerCommentsLoaderRet.f();    
                })
                
            }else if( isCommentHidden ){


                //console.log('attr comments changed - add hide')

                akAttr(ytdFlexyElm,'tabview-youtube-comments',true, 'K');

                let t = status_commentsHidden()==2 ? 1630 : 760;

                timeout_attrComments.set(FP.delayed_disableComments,t);
                
            }   
            
            requestingComments = comments;
            scrollForComments();
            setTimeout(()=>nativeFunc(comments, "loadComments"),20)
            

        },
        
        
        mtf_attrChatroom:(mutations, observer)=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return ;

            layoutStatusMutex.lockWith(unlock=>{

                const chatBlock = document.querySelector('ytd-live-chat-frame#chat')
                const cssElm = kRef(ytdFlexy)

                if(!chatBlock || !cssElm){
                    unlock();
                    return;
                }

                if(!cssElm.hasAttribute('userscript-chatblock')) wAttr(cssElm, 'userscript-chatblock', true);
                let isCollapsed=!!chatBlock.hasAttribute('collapsed');
                wAttr(cssElm,'userscript-chat-collapsed',isCollapsed);

                if(cssElm.hasAttribute('userscript-chatblock')&&!isCollapsed) lastShowTab='#chatroom';

                if(!isCollapsed && document.querySelector('#right-tabs .tab-btn.active') && isWideScreenWithTwoColumns() && !isTheater()  ){
                    switchTabActivity(null);
                    setTimeout(unlock,40);
                } else{
                    unlock();
                }

                if(!isCollapsed){
                    runAfterExpandChat();
                }else {
                    chatBlock.removeAttribute('yt-userscript-iframe-loaded');
                }

            })




        },

        mtf_attrEngagementPanel:(mutations, observer)=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return ;

            //multiple instance
            if(mutations){
                let cPanels = null;
                for(const mutation of mutations){
                    let ePanel = mutation.target;
                    if(ePanel.getAttribute('visibility')=='ENGAGEMENT_PANEL_VISIBILITY_EXPANDED'){
                        cPanels = cPanels || engagement_panels_();
                        for(const entry of cPanels.list){
                            if(entry.ePanel!=ePanel && entry.visible) ytBtnCloseEngagementPanel(entry.ePanel);
                        }
                    }
                }
            }

            layoutStatusMutex.lockWith(unlock=>{

                const ePanel = document.querySelector('ytd-watch-flexy ytd-engagement-panel-section-list-renderer')
                const cssElm = kRef(ytdFlexy)

                if(!ePanel || !cssElm){
                    unlock();
                    return;
                }
                let previousValue = +cssElm.getAttribute('userscript-engagement-panel') || 0;
                
                let {value, count} = engagement_panels_();
                let nextValue = value;
                let nextCount = count;


                if(nextCount == 0 && cssElm.hasAttribute('userscript-engagement-panel')){
                    wAttr(cssElm, 'userscript-engagement-panel', false);
                    unlock();
                }else{

                    if( ( nextCount > 1) || (cssElm.hasAttribute('userscript-engagement-panel') && previousValue===nextValue) ) {
                        unlock();
                        return;
                    }

                    cssElm.setAttribute('userscript-engagement-panel',nextValue); 

                    let b = false;
                    if(previousValue!=nextValue && nextValue>0) {
                        lastShowTab = `#engagement-panel-${nextValue}`; 
                        b=true;
                    }

                    if(b && document.querySelector('#right-tabs .tab-btn.active') && isWideScreenWithTwoColumns() && !isTheater()  ){
                        switchTabActivity(null);
                        setTimeout(unlock,40);
                    } else{
                        unlock();
                    }
                }

            })




        },

        mtf_initalAttr_playlist:()=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            var playlist=rootElement.querySelector('ytd-playlist-panel-renderer#playlist')
            if(!playlist) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Playlist', FP.mtf_attrPlaylist).observe(playlist, {          
                attributes: true,
                attributeFilter: ['hidden'],
                attributeOldValue: true
            })
            FP.mtf_attrPlaylist()
            return false;
        },

        mtf_initalAttr_comments:()=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            var comments=rootElement.querySelector('ytd-comments#comments')
            if(!comments) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Comments',FP.mtf_attrComments).observe(comments, {          
                attributes: true,
                attributeFilter: ['hidden'],
                attributeOldValue: true
            })
            FP.mtf_attrComments()
            requestingComments = comments;
            //scrollForComments()
            setTimeout(()=>nativeFunc(comments, "loadComments"),20)
            return false;
        },

        mtf_initalAttr_chatroom:()=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            var chatroom=rootElement.querySelector('ytd-live-chat-frame#chat')
            if(!chatroom) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Chatroom',FP.mtf_attrChatroom).observe(chatroom, {          
                attributes: true,
                attributeFilter: ['collapsed'],
                attributeOldValue: true
            })
            FP.mtf_attrChatroom()
            return false;
        },

        mtf_initalAttr_engagement_panel:()=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            let toCheck=false;
            for(const engagement_panel of rootElement.querySelectorAll('ytd-watch-flexy ytd-engagement-panel-section-list-renderer:not([tabview-attr-checked])')){

                engagement_panel.setAttribute('tabview-attr-checked','');
                let mto = mtoVs.mtoVisibility_EngagementPanel;
                if(!mto) mto=initMutationObserver(mtoVs,'mtoVisibility_EngagementPanel',FP.mtf_attrEngagementPanel);
                mto.observe(engagement_panel, {          
                    attributes: true,
                    attributeFilter: ['visibility'],
                    attributeOldValue: true
                })
                toCheck=true;
            }

            if(toCheck) FP.mtf_attrEngagementPanel()
            
            return true;
        },

        mtf_checkDescriptionLoaded: () => {
                        
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            const expander = document.querySelector("#meta-contents ytd-expander");
            if (!expander) return true;
            $(expander).appendTo("#tab-info").attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)

            const avatar = document.querySelector('#meta-contents yt-img-shadow#avatar');
            if(avatar) hackImgShadow(avatar)
            return false;

        },


        //live-chat / chat-replay

        fireOnce_forceCheckLiveVideo_tf: ()=>{

            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return;

            let elm = document.querySelector('#ytd-player .ytp-time-display');
            if(elm && elm.classList.contains('ytp-live')) {
                //console.log(7006)
                ytdFlexyElm.setAttribute('userscript-chatblock', 'chat-live')
                //disableComments_LiveChat();
            }
        },

        mtf_forceCheckLiveVideo:() => {
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;
            const playerLabel = document.querySelector('#ytd-player .ytp-time-display') && document.querySelector('ytd-live-chat-frame#chat')
            if (!playerLabel) return true;
            setTimeout(FP.fireOnce_forceCheckLiveVideo_tf,170)
            return false;
        },

        //comments

        mtf_advancedComments: () => {
            
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;
            const continuations = document.querySelector("ytd-comments#comments #continuations");
            if (!continuations) return true;
            requestingComments = document.querySelector('ytd-comments#comments');
            scrollForComments();
            return false;
        },

        mtf_fetchCommentsAvailable:() => {

            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            let innerCommentsLoaderRet = innerCommentsLoader();
            if(!innerCommentsLoaderRet) return true;

            innerCommentsLoaderRet.f();
            fetchCommentsFinished();
            return false;
        
        }

        
    }








    function initObserver(){

        Q.addP=0;
        Q.removeP=0; 
        Q.mutationTarget = null;

        Q.mtoNav_requestNo=0;

        initMutationObserver(mtoCs, 'mtoNav', FP.mtoNavF).observe(kRef(ytdFlexy), {
            subtree: true,
            childList: true,
            attributes: false
        });

        -(async()=>{
            Q.addP=1; //force all checking
            Q.mtoNav_requestNo++;
            if(Q.mtoNav_requestNo==1) FP.mtoNav_delayedF();
        })();

        // for automcomplete plugin
        initMutationObserver(mtoCs,'mtoBody', FP.mtoBodyF).observe(document.querySelector('body'), {
            childList: true,
            subtree: false,
            attributes: false
        })


    }

    let displayedPlaylist=null;
    let scrollingVideosList=null;

    let scriptEnable =false;
    let scriptEC = 0;
    let lastShowTab = null;

    let _cachedLastVideo=null;
    let videoListBeforeSearch=null;
    let no_fix_contents_until = 0;
    let no_fix_playlist_until = 0;
    let statusCollasped = 0;
    
    let ytdFlexy=null;
    let timeout_attrComments=new Timeout();

    function pluginHook(){

        scriptEnable =true;
        scriptEC++;

        no_fix_contents_until = 0;
        no_fix_playlist_until = 0;

        ytdFlexy=mWeakRef(document.querySelector('ytd-watch-flexy'))

    }

    function pluginUnhook() {

        //console.log(8001)
        timeout_attrComments.clear();

        videoListBeforeSearch=null;
        statusCollasped=0;
        _cachedLastVideo=null;
        lastShowTab=null;
        displayedPlaylist=null;
        scrollingVideosList=null;
        scriptEnable =false;
        scriptEC++;
        if(scriptEC>788888888) scriptEC=188888888;
        ytdFlexy=null;
        wls.layoutStatus=null;

        clearMutationObserver(mtoVs,'mtoVisibility_Playlist')
        clearMutationObserver(mtoVs,'mtoVisibility_Comments')
        clearMutationObserver(mtoVs,'mtoVisibility_Chatroom')
        clearMutationObserver(mtoVs,'mtoFlexyAttr')

        clearMutationObserver(mtoCs,'mtoBody')
        if (clearMutationObserver(mtoCs,'mtoNav')) {
            FOnce.mtf_checkFlexy=null;
            FOnce.mtf_initalAttr_comments = null;
            FOnce.mtf_initalAttr_playlist = null;
            FOnce.mtf_initalAttr_chatroom = null;
            FOnce.mtf_initalAttr_engagement_panel = null;
            FOnce.mtf_advancedComments=null;
            FOnce.mtf_checkDescriptionLoaded = null;
            FOnce.mtf_fetchCommentsAvailable = null;
            FOnce.mtf_forceCheckLiveVideo=null;
            Q.mtf_chatBlockQ = null;
        }

        mtoInterval = mtoInterval1;        

    }
    
    let comments_section_loaded_elm = null;


    function initializeForVideoChange(){





        pluginUnhook();
        if(!document.querySelector('script#userscript-tabview-injection-1')) {
            addScript(`!!(${injection_script_1+""})()`).id='userscript-tabview-injection-1'
        }

        var prevComemnts = document.querySelector('ytd-comments#comments'); 

        if(prevComemnts && prevComemnts.matches('[hidden]')){
                
            // assumption: loading comments after executation of this function which removes the attribute [hidden] of #ytd-comments#comments

            var prevCommentsHeader = prevComemnts.querySelector('ytd-comments#comments ytd-comments-header-renderer');
            var prevCommentsMsg= prevComemnts.querySelector('ytd-item-section-renderer#sections #header ~ #contents>ytd-message-renderer');
                
            //removed any cache of #comments header (i.e. count message)
            if (prevCommentsHeader) prevCommentsHeader.parentNode.removeChild(prevCommentsHeader);

            //removed any cache of #comments message (i.e. 留言功能已停用。)
            if (prevCommentsMsg) prevCommentsMsg.parentNode.removeChild(prevCommentsMsg);
            
            

        }


        window.requestAnimationFrame(()=>{

            // requestAnimationFrame is required to let youtube coding running first !
            
            pluginHook();
    
            _onNavigationEnd();

            setTimeout(()=>{

                //ensure comment tab text is updated - no matter there is change of video or not
                let innerCommentsLoaderRet = innerCommentsLoader();
                if(innerCommentsLoaderRet) innerCommentsLoaderRet.f();    
    
            },40);
            

        })

        
        return true;

    }

    function getTabsHTML(){

        const sTabBtnVideos = `${svgElm(16,16,298,298,svgVideos)}<span>Videos</span>`
        const sTabBtnInfo = `${svgElm(16,16,23.625,23.625,svgInfo)}<span>Info</span>`
        const sTabBtnPlayList = `${svgElm(16,16,426.667,426.667,svgPlayList)}<span>Playlist</span>`

        let str1 = `
        <paper-ripple class="style-scope yt-icon-button">
            <div id="background" class="style-scope paper-ripple" style="opacity:0;"></div>
            <div id="waves" class="style-scope paper-ripple"></div>
        </paper-ripple>
        `;

        const str_tabs = [
            `<a id="tab-btn1" data-name="info" userscript-tab-content="#tab-info" class="tab-btn">${sTabBtnInfo}${str1}</a>`,
            `<a id="tab-btn2" userscript-tab-content="#tab-live" class="tab-btn tab-btn-hidden">Chat${str1}</a>`,
            `<a id="tab-btn3" userscript-tab-content="#tab-comments" data-name="comments" class="tab-btn">${svgElm(16,16,60,60,svgComments)}<span id="tab3-txt-loader"></span>${str1}</a>`,
            `<a id="tab-btn4" userscript-tab-content="#tab-videos" data-name="videos" class="tab-btn">${sTabBtnVideos}${str1}</a>`,
            `<a id="tab-btn5" userscript-tab-content="#tab-list" class="tab-btn">${sTabBtnPlayList}${str1}</a>`
        ].join('')

        var addHTML = `
        <div id="right-tabs">
            <header>
                <div id="material-tabs">
                    ${str_tabs}
                </div>
            </header>
            <div class="tab-content">
                <div id="tab-info" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-live" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-comments" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-videos" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
                <div id="tab-list" class="tab-content-cld tab-content-hidden" userscript-scrollbar-render></div>
            </div>
        </div>
        `;

        return addHTML

    }

    
    function injection_script_1(){

        document.addEventListener('userscript-call-dom-func',function(evt){

            if(!evt || !evt.target || !evt.detail) return;
            let dom = evt.target;

            let {property, args}=evt.detail;
            if(!property) return;
            let f=dom[property];
            if(typeof f !='function') return;

            if(args&&args.length>0) f.apply(dom,args);
            else f.call(dom);

        },true)

    }

    function _onNavigationEnd() {

        let timeoutR_findRelated=new Timeout();
        timeoutR_findRelated.set(function(){
            let related = kRef(ytdFlexy).querySelector("#related");
            if(!related) return true;
            foundRelated(related);
        },100,10)

        function foundRelated(related){
            let promise = Promise.resolve();
            if (!document.querySelector("#right-tabs")) {
                promise=promise.then(()=>{
                    $(getTabsHTML()).insertBefore(related).attr('data-dom-created-by-tabview-youtube',scriptVersionForExternal);
                })
            }
            promise.then(runAfterTabAppended).then(initObserver)
        }

        setTimeout(()=>{
            for(const s of document.querySelectorAll('#right-tabs [userscript-scrollbar-render]')){
                Promise.resolve(s).then(s=>{
                    if(s && s.scrollTop>0) s.scrollTop=0;
                    let child =s.firstElementChild; 
                    if(child && child.scrollTop>0) child.scrollTop =0;
                });
            }
        },90)

    }

    function onNavigationEnd(evt) {
        
        pluginUnhook(); // in case not triggered by popstate - say mini playing

        $('span#tab3-txt-loader').text('');
        setCommentSection(0)

        if(!/^https?\:\/\/(\w+\.)*youtube\.com\/watch\?(\w+\=[^\/\?\&]+\&|\w+\=?\&)*v=[\w\-\_]+/.test(window.location.href))return;


        let timeout = 4; // max. 4 animation frames

        let tf = ()=>{
            if(--timeout>0 && !document.querySelector('#player video')) return requestAnimationFrame(tf);
 
            initializeForVideoChange(); 
            pluginHook(); 
            _onNavigationEnd();
     
        }


        tf();






    }

    function setToActiveTab(defaultTab) {
        if(isTheater() && isWideScreenWithTwoColumns())return;
        const jElm = document.querySelector(`a[userscript-tab-content="${switchTabActivity_lastTab}"]:not(.tab-btn-hidden)`) ||
            document.querySelector(`a[userscript-tab-content="${(defaultTab||settings.defaultTab)}"]:not(.tab-btn-hidden)`) ||
            document.querySelector("a[userscript-tab-content]:not(.tab-btn-hidden)") ||
            null;
        switchTabActivity(jElm);
        return !!jElm;
    }

    function getWrapper(wrapperId){
        let $wrapper = $(`#${wrapperId}`);
        if(!$wrapper[0]) $wrapper=$(`<div id="${wrapperId}"></div>`)
        return $wrapper.first();
    }

    function runAfterTabAppended() {

        document.documentElement.setAttribute('plugin-tabview-youtube','')
       
        const cssElm = kRef(ytdFlexy)
        if(cssElm && !cssElm.hasAttribute('tabview-selection')) cssElm.setAttribute('tabview-selection','')


        // append the next videos 
        // it exists as "related" is already here
        fixTabs();

        // just switch to the default tab
        setToActiveTab();


        prepareTabBtn();
        

        // append the detailed meta contents to the tab-info
        FOnce.mtf_checkDescriptionLoaded = FP.mtf_checkDescriptionLoaded;
        if(Q.mutationTarget===null) $callOnceAsync('mtf_checkDescriptionLoaded');

        // force window scroll when #continuations is first detected and #comments still [hidden]
        FOnce.mtf_advancedComments = FP.mtf_advancedComments;
        if(Q.mutationTarget===null) $callOnceAsync('mtf_advancedComments');

        // use video player's element to detect the live-chat situation (no commenting section)
        // this would be very useful if the live chat is collapsed, i.e. iframe has no indication on the where it is live or replay
        FOnce.mtf_forceCheckLiveVideo = FP.mtf_forceCheckLiveVideo;
        if(Q.mutationTarget===null) $callOnceAsync('mtf_forceCheckLiveVideo');


        // Attr Mutation Observer - #playlist - hidden
        clearMutationObserver(mtoVs,'mtoVisibility_Playlist')
        // Attr Mutation Observer callback - #playlist - hidden

        // pending for #playlist and set Attribute Observer
        FOnce.mtf_initalAttr_playlist=FP.mtf_initalAttr_playlist
        if(Q.mutationTarget===null) $callOnceAsync('mtf_initalAttr_playlist');

        // Attr Mutation Observer - ytd-comments#comments - hidden
        clearMutationObserver(mtoVs,'mtoVisibility_Comments')
        // Attr Mutation Observer callback - ytd-comments#comments - hidden

        // pending for #comments and set Attribute Observer
        FOnce.mtf_initalAttr_comments=FP.mtf_initalAttr_comments;
        if(Q.mutationTarget===null) $callOnceAsync('mtf_initalAttr_comments');


        clearMutationObserver(mtoVs,'mtoVisibility_Chatroom');
        FOnce.mtf_initalAttr_chatroom=FP.mtf_initalAttr_chatroom
        if(Q.mutationTarget===null) $callOnceAsync('mtf_initalAttr_chatroom');

        clearMutationObserver(mtoVs,'mtoVisibility_EngagementPanel');
        for(const engagement_panel of document.querySelectorAll('ytd-watch-flexy ytd-engagement-panel-section-list-renderer:not([tabview-attr-checked])')){
            engagement_panel.removeAttribute('tabview-attr-checked');
        }
        FOnce.mtf_initalAttr_engagement_panel=FP.mtf_initalAttr_engagement_panel
        if(Q.mutationTarget===null) $callOnceAsync('mtf_initalAttr_engagement_panel');


        flexyAttrInit();

        document.querySelector("#right-tabs .tab-content").addEventListener('scroll', makeBodyScrollByEvt, true);

    }


    function fetchCommentsFinished(){
        let ytdFlexyElm = kRef(ytdFlexy);
        if(!scriptEnable || !ytdFlexyElm) return;
        timeout_attrComments.clear();
        akAttr(ytdFlexyElm,'tabview-youtube-comments',false, 'LS')
    }

    function setCommentSection(value){
        Q.comments_section_loaded =value;

        if(value===0){
            comments_section_loaded_elm=null;
        }

    }

    function _disableComments(){

        if(!scriptEnable)return;
        let cssElm=kRef(ytdFlexy);
        if(!cssElm)return;

        mtoInterval=mtoInterval2;
        setCommentSection(2);
        
        comments_section_loaded_elm=mWeakRef(document.querySelector('ytd-comments#comments div#contents')||null)
        
        let tabBtn = document.querySelector('.tab-btn[userscript-tab-content="#tab-comments"]');
        if(tabBtn && !tabBtn.classList.contains('tab-btn-hidden')){
            hideTabBtn(tabBtn)
        }
        
        akAttr(cssElm,'tabview-youtube-comments',true, 'D');
        FOnce.mtf_fetchCommentsAvailable = null; 


    }





    let layoutStatusMutex=new Mutex();

    function forceDisplayChatReplay(){
        let items=chatFrameElement('yt-live-chat-item-list-renderer #items');
        if(items && items.childElementCount!==0)return;

        let ytd_player = document.querySelector('ytd-player#ytd-player'); 
        if(!ytd_player)return;
        let videoElm = ytd_player.querySelector('video'); 
        if(!videoElm)return;

        let video=videoElm;
        if(videoElm && video.currentTime > 0 && !video.ended && video.readyState > video.HAVE_CURRENT_DATA){
            let chat = document.querySelector('ytd-live-chat-frame#chat');
            if(chat){
                nativeFunc(chat, "postToContentWindow", [{"yt-player-video-progress":videoElm.currentTime}])
            }
        }

    }


    
    function runAfterExpandChat(){



        new Promise(resolve=>{


            let chatFrame_st=Date.now();
            let cid_chatFrameCheck = 0;
    
            let sEF = new ScriptEF();
            cid_chatFrameCheck=setInterval(()=>{
                if(!sEF.isValid()) return cid_chatFrameCheck=clearInterval(cid_chatFrameCheck);
                let cDoc = chatFrameContentDocument();
                if(cDoc) {
                    cid_chatFrameCheck=clearInterval(cid_chatFrameCheck);
                    resolve();
                }else if(!scriptEnable || !isChatExpand() || Date.now() - chatFrame_st > 6750){
                    cid_chatFrameCheck=clearInterval(cid_chatFrameCheck);
                }
            },60);


        }).then(()=>new Promise(resolve=>{




            let timeoutR_ChatAppReady=new Timeout();
            timeoutR_ChatAppReady.set(()=>{
    
                if(!scriptEnable || !isChatExpand())return false;
                let app=chatFrameElement('yt-live-chat-app');
                if(!app) return true;


                setTimeout(()=>resolve(app),40)
    

            },40,150); //40*150 = 6000ms = 6s;
    
            



        })).then(app=>{

            
            let cDoc = app.ownerDocument;

            if(!scriptEnable || !isChatExpand())return;
            addStyle(`      
                body #input-panel.yt-live-chat-renderer::after {
                    background: transparent;
                }
                #items.yt-live-chat-item-list-renderer{
                    contain: content;
                }
                yt-live-chat-text-message-renderer{
                    contain: content;
                }
                #item-offset.yt-live-chat-item-list-renderer{
                    contain: content;
                }
                #item-scroller.yt-live-chat-item-list-renderer{
                    contain: strict;
                }
                img[width][height]{
                    contain: strict;
                }
                #item-list>yt-live-chat-item-list-renderer, #item-list>yt-live-chat-item-list-renderer>#contents{
                    contain: strict;
                }
                yt-live-chat-app{
                    contain: content;
                }
            `, cDoc.documentElement)

            if(cDoc.querySelector('yt-live-chat-renderer #continuations')){
                setTimeout(()=>mtf_ChatExist(),40);
                $(document.querySelector('ytd-live-chat-frame#chat')).attr('yt-userscript-iframe-loaded','')
            }

            forceDisplayChatReplay();


            



        })

    }


    function flexyAttrInit(){
        
        
        clearMutationObserver(mtoVs,'mtoFlexyAttr')

        function toggleFlag(mFlag, b, flag){
            if(b) mFlag = mFlag | flag; 
            else mFlag = mFlag & ~flag;
            return mFlag;
        }

        function toLayoutStatus(nls, attributeName){

            let attrElm, b, v; 
            switch (attributeName){
                case 'theater': 
                nls = toggleFlag(nls, isTheater(), LAYOUT_THEATER);
                break;
                case 'userscript-chat-collapsed': 
                case 'userscript-chatblock':
                    attrElm=kRef(ytdFlexy);
                    if(hasAttribute(attrElm, 'userscript-chat-collapsed')) {
                        nls = toggleFlag(nls, true, LAYOUT_CHATROOM | LAYOUT_CHATROOM_COLLASPED);
                    }else{
                        nls = toggleFlag(nls, hasAttribute(attrElm, 'userscript-chatblock'), LAYOUT_CHATROOM);
                        nls = toggleFlag(nls, false, LAYOUT_CHATROOM_COLLASPED);
                    }
                break;
                case 'is-two-columns_': 
                nls = toggleFlag(nls, isWideScreenWithTwoColumns(), LAYOUT_TWO_COLUMNS);
                break;

                case 'tabview-selection': 
                b = isNonEmptyString( kRef(ytdFlexy).getAttribute('tabview-selection') );
                nls = toggleFlag(nls,  b, LAYOUT_TAB_EXPANDED);
                break;

                case 'fullscreen': 
                b = isNonEmptyString( kRef(ytdFlexy).getAttribute('fullscreen') );
                nls = toggleFlag(nls, b, LAYOUT_FULLSCREEN);
                break;

                case 'userscript-engagement-panel': 
                v = kRef(ytdFlexy).getAttribute('userscript-engagement-panel');
                b = (+v>0)
                nls = toggleFlag(nls,  b, LAYOUT_ENGAGEMENT_PANEL_EXPAND);
                break;

            }

            return nls;


        }

        let mtf_attrFlexy=(mutations, observer)=>{
            
            if(!scriptEnable)return;


            const cssElm=kRef(ytdFlexy)
            if(!cssElm)return;

            if(!mutations)return;

            const old_layoutStatus = wls.layoutStatus
            if(old_layoutStatus === null) return;
            let new_layoutStatus = old_layoutStatus;
        
            for(const mutation of mutations) {
                new_layoutStatus=toLayoutStatus(new_layoutStatus, mutation.attributeName);
                if (mutation.attributeName == 'userscript-chat-collapsed' || mutation.attributeName == 'userscript-chatblock'){

                    if( cssElm.getAttribute('userscript-chatblock')==='chat-live' ){
                        
                        requestingComments=null;    
                        _disableComments();

                    }

                    if(!cssElm.hasAttribute('userscript-chatblock')){
                        setTimeout(()=>{
                            if(!scriptEnable)return;
                            if(!isAnyActiveTab() && !isChatExpand() && !isTheater() && isWideScreenWithTwoColumns() && !isFullScreen()){
                                setToActiveTab();
                            }
                        },240);
                    }

                }
            }


            if(new_layoutStatus!==old_layoutStatus)  wls.layoutStatus = new_layoutStatus




        }


        FOnce.mtf_checkFlexy=()=>{
            let ytdFlexyElm = kRef(ytdFlexy);
            if(!scriptEnable || !ytdFlexyElm) return true;

            const rootElement = Q.mutationTarget || ytdFlexyElm;

            var flexy=kRef(ytdFlexy)
            if(!flexy) return true;

            wls.layoutStatus=null;

            let rChatExist = base_ChatExist();
            if(rChatExist){
                let {attr_chatblock, attr_chatcollapsed} = rChatExist;
                if(attr_chatblock===null) {
                    //remove attribute if it is unknown
                    attr_chatblock=false;
                    attr_chatcollapsed=false;
                }
                wAttr(flexy, 'userscript-chatblock', attr_chatblock)
                wAttr(flexy, 'userscript-chat-collapsed', attr_chatcollapsed)
            }

            let rTabSelection = [...flexy.querySelectorAll('.tab-btn[userscript-tab-content]')]
            .map(elm=>({elm, hidden: elm.classList.contains('tab-btn-hidden') }))
            .filter(entry=>entry.hidden===true);
            if(rTabSelection.length===0) wAttr(flexy, 'tabview-selection', false);
            else if(rTabSelection.length===1) wAttr(flexy, 'tabview-selection', rTabSelection[0].elm.getAttribute('userscript-tab-content')||'');

            let rEP = engagement_panels_();
            if(rEP && rEP.count>0) wAttr(flexy, 'userscript-engagement-panel', false);
            else wAttr(flexy, 'userscript-engagement-panel', rEP.value+"");

            let ls = 0;
            ls=toLayoutStatus(ls,'theater')
            ls=toLayoutStatus(ls,'userscript-chat-collapsed')
            ls=toLayoutStatus(ls,'userscript-chatblock')
            ls=toLayoutStatus(ls,'is-two-columns_')
            ls=toLayoutStatus(ls,'tabview-selection')
            ls=toLayoutStatus(ls,'fullscreen')
            ls=toLayoutStatus(ls,'userscript-engagement-panel')

            wls.layoutStatus=ls

            initMutationObserver(mtoVs,'mtoFlexyAttr',mtf_attrFlexy).observe(flexy, {          
                attributes: true,
                attributeFilter: ['userscript-chat-collapsed','userscript-chatblock','theater','is-two-columns_','tabview-selection','fullscreen','userscript-engagement-panel'],
                attributeOldValue: true
            })


            let columns = document.querySelector('ytd-page-manager#page-manager #columns')
            if(columns){
                wAttr(columns, 'userscript-scrollbar-render', true);
            }

            return false;
        }
        if(Q.mutationTarget===null) $callOnceAsync('mtf_checkFlexy')



    }




    let switchTabActivity_lastTab = null

    function setDisplayedPlaylist(){
        //override the default youtube coding event prevention
        let cssElm=kRef(ytdFlexy);
        if(!scriptEnable || !cssElm)return;
        displayedPlaylist=mWeakRef(document.querySelector('ytd-watch-flexy #tab-list:not(.tab-content-hidden) ytd-playlist-panel-renderer') || null);
    }

    function switchTabActivity(activeLink) {
        if(!scriptEnable)return;
 
        const ytdFlexyElm=kRef(ytdFlexy);
 
        if(!ytdFlexyElm) return;
 
        if (activeLink && activeLink.classList.contains('tab-btn-hidden')) return; // not allow to switch to hide tab
 
        if(isTheater() && isWideScreenWithTwoColumns()) activeLink=null;
 
 
        function runAtEnd(){
  
            if(activeLink) lastShowTab=activeLink.getAttribute('userscript-tab-content')
 
            displayedPlaylist=null;
            scrollingVideosList=null;
 
            if(activeLink && lastShowTab == '#tab-list'){
                setDisplayedPlaylist();
            }else if(activeLink && lastShowTab == '#tab-videos'){
                scrollingVideosList=mWeakRef(document.querySelector('ytd-watch-flexy #tab-videos:not(.tab-content-hidden) [placeholder-videos]'));
            }

        
            ytdFlexyElm.setAttribute('tabview-selection',activeLink?lastShowTab:'')
            
            if(lastShowTab == '#tab-comments' && (ytdFlexyElm.getAttribute('tabview-youtube-comments')||'').lastIndexOf('S')>=0){

                akAttr(ytdFlexyElm, 'tabview-youtube-comments',false,'L');

                requestAnimationFrame(()=>{
                    let comments_tab=document.querySelector('#tab-comments');
                    if(comments_tab && comments_tab.scrollTop>0) comments_tab.scrollTop=0;
                });

            }
            
        }
 
        const links = document.querySelectorAll('#material-tabs a[userscript-tab-content]');
 
 
        for (const link of links) {
            let content = document.querySelector(link.getAttribute('userscript-tab-content'));
            if (link && content) {
                if (link !== activeLink) {
                    link.classList.remove("active");
                    content.classList.add("tab-content-hidden");
                } else {
                    link.classList.add("active");
                    content.classList.remove("tab-content-hidden");
                    //setTimeout(()=>content.focus(),400);
                    
                }
            }
        }
 
        runAtEnd();
 
 
    }

    let tabsUiScript_setclick = false;

    function prepareTabBtn() {

        const materialTab = document.querySelector("#material-tabs")
        if (!materialTab) return;

        let noActiveTab = !!document.querySelector('ytd-watch-flexy[userscript-chatblock]:not([userscript-chat-collapsed])')

        const activeLink = materialTab.querySelector('a[userscript-tab-content].active:not(.tab-btn-hidden)')
        if (activeLink) switchTabActivity(noActiveTab ? null : activeLink)

        if (!tabsUiScript_setclick) {
            tabsUiScript_setclick = true;
            $(materialTab).on("click", "a", function(evt) {

                let ytdFlexyElm = kRef(ytdFlexy);
                if(!scriptEnable || !ytdFlexyElm) return null;

                if (!this.hasAttribute('userscript-tab-content')) return;


                evt.preventDefault();


                if(this.getAttribute('userscript-tab-content')=='#tab-comments' && parseInt(ytdFlexyElm.getAttribute('tabview-youtube-comments')||'')<0){
                    return;
                }

                new Promise(requestAnimationFrame).then(() => {


                    layoutStatusMutex.lockWith(unlock=>{

                        switchTabActivity_lastTab = this.getAttribute('userscript-tab-content');

                        let isActiveAndVisible = this.classList.contains('tab-btn') && this.classList.contains('active') && !this.classList.contains('tab-btn-hidden')
    
                        if( isWideScreenWithTwoColumns() && !isTheater() && isActiveAndVisible){
                            //optional
                            setTimeout(unlock,80);
                            switchTabActivity(null);
                            ytBtnSetTheater();
                        }else if(isActiveAndVisible){
                            setTimeout(unlock,80);
                            switchTabActivity(null);
                        }else{
                            let pInterval = 60;
                            if(isChatExpand() && isWideScreenWithTwoColumns()) {
                                ytBtnCollapseChat();
                            }else if(isEngagementPanelExpanded() && isWideScreenWithTwoColumns()){
                                ytBtnCloseEngagementPanels();
                            }else if(isWideScreenWithTwoColumns() && isTheater() && !isFullScreen() ){
                                ytBtnCancelTheater();
                            }else{
                                pInterval=20;
                            }
                            setTimeout(()=>{
                                setTimeout(makeBodyScroll,20); // this is to make the image render
    
                                setTimeout(()=>{
                                    let rightTabs=document.querySelector('#right-tabs');
                                    if(!isWideScreenWithTwoColumns() && rightTabs && rightTabs.offsetTop>0 && this.classList.contains('active')){
                                        let tabButtonBar = document.querySelector('#material-tabs');
                                        let tabButtonBarHeight = tabButtonBar?tabButtonBar.offsetHeight:0;
                                        window.scrollTo(0, rightTabs.offsetTop-tabButtonBarHeight);
                                    }
                                },60)
    
                                setTimeout(unlock,80)
                                switchTabActivity(this)
    
                            }, pInterval);
                        }
    
    
                    })

                })

                

                
            });

        }

    }


    // ---------------------------------------------------------------------------------------------
    window.addEventListener("yt-navigate-finish", onNavigationEnd)
    
    document.addEventListener("loadstart",(evt)=>{
        if(!evt || !evt.target || evt.target.nodeName!=="VIDEO")return;
        let elm = evt.target;
        if(!elm.matches('#player video, #movie_player video, video[tabview-mainvideo]'))return;
        
        let src = elm.src;
        if(src!==lastVideoURL){
            lastVideoURL = elm.src;

            elm.setAttribute('tabview-mainvideo', ''); // mainly for mini playing


        }

    }, true)

    // ---------------------------------------------------------------------------------------------

    var scrolling_lastD = 0;

    const singleColumnScrolling = function(scrolling_lastF) {
        let pageY = pageYOffset;
        if (pageY < 10 && scrolling_lastD === 0 && !scrolling_lastF) return;

        let targetElm, header, navElm;

        Promise.resolve().then(() => {

            targetElm = document.querySelector("#right-tabs");
            if (!targetElm) return;
            header = targetElm.querySelector("header");
            if (!header) return;
            navElm = document.querySelector('#masthead-container, #masthead')
            if (!navElm) return;
            let navHeight = navElm ? navElm.offsetHeight : 0

            let elmY = targetElm.offsetTop

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

        }).then((xyStatus) => {

            if ((xyStatus == 2 || xyStatus == 3) && (scrolling_lastD === 0 || scrolling_lastF)) {
                scrolling_lastD = 1;
                let {
                    offsetHeight
                } = header
                let {
                    offsetWidth
                } = targetElm

                targetElm.style.setProperty("--userscript-sticky-width", offsetWidth + 'px')
                targetElm.style.setProperty("--userscript-sticky", offsetHeight + 'px')
                
                wAttr(targetElm, 'userscript-sticky', true);

            } else if ((xyStatus == 1) && (scrolling_lastD === 1 || scrolling_lastF)) {
                scrolling_lastD = 0;

                wAttr(targetElm, 'userscript-sticky', false);
            }


            targetElm = null;
            header = null;
            navElm = null;

        });

    };

    window.addEventListener("scroll", function() {
        if(!scriptEnable)return;
        singleColumnScrolling(false)
    }, {
        capture: false,
        passive: true
    })

    var lastResizeAt=0;
    window.addEventListener('resize', function() {
        if(!scriptEnable)return;
        lastResizeAt= Date.now();

        requestAnimationFrame(() => {
            if(!scriptEnable)return;
            singleColumnScrolling(true)
        })

    }, {
        capture: false,
        passive: true
    })

    window.addEventListener('beforeunload', function() {
        if(!scriptEnable)return;
        console.log('beforeunload')
        pluginUnhook();
        //let video=document.querySelector('video');
        //if(video && !video.paused) video.pause(); 
    }, {capture: true})

    window.addEventListener('hashchange', function() { 
        if(!scriptEnable)return;
        console.log('hashchange')
        pluginUnhook();
    }, {capture: true})
    
    window.addEventListener('popstate', function() { 
        if(!scriptEnable)return;
        console.log('popstate')
        pluginUnhook();
    }, {capture: true})


    function clearMutationObserver(o, key){
        if(o[key]) {
            o[key].takeRecords();
            o[key].disconnect();
            o[key]=null;
            return true;
        }
    }

    function initMutationObserver(o, key, callback){
        clearMutationObserver(o,key);
        const mto = new MutationObserver(callback);
        o[key] = mto;
        return mto;
    }

    document.addEventListener('wheel',function(evt){
        
        if(!scriptEnable)return;
        const displayedPlaylist_element = kRef(displayedPlaylist);
        if(displayedPlaylist_element && displayedPlaylist_element.contains(evt.target)){
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }
    },{capture:true,passive:true});


    function setVideosTwoColumns(flag, bool){

    //two columns to one column

    /*
        [placeholder-videos] ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy

        is-two-columns =""  => no is-two-columns
        
        
        
        [placeholder-videos] tp-yt-paper-spinner#spinner.style-scope.ytd-continuation-item-renderer
        
        no hidden => hidden =""
        
        
        [placeholder-videos] div#button.style-scope.ytd-continuation-item-renderer
        
        
        hidden ="" => no hidden
        

        */

        let cssSelector1='[placeholder-videos] ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy'

        let cssSelector2='[placeholder-videos] tp-yt-paper-spinner#spinner.style-scope.ytd-continuation-item-renderer'

        let cssSelector3='[placeholder-videos] div#button.style-scope.ytd-continuation-item-renderer'

        let res={}
        if(flag&1){
            res.m1=document.querySelector(cssSelector1)
            if(res.m1) wAttr(res.m1, 'is-two-columns', bool?'':false);
        }

        if(flag&2){
            res.m2=document.querySelector(cssSelector2)
            if(res.m2) wAttr(res.m2, 'hidden', bool?false:'');
        }

        if(flag&4){
            res.m3=document.querySelector(cssSelector3)
            if(res.m3) wAttr(res.m3, 'hidden', bool?'':false);
        }


        return res
        
        
        


    }

    let lastScrollFetch=0;
    // function isScrolledToEnd(){
    //     return (window.innerHeight + window.pageYOffset) >= document.scrollingElement.scrollHeight - 2;
    // }
    let lastOffsetTop = 0;
    window.addEventListener('scroll',function(evt){

        //console.log(evt.target)

        if(!scriptEnable)return;


        if( !kRef(scrollingVideosList) ) return;
        if( videoListBeforeSearch ) return;



        let visibleHeight = document.scrollingElement.clientHeight;
        let totalHeight = document.scrollingElement.scrollHeight;

        if(totalHeight<visibleHeight*1.5)return; // filter out two column view;

        let z = window.pageYOffset + visibleHeight;
        let h_advanced = totalHeight - ( visibleHeight > 5*40 ? visibleHeight*0.5 : 40 );



        if(z>h_advanced && !isWideScreenWithTwoColumns() ){

            let ct = Date.now();
            if(ct -  lastScrollFetch<500) return; //prevent continuous calling

            lastScrollFetch=ct;
        
            let res= setVideosTwoColumns(2|4, true)
            if(res.m3 && res.m2){

                //wait for DOM change, just in case
                requestAnimationFrame(()=>{
                    let {offsetTop}=res.m2  // as visibility of m2 & m3 switched.

                    if(offsetTop-lastOffsetTop<40) return; // in case bug, or repeating calling.  // the next button shall below the this button 
                    lastOffsetTop= offsetTop

                    res.m2.parentNode.dispatchEvent(new Event('yt-service-request-sent-button-renderer'))
            
                    res= null
                }) 

            }else{
                
                res= null
            }


        }




    },{passive:true})



    
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

    */

    function loadLineFix(ytdComments){

        if(ytdComments.hasAttribute('data-loaded-linefix')) return;
        ytdComments.setAttribute('data-loaded-linefix','');

        let wrComments = mWeakRef(ytdComments);
        let enabled=true;

        //stupid coding for buggy -webkit-box 
        // 1st fix: set the -webkit-box to change attribute when it is visually available; 
        // 2nd fix: change attribute again after 100ms 

        /*
        function delayedFix(){
            // 2nd fix : auto to N/A

            if(!enabled)return;
            let t=tracer('fix_comments_2nd');

            setTimeout(function(){  // only active tab

                if(!tracer('fix_comments_2nd',t)) return; // lessen calls
                let css = `[tabview-webkitbox-linefix=""]`;

                let nodeList = document.querySelectorAll(css, ytdComments); // proceed unless no such elements
            
                if(nodeList.length){
                    [...nodeList].map(elm=>new Promise(resolve=>{
                        elm.setAttribute('tabview-webkitbox-linefix','1') // change from '' to '1'
                        elm=null;
                    }))                    
                }

            },100) // requestAnimationFrame is too fast for 2nd fix

        }
        */
        

        function linefix(){
            //1st fix : N/A to auto

            //if(h<40) return false;

            Promise.resolve().then(()=>{
                let ytdComments = kRef(wrComments);
                if(!ytdComments)return (enabled=false); // pass to another loadLineFix

                let css = `ytd-expander[should-use-number-of-lines][collapsed] > #content.ytd-expander:not([tabview-webkitbox-linefix])`;

                let nodeList = document.querySelectorAll(css, ytdComments); // proceed for any element required for fixing
                if(!nodeList.length) return false;

                
                //let h = ytdComments.offsetHeight; // expensive but neccessary - re-rendering for visible element only
                //console.log('hhh', h)
                
                //if(h<40) return false;
                
                
                // not required for caching dim

                return nodeList;

            }).then(nodeList=>{
                if(!nodeList)return false;

                if(!enabled)return false;

                //console.log('comments fix')

                enabled = false;

                // set attribute -> re-render -> height change
                // enabled = false to skip the calling

                let promises = [...nodeList].map(elm=>new Promise(resolve=>{
                    elm.setAttribute('tabview-webkitbox-linefix','')  // change from null to ''
                    elm=null;
                    resolve();
                }));

                return Promise.all(promises)


            }).then(results=>{
                if(!results) return false;
                results.length=0;
                enabled = true;
                //delayedFix(); // apply 2nd fix after 100ms
            })

        }

        if(!window.ResizeObserver) return; // this stupid coding only target for modern webkit browsers - edge, chrome, safari, etc.

        const resizeObserver = new ResizeObserver(entries=>{
            if(!enabled)return;
            if(!entries || entries.length!=1) return; //only ytdComments is observed
            let h = entries[0].borderBoxSize; //inexpensive
            //let w = entries[0].contentBoxSize;
            if(h<40) return false;
            let t=tracer('fix_comments_when_added');
            requestAnimationFrame(()=>{  // only active tab
                if(!tracer('fix_comments_when_added',t)) return; // lessen calls
                linefix();
            });
        });
        
        resizeObserver.observe(ytdComments);

    }

    
    /* --------------------------- browser's bug in -webkit-box ----------------------------------------- */




})();
