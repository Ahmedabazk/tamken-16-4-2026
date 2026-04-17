// ==========================================
// منصة تمكين رائدات الأعمال
// ==========================================
// 📌 للوصول إلى لوحة التحكم الإدارية: admin.html
// 📌 يمكنك الوصول إليها من:
//    - رابط في navbar (⚙️ لوحة التحكم)
//    - صفحة تسجيل الدخول (زر الدخول إلى لوحة التحكم الإدارية)
//    - مباشرة عبر: /admin.html
// ==========================================

let currentPage = 'landing';
let isLoggedIn = false;
let authMode = 'login'; // 'login' or 'register'
let isAdminMode = false; // Track if user is admin

const profileState = {
    name: 'سارة القحطاني',
    role: 'رائدة أعمال ومؤسسة ناشئة',
    summary: 'أعمل على بناء حلول رقمية تدعم رواد الأعمال في الإقلاع بمشاريعهم. أستمتع بالتعلم المستمر والتعاون في فرق متعددة التخصصات.',
    experience: '5 سنوات',
    location: 'الرياض، المملكة العربية السعودية',
    status: 'نشط',
    email: 'sara@example.com',
    phone: '+966 5X XXX XXXX',
    social: 'LinkedIn · X · Instagram',
    tags: ['الابتكار', 'التمويل', 'الاستدامة'],
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop'
};
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual Google OAuth client ID
let googleIdentityInitialized = false;

// Load remembered login data
function loadRememberedData() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedEmail && rememberedPassword) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const rememberMeCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) emailInput.value = rememberedEmail;
            if (passwordInput) passwordInput.value = rememberedPassword;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        }
    }
}

// ==========================================
// Page Navigation
// ==========================================

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Update navigation
        updateNavigation();
    }
}

function updateNavigation() {
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update navbar for logged in state
    if (isLoggedIn) {
        updateLoggedInNav();
    }
}

function updateLoggedInNav() {
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">لوحة التحكم</a>
            <a href="#" class="nav-link" onclick="showPage('courses'); return false;">الدورات التدريبية</a>
            <a href="#" class="nav-link" onclick="showPage('investors'); return false;">المستثمرون</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">متابعة التقدم</a>
            <a href="#" class="nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
            <a href="admin.html" class="nav-link admin-link" title="لوحة التحكم" style="color: #f59e0b; font-weight: 600;">⚙️ لوحة التحكم</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                تسجيل الخروج
            </button>
        `;
    }
    
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" class="mobile-nav-link" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('dashboard'); return false;">لوحة التحكم</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('courses'); return false;">الدورات التدريبية</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('investors'); return false;">المستثمرون</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('dashboard'); return false;">متابعة التقدم</a>
            <a href="#" class="mobile-nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
            <div class="mobile-nav-actions">
                <button class="btn btn-outline btn-block" onclick="logout()">تسجيل الخروج</button>
            </div>
        `;
    }
}

function logout() {
    isLoggedIn = false;
    showPage('landing');
    
    // Reset navigation
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link active" data-page="landing" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="nav-link" data-page="about" onclick="showPage('about'); return false;">من نحن</a>
            <a href="#" class="nav-link" data-page="contact" onclick="showPage('contact'); return false;">تواصل معنا</a>
            <a href="#" class="nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="showPage('auth')">تسجيل الدخول</button>
            <button class="btn btn-primary" onclick="showPage('auth')">ابدئي الآن</button>
        `;
    }
    
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" class="mobile-nav-link" data-page="landing">الرئيسية</a>
            <a href="#" class="mobile-nav-link" data-page="about">من نحن</a>
            <a href="#" class="mobile-nav-link" data-page="contact">تواصل معنا</a>
            <a href="#" class="mobile-nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
            <div class="mobile-nav-actions">
                <button class="btn btn-outline btn-block" onclick="showPage('auth')">تسجيل الدخول</button>
                <button class="btn btn-primary btn-block" onclick="showPage('auth')">ابدئي الآن</button>
            </div>
        `;
    }
}

function showProfile() {
    if (isLoggedIn) {
        showPage('profile');
    } else {
        showPage('auth');
    }
}

function waitForGoogleAccounts(callback) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        callback();
        return;
    }

    let poller = null;
    const timeout = setTimeout(() => {
        if (poller) {
            clearInterval(poller);
        }
    }, 10000);

    poller = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            clearInterval(poller);
            clearTimeout(timeout);
            callback();
        }
    }, 250);
}

function initGoogleIdentity() {
    if (googleIdentityInitialized || !window.google || !window.google.accounts || !window.google.accounts.id) {
        return;
    }

    const googleButton = document.getElementById('googleSignInButton');
    if (!googleButton) {
        return;
    }

    googleIdentityInitialized = true;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        ux_mode: 'popup'
    });

    googleButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
            showToast('من فضلك استبدل GOOGLE_CLIENT_ID في script.js بمعرف العميل الخاص بك من Google.', 'info');
        }

        google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.warn('Google Identity prompt لم يظهر:', notification);
            }
        });
    });
}

function handleGoogleCredential(response) {
    if (!response || !response.credential) {
        showToast('تعذر إكمال تسجيل الدخول عبر Google.', 'error');
        return;
    }

    const payload = parseJwt(response.credential);
    profileState.name = payload.name || profileState.name;
    profileState.summary = payload.locale ? `مسجلة بـ ${payload.locale}` : profileState.summary;
    profileState.email = payload.email || profileState.email;
    profileState.avatar = payload.picture || profileState.avatar;
    if (payload.hd) {
        profileState.tags = [payload.hd, ...profileState.tags];
    }

    renderProfileData();
    fillProfileForm();

    isLoggedIn = true;
    showPage('dashboard');
    showToast('تم تسجيل الدخول عبر Google بنجاح!', 'success');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
        return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`;
    }).join(''));

    try {
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error('فشل تحليل JWT من Google:', err);
        return {};
    }
}

function renderProfileData() {
    const avatar = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profileNameDisplay');
    const roleEl = document.getElementById('profileRoleDisplay');
    const summaryEl = document.getElementById('profileSummary');
    const experienceEl = document.getElementById('profileExperience');
    const locationEl = document.getElementById('profileLocation');
    const statusEl = document.getElementById('profileStatus');
    const emailEl = document.getElementById('profileEmail');
    const phoneEl = document.getElementById('profilePhone');
    const socialEl = document.getElementById('profileSocial');

    if (avatar) {
        avatar.src = profileState.avatar;
    }
    if (nameEl) {
        nameEl.textContent = profileState.name;
    }
    if (roleEl) {
        roleEl.textContent = profileState.role;
    }
    if (summaryEl) {
        summaryEl.textContent = profileState.summary;
    }
    if (experienceEl) {
        experienceEl.textContent = profileState.experience;
    }
    if (locationEl) {
        locationEl.textContent = profileState.location;
    }
    if (statusEl) {
        statusEl.textContent = profileState.status;
    }
    if (emailEl) {
        emailEl.textContent = profileState.email;
    }
    if (phoneEl) {
        phoneEl.textContent = profileState.phone;
    }
    if (socialEl) {
        socialEl.textContent = profileState.social;
    }

    updateProfileTags();
}

function updateProfileTags() {
    const tagsContainer = document.getElementById('profileTags');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';
    profileState.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });
}

function fillProfileForm() {
    const fields = [
        { id: 'profileNameInput', value: profileState.name },
        { id: 'profileRoleInput', value: profileState.role },
        { id: 'profileExperienceInput', value: profileState.experience },
        { id: 'profileLocationInput', value: profileState.location },
        { id: 'profileStatusInput', value: profileState.status },
        { id: 'profileEmailInput', value: profileState.email },
        { id: 'profilePhoneInput', value: profileState.phone },
        { id: 'profileSocialInput', value: profileState.social },
        { id: 'profileSummaryInput', value: profileState.summary },
        { id: 'profileTagsInput', value: profileState.tags.join(', ') }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;
        }
    });
}

function handleProfileEditSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('profileNameInput');
    const roleInput = document.getElementById('profileRoleInput');
    const experienceInput = document.getElementById('profileExperienceInput');
    const locationInput = document.getElementById('profileLocationInput');
    const statusInput = document.getElementById('profileStatusInput');
    const emailInput = document.getElementById('profileEmailInput');
    const phoneInput = document.getElementById('profilePhoneInput');
    const socialInput = document.getElementById('profileSocialInput');
    const summaryInput = document.getElementById('profileSummaryInput');
    const tagsInput = document.getElementById('profileTagsInput');

    if (nameInput) profileState.name = nameInput.value.trim() || profileState.name;
    if (roleInput) profileState.role = roleInput.value.trim() || profileState.role;
    if (experienceInput) profileState.experience = experienceInput.value.trim() || profileState.experience;
    if (locationInput) profileState.location = locationInput.value.trim() || profileState.location;
    if (statusInput) profileState.status = statusInput.value.trim() || profileState.status;
    if (emailInput) profileState.email = emailInput.value.trim() || profileState.email;
    if (phoneInput) profileState.phone = phoneInput.value.trim() || profileState.phone;
    if (socialInput) profileState.social = socialInput.value.trim() || profileState.social;
    if (summaryInput) profileState.summary = summaryInput.value.trim() || profileState.summary;
    if (tagsInput) {
        const parsedTags = tagsInput.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        profileState.tags = parsedTags.length ? parsedTags : profileState.tags;
    }

    renderProfileData();
    showToast('تم حفظ معلومات الملف الشخصي بنجاح', 'success');
}

function handleProfileImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        profileState.avatar = reader.result;
        renderProfileData();
    };
    reader.readAsDataURL(file);
}

// ==========================================
// Mobile Menu
// ==========================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');
        if (page) {
            e.preventDefault();
            showPage(page);
        }
    });
});

// Handle desktop nav links
const desktopNavLinks = document.querySelectorAll('.nav-link');
desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');
        if (page) {
            e.preventDefault();
            showPage(page);
        }
    });
});

// ==========================================
// Course Search
// ==========================================

const courseSearch = document.getElementById('courseSearch');
if (courseSearch) {
    courseSearch.addEventListener('input', filterCourses);
}

function filterCourses() {
    const searchTerm = courseSearch.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add click handlers to course register buttons
const courseRegisterButtons = document.querySelectorAll('#coursesPage .btn-primary');
courseRegisterButtons.forEach(button => {
    button.addEventListener('click', () => {
        showPage('auth');
    });
});

// ==========================================
// FAQ Toggle
// ==========================================

function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// ==========================================
// Auth Forms
// ==========================================

function switchAuthTab(mode) {
    authMode = mode;
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Update tabs
    authTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = 'أهلاً بعودتك!';
        authTabs[1].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'ابدئي رحلتك معنا';
        authTabs[0].classList.add('active');
    }
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Simulate login
        isLoggedIn = true;
        showPage('dashboard');
        
        // Save login data if remember me is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
        
        // Show success message
        showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
    });
}

// Handle Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate registration
        isLoggedIn = true;
        showPage('dashboard');
        
        // Show success message
        showToast('تم إنشاء حسابك بنجاح! مرحباً بك في منصة تمكين 🎉', 'success');
    });
}

// ==========================================
// Toast Notifications
// ==========================================

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#7c3aed'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Scroll Effects
// ==========================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow to navbar on scroll
    if (currentScroll > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// Form Validation
// ==========================================

// Add real-time validation to form inputs
const formInputs = document.querySelectorAll('input[required]');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#dc2626';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#7c3aed';
    });
});

// ==========================================
// Image Lazy Loading
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// Statistics Counter Animation
// ==========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            if (statValue && !statValue.dataset.animated) {
                const value = parseInt(statValue.textContent.replace(/[^0-9]/g, ''));
                statValue.dataset.animated = 'true';
                // animateCounter(statValue, value);
            }
        }
    });
}, { threshold: 0.5 });

const stats = document.querySelectorAll('.stat');
stats.forEach(stat => statsObserver.observe(stat));

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('منصة تمكين رائدات الأعمال - تم تحميل الموقع بنجاح ✅');
    
    // Load remembered login data
    loadRememberedData();
    
    // Show landing page by default
    showPage('landing');

    renderProfileData();
    fillProfileForm();

    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', handleProfileEditSubmit);
    }

    const profileImageInput = document.getElementById('profileImageInput');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleProfileImageChange);
    }

    const profileResetBtn = document.getElementById('profileResetBtn');
    if (profileResetBtn) {
        profileResetBtn.addEventListener('click', (event) => {
            event.preventDefault();
            fillProfileForm();
            showToast('تم إعادة بيانات النموذج إلى آخر حالة محفوظة.', 'success');
        });
    }

    waitForGoogleAccounts(initGoogleIdentity);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// Keyboard Navigation
// ==========================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu) {
        closeMobileMenu();
    }
});

// ==========================================
// Performance Monitoring
// ==========================================

if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`وقت تحميل الصفحة: ${entry.loadEventEnd - entry.fetchStart}ms`);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ==========================================
// Export functions for global use
// ==========================================

window.showPage = showPage;
window.switchAuthTab = switchAuthTab;
window.logout = logout;
window.showToast = showToast;
