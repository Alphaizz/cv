// --- Sticky Header on Scroll ---
const header = document.querySelector('header');
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // Set initial state on load

// --- Observer for fade-in animations ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.2
});

const hiddenElements = document.querySelectorAll('.scroll-reveal, .shape');
hiddenElements.forEach((el) => revealObserver.observe(el));


// --- Scroll handler for background color transitions ---
const colorBg = document.querySelector('.color-transition-bg');
const trigger1 = document.querySelector('#transition-trigger-1');
const trigger2 = document.querySelector('#transition-trigger-2');
const trigger3 = document.querySelector('#transition-trigger-3');
const trigger4 = document.querySelector('#transition-trigger-4');
const trigger5 = document.querySelector('#transition-trigger-5');

function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // --- Transition 1: Black to Off-White (About Me) ---
    const t1_top = trigger1.offsetTop;
    const t1_start = t1_top - (windowHeight * 0.5);
    const t1_end = t1_top;

    // --- Transition 2: Off-White to Black (Skills) ---
    const t2_top = trigger2.offsetTop;
    const t2_start = t2_top - (windowHeight * 0.5);
    const t2_end = t2_top;

    // --- Transition 3: Black to Off-White (Education) ---
    const t3_top = trigger3.offsetTop;
    const t3_start = t3_top - (windowHeight * 0.5);
    const t3_end = t3_top;

    // --- Transition 4: Off-White to Black (Projects) ---
    const t4_top = trigger4.offsetTop;
    const t4_start = t4_top - (windowHeight * 0.5);
    const t4_end = t4_top;

    // --- Transition 5: Black to Off-White (Contact) ---
    const t5_top = trigger5.offsetTop;
    const t5_start = t5_top - (windowHeight * 0.5);
    const t5_end = t5_top;


    let radius = 0;

    if (scrollY > t5_start) {
        let progress = (scrollY - t5_start) / (t5_end - t5_start);
        progress = Math.max(0, Math.min(1, progress));
        radius = progress * 142; // Animate to light
    } else if (scrollY > t4_start) {
        let progress = (scrollY - t4_start) / (t4_end - t4_start);
        progress = Math.max(0, Math.min(1, progress));
        radius = (1 - progress) * 142; // Animate to dark
    } else if (scrollY > t3_start) {
        let progress = (scrollY - t3_start) / (t3_end - t3_start);
        progress = Math.max(0, Math.min(1, progress));
        radius = progress * 142; // Animate to light
    } else if (scrollY > t2_start) {
        let progress = (scrollY - t2_start) / (t2_end - t2_start);
        progress = Math.max(0, Math.min(1, progress));
        radius = (1 - progress) * 142; // Animate to dark
    } else if (scrollY > t1_start) {
        let progress = (scrollY - t1_start) / (t1_end - t1_start);
        progress = Math.max(0, Math.min(1, progress));
        radius = progress * 142; // Animate to light
    }

    colorBg.style.setProperty('--clip-radius', `${radius}%`);
}

window.addEventListener('scroll', handleScroll, {
    passive: true
});
handleScroll(); // Set initial state

// --- Contact Form Modal Logic ---
const openFormBtn = document.getElementById('open-form-btn');
const closeFormBtn = document.getElementById('close-form-btn');
const contactModal = document.getElementById('contact-form-modal');

openFormBtn.addEventListener('click', () => {
    contactModal.classList.remove('hidden');
    contactModal.classList.add('flex');
});

const closeModal = () => {
    contactModal.classList.add('hidden');
    contactModal.classList.remove('flex');
}

closeFormBtn.addEventListener('click', closeModal);

contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeModal();
    }
});

// ==========================================
// PART 2: SUPABASE INTEGRATION (DEBUG MODE)
// ==========================================
(function initSupabase() {
    try {
        const SUPABASE_URL = 'https://cvtqbmpjxeyxzkkynbqh.supabase.co';
        
        // ⚠️ TRIPLE CHECK: Use the copy button in the dashboard.
        const SUPABASE_KEY = 'sb_publishable_uVFW7G5IQ6Y0wqYOVoLkQg_J0vSXde9'; 

        if (!window.supabase) {
            console.warn("Supabase library not found.");
            return;
        }

        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                const formData = new FormData(contactForm);

                btn.innerText = 'Sending...';
                btn.disabled = true;

                try {
                    const { error } = await supabase
                        .from('messages')
                        .insert([{
                            name: formData.get('name'),
                            email: formData.get('email'),
                            messages: formData.get('message')
                        }]);

                    if (error) throw error;

                    alert("Message sent successfully!");
                    contactForm.reset();
                    // Close modal if function exists
                    if (typeof closeModal === 'function') closeModal();

                } catch (err) {
                    console.error("Supabase Error:", err);
                    // 🚨 THIS WILL SHOW THE REAL ERROR 🚨
                    alert("Error: " + (err.messages || JSON.stringify(err))); 
                } finally {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            });
        }
    } catch (err) {
        console.error("Supabase initialization failed:", err);
    }
})();
