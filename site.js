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
