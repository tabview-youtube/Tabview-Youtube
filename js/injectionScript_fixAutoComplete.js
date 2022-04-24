"use strict";

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

    injectionScript_fixAutoComplete();
    