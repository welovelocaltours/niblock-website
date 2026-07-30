(function(){
  var b=document.getElementById('burger'), n=document.getElementById('navlinks');
  if(b&&n) b.addEventListener('click',function(){n.classList.toggle('open');});
  if(n) n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open');});});
  document.querySelectorAll('.faq-q').forEach(function(q){q.addEventListener('click',function(){q.parentElement.classList.toggle('open');});});
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    var sel='.card,.svc a,.wincard,.tcard,.step,.who .item,.pstat,.photo,.inside-grid>div,.band,.cta,.quote-wrap>div,blockquote,.cs-card,.flist>li,.pricegrid,.trust .client,.map-card,.prose>*';
    var els=[].slice.call(document.querySelectorAll(sel));
    els.forEach(function(el){el.classList.add('reveal');});
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
      els.forEach(function(el){io.observe(el);});
    } else { els.forEach(function(el){el.classList.add('in');}); }
  }
})();

/* Quote / contact form -> /api/quote (Resend) */
(function(){
  var forms=[].slice.call(document.querySelectorAll('.js-quote-form'));
  forms.forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('button[type=submit]');
      var msg=f.querySelector('.form-msg');
      var data={};
      [].slice.call(f.querySelectorAll('input,select,textarea')).forEach(function(el){
        if(el.name) data[el.name]=el.value;
      });
      if(!data.name||!data.email){ if(msg){msg.style.color='#c0392b';msg.textContent='Please add your name and email.';} return; }
      var orig=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…';}
      if(msg){msg.style.color='';msg.textContent='';}
      fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.ok?r.json():Promise.reject(r);})
        .then(function(){
          f.reset();
          if(btn){btn.textContent='Thanks — we’ll be in touch!';}
          if(msg){msg.style.color='#0a7d28';msg.textContent='Your enquiry has been sent. We reply within one working day.';}
        })
        .catch(function(){
          if(btn){btn.disabled=false;btn.textContent=orig;}
          if(msg){msg.style.color='#c0392b';msg.innerHTML='Sorry, something went wrong. Please call 01293 773130 or email <a href="mailto:info@niblocklogistics.co.uk">info@niblocklogistics.co.uk</a>.';}
        });
    });
  });
})();


/* ---- Google Analytics 4 with cookie consent (UK PECR) ---- */
(function(){
  var GA_ID='G-0CJEB18WCV', KEY='niblockCookieConsent';
  function loadGA(){
    if(window.__gaLoaded) return; window.__gaLoaded=true;
    var s=document.createElement('script'); s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments);};
    gtag('js', new Date());
    gtag('config', GA_ID, {anonymize_ip:true});
  }
  function removeBanner(){var b=document.getElementById('cookie-banner'); if(b&&b.parentNode) b.parentNode.removeChild(b);}
  function showBanner(){
    if(document.getElementById('cookie-banner')) return;
    var b=document.createElement('div'); b.id='cookie-banner'; b.className='cookie-banner';
    b.setAttribute('role','dialog'); b.setAttribute('aria-label','Cookie consent');
    b.innerHTML='<p>We use cookies to measure site traffic and improve your experience. See our <a href="privacy.html">Privacy Policy</a>.</p>'+
      '<div class="cookie-actions"><button type="button" class="cb-decline">Decline</button><button type="button" class="cb-accept">Accept</button></div>';
    document.body.appendChild(b);
    b.querySelector('.cb-accept').onclick=function(){try{localStorage.setItem(KEY,'granted');}catch(e){} loadGA(); removeBanner();};
    b.querySelector('.cb-decline').onclick=function(){try{localStorage.setItem(KEY,'denied');}catch(e){} removeBanner();};
  }
  var c=null; try{c=localStorage.getItem(KEY);}catch(e){}
  if(c==='granted') loadGA();
  else if(c!=='denied'){ if(document.body) showBanner(); else document.addEventListener('DOMContentLoaded',showBanner); }
})();
