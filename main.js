
// Gamee Shop - Main Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
    initStatus();
    initScroll();
    initFAQ();
    initProductFilters();
    initPageRefresh();
    initSecurity();
    initReveal();
    initCarousel();
    initHeroParallax();
    initBackToTop();
});

// 0. Security (Prevent Selection & Context Menu)
function initSecurity() {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, false);

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
        }
    });

    // Extra layer to prevent dragging images
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
}

// 1. Reveal Animation Logic
function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Fallback for elements already in view
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 500);
}

// 1.5 Carousel Logic
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);

    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            clearInterval(slideInterval);
            startInterval();
        });
    });

    startInterval();
}

// 1.6 Hero Parallax
function initHeroParallax() {
    const heroFrame = document.querySelector('.hero-frame');
    if (!heroFrame) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        heroFrame.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

// 1.7 Back to Top
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.className = 'back-to-top';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 2. Live Shop Status (7 AM - 10 PM SL Time)
function initStatus() {
    const statusContainer = document.querySelector('.shop-status-container');
    if (!statusContainer) return;

    const updateStatus = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const slTime = new Date(utc + (3600000 * 5.5));
        
        const hours = slTime.getHours();
        const isOpen = hours >= 7 && hours < 22;

        statusContainer.innerHTML = isOpen 
            ? `<span class="status-badge open"><span class="status-dot"></span>Open Now</span>`
            : `<span class="status-badge closed"><span class="status-dot"></span>Closed Now</span>`;
    };

    updateStatus();
    setInterval(updateStatus, 60000);
}

// 3. Scroll Header Logic
function initScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 4. FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others and reset icons
            faqItems.forEach(i => {
                i.classList.remove('active');
                const iIcon = i.querySelector('.faq-icon');
                if (iIcon) iIcon.innerText = '⊕';
            });

            // Toggle current if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                if (icon) icon.innerText = '⊖';
            }
        });
    });
}

// 5. Product Search & Filters
function initProductFilters() {
    const searchInput = document.getElementById('productSearch');
    const filterChips = document.querySelectorAll('.filter-chip');
    const products = document.querySelectorAll('.product-card');

    if (!searchInput && filterChips.length === 0) return;

    const filterProducts = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeCategory = document.querySelector('.filter-chip.active')?.dataset.category || 'all';

        products.forEach(product => {
            const title = product.querySelector('h3').innerText.toLowerCase();
            const desc = product.querySelector('p').innerText.toLowerCase();
            const category = product.dataset.category || 'all';
            
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                product.style.display = 'flex';
                product.classList.add('animate-in');
            } else {
                product.style.display = 'none';
            }
        });
    };

    if (searchInput) searchInput.addEventListener('input', filterProducts);

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterProducts();
        });
    });
}

// 6. Page Refresh on Return
function initPageRefresh() {
    window.addEventListener('pageshow', (event) => {
        if (document.activeElement) {
            document.activeElement.blur();
        }

        document.querySelectorAll('.animate-in, .reveal').forEach(el => {
            el.classList.remove('animate-in', 'reveal');
            void el.offsetWidth;
            el.classList.add('animate-in', 'reveal');
        });

        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            window.location.reload();
        }
    });
}
