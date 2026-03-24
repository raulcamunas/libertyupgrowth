(function() {
    
        // --- NOTA ---
        // La lógica legacy del formulario (Amazon toggle / campos desplegables / pills / validación y submit)
        // se gestiona ahora desde React (HeroForm/ContactModal/BlogForm).
        // Aquí mantenemos únicamente scripts de UI (animaciones, scroll, whatsapp, cookies, etc.).

        // --- LOGO CON EFECTO BLUR (sin hover) ---

        // --- SCROLL TRIGGER ANIMATION PARA TEXTOS ---
        const scrollTriggers = document.querySelectorAll('.scroll-trigger');
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    scrollObserver.unobserve(entry.target); // Animación de una sola vez
                }
            });
        }, { threshold: 0.2 });

        scrollTriggers.forEach(trigger => scrollObserver.observe(trigger));

        // --- MOBILE RESULT CARDS ANIMATION (APARECEN ANTES) ---
        if (window.innerWidth <= 991) {
            const mobileResultCards = document.querySelectorAll('.mobile-result-card');
            const mobileCardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.filter = 'blur(0)';
                        mobileCardObserver.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.01,
                rootMargin: '600px 0px -50px 0px' // Se activan 600px antes de entrar en viewport
            });
            
            mobileResultCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.filter = 'blur(15px)';
                card.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                mobileCardObserver.observe(card);
            });
        }


        // --- LOGICA TESTIMONIOS ---
        // Los testimonios se renderizan desde el componente React TestimonialsSection
        // Solo mantenemos la función closePopup global para que funcione desde el componente
        const popup = document.getElementById('testimonial-popup');
        
        if (popup && !window.closePopup) {
            window.closePopup = function() {
                if (popup) popup.classList.remove('active');
            };
        }

        // ===== ZOOM PARA IMÁGENES DE RESULTADOS MÓVILES =====
        let mobileCurrentZoom = 1;
        let mobileIsDragging = false;
        let mobileStartX, mobileStartY, mobileScrollLeft, mobileScrollTop;
        let mobileCurrentTranslateX = 0;
        let mobileCurrentTranslateY = 0;
        
        // Hacer las imágenes móviles y desktop clickeables
        document.addEventListener('DOMContentLoaded', function() {
            const mobileResultImgs = document.querySelectorAll('.mobile-result-img');
            const desktopResultImgs = document.querySelectorAll('.scroll-result-img');
            const mobileModal = document.getElementById('mobile-result-modal');
            const modalImg = document.getElementById('modal-result-img');
            const modalImageContainer = document.getElementById('modal-image-container');
            
            // Función para abrir modal con imagen
            function openImageModal(imgSrc, imgAlt) {
                if (modalImg && mobileModal) {
                    modalImg.src = imgSrc;
                    modalImg.alt = imgAlt;
                    mobileModal.classList.add('active');
                    mobileResetZoom();
                }
            }
            
            // Exponer función globalmente para uso desde React
            window.openImageModal = openImageModal;
            
            // Event listeners para imágenes móviles
            mobileResultImgs.forEach(img => {
                img.addEventListener('click', function() {
                    openImageModal(this.src, this.alt);
                });
            });
            
            // Event listeners para imágenes desktop
            desktopResultImgs.forEach(img => {
                img.addEventListener('click', function() {
                    openImageModal(this.src, this.alt);
                });
            });
            
            // Funciones de zoom
            window.mobileZoomIn = function() {
                mobileCurrentZoom = Math.min(mobileCurrentZoom + 0.5, 5);
                mobileApplyTransform();
            };
            
            window.mobileZoomOut = function() {
                mobileCurrentZoom = Math.max(mobileCurrentZoom - 0.5, 1);
                mobileApplyTransform();
            };
            
            window.mobileResetZoom = function() {
                mobileCurrentZoom = 1;
                mobileCurrentTranslateX = 0;
                mobileCurrentTranslateY = 0;
                mobileApplyTransform();
            };
            
            window.closeMobileResultModal = function() {
                mobileModal.classList.remove('active');
                mobileResetZoom();
            };
            
            function mobileApplyTransform() {
                if (modalImg) {
                    modalImg.style.transform = `translate(${mobileCurrentTranslateX}px, ${mobileCurrentTranslateY}px) scale(${mobileCurrentZoom})`;
                }
            }
            
            // Cerrar al hacer click fuera
            mobileModal.addEventListener('click', function(e) {
                if (e.target === mobileModal) {
                    closeMobileResultModal();
                }
            });
            
            // Drag para mover la imagen cuando está zoomed
            if (modalImageContainer) {
                // Mouse events
                modalImageContainer.addEventListener('mousedown', (e) => {
                    if (mobileCurrentZoom > 1) {
                        mobileIsDragging = true;
                        mobileStartX = e.pageX - modalImageContainer.offsetLeft;
                        mobileStartY = e.pageY - modalImageContainer.offsetTop;
                        mobileScrollLeft = mobileCurrentTranslateX;
                        mobileScrollTop = mobileCurrentTranslateY;
                    }
                });
                
                modalImageContainer.addEventListener('mouseleave', () => {
                    mobileIsDragging = false;
                });
                
                modalImageContainer.addEventListener('mouseup', () => {
                    mobileIsDragging = false;
                });
                
                modalImageContainer.addEventListener('mousemove', (e) => {
                    if (!mobileIsDragging || mobileCurrentZoom <= 1) return;
                    e.preventDefault();
                    const x = e.pageX - modalImageContainer.offsetLeft;
                    const y = e.pageY - modalImageContainer.offsetTop;
                    const walkX = (x - mobileStartX) * 1.5;
                    const walkY = (y - mobileStartY) * 1.5;
                    mobileCurrentTranslateX = mobileScrollLeft + walkX;
                    mobileCurrentTranslateY = mobileScrollTop + walkY;
                    mobileApplyTransform();
                });
                
                // Touch events para móvil
                let mobileInitialDistance = 0;
                let mobileInitialZoom = 1;
                
                modalImageContainer.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 2) {
                        e.preventDefault();
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        mobileInitialDistance = Math.hypot(
                            touch2.clientX - touch1.clientX,
                            touch2.clientY - touch1.clientY
                        );
                        mobileInitialZoom = mobileCurrentZoom;
                    } else if (e.touches.length === 1 && mobileCurrentZoom > 1) {
                        mobileIsDragging = true;
                        const touch = e.touches[0];
                        mobileStartX = touch.pageX - modalImageContainer.offsetLeft;
                        mobileStartY = touch.pageY - modalImageContainer.offsetTop;
                        mobileScrollLeft = mobileCurrentTranslateX;
                        mobileScrollTop = mobileCurrentTranslateY;
                    }
                }, { passive: false });
                
                modalImageContainer.addEventListener('touchmove', (e) => {
                    if (e.touches.length === 2) {
                        e.preventDefault();
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const currentDistance = Math.hypot(
                            touch2.clientX - touch1.clientX,
                            touch2.clientY - touch1.clientY
                        );
                        const scale = currentDistance / mobileInitialDistance;
                        mobileCurrentZoom = Math.max(1, Math.min(5, mobileInitialZoom * scale));
                        mobileApplyTransform();
                    } else if (e.touches.length === 1 && mobileIsDragging && mobileCurrentZoom > 1) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const x = touch.pageX - modalImageContainer.offsetLeft;
                        const y = touch.pageY - modalImageContainer.offsetTop;
                        const walkX = (x - mobileStartX) * 1.5;
                        const walkY = (y - mobileStartY) * 1.5;
                        mobileCurrentTranslateX = mobileScrollLeft + walkX;
                        mobileCurrentTranslateY = mobileScrollTop + walkY;
                        mobileApplyTransform();
                    }
                }, { passive: false });
                
                modalImageContainer.addEventListener('touchend', () => {
                    mobileIsDragging = false;
                });
            }
        });

        // --- FAQ LOGIC (ÚNICA VERSIÓN PARA DESKTOP Y MÓVIL) ---
        const faqItems = document.querySelectorAll('.faq-item');
        const isMobile = window.innerWidth <= 767;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', (e) => {
                e.preventDefault();
                
                const wasActive = item.classList.contains('active');
                
                // Cerrar otros items PRIMERO (antes de toggle)
                faqItems.forEach(other => { 
                    if(other !== item && other.classList.contains('active')) { 
                        other.classList.remove('active');
                    } 
                });
                
                // Toggle del item actual
                item.classList.toggle('active');
            }, { passive: false });
        });

        // --- CANVAS LOGIC ---
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let width, height, particles = [], mouse = { x: null, y: null };
            const particleCount = 3000, mouseConnectDistance = 120; 
            class Particle { 
                constructor() { 
                    this.x = Math.random() * width; 
                    this.y = Math.random() * height; 
                    this.vx = (Math.random() - 0.5) * 0.2; 
                    this.vy = (Math.random() - 0.5) * 0.2; 
                    this.size = Math.random() * 1.5 + 0.5;
                    this.color = '#00b5ff'; 
                } 
                update() { 
                    this.x += this.vx; 
                    this.y += this.vy; 
                    if (this.x < 0 || this.x > width) this.vx = -this.vx; 
                    if (this.y < 0 || this.y > height) this.vy = -this.vy; 
                } 
                draw() { 
                    ctx.beginPath(); 
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
                    ctx.fillStyle = this.color; 
                    ctx.globalAlpha = 0.5; 
                    ctx.fill(); 
                } 
            }
            function initCanvas() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; particles = []; for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); } }
            function animateCanvas() { ctx.clearRect(0, 0, width, height); for (let i = 0; i < particles.length; i++) { let p = particles[i]; p.update(); p.draw(); if (mouse.x != null) { let dx = mouse.x - p.x; let dy = mouse.y - p.y; let distance = Math.sqrt(dx * dx + dy * dy); if (distance < mouseConnectDistance) { ctx.beginPath(); ctx.strokeStyle = `rgba(0, 181, 255, ${1 - distance/mouseConnectDistance})`; ctx.lineWidth = 0.5; ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(p.x, p.y); ctx.stroke(); const force = (mouseConnectDistance - distance) / mouseConnectDistance; p.x -= (dx / distance) * force * 0.5; p.y -= (dy / distance) * force * 0.5; } } } requestAnimationFrame(animateCanvas); }
            window.addEventListener('resize', initCanvas); 
            if(window.innerWidth > 991) { window.addEventListener('mousemove', (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX; mouse.y = e.clientY; }); }
            window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; }); initCanvas(); animateCanvas();
        }

        // --- CURTAIN LOGIC --- SOLO PARA DESKTOP
        const heroContainer = document.querySelector('.hero-section .hero-container');
        if (heroContainer && window.innerWidth > 991) {
            window.addEventListener('scroll', () => {
                if (window.innerWidth > 991) {
                    const scrollPosition = window.scrollY; const windowHeight = window.innerHeight;
                    let opacity = 1 - (scrollPosition / (windowHeight * 0.7)); opacity = Math.max(0, Math.min(1, opacity));
                    heroContainer.style.opacity = opacity; heroContainer.style.transform = `translateY(${scrollPosition * 0.3}px)`;
                    if (opacity <= 0.01) heroContainer.style.pointerEvents = 'none'; else heroContainer.style.pointerEvents = 'auto';
                }
            });
        }

        // --- SCROLL SPY (DESKTOP) ---
        const visualItems = document.querySelectorAll('.scroll-visual-item');
        const menuItems = document.querySelectorAll('.scroll-menu-item');
        const textBlocks = document.querySelectorAll('.right-text-block');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { const step = entry.target.getAttribute('data-step'); activateStep(step); } });
        }, { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 });
        visualItems.forEach(item => observer.observe(item));
        function activateStep(step) {
            visualItems.forEach(item => { item.classList.remove('active'); if(item.getAttribute('data-step') === step) item.classList.add('active'); });
            menuItems.forEach((item, index) => { item.classList.remove('active'); if((index + 1).toString() === step) item.classList.add('active'); });
            textBlocks.forEach((block) => { block.classList.remove('active'); });
            const activeText = document.getElementById(`text-${step}`); if(activeText) activeText.classList.add('active');
        }

        // --- STICKY PROCESS ANIMATION (SCROLLYTELLING) ---
        const processSection = document.querySelector('.process-section');
        const processFill = document.getElementById('process-fill');
        const processSteps = document.querySelectorAll('.process-step');

        if(processSection && processFill) {
            window.addEventListener('scroll', () => {
                if (window.innerWidth > 991) {
                    const rect = processSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionHeight = processSection.offsetHeight;
                    
                    // Logic: Progress goes from 0 to 1 as we scroll through the section height
                    // The 'sticky' part makes it feel like we are stopping
                    
                    let progress = -rect.top / (sectionHeight - windowHeight);
                    
                    progress = Math.max(0, Math.min(1, progress));
                    const finalPercent = progress * 100;
                    
                    processFill.style.width = finalPercent + "%";
                    processFill.style.height = "2px";

                    processSteps.forEach((step, index) => {
                        // Activate slightly before the exact percentage for better feel
                        const threshold = (index) / (processSteps.length - 1); 
                        if (progress >= threshold - 0.05) {
                            step.classList.add('active');
                        } else {
                            step.classList.remove('active');
                        }
                    });
                } 
                else {
                    // Fallback for Mobile (Vertical Scroll normal)
                    const rect = processSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const triggerPoint = windowHeight * 0.5; // Start at middle of screen

                    // Only animate if section is somewhat in view starting from middle
                    if (rect.top < triggerPoint) {
                        // Progress calculation relative to when top hits middle screen
                        // We assume height of section roughly matches duration we want
                        const totalDistance = rect.height; 
                        const scrolledDistance = triggerPoint - rect.top;
                        
                        let progress = scrolledDistance / totalDistance;
                        progress = Math.max(0, Math.min(1, progress));
                        
                        processFill.style.height = (progress * 100) + "%";
                        processFill.style.width = "2px";
                        
                        // New logic: Check if progress exceeds step's visual threshold with a buffer
                        processSteps.forEach((step, index) => {
                            const stepThreshold = (index * 0.20) + 0.05; // 5% buffer past the start of the section
                            
                            if (progress > stepThreshold) {
                                step.classList.add('current-step');
                                step.classList.add('active-node');
                                step.classList.add('active');
                            } else {
                                step.classList.remove('current-step');
                                step.classList.remove('active-node');
                                // Keep dim visibility if past index 0, or reset
                                if(index > 0) step.classList.remove('active');
                            }
                        });
                    }
                }
            });
        }

        // --- MODALS ---
        const modal = document.getElementById('video-modal');
        const openBtn = document.getElementById('open-video-btn');
        const closeBtn = document.getElementById('close-video-btn');
        if (modal && openBtn && closeBtn) {
            const iframe = modal.querySelector('iframe');
            const videoSrc = iframe ? (iframe.dataset.src || iframe.src) : '';
            let videoLoaded = false;
            
            openBtn.addEventListener('click', () => { 
                modal.classList.add('active'); 
                // Lazy load iframe only when modal opens
                if (iframe && !videoLoaded && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src + "&autoplay=1";
                    videoLoaded = true;
                } else if (iframe && videoLoaded) {
                    iframe.src = videoSrc + "&autoplay=1";
                }
            });
            const closeModal = () => { 
                modal.classList.remove('active'); 
                // Pause video when closing (optional - keeps it loaded for faster reopen)
                // if (iframe && videoLoaded) iframe.src = "";
            };
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        }

        // --- SCROLL TO FORM FUNCTION ---
        function scrollToForm(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Como el hero tiene position: fixed, simplemente scrolleamos a la parte superior
            const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
            const targetScroll = 0; // Scroll hasta arriba donde está el formulario
            
            // Animación suave
            const startTime = performance.now();
            const duration = 1000;
            const distance = targetScroll - currentScroll;
            
            function smoothScroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing easeInOutCubic
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const currentPosition = currentScroll + (distance * ease);
                
                // Forzar scroll en todos los navegadores
                window.scrollTo(0, currentPosition);
                document.documentElement.scrollTop = currentPosition;
                document.body.scrollTop = currentPosition;
                
                if (progress < 1) {
                    requestAnimationFrame(smoothScroll);
                }
            }
            
            requestAnimationFrame(smoothScroll);
            return false;
        }
        
        // Hacer la función disponible globalmente
        window.scrollToForm = scrollToForm;

        // ===== PROTECCIÓN ANTI-BOTS =====
        
        // 1. RATE LIMITING (máximo 3 envíos por hora)
        function checkRateLimit() {
            const RATE_LIMIT_KEY = 'libertyupgrowth_form_submissions';
            const RATE_LIMIT_COUNT = 3;
            const RATE_LIMIT_TIME = 60 * 60 * 1000; // 1 hora en ms
            
            const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
            const now = Date.now();
            
            // Filtrar envíos antiguos (más de 1 hora)
            const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_TIME);
            
            if (recentSubmissions.length >= RATE_LIMIT_COUNT) {
                return false; // Límite alcanzado
            }
            
            // Guardar nuevo envío
            recentSubmissions.push(now);
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
            return true;
        }
        
        // 3. VALIDACIÓN DE TIEMPO MÍNIMO (anti-bot rápido)
        let formStartTime = null;
        const MIN_FORM_TIME = 5000; // 5 segundos mínimo
        
        function initFormTiming() {
            const form = document.getElementById('signup-form');
            if (form) {
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    input.addEventListener('focus', () => {
                        if (!formStartTime) {
                            formStartTime = Date.now();
                        }
                    }, { once: true });
                });
            }
        }
        
        function checkFormTiming() {
            if (!formStartTime) {
                // Si no hay tiempo registrado, dar un poco de margen
                formStartTime = Date.now();
                return false;
            }
            const timeSpent = Date.now() - formStartTime;
            return timeSpent >= MIN_FORM_TIME;
        }
        
        // 4. HONEYPOT FIELD (campo oculto que solo los bots llenan)
        function addHoneypotField() {
            const form = document.getElementById('signup-form');
            if (form && !document.getElementById('website-field')) {
                const honeypot = document.createElement('input');
                honeypot.type = 'text';
                honeypot.name = 'website';
                honeypot.id = 'website-field';
                honeypot.style.cssText = 'position: absolute; left: -9999px; opacity: 0; pointer-events: none; tabindex: -1; width: 0; height: 0;';
                honeypot.setAttribute('autocomplete', 'off');
                honeypot.setAttribute('aria-hidden', 'true');
                form.appendChild(honeypot);
            }
        }
        
        // ===== VALIDACIONES DE FORMULARIO =====
        
        // Función para mostrar error
        function showError(fieldId, message) {
            const errorEl = document.getElementById(fieldId);
            const inputEl = document.getElementById(fieldId.replace('-error', ''));
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('show');
            }
            if (inputEl) {
                inputEl.classList.add('error');
            }
        }
        
        // Función para limpiar error
        function clearError(fieldId) {
            const errorEl = document.getElementById(fieldId);
            const inputId = fieldId.replace('-error', '');
            const inputEl = document.getElementById(inputId);
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('show');
            }
            if (inputEl) {
                inputEl.classList.remove('error');
            }
        }
        
        // Validar email
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Validar teléfono (España y México)
        function validatePhone(phone, prefix) {
            // Eliminar espacios, guiones y paréntesis
            const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
            const cleanPrefix = prefix.replace(/[\s\-\(\)]/g, '');
            
            // Validar según el prefijo seleccionado
            if (cleanPrefix === '+34' || cleanPrefix === '34') {
                // España: 9 dígitos empezando por 6/7/8/9
                const spainPattern = /^[6789]\d{8}$/;
                return spainPattern.test(cleanPhone);
            } else if (cleanPrefix === '+52' || cleanPrefix === '52') {
                // México: 10 dígitos (puede empezar con 1)
                const mexicoPattern = /^1?\d{10}$/;
                return mexicoPattern.test(cleanPhone);
            }
            
            return false;
        }
        
        // Actualizar bandera y placeholder según prefijo seleccionado
        function updateCountryFlag() {
            const prefixSelect = document.getElementById('form-prefix');
            const flagElement = document.getElementById('country-flag');
            const phoneInput = document.getElementById('form-phone');
            
            if (prefixSelect && flagElement) {
                const selectedOption = prefixSelect.options[prefixSelect.selectedIndex];
                const flag = selectedOption.getAttribute('data-flag');
                
                if (flag) {
                    // Animación suave de la bandera
                    flagElement.style.opacity = '0';
                    flagElement.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        flagElement.textContent = flag;
                        flagElement.style.opacity = '1';
                        flagElement.style.transform = 'scale(1)';
                    }, 150);
                }
                
                // Actualizar placeholder según el país
                if (phoneInput) {
                    const prefix = prefixSelect.value;
                    if (prefix === '+34') {
                        phoneInput.placeholder = '612 345 678';
                    } else if (prefix === '+52') {
                        phoneInput.placeholder = '55 1234 5678';
                    }
                }
            }
        }
        
        // Validar nombre (mínimo 2 caracteres, solo letras y espacios)
        function validateName(name) {
            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,}$/;
            return nameRegex.test(name.trim());
        }
        
        // Validación y submit del formulario se manejan en React
        
        // Validación en tiempo real
        function setupRealTimeValidation() {
            // Se mantiene únicamente la actualización de la bandera en el selector de prefijo
            const prefixSelect = document.getElementById('form-prefix');
            if (prefixSelect) {
                prefixSelect.addEventListener('change', updateCountryFlag);
                updateCountryFlag();
            }
        }
        
        // Inicializar protecciones cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initFormTiming();
                addHoneypotField();
                setupRealTimeValidation();
            });
        } else {
            initFormTiming();
            addHoneypotField();
            setupRealTimeValidation();
        }

        // Mostrar primer mensaje de WhatsApp después de 15 segundos
        setTimeout(function() {
            const message = document.getElementById('whatsapp-message');
            if (message) {
                message.classList.add('show');
                
                // Ocultar mensaje después de 7 segundos
                setTimeout(function() {
                    message.classList.remove('show');
                    message.classList.add('hide');
                }, 7000);
            }
        }, 15000);

        // Mostrar segundo mensaje después de 40 segundos (25 segundos después del primero)
        setTimeout(function() {
            const message2 = document.getElementById('whatsapp-message-2');
            if (message2) {
                message2.classList.add('show');
                
                // Ocultar mensaje después de 7 segundos
                setTimeout(function() {
                    message2.classList.remove('show');
                    message2.classList.add('hide');
                }, 7000);
            }
        }, 40000);

        // ===== COOKIE CONSENT BANNER =====
        const COOKIE_CONSENT_KEY = 'libertyupgrowth_cookie_consent';
        
        // Función para mostrar el banner
        function showCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.style.display = 'block';
                // Forzar reflow para que la animación funcione
                void banner.offsetHeight;
                setTimeout(() => {
                    banner.classList.add('show');
                }, 100);
            }
        }
        
        // Función para aceptar cookies
        function acceptCookies() {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 400);
            }
        }
        
        // Función para rechazar cookies
        function rejectCookies() {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 400);
            }
        }
        
        // Verificar consentimiento al cargar
        function initCookieConsent() {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            
            if (consent === 'accepted') {
                // Si ya aceptó antes, no hacer nada
            } else if (consent === 'rejected') {
                // Si rechazó, no hacer nada
                return;
            } else {
                // Si no hay consentimiento, mostrar banner
                showCookieBanner();
            }
        }
        
        // Funciones para el modal de información de cookies
        function openCookieInfoModal() {
            const modal = document.getElementById('cookie-info-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevenir scroll del body
            }
        }

        function closeCookieInfoModal() {
            const modal = document.getElementById('cookie-info-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar scroll del body
            }
        }

        // Inicializar cuando el DOM esté listo
        function setupCookieBanner() {
            const acceptBtn = document.getElementById('cookie-accept');
            const rejectBtn = document.getElementById('cookie-reject');
            const infoLink = document.getElementById('cookie-info-link');
            const closeBtn = document.getElementById('cookie-info-close');
            const modal = document.getElementById('cookie-info-modal');
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', acceptCookies);
            }
            
            if (rejectBtn) {
                rejectBtn.addEventListener('click', rejectCookies);
            }

            if (infoLink) {
                infoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    openCookieInfoModal();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', closeCookieInfoModal);
            }

            // Cerrar modal al hacer clic fuera
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeCookieInfoModal();
                    }
                });
            }

            // Cerrar modal con tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                    closeCookieInfoModal();
                }
            });
            
            // Inicializar consentimiento
            initCookieConsent();
        }
        
        // Ejecutar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupCookieBanner);
        } else {
            setupCookieBanner();
    }
    

})();
