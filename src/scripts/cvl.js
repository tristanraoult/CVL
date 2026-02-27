/**
 * Club des Vignerons Lauréats — Enhanced Interactions
 */
(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const preloader = $('#preloader');
    const header = $('#site-header');
    const mobileToggle = $('#mobile-toggle');
    const mobileMenu = $('#mobile-menu');

    // ── PRELOADER ──
    function initPreloader() {
        if (!preloader) return;
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('is-hidden');
                setTimeout(() => { preloader.style.display = 'none'; }, 800);
            }, 1400);
        });
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('is-hidden')) {
                preloader.classList.add('is-hidden');
                setTimeout(() => { preloader.style.display = 'none'; }, 800);
            }
        }, 4000);
    }

    // ── HEADER ──
    function initHeader() {
        if (!header) return;
        let lastScroll = 0, ticking = false;

        // On inner pages (no full-screen .hero), force solid header immediately
        const hasHero = !!$('.hero');
        if (!hasHero) {
            header.classList.add('is-scrolled');
        }

        function updateHeader() {
            const scrollY = window.scrollY;

            if (hasHero) {
                header.classList.toggle('is-scrolled', scrollY > 50);
            }
            // Always keep is-scrolled on inner pages (already set above)

            // Don't hide header while mobile menu is open
            const menuOpen = mobileMenu && mobileMenu.classList.contains('is-open');
            if (!menuOpen && scrollY > 300) {
                if (scrollY > lastScroll + 10) header.classList.add('is-hidden');
                else if (scrollY < lastScroll - 10) header.classList.remove('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }
            lastScroll = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
        }, { passive: true });
    }

    // ── MOBILE MENU ──
    function initMobileMenu() {
        if (!mobileToggle || !mobileMenu) return;

        function toggleMenu() {
            const isOpen = mobileMenu.classList.contains('is-open');
            mobileMenu.classList.toggle('is-open');
            mobileToggle.classList.toggle('is-active');
            mobileToggle.setAttribute('aria-expanded', String(!isOpen));
            mobileMenu.setAttribute('aria-hidden', String(isOpen));
            document.body.style.overflow = isOpen ? '' : 'hidden';
        }

        mobileToggle.addEventListener('click', toggleMenu);
        $$('.mobile-menu__link, .mobile-menu__sub-link', mobileMenu).forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                mobileToggle.classList.remove('is-active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    }

    // ── SCROLL REVEAL ──
    function initReveal() {
        const reveals = $$('.reveal, .reveal-left, .reveal-right, .stagger');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ── SMOOTH SCROLL ──
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const target = $(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = header ? header.offsetHeight + 20 : 20;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
                }
            });
        });
    }

    // ── NEWSLETTER ──
    function initNewsletter() {
        const form = $('#newsletter-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]');
            if (email && email.value) {
                const btn = form.querySelector('button[type="submit"]');
                const orig = btn.textContent;
                btn.textContent = '✓ Inscrit !';
                btn.style.background = 'var(--olive)';
                email.value = '';
                setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
            }
        });
    }

    // ── ACTIVE NAV ──
    function initActiveNav() {
        const path = window.location.pathname;
        $$('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && path.endsWith(href.replace('./', ''))) link.classList.add('is-active');
        });
    }

    // ── COUNTER ANIMATION ──
    function initCounters() {
        const stats = $$('.stat-number');
        if (!stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();
                    const match = text.match(/(\d+)(\+?)/);
                    if (match) animateCounter(el, parseInt(match[1]), match[2] || '');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(el => observer.observe(el));
    }

    function animateCounter(el, target, suffix) {
        const duration = 2200, start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ── PARALLAX ──
    function initParallax() {
        const hero = $('.hero');
        if (!hero) return;
        const img = hero.querySelector('.hero__bg img');
        if (!img) return;
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y < window.innerHeight) {
                    img.style.transform = `scale(${1.05 + y * 0.00025}) translateY(${y * 0.35}px)`;
                }
            });
        }, { passive: true });
    }

    // ── CONTACT FORM ──
    function initContactForm() {
        const form = $('#contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Message envoyé ✓';
            btn.style.background = 'var(--olive)';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
        });
    }

    // ── DROPDOWNS ──
    function initDropdowns() {
        $$('.nav-dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            const menu = dropdown.querySelector('.nav-dropdown-menu');
            if (!toggle || !menu) return;
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isOpen = menu.style.opacity === '1';
                    menu.style.opacity = isOpen ? '' : '1';
                    menu.style.visibility = isOpen ? '' : 'visible';
                    menu.style.pointerEvents = isOpen ? '' : 'all';
                    menu.style.transform = isOpen ? '' : 'translateX(-50%) translateY(0)';
                }
            });
        });
    }

    // ── MAGNETIC BUTTONS ──
    function initMagneticButtons() {
        if (window.matchMedia('(pointer: fine)').matches) {
            $$('.btn--primary, .btn--outline').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                    btn.style.transform = `translate(${x}px, ${y}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        }
    }

    // ── INIT ──
    function init() {
        initPreloader();
        initHeader();
        initMobileMenu();
        initReveal();
        initSmoothScroll();
        initNewsletter();
        initActiveNav();
        initCounters();
        initParallax();
        initContactForm();
        initDropdowns();
        initMagneticButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
