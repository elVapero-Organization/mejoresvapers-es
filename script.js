document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const warn = document.querySelector(".warn");
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        warn.classList.toggle('active');
        // Simple animation for burger lines could be added via CSS
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            warn.classList.remove('active');
        }
    });

    // --- Custom Hero Slider ---
    const sliderContainer = document.querySelector('.hero-slider');
    const sliderDotsContainer = document.getElementById('slider-dots');

    // Slider Data
    const slidesData = [
        {
            title: "Panda X 40K",
            desc: "Vapers desechables y 40K caladas intensas",
            color: "radial-gradient(circle, #FFD1DC, #D44D8E)",
            imgPlaceHolder: "",
            imgSrc: "images/Hero-Vaper-Desechable-Cigarrillo-Electronico-Muchas-Caladas.png",
            link: "https://www.elvapero.es/"
        },
        {
            title: "Megabox Pro 50K",
            desc: "Vaper con nicotina y puff prolongado para muchas caladas",
            color: "radial-gradient(circle, #D1E8FF, #0056D2)",
            imgPlaceHolder: "☃",
            imgSrc: "images/Hero-Vaper-Desechable-Cigarrillo-Electronico-Muchas-Caladas-2.png",
            link: "https://www.elvapero.es/"
        },
        {
            title: "Tornado 15K",
            desc: "Sabores vaper refrescantes desde el primer puff",
            color: "radial-gradient(circle, #D4FFD1, #00A651)",
            imgPlaceHolder: "🌪️",
            imgSrc: "images/Hero-Vaper-Desechable-Cigarrillo-Electronico-Muchas-Caladas-3.png",
            link: "https://www.elvapero.es/"
        }
    ];

    let currentSlide = 0;

    // Initialize Slider
    function initSlider() {
        sliderContainer.innerHTML = '';
        sliderDotsContainer.innerHTML = '';

        slidesData.forEach((slide, index) => {
            // Create Slide
            const slideEl = document.createElement('div');
            slideEl.classList.add('slide');
            if (index === 0) slideEl.classList.add('active');

            // Use image if available, otherwise use placeholder
            const slideContent = slide.imgSrc
                ? `<img src="${slide.imgSrc}" alt="${slide.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;">`
                : `<div style="font-size: 5rem;">${slide.imgPlaceHolder}</div>`;

            // Inline Styles for functionality (basic) + CSS classes
            slideEl.innerHTML = `
                <div class="slide-image-wrapper">
                    <div class="slide-img-placeholder" style="background: ${slide.color}">
                        ${slideContent}
                    </div>
                </div>
                <div class="slide-content-overlay" style="display:none;"></div>
            `;
            // Note: Content is displayed in Main Hero Text area?
            // The prompt says "Each slide includes: Product name, Short description, Button".
            // My design has Hero Text on the LEFT, Slider on RIGHT.
            // I should update the LEFT TEXT when slider changes OR make the slider self-contained cards on the right.
            // Given the image (Burger on right, Text on left), it's likely the TEXT changes with the Burger.
            // So I will update the global Hero Title/Desc when slide changes.

            sliderContainer.appendChild(slideEl);

            // Create Dot
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });

        // Trigger first text update
        updateHeroText(0);

        // Auto Play
        setInterval(nextSlide, 4000);
    }

    function updateHeroText(index) {
        const data = slidesData[index];
        const titleEl = document.querySelector('.hero-title');
        const subtitleEl = document.querySelector('.hero-subtitle');
        const btnEl = document.querySelector('.hero-btn');

        // Simple fade out/in effect could be better, but direct swap for now
        // subtitleEl.textContent = "MEJORES: " + data.desc.split(':')[0];
        // We keep the main styling but change content if desired.
        // Actually, let's keep the main "Vapers Desechables" as the H1 because it's strong SEO.
        // But maybe we change the button link?
        btnEl.setAttribute('href', data.link);

        // Optional: Update highlight text to match product
        // document.querySelector('.highlight').textContent = data.title.toUpperCase();
    }

    function goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        updateHeroText(currentSlide);
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slidesData.length) next = 0;
        goToSlide(next);
    }

    initSlider();

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .product-card, .cat-item, .hero-content').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

});
