document.addEventListener('DOMContentLoaded', function() {
  // Nav toggle for small screens
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Smooth anchor scrolling
  // Skip anchors with href="#" or empty hash to avoid invalid selector errors.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // ignore bare "#" or empty hrefs
      if (!href || href === '#') return;
      // make sure it's still a hash-style link (#something)
      if (!href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList && nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Contact form UX
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      // If your form uses action="mailto:..." you may want to allow the default submission.
      // For now we prevent default and show a friendly message so the page doesn't reload.
      e.preventDefault();
      alert('Thank you — your mail client will open to send the message (if you configured mailto).');
      // If you want to open a mailto directly using form fields, build a mailto: URL here and call:
      // window.location.href = mailtoUrl;
    });
  }

  // Simple slideshow for services
  (function() {
    const slideshow = document.getElementById('ict-slideshow');
    if (!slideshow) return;

    const slidesWrap = slideshow.querySelector('.slides');
    if (!slidesWrap) return;

    const slides = slidesWrap.querySelectorAll('img');
    if (!slides || slides.length === 0) return;

    const prev = slideshow.querySelector('.prev');
    const next = slideshow.querySelector('.next');
    let idx = 0;

    function updateSizes() {
      const w = slideshow.clientWidth || slideshow.getBoundingClientRect().width || 0;
      // set each image width
      slides.forEach(img => {
        img.style.width = w + 'px';
        img.style.flex = '0 0 ' + w + 'px';
      });
      // set wrapper width to accommodate all slides in a row
      slidesWrap.style.width = (w * slides.length) + 'px';
      // ensure slidesWrap uses flex or inline-block layout in CSS; we set transform below
      show(idx); // reposition after resize
    }

    function show(i) {
      if (i < 0) i = slides.length - 1;
      if (i >= slides.length) i = 0;
      idx = i;
      slidesWrap.style.transform = `translateX(${ - idx * 100 }%)`;
      slidesWrap.style.transition = 'transform 0.5s ease';
    }

    if (prev) prev.addEventListener('click', () => { show(idx - 1); reset(); });
    if (next) next.addEventListener('click', () => { show(idx + 1); reset(); });

    let timer = null;
    if (slides.length > 1) {
      timer = setInterval(() => show(idx + 1), 4000);
    }
    function reset() {
      if (timer) {
        clearInterval(timer);
        timer = setInterval(() => show(idx + 1), 4000);
      }
    }

    // initialize sizes
    window.addEventListener('resize', updateSizes);
    // make slidesWrap a flex container or inline-block track via CSS is recommended
    slidesWrap.style.display = slidesWrap.style.display || 'flex';
    slidesWrap.style.flexWrap = 'nowrap';
    updateSizes();
    show(0);
  })();
});