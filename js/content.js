1&&!(function(){

    /* iframe - css only */

    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if(inIframe())return;

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
    `

    const svgVideos = `<path d="M298,33c0-13.255-10.745-24-24-24H24C10.745,9,0,19.745,0,33v232c0,13.255,10.745,24,24,24h250c13.255,0,24-10.745,24-24V33
    z M91,39h43v34H91V39z M61,259H30v-34h31V259z M61,73H30V39h31V73z M134,259H91v-34h43V259z M123,176.708v-55.417
    c0-8.25,5.868-11.302,12.77-6.783l40.237,26.272c6.902,4.519,6.958,11.914,0.056,16.434l-40.321,26.277
    C128.84,188.011,123,184.958,123,176.708z M207,259h-43v-34h43V259z M207,73h-43V39h43V73z M268,259h-31v-34h31V259z M268,73h-31V39
    h31V73z"/>`

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
    c0.353,0.331,0.53,0.731,0.53,1.196C14.667,6.703,14.49,7.101,14.137,7.429z"/>`

    const svgPlayList = `
    <rect x="0" y="64" width="256" height="42.667"/>
    <rect x="0" y="149.333" width="256" height="42.667"/>
    <rect x="0" y="234.667" width="170.667" height="42.667"/>
    <polygon points="341.333,234.667 341.333,149.333 298.667,149.333 298.667,234.667 213.333,234.667 213.333,277.333 
        298.667,277.333 298.667,362.667 341.333,362.667 341.333,277.333 426.667,277.333 426.667,234.667"/>
        `

    class WeakRefer{

        
        constructor(){

            this.clear();

        }

        deref(){

            return (this._obj1?this._obj1.deref():this._obj2)||null

        }

        set(obj){

            if(obj){
                if(window.WeakRef) this._obj1= new WeakRef(obj);
                else this._obj2=obj;
            }

        }

        clear(){

            this._obj1=null;
            this._obj2=null;

        }

    }

    function isNonEmptyString(s){
        return typeof s=='string'&&s.length>0;
    }


    function nativeFunc(dom, property, args){
        dom.dispatchEvent(new CustomEvent("userscript-call-dom-func", {detail: {property, args}}))
    }


    const LAYOUT_TWO_COLUMNS=1;
    const LAYOUT_THEATER=2;
    const LAYOUT_FULLSCREEN=4;
    const LAYOUT_CHATROOM=8;
    const LAYOUT_CHATROOM_COLLASPED=16;
    const LAYOUT_TAB_EXPANDED = 32;

    let cid_resize_for_layout_change=0;

    function layoutStatusChanged(old_layoutStatus, new_layoutStatus) {


        if(old_layoutStatus === new_layoutStatus) return;

        const cssElm = ytdFlexy.deref();
    
        if (!cssElm) return;
    

        const new_isExpandedChat = !(new_layoutStatus & LAYOUT_CHATROOM_COLLASPED) && (new_layoutStatus & LAYOUT_CHATROOM)
        const new_isCollaspedChat = (new_layoutStatus & LAYOUT_CHATROOM_COLLASPED) && (new_layoutStatus & LAYOUT_CHATROOM)
    
        const new_isTwoColumns = new_layoutStatus & LAYOUT_TWO_COLUMNS;
        const new_isTheater = new_layoutStatus & LAYOUT_THEATER;
        const new_isTabExpanded = new_layoutStatus & LAYOUT_TAB_EXPANDED;
        const new_isFullScreen = new_layoutStatus & LAYOUT_FULLSCREEN;


        if(new_isExpandedChat || new_isTabExpanded){
            if(statusCollasped !== 1) statusCollasped = 1;
        }else{
            if(statusCollasped === 1) statusCollasped = 2;
        }



        function showTabOrChat() {

            layoutStatusMutex.lockWith(unlock => {
    
                if (lastShowTab == '#chatroom') {
    
                    if (new_isTabExpanded) switchTabActivity(null)
                    if (!new_isExpandedChat) ytBtnExpandChat();
    
                } else {
    
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
    
    
                setTimeout(unlock, 40);
    
            })
    
        }

        let changes = 0;

        if(old_layoutStatus !== null )  changes = old_layoutStatus ^ new_layoutStatus;


    
    
        //console.log(7001)
    
    
        let chat_collasped_changed = !!(changes & LAYOUT_CHATROOM_COLLASPED)
        let tab_expanded_changed = !!(changes & LAYOUT_TAB_EXPANDED)
        let theater_mode_changed = !!(changes & LAYOUT_THEATER)
        let column_mode_changed = !!(changes & LAYOUT_TWO_COLUMNS)
        let fullscreen_mode_changed = !!(changes & LAYOUT_FULLSCREEN)
    
 

        let isChatExpandTriggering =  ((chat_collasped_changed && new_isExpandedChat));

        let isChatOrTabExpandTriggering =  (isChatExpandTriggering || (tab_expanded_changed && new_isTabExpanded));


        let requestVideoResize=false;

        if(fullscreen_mode_changed || new_isFullScreen){


        }else if(column_mode_changed && new_isTwoColumns && !new_isTheater && statusCollasped === 1 && new_isTabExpanded && new_isExpandedChat && !chat_collasped_changed && !tab_expanded_changed){

            showTabOrChat();
            requestVideoResize=true;

        }else if (isChatExpandTriggering && new_isTwoColumns && !new_isTheater && statusCollasped === 1 && new_isTabExpanded && !tab_expanded_changed && !column_mode_changed) {
    
            switchTabActivity(null);
            requestVideoResize=true;
    
        } else if ( isChatOrTabExpandTriggering && new_isTwoColumns && new_isTheater && statusCollasped === 1 && !theater_mode_changed && !column_mode_changed ) {
    
            ytBtnCancelTheater();
            requestVideoResize=true;
        
        } else if (new_isTwoColumns && new_isTheater && statusCollasped === 1) {
    
            hideTabAndChat();
            requestVideoResize=true;
    
        } else if (chat_collasped_changed && new_isTwoColumns && !new_isTheater && statusCollasped === 2 && new_isCollaspedChat && !tab_expanded_changed && !column_mode_changed ) {
    
            ytBtnSetTheater();
            requestVideoResize=true;
    
        } else if((column_mode_changed || theater_mode_changed) && new_isTwoColumns && !new_isTheater && statusCollasped !==1  && !chat_collasped_changed && !tab_expanded_changed){
            
            showTabOrChat();
            requestVideoResize=true;
    
        } else if(tab_expanded_changed){

            requestVideoResize=true;

        }

        if(column_mode_changed && !chat_collasped_changed && new_isExpandedChat){

            forceDisplayChatReplay();

        }


        if(requestVideoResize){

            if(cid_resize_for_layout_change) cid_resize_for_layout_change = clearTimeout(cid_resize_for_layout_change);
            cid_resize_for_layout_change=setTimeout(() => {
                cid_resize_for_layout_change=0;
                window.dispatchEvent(new Event('resize'))
             } , 92)
            
        }else{
                
            if (!cid_resize_for_layout_change && (+new Date) - lastResizeAt > 600){
                cid_resize_for_layout_change = setTimeout(() => {
                    cid_resize_for_layout_change=0;
                    if((+new Date) - lastResizeAt > 600) window.dispatchEvent(new Event('resize'));
                }, 62)
            }

        }
    
       
    
    
    
    }


    const $ws={
        _layoutStatus:null,
        layoutStatus_pending:false
    }
    Object.defineProperty($ws, 'layoutStatus', {
        get(){
            return this._layoutStatus;
        },
        set(nv){

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

                    //console.log(1051, old_layoutStatus, new_layoutStatus)

                    layoutStatusChanged(old_layoutStatus, new_layoutStatus);

                    setTimeout(unlock,40)


                })
            }

            this._layoutStatus=nv;

        },
        enumerable:true,
        configurable:true
    })



    const prettyElm = function(elm) {
        if (!elm || !elm.nodeName) return null;
        const eId = elm.id || null;
        const eClsName = elm.className || null;
        return [elm.nodeName.toLowerCase(), typeof eId == 'string' ? "#" + eId : '', typeof eClsName == 'string' ? '.' + eClsName.replace(/\s+/g, '.') : ''].join('').trim();
    }
    function addScript(scriptText) {
        const scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.textContent = scriptText;
        document.documentElement.appendChild(scriptNode);
        return scriptNode;
    }



    const svgElm = (w, h, vw, vh, p) => `<svg width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${p}</svg>`

    let settings = {
        toggleSettings: {
            tabs: 1,
            tInfo: 1,
            tComments: 1,
            tVideos: 1,
        },
        defaultTab: "videos"
    };

    const mtoInterval1=40;
    const mtoInterval2=150;

    const clickInterval1=60;
    const clickInterval2=60;

    let mtoInterval = mtoInterval1;
    let clickInterval=clickInterval1;

    function getAttribute(elm,key){
        return elm?elm.getAttribute(key):null
    }

    function isVideoPlaying(video) {
        return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    }

    function setAttr(elm, attrName, b){

        if(!elm)return;
        if(b) elm.setAttribute(attrName,''); else elm.removeAttribute(attrName);
    }

    function hideTabBtn($tabBtn){
        
        var isActiveBefore = $tabBtn.is('.active')

        $tabBtn.addClass("tab-btn-hidden");
        if (isActiveBefore) {
            setToActiveTab();
        }
    }

    function hasAttribute(obj, key){
        return obj && obj.hasAttribute(key);
    }

    function isTheater(){
        
        const cssElm=ytdFlexy.deref();
        return (cssElm && cssElm.hasAttribute('theater'))
    }

    function isFullScreen(){
        
        const cssElm=ytdFlexy.deref();
        return (cssElm && cssElm.hasAttribute('fullscreen'))

    }

    function isChatExpand(){
        const cssElm=ytdFlexy.deref();
        return cssElm && cssElm.hasAttribute('userscript-chatblock') && !cssElm.hasAttribute('userscript-chat-collapsed')
    }
    function isWideScreenWithTwoColumns(){
        const cssElm=ytdFlexy.deref();
        return (cssElm && cssElm.hasAttribute('is-two-columns_'))
        
    }

    function isAnyActiveTab(){
        return $('#right-tabs .tab-btn.active').length>0
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

    Q.$callOnceAsync=async function(key){
        if (Q[key] && Q[key]() === false) Q[key] = null
    }
    

    function chatFrameElement(cssSelector){
        let iframe = document.querySelector('iframe#chatframe');
        if(!iframe) return null;
        let cDoc = iframe.contentDocument;
        if(!cDoc) return null;
        if(cDoc.readyState  != 'complete') return null; //we must wait for its completion
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

            let relocatedRelated = queryElement.parentNode;

            let right_tabs = document.querySelector('#right-tabs');
            let tab_videos = right_tabs.querySelector("#tab-videos");

            if(!right_tabs || !tab_videos) return;

            for(const s of relocatedRelated.querySelectorAll('#related')){
                s.setAttribute('non-placeholder-videos','')
            }

            let target_container = document.querySelector('ytd-watch-flexy:not([is-two-columns_]) #primary-inner, ytd-watch-flexy[is-two-columns_] #secondary-inner')

            if(target_container) target_container.append(right_tabs) // last-child


            let videos_related = relocatedRelated;
            $('[placeholder-videos]').removeAttr('placeholder-videos');
            $('[placeholder-for-youtube-play-next-queue]').removeAttr('placeholder-for-youtube-play-next-queue');

            tab_videos.appendChild(videos_related);
            let videos_results_renderer = relocatedRelated.querySelector("ytd-watch-next-secondary-results-renderer");
            if(videos_results_renderer) $(videos_results_renderer).attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal);
            $(videos_related).attr('placeholder-for-youtube-play-next-queue','').attr('placeholder-videos','')

            $('[placeholder-videos]').scroll(makeBodyScrollByEvt);




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

    function extractTextContent(elm){
        return elm.textContent.replace(/\s+/g,'').replace(/[^\da-zA-Z\u4E00-\u9FFF\u00C0-\u00FF\u00C0-\u02AF\u1E00-\u1EFF\u0590-\u05FF\u0400-\u052F\u0E00-\u0E7F\u0600-\u06FF\u0750-\u077F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3040-\u30FF\u31F0-\u31FF]/g,'')
    }

    function mtf_fixAutoCompletePosition(elmAutoComplete){

    var injectionScript_fixAutoComplete=function(){

        // https://cdnjs.cloudflare.com/ajax/libs/JavaScript-autoComplete/1.0.4/auto-complete.min.js

        for(const s of document.querySelectorAll('[autocomplete="off"]:not([data-autocomplete-results-id])')){


            let sc = s.sc;
            if(sc instanceof HTMLElement){

                let id=+new Date;
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


        elmAutoComplete.removeEventListener('autocomplete-sc-exist', handlerAutoCompleteExist, false)

        let autoComplete = this;
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

    elmAutoComplete.setAttribute('autocomplete-disable-updatesc','')
    elmAutoComplete.addEventListener('autocomplete-sc-exist',handlerAutoCompleteExist, false)

    addScript(`!!(${injectionScript_fixAutoComplete+''})()`)
    injectionScript_fixAutoComplete=null;



    }

    function mtf_fixTabsAtTheEnd(){
        // if window resize, youtube coding will relocate the element
        // for example, chatroom move before #right-tabs
        // causing difference apperance after resize of window


        if(!scriptEnable)return ;
        const rootElement = Q.mutationTarget || ytdFlexy.deref();
        if(!rootElement) return ;



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

                                let elmVisible=$(autocomplete).is(':visible')

                                if(elmVisible) $(autocomplete).hide(); else  $(autocomplete).show();

                            }

                        },20);

                    })

                    let cid_searchbox_keyup=0;
                    searchBox.addEventListener('keyup',function(){

                        if(cid_searchbox_keyup)return;
                        cid_searchbox_keyup=setTimeout(()=>{
                            cid_searchbox_keyup=0;
                            
                            const autocomplete=document.querySelector(`.autocomplete-suggestions[data-autocomplete-input-id="${ this.getAttribute('data-autocomplete-results-id') }"]`)

                            if(!autocomplete)return;
                            

                            const isNotEmpty = (autocomplete.textContent||'').length>0 && (this.value||'').length >0
                            
                            if( isNotEmpty ){

                                let elmVisible=$(autocomplete).is(':visible')

                                if(!elmVisible) $(autocomplete).show();

                            }

                        },20);

                    })

                }



            }

        }





        
        let currentLastVideo=rootElement.querySelector('[placeholder-videos] #items ytd-compact-video-renderer:last-of-type')
        let prevLastVideo=_cachedLastVideo.deref();

        if(prevLastVideo!==currentLastVideo && currentLastVideo){
            _cachedLastVideo.set(currentLastVideo);
        }
        
        if(prevLastVideo!==currentLastVideo && currentLastVideo && prevLastVideo ){

            let isPrevRemoved= !prevLastVideo.parentNode


            function getVideoListHash(){

                let res = [...document.querySelectorAll('[placeholder-videos] #items ytd-compact-video-renderer')].map(renderer=>{
                    return renderer.querySelector('a[href*="watch"][href*="v="]').getAttribute('href')

                }).join('|')
                // /watch?v=XXXXX|/watch?v=XXXXXX|/watch?v=XXXXXX

    /*

                let elms = document.querySelectorAll('[placeholder-videos] #items ytd-compact-video-renderer')
                
                let res = [...elms].map(elm=>elm.data.videoId||'').join('|') ;
            */


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

    function mtf_ChatExist(){

        if(!scriptEnable)return ;

        // no mutation triggering if the changes are inside the iframe 

        // 1) Detection of #continuations inside iframe
        // iframe ownerDocument is accessible due to same origin
        // if the chatroom is collasped, no determination of live chat or replay (as no #continuations and somehow a blank iframe doc)

        // 2) Detection of meta tag
        // This is fastest but not reliable. It is somehow a bug that the navigation might not update the meta tag content
        
        // 3) Detection of HTMLElement inside video player for live video
        
        // (1)+(3) = solution

        
        const elmChat = document.querySelector('ytd-live-chat-frame#chat')
        let elmCont = null;
        if(elmChat){
            elmCont=chatFrameElement('yt-live-chat-renderer #continuations')
        }
        
        const chatBlockR = (elmChat?1:0)+(elmCont?2:0)
        if(Q.mtf_chatBlockQ!==chatBlockR){

            //console.log(897, Q.mtf_chatBlockQ, chatBlockR)
            Q.mtf_chatBlockQ=chatBlockR

            
            const cssElm = ytdFlexy.deref()
            if(elmChat){

                let s=0;
                if(elmCont){
                    //not found if it is collasped.
                    s |= elmCont.querySelector('yt-timed-continuation')?1:0;
                    s |= elmCont.querySelector('yt-live-chat-replay-continuation, yt-player-seek-continuation')?2:0;
                    //s |= elmCont.querySelector('yt-live-chat-restricted-participation-renderer')?4:0;
                    if(s==1) {
                        cssElm.setAttribute('userscript-chatblock', 'chat-live')
                        //disableComments_LiveChat();
                        requestingComments=null;
                    }
                    if(s==2) cssElm.setAttribute('userscript-chatblock', 'chat-playback')
                    //if(s==5) cssElm.setAttribute('userscript-chatblock', 'chat-live-paid')

                    if(s==1) $("span#tab3-txt-loader").text('');

                }
                //keep unknown as original
                if( !cssElm.hasAttribute) cssElm.setAttribute('userscript-chatblock', '')
            

            }else{
                cssElm.removeAttribute('userscript-chatblock')
                cssElm.removeAttribute('userscript-chat-collapsed')

            }
            

        }
    }




    let lastScrollAt = 0;

    function makeBodyScrollByEvt(){
        // inside marco task (event)

        Promise.resolve().then(()=>window.dispatchEvent(new Event("scroll")))


    }

    function makeBodyScroll() {

        // avoid over triggering scroll event
        if (+new Date - lastScrollAt < 30) return;
        lastScrollAt = +new Date;

        //required for youtube content display

        requestAnimationFrame(()=>{

            window.dispatchEvent(new Event("scroll"));

        })
        


    }

    let requestingComments = null
    let scrollForComments_lastStart = 0;
    let loadingExpiredAt=-1;
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
        let ct = +new Date;
        if(ct - scrollForComments_lastStart < 60) return;
        scrollForComments_lastStart = ct;
        setTimeout(scrollForComments_TF, 80);
        setTimeout(scrollForComments_TF, 240);
        setTimeout(scrollForComments_TF, 870);
        loadingExpiredAt= ct + 900;
    }




    let mtoNav = null;
    let mtoBody = null;


    const mtoVs={}

    let skipMode = null;
    let skipModeExpiredAt = 0;

    function skipModeContent(){

        if(skipMode=='contents' && skipModeExpiredAt>+new Date) {
            skipModeExpiredAt=+new Date + 300;
            return true; // load comments
        }

    }

    function isMtoOverallSkip(dTarget) {

        if(!dTarget || dTarget.nodeType!==1) return true;

        switch(dTarget.id){
            case 'ytp-caption-window-container':
                return true;
            case 'contents':
                return true;
            case 'items':
                return true;
            case 'button':
                return true;
            case 'movie_player':
                return true;
            case 'player-ads':
                return true;
            case 'hover-overlays':
                return true;
            case 'replies':
                return true;
        }

        className = dTarget.className.toLowerCase();
        classNameSplit = className.split(' ');
        for (const c of classNameSplit) {
            switch (c) {
                case 'ytp-panel-menu': // uncertain
                    return true;
                case 'ytp-endscreen-content':
                    return true;
            }
        }


        return false;

        


    }

    function isMtoTargetSkip(mutation) {
        //skip not important mutation tartget

        if (!mutation) return true;
        if (mutation.type != 'childList') return false;
        let target = mutation.target

        if (!target || target.nodeType !== 1) return true;

        let tagName = target.nodeName.toLowerCase();
        let className;
        let classNameSplit;

        switch (tagName) {

            case 'ytd-badge-supported-renderer': // level 5
                return true;
            case 'tp-yt-paper-listbox': // level 5

                if (target.id === 'menu') return true;

                return false;

            case 'tp-yt-paper-tooltip':
                return true;

            case 'yt-img-shadow':

                if (skipModeContent()) return true; // load comments

            case 'ytd-button-renderer':
                if (skipModeContent()) return true; // load comments

            case 'yt-icon-button':
                if (skipModeContent()) return true; // load comments
            case 'ytd-toggle-button-renderer':
                if (skipModeContent()) return true; // load comments

            case 'yt-pdg-comment-chip-renderer':
                if (skipModeContent()) return true; // load comments

            case 'ytd-comment-action-buttons-renderer':
                if (skipModeContent()) return true; // load comments

            case 'ytd-comment-thread-renderer':
                if (skipModeContent()) return true; // load comments

            case 'ytd-thumbnail':
                return true;

            case 'ytd-video-meta-block': // uncertain
                return true;

            case 'ytd-compact-radio-renderer':
                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'ytd-watch-next-secondary-results-renderer': // uncertain
                            return true;
                    }
                }
                return false;

            case 'ytd-compact-video-renderer':
                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'ytd-watch-next-secondary-results-renderer': // uncertain
                            return true;
                    }
                }
                return false;

            case 'yt-interaction':
                if (skipModeContent()) return true; // load comments
                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'extended': // uncertain
                            return true;
                    }
                }
                return false;


            case 'ytd-menu-renderer':
                return true;



            case 'ytd-expander':


                if (target.id == 'expander') {

                    if (skipModeContent()) return true; // load comments


                }

                return false;
            case 'tp-yt-paper-button':

                if (target.id === 'more' && skipModeContent()) return true; // load comments
                if (target.id === 'less' && skipModeContent()) return true; // load comments
                if (target.id === 'button' && skipModeContent()) return true; // load comments

                return false;



            case 'yt-formatted-string':
                return true;
            case 'ytd-thumbnail-overlay-toggle-button-renderer':
                return true;

            case 'ytd-moving-thumbnail-renderer':
                return true;

            case 'yt-icon':
                return true;


            case 'button':
                return true;

            case 'div':

                if (target.id == 'contents') {

                    skipMode = 'contents';
                    skipModeExpiredAt = +new Date + 300;
                    return false;

                }

                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'badge':
                            return true;
                        case 'tp-yt-paper-tooltip':
                            return true;
                        case 'ytp-autonav-endscreen-upnext-header':
                            return true;
                        case 'ytp-bound-time-left':
                            return true;
                        case 'ytp-bound-time-right':
                            return true;
                        case 'ytp-share-icon':
                            return true;
                        case 'ytp-tooltip-title':
                            return true;
                        case 'annotation':
                            return true;
                        case 'ytp-copylink-icon':
                            return true;
                        case 'ytd-thumbnail':
                            return true;
                        case 'paper-ripple':
                            return true;

                        case 'ytd-video-meta-block': //level 5
                            if (target.id === 'metadata-line') return true;
                            return false;

                        case 'captions-text':
                            return true;
                        case 'caption-visual-line':
                            return true;
                        case 'ytp-caption-segment':
                            return true;

                    }
                }


                return false;
            case 'span':


                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'ytp-tooltip-text':
                            return true;
                        case 'ytp-time-current':
                            return true;
                        case 'ytp-offline-slate-buttons':
                            return true;
                        case 'ytp-cards-teaser-label':
                            return true;
                    }
                }
                return false;

            case 'a':

                className = target.className.toLowerCase();
                classNameSplit = className.split(' ');
                for (const c of classNameSplit) {
                    switch (c) {
                        case 'ytp-title-channel-name':
                            return true;
                        case 'ytd-toggle-button-renderer':
                            return true;
                        case 'ytd-button-renderer':
                            return true;

                    }

                }

                return false;
            case 'br':
                return true;
            case 'script':
                return true;
            case 'style':
                return true;
            case 'link':
                return true;

            default:

                if (tagName.indexOf('ytd-thumbnail-') >= 0) return true;
                return false;


        }

        return false;


    }

    function initObserver(){




        // continuous check for element relocation
        function mtf_append_comments() {
            
            if(!scriptEnable)return;
            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return;

            let comments = rootElement.querySelector('#primary ytd-watch-metadata ~ #info ~ ytd-comments#comments');
            if (comments) $(comments).appendTo('#tab-comments').attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)
        }

        // continuous check for element relocation
        function mtf_liveChatBtnF() {
            if(!scriptEnable)return ;
            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return ;

            let button = rootElement.querySelector('ytd-live-chat-frame#chat>.ytd-live-chat-frame#show-hide-button:nth-child(n+2)');
            if (button) button.parentNode.insertBefore(button, button.parentNode.firstChild)
        }


        
        // continuous check for element relocation
        // fired at begining & window resize, etc
        function mtf_append_playlist(){
            
            if(!scriptEnable)return;
            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return ;

            let ple1 = rootElement.querySelector("*:not(#ytd-userscript-playlist)>ytd-playlist-panel-renderer#playlist");
            if(ple1){
                let ct = +new Date;
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

                if(!truePlaylist) truePlaylist = ple1;

                for(const s of document.querySelectorAll(`*:not(#ytd-userscript-playlist)>ytd-playlist-panel-renderer#playlist:not([tabview-true-playlist="${ct}"])`))
                s.parentNode.removeChild(s);

                let $wrapper = getWrapper('ytd-userscript-playlist')
                $wrapper.append(truePlaylist).appendTo(document.querySelector("#tab-list"));
                $(truePlaylist).attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)
                setDisplayedPlaylist();

            }
        }


        // content fix - info & playlist
        // fired at begining, and keep for in case any change
        function mtf_fix_details() {

            if(!scriptEnable)return ;

            if(no_fix_contents_until<+new Date){
                const content = document.querySelector('#meta-contents ytd-expander>#content, #tab-info ytd-expander>#content')
                if (content) {
                    no_fix_contents_until= +new Date +3000;
                    setTimeout(function(){
                        const expander = content.parentNode;

                        if (expander.hasAttribute('collapsed')) setAttr(expander,'collapsed',false);
                        expander.style.setProperty('--ytd-expander-collapsed-height','');

                        let btn1 = expander.querySelector('tp-yt-paper-button#less:not([hidden])');
                        let btn2 = expander.querySelector('tp-yt-paper-button#more:not([hidden])');

                        if (btn1) setAttr(btn1,'hidden',true);
                        if (btn2) setAttr(btn2,'hidden',true);
                    },40);

                }
            }

            if(no_fix_playlist_until<+new Date){
                // just in case the playlist is collapsed
                const playlist = document.querySelector('#tab-list ytd-playlist-panel-renderer#playlist')
                if(playlist){
                    no_fix_playlist_until= +new Date +3000;
                    setTimeout(function(){
                        if(playlist.hasAttribute('collapsed')) setAttr(playlist,'collapsed',false);
                        if(playlist.hasAttribute('collapsible')) setAttr(playlist,'collapsible',false);
                    },40)
                }        
            }


        }



        let mtoNav_requestNo=0;

        let mtoNav_delayedF = () => {
        
            let {addP, removeP, mutationTarget} = Q;
        
            Q.addP = 0;
            Q.removeP = 0;
            

            //console.log(1170,prettyElm(mutationTarget))
            
            let isInvalidAdding = Q.mutationTarget&& !Q.mutationTarget.parentNode

            let promisesForAddition=!scriptEnable?[]:addP > 0 && !isInvalidAdding ?[
                Q.$callOnceAsync('mtf_advancedComments'),
                Q.$callOnceAsync('mtf_checkDescriptionLoaded'),
                Q.$callOnceAsync('mtf_fetchCommentsAvailable'),
                Q.$callOnceAsync('mtf_initalAttr_comments'),
                Q.$callOnceAsync('mtf_initalAttr_playlist'),
                Q.$callOnceAsync('mtf_initalAttr_chatroom'),
                Q.$callOnceAsync('mtf_checkFlexy'),
                Q.$callOnceAsync('mtf_forceCheckLiveVideo'),

                (async () => {
                    mtf_append_comments();
                })(),
        
                (async () => {
                    mtf_liveChatBtnF();
                })(),

                (async ()=>{
                    fixTabs();
                    mtf_fixTabsAtTheEnd();
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

                mtoNav_requestNo--;
                //console.log('motnav reduced to', mtoNav_requestNo)
                if(mtoNav_requestNo>0){
                    mtoNav_requestNo=1;
                    setTimeout(mtoNav_delayedF,mtoInterval);
                }
            })
        
        
        }

        Q.addP=0;
        Q.removeP=0; 
        Q.mutationTarget = null;
        let hReqNo=0;
        //let aaa = +new Date + 5000;
        const mtoNavF=(mutations, observer) => {
            
        if(!scriptEnable)return;

            let ch = false;

            let reg = [];
            let dTarget =null;

            let wAddP=0,wRemoveP=0;

            for (const mutation of mutations) {
                if(!mutation || !mutation.target || !mutation.target.parentNode) continue;
                if(isMtoTargetSkip(mutation))continue;
                reg.push(mutation);

                if(dTarget===null) dTarget=mutation.target;
                else if(dTarget===true){}
                else if(dTarget.contains(mutation.target)){}
                else {dTarget=true;}

                for (const addedNode of mutation.addedNodes)
                    if (addedNode.nodeType === 1) {
                        wAddP++;
                        ch = true;
                    }
                for (const removedNode of mutation.removedNodes)
                    if (removedNode.nodeType === 1) {
                        wRemoveP++;
                        ch = true;
                    }
            }


            
            if (!ch) return;

            
            if(dTarget===true) dTarget=ytdFlexy.deref();

            if(isMtoOverallSkip(dTarget)) return;


            Q.addP+=wAddP;
            Q.removeP+=wRemoveP;


            if(Q.mutationTarget===null) Q.mutationTarget=dTarget;
            else if(Q.mutationTarget!=dTarget) Q.mutationTarget = ytdFlexy.deref();


            //console.log(prettyElm(dTarget), wAddP , wRemoveP)
            //console.log(prettyElm(dTarget), reg.map(m=>prettyElm(m.target)))


            mtoNav_requestNo++;
            hReqNo++;
            /*
            if(hReqNo==36) {
                mtoInterval=mtoInterval2;
                clickInterval=clickInterval2;
            }*/
            //console.log('motnav added to', mtoNav_requestNo)

            if(mtoNav_requestNo==1) setTimeout(mtoNav_delayedF,mtoInterval);

        }
        mtoNav = new MutationObserver(mtoNavF);
        mtoNav.observe(ytdFlexy.deref(), {
            subtree: true,
            childList: true,
            attributes: false
        })

        1;1&&(async()=>{
            Q.addP=1; //fake the function
            mtoNav_requestNo++;
            if(mtoNav_requestNo==1) mtoNav_delayedF();

        })();


        if(mtoBody){
        mtoBody = null;
        }

        function mtoBodyF(mutations, observer){
            if(!scriptEnable)return;


            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes)
                    if (addedNode.nodeType === 1) {
                        if(addedNode.nodeName=="DIV" && addedNode.className.indexOf('autocomplete-suggestions')>=0){
                            mtf_fixAutoCompletePosition(addedNode)
                        }
                    }
            }



        }

        mtoBody = new MutationObserver(mtoBodyF);
        mtoBody.observe(document.querySelector('body'), {
            childList: true,
            subtree: false,
            attributes: false
        })


    }

    const displayedPlaylist=new WeakRefer();
    const scrollingVideosList=new WeakRefer();

    let scriptEnable =false;
    let lastShowTab = null;


    let _cachedLastVideo=new WeakRefer();
    let videoListBeforeSearch=null;
    let no_fix_contents_until = 0;
    let no_fix_playlist_until = 0;
    let statusCollasped = 0;
    function resetBeforeNav() {


        if(cid_disableComments>0) cid_disableComments=clearTimeout(cid_disableComments);

        videoListBeforeSearch=null;
        statusCollasped=0;
        _cachedLastVideo.clear();
        lastShowTab=null;
        displayedPlaylist.clear();
        scrollingVideosList.clear();
        scriptEnable =false;
        ytdFlexy.clear();
        $ws.layoutStatus=null;

        clearMutationObserver(mtoVs,'mtoVisibility_Playlist')
        clearMutationObserver(mtoVs,'mtoVisibility_Comments')
        clearMutationObserver(mtoVs,'mtoVisibility_Chatroom')
        clearMutationObserver(mtoVs,'mtoFlexyAttr')

        if (mtoBody) {
            mtoBody.takeRecords();
            mtoBody.disconnect();
            mtoBody = null;
        }
        if (mtoNav) {
            mtoNav.takeRecords();
            mtoNav.disconnect();
            mtoNav = null;

            Q.mtf_advancedComments=null;
            Q.mtf_checkDescriptionLoaded = null;
            Q.mtf_fetchCommentsAvailable = null;
            Q.mtf_initalAttr_comments = null;
            Q.mtf_initalAttr_playlist = null;
            Q.mtf_initalAttr_chatroom = null;
            Q.mtf_forceCheckLiveVideo=null;
            Q.mtf_chatBlockQ = null;
        }

        mtoInterval = mtoInterval1;
        clickInterval = clickInterval1;



        

    }

    let ytdFlexy=new WeakRefer();
    let cid_disableComments=0;
    let lastAction = {action:null, time:0};
    function resetAtNav() {

        scriptEnable =true;

        no_fix_contents_until = 0;
        no_fix_playlist_until = 0;

        ytdFlexy.set(document.querySelector('ytd-watch-flexy'))

        

        $(ytdFlexy.deref()).removeAttr("userscript-chatblock").removeAttr("userscript-chat-collapsed").removeAttr('tabview-youtube-comments-loaded');
        $('span#tab3-txt-loader').text('');

        //removed any cache of #comments header (i.e. count message)
        var prevCommentsHeader = document.querySelector('ytd-comments#comments ytd-comments-header-renderer');
        if (prevCommentsHeader) prevCommentsHeader.parentNode.removeChild(prevCommentsHeader);

        var prevCommentsMsg= document.querySelector('ytd-item-section-renderer#sections #header ~ #contents>ytd-message-renderer:only-child');
        if (prevCommentsMsg) prevCommentsMsg.parentNode.removeChild(prevCommentsMsg);

        //force to [hidden]
        var prevComemnts = document.querySelector('ytd-comments#comments'); 
        if (prevComemnts) {
            setAttr(prevComemnts, 'hidden', true);
            requestingComments = prevComemnts;
            scrollForComments();
        }


        

    }

    function getTabsHTML(){


        let ts = settings.toggleSettings;

        if (!ts.tabs) return;

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
            ts.tInfo ? `<a id="tab-btn1" data-name="info" userscript-tab-content="#tab-info" class="tab-btn">${sTabBtnInfo}${str1}</a>` : '',
            `<a id="tab-btn2" userscript-tab-content="#tab-live" class="tab-btn tab-btn-hidden">Chat${str1}</a>`,
            ts.tComments ? `<a id="tab-btn3" userscript-tab-content="#tab-comments" data-name="comments" class="tab-btn">${svgElm(16,16,60,60,svgComments)}<span id="tab3-txt-loader"></span>${str1}</a>` : '',
            ts.tVideos ? `<a id="tab-btn4" userscript-tab-content="#tab-videos" data-name="videos" class="tab-btn">${sTabBtnVideos}${str1}</a>` : '',
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

    
    function ij1(){


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

    function onNavigationEnd() {


        resetBeforeNav();
        if(!/https?\:\/\/(\w+\.)*youtube\.com\/watch\?(\w+\=[^\/\?\&]+\&)*v=[\w\-\_]+/.test(window.location.href))return;


        if(!document.querySelector('script#userscript-tabview-injection-1')) {
            addScript(`(${ij1+""})()`).id='userscript-tabview-injection-1'
        }

        resetAtNav();

        let findCount=10;
        function findRelated(){
            let related = ytdFlexy.deref().querySelector("#related");
            if(related) return foundRelated(related);
            if(--findCount) return setTimeout(findRelated,100);
            throw 'Please report the userscript is not able to use.'
        }
        findRelated();

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

    function setToActiveTab() {
        if(isTheater() && isWideScreenWithTwoColumns())return;
        const jElm = document.querySelector(`a[userscript-tab-content="${switchTabActivity_lastTab}"]:not(.tab-btn-hidden)`) ||
            document.querySelector(`a[userscript-tab-content="#tab-${settings.defaultTab}"]:not(.tab-btn-hidden)`) ||
            document.querySelector("a[userscript-tab-content]:not(.tab-btn-hidden)") ||
            null;
        switchTabActivity(jElm);
        return !!jElm;
    }

    function insertBefore(elm, p) {
        if (elm && p && p.parentNode)
            p.parentNode.insertBefore(elm, p);
    }

    function getWrapper(wrapperId){
        let $wrapper = $(`#${wrapperId}`);
        if(!$wrapper[0]) $wrapper=$(`<div id="${wrapperId}"></div>`)
        return $wrapper;
    }

    function runAfterTabAppended() {

        document.documentElement.setAttribute('plugin-tabview-youtube','')

        fixTabs();

        // just switch to the default tab
        setToActiveTab();

        // append the next videos 
        // it exists as "related" is already here




        prepareTabBtn();

        
        // append the detailed meta contents to the tab-info
        Q.mtf_checkDescriptionLoaded = () => {
            
            
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            const expander = document.querySelector("#meta-contents ytd-expander");
            if (!expander) return true;
            $(expander).appendTo("#tab-info").attr('data-dom-changed-by-tabview-youtube',scriptVersionForExternal)

            const avatar = document.querySelector('#meta-contents yt-img-shadow#avatar');
            if(avatar) hackImgShadow(avatar)
            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_checkDescriptionLoaded')

        // force window scroll when #continuations is first detected and #comments still [hidden]
        Q.mtf_advancedComments = () => {
            
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;
            const continuations = document.querySelector("ytd-comments#comments #continuations");
            if (!continuations) return true;
            requestingComments = document.querySelector('ytd-comments#comments');
            scrollForComments();
            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_advancedComments')


        // use video player's element to detect the live-chat situation (no commenting section)
        // this would be very useful if the live chat is collapsed, i.e. iframe has no indication on the where it is live or replay
        
        Q.mtf_forceCheckLiveVideo_tf =()=>{

            
            const cssElm = ytdFlexy.deref()
            if(!cssElm) return;
            if($(document.querySelector('#ytd-player .ytp-time-display')).is('.ytp-live')) {
                cssElm.setAttribute('userscript-chatblock', 'chat-live')
                //disableComments_LiveChat();
                requestingComments=null;
            }
        }
        Q.mtf_forceCheckLiveVideo = () => {
            if(!scriptEnable)return true;
            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            const playerLabel = document.querySelector('#ytd-player .ytp-time-display') && document.querySelector('ytd-live-chat-frame#chat')
            if (!playerLabel) return true;
            setTimeout(Q.mtf_forceCheckLiveVideo_tf,170)
            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_forceCheckLiveVideo')



        createAttributeObservants();
        checkChatStatus();


        let scroll_last=0;
        document.querySelector("#right-tabs .tab-content").addEventListener('scroll', function(){

            let ct = +new Date;
            if(ct - scroll_last > 30) {
                scroll_last=ct;
                makeBodyScrollByEvt();
            }

        },true);

    }


    commentsScrollToTop = false;
    async function asyncFetchCommentsAvailable() {

        let span = document.querySelector("span#tab3-txt-loader")
        if (!span) return;

        makeBodyScroll();
        let fetchedOnce = false


        function finish(){
            commentsScrollToTop = true;
            ytdFlexy.deref().setAttribute('tabview-youtube-comments-loaded','loaded')
        }

        Q.mtf_fetchCommentsAvailable = () => {

            if(!scriptEnable)return true;

            
            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            let messageElm, messageStr, commentRenderer;
            if (commentRenderer = rootElement.querySelector("ytd-comments#comments #count.ytd-comments-header-renderer")) {
                fetchedOnce=true;
                let r = '0';
                let txt = commentRenderer.textContent
                if (typeof txt == 'string') {
                    let m = txt.match(/[\d\,\s]+/)
                    if (m) {
                        r = m[0].trim()
                        

                        //keep reading comments after changing videos
                        requestAnimationFrame(()=>{
                            if( switchTabActivity_lastTab =='#tab-comments' && (ytdFlexy.deref().getAttribute('tabview-selection')+'').indexOf('#tab-')===0) setToActiveTab();
                        })
                    }
                }
                span.textContent = r;
                mtoInterval=mtoInterval2;
                clickInterval=clickInterval2;
                finish();
                return false;
            }else if((messageElm = rootElement.querySelector('ytd-item-section-renderer#sections #header ~ #contents>ytd-message-renderer:only-child'))&&(messageStr=(messageElm.textContent||'').trim())){ //ytd-message-renderer
                
                // it is possible to get the message before the header generation.
                setTimeout(function(){
                    if(fetchedOnce)return;
                    const mainMsg= messageElm.querySelector('#message, #submessage')
                    if(mainMsg && mainMsg.textContent){
                        for(const msg of mainMsg.querySelectorAll('*:not(:empty)')){
                            if(msg.childElementCount===0 && msg.textContent) {
                                messageStr=msg.textContent.trim()
                                break
                            }
                        } 
                    }
                    span.textContent = messageStr;
                    mtoInterval=mtoInterval2;
                    clickInterval=clickInterval2;
                },240);
                finish();
                return false;
            }else{
                return true;

            }
        
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_fetchCommentsAvailable')


    }


    function disableComments_LiveChat(){

        if(!scriptEnable)return;
        let cssElm=ytdFlexy.deref();
        if(!cssElm)return;

        cssElm.setAttribute('tabview-youtube-comments-loaded','disabled');
        Q.mtf_fetchCommentsAvailable = null;   

    }

    function disableComments_General(){

        if(!cid_disableComments) return;
        cid_disableComments=0;

        if(!scriptEnable)return;
        let cssElm=ytdFlexy.deref();
        if(!cssElm)return;


        let t = loadingExpiredAt - new Date;  // normal case : -100

        new Promise(resolve=>{

            if(t>0) setTimeout(resolve, t+100);
            else requestAnimationFrame(resolve);

        }).then(()=>{

            let comments = document.querySelector('ytd-comments#comments')

            if(!comments || (comments.childElementCount === 0 && comments.hasAttribute('hidden'))){

                cssElm.setAttribute('tabview-youtube-comments-loaded','disabled');
                Q.mtf_fetchCommentsAvailable = null;

            }
        })

        

    }

    function createAttributeObservants() {


        // Attr Mutation Observer - #playlist - hidden
        clearMutationObserver(mtoVs,'mtoVisibility_Playlist')
        // Attr Mutation Observer callback - #playlist - hidden
        let mtf_attrPlaylist=(mutations, observer)=>{

            if(!scriptEnable)return;

            var playlist=document.querySelector('ytd-playlist-panel-renderer#playlist')
            const $tabBtn = $('[userscript-tab-content="#tab-list"]');
            //console.log(3712,$tabBtn)
            //console.log('attr playlist changed')
            if( $tabBtn.is('.tab-btn-hidden') && !playlist.hasAttribute('hidden') ){
                //console.log(3713)
                //console.log('attr playlist changed - no hide')
                $tabBtn.removeClass("tab-btn-hidden");
            }else if( !$tabBtn.is('.tab-btn-hidden') && playlist.hasAttribute('hidden') ){
                //console.log(3714)
                //console.log('attr playlist changed - add hide')
                hideTabBtn($tabBtn);
            }
        }

        // pending for #playlist and set Attribute Observer
        Q.mtf_initalAttr_playlist=()=>{
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            var playlist=rootElement.querySelector('ytd-playlist-panel-renderer#playlist')
            if(!playlist) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Playlist', mtf_attrPlaylist)
            mtoVs.mtoVisibility_Playlist.observe(playlist, {          
                attributes: true,
                attributeFilter: ['hidden'],
                attributeOldValue: true
            })
            //console.log(3711)
            mtf_attrPlaylist()
            return false;
        }
        //console.log(3710)
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_initalAttr_playlist')





        // Attr Mutation Observer - ytd-comments#comments - hidden
        
        clearMutationObserver(mtoVs,'mtoVisibility_Comments')
        // Attr Mutation Observer callback - ytd-comments#comments - hidden


        let cid_attrComments=0;

        let mtf_attrComments=(mutations, observer)=>{

            if(!scriptEnable)return;

            var comments=document.querySelector('ytd-comments#comments')
            const $tabBtn = $('[userscript-tab-content="#tab-comments"]');
            if(!comments || !$tabBtn[0])return;
            let isCommentHidden = comments.hasAttribute('hidden')
            //console.log('attr comments changed')
            if( !isCommentHidden ){

                if(cid_attrComments) cid_attrComments=clearTimeout(cid_attrComments);

                if(cid_disableComments>0) cid_disableComments=clearTimeout(cid_disableComments);
                requestingComments=null;

                mtoInterval=mtoInterval1;
                clickInterval=clickInterval1;

                //console.log('attr comments changed - no hide')

                if($tabBtn.is('.tab-btn-hidden')) $tabBtn.removeClass("tab-btn-hidden");
                if(ytdFlexy.deref().getAttribute('tabview-youtube-comments-loaded')=='disabled')  ytdFlexy.deref().removeAttribute('tabview-youtube-comments-loaded')
                asyncFetchCommentsAvailable();

                //setTimeout(()=>nativeFunc(comments, "loadComments"),20)
                
                setTimeout(()=>nativeFunc(comments, "loadComments"),20)


            }else if( isCommentHidden ){


                if(cid_attrComments) cid_attrComments=clearTimeout(cid_attrComments);
                cid_attrComments=setTimeout(function(){

                    cid_attrComments=0;

                    mtoInterval=mtoInterval2;
                    clickInterval=clickInterval2;
                    if(!$tabBtn.is('.tab-btn-hidden')) hideTabBtn($tabBtn);
                    //console.log('attr comments changed - add hide')
                    if(!document.querySelector('[userscript-chatblock="chat-live"]')){
                        requestingComments=comments
                    } 
                    $('span#tab3-txt-loader').text('');
                    if(loadingExpiredAt<0) loadingExpiredAt = +new Date + 2600;
                    let t = loadingExpiredAt - +new Date;
                    if(t<0) t=0;
                    cid_disableComments = setTimeout(disableComments_General, t + 100); //1.3 + 1.3 + 0.1

                },80);
                
            }        
        }

        // pending for #comments and set Attribute Observer
        Q.mtf_initalAttr_comments=()=>{
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            var comments=rootElement.querySelector('ytd-comments#comments')
            if(!comments) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Comments',mtf_attrComments)
            mtoVs.mtoVisibility_Comments.observe(comments, {          
                attributes: true,
                attributeFilter: ['hidden'],
                attributeOldValue: true
            })
            mtf_attrComments()
            requestingComments = comments;
            //scrollForComments()
            setTimeout(()=>nativeFunc(comments, "loadComments"),20)
            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_initalAttr_comments')

    }


    function isEmptyBody(){
        //only deal with loaded document without body
        //other situation, case by case

        let iframe = document.querySelector('ytd-live-chat-frame iframe#chatframe');

        if(!iframe) return false; //iframe must be there

        if(iframe.readyState  != 'complete') return false; //we must wait for its completion

        let doc = null;
        try{

            doc=iframe.contentDocument

        }catch(e){}

        if(!doc) return false; //might be not loaded yet

        if(doc.body && doc.body.childElementCount===0){
            //empty body

            return true;
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

    let layoutStatusMutex=new Mutex();

    function forceDisplayChatReplay(){
        
        let ytd_player = document.querySelector('ytd-player#ytd-player'); 
        if(!ytd_player)return;
        let videoElm = ytd_player.querySelector('video'); 
        if(!videoElm)return;

        let video=videoElm;

        let expiredAt = +new Date + 20000; // 20s
        let tf=()=>{
            if(+new Date > expiredAt) return;
            let items=chatFrameElement('yt-live-chat-item-list-renderer #items')

            if(!items) return setTimeout(tf,100)

            if(items.childElementCount!==0)return;

            if(videoElm && video.paused && video.currentTime > 0 && !video.ended && video.readyState > video.HAVE_CURRENT_DATA){


                let chat = document.querySelector('ytd-live-chat-frame#chat');
                if(chat){
                
                    nativeFunc(chat, "postToContentWindow", [{"yt-player-video-progress":videoElm.currentTime}])
                }

            }
        }
        setTimeout(tf,100)
        


    }


    function checkChatStatus(){
        
        
        clearMutationObserver(mtoVs,'mtoVisibility_Chatroom')

        let cid_chatFrameCheck=0;

        let mtf_attrChatroom=(mutations, observer)=>{
            if(!scriptEnable)return;

            if(+new Date - lastAction.time > 100){
                lastAction.action='#chatroom';
                lastAction.time=+new Date;
                }else{
                    lastAction.time=+new Date;
                }



            layoutStatusMutex.lockWith(unlock=>{

                const chatBlock = document.querySelector('ytd-live-chat-frame#chat')
                const cssElm = ytdFlexy.deref()


                
                if(!cssElm.hasAttribute('userscript-chatblock')) setAttr(cssElm, 'userscript-chatblock', true);
                setAttr(cssElm,'userscript-chat-collapsed',!!chatBlock.hasAttribute('collapsed'));

                if(cssElm.hasAttribute('userscript-chatblock')&&!chatBlock.hasAttribute('collapsed')) lastShowTab='#chatroom'


                if(!chatBlock.hasAttribute('collapsed') &&  document.querySelector('#right-tabs .tab-btn.active') && isWideScreenWithTwoColumns() && !isTheater()  ){

                    switchTabActivity(null);
        
                    setTimeout(unlock,40)

                } else{

                    unlock()
                }

                if(!chatBlock.hasAttribute('collapsed')) forceDisplayChatReplay();        

        
                if( chatBlock && cssElm && cssElm.hasAttribute('userscript-chatblock') && !chatBlock.hasAttribute('collapsed') && !cid_chatFrameCheck){
                    let dd=+new Date;
                    cid_chatFrameCheck=setInterval(()=>{
                        // mutation on iframe window would not trigger the observer
                        // just check the first few seconds for this purpose.
                        let chatFrameChecking;
                        if(+new Date - dd>6750){
                            //
                        }else if( isEmptyBody() ){
        
                            // bug. youtube iframe loaded with nothing
        
                            let button = document.querySelector('ytd-live-chat-frame#chat>.ytd-live-chat-frame#show-hide-button ytd-toggle-button-renderer')
                            if (button) {
                                setTimeout(function(){
                                    if(button && button.parentNode && isChatExpand()){
                                        button.click();
                                        setTimeout(function(){
                                            if(button && button.parentNode && !isChatExpand()) button.click();
                                            button=null;
                                        },80)
                                    }else{
                                        button=null;
                                    }
                                },20)
                            } 
        
                        
                        }else if(chatFrameChecking=!!chatFrameElement('yt-live-chat-renderer #continuations')){
                            mtf_ChatExist();
                            $(document.querySelector('ytd-live-chat-frame#chat')).attr('yt-userscript-iframe-loaded','')
                        }else{
                            return;
                        }
                        return (cid_chatFrameCheck=clearInterval(cid_chatFrameCheck));
                    },270)
                }else if(chatBlock){
                    chatBlock.removeAttribute('yt-userscript-iframe-loaded')
        
                }



            })




        }

        Q.mtf_initalAttr_chatroom=()=>{
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            var chatroom=rootElement.querySelector('ytd-live-chat-frame#chat')
            if(!chatroom) return true;
            initMutationObserver(mtoVs,'mtoVisibility_Chatroom',mtf_attrChatroom)
            mtoVs.mtoVisibility_Chatroom.observe(chatroom, {          
                attributes: true,
                attributeFilter: ['collapsed'],
                attributeOldValue: true
            })
            mtf_attrChatroom()
            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_initalAttr_chatroom')





        clearMutationObserver(mtoVs,'mtoFlexyAttr')


        function toogleAttribute(mFlag, b, flag){


                            if(b) mFlag = mFlag | flag; 
                            else mFlag = mFlag & ~flag;

                            return mFlag;


        }


        function toLayoutStatus(nls, attributeName){

            let attrElm, b; 
            switch(attributeName){
                case 'theater': 
                nls = toogleAttribute(nls, isTheater(), LAYOUT_THEATER);
                break;
                case 'userscript-chat-collapsed': 
                case 'userscript-chatblock':
                    attrElm=ytdFlexy.deref();
                    if(hasAttribute(attrElm, 'userscript-chat-collapsed')) {
                        nls = toogleAttribute(nls, true, LAYOUT_CHATROOM | LAYOUT_CHATROOM_COLLASPED);
                    }else{
                        nls = toogleAttribute(nls, hasAttribute(attrElm, 'userscript-chatblock'), LAYOUT_CHATROOM);
                        nls = toogleAttribute(nls, false, LAYOUT_CHATROOM_COLLASPED);
                    }
                break;
                case 'is-two-columns_': 
                nls = toogleAttribute(nls, isWideScreenWithTwoColumns(), LAYOUT_TWO_COLUMNS);
                break;

                case 'tabview-selection': 
                b = isNonEmptyString( getAttribute(ytdFlexy.deref(),'tabview-selection') );
                nls = toogleAttribute(nls,  b, LAYOUT_TAB_EXPANDED);
                break;

                case 'fullscreen': 
                b = isNonEmptyString( getAttribute(ytdFlexy.deref(),'fullscreen') );
                nls = toogleAttribute(nls, b, LAYOUT_FULLSCREEN);
                break;

            }

            return nls;


        }

        let mtf_attrFlexy=(mutations, observer)=>{
            
        if(!scriptEnable)return;


            const cssElm=ytdFlexy.deref()
            if(!cssElm)return;

            if(!mutations)return;

            const old_layoutStatus = $ws.layoutStatus
            if(old_layoutStatus === null) return;
            let new_layoutStatus = old_layoutStatus;
        
            for(const mutation of mutations) {
                new_layoutStatus=toLayoutStatus(new_layoutStatus, mutation.attributeName);
                if (mutation.attributeName == 'userscript-chat-collapsed' || mutation.attributeName == 'userscript-chatblock'){

                    if( cssElm.getAttribute('userscript-chatblock')==='chat-live' ){
                            disableComments_LiveChat();
                    }

                    if(!cssElm.hasAttribute('userscript-chatblock')){
                        setTimeout(()=>{
                            if(!isAnyActiveTab() && !isChatExpand() && !isTheater() && isWideScreenWithTwoColumns() && !isFullScreen()){
                                setToActiveTab();
                            }
                        },240);
                    }

                }
            }


            if(new_layoutStatus!==old_layoutStatus)  $ws.layoutStatus = new_layoutStatus




        }


        Q.mtf_checkFlexy=()=>{
            if(!scriptEnable)return true;

            const rootElement = Q.mutationTarget || ytdFlexy.deref();
            if(!rootElement) return true;

            var flexy=ytdFlexy.deref()
            if(!flexy) return true;

            $ws.layoutStatus=null;


            let ls = 0;
            ls=toLayoutStatus(ls,'theater')
            ls=toLayoutStatus(ls,'userscript-chat-collapsed')
            ls=toLayoutStatus(ls,'userscript-chatblock')
            ls=toLayoutStatus(ls,'is-two-columns_')
            ls=toLayoutStatus(ls,'tabview-selection')
            ls=toLayoutStatus(ls,'fullscreen')

            $ws.layoutStatus=ls

            initMutationObserver(mtoVs,'mtoFlexyAttr',mtf_attrFlexy)
            mtoVs.mtoFlexyAttr.observe(flexy, {          
                attributes: true,
                attributeFilter: ['userscript-chat-collapsed','userscript-chatblock','theater','is-two-columns_','tabview-selection','fullscreen'],
                attributeOldValue: true
            })


            let columns = document.querySelector('ytd-page-manager#page-manager #columns')
            if(columns){
                setAttr(columns, 'userscript-scrollbar-render', true);
            }

            return false;
        }
        if(Q.mutationTarget===null)
        Q.$callOnceAsync('mtf_checkFlexy')



    }




    let switchTabActivity_lastTab = null

    function setDisplayedPlaylist(){
        //override the default youtube coding event prevention
        displayedPlaylist.set($('ytd-watch-flexy #tab-list:not(.tab-content-hidden) ytd-playlist-panel-renderer')[0] || null);
        if(!!displayedPlaylist.deref()) $(ytdFlexy.deref()).attr('userscript-auto-scroll-playlist',''); 
        else $(ytdFlexy.deref()).removeAttr('userscript-auto-scroll-playlist');


    }

    function switchTabActivity(activeLink) {
        if(!scriptEnable)return;
 
        const ytdFlexyElm=ytdFlexy.deref();
 
        if(!ytdFlexyElm) return;
 
        if (activeLink && $(activeLink).is('.tab-btn-hidden')) return; // not allow to switch to hide tab
 
        if(isTheater() && isWideScreenWithTwoColumns()) activeLink=null;
 
        const links = document.querySelectorAll('#material-tabs a[userscript-tab-content]');
 
 
 
        function runAtEnd(){
 
 
            if(activeLink) lastShowTab=activeLink.getAttribute('userscript-tab-content')
 
            displayedPlaylist.clear();
            scrollingVideosList.clear();
 
            if(activeLink && lastShowTab == '#tab-list'){
                setDisplayedPlaylist();
            }else if(activeLink && lastShowTab == '#tab-videos'){
                scrollingVideosList.set(document.querySelector('ytd-watch-flexy #tab-videos:not(.tab-content-hidden) [placeholder-videos]'));
            }

        
            ytdFlexyElm.setAttribute('tabview-selection',activeLink?lastShowTab:'')
            
            if(lastShowTab == '#tab-comments' && commentsScrollToTop){
                commentsScrollToTop=false;
                    requestAnimationFrame(()=>{
                    let comments_tab=document.querySelector('#tab-comments');
                    if(comments_tab && comments_tab.scrollTop>0) comments_tab.scrollTop=0;
                });
            }
            
        }
 
        displayedPlaylist.clear();
 
        for (const link of links) {
            let content = document.querySelector(link.getAttribute('userscript-tab-content'));
            if (link && content) {
                if (link !== activeLink) {
                    $(link).removeClass("active");
                    $(content).addClass("tab-content-hidden");
                } else {
                    $(link).addClass("active");
                    $(content).removeClass("tab-content-hidden");
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

                if (!this.hasAttribute('userscript-tab-content')) return;

                if(+new Date - lastAction.time > 100){
                    lastAction.action=this.getAttribute('userscript-tab-content');
                    lastAction.time=+new Date;
                }else{
                    lastAction.time=+new Date;
                }

                evt.preventDefault();

                new Promise(requestAnimationFrame).then(() => {


                    layoutStatusMutex.lockWith(unlock=>{

                        switchTabActivity_lastTab = this.getAttribute('userscript-tab-content');
    
                        if( isWideScreenWithTwoColumns() && !isTheater() && $(this).is(".tab-btn.active:not(.tab-btn-hidden)")){
                            setTimeout(unlock,80);
                            switchTabActivity(null);
                            ytBtnSetTheater();
                        }else if($(this).is(".tab-btn.active:not(.tab-btn-hidden)")){
                            setTimeout(unlock,80);
                            switchTabActivity(null);
                        }else{
                            let pInterval = 20;
                            if(isChatExpand() && isWideScreenWithTwoColumns()) {
                                ytBtnCollapseChat();
                                pInterval+=40;
                            }else if(isWideScreenWithTwoColumns() && isTheater() && !isFullScreen() ){
                                ytBtnCancelTheater();
                                pInterval+=40;
                            }
                            setTimeout(()=>{
                                setTimeout(makeBodyScroll,20); // this is to make the image render
    
                                setTimeout(()=>{
                                    let rightTabs=document.querySelector('#right-tabs');
                                    if(!isWideScreenWithTwoColumns() && rightTabs && rightTabs.offsetTop>0 && $(this).is('.active')){
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

    const singleColumnScrolling = (function() {
        var lastD = 0,
            lastF = 0;

        return function() {
            let pageY = pageYOffset;
            if (pageY < 10 && lastD === 0 && !lastF) return;

            let targetElm, header, navElm;

            Promise.resolve().then(() => {

                targetElm = document.querySelector("#right-tabs");
                if (!targetElm) return;
                header = targetElm.querySelector("header");
                if (!header) return;
                navElm = document.querySelector('#masthead-container, #masthead')
                if (!navElm) return;
                navHeight = navElm ? navElm.offsetHeight : 0

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

                if ((xyStatus == 2 || xyStatus == 3) && (lastD === 0 || lastF)) {
                    lastD = 1;
                    let {
                        offsetHeight
                    } = header
                    let {
                        offsetWidth
                    } = targetElm

                    targetElm.style.setProperty("--userscript-sticky-width", offsetWidth + 'px')
                    targetElm.style.setProperty("--userscript-sticky", offsetHeight + 'px')
                    
                    setAttr(targetElm, 'userscript-sticky', true);

                } else if ((xyStatus == 1) && (lastD === 1 || lastF)) {
                    lastD = 0;

                    setAttr(targetElm, 'userscript-sticky', false);
                }


                targetElm = null;
                header = null;
                navElm = null;

            })

        }
    })();

    window.addEventListener("scroll", function() {
        if(!scriptEnable)return;
        singleColumnScrolling()
    }, {
        capture: false,
        passive: true
    })

    var lastResizeAt=0;
    window.addEventListener('resize', function() {
        if(!scriptEnable)return;
        lastResizeAt= +new Date;

        requestAnimationFrame(() => {
            lastF = 1;
            singleColumnScrolling()
            lastF = 0;
        })

    }, {
        capture: false,
        passive: true
    })

    window.addEventListener('beforeunload', function() {
        if(!scriptEnable)return;
        console.log('beforeunload')
        resetBeforeNav();
        let video=document.querySelector('video');
        if(video && !video.paused) video.pause(); 
    }, {capture: true})

    window.addEventListener('hashchange', function() { 
        if(!scriptEnable)return;
        console.log('hashchange')
        resetBeforeNav();
    }, {capture: true})
    
    window.addEventListener('popstate', function() { 
        if(!scriptEnable)return;
        console.log('popstate')
        resetBeforeNav();
    }, {capture: true})


    function clearMutationObserver(o, key){
        if(o[key]) {
            o[key].takeRecords();
            o[key].disconnect();
            o[key]=null;
        }
    }

    function initMutationObserver(o, key, callback){


        clearMutationObserver(o,key)
        o[key]=new MutationObserver(callback)



    }

    document.addEventListener('wheel',function(evt){
        
        if(!scriptEnable)return;
        const displayedPlaylist_element = displayedPlaylist.deref();
        if(displayedPlaylist_element && displayedPlaylist_element.contains(evt.target)){
        evt.stopPropagation(); evt.stopImmediatePropagation()
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

            res.m1=$(cssSelector1)[0]
        if(bool) $(res.m1).attr('is-two-columns',''); else $(res.m1).removeAttr('is-two-columns')
        }

        if(flag&2){
            res.m2=$(cssSelector2)[0]
        if(bool) $(res.m2).removeAttr('hidden'); else $(res.m2).attr('hidden','')
        }

        if(flag&4){
            res.m3=$(cssSelector3)[0]
        if(bool) $(res.m3).attr('hidden',''); else $(res.m3).removeAttr('hidden');
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


        if( !scrollingVideosList.deref() ) return;
        if( videoListBeforeSearch ) return;



        let visibleHeight = document.scrollingElement.clientHeight;
        let totalHeight = document.scrollingElement.scrollHeight;

        if(totalHeight<visibleHeight*1.5)return; // filter out two column view;

        let z = window.pageYOffset + visibleHeight;
        let h_advanced = totalHeight - ( visibleHeight > 5*40 ? visibleHeight*0.5 : 40 );



        if(z>h_advanced && !isWideScreenWithTwoColumns() ){

            if(new Date -  lastScrollFetch<500) return; //prevent continuous calling

            lastScrollFetch=+new Date;
        
            let res= setVideosTwoColumns(2|4, true)
            if(res.m3 && res.m2){

                //wait for DOM change, just in case
                requestAnimationFrame(()=>{
                    let {offsetTop}=res.m2  // as visiblity of m2 & m3 switched.

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






})();
