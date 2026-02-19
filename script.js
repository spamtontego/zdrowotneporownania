/* ============================================
   ZdrowotnePorownaniapl — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initFAQ();
    initScrollAnimations();
    initFilterTags();
    initHeroSearch();
    initLucideIcons();
});

/* --- Lucide Icons (with retry for defer loading) --- */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        // Lucide CDN may not have loaded yet (defer) — retry up to 6× over 3s
        let attempts = 0;
        const retry = setInterval(() => {
            attempts++;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                clearInterval(retry);
            } else if (attempts >= 6) {
                clearInterval(retry);
            }
        }, 500);
    }
}

/* --- Sticky Header Shadow --- */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --- Mobile Navigation --- */
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* --- FAQ Accordion --- */
function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

/* --- Filter Tags (Polecamy page) --- */
function initFilterTags() {
    const tags = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('[data-category]');
    if (!tags.length || !cards.length) return;

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.filter;

            // Update active tag
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            // Filter cards
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --- Hero Search --- */
function initHeroSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const btn = input.parentElement.querySelector('button');
    const articles = [
        { title: 'Retinol vs retinal', keywords: 'retinol retinal retinoidy anti-aging zmarszczki serum krem', url: '/porownania/retinol-vs-retinal.html' },
        { title: 'Bakuchiol vs retinol', keywords: 'bakuchiol retinol naturalny roslinny ciaza wrazliwa skora', url: '/porownania/bakuchiol-vs-retinol.html' },
        { title: 'La Roche-Posay vs CeraVe', keywords: 'la roche posay cerave dermokosmetyk krem nawilzajacy ceramidy niacynamid', url: '/porownania/la-roche-posay-vs-cerave.html' },
        { title: 'Ashwagandha KSM-66 vs Sensoril', keywords: 'ashwagandha ksm-66 sensoril stres kortyzol adaptogen suplement', url: '/porownania/ashwagandha-ksm66-vs-sensoril.html' },
        { title: 'Magnez cytrynian vs bisglicynian', keywords: 'magnez cytrynian bisglicynian suplement skurcze sen stres', url: '/porownania/magnez-cytrynian-vs-bisglicynian.html' },
        { title: 'Kwas foliowy vs metafolin', keywords: 'kwas foliowy metafolin ciaza mthfr witamina b9 suplement prenatalny', url: '/porownania/kwas-foliowy-vs-metafolin.html' },
        { title: 'Polecamy', keywords: 'polecamy rekomendacje ranking najlepsze produkty top', url: '/polecamy.html' },
        { title: 'Kategorie', keywords: 'kategorie suplementy pielegnacja skory kosmetyki', url: '/kategorie.html' }
    ];

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(dropdown);

    function normalize(str) {
        return str.toLowerCase()
            .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
            .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
            .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z');
    }

    function search(query) {
        if (!query || query.length < 2) {
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
            return;
        }

        const q = normalize(query);
        const results = articles.filter(a =>
            normalize(a.title).includes(q) || normalize(a.keywords).includes(q)
        );

        if (results.length === 0) {
            dropdown.innerHTML = '<div class="search-dropdown__empty">Brak wyników dla "' + query + '"</div>';
            dropdown.style.display = 'block';
            return;
        }

        dropdown.innerHTML = results.map(r =>
            '<a href="' + r.url + '" class="search-dropdown__item">' +
            '<i data-lucide="file-text" style="width:16px;height:16px;flex-shrink:0;"></i> ' +
            '<span>' + r.title + '</span></a>'
        ).join('');
        dropdown.style.display = 'block';

        // Reinit Lucide for new icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    input.addEventListener('input', () => search(input.value.trim()));

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = input.value.trim();
            const firstLink = dropdown.querySelector('.search-dropdown__item');
            if (firstLink) {
                window.location.href = firstLink.href;
            } else if (query.length >= 2) {
                window.location.href = 'brak-wynikow.html?q=' + encodeURIComponent(query);
            }
        }
    });

    if (btn) {
        btn.addEventListener('click', () => {
            const query = input.value.trim();
            const firstLink = dropdown.querySelector('.search-dropdown__item');
            if (firstLink) {
                window.location.href = firstLink.href;
            } else if (query.length >= 2) {
                window.location.href = 'brak-wynikow.html?q=' + encodeURIComponent(query);
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.parentElement.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

/* --- Star Rating Helper --- */
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
