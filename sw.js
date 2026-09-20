const CACHE='little-steps-v6';
const ARABIC_AUDIO=['hamza','alif','baa','taa','thaa','jeem','haa','khaa','daal','dhaal','raa','zaay','seen','sheen','saad','daad','taa_heavy','zaa_heavy','ayn','ghayn','faa','qaaf','kaaf','laam','meem','noon','haa_soft','waaw','yaa','zero','one','two','three','four','five','six','seven','eight','nine','ten'].map(name=>`./audio/ar/${name}.wav`);
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg',...ARABIC_AUDIO];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))))});
