document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const fullscreenMenu = document.getElementById("fullscreen-menu");
  const searchToggle = document.getElementById("search-toggle");
  const searchModal = document.getElementById("search-modal");
  const searchClose = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
 const pageLinks = document.querySelectorAll('a.nav-link');
  const pageContent = document.querySelectorAll(".page-content");
  const cards = document.querySelectorAll('.highlight-card');
  const body = document.body;
    const heroSection = document.getElementById("home");
    const slides = document.querySelectorAll(".hero-slide");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const numberNavButtons = document.querySelectorAll(".slider-num-btn");
    const tabLinks = document.querySelectorAll('.tab-link-modern');
    const tabPanels = document.querySelectorAll('.tab-content-panel-modern');
    const sectionNavLinks = document.querySelectorAll('.section-nav a');
    const pageSections = document.querySelectorAll('.page-section');
    const esgCards = document.querySelectorAll('.esg-card');
    const scrollToTopBtn = document.getElementById('scroll-to-top');


    const tabLinks1 = document.querySelectorAll('#who-we-are .intro-subnav .tab-link');
    const tabContents = document.querySelectorAll('#who-we-are > .tab-content');

      initializeEsgSection(); 

            // --- Slider Class (Existing functionality) ---
    class HeroSlider {
        constructor(duration) {
            this.currentSlide = 0;
            this.isPlaying = true;
            this.slideDuration = duration;
            this.timer = null;
            this.animationFrame = null;
            this.startTime = null;
            this.playPauseIcon = playPauseBtn.querySelector("i");
            this.totalSlides = slides.length;
            this.circumference = 2 * Math.PI * 25;

            this.init();
        }

        updateProgress() {
            if (!this.isPlaying) return;
            const elapsed = Date.now() - this.startTime;
            const progress = elapsed / this.slideDuration;
            const activeCircle = numberNavButtons[this.currentSlide].querySelector('.progress-ring-circle');
            activeCircle.style.strokeDashoffset = this.circumference * (1 - progress);
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(this.updateProgress.bind(this));
            }
        }

        goTo(slideIndex) {
            cancelAnimationFrame(this.animationFrame);
            clearTimeout(this.timer);
            slides[this.currentSlide].classList.remove("active");
            numberNavButtons[this.currentSlide].classList.remove("active");
            this.currentSlide = (slideIndex + this.totalSlides) % this.totalSlides;
            slides[this.currentSlide].classList.add("active");
            numberNavButtons[this.currentSlide].classList.add("active");
            document.querySelectorAll('.progress-ring-circle').forEach(circle => {
                circle.style.transition = 'none';
                circle.style.strokeDashoffset = this.circumference;
            });
            if (this.isPlaying) this.play();
        }

        play() {
            clearTimeout(this.timer);
            cancelAnimationFrame(this.animationFrame);
            this.isPlaying = true;
            heroSection.classList.remove('hero-paused');
            this.playPauseIcon.classList.remove("fa-play");
            this.playPauseIcon.classList.add("fa-pause");
            this.startTime = Date.now();
            this.timer = setTimeout(() => this.next(), this.slideDuration);
            this.animationFrame = requestAnimationFrame(this.updateProgress.bind(this));
        }

        pause() {
            this.isPlaying = false;
            heroSection.classList.add('hero-paused');
            this.playPauseIcon.classList.remove("fa-pause");
            this.playPauseIcon.classList.add("fa-play");
            clearTimeout(this.timer);
            cancelAnimationFrame(this.animationFrame);
        }

        next() {
            this.goTo(this.currentSlide + 1);
        }

        init() {
            playPauseBtn.addEventListener("click", () => this.isPlaying ? this.pause() : this.play());
            numberNavButtons.forEach((navEl, index) => navEl.addEventListener("click", () => this.goTo(index)));
            this.goTo(0);
        }
    }

    if (slides.length > 0) new HeroSlider(5000);

     function hideAllTabs() {
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });
    }
     function deactivateAllTabLinks() {
        tabLinks1.forEach(link => {
            link.classList.remove('active');
        });
    }

     tabLinks1.forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.getAttribute('data-tab');
            const contentToShow = document.getElementById(`${tab}-content`);

            // Update the visual state
            deactivateAllTabLinks();
            hideAllTabs();
            
            link.classList.add('active');
            if (contentToShow) {
                contentToShow.classList.remove('hidden');
            }
        });
    });

    // Ensure the "Overview" tab is active on page load
    hideAllTabs();
    document.getElementById('overview-content').classList.remove('hidden');

      const historySliderTrack = document.querySelector('.history-slider-track');
        if (historySliderTrack) {
            const historySlides = Array.from(historySliderTrack.children);
            const nextButton = document.getElementById('history-next');
            const prevButton = document.getElementById('history-prev');
            let slideIndex = 0;

            const updateSliderPosition = () => {
                const slideWidth = historySlides[0].getBoundingClientRect().width;
                historySliderTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            };

            nextButton.addEventListener('click', () => {
                slideIndex = (slideIndex + 1) % historySlides.length;
                updateSliderPosition();
            });

            prevButton.addEventListener('click', () => {
                slideIndex = (slideIndex - 1 + historySlides.length) % historySlides.length;
                updateSliderPosition();
            });

            // Adjust slider on window resize
            window.addEventListener('resize', updateSliderPosition);
        }

        // --- Logic for the NEW Interactive Timeline ---
        const yearButtons = document.querySelectorAll('.timeline-year-btn');
        const eventGroups = document.querySelectorAll('.timeline-event-group');

        yearButtons.forEach(button => {
            button.addEventListener('click', () => {
                const year = button.getAttribute('data-year');

                // Update active state for buttons
                yearButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Show the corresponding event group
                eventGroups.forEach(group => {
                    if (group.id === `events-${year}`) {
                        group.classList.add('active');
                    } else {
                        group.classList.remove('active');
                    }
                });
            });
        });

         window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

  // Define all pages and their content for the in-memory search index
  const pages = [
    {
      title: "Who We Are",
      url: "#about",
      content:
        "Welcome to Falco Corporation - a dynamic force in the energy trading landscape. Founded in United Arab Emirates in 2021, Falco Corporation has evolved into a leading player in the oil and energy sector. Diversified Operations: Integration of oilfield development, overseas terminals, shipping management, and import/export trade. Comprehensive expertise as a dynamic energy trading company. Versatility in International Business: Engaged in diverse sectors such as crude oil import and export trade, crude oil refining, supply chain trade, and oil fields. Visionary Approach: At Falco Corporation, we embrace innovation, sustainability, and excellence. Our commitement extends beyond borders, creating a global impact in the energy trading arena.",
    },
    {
      title: "What We Do",
      url: "#what-we-do",
      content:
        "Our expertise spans the entire value chain. Each business area is a vital component of our integrated approach, working in synergy to deliver excellence in the global energy market. Oilfield Development & Terminals: We build our foundation on developing and acquiring oil fields, complemented by the strategic operation of overseas storage terminals. Shipping & Logistics: Acting as the logistical backbone, we manage complex global transit to ensure the safe and timely movement of energy products. Import & Export Trade: We are deeply engaged in the global trade of diverse energy products, highlighting our breakthroughs and strong market presence. Energy Trading & Supply Chain: As a dynamic trading company, we forge strategic cooperation in the supply chain to optimize performance and maximize profitability.",
    },
    {
      title: "Products & Solutions",
      url: "#products",
      content:
        "At Falco Corporation, our commitment to innovation is reflected in our diverse product portfolio. Starting historically with crude oil, we have consistently expanded our offerings to include a range of essential energy products. Crude Oil, Fuel Oil, LPG, Diesel. The foundation of our legacy, we continue to excel in the procurement and trading of crude oil. Our expertise extends to fuel oil, catering to the varied needs of industries with reliable and quality supplies. Falco Corporation is a trusted source for LPG, providing a clean and efficient energy solution. With a focus on quality and efficiency, our diesel offerings meet the highest industry standards. As we evolve, Falco remains dedicated to exploring new frontiers and expanding our product portfolio to meet the dynamic demands of the energy market.",
    },
    {
      title: "Global Reach",
      url: "#global-reach",
      content:
        "In the dynamic landscape of international business, Falco Corporation has not only expanded its operations globally since 2021 but has also excelled in managing complexities inherent in diverse market. Key Achievements: Global Reach: Successfully expanded operations worldwide, establishing a strong presence in Europe, the US, Singapore, China, Malaysia, the Middle East, and South America. Specialization in Challenging Environments: Falco's expertise lies in procuring from complex and politically unstable environments. Deep understanding of appropriate conduct ensures safe and ethical business practices. Optimized Performance: Falco's well-rounded expertise enables the group to navigate challenging environments with safe conduct, ensuring optimized performance in trading various energy products. Strategic Growth Execution: The execution of a successful growth strategy has propelled Falco Corporation into new territories, fostering growth and prosperity. Future Outlook: As we continue to adapt and thrive in diverse markets, Hannon remains committed to setting benchmarks in global energy trading.",
    },
    {
      title: "Future Goals",
      url: "#future-goals",
      content:
        "At Falco Corporation, our vision extends beyond the present achievements as we strategically chart our course for the future. In the coming phases, our focus will be on four key aspects: Ports: Comprehensive development of in-port vehicles and ships. Strategic initiatives to maximize the operational efficiency of our ports. Oil Fields: Aggressive development and acquisition in the field of oil exploration and production. Leveraging our expertise to capitalize on the opportunities within the oil field sector. Supply Chain Business: Utilizing the complementary advantages of our self-operated oil export terminals. Forging strategic business cooperation in the oil product supply chain. Diversified Operation of Oil Products: Capitalizing on our comprehensive strengths, including capital, oil product resources, and port location advantages. Deepening involvement in oil product export trade, warehousing, and ship supply businesses.",
    },
    {
      title: "History",
      url: "#history",
      content:
        "In May 2020, initiated the export of asphalt mixtures and fuel oil. Completed the first trade of foreign trade asphalt mixtures in August and September, delivering 500,000 barrels-a major breakthrough in business scope. Market Development and Partnerships: Successfully developed markets in Shandong and Northeast China for fuel oil and bitumen mixture. Established deals with key partners such as PanjinYijiu Petrochemical Co., Ltd. and Baolai Bioenergy. Secured the oil from Hebei Lunt Group. Infrastructure and Export Achievement: Achieved a significant milestone with a monthly export of approximately 600,000 tons.",
    },
    {
      title: "Sustainability",
      url: "#sustainability",
      content:
        "Committed to responsible practices that safeguard our planet and support the global energy transition. Falco is dedicated to safe, ethical trading and pioneering cleaner energy solutions. We adhere to the highest Environmental, Social, and Governance (ESG) standards and responsible practices to ensure a sustainable future for our industry and the communities we serve. Our strategy focuses on reducing our operational footprint, investing in renewable energy, and promoting a culture of safety and responsibility across our entire value chain.",
    },
    {
      title: "Leadership & Team",
      url: "#teams",
      content:
        "At Falco Corporation, our success is fuelled by a team of seasoned professionals, carefully selected for their expertise, leadership, and rich industry resources. Key Team Features: Unique Trade Partnership Modes: Innovative and effective trade partnership modes drive our success, ensuring dynamic and mutually beneficial collaborations. Leadership Excellence: Led by senior professional managers, our leadership brings a wealth of experience and industry insights to guide our strategic direction. Partnership Alliance: We believe in building lasting relationships based on trust, integrity, and mutual benefit.",
    },
    {
      title: "Careers",
      url: "#careers",
      content:
        "We are seeking talented and dedicated individuals to join our team.",
    },
    {
      title: "Contact",
      url: "#contact",
      content:
        "Get in touch with us for inquiries or to learn more about our services.",
    },
  ];

function initializeMegaMenu() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return; // Exit if not on a page with the mega menu

    const mainLinks = navContainer.querySelectorAll('.nav-main-link');
    const subMenus = navContainer.querySelectorAll('.nav-sub-menu');

    mainLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Remove active state from all items first
            mainLinks.forEach(l => l.classList.remove('active'));
            subMenus.forEach(m => m.classList.remove('active'));

            // Add active state to the hovered link
            link.classList.add('active');
            
            // Get the target sub-menu from the data attribute
            const targetId = link.dataset.menuTarget;
            if (targetId) {
                const targetMenu = document.getElementById(`menu-${targetId}`);
                if (targetMenu) {
                    targetMenu.classList.add('active');
                }
            }
        });
    });
}

const esgContainer = document.querySelector('.esg-strategy-container');
    if (esgContainer) {
        const esgCards = esgContainer.querySelectorAll('.esg-card');

        esgCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Remove 'expanded' from all cards
                esgCards.forEach(c => c.classList.remove('expanded'));
                // Add 'expanded' to the hovered card
                card.classList.add('expanded');
            });
        });

        // Add a listener to the container to reset to default when the mouse leaves
        esgContainer.addEventListener('mouseleave', () => {
            esgCards.forEach(c => c.classList.remove('expanded'));
            // Make the first card the default expanded one
            if (esgCards.length > 0) {
                esgCards[0].classList.add('expanded');
            }
        });
    }

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', initializeMegaMenu);

 function initializeStatCounters(containerSelector) {
        const statNumbers = document.querySelectorAll(`${containerSelector} .stat-number[data-target]`);
        if (statNumbers.length === 0) return;

        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.getAttribute('data-target');
                    if (isNaN(target)) return;

                    let current = 0;
                    const increment = target > 1000 ? target / 200 : target / 100;

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            el.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            el.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(number => statObserver.observe(number));
    }

// Function to handle the new tabbed content section
function initializeTabbedContent(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Use the new class names
    const tabs = container.querySelectorAll('.tab-link-modern');
    const panels = container.querySelectorAll('.tab-content-panel-modern');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetId) {
                    panel.classList.add('active');
                }
            });
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }
}


// And update the call inside initializePageScripts('home')
// Make sure this is called inside your page initialization logic for the home page.
initializeTabbedContent('#home .tabs-container-modern');



    const mainTabs = document.querySelectorAll('#product-main-tabs .tab-link');
    const mainContents = document.querySelectorAll('.page-content > .tab-content');

    // Function to handle secondary tabs within a container
    function initializeProductTabs(container) {
        const productTabLinks = container.querySelectorAll('.product-tab-link');
        const productPanels = container.querySelectorAll('.product-panel');

        productTabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetPanelId = link.getAttribute('data-product-tab') + '-panel';

                // Update active link
                productTabLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show target panel
                productPanels.forEach(panel => {
                    panel.classList.toggle('active', panel.id === targetPanelId);
                });
            });
        });
    }

    // Main Tab Logic
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetContentId = tab.getAttribute('data-tab') + '-content';

            // Update main tab active state
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show target main content block
            mainContents.forEach(content => {
                content.classList.toggle('hidden', content.id !== targetContentId);
            });
        });
    });
    
    // Initialize secondary tabs for both main sections
    if (document.getElementById('products-content')) {
        initializeProductTabs(document.getElementById('products-content'));
    }
    if (document.getElementById('services-content')) {
        initializeProductTabs(document.getElementById('services-content'));
    }

   
  // Functions for page and title management
  function setPage(pageId) {
    pageContent.forEach((page) => page.classList.add("hidden"));
    const currentPage = document.getElementById(pageId);
    if (currentPage) {
      currentPage.classList.remove("hidden");
      const pageTitle = currentPage.getAttribute("data-page-title");
      document.title = `Falco Corporation | ${pageTitle}`;
      window.scrollTo({ top: 0, behavior: "instant" });
      initializePageScripts(pageId);
    }
  }

  function handleNavigation(event) {
    event.preventDefault();
    const url = event.target.closest("a").getAttribute("href");
    let pageId = url.substring(url.indexOf("#") + 1);

    // Handle the special case for #news
    if (pageId.includes("news")) {
      pageId = "home";
    }

    setPage(pageId);
    window.history.pushState(null, "", url);
  }

  // Bind navigation events
  pageLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // Handle back/forward browser buttons
  window.addEventListener("popstate", () => {
    const url = window.location.href;
    let pageId = url.substring(url.indexOf("#") + 1);
    if (!pageId) {
      pageId = "home";
    }
    setPage(pageId);
  });

  // Initial page load
  const initialPageId = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
  setPage(initialPageId);
  window.history.replaceState(null, "", "#" + initialPageId);

  // Function to initialize scripts for specific pages
  function initializePageScripts(pageId) {
   if (pageId === 'about') {

        // --- 1. Full-Screen Story Overlay Logic ---
        const storyOverlay = document.getElementById('story-overlay');
        const storyTriggerButton = document.getElementById('story-trigger-button');
        const storyCloseBtn = document.getElementById('story-close-btn');
        const storyNav = document.getElementById('story-nav');
        const storyContentArea = document.getElementById('story-content-area');
        const storyImage = document.getElementById('story-image');
        const storyTitle = document.getElementById('story-title');
        const storyText = document.getElementById('story-text');
        const storyPrevBtn = document.getElementById('story-prev-btn');
        const storyNextBtn = document.getElementById('story-next-btn');
        const valueCards = document.querySelectorAll('.value-card-modern');
        let currentStoryIndex = 0;

        // --- 4. 3D Tilt Effect for Value Cards ---
document.querySelectorAll('.value-card-modern').forEach(card => {
    const content = card.querySelector('.card-content-wrapper');
    const intensity = 15;
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -intensity;
        const rotateY = ((x / rect.width) - 0.5) * intensity;
        content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        content.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});

        const storyData = [
            {
                navTitle: '01 From a Standing Start',
                title: 'A Vision for Global Trade',
                text: 'Founded in the UAE in 2021, Falco Corporation was born from a vision to create a more efficient and integrated global energy market. Our journey began with a clear purpose: to connect vital resources to the world.',
                image: 'images/4218ff09-9fe4-4b8e-8a6b-f9a1dd438b17.jpg' // Replace with your image path
            },
            {
                navTitle: '02 Our Core Operations',
                title: 'Integrated Energy Solutions',
                text: 'Our success is built on the seamless integration of oilfield development, overseas terminals, and expert shipping management. This comprehensive approach allows us to manage the entire supply chain with precision and reliability.',
                image: 'images/310945bc70f82fbadf19f05e6dec20c8.JPG' // Replace with your image path
            },
            {
                navTitle: '03 Expanding Horizons',
                title: 'Versatility in a Dynamic Market',
                text: 'We are actively engaged in diverse sectors, from crude oil refining and trade to pioneering new supply chain strategies. Our versatility ensures we thrive in the ever-changing international energy landscape.',
                image: 'images/storyimage2.jpg' // Replace with your image path
            },
            {
                navTitle: '04 Looking to the Future',
                title: 'A Commitment to Excellence',
                text: 'At Falco Corporation, we embrace innovation, sustainability, and excellence. We continue to set new standards, forge lasting partnerships, and create a lasting impact in the global energy trading arena.',
                image: 'images/01feef42-7a30-44ea-aefa-8243d08b99d5.jpg' // Replace with your image path
            }
        ];

        function buildStoryNav() {
            storyNav.innerHTML = '';
            storyData.forEach((item, index) => {
                const navItem = document.createElement('a');
                navItem.classList.add('story-nav-item', 'block', 'text-lg');
                navItem.dataset.index = index;
                navItem.innerHTML = `<span>${item.navTitle}</span>`;
                navItem.addEventListener('click', () => setStoryStep(index));
                storyNav.appendChild(navItem);
            });
        }

        function setStoryStep(index) {
            currentStoryIndex = index;
            const data = storyData[index];

            storyContentArea.classList.add('story-content-fade-out');
            
            setTimeout(() => {
                storyTitle.textContent = data.title;
                storyText.textContent = data.text;
                storyImage.src = data.image;

                document.querySelectorAll('.story-nav-item').forEach((nav, i) => {
                    nav.classList.toggle('active', i === index);
                });

                storyPrevBtn.disabled = index === 0;
                storyNextBtn.disabled = index === storyData.length - 1;
                
                storyContentArea.classList.remove('story-content-fade-out');
                storyContentArea.classList.add('story-content-fade-in');
            }, 200);

            storyContentArea.addEventListener('transitionend', () => {
                 storyContentArea.classList.remove('story-content-fade-in');
            }, { once: true });
        }

       storyTriggerButton.addEventListener('click', () => {
    storyOverlay.classList.add('is-open');
    buildStoryNav();
    setStoryStep(0);
});

storyCloseBtn.addEventListener('click', () => {
    storyOverlay.classList.remove('is-open');
});
        storyPrevBtn.addEventListener('click', () => {
            if (currentStoryIndex > 0) setStoryStep(currentStoryIndex - 1);
        });
        
        storyNextBtn.addEventListener('click', () => {
            if (currentStoryIndex < storyData.length - 1) setStoryStep(currentStoryIndex + 1);
        });

        // --- 2. Animated Stat Counter Logic ---
        const statNumbers = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.getAttribute('data-target');
                    let current = 0;
                    const increment = target > 1000 ? target / 200 : target / 100;

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            el.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            el.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(number => statObserver.observe(number));

        // --- 3. Simple Modal for Stats & Values ---
        const modal = document.getElementById('info-modal');
        const modalContainer = document.getElementById('modal-container');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');

        const modalData = {
            founded: { title: 'Founded in 2021', content: `<p>Falco Corporation was established in the United Arab Emirates with a clear ambition—to become a leader in the global oil and gas trading industry. Our strategic location and expert team have enabled rapid growth from day one.</p>` },
            continents: { title: 'Serving 5+ Continents', content: `<p>Our operations span across Asia, the Middle East, North and South America, Europe, and Africa. This extensive network allows us to connect supply with demand efficiently and reliably, navigating complex markets with agility.</p>` },
            experience: { title: '60+ Years of Combined Experience', content: `<p>Though Falco is a young company, our strength lies in the deep experience of our people. Our leadership and core team bring over 60 years of combined expertise in global energy trading, logistics, and supply chain management. This legacy of knowledge ensures that every decision is guided by proven capability.</p>` },
            partners: { title: 'Over 100 Global Partners', content: `<p>We have built a robust network of over 100 trusted partners worldwide, including producers, refiners, and distributors. These strong relationships are the bedrock of our business, enabling us to deliver value and reliability across the supply chain.</p>` },
            innovation: { title: 'Our Value: Innovation', content: `<p>We embrace new technologies and forward-thinking strategies to stay ahead in a dynamic market. Innovation drives our efficiency, helps us manage risk, and allows us to provide creative solutions to our partners.</p>` },
            trust: { title: 'Our Value: Trust', content: `<p>Trust is the cornerstone of our relationships. We are committed to transparency, integrity, and reliability in all our dealings, ensuring that our partners view us as a dependable and ethical player in the industry.</p>` },
            sustainability: { title: 'Our Value: Sustainability', content: `<p>We are dedicated to responsible practices that support the global energy transition. By adhering to high ESG standards and investing in cleaner energy solutions, we aim to safeguard the planet for future generations.</p>` },
            partnerships: { title: 'Our Value: Partnerships', content: `<p>We believe in the power of collaboration. We build strong, long-term partnerships based on mutual respect and shared goals, working together to achieve success and create lasting value.</p>` }
        };

        function openModal(triggerKey) {
            const data = modalData[triggerKey];
            if (data) {
                modalTitle.textContent = data.title;
                modalContent.innerHTML = data.content;
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => modal.classList.add('visible'), 10);
            }
        }

        function closeModal() {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                openModal(trigger.dataset.modalTrigger);
            });
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        // --- 4. Leaflet Map Initialization ---
        var map = L.map('map-about', { scrollWheelZoom: false }).setView([25, 10], 2);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
        }).addTo(map);

        var hqIcon = L.divIcon({ className: 'custom-div-icon', html: '<div style="background-color:#3b82f6; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 8px rgba(0,0,0,0.5);"></div>', iconSize: [20, 20], iconAnchor: [10, 10] });
        var customIcon = L.divIcon({ className: 'custom-div-icon', html: '<div style="background-color:white; width:15px; height:15px; border-radius:50%; border:2px solid #3b82f6;"></div>', iconSize: [15, 15], iconAnchor: [7.5, 7.5] });

        var hq = { name: 'Headquarters (Middle East)', coords: [25.27, 55.29] };
        var locations = [
            { name: 'Europe', coords: [51.50, -0.12] },
            { name: 'United States', coords: [29.76, -95.36] },
            { name: 'Singapore', coords: [1.35, 103.81] },
            { name: 'China', coords: [31.23, 121.47] },
            { name: 'South America', coords: [-22.90, -43.17] }
        ];

        L.marker(hq.coords, { icon: hqIcon, title: hq.name }).addTo(map).bindPopup('<b>' + hq.name + '</b>');
        locations.forEach(function (location) {
            L.marker(location.coords, { icon: customIcon, title: location.name }).addTo(map).bindPopup('<b>' + location.name + '</b>');
            L.polyline([hq.coords, location.coords], { color: '#3b82f6', weight: 1.5, opacity: 0.5, dashArray: '5, 5' }).addTo(map);
        });
    }
    if (pageId === 'products') {
    const sliderTrack = document.querySelector('.colorful-slider-track');
    if (sliderTrack) {
        const slides = Array.from(sliderTrack.children);
        const nextButton = document.getElementById('colorful-slider-next');
        const prevButton = document.getElementById('colorful-slider-prev');
        let currentSlideIndex = 0;
        const totalSlides = slides.length;

        const updateSlider = () => {
            const slideWidth = slides[0]?.getBoundingClientRect().width;
            if (slideWidth > 0) {
                sliderTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
            }
            prevButton.disabled = currentSlideIndex === 0;
            nextButton.disabled = currentSlideIndex === totalSlides - 1;
        };

        nextButton.addEventListener('click', () => {
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                updateSlider();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlider();
            }
        });

        // Ensure slider is correctly positioned on load and resize
        setTimeout(updateSlider, 100);
        window.addEventListener('resize', updateSlider);
    }
}

if (pageId === 'history') {
        const historyCards = document.querySelectorAll('.history-card');
        const modal = document.getElementById('history-modal');
        const modalContainer = document.getElementById('history-modal-container');
        const modalCloseBtn = document.getElementById('history-modal-close-btn');
        const modalBackdrop = modal.querySelector('.modal-backdrop');

        if (historyCards.length > 0 && modal) {
            historyCards.forEach(card => {
                card.addEventListener('click', () => {
                    // 1. Get content from the clicked card
                    const iconHTML = card.querySelector('.card-icon').innerHTML;
                    const titleText = card.querySelector('.card-title').textContent;
                    const mainText = card.querySelector('.card-text').textContent;
                    const styleClass = card.className.match(/style-\d/)[0];

                    // 2. Populate the modal
                    document.getElementById('modal-icon-placeholder').innerHTML = iconHTML;
                    document.getElementById('modal-title-placeholder').textContent = titleText;
                    document.getElementById('modal-text-placeholder').textContent = mainText;
                    
                    // 3. Apply the correct color style
                    modalContainer.className = 'relative w-full max-w-2xl text-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 transform scale-95 opacity-0'; // Reset classes
                    modalContainer.classList.add(styleClass);

                    // 4. Show the modal
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    setTimeout(() => {
                        modal.classList.add('visible');
                    }, 10); // Short delay to allow display property to apply before transition
                });
            });

            const closeModal = () => {
                modal.classList.remove('visible');
                 setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }, 400); // Match the duration of the transform transition
            };

            modalCloseBtn.addEventListener('click', closeModal);
            modalBackdrop.addEventListener('click', closeModal);
        }
    }
if (pageId === 'global-reach') {
    // --- 1. Initialize Leaflet Map (if it's still needed, or can be removed) ---
    const mapContainer = document.getElementById('map-global');
    if (mapContainer && typeof L !== 'undefined') {
        const mapGlobal = L.map("map-global", {
            scrollWheelZoom: false,
            zoomControl: false,
            dragging: false,
            attributionControl: false
        }).setView([25, 40], 2);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>',
        }).addTo(mapGlobal);
        // You can add markers here if you wish
    }

    // --- 2. Logic for the Modal with Accordion ---
    const modalTrigger = document.getElementById('global-reach-modal-trigger');
    const modal = document.getElementById('global-reach-modal');
    if (modalTrigger && modal) {
        const modalCloseBtn = modal.querySelector('.modal-close-btn');
        const modalBackdrop = modal.querySelector('.modal-backdrop');
        const accordionItems = modal.querySelectorAll('.accordion-item');

        const openModal = () => {
            modal.classList.add('is-open');
        };

        const closeModal = () => {
            modal.classList.remove('is-open');
             // Close any open accordion items when modal closes
            accordionItems.forEach(item => {
                item.classList.remove('open');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });
        };

        modalTrigger.addEventListener('click', openModal);
        modalCloseBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);

        // Accordion logic inside the modal
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all other items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                });

                // Open the clicked item if it wasn't already open
                if (!isOpen) {
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }
}
     if (pageId === 'home') {
        initializeStatCounters('#home');
        initialize3DTilt('#home'); 
        initializeTabbedContent('#home .tabs-container');
    }
    // Add this inside your initializePageScripts(pageId) function
if (pageId === 'what-we-do') {
    // --- 1. Logic for the Colorful Slider ---
    const sliderTrack = document.querySelector('.colorful-slider-track');
    if (sliderTrack) {
        // (This logic remains the same as before)
        const slides = Array.from(sliderTrack.children);
        const nextButton = document.getElementById('colorful-slider-next');
        const prevButton = document.getElementById('colorful-slider-prev');
        let currentSlideIndex = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;

        const updateSlider = () => {
            const slideWidth = slides[0]?.getBoundingClientRect().width;
            if (slideWidth > 0) {
                sliderTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
            }
            prevButton.disabled = currentSlideIndex === 0;
            nextButton.disabled = currentSlideIndex === totalSlides - 1;
        };

        const startAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                updateSlider();
            }, 4000);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        nextButton.addEventListener('click', () => {
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                updateSlider();
                resetAutoSlide();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlider();
                resetAutoSlide();
            }
        });
        
        setTimeout(updateSlider, 100);
        startAutoSlide();
        window.addEventListener('resize', () => {
            updateSlider();
            resetAutoSlide();
        });
    }

    // --- 2. NEW: Logic for Leaflet.js Map ---
    const mapContainer = document.getElementById('what-we-do-map');
    if (mapContainer) {
        const map = L.map('what-we-do-map', { scrollWheelZoom: false }).setView([25, 40], 2.5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
        }).addTo(map);

        const hqIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:#3b82f6; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 8px rgba(0,0,0,0.5);"></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10]
        });

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:white; width:15px; height:15px; border-radius:50%; border:2px solid #3b82f6;"></div>`,
            iconSize: [15, 15], iconAnchor: [7.5, 7.5]
        });

        const hq = { name: 'Headquarters (Middle East)', coords: [25.27, 55.29] };
        const locations = [
            { name: 'Europe Operations', coords: [51.50, -0.12] },
            { name: 'United States Hub', coords: [29.76, -95.36] },
            { name: 'Singapore Hub', coords: [1.35, 103.81] },
            { name: 'China Operations', coords: [31.23, 121.47] },
            { name: 'South America Operations', coords: [-22.90, -43.17] }
        ];

        L.marker(hq.coords, { icon: hqIcon }).addTo(map).bindPopup(`<b>${hq.name}</b>`).openPopup();
        locations.forEach(location => {
            L.marker(location.coords, { icon: customIcon }).addTo(map).bindPopup(`<b>${location.name}</b>`);
            L.polyline([hq.coords, location.coords], { color: '#3b82f6', weight: 1.5, opacity: 0.5, dashArray: '5, 5' }).addTo(map);
        });
    }

    // --- 3. UPDATED: Logic for Accordion (Dropdowns) ---
const accordionItems = document.querySelectorAll('.accordion-item');
if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            // Check if the current item is already open
            const isOpen = item.classList.contains('open');

            // Optional: Close all other accordion items first
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}
}

if (pageId === 'future-goals') {
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    const roadmapPanels = document.querySelectorAll('.roadmap-panel');
    const contentWrapper = document.querySelector('.roadmap-content-wrapper');

    if (roadmapSteps.length > 0 && contentWrapper) {
        // Function to set the active step
        const setActiveStep = (targetId) => {
            // Set active class on the step button
            roadmapSteps.forEach(step => {
                step.classList.toggle('active', step.dataset.target === targetId);
            });
            // Set active class on the content panel
            roadmapPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetId);
            });
            // Update the background effect on the wrapper
            contentWrapper.dataset.activeBg = targetId;
        };

        // Add click event listeners to each step button
        roadmapSteps.forEach(step => {
            step.addEventListener('click', () => {
                const targetId = step.dataset.target;
                setActiveStep(targetId);
            });
        });

        // Initialize the first step as active
        setActiveStep('goal-1');
    }
}
  }

  function initialize3DTilt(containerSelector) {
    document.querySelectorAll(`${containerSelector} .highlight-card`).forEach(card => {
        const content = card.querySelector('.highlight-card-inner');
        if (!content) return;
        
        const intensity = 10; // Adjust tilt intensity here

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -intensity;
            const rotateY = ((x / rect.width) - 0.5) * intensity;
            
            content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            content.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  menuToggle.addEventListener("click", () =>
    fullscreenMenu.classList.add("open")
  );
  menuClose.addEventListener("click", () =>
    fullscreenMenu.classList.remove("open")
  );
fullscreenMenu.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        fullscreenMenu.classList.remove("open");
    });
});

  searchToggle.addEventListener("click", () => {
    searchModal.classList.remove("hidden");
    searchModal.classList.add("flex");
    setTimeout(() => searchInput.focus(), 300);
  });
  searchClose.addEventListener("click", () => {
    searchModal.classList.add("hidden");
    searchModal.classList.remove("flex");
    searchInput.value = "";
    searchResults.innerHTML = "";
  });

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    searchResults.innerHTML = "";

    if (query.length > 1) {
      // Trigger search with at least 2 characters
      const filteredPages = pages.filter(
        (page) =>
          page.title.toLowerCase().includes(query) ||
          page.content.toLowerCase().includes(query)
      );

      if (filteredPages.length > 0) {
        filteredPages.forEach((page) => {
          const resultItem = document.createElement("a");
          resultItem.href = page.url;
          resultItem.classList.add(
            "block",
            "p-4",
            "hover:bg-gray-700",
            "rounded-lg",
            "transition-colors"
          );

          // Highlight the matching query in the result content
          const highlightedContent = page.content.replace(
            new RegExp(query, "gi"),
            (match) =>
              `<span class="bg-yellow-300 text-black px-1 rounded">${match}</span>`
          );

          resultItem.innerHTML = `<h3 class="font-bold text-xl">${page.title}</h3><p class="text-sm text-gray-400">${highlightedContent}</p>`;
          searchResults.appendChild(resultItem);
        });
      } else {
        searchResults.innerHTML =
          '<p class="text-gray-400">No results found.</p>';
      }
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => observer.observe(el));

  // Slider functionality for the home page
  const track = document.getElementById("slider-track");
  if (track) {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const items = document.querySelectorAll(".slider-item");
    let index = 0;
    const totalItems = items.length;
    let itemWidth =
      items.length > 0 ? items[0].getBoundingClientRect().width : 0;

    function updateSlider() {
      if (itemWidth > 0)
        track.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    function getVisibleSlides() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    nextBtn.addEventListener("click", () => {
      const maxIndex = totalItems - getVisibleSlides();
      if (index < maxIndex) {
        index++;
        updateSlider();
      }
    });
    prevBtn.addEventListener("click", () => {
      if (index > 0) {
        index--;
        updateSlider();
      }
    });

    window.addEventListener("resize", () => {
      itemWidth = items.length > 0 ? items[0].getBoundingClientRect().width : 0;
      const maxIndex = totalItems - getVisibleSlides();
      if (index > maxIndex) index = maxIndex;
      updateSlider();
    });
    itemWidth = items.length > 0 ? items[0].getBoundingClientRect().width : 0;
  }
  // A simple Intersection Observer to reveal elements on scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  const scrollObserver = new IntersectionObserver((entries, scrollObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll(".scroll-animate").forEach((element) => {
    scrollObserver.observe(element);
  });

  // --- Wavy Timeline Click Logic ---
        const wavyNodes = document.querySelectorAll('.wavy-timeline .wavy-node');

        if (wavyNodes.length > 0) {
            wavyNodes.forEach(node => {
                const circle = node.querySelector('.wavy-circle');
                circle.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevents click from bubbling up

                    // Check if the clicked node is already active
                    const isAlreadyActive = node.classList.contains('active');

                    // First, remove 'active' class from all other nodes
                    wavyNodes.forEach(n => {
                        if (n !== node) {
                            n.classList.remove('active');
                        }
                    });

                    // Then, toggle the 'active' class on the clicked node
                    node.classList.toggle('active');
                });
            });

            // Optional: Click outside to close any active node
            document.addEventListener('click', () => {
                wavyNodes.forEach(n => n.classList.remove('active'));
            });
        }
    });


// Add this entire function to your script.js file
function initializeEsgSection() {
    const esgContainer = document.getElementById('esg-section');
    // If the section doesn't exist on the current page, do nothing
    if (!esgContainer) return;

    const pages = esgContainer.querySelectorAll('.esg-page');
    const bottomBtns = esgContainer.querySelectorAll('.esg-nav-btn');
   
    let currentPageIndex = 0;
    let isScrolling = false; // A flag to prevent rapid scrolling

    function goToEsgPage(index) {
        // Prevent going out of bounds
        if (index < 0 || index >= pages.length || index === currentPageIndex) return;
        
        // Remove active classes from the previous page elements
        pages[currentPageIndex].classList.remove('active');
        bottomBtns[currentPageIndex].classList.remove('active');
      
        
        // Add active classes to the new page elements
        pages[index].classList.add('active');
        bottomBtns[index].classList.add('active');
      

        // Update the main container's background color from the data attribute
        const newBgColor = pages[index].dataset.bgColor || '#ffffff';
        esgContainer.style.backgroundColor = newBgColor;

        currentPageIndex = index;
    }

    // Add click event listeners to the bottom navigation buttons
    bottomBtns.forEach(btn => {
        btn.addEventListener('click', () => goToEsgPage(parseInt(btn.dataset.index)));
    });

  
    // Add mouse wheel event listener for scrolling between pages
    esgContainer.addEventListener('wheel', (e) => {
        if (isScrolling) return; // If already scrolling, ignore
        isScrolling = true;

        if (e.deltaY > 0) { // Scrolling down
            goToEsgPage(currentPageIndex + 1);
        } else { // Scrolling up
            goToEsgPage(currentPageIndex - 1);
        }

        // Set a timeout to reset the scrolling flag after the transition ends
        setTimeout(() => { isScrolling = false; }, 1200); 
    });

    // Initialize the first page on load
    if (pages.length > 0) {
       esgContainer.style.backgroundColor = pages[0].dataset.bgColor;
    }
}
