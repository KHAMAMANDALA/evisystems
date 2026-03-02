document.addEventListener('DOMContentLoaded', function(){
  // Nav toggle for small screens
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'))
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if(nav.classList && nav.classList.contains('open')) nav.classList.remove('open');
      }
    })
  })

  // Contact form UX
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      alert('Thank you — your mail client will open to send the message.');
    })
  }

  // Simple slideshow for services
  (function(){
    const slideshow = document.getElementById('ict-slideshow');
    if(!slideshow) return;
    const slidesWrap = slideshow.querySelector('.slides');
    const slides = slidesWrap.querySelectorAll('img');
    const prev = slideshow.querySelector('.prev');
    const next = slideshow.querySelector('.next');
    let idx = 0, playing = true;

    function show(i){
      if(i<0) i = slides.length -1;
      if(i>=slides.length) i = 0;
      idx = i;
      slidesWrap.style.transform = `translateX(${ - idx * 100 }%)`;
    }

    prev.addEventListener('click', ()=>{ show(idx-1); reset(); })
    next.addEventListener('click', ()=>{ show(idx+1); reset(); })

    let timer = setInterval(()=> show(idx+1), 4000);
    function reset(){ clearInterval(timer); timer = setInterval(()=> show(idx+1), 4000); }

    // initialize sizes
    function setSizes(){ slides.forEach(img=> img.style.width = slideshow.clientWidth + 'px') }
    window.addEventListener('resize', setSizes);
    setSizes();
    show(0);
  })();

});
