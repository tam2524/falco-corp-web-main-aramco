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
        let isDown = false; let startX; let scrollLeft; let velocityX = 0; let momentumID;
        const startDragging = (e) => { isDown = true; believeCarousel.classList.add('is-dragging'); startX = e.pageX - believeCarousel.offsetLeft; scrollLeft = believeCarousel.scrollLeft; cancelMomentumTracking(); };
        const stopDragging = () => { isDown = false; believeCarousel.classList.remove('is-dragging'); beginMomentumTracking(); };
        const onDrag = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - believeCarousel.offsetLeft; const walk = x - startX; const prevScrollLeft = believeCarousel.scrollLeft; believeCarousel.scrollLeft = scrollLeft - walk; velocityX = believeCarousel.scrollLeft - prevScrollLeft; };
        const cancelMomentumTracking = () => { cancelAnimationFrame(momentumID); };
        const beginMomentumTracking = () => { cancelMomentumTracking(); momentumID = requestAnimationFrame(momentumLoop); };
        const momentumLoop = () => { believeCarousel.scrollLeft += velocityX; velocityX *= 0.95; if (Math.abs(velocityX) > 0.5) { momentumID = requestAnimationFrame(momentumLoop); } };
        believeCarousel.addEventListener('mousedown', startDragging); believeCarousel.addEventListener('mouseup', stopDragging); believeCarousel.addEventListener('mouseleave', stopDragging); believeCarousel.addEventListener('mousemove', onDrag);
    }

    // --- HERO CAROUSEL DATA & LOGIC ---
    const slidesData = [
        { id: 'about-us', category: 'ABOUT US', title: "A Global Energy Trading Powerhouse", bgImage: 'images/fcd01457-900f-421e-9dd4-460227f5f2a4.jpg', previewImage: 'images/image1.jpg' },
        { id: 'global-expansion', category: 'GLOBAL EXPANSION', title: 'Navigating Global Challenges with Expertise', buttonText: 'Discover Our Reach', bgImage: 'images/IMG_3926.JPG', previewImage: 'images/global-reach-map.png' },
        { id: 'our-products', category: 'OUR PRODUCTS', title: 'Diversified Energy Solutions for a Dynamic Market', buttonText: 'Explore Products', bgImage: 'images/970c75069409b4ea572135fdd204ca4f.jpg', previewImage: 'images/IMG_8277.jpg' },
        { id: 'future-direction', category: 'FUTURE DEVELOPMENT', title: 'Navigating Success: Future Focus Areas', buttonText: 'See Our Strategy', bgImage: 'images/sustainable-future.jpg', previewImage: 'images/esg-strategy.jpg' }
    ];
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        let slideInterval; const SLIDE_DURATION = 5000;
        let slidesHTML = ''; let navLinksHTML = '';
        slidesData.forEach((slide, index) => { slidesHTML += `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slide.bgImage}');"><div class="hero-content"><p class="category">${slide.category}</p><h1>${slide.title}</h1></div></div>`; navLinksHTML += `<a class="hero-nav-link ${index === 0 ? 'active' : ''}" data-index="${index}" data-preview="${slide.previewImage}"><span>${slide.category}</span><div class="progress-bar"></div></a>`; });
        heroSection.insertAdjacentHTML('afterbegin', slidesHTML); document.getElementById('hero-nav-links').innerHTML = navLinksHTML;
        const goToSlide = (index) => { document.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === index)); document.querySelectorAll('.hero-nav-link').forEach((link, i) => { link.classList.toggle('active', i === index); const progressBar = link.querySelector('.progress-bar'); progressBar.classList.remove('animate'); void progressBar.offsetWidth; if (i === index) progressBar.classList.add('animate'); }); clearInterval(slideInterval); slideInterval = setInterval(() => goToSlide((index + 1) % slidesData.length), SLIDE_DURATION); };
        goToSlide(0);
        document.querySelectorAll('.hero-nav-link').forEach((link, index) => { link.addEventListener('click', () => goToSlide(index)); link.addEventListener('mouseenter', () => { const heroNavPreview = document.getElementById('hero-nav-preview'); if (!link.classList.contains('active')) { heroNavPreview.style.backgroundImage = `url('${link.dataset.preview}')`; const linkRect = link.getBoundingClientRect(); heroNavPreview.style.left = `${linkRect.left + (linkRect.width / 2) - (heroNavPreview.offsetWidth / 2)}px`; heroNavPreview.classList.add('visible'); } }); link.addEventListener('mouseleave', () => document.getElementById('hero-nav-preview').classList.remove('visible')); });
    }

    // --- SEARCH AND OFF-CANVAS MENU LOGIC ---
    const searchOverlay = document.getElementById('search-overlay');
    const offCanvasContainer = document.getElementById('off-canvas-container');
    document.querySelector('.search-icon').addEventListener('click', () => { searchOverlay.classList.add('active'); body.classList.add('menu-open'); });
    document.getElementById('search-close-btn').addEventListener('click', () => { searchOverlay.classList.remove('active'); body.classList.remove('menu-open'); });
    function closeSidebar() { offCanvasContainer.classList.remove('active'); body.classList.remove('menu-open'); }
    document.querySelectorAll('.nav-link-trigger').forEach(trigger => { trigger.addEventListener('click', (e) => { e.preventDefault(); document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active')); document.getElementById(trigger.dataset.target)?.classList.add('active'); offCanvasContainer.classList.add('active'); body.classList.add('menu-open'); }); });
    document.getElementById('off-canvas-overlay').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-close-btn').addEventListener('click', closeSidebar);

    // --- CORE PAGE SWITCHING LOGIC ---
    const pageSections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.page-nav-link');
    let historyMainTween; 
    let wwdAnimations = []; // Array to store What We Do animations for cleanup

    function showPage(targetPageId) {
        // Kill any active animations from previous pages
        if (historyMainTween && historyMainTween.scrollTrigger) {
            historyMainTween.scrollTrigger.kill();
            historyMainTween = null;
        }
        if (wwdAnimations.length > 0) {
            wwdAnimations.forEach(st => st.kill());
            wwdAnimations = [];
        }

        // Switch page visibility
        pageSections.forEach(section => section.classList.remove('active'));
        const targetSection = document.querySelector(`.page-section[data-page="${targetPageId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Initialize animations for the specific active page
            if (targetPageId === 'history') {
                setTimeout(initializeHistoryAnimation, 100);
            } else if (targetPageId === 'what-we-do') {
                setTimeout(initializeWWDAnimation, 100);
            }
            else if (targetPageId === 'products') {
            setTimeout(initializeProductsAnimation, 100);
            }
            else if (targetPageId === 'sustainability') { setTimeout(initializeSustainabilityAnimation, 100); }
            else if (targetPageId === 'milestone') { setTimeout(initializeMilestoneAnimation, 100); }

        }
        
        // Update active nav link
        document.querySelectorAll('.main-nav .nav-links a').forEach(link => { 
            const isDirectMatch = link.dataset.target === targetPageId; 
            let isChildMatch = false; 
            const aboutUsChildren = ['history']; 
            const whatWeDoChildren = ['products', 'what-we-do']; 
            if (link.dataset.target === 'about-us-content' && aboutUsChildren.includes(targetPageId)) { 
                isChildMatch = true; 
            } else if (link.dataset.target === 'what-we-do' && whatWeDoChildren.includes(targetPageId)) { 
                isChildMatch = true; 
            } 
            link.classList.toggle('active', isDirectMatch || isChildMatch); 
        });
        
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); const target = link.dataset.target; if (!link.classList.contains('nav-link-trigger')) { showPage(target); closeSidebar(); } }); });
    
    function initializeMilestoneAnimation() {
        if (typeof gsap === 'undefined') { return; }

        let headerST = gsap.from('#milestone-page .milestone-header > *', {
            autoAlpha: 0,
            y: 40,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.out'
        });
        pageAnimations.push(headerST);

        gsap.utils.toArray('.milestone-item').forEach((item, index) => {
            const image = item.querySelector('.milestone-image');
            const content = item.querySelectorAll('.milestone-content > *');

            // Determine animation direction based on whether the item is odd or even
            const imageX = (index % 2 === 0) ? -50 : 50;

            let itemTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                }
            });

            itemTimeline.from(image, { autoAlpha: 0, x: imageX, duration: 1, ease: 'power2.out' })
                       .from(content, { autoAlpha: 0, y: 30, stagger: 0.15, duration: 0.8, ease: 'power2.out' }, '-=0.7');
            
            pageAnimations.push(itemTimeline.scrollTrigger);
        });
    }
    function initializeProductsAnimation() {
    if (typeof gsap === 'undefined') { console.error('GSAP not loaded.'); return; }
    
    // Animate hero text
    gsap.from('.prod-hero-content > *', {
        autoAlpha: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    });

    // Animate intro text on scroll
    gsap.from('.prod-intro p', {
        scrollTrigger: {
            trigger: '.prod-intro',
            start: 'top 80%',
        },
        autoAlpha: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Staggered card animation on scroll
    gsap.from('.prod-grade-item', {
        scrollTrigger: {
            trigger: '.prod-grades-grid',
            start: 'top 80%',
        },
        autoAlpha: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });
}
    // --- INITIALIZATION ---
    showPage('home');
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- GSAP-POWERED HISTORY STORYBOOK ---
    function initializeHistoryAnimation() {
        if (typeof gsap === 'undefined') { console.error('GSAP not loaded.'); return; }
        gsap.registerPlugin(ScrollTrigger);
        
        const container = document.querySelector(".history-container");
        const track = document.querySelector(".history-track");
        const chapters = gsap.utils.toArray(".history-chapter");
        const progressBar = document.querySelector(".progress-bar-fill");
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!track || chapters.length === 0) {
            console.error("History elements not found for animation.");
            return;
        }

        gsap.set(chapters.map(c => c.querySelector('.chapter-content > *')), { autoAlpha: 0, y: 30 });
        gsap.set(chapters.map(c => c.querySelector('.chapter-line')), { scaleX: 0 });
        
        const xTo = gsap.quickTo(container, "background-position-x", { duration: 0.8, ease: "power2.out" });
        const yTo = gsap.quickTo(container, "background-position-y", { duration: 0.8, ease: "power2.out" });
        const bgParallax = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            xTo(`calc(50% + ${x * 3}%)`);
            yTo(`calc(50% + ${y * 3}%)`);
        };
        container.addEventListener('mousemove', bgParallax);

        historyMainTween = gsap.to(track, {
            xPercent: -100 * (chapters.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1.5,
                end: () => "+=" + (track.offsetWidth - window.innerWidth),
                invalidateOnRefresh: true,
                onUpdate: self => {
                    if (progressBar) { gsap.set(progressBar, { width: (self.progress * 100) + "%" }); }
                    if(scrollIndicator) { scrollIndicator.classList.toggle('hidden', self.progress > 0.01); }
                },
                onKill: () => { container.removeEventListener('mousemove', bgParallax); }
            }
        });

        chapters.forEach((chapter) => {
            const content = chapter.querySelector('.chapter-content');
            const line = content.querySelector('.chapter-line');
            const elements = [ content.querySelector('.chapter-year'), content.querySelector('h2'), content.querySelector('p') ];
            gsap.timeline({
                scrollTrigger: {
                    trigger: chapter,
                    start: "left 70%",
                    end: "left 40%",
                    containerAnimation: historyMainTween,
                    toggleActions: "play reverse play reverse",
                }
            })
            .to(line, { scaleX: 1, duration: 0.8, ease: "power2.inOut" })
            .to(elements, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" }, "-=0.5");
        });
    }

    // --- WHAT WE DO PAGE ANIMATIONS ---
    function initializeWWDAnimation() {
        if (typeof gsap === 'undefined') { console.error('GSAP not loaded.'); return; }
        
        // Animate hero text
        let heroST = gsap.from('.wwd-hero-content', {
            autoAlpha: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
        wwdAnimations.push(heroST);

        // Animate intro text on scroll
        let introST = gsap.from('.wwd-intro p', {
            scrollTrigger: {
                trigger: '.wwd-intro',
                start: 'top 80%',
            },
            autoAlpha: 0,
            y: 40,
            duration: 1,
            ease: 'power2.out'
        });
        wwdAnimations.push(introST.scrollTrigger);
        
        // Staggered card animation on scroll
        let cardsST = gsap.from('.wwd-card', {
            scrollTrigger: {
                trigger: '.wwd-cards-grid',
                start: 'top 80%',
            },
            autoAlpha: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
        wwdAnimations.push(cardsST.scrollTrigger);
    }

     // --- SUSTAINABILITY PAGE ANIMATIONS ---
    function initializeSustainabilityAnimation() {
        if (typeof gsap === 'undefined') { return; }

        let heroST = gsap.from('#sustainability-page .wwd-hero-content > *', { autoAlpha: 0, y: 40, stagger: 0.2, duration: 1, ease: 'power2.out' });
        pageAnimations.push(heroST);

        let introST = gsap.from('#sustainability-page .wwd-intro p', { scrollTrigger: { trigger: '#sustainability-page .wwd-intro', start: 'top 80%' }, autoAlpha: 0, y: 40, stagger: 0.2, duration: 1, ease: 'power2.out' });
        pageAnimations.push(introST.scrollTrigger);

        let cardsST = gsap.from('#sustainability-page .wwd-card', { scrollTrigger: { trigger: '#sustainability-page .sus-cards-grid', start: 'top 80%' }, autoAlpha: 0, y: 50, duration: 0.8, stagger: 0.2, ease: 'power2.out' });
        pageAnimations.push(cardsST.scrollTrigger);
    }
});