import{S as d,i as c}from"./assets/vendor-46aac873.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();const u=document.querySelector(".gallery"),m=document.querySelector(".search-form"),i=document.querySelector(".loading");i.style.display="none";const l={key:"41686068-f8a1ddec694d7ca7a5960473b",q:"",image_type:"photo",orientation:"horizontal",safesearch:!0},p=new d(".gallery a",{nav:!0,captionDelay:250,captionsData:"alt",close:!0,enableKeyboard:!0,docClose:!0}),f=s=>fetch(`https://pixabay.com/api/?${s}`).then(t=>{if(!t.ok)throw new Error(t.statusText);return t.json()}).then(({hits:t})=>{if(t.length>0){const o=t.reduce((a,e)=>a+`<li class="gallery-item">
          <a href=${e.largeImageURL}> 
            <img class="gallery-img" src =${e.webformatURL} alt=${e.tags}/>
          </a>
          <div class="gallery-text-box">
            <p>Likes: <span class="text-value">${e.likes}</span></p>
            <p>views: <span class="text-value">${e.views}</span></p>
            <p>comments: <span class="text-value">${e.comments}</span></p>
            <p>downloads: <span class="text-value">${e.downloads}</span></p>
        </div>
        </li>`,"");u.innerHTML=o,p.refresh()}else c.error({position:"topRight",message:"Sorry, there are no images matching your search query. Please try again!"})}).catch(t=>{console.log(t.message)}).finally(()=>{i.style.display="none"});m.addEventListener("submit",s=>{if(s.preventDefault(),u.innerHTML="",l.q=s.target.elements.search.value.trim(),!l.q){c.warning({position:"topRight",message:"Please, fill in the field!"});return}i.style.display="block";const t=new URLSearchParams(l);f(t),s.currentTarget.reset()});
//# sourceMappingURL=commonHelpers.js.map
