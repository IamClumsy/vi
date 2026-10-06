(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
var toastEl;function toast(t){if(!toastEl){toastEl=document.createElement("div");toastEl.className="siteToast";toastEl.setAttribute("role","status");document.body.appendChild(toastEl)}
 toastEl.textContent=t;toastEl.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){toastEl.classList.remove("show")},1800)}
window.siteToast=toast;
/* theme */
var root=document.documentElement,saved=store("vit.theme");
if(saved==="light"||saved==="dark")root.setAttribute("data-theme",saved);
function isDark(){var t=root.getAttribute("data-theme");if(t)return t==="dark";return !(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)}
function syncBtn(){$$("[data-themebtn]").forEach(function(b){var d=isDark();b.setAttribute("aria-label",d?"Switch to light theme":"Switch to dark theme");b.setAttribute("aria-pressed",String(!d));b.querySelector(".lbl")&&(b.querySelector(".lbl").textContent=d?"Light":"Dark")})}
document.addEventListener("click",function(e){
 var tb=e.target.closest("[data-themebtn]");if(tb){var n=isDark()?"light":"dark";root.setAttribute("data-theme",n);store("vit.theme",n);syncBtn();return}
 var mb=e.target.closest("[data-menu]");if(mb){var d=$("#sdrawer");d&&d.classList.add("open");return}
 var dr=$("#sdrawer");if(dr&&dr.classList.contains("open")&&(e.target===dr||e.target.closest("[data-close]")||e.target.closest("#sdrawer a")))dr.classList.remove("open");
});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){var d=$("#sdrawer");d&&d.classList.remove("open")}
 if(e.key==="/"&&!/input|textarea/i.test(document.activeElement.tagName)){var s=$("#gsearch");if(s){e.preventDefault();s.focus()}}});
syncBtn();
/* copy-link buttons on headings */
$$("h2[id],h3[id]").forEach(function(h){var a=document.createElement("a");a.className="anc";a.href="#"+h.id;a.setAttribute("aria-label","Copy link to this section");a.textContent="#";
 a.addEventListener("click",function(e){e.preventDefault();var u=location.href.split("#")[0]+"#"+h.id;history.replaceState(null,"","#"+h.id);
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){toast("Link copied")},function(){toast("Link: "+u)})}else toast("Link set in the address bar");
  h.scrollIntoView({behavior:"smooth"})});h.appendChild(a)});
/* scroll-spy for .toc */
var toc=$(".toc");if(toc&&"IntersectionObserver" in window){var links=$$("a[href^='#']",toc),map={};
 links.forEach(function(a){map[a.getAttribute("href").slice(1)]=a});
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.remove("on")});var l=map[en.target.id];if(l){l.classList.add("on");if(toc.scrollWidth>toc.clientWidth&&toc.scrollTo){toc.scrollTo({left:l.offsetLeft-40,behavior:"smooth"})}}}})},{rootMargin:"-10% 0px -80% 0px"});
 Object.keys(map).forEach(function(id){var t=document.getElementById(id);t&&io.observe(t)})}
/* sortable tables + chip filters */
function cellText(td){return (td&&td.textContent||"").trim()}
function num(s){var m=s.replace(/,/g,"").match(/-?\d+(\.\d+)?/);return m?parseFloat(m[0]):NaN}
$$(".tw table").forEach(function(t){var rows=$$("tr",t);if(rows.length<4)return;var head=rows[0];if(!head.querySelector("th"))return;
 var ths=$$("th",head);
 ths.forEach(function(th,i){th.classList.add("sortable");th.tabIndex=0;th.setAttribute("role","button");
  function go(){var dir=th.getAttribute("data-dir")==="asc"?"desc":"asc";ths.forEach(function(x){x.removeAttribute("data-dir")});th.setAttribute("data-dir",dir);
   var body=rows.slice(1).filter(function(r){return !r.classList.contains("ph")&&r.parentNode});var par=body[0].parentNode;
   var vals=body.map(function(r){return cellText(r.children[i])});var numeric=vals.every(function(v){return v===""||v==="—"||!isNaN(num(v))});
   var idx=body.map(function(r,k){return {r:r,v:vals[k],n:num(vals[k]),k:k}});
   idx.sort(function(a,b){var c=numeric?((isNaN(a.n)?-1e9:a.n)-(isNaN(b.n)?-1e9:b.n)):a.v.localeCompare(b.v,undefined,{numeric:true});return (dir==="asc"?c:-c)||a.k-b.k});
   idx.forEach(function(o){par.appendChild(o.r)})}
  th.addEventListener("click",go);th.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}})});
 var chips=null,col=-1;
 ths.forEach(function(th,i){if(/^slot$/i.test(th.textContent.trim()))col=i});
 if(col>-1){var vals=[];rows.slice(1).forEach(function(r){var v=cellText(r.children[col]);if(v&&vals.indexOf(v)<0)vals.push(v)});if(vals.length>2)chips={label:"Slot",test:function(r,v){return cellText(r.children[col])===v},vals:vals}}
 else if(/^run$/i.test(ths[0].textContent.trim())){chips={label:"Run",vals:["Sky Ridge","World Boss","Mixed packs","Champion"],test:function(r,v){var s=cellText(r.children[0]);return v==="Sky Ridge"?/Sky Ridge/.test(s):v==="World Boss"?/World Boss/.test(s):v==="Mixed packs"?/mixed|normal packs/i.test(s):/Champion/.test(s)}}}
 if(chips){var bar=document.createElement("div");bar.className="tbar";bar.setAttribute("role","group");bar.setAttribute("aria-label","Filter by "+chips.label);
  var cur=null;var all=["All"].concat(chips.vals);
  all.forEach(function(v){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;b.setAttribute("aria-pressed",String(v==="All"));
   b.addEventListener("click",function(){cur=v==="All"?null:v;$$(".chip",bar).forEach(function(c){c.setAttribute("aria-pressed",String(c===b))});
    rows.slice(1).forEach(function(r){if(r.classList.contains("ph"))return;var ok=!cur||chips.test(r,cur);r.classList.toggle("hide",!ok);r.dataset.chip=ok?"":"1"})});bar.appendChild(b)});
  t.parentNode.parentNode.insertBefore(bar,t.parentNode)}});
/* page search */
var gs=$("#gsearch");if(gs){var cnt=$("#gcount"),targets=$$(".guide tr,.guide li,.guide > p").filter(function(e){return !e.closest("th")&&!(e.tagName==="TR"&&e.querySelector("th"))});
 gs.addEventListener("input",function(){var q=gs.value.toLowerCase().split(/\s+/).filter(Boolean),hit=0;
  targets.forEach(function(e){if(e.dataset.chip==="1")return;var ok=!q.length||q.every(function(w){return e.textContent.toLowerCase().indexOf(w)>-1});e.classList.toggle("hide",!ok);if(ok&&q.length)hit++});
  cnt.textContent=q.length?hit+" match"+(hit===1?"":"es"):""})}
})();
