/* Full JS (copied to assets/js/) */
(function(){
    // Theme toggle logic
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function getPreferredTheme(){
        const stored = localStorage.getItem('theme');
        if(stored) return stored;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    function applyTheme(theme){
        if(theme === 'dark'){
            document.documentElement.setAttribute('data-theme','dark');
            localStorage.setItem('theme','dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme','light');
        }
        updateThemeIcon();
    }

    function updateThemeIcon(){
        if(!themeToggle) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    // Device detection for WhatsApp links and adjusting the number format
    function optimizeWhatsAppForMobile(){
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        whatsappButtons.forEach(btn => {
            const number = btn.dataset.number || btn.getAttribute('href') || ''; // fallback
            if(!number) return;
            const cleaned = number.replace(/[^+0-9]/g, '');
            const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
            if(isMobile){
                btn.setAttribute('href', `https://wa.me/${cleaned.replace(/^\+/, '')}`);
            } else {
                btn.setAttribute('href', `https://web.whatsapp.com/send?phone=${cleaned.replace(/^\+/, '')}`);
            }
        });
    }

    function detectDeviceAndModifyLinks(){
        const phoneLinks = document.querySelectorAll('.phone-link');
        phoneLinks.forEach(a => {
            const txt = a.textContent || a.getAttribute('data-number') || a.getAttribute('href') || '';
            // Keep number display but ensure the link works on all devices
            const clean = txt.replace(/[^+0-9]/g, '');
            a.setAttribute('href', `tel:${clean}`);
        });
    }

    // Hero image subtle movement on mouse move (parallax-like)
    const heroImage = document.querySelector('.hero-image');
    if(heroImage){
        document.addEventListener('mousemove', function(e){
            const rect = document.body.getBoundingClientRect();
            const x = (e.clientX / rect.width) - 0.5;
            const y = (e.clientY / rect.height) - 0.5;
            heroImage.style.transform = `translate(${x * 8}px, ${y * 6}px) scale(1.03)`;
        });
        document.addEventListener('mouseleave', function(){
            heroImage.style.transform = 'translate(0,0) scale(1)';
        });
    }

    // Initialize UI behavior
    document.addEventListener('DOMContentLoaded', function(){
        applyTheme(getPreferredTheme());
        updateThemeIcon();
        detectDeviceAndModifyLinks();
        optimizeWhatsAppForMobile();

        if(themeToggle){
            themeToggle.addEventListener('click', function(){
                const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                applyTheme(cur === 'dark' ? 'light' : 'dark');
            });
        }

        // small accessibility/UX: add focus outlines when keyboard used
        function handleFirstTab(e){
            if(e.key === 'Tab'){
                document.body.classList.add('show-focus-outlines');
                window.removeEventListener('keydown', handleFirstTab);
            }
        }
        window.addEventListener('keydown', handleFirstTab);
    });

})();
