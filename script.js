/**
 * LinkPoint - Multi-Service Retail Website Engine
 * Pure Vanilla JavaScript (ES2022)
 * Mobile Phones · Printing Services · Books & Stationery
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configurable Shop Details (Placeholders clearly identified for shop owner)
  const SHOP_CONFIG = {
    businessName: 'LinkPoint',
    phoneDisplay: '+94 77 000 0000',
    phoneCall: '+94770000000',
    landlineDisplay: '+94 11 200 0000',
    landlineCall: '+94112000000',
    whatsappNumber: '94770000000', // Owner should replace with actual Sri Lankan mobile without '+' or spaces
    addressText: 'No. 142, Main Street, Colombo Road, Sri Lanka',
    openingHours: {
      weekday: '8:00 AM – 8:00 PM',
      sunday: '9:00 AM – 3:00 PM'
    }
  };

  const SVG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%230A192F'/%3E%3Ctext x='50%25' y='50%25' fill='%23FFFFFF' font-family='sans-serif' font-weight='bold' font-size='16' text-anchor='middle' dominant-baseline='middle'%3ELinkPoint Retail%3C/text%3E%3C/svg%3E";

  /* ==========================================================================
     1. Live Business Hours Calculator (Sri Lanka UTC+5:30)
     ========================================================================== */
  function updateBusinessStatus() {
    const statusTextEl = document.getElementById('shop-status-text');
    const statusDotEl = document.getElementById('shop-status-dot');
    if (!statusTextEl || !statusDotEl) return;

    try {
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const slOffset = 5.5 * 3600000;
      const slDate = new Date(utcTime + slOffset);

      const day = slDate.getDay();
      const hours = slDate.getHours();
      const minutes = slDate.getMinutes();
      const timeDecimal = hours + (minutes / 60);

      let isOpen = false;
      let statusMessage = '';

      if (day === 0) {
        isOpen = timeDecimal >= 9 && timeDecimal < 15;
        statusMessage = isOpen ? 'Open Today until 3:00 PM' : 'Closed · Opens Monday at 8:00 AM';
      } else {
        isOpen = timeDecimal >= 8 && timeDecimal < 20;
        statusMessage = isOpen ? 'Open Now until 8:00 PM' : 'Closed · Opens Tomorrow at 8:00 AM';
      }

      statusTextEl.textContent = statusMessage;
      if (isOpen) {
        statusDotEl.classList.remove('closed');
      } else {
        statusDotEl.classList.add('closed');
      }
    } catch {
      statusTextEl.textContent = 'Mon–Sat: 8 AM – 8 PM';
    }
  }
  updateBusinessStatus();

  /* ==========================================================================
     2. Sticky Header, Scroll Spy, Reading Progress & Back-to-Top Button
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  let isScrollTicking = false;

  function handleScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header scrolled state with hysteresis to prevent rapid flickering
    if (header) {
      if (scrollY > 25 && !header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
      } else if (scrollY < 10 && header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
      }
    }

    // Top Reading Scroll Progress Bar
    if (scrollProgressBar) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Floating Back-to-Top button appearance
    if (backToTopBtn) {
      const triggerThreshold = window.innerWidth <= 768 ? 260 : 380;
      if (scrollY > triggerThreshold) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Desktop-only Scroll Spy: Avoid expensive offsetTop reflows on mobile touch screens
    if (window.innerWidth > 960 && navLinks.length && sections.length) {
      const scrollPos = scrollY + 120;
      let currentSectionId = '';
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }

    isScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(handleScrollEffects);
      isScrollTicking = true;
    }
  }, { passive: true });

  handleScrollEffects();

  /* ==========================================================================
     3. Mobile Navigation Menu
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer || e.target.closest('a') || e.target.closest('.setup-guide-trigger')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  /* ==========================================================================
     4. Main Hero Carousel
     ========================================================================== */
  const carouselEl = document.getElementById('hero-carousel');
  if (carouselEl) {
    const slides = carouselEl.querySelectorAll('.carousel-slide');
    const dots = carouselEl.querySelectorAll('.carousel-dot');
    const prevBtn = carouselEl.querySelector('.carousel-nav-btn.prev');
    const nextBtn = carouselEl.querySelector('.carousel-nav-btn.next');
    const pauseToggleBtn = document.getElementById('carousel-pause-toggle');
    const pauseIcon = document.getElementById('pause-icon');
    const pauseText = document.getElementById('pause-text');

    let currentSlide = 0;
    let isPaused = false;
    let autoplayTimer = null;
    const slideDuration = 5500;

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
      }

      currentSlide = (index + slides.length) % slides.length;

      // Force animation reflow so background image Ken Burns zoom animation restarts smoothly
      slides[currentSlide].classList.remove('active');
      void slides[currentSlide].offsetWidth;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        // Trigger reflow to restart CSS progress countdown animation from 0%
        dots[currentSlide].classList.remove('active');
        void dots[currentSlide].offsetWidth;
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
      }
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoplay = () => {
      stopAutoplay();
      carouselEl.classList.remove('carousel-paused');
      if (!isPaused) {
        autoplayTimer = setInterval(nextSlide, slideDuration);
      }
    };

    const stopAutoplay = () => {
      carouselEl.classList.add('carousel-paused');
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoplay();
      });
    });

    pauseToggleBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) {
        stopAutoplay();
        if (pauseText) pauseText.textContent = 'Play';
        if (pauseIcon) {
          pauseIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
      } else {
        startAutoplay();
        if (pauseText) pauseText.textContent = 'Pause';
        if (pauseIcon) {
          pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        }
      }
    });

    // Pause on hover only when mouse/pointer hovering is actually supported
    carouselEl.addEventListener('mouseenter', () => {
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        stopAutoplay();
      }
    });
    carouselEl.addEventListener('mouseleave', () => {
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches && !isPaused) {
        startAutoplay();
      }
    });

    carouselEl.addEventListener('focusin', stopAutoplay);
    carouselEl.addEventListener('focusout', () => {
      if (!isPaused) startAutoplay();
    });

    carouselEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      }
    });

    // Mobile-optimized touch swipe handling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    carouselEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchEndX = touch.clientX;
      touchEndY = touch.clientY;
      touchStartTime = Date.now();
      stopAutoplay();
    }, { passive: true });

    carouselEl.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) return;
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const timeTaken = Date.now() - touchStartTime;

      // Only trigger horizontal slide transition when horizontal motion clearly dominates vertical scrolling
      const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.25;
      const isSignificantDistance = Math.abs(diffX) > 36 || (Math.abs(diffX) > 22 && timeTaken < 300);

      if (isHorizontalSwipe && isSignificantDistance) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      if (!isPaused) {
        startAutoplay();
      }
    }, { passive: true });

    startAutoplay();
  }

  /* ==========================================================================
     5. Mobile Phones Demonstration Inventory & Filter System
     ========================================================================== */
  const DEMO_PRODUCTS = [
    {
      id: 'phone-01',
      brand: 'Samsung',
      name: 'Galaxy A55 5G',
      category: 'smartphones',
      tag: 'Popular Seller',
      specs: '8GB RAM · 256GB Storage · 5000mAh · 50MP OIS Camera',
      displaySpecs: {
        display: '6.6" Super AMOLED, 120Hz',
        processor: 'Exynos 1480 (4nm)',
        storage: '8GB RAM + 256GB Internal',
        battery: '5,000 mAh (25W Fast Charge)',
        camera: '50MP Main OIS + 12MP Ultra-wide + 5MP Macro',
        warranty: '1 Year Company / Dealer Warranty (TRCSL Approved)'
      },
      priceLKR: 'Rs. 132,000',
      numericPrice: 132000,
      image: './images/phones/samsung-a55.jpg'
    },
    {
      id: 'phone-02',
      brand: 'Xiaomi',
      name: 'Redmi Note 13 Pro',
      category: 'smartphones',
      tag: 'Best Value',
      specs: '8GB RAM · 256GB Storage · 200MP Camera · 67W Turbo',
      displaySpecs: {
        display: '6.67" AMOLED, 120Hz, 1800 nits',
        processor: 'MediaTek Helio G99 Ultra',
        storage: '8GB RAM + 256GB Internal',
        battery: '5,000 mAh (67W in-box charger)',
        camera: '200MP Ultra-Clear OIS Camera',
        warranty: '1 Year Company Warranty (TRCSL Approved)'
      },
      priceLKR: 'Rs. 92,500',
      numericPrice: 92500,
      image: './images/phones/redmi-note13.jpg'
    },
    {
      id: 'phone-03',
      brand: 'Apple',
      name: 'iPhone 15 (128GB)',
      category: 'smartphones',
      tag: 'Premium Flagship',
      specs: 'Dynamic Island · A16 Bionic · 48MP Main · USB-C',
      displaySpecs: {
        display: '6.1" Super Retina XDR OLED',
        processor: 'A16 Bionic chip',
        storage: '128GB Storage',
        battery: 'All-day battery life (USB-C interface)',
        camera: '48MP Advanced Dual-Camera system',
        warranty: '1 Year Apple Authorized Warranty (TRCSL Approved)'
      },
      priceLKR: 'Rs. 265,000',
      numericPrice: 265000,
      image: './images/phones/iphone-15.jpg'
    },
    {
      id: 'acc-01',
      brand: 'Anker',
      name: 'PowerPort 25W PD Fast Wall Charger',
      category: 'accessories',
      tag: 'Genuine Quality',
      specs: 'USB-C Power Delivery · Compact Folding Pins · Surge Protection',
      displaySpecs: {
        display: 'Compatible with Samsung, iPhone & Xiaomi',
        processor: 'MultiProtect Safety System',
        storage: 'Single USB-C High-Speed Port',
        battery: 'Output: 5V=3A / 9V=2.77A',
        camera: 'Flame-retardant casing',
        warranty: '18 Months Replacement Warranty'
      },
      priceLKR: 'Rs. 6,800',
      numericPrice: 6800,
      image: './images/phones/anker-charger.jpg'
    },
    {
      id: 'acc-02',
      brand: 'Baseus',
      name: 'Heavy-Duty Braided Type-C to Type-C (100W)',
      category: 'accessories',
      tag: 'Durable Cable',
      specs: '2 Metre Length · 100W PD Flash Charge · E-Marker Chip',
      displaySpecs: {
        display: 'High-density nylon braided exterior',
        processor: 'Integrated Smart E-Marker Chip',
        storage: 'Supports 480Mbps Data Sync',
        battery: 'Up to 20V/5A 100W fast charging',
        camera: 'Zinc alloy reinforced connectors',
        warranty: '6 Months Replacement Warranty'
      },
      priceLKR: 'Rs. 2,900',
      numericPrice: 2900,
      image: './images/phones/typec-cable.jpg'
    },
    {
      id: 'acc-03',
      brand: 'ProArmor',
      name: '9H Tempered Glass + Camera Protector Kit',
      category: 'accessories',
      tag: 'Shop Installation Available',
      specs: 'Full Glue Edge-to-Edge · Oleophobic Coating · Scratch Resistant',
      displaySpecs: {
        display: 'High transparency HD Japanese Asahi glass',
        processor: '9H pencil hardness certified',
        storage: 'Dust-free bubble-free application',
        battery: 'Free professional precision fitting at shop counter',
        camera: 'Includes individual rear camera lens rings',
        warranty: 'Fitting guarantee at counter'
      },
      priceLKR: 'Rs. 1,450',
      numericPrice: 1450,
      image: './images/phones/tempered-glass.jpg'
    }
  ];

  const productGridEl = document.getElementById('product-grid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('phone-search');

  function renderProducts(items) {
    if (!productGridEl) return;
    productGridEl.innerHTML = '';

    if (items.length === 0) {
      productGridEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: #FFFFFF; border-radius: 12px; border: 1px dashed #CBD5E1;">
          <p style="font-weight: 700; color: #0F172A; font-size: 1.125rem;">No matching items found</p>
          <p style="color: #64748B; font-size: 0.875rem; margin-top: 6px;">Feel free to contact our shop counter on WhatsApp for specific models.</p>
          <a href="https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Hello%20LinkPoint,%20I%20am%20looking%20for%20a%20specific%20phone%20or%20accessory%20model." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="margin-top: 16px;">
            Inquire Any Model on WhatsApp
          </a>
        </div>
      `;
      return;
    }

    const isMobile = window.innerWidth <= 768;
    items.forEach((prod, index) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const delayMs = isMobile ? Math.min(index * 40, 200) : Math.min(index * 70, 420);
      card.style.animationDelay = `${delayMs}ms`;
      const whatsappMsg = encodeURIComponent(
        `Hello LinkPoint, I am inquiring about the ${prod.brand} ${prod.name} (${prod.priceLKR}) shown on your website. Is this model currently available in stock?`
      );

      card.innerHTML = `
        <div class="product-media">
          <div class="product-media-badges">
            <span class="product-tag-pill">${prod.tag}</span>
            <span class="stock-badge">
              <span class="pulse-dot" aria-hidden="true"></span>
              <span>In Stock</span>
            </span>
          </div>
          <img src="${prod.image}" alt="${prod.brand} ${prod.name}" loading="lazy" class="product-img">
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-brand">${prod.brand}</span>
            <span class="product-warranty-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Warranty</span>
            </span>
          </div>
          <h3 class="product-name">${prod.name}</h3>
          <p class="product-specs">${prod.specs}</p>
          <div class="product-price-block">
            <span class="product-price-label">Sample Price</span>
            <span class="product-price">${prod.priceLKR}</span>
          </div>
          <div class="product-actions">
            <button type="button" class="btn btn-secondary btn-sm quick-spec-btn" data-id="${prod.id}">
              Details
            </button>
            <a href="https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${whatsappMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
              Ask on WhatsApp
            </a>
          </div>
        </div>
      `;
      productGridEl.appendChild(card);
    });

    // Attach modal openers
    document.querySelectorAll('.quick-spec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        const product = DEMO_PRODUCTS.find(p => p.id === pId);
        if (product) openProductModal(product);
      });
    });

    // Fallback on product images
    productGridEl.querySelectorAll('.product-img').forEach(img => {
      img.addEventListener('error', () => {
        img.src = SVG_FALLBACK;
      });
    });
  }

  // Initial Product Render
  renderProducts(DEMO_PRODUCTS);

  // Filter Tab Logic
  let activeCategory = 'all';
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', () => {
    applyFilters();
  });

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = DEMO_PRODUCTS.filter(item => {
      const matchesCat = (activeCategory === 'all') || (item.category === activeCategory);
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.brand.toLowerCase().includes(query) || 
        item.specs.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
    renderProducts(filtered);
  }

  /* ==========================================================================
     6. Product Detail / Quick Spec Modal
     ========================================================================== */
  const productModal = document.getElementById('product-spec-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-product-title');
  const modalGrid = document.getElementById('modal-spec-grid');
  const modalPrice = document.getElementById('modal-product-price');
  const modalWhatsAppBtn = document.getElementById('modal-whatsapp-link');

  function openProductModal(product) {
    if (!productModal) return;
    if (modalTitle) modalTitle.textContent = `${product.brand} ${product.name}`;
    if (modalPrice) modalPrice.textContent = product.priceLKR;

    if (modalGrid && product.displaySpecs) {
      modalGrid.innerHTML = `
        <div class="modal-spec-item">
          <h5>Display / Build</h5>
          <p>${product.displaySpecs.display}</p>
        </div>
        <div class="modal-spec-item">
          <h5>Chipset / Safety</h5>
          <p>${product.displaySpecs.processor}</p>
        </div>
        <div class="modal-spec-item">
          <h5>Storage & Memory</h5>
          <p>${product.displaySpecs.storage}</p>
        </div>
        <div class="modal-spec-item">
          <h5>Battery & Charging</h5>
          <p>${product.displaySpecs.battery}</p>
        </div>
        <div class="modal-spec-item" style="grid-column: 1 / -1;">
          <h5>Camera / Hardware Features</h5>
          <p>${product.displaySpecs.camera}</p>
        </div>
        <div class="modal-spec-item" style="grid-column: 1 / -1; border-top: 1px solid #E2E8F0; padding-top: 10px;">
          <h5>Warranty & Compliance</h5>
          <p style="color: #16A34A;">${product.displaySpecs.warranty}</p>
        </div>
      `;
    }

    if (modalWhatsAppBtn) {
      const msg = encodeURIComponent(
        `Hello LinkPoint, I am inquiring about the ${product.brand} ${product.name} (${product.priceLKR}) on your website. Please confirm current in-store availability and warranty details.`
      );
      modalWhatsAppBtn.setAttribute('href', `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${msg}`);
    }

    productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    productModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeProductModal);
  productModal?.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });

  /* ==========================================================================
     7. Interactive Print Cost Calculator
     ========================================================================== */
  const calcService = document.getElementById('calc-service');
  const calcPaperSize = document.getElementById('calc-size');
  const calcFinishing = document.getElementById('calc-finishing');
  const calcQty = document.getElementById('calc-qty');
  const calcSubtotal = document.getElementById('calc-subtotal');
  const calcFinishingTotal = document.getElementById('calc-finishing-total');
  const calcGrandTotal = document.getElementById('calc-grand-total');
  const calcWhatsAppBtn = document.getElementById('calc-whatsapp-btn');

  const PRINT_RATES = {
    bw_single: 15,
    bw_double: 25,
    color_single: 75,
    color_double: 130,
    photo_print: 250,
    doc_scan: 30
  };

  const FINISHING_RATES = {
    none: 0,
    stapling: 10,
    spiral_binding: 250,
    comb_binding: 200,
    hardcover_binding: 1200,
    lamination_a4: 120,
    lamination_a3: 220
  };

  function updatePrintCalculation() {
    if (!calcService || !calcPaperSize || !calcFinishing || !calcQty) return;

    const serviceKey = calcService.value;
    const sizeMultiplier = calcPaperSize.value === 'A3' ? 1.8 : 1.0;
    const finishingKey = calcFinishing.value;
    const quantity = Math.max(1, parseInt(calcQty.value, 10) || 1);

    const basePageRate = (PRINT_RATES[serviceKey] || 15) * sizeMultiplier;
    const pagesSubtotal = Math.round(basePageRate * quantity);
    const finishingCost = FINISHING_RATES[finishingKey] || 0;
    const grandTotal = pagesSubtotal + finishingCost;

    if (calcSubtotal) calcSubtotal.textContent = `Rs. ${pagesSubtotal.toLocaleString()}`;
    if (calcFinishingTotal) calcFinishingTotal.textContent = `Rs. ${finishingCost.toLocaleString()}`;
    if (calcGrandTotal) calcGrandTotal.textContent = `Rs. ${grandTotal.toLocaleString()}`;

    if (calcWhatsAppBtn) {
      const serviceName = calcService.options[calcService.selectedIndex].text;
      const sizeName = calcPaperSize.options[calcPaperSize.selectedIndex].text;
      const finishingName = calcFinishing.options[calcFinishing.selectedIndex].text;

      const inquiryText = `Hello LinkPoint! I would like to get a printing quote from your website calculator:
• Service: ${serviceName}
• Paper Size: ${sizeName}
• Quantity: ${quantity} pages/copies
• Finishing: ${finishingName}
• Estimated Calculation: Rs. ${grandTotal.toLocaleString()}
Please let me know if I can email or WhatsApp my PDF documents for printing!`;

      calcWhatsAppBtn.setAttribute(
        'href',
        `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(inquiryText)}`
      );
    }
  }

  [calcService, calcPaperSize, calcFinishing, calcQty].forEach(input => {
    input?.addEventListener('change', updatePrintCalculation);
    input?.addEventListener('input', updatePrintCalculation);
  });
  updatePrintCalculation();

  /* ==========================================================================
     8. General Contact & Inquiry Form
     ========================================================================== */
  const contactForm = document.getElementById('quick-inquiry-form');
  const formSuccessEl = document.getElementById('form-feedback-notice');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('inquiry-name');
    const deptInput = document.getElementById('inquiry-dept');
    const phoneInput = document.getElementById('inquiry-phone');
    const msgInput = document.getElementById('inquiry-msg');

    const name = nameInput ? nameInput.value.trim() : 'Customer';
    const dept = deptInput ? deptInput.value : 'General';
    const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
    const msg = msgInput ? msgInput.value.trim() : '';

    const textToSend = `Hello LinkPoint, my name is ${name} (Phone: ${phone}).
I am inquiring regarding ${dept}:
"${msg}"`;

    const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(textToSend)}`;

    if (formSuccessEl) {
      formSuccessEl.style.display = 'block';
      formSuccessEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    contactForm.reset();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  /* ==========================================================================
     9. Owner Setup Guide Modal
     ========================================================================== */
  const setupGuideModal = document.getElementById('setup-guide-modal');
  const setupGuideBtns = document.querySelectorAll('.setup-guide-trigger');
  const setupGuideClose = document.getElementById('setup-guide-close');
  const guideDoneBtn = document.getElementById('guide-done-btn');

  setupGuideBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setupGuideModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeGuideModal = () => {
    setupGuideModal?.classList.remove('open');
    document.body.style.overflow = '';
  };

  setupGuideClose?.addEventListener('click', closeGuideModal);
  guideDoneBtn?.addEventListener('click', closeGuideModal);
  setupGuideModal?.addEventListener('click', (e) => {
    if (e.target === setupGuideModal) closeGuideModal();
  });

  // Global Escape key listener for both modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (productModal?.classList.contains('open')) closeProductModal();
      if (setupGuideModal?.classList.contains('open')) closeGuideModal();
    }
  });

  /* ==========================================================================
     10. Image Error Fallback Handler
     ========================================================================== */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.opacity = '0.9';
      this.src = SVG_FALLBACK;
    });
  });

  /* ==========================================================================
     11. Back-to-Top Action & Scroll Reveal Animations
     ========================================================================== */
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // IntersectionObserver for Scroll-triggered Reveal Animations
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const isMobile = window.innerWidth <= 768;
      const observerOptions = {
        root: null,
        rootMargin: isMobile ? '0px 0px -25px 0px' : '0px 0px -40px 0px',
        threshold: isMobile ? 0.04 : 0.08
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for environments without IntersectionObserver
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  };

  initScrollReveal();
});
