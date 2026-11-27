// 東東超市 离线缓存 20261127204701
const V="dd-20261127204701";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith("dd-")&&!k.startsWith("dd-img")).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  // 网页本身：先拿最新的；网络慢（超过 2.5 秒）或没网就先用上次存的
  if(r.mode==="navigate"||(u.origin===location.origin&&/\/(index|beta)\.html$|\/$/.test(u.pathname))){
    e.respondWith((async()=>{const c=await caches.open(V);const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res});
      const old=await c.match(r);if(!old)return net.catch(()=>caches.match("/"));
      return Promise.race([net.catch(()=>old),new Promise(ok=>setTimeout(()=>ok(old),2500))]);})());return;}
  // 商品图、字体：先用存好的，后台再悄悄更新
  if((u.origin===location.origin&&/\.(jpg|jpeg|png|webp|svg)$/i.test(u.pathname))||/fonts\.(googleapis|gstatic)\.com/.test(u.host)){
    e.respondWith((async()=>{const c=await caches.open("dd-img");const hit=await c.match(r);
      const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net;})());}
});
