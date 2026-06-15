const CACHE='vasc-guide-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(cached){
      var net=fetch(e.request).then(function(resp){if(resp&&resp.ok&&resp.type!=='opaque')c.put(e.request,resp.clone());return resp;}).catch(function(){return cached;});
      return cached||net;
    });
  }));
});
