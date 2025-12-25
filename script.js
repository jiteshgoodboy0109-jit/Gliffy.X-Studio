// Initialize Lucide icons
lucide.createIcons();

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- 1. Mobile Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('h-0');
    mobileMenu.classList.toggle('h-auto', !isOpen);
    mobileMenu.classList.toggle('py-4', !isOpen);
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('h-0');
        mobileMenu.classList.remove('h-auto', 'py-4');
    });
});


// --- 2. Smooth Navigation (SPA behavior) ---
function navigate(event, targetId) {
    event.preventDefault(); // Prevent default link behavior
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// --- 3. Contact Form Submission Handler (Direct WhatsApp + Grand Confetti) ---
// New Rating Function
function setRating(n) {
    const container = document.getElementById('star-container');
    const stars = container.querySelectorAll('svg');
    const ratingInput = document.getElementById('rating');

    ratingInput.value = n;

    stars.forEach((star, index) => {
        if (index < n) {
            star.classList.add('star-filled');
            star.classList.remove('star-empty');
        } else {
            star.classList.remove('star-filled');
            star.classList.add('star-empty');
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formMessage = document.getElementById('form-message');

    // Get form values
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value; // Get rating
    const message = document.getElementById('message').value;

    // 1. Construct Direct WhatsApp URL
    const phoneNumber = "918220945226"; // Added 91 for India

    // Updated Message Format (Replaced Email with Rating)
    const text = `Thanks for contacting Gliffy.X Stdio…\n\nName: ${name}\nRating: ${rating} Stars\nMessage: ${message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    // 2. TRIGGER CONFETTI CELEBRATION!
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });

    // 3. Premium Transition Animation
    // Fade out form
    form.style.transition = 'all 0.5s ease';
    form.className = "form-exit"; // Add class for blur/exit

    setTimeout(() => {
        form.style.display = 'none';
        formMessage.classList.remove('hidden');

        // Inject Premium Success Animation HTML (IMPRESSIVE MESSAGE)
        formMessage.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 animate-fade-in-up">
                <div class="mb-6 relative">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <h3 class="text-4xl font-extrabold text-white mb-3">Welcome to the Future!</h3>
                <p class="text-xl text-gray-300">Your message has been launched. Redirecting to WhatsApp...</p>
            </div>
        `;

        // 4. Fast Redirect (No struggles)
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500); // 1.5s delay to enjoy the confetti
    }, 400);
}

// --- 4. Advanced Animation: Three.js Particle Background in Hero Section ---
function initParticles() {
    const container = document.getElementById('particle-canvas');
    if (!container) return;

    let scene, camera, renderer, particles, particleCount;
    let particleSystem;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Responsive Particle Count
    if (window.innerWidth < 768) {
        particleCount = 100; // Reduced for mobile
    } else {
        particleCount = 250; // Desktop default
    }

    // Scene Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 200;

    // Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Particle Geometry (Use BufferGeometry for better performance)
    particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xE91E63); // Accent Pink
    const color2 = new THREE.Color(0x25A7F6); // Accent Blue

    for (let i = 0; i < particleCount; i++) {
        // Position randomly in a box around the center
        positions[i * 3 + 0] = (Math.random() * 400 - 200); // X
        positions[i * 3 + 1] = (Math.random() * 400 - 200); // Y
        positions[i * 3 + 2] = (Math.random() * 400 - 200); // Z

        // Assign colors, blending between the two accents
        const mix = Math.random();
        color1.lerp(color2, mix);
        colors[i * 3 + 0] = color1.r;
        colors[i * 3 + 1] = color1.g;
        colors[i * 3 + 2] = color1.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true // Particles closer to the camera are larger
    });

    // Particle System
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);


    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the particle system subtly
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x += 0.0001;

        renderer.render(scene, camera);
    };

    // Handle Resize
    window.addEventListener('resize', () => {
        width = container.clientWidth;
        height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    animate();
}

// --- 5. Advanced Animation: Scroll-Triggered Reveal (Intersection Observer) ---
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is visible, add the 'visible' class
                entry.target.classList.add('visible');
                // Stop observing once it's visible to run the animation only once
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px', // Start observing when 0px away from the viewport edge
        threshold: 0.1 // Trigger when 10% of the item is visible
    });

    // Start observing all elements
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// --- 6. 3D Tilt Effect Logic ---
function handleTilt(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on cursor position
    const rotateX = ((y - centerY) / centerY) * -8; // -8 to 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;  // -8 to 8 degrees

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    // Add a dynamic shadow that moves with the light source (cursor)
    element.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(0,0,0,0.3)`;
}

function resetTilt(element) {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    element.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
}

// --- 7. Web Dev Canvas Network Animation ---
function initWebDevParticles() {
    const container = document.getElementById('webdev-canvas');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create a wireframe geometry
    const geometry = new THREE.IcosahedronGeometry(60, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x25A7F6,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Second geometry (Pink accent)
    const geometry2 = new THREE.IcosahedronGeometry(40, 0);
    const material2 = new THREE.MeshBasicMaterial({
        color: 0xE91E63,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const sphere2 = new THREE.Mesh(geometry2, material2);
    scene.add(sphere2);

    const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.002;
        sphere2.rotation.x -= 0.003;
        sphere2.rotation.y -= 0.001;
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
    });

    animate();
}


// Wait for everything to load before initializing animations
window.onload = function () {
    initParticles(); // Start the 3D particle background (Hero)
    initWebDevParticles(); // Start Web Dev 3D BG
    setupScrollReveal(); // Setup the scroll-in-view animations
}
