document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('actionBtn');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const nav = document.querySelector('.navbar');

    // Button Interaction
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            actionBtn.style.opacity = '0';
            setTimeout(() => {
                actionBtn.classList.add('d-none');
                welcomeMsg.classList.remove('d-none');
            }, 300);
        });
    }

    // Scroll Effects
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '10px 0';
            nav.style.background = 'rgba(9, 44, 58, 0.98)';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            nav.style.padding = '15px 0';
            nav.style.background = 'rgba(9, 44, 58, 0.9)';
            nav.style.boxShadow = 'none';
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});