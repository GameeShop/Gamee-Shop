
// Gamee Shop - Main Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
    initStatus();
    initScroll();
    initFAQ();
    initProductFilters();
    initPageRefresh();
    initSecurity();
});

// 0. Security (Prevent Selection & Context Menu)
function initSecurity() {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
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

    // Extra layer to prevent selection/dragging
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
}

// 2. Live Shop Status (7 AM - 10 PM SL Time)
function initStatus() {
    const statusContainer = document.querySelector('.shop-status-container');
    if (!statusContainer) return;

    const updateStatus = () => {
        // Get SL Time (UTC + 5:30)
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
    setInterval(updateStatus, 60000); // Update every minute
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
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
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
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            window.location.reload();
        }
    });
}
