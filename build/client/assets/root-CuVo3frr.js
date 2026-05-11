import{u as x,e as f,r as n,j as e,O as y}from"./index-D5yq2knj.js";import{C as S}from"./cart-context-MQg65yoj.js";import{h as w,j as g,_ as j,k as a,M as v,L as k,S as M}from"./components-DUfeWTCP.js";/**
 * @remix-run/react v2.17.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function O({getKey:r,...c}){let{isSpaMode:d}=w(),i=x(),m=f();g({getKey:r,storageKey:l});let u=n.useMemo(()=>{if(!r)return null;let t=r(i,m);return t!==i.key?t:null},[]);if(d)return null;let h=((t,p)=>{if(!window.history.state||!window.history.state.key){let s=Math.random().toString(32).slice(2);window.history.replaceState({key:s},"")}try{let o=JSON.parse(sessionStorage.getItem(t)||"{}")[p||window.history.state.key];typeof o=="number"&&window.scrollTo(0,o)}catch(s){console.error(s),sessionStorage.removeItem(t)}}).toString();return n.createElement("script",j({},c,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${a(JSON.stringify(l))}, ${a(JSON.stringify(u))})`}}))}const R=()=>[{title:"Athlea Systems - Votre pharmacie en ligne"},{name:"description",content:"Althea Systems - Achetez vos produits medicaux en ligne. Large choix de produits de sante, livraison rapide et service de qualite."},{name:"viewport",content:"width=device-width, initial-scale=1"},{charSet:"utf-8"}],_=()=>[{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}];function C(){return e.jsxs("html",{lang:"fr",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(v,{}),e.jsx(k,{})]}),e.jsxs("body",{className:"font-sans antialiased",children:[e.jsx(S,{children:e.jsx(y,{})}),e.jsx(O,{}),e.jsx(M,{})]})]})}export{C as default,_ as links,R as meta};
