/* ==========================================================================
   PROBIZ LEGAL HUB — TEAM PAGE JAVASCRIPT
   Particle animation, navbar scroll, AOS init, scroll progress
   ========================================================================== */

'use strict';

window.PROBIZ = window.PROBIZ || {};

/* --- 1. PARTICLE ENGINE (Cosmic floating dots for Hero) --- */
PROBIZ.particles = (function () {
    let canvas, ctx, particles = [], animId;
    const PARTICLE_COUNT = 60;
    const COLORS = [
        'rgba(41, 169, 189, 0.5)',   // cyan
        'rgba(41, 169, 189, 0.25)',  // faint cyan
        'rgba(255, 255, 255, 0.15)', // faint white
        'rgba(255, 255, 255, 0.08)', // ghost white
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.15; // subtle upward drift
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.opacity = Math.random() * 0.6 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            this.opacity = 0.1 + Math.sin(this.pulse) * 0.25;

            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        _resize();
        _createParticles();
        _animate();

        window.addEventListener('resize', _debounce(_resize, 200));
    }

    function _resize() {
        if (!canvas) return;
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function _createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function _animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connecting lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(41, 169, 189, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(_animate);
    }

    function _debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    return { init };
})();

/* --- 2. UI MODULE (Navbar scroll + search) --- */
PROBIZ.ui = (function () {
    const init = () => {
        _bindScrollEvents();
    };

    const _bindScrollEvents = () => {
        const navbar = document.querySelector('.plh-nav');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            // Navbar transition
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            // Scroll progress bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById('scroll-progress');
            if (progressBar) progressBar.style.width = scrolled + '%';
        });
    };

    return { init };
})();

/* --- 3. EFFECTS (AOS + IntersectionObserver for cards) --- */
PROBIZ.effects = (function () {
    const init = () => {
        _initAOS();
        _initCardReveal();
    };

    const _initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true, offset: 60 });
        }
    };

    // Staggered reveal for team cards
    const _initCardReveal = () => {
        const cards = document.querySelectorAll('.team-member-card');
        if (cards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    // Stagger animation delay
                    const card = entry.target;
                    const delay = card.dataset.delay || 0;
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            card.dataset.delay = i * 120; // 120ms stagger
            observer.observe(card);
        });
    };

    return { init };
})();

/* --- 4. MODAL LOGIC (Dynamic Bios) --- */
PROBIZ.modal = (function () {
    const teamDetails = {
        'julian': {
            name: 'Julian Thorne, Esq.',
            role: 'Təsisçi Tərəfdaş',
            photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
            bio: 'Julian Thorne 20 ildən artıqdır ki, transsərhəd satınalmalar və yüksək riskli korporativ müdafiə üzrə ixtisaslaşmışdır. O, mürəkkəb qlobal bazarlarda şirkətlərin birləşməsi (M&A) və strateji yenidənqurma proseslərində beynəlxalq miqyasda tanınan bir ekspertdir. Julianın rəhbərliyi altında PROBIZ Legal Hub onlarla Fortune 500 şirkətinin hüquqi arxitekturasını qurmuşdur.'
        },
        'elena': {
            name: 'Elena Vance, Esq.',
            role: 'Baş Tərəfdaş | ƏM',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
            bio: 'Silikon Vadisi texnologiya firmaları və əqli mülkiyyət müdafiə strategiyaları üzrə milli səviyyədə tanınmış məsləhətçi olan Elena Vance, süni intellekt, proqram təminatı patentləri və texnologiya lisenziyalaşdırılması sahələrində dərin təcrübəyə malikdir. O, qlobal texnologiya nəhənglərinin əqli mülkiyyət portfellərini idarə edir və innovasiyaların qorunması üçün strateji vizyon təqdim edir.'
        },
        'marcus': {
            name: 'Marcus Sterling',
            role: 'Aparıcı Vəkil',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
            bio: 'Federal məhkəmə mübahisələrində 95% uğur dərəcəsi ilə amansız bir müdafiəçi olan Marcus Sterling kommersiya çəkişmələri üzrə ekspertdir. O, ən mürəkkəb kommersiya mübahisələrində şirkətləri təmsil edir, risklərin azaldılması və münaqişələrin alternativ həlli (ADR) mövzularında peşəkar və kreativ yanaşmalar tətbiq edir.'
        },
        'sophia': {
            name: 'Sophia Kessler',
            role: 'Tənzimləmə Hüququ',
            photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
            bio: 'Beynəlxalq tənzimləmə uyğunluğu və dövlət müqavilələri sahəsində 15 illik təcrübəyə sahib olan Sophia Kessler, PROBIZ Legal Hub-ın Bakı və Vyana ofislərinə rəhbərlik edir. Onun fəaliyyət dairəsi hökumət qurumları ilə əlaqələr, antiinhisar qanunvericiliyi və mürəkkəb lisenziyalaşdırma prosedurlarını əhatə edir.'
        },
        'rashad': {
            name: 'Rəşad Mahmudov',
            role: 'Böhran İdarəçiliyi',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
            bio: 'Rəşad Mahmudov korporativ böhran və reputasiya idarəçiliyi üzrə qabaqcıl strateqlərdən biridir. Fortune 500 şirkətləri ilə iş təcrübəsi olan Rəşad, şirkətləri həm hüquqi, həm də ictimai böhran anlarında uğurla idarə edərək, fəsadları minimuma endirmək və ictimai inamı bərpa etmək sahəsində müstəsna nəticələr əldə edir.'
        },
        'leyla': {
            name: 'Leyla Həsənova',
            role: 'Daşınmaz Əmlak',
            photo: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=600',
            bio: 'Kommersiya daşınmaz əmlakı və tikinti mübahisələri üzrə lider olan Leyla Həsənova, Bakının ən nüfuzlu tikinti və inkişaf layihələrinin hüquqi tərəfini idarə edib. O, torpaq təyinatı, zonalaşdırma problemləri, əmlak alqı-satqısı və iri həcmli investisiya layihələrində müştərilərə dəqiq və təhlükəsiz hüquqi zəmin yaradır.'
        }
    };

    const init = () => {
        const teamModal = document.getElementById('teamModal');
        if (!teamModal) return;

        teamModal.addEventListener('show.bs.modal', function (event) {
            // Button (card) that triggered the modal
            const card = event.relatedTarget;
            // Extract info from data-* attributes
            const memberId = card.getAttribute('data-member-id');
            const data = teamDetails[memberId];

            if (data) {
                // Update the modal's content
                document.getElementById('modalMemberName').textContent = data.name;
                document.getElementById('modalMemberRole').textContent = data.role;
                document.getElementById('modalMemberBioDetailed').textContent = data.bio;
                document.getElementById('modalMemberPhoto').src = data.photo;
            }
        });
    };

    return { init };
})();

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.particles.init();
    PROBIZ.ui.init();
    PROBIZ.effects.init();
    PROBIZ.modal.init();
});
