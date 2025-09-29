document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mainHeader = document.querySelector('.main-header');
   
    // --- DYNAMIC HEADER HEIGHT CALCULATION ---
    function setHeaderHeight() {
        const headerHeight = mainHeader.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    // --- DYNAMIC HEADER ON SCROLL ---
    let lastScrollTop = 0;
    function handleHeaderScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        if (scrollTop > lastScrollTop && scrollTop > mainHeader.offsetHeight) {
            mainHeader.classList.add('header-hidden');
        } else {
            mainHeader.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    window.addEventListener('scroll', handleHeaderScroll);

    // --- SUMMARY CARD SPOTLIGHT HOVER EFFECT ---
    document.querySelectorAll('.summary-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        card.addEventListener('mouseenter', () => card.classList.add('hovered'));
        card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });

    // --- BELIEVE SECTION CAROUSEL SCROLL PROGRESS ---
    const believeCarousel = document.querySelector('.believe-carousel-container');
    if (believeCarousel) {
        believeCarousel.addEventListener('scroll', () => {
            const progressBar = document.querySelector('.believe-progress-bar');
            const scrollLeft = believeCarousel.scrollLeft;
            const scrollWidth = believeCarousel.scrollWidth - believeCarousel.clientWidth;
            const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        });
    }

    // --- SMOOTH DRAGGING FOR BELIEVE SECTION ---
    if (believeCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velocityX = 0;
        let momentumID;

        const startDragging = (e) => {
            isDown = true;
            believeCarousel.classList.add('is-dragging');
            startX = e.pageX - believeCarousel.offsetLeft;
            scrollLeft = believeCarousel.scrollLeft;
            cancelMomentumTracking();
        };

        const stopDragging = () => {
            isDown = false;
            believeCarousel.classList.remove('is-dragging');
            beginMomentumTracking();
        };

        const onDrag = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - believeCarousel.offsetLeft;
            const walk = x - startX;
            const prevScrollLeft = believeCarousel.scrollLeft;
            believeCarousel.scrollLeft = scrollLeft - walk;
            velocityX = believeCarousel.scrollLeft - prevScrollLeft;
        };

        const cancelMomentumTracking = () => {
            cancelAnimationFrame(momentumID);
        };

        const beginMomentumTracking = () => {
            cancelMomentumTracking();
            momentumID = requestAnimationFrame(momentumLoop);
        };

        const momentumLoop = () => {
            believeCarousel.scrollLeft += velocityX;
            velocityX *= 0.95; // Friction
            if (Math.abs(velocityX) > 0.5) {
                momentumID = requestAnimationFrame(momentumLoop);
            }
        };

        believeCarousel.addEventListener('mousedown', startDragging);
        believeCarousel.addEventListener('mouseup', stopDragging);
        believeCarousel.addEventListener('mouseleave', stopDragging);
        believeCarousel.addEventListener('mousemove', onDrag);
    }

    // --- HERO CAROUSEL DATA & LOGIC ---
    const slidesData = [
        { id: 'about-us', category: 'ABOUT US', title: "A Global Energy Trading Powerhouse", buttonText: 'Learn More', bgImage: 'images/fcd01457-900f-421e-9dd4-460227f5f2a4.jpg', previewImage: 'images/image1.jpg' },
        { id: 'global-expansion', category: 'GLOBAL EXPANSION', title: 'Navigating Global Challenges with Expertise', buttonText: 'Discover Our Reach', bgImage: 'images/IMG_3926.JPG', previewImage: 'images/global-reach-map.png' },
        { id: 'our-products', category: 'OUR PRODUCTS', title: 'Diversified Energy Solutions for a Dynamic Market', buttonText: 'Explore Products', bgImage: 'images/970c75069409b4ea572135fdd204ca4f.jpg', previewImage: 'images/IMG_8277.jpg' },
        { id: 'future-direction', category: 'FUTURE DEVELOPMENT', title: 'Navigating Success: Future Focus Areas', buttonText: 'See Our Strategy', bgImage: 'images/sustainable-future.jpg', previewImage: 'images/esg-strategy.jpg' }
    ];
    const heroSection = document.getElementById('hero-section');
    let slideInterval;
    const SLIDE_DURATION = 5000;

    function initializeCarousel() {
        let slidesHTML = '';
        let navLinksHTML = '';
        slidesData.forEach((slide, index) => {
            slidesHTML += `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slide.bgImage}');"><div class="hero-content"><p class="category">${slide.category}</p><h1>${slide.title}</h1><a href="#" class="action-button"><span>${slide.buttonText}</span><span class="icon"><i class="fas fa-arrow-right"></i></span></a></div></div>`;
            navLinksHTML += `<a class="hero-nav-link ${index === 0 ? 'active' : ''}" data-index="${index}" data-preview="${slide.previewImage}"><span>${slide.category}</span><div class="progress-bar"></div></a>`;
        });
        heroSection.insertAdjacentHTML('afterbegin', slidesHTML);
        document.getElementById('hero-nav-links').innerHTML = navLinksHTML;
    }

    function goToSlide(index) {
        document.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === index));
        document.querySelectorAll('.hero-nav-link').forEach((link, i) => {
            link.classList.toggle('active', i === index);
            const progressBar = link.querySelector('.progress-bar');
            progressBar.classList.remove('animate');
            void progressBar.offsetWidth;
            if (i === index) progressBar.classList.add('animate');
        });
        clearInterval(slideInterval);
        slideInterval = setInterval(() => goToSlide((index + 1) % slidesData.length), SLIDE_DURATION);
    }

    if (heroSection) {
        initializeCarousel();
        goToSlide(0);

        document.querySelectorAll('.hero-nav-link').forEach((link, index) => {
            link.addEventListener('click', () => goToSlide(index));
            link.addEventListener('mouseenter', () => {
                const heroNavPreview = document.getElementById('hero-nav-preview');
                if (!link.classList.contains('active')) {
                    heroNavPreview.style.backgroundImage = `url('${link.dataset.preview}')`;
                    const linkRect = link.getBoundingClientRect();
                    heroNavPreview.style.left = `${linkRect.left + (linkRect.width / 2) - (heroNavPreview.offsetWidth / 2)}px`;
                    heroNavPreview.classList.add('visible');
                }
            });
            link.addEventListener('mouseleave', () => document.getElementById('hero-nav-preview').classList.remove('visible'));
        });
    }

    // --- SEARCH AND OFF-CANVAS MENU LOGIC ---
    const searchOverlay = document.getElementById('search-overlay');
    const offCanvasContainer = document.getElementById('off-canvas-container');
    document.querySelector('.search-icon').addEventListener('click', () => { searchOverlay.classList.add('active'); body.classList.add('menu-open'); });
    document.getElementById('search-close-btn').addEventListener('click', () => { searchOverlay.classList.remove('active'); body.classList.remove('menu-open'); });
    
    function closeSidebar() {
        offCanvasContainer.classList.remove('active');
        body.classList.remove('menu-open');
    }
    document.querySelectorAll('.nav-link-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
            document.getElementById(trigger.dataset.target)?.classList.add('active');
            offCanvasContainer.classList.add('active');
            body.classList.add('menu-open');
        });
    });
    document.getElementById('off-canvas-overlay').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-close-btn').addEventListener('click', closeSidebar);

    // --- CORE PAGE SWITCHING LOGIC ---
    const pageSections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.page-nav-link');

    function showPage(targetPageId) {
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.querySelector(`.page-section[data-page="${targetPageId}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        document.querySelectorAll('.main-nav .nav-links a').forEach(link => {
            const isDirectMatch = link.dataset.target === targetPageId;
            let isChildMatch = false;
            const aboutUsChildren = ['history'];
            const whatWeDoChildren = ['products'];
            if (link.dataset.target === 'about-us-content' && aboutUsChildren.includes(targetPageId)) {
                isChildMatch = true;
            } else if (link.dataset.target === 'what-we-do-content' && whatWeDoChildren.includes(targetPageId)) {
                isChildMatch = true;
            }
            link.classList.toggle('active', isDirectMatch || isChildMatch);
        });
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            if (!link.classList.contains('nav-link-trigger')) {
                showPage(target);
                closeSidebar();
            }
        });
    });

    // --- INITIALIZATION ---
    showPage('home');
    document.getElementById('current-year').textContent = new Date().getFullYear();
});