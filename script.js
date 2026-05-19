// Disable scroll restoration to prevent unwanted jumps on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Intersection Observer for Reveal Animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Shop Status Logic
function updateShopStatus() {
  const statusContainers = document.querySelectorAll('.shop-status-container');
  if (statusContainers.length === 0) return;

  const now = new Date();
  const hours = now.getHours();
  // MON-SUN 7am to 10pm (07:00 to 22:00)
  const isOpen = hours >= 7 && hours < 22;

  const statusHTML = isOpen 
    ? `<div class="status-badge open">
         <span class="status-dot"></span>
         Shop Open Now
       </div>`
    : `<div class="status-badge closed">
         <span class="status-dot"></span>
         Shop Closed
       </div>`;

  statusContainers.forEach(container => {
    container.innerHTML = statusHTML;
  });
}

// Header Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Back to Top Button
const backToTop = document.createElement('a');
backToTop.href = '#';
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Parallax/Magnetic Effect for Hero Frame
const heroFrame = document.querySelector('.hero-frame');
if (heroFrame) {
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    
    heroFrame.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(${-y}px)`;
  });
}

// Carousel Logic
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // Auto play
  let carouselInterval = setInterval(nextSlide, 5000);

  // Manual dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(carouselInterval);
      showSlide(index);
      carouselInterval = setInterval(nextSlide, 5000);
    });
  });
}

// Initial Calls
updateShopStatus();
initCarousel();
setInterval(updateShopStatus, 60000); // Update every minute