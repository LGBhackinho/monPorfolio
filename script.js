document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation d'effet de frappe (Typing Effect)
    initTypingEffect();

    // 2. Animation Matrix Rain Canvas
    initMatrixCanvas();

    // 3. Menu Hamburger Mobile
    initMobileNav();

    // 4. Filtrage des projets
    initProjectFilter();

    // 5. Gestionnaire du formulaire de contact (AJAX)
    // initContactForm();

    // 6. Mise à jour automatique de l'année dans le footer
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. EFFET D'ÉCRITURE TERMINAL
   ========================================================================== */
function initTypingEffect() {
    const targetElement = document.getElementById('typing-text');
    if (!targetElement) return;

    const phrases = [
        "Developpeur Web & Web Mobile Full Stack...",
        "Concepteur d'application (PHP, JS, React, Java)...",
        "Passionne de domotique, Linux et cybersecurite..."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause avant de supprimer
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   2. EFFET MATRIX EN ARRIÈRE-PLAN
   ========================================================================== */
function initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/{}=+*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(8, 12, 8, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px 'Fira Code', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 40);
}

/* ==========================================================================
   3. MENU MOBILE
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   4. FILTRE DES PROJETS
   ========================================================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   5. SOUMISSION ENVOI MAIL EN AJAX
   ========================================================================== */
// function initContactForm() {
//     const form = document.getElementById('contact-form');
//     const statusDiv = document.getElementById('form-status');
//     const submitBtn = document.getElementById('submit-btn');

//     if (!form) return;

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         // Réinitialisation du statut
//         statusDiv.className = 'form-status';
//         statusDiv.style.display = 'none';
//         submitBtn.disabled = true;
//         submitBtn.textContent = '> Envoi en cours...';

//         const formData = new FormData(form);

//         try {
//             const response = await fetch('send_mail.php', {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             if (result.success) {
//                 statusDiv.className = 'form-status success';
//                 statusDiv.textContent = `[SUCCESS] ${result.message}`;
//                 form.reset();
//             } else {
//                 statusDiv.className = 'form-status error';
//                 statusDiv.textContent = `[ERROR] ${result.message}`;
//             }
//         } catch (error) {
//             statusDiv.className = 'form-status error';
//             statusDiv.textContent = '[ERROR] Une erreur réseau est survenue. Veuillez réessayer.';
//         } finally {
//             statusDiv.style.display = 'block';
//             submitBtn.disabled = false;
//             submitBtn.textContent = '> Transmettre le message';
//         }
//     });
// }
