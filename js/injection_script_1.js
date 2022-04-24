"use strict";

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
    
    injection_script_1();