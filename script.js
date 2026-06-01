document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Animation for sections and elements
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                y: 40, 
                opacity: 0 
            },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Staggered fade up for grid children
    const staggerContainers = document.querySelectorAll('.stagger-grid');
    staggerContainers.forEach((container) => {
        const items = container.children;
        gsap.fromTo(items,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                gsap.fromTo(mobileMenu, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3 });
                mobileMenuBtn.innerHTML = '<i class="ph ph-x text-2xl"></i>';
            } else {
                gsap.to(mobileMenu, { 
                    opacity: 0, 
                    y: -20, 
                    duration: 0.3, 
                    onComplete: () => mobileMenu.classList.add('hidden') 
                });
                mobileMenuBtn.innerHTML = '<i class="ph ph-list text-2xl"></i>';
            }
        });
    }

    // 3. FAQ Accordion Logic
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isOpen = content.style.maxHeight;

            // Close all other accordions
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.style.maxHeight = null;
                c.classList.remove('opacity-100');
            });
            document.querySelectorAll('.accordion-button i').forEach(i => {
                i.style.transform = 'rotate(0deg)';
            });

            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('opacity-100');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 4. Countdown Timers for Events
    const countdownElements = document.querySelectorAll('.countdown-timer');
    countdownElements.forEach(el => {
        const targetDate = new Date(el.dataset.date).getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                el.innerHTML = "Event Started";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            el.innerHTML = `${days}d ${hours}h ${minutes}m`;
        };
        
        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    });

    // 5. Initialize Network Particles Visualization
    initParticles('hero-canvas', '#38bdf8', 40);
    initParticles('network-canvas', '#c084fc', 80, true);
});

// Particle Network Function
function initParticles(canvasId, color, baseParticleCount, connectCloseNodes = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    const setSize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);
    
    const particles = [];
    const numParticles = window.innerWidth < 768 ? Math.floor(baseParticleCount / 2) : baseParticleCount;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1
        });
    }
    
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        if (connectCloseNodes) {
            ctx.strokeStyle = color;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 120) {
                        ctx.globalAlpha = 1 - (dist / 120);
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1; // reset alpha
        }
        
        requestAnimationFrame(draw);
    };
    
    draw();
}
