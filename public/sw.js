if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let t={};const r=e=>s(e,n),o={module:{uri:n},exports:t,require:r};a[n]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-3c9d0171"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/1.png",revision:"636cf3df450a8e806586dc917ef65840"},{url:"/2.png",revision:"e1baa6dcd1b413484ed62bc90c432970"},{url:"/_next/static/aF9_M7rSCoueQ8c9m0P5l/_buildManifest.js",revision:"5d5cb18fb8a033f943e40e0aa0a18e55"},{url:"/_next/static/aF9_M7rSCoueQ8c9m0P5l/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/112-9c65e550c2b87e0f.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/142-c4caca237474149f.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/158-c053e365c4b7ee93.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/169-1d7fe8ae1f6db62e.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/223-f9344b6cf0fb92bb.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/231-a41aae356f31c499.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/244-448ca44a9d582cd0.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/281-630f2ac2aa3ddd1e.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/302-104cff344431c357.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/333-4dbe65bcb4a3f778.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/33eb3a6c-fe5188d9f02127b8.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/3eb2c66c-945b8fd0810c3f1d.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/507-d5c36e0eaa15f220.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/561-95a489defc89e4f0.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/594-eb9b27f62872fed4.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/602-4dca5b0256dbf7f8.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/651-0afddd6d47e12958.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/8-4e7ac25364a0759a.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/845-542b3ff4269bc9f8.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/89a05850-dea89de6867df147.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(auth)/layout-765881928f245a8d.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(auth)/sign-in/page-80b072bec91d084d.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/error-94f35f567fa444c9.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/expenses/page-c3a82d2223e975c3.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/layout-2fe52e77903d3e98.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/loading-cc6d03778d9167f3.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/page-ed0e38c16b55b0be.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/products/page-c4ad557f3f8e8a6b.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/purchase-invoice/%5Bid%5D/page-0e832688d902e695.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/purchase-invoice/page-5e1d60bd5b124242.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/purchase/page-c3ccc0d0630366a5.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/sale-invoice/%5Bid%5D/page-caeff1a535f4c800.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/sale-invoice/page-d40e602b5ca2deb1.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/(main)/sale/page-1d49ae38b73eb255.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/_not-found/page-da02e0832c3fbd64.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/layout-3deda2369f408d95.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/app/not-found-9b9798b3fdfe8544.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/c4aeae87-76dd34479c59659f.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/framework-a5354006c6e3c6e0.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/main-3fd9f9cd2f2f6afa.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/main-app-26184d92d7297307.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/pages/_app-e60c14510cb75e64.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/pages/_error-a2f8c495cf0eb065.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-83c1d77af061593e.js",revision:"aF9_M7rSCoueQ8c9m0P5l"},{url:"/_next/static/css/065c55758194f878.css",revision:"065c55758194f878"},{url:"/_next/static/media/592c94a04231521e-s.p.ttf",revision:"595114686c102d1194678cbf11311f26"},{url:"/_next/static/media/5b0f4f10b55f7ae4-s.p.ttf",revision:"209f7fcbcaed0046394ae6303d5ea5fe"},{url:"/_next/static/media/71e6ad3b64a9d2e9-s.p.ttf",revision:"921156134e99645f1ec62be3557816c8"},{url:"/_next/static/media/9f207a598cd6e6df-s.p.ttf",revision:"ae3dc1c91f160123ad17864a9760a59e"},{url:"/_next/static/media/empty.f2cf4709.svg",revision:"a8e62e3f4d8245918fbaadbd918a407b"},{url:"/_next/static/media/logo.a042e106.jpg",revision:"7e5abcc79f956f35030d2ad5ac72cb20"},{url:"/empty.svg",revision:"a8e62e3f4d8245918fbaadbd918a407b"},{url:"/film/1899.jpg",revision:"c7d65bd010399940f454e02968785129"},{url:"/film/Black_Adam.jpg",revision:"07cc46b057229bd18ba6ccde226c7785"},{url:"/film/Black_Panther.webp",revision:"4389f68d8a255c5f8f8496808ded5e1b"},{url:"/film/Interceptor.jpg",revision:"571d1a5a4e5accaf21b2cab30894c48e"},{url:"/film/My sensitivity.mp4",revision:"20570a664303ba882a7ddb76981533ce"},{url:"/film/Thor.jpg",revision:"885328333749d5ea92906a92f3ba5db2"},{url:"/film/ant_man.jpg",revision:"f6ee47a6bf203e2c86db304a911990f2"},{url:"/film/aquaman.jpg",revision:"29b748095314a833c720c84d8afa9be5"},{url:"/film/arrow.jpg",revision:"5ca18e336516222015b19e847a621873"},{url:"/film/background.jpg",revision:"a763db7771db75cecf8db62dee57fb29"},{url:"/film/background_1.jpg",revision:"388e73444fa0f31c8c59922e1dabd206"},{url:"/film/background_2.jpg",revision:"f0f77cf470566dc6318eebb2bd18c906"},{url:"/film/background_4.jpg",revision:"bb2447e2d7e68624e1dfed759c5830fd"},{url:"/film/background_5.jpg",revision:"c2878237ff1f859d07fcd58bdfd3f75b"},{url:"/film/banner.jpeg",revision:"24290a51325386d740b73c038e51f80a"},{url:"/film/gajaman.jpg",revision:"7d955fd5658af908c50e4048ed62c51a"},{url:"/film/game_of_thrones.jpg",revision:"85d559bc3cceb05efd043c92a6346115"},{url:"/film/john_wick.jfif",revision:"f9b008dee377a9e7b90d56deae115e4a"},{url:"/film/meg.jpg",revision:"8b2b7f21e02e73c681ae574b73b2123c"},{url:"/film/money_heist.jpg",revision:"f707db737293838e5de3b3a68c22fc15"},{url:"/film/plane.jpg",revision:"f31a2e0219ce0eca8d7e3692c3f92b7a"},{url:"/film/wednesday.jpg",revision:"41c01f8558cbbf9d3b15b46c0ea1b530"},{url:"/logo.jpg",revision:"7e5abcc79f956f35030d2ad5ac72cb20"},{url:"/manifest.json",revision:"1e4af460f4c66fe73839b81d3a4ef7b3"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:a}})=>!(!e||a.startsWith("/api/auth/callback")||!a.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:s})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&s&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:s})=>"1"===e.headers.get("RSC")&&s&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:a})=>a&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
