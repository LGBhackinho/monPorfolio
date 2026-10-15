document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation d'effet de frappe (Typing Effect)
    initTypingEffect();

    // 2. Animation Matrix Rain Canvas
    initMatrixCanvas();

    // 3. Menu Hamburger Mobile
    initMobileNav();

    // 4. Filtrage des projets
    initProjectFilter();

    // 5. Gestionnaire du formulaire de contact (AJAX / Web3Forms)
    initContactForm();

    // 6. Mise à jour automatique de l'année dans le footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
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

    if (filterBtns.length === 0 || projectCards.length === 0) return;

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
   5. SOUMISSION ENVOI MAIL EN AJAX (WEB3FORMS)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !formStatus) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Message de chargement et désactivation du bouton
        formStatus.className = "form-status";
        formStatus.style.display = "block";
        formStatus.innerHTML = "> Envoi du paquet en cours...";
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "> Transmission...";
        }

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status === 200) {
                formStatus.className = "form-status success";
                formStatus.innerHTML = "> [SUCCESS] Message transmis avec succès ! Je vous repond au plus vite 😃";
                form.reset();
            } else {
                formStatus.className = "form-status error";
                formStatus.innerHTML = "> [ERROR] " + (jsonResponse.message || "Une erreur est survenue. 🥲");
            }
        })
        .catch(error => {
            formStatus.className = "form-status error";
            formStatus.innerHTML = "> [ERROR] Échec de la connexion au serveur.";
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "> Transmettre le message";
            }
        });
    });
}