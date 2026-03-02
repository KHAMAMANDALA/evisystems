document.addEventListener('DOMContentLoaded', function(){
  'use strict';
  
  // Performance optimization: Reduce animations on low-end devices
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Hero slideshow
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentHeroSlide = 0;
  
  function nextHeroSlide() {
    heroSlides[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
  }
  
  if(!prefersReducedMotion) {
    setInterval(nextHeroSlide, 5000);
  }

  // Nav toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    
    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if(!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      }
    });
  }

  // Smooth scrolling with fallback
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        if('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({behavior:'smooth', block:'start'});
        } else {
          target.scrollIntoView(true);
        }
        if(nav && nav.classList && nav.classList.contains('open')) {
          nav.classList.remove('open');
          const toggle = document.getElementById('nav-toggle');
          if(toggle) toggle.classList.remove('active');
        }
      }
    });
  });

  // Service cards animation with Intersection Observer
  const observerOptions = {threshold: 0.1, rootMargin: '0px 0px -50px 0px'};
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if(entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, prefersReducedMotion ? 0 : index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(card);
  });

  // Projects data
  const projectsData = [
    {
      title: 'Mobile Application Development',
      category: 'Mobile App',
      description: 'Cross-platform mobile applications for iOS and Android. Native performance with seamless user experiences, featuring intuitive interfaces, cloud integration, and comprehensive functionality.',
      tags: ['Flutter', 'React Native', 'iOS', 'Android'],
      images: [
        'images/mobile application.jpg',
        'images/web designing.jpg',
        'images/desktop app.jpg',
        'images/data collectio.jpg',
        'images/networks.jpg',
        'images/home.jpg'
      ],
      details: ['iOS & Android development', 'Cross-platform solutions', 'UI/UX design', 'App Store deployment', 'Cloud integration', 'Push notifications']
    },
    {
      title: 'Web Development & Design',
      category: 'Web Development',
      description: 'Modern, responsive websites and web applications built with cutting-edge technologies. E-commerce solutions, CMS integration, and SEO optimization for maximum online presence.',
      tags: ['React', 'Node.js', 'WordPress', 'SEO'],
      images: [
        'images/web designing.jpg',
        'images/mobile application.jpg',
        'images/desktop app.jpg',
        'images/data collectio.jpg',
        'images/networks.jpg',
        'images/home2.jpg'
      ],
      details: ['Responsive web design', 'E-commerce solutions', 'CMS integration', 'SEO optimization', 'Performance optimization', 'Security implementation']
    },
    {
      title: 'Desktop Application Development',
      category: 'Desktop Application',
      description: 'Custom desktop software solutions for Windows, macOS, and Linux. Powerful applications featuring intuitive interfaces, database integration, and comprehensive functionality tailored to your business needs.',
      tags: ['C#', '.NET', 'WPF', 'SQL Server'],
      images: [
        'images/desktop app.jpg',
        'images/mobile application.jpg',
        'images/web designing.jpg',
        'images/data collectio.jpg',
        'images/networks.jpg',
        'images/home3.jpg'
      ],
      details: ['Cross-platform compatibility', 'Database integration', 'Custom UI/UX design', 'Performance optimization', 'Automated workflows', 'Comprehensive reporting']
    },
    {
      title: 'Data Collection & Survey Platform',
      category: 'Data Management',
      description: 'Comprehensive data collection and analysis system designed for research organizations. Includes survey design tools, data validation, SPSS export, real-time reporting, and secure cloud storage with role-based access control.',
      tags: ['KoboToolbox', 'Python', 'Django', 'SPSS'],
      images: [
        'images/data collectio.jpg',
        'images/desktop app.jpg',
        'images/mobile application.jpg',
        'images/web designing.jpg',
        'images/networks.jpg',
        'images/home.jpg'
      ],
      details: ['KoboToolbox integration', 'Data validation and cleaning', 'SPSS format export', 'Real-time reporting dashboard', 'Role-based access control', 'Automated backup system']
    },
    {
      title: 'Network & Cabling Installation',
      category: 'Network Infrastructure',
      description: 'Enterprise-grade network infrastructure installation including structured cabling, Wi-Fi deployment, CCTV surveillance system, and network security implementation for corporate offices and institutions.',
      tags: ['Cisco', 'CCTV', 'Wi-Fi 6', 'Network Security'],
      images: [
        'images/networks.jpg',
        'images/Secure, discreet support for your business — Sydney-based reliability.jpg',
        'images/desktop app.jpg',
        'images/data collectio.jpg',
        'images/mobile application.jpg',
        'images/web designing.jpg'
      ],
      details: ['Structured cabling installation', 'Wi-Fi 6 access points deployment', 'CCTV surveillance system', 'Network security configuration', 'VPN setup for remote access', 'Network monitoring system']
    }
  ];

  // Projects carousel with touch support
  const projectsCarousel = document.querySelector('.projects-fullwidth');
  if(projectsCarousel) {
    const track = projectsCarousel.querySelector('.projects-track');
    const slides = track.querySelectorAll('.project-slide');
    const prevBtn = projectsCarousel.querySelector('.prev');
    const nextBtn = projectsCarousel.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to project ${i + 1}`);
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    }

    function nextSlide() {
      currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
      goToSlide(currentIndex);
    }

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    // Touch gestures
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      const swipeThreshold = 50;
      if(touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
        resetAutoPlay();
      } else if(touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
        resetAutoPlay();
      }
    }

    // Auto-play
    function startAutoPlay() {
      if(!prefersReducedMotion) {
        autoPlayInterval = setInterval(nextSlide, 5000);
      }
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    projectsCarousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    projectsCarousel.addEventListener('mouseleave', startAutoPlay);

    // Open modal on click
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const projectIndex = parseInt(slide.dataset.project);
        openProjectModal(projectIndex);
      });
    });
  }

  // Project modal with keyboard support
  const modal = document.getElementById('projectModal');
  const modalClose = modal.querySelector('.modal-close');

  function openProjectModal(index) {
    const project = projectsData[index];
    
    // Set project info
    modal.querySelector('.project-category').textContent = project.category;
    const modalTitle = modal.querySelector('#modal-title');
    modalTitle.textContent = project.title;
    modal.querySelector('.project-description').textContent = project.description;
    
    // Set tags
    const tagsContainer = modal.querySelector('.project-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
    
    // Set details
    const detailsList = modal.querySelector('.project-details ul');
    detailsList.innerHTML = '';
    project.details.forEach(detail => {
      const li = document.createElement('li');
      li.textContent = detail;
      detailsList.appendChild(li);
    });
    
    // Set images
    const mainImage = modal.querySelector('.modal-main-image img');
    mainImage.src = project.images[0];
    mainImage.alt = project.title;
    mainImage.classList.add('active');
    
    // Set thumbnails
    const thumbsContainer = modal.querySelector('.modal-thumbs');
    thumbsContainer.innerHTML = '';
    project.images.forEach((img, i) => {
      const btn = document.createElement('button');
      btn.classList.add('thumb');
      btn.setAttribute('aria-label', `View image ${i + 1}`);
      if(i === 0) btn.classList.add('active');
      btn.innerHTML = `<img src="${img}" alt="${project.title} - Image ${i+1}">`;
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.modal-main-image img, .modal-main-image video').forEach(el => el.classList.remove('active'));
        modal.querySelectorAll('.modal-thumbs button').forEach(b => b.classList.remove('active'));
        mainImage.src = img;
        mainImage.alt = `${project.title} - Image ${i+1}`;
        mainImage.classList.add('active');
        btn.classList.add('active');
      });
      thumbsContainer.appendChild(btn);
    });
    
    // Add video thumbnail
    const videoBtn = document.createElement('button');
    videoBtn.classList.add('thumb', 'video-thumb');
    videoBtn.setAttribute('aria-label', 'Play video');
    videoBtn.innerHTML = `<img src="${project.images[0]}" alt="${project.title} - Video"><span class="play-icon">▶</span>`;
    videoBtn.addEventListener('click', () => {
      modal.querySelectorAll('.modal-main-image img, .modal-main-image video').forEach(el => el.classList.remove('active'));
      modal.querySelectorAll('.modal-thumbs button').forEach(b => b.classList.remove('active'));
      const video = modal.querySelector('.modal-main-image video');
      video.classList.add('active');
      video.play().catch(() => {});
      videoBtn.classList.add('active');
    });
    thumbsContainer.appendChild(videoBtn);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const video = modal.querySelector('.modal-main-image video');
    video.pause();
    video.currentTime = 0;
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
  
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if(modal.classList.contains('active') && e.key === 'Escape') {
      closeModal();
    }
  });

  // Partners infinite scroll - duplicate for seamless loop
  const partnersTrack = document.querySelector('.partners-track');
  if(partnersTrack) {
    const cards = partnersTrack.innerHTML;
    partnersTrack.innerHTML = cards + cards;
  }
  
  // Error handling for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.opacity = '0.3';
      this.alt = 'Image not available';
    });
  });
  
  // Performance: Lazy load images below fold
  if('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // Console info
  console.log('%cEVI Systems & ICT Consultancy', 'color: #0066ff; font-size: 20px; font-weight: bold;');
  console.log('%cWebsite loaded successfully', 'color: #00d4ff;');
});
