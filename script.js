const API_BASE = "http://127.0.0.1:8000/api";

let currentPage = 'landing';
let isLoggedIn = false;
let authMode = 'login';

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

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
let googleIdentityInitialized = false;

// ==========================================
// Storage Helpers
// ==========================================
function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

function saveRememberedData(email, password) {
    localStorage.setItem('rememberedEmail', email);
    localStorage.setItem('rememberedPassword', password);
}

function clearRememberedData() {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
}

function loadRememberedData() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');

    if (rememberedEmail && rememberedPassword) {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const rememberMeCheckbox = document.getElementById('rememberMe');

        if (emailInput) emailInput.value = rememberedEmail;
        if (passwordInput) passwordInput.value = rememberedPassword;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
}

// ==========================================
// Page Navigation
// ==========================================
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        updateNavigation();
    }
}

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

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
        `;

        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">تسجيل الخروج</button>
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

function resetGuestNav() {
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

function logout() {
    clearToken();
    isLoggedIn = false;
    resetGuestNav();
    showPage('landing');
    showToast('تم تسجيل الخروج بنجاح', 'success');
}

function showProfile() {
    if (isLoggedIn) {
        showPage('profile');
    } else {
        showPage('auth');
    }
}

// ==========================================
// Google Identity
// ==========================================
function waitForGoogleAccounts(callback) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        callback();
        return;
    }

    let poller = null;
    const timeout = setTimeout(() => {
        if (poller) clearInterval(poller);
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
    if (!googleButton) return;

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
    updateNavigation();
    showPage('dashboard');
    showToast('تم تسجيل الدخول عبر Google بنجاح!', 'success');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    if (!base64Url) return {};

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

// ==========================================
// Profile
// ==========================================
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

    if (avatar) avatar.src = profileState.avatar;
    if (nameEl) nameEl.textContent = profileState.name;
    if (roleEl) roleEl.textContent = profileState.role;
    if (summaryEl) summaryEl.textContent = profileState.summary;
    if (experienceEl) experienceEl.textContent = profileState.experience;
    if (locationEl) locationEl.textContent = profileState.location;
    if (statusEl) statusEl.textContent = profileState.status;
    if (emailEl) emailEl.textContent = profileState.email;
    if (phoneEl) phoneEl.textContent = profileState.phone;
    if (socialEl) socialEl.textContent = profileState.social;

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
        if (element) element.value = field.value;
    });
}

async function handleProfileEditSubmit(event) {
    event.preventDefault();

    const token = getToken();
    if (!token) {
        showToast('يجب تسجيل الدخول أولاً', 'info');
        return;
    }

    const payload = {
        name: document.getElementById('profileNameInput')?.value.trim(),
        email: document.getElementById('profileEmailInput')?.value.trim(),
        phone: document.getElementById('profilePhoneInput')?.value.trim(),
        facebook: document.getElementById('profileSocialInput')?.value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || 'فشل تحديث الملف الشخصي', 'info');
            return;
        }

        const user = data.data;
        localStorage.setItem('user', JSON.stringify(user));
        updateDashboardUser(user);

        if (user.name) profileState.name = user.name;
        if (user.email) profileState.email = user.email;
        if (user.phone) profileState.phone = user.phone;
        if (user.facebook) profileState.social = user.facebook;

        renderProfileData();
        fillProfileForm();

        showToast('تم تحديث الملف الشخصي بنجاح ✅', 'success');
    } catch (error) {
        console.error(error);
        showToast('حدث خطأ أثناء تحديث الملف الشخصي', 'info');
    }

    renderProfileData();
}

function handleProfileImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

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
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('active');
}

// ==========================================
// Course Search
// ==========================================
function filterCourses() {
    const courseSearch = document.getElementById('courseSearch');
    if (!courseSearch) return;

    const searchTerm = courseSearch.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
// FAQ Toggle
// ==========================================
function toggleFaq(element) {
    const faqItem = element.parentElement;
    if (faqItem) faqItem.classList.toggle('active');
}

// ==========================================
// Auth Tabs
// ==========================================
function switchAuthTab(mode) {
    authMode = mode;

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const authTabs = document.querySelectorAll('.auth-tab');

    authTabs.forEach(tab => tab.classList.remove('active'));

    if (mode === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (authTitle) authTitle.textContent = 'أهلاً بعودتك!';
        if (authTabs[1]) authTabs[1].classList.add('active');
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (authTitle) authTitle.textContent = 'ابدئي رحلتك معنا';
        if (authTabs[0]) authTabs[0].classList.add('active');
    }
}

// ==========================================
// API Helpers
// ==========================================
async function fetchUserProfile() {
    const token = getToken();
    if (!token) return null;

    try {
        const res = await fetch(`${API_BASE}/me`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) return null;

        return data.user || data.data || data;
    } catch (error) {
        console.error("PROFILE ERROR:", error);
        return null;
    }
}

function updateDashboardUser(user) {
    const dashboardTitle =
        document.getElementById('dashboardUserName') ||
        document.querySelector('#dashboardPage h1');

    if (dashboardTitle && user?.name) {
        dashboardTitle.textContent = `مرحباً، ${user.name}! 👋`;
    }

    if (user?.name) profileState.name = user.name;
    if (user?.email) profileState.email = user.email;
    if (user?.phone) profileState.phone = user.phone;
    if (user?.role) profileState.role = user.role;

    renderProfileData();
    fillProfileForm();
}

async function loadProfileFromApi() {
    const user = await fetchUserProfile();
    if (!user) return;

    if (user.name) profileState.name = user.name;
    if (user.email) profileState.email = user.email;
    if (user.phone) profileState.phone = user.phone;
    if (user.role) profileState.role = user.role;

    renderProfileData();
    fillProfileForm();
    updateDashboardUser(user);
}

async function updateProfileApi() {
    const token = getToken();
    if (!token) {
        showToast('يجب تسجيل الدخول أولاً', 'info');
        return;
    }

    const name = document.getElementById('profileNameInput')?.value.trim();
    const phone = document.getElementById('profilePhoneInput')?.value.trim();

    try {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || 'فشل تحديث البروفايل', 'info');
            return;
        }

        if (data.user) {
            updateDashboardUser(data.user);
        }

        showToast('تم تحديث البروفايل بنجاح ✅', 'success');
    } catch (error) {
        console.error(error);
        showToast('حدث خطأ أثناء تحديث البروفايل', 'info');
    }
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toast.style.cssText = `
        position: fixed;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#7c3aed'};
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

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

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
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
});

// ==========================================
// Smooth Scroll
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
// Keyboard Navigation
// ==========================================
document.addEventListener('keydown', (e) => {
    const mobileMenu = document.getElementById('mobileMenu');
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
async function loadAdminDashboard() {
   const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/admin/dashboard`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log('ADMIN DASHBOARD:', data);

        const usersEl = document.getElementById('adminUsersCount');
        const projectsEl = document.getElementById('adminProjectsCount');
        const contactsEl = document.getElementById('adminContactsCount');
        const investorsEl = document.getElementById('adminInvestorsCount');

       if (usersEl) usersEl.textContent = data.users_count ?? 0;
if (projectsEl) projectsEl.textContent = data.projects_count ?? 0;
if (contactsEl) contactsEl.textContent = data.entrepreneurs_count ?? 0;
if (investorsEl) investorsEl.textContent = data.investors_count ?? 0;

    } catch (error) {
        console.error('ADMIN DASHBOARD ERROR:', error);
    }
}
// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.role === 'admin') {
    loadAdminDashboard();
}
    console.log('منصة تمكين رائدات الأعمال - تم تحميل الموقع بنجاح ✅');

    loadRememberedData();
    renderProfileData();
    fillProfileForm();
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const subject = document.getElementById('contactSubject')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();

        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || 'فشل إرسال الرسالة', 'info');
                return;
            }

            showToast('تم إرسال الرسالة بنجاح ✅', 'success');
            contactForm.reset();

        } catch (error) {
            console.error(error);
            showToast('حدث خطأ أثناء إرسال الرسالة', 'info');
        }
    });
}
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                showPage(page);
            }
        });
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                showPage(page);
            }
        });
    });

    const courseSearch = document.getElementById('courseSearch');
    if (courseSearch) {
        courseSearch.addEventListener('input', filterCourses);
    }

    document.querySelectorAll('#coursesPage .btn-primary').forEach(button => {
        button.addEventListener('click', () => {
            showPage('auth');
        });
    });

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

    const loginFormEl = document.getElementById('loginForm');
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value;
            const rememberMe = document.getElementById('rememberMe')?.checked;

            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                const token = data?.data?.token || data?.token || null;

                if (!res.ok || !token) {
                    showToast(data.message || 'فشل تسجيل الدخول', 'info');
                    return;
                }

                saveToken(token);

                if (rememberMe) {
                    saveRememberedData(email, password);
                } else {
                    clearRememberedData();
                }

                const user = await fetchUserProfile();
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    await loadProfileFromApi();
                }

                isLoggedIn = true;
                updateNavigation();
                showPage('dashboard');
                showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
            } catch (error) {
                console.error(error);
                showToast('حدث خطأ في الاتصال بالسيرفر', 'info');
            }
        });
    }

    const registerFormEl = document.getElementById('registerForm');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('registerName')?.value.trim();
            const email = document.getElementById('registerEmail')?.value.trim();
            const password = document.getElementById('registerPassword')?.value;
            const role = registerFormEl.querySelector('input[name="accountType"]:checked')?.value || 'entrepreneur';

            try {
                const res = await fetch(`${API_BASE}/register`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        password_confirmation: password,
                        role
                    })
                });

                const data = await res.json();
                const token = data?.data?.token || data?.token || null;

                if (!res.ok) {
                    showToast(data.message || 'فشل إنشاء الحساب', 'info');
                    return;
                }

                if (token) {
                    saveToken(token);

                    const user = await fetchUserProfile();
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        await loadProfileFromApi();
                    }

                    isLoggedIn = true;
                    updateNavigation();
                    showPage('dashboard');
                    showToast('تم إنشاء الحساب وتسجيل الدخول ✅', 'success');
                } else {
                    showToast('تم إنشاء الحساب ✅ سجّلي دخولك الآن', 'success');
                    switchAuthTab('login');
                }
            } catch (error) {
                console.error(error);
                showToast('حدث خطأ في الاتصال بالسيرفر', 'info');
            }
        });
    }

    waitForGoogleAccounts(initGoogleIdentity);

    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '#10b981';
            }
        });

        input.addEventListener('focus', function () {
            this.style.borderColor = '#7c3aed';
        });
    });

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

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !statValue.dataset.animated) {
                    statValue.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => statsObserver.observe(stat));

    const token = getToken();
    if (token) {
        const user = await fetchUserProfile();
        if (user) {
            isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(user));
            updateNavigation();
            await loadProfileFromApi();
            showPage('dashboard');
        } else {
            clearToken();
            isLoggedIn = false;
            resetGuestNav();
            showPage('landing');
        }
    } else {
        resetGuestNav();
        showPage('landing');
    }

    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '1';
    }, 100);
});


    // This code block was orphaned and has been removed
// ==========================================
// Export functions
// ==========================================
window.showPage = showPage;
window.switchAuthTab = switchAuthTab;
window.logout = logout;
window.showToast = showToast;
window.showProfile = showProfile;
window.toggleFaq = toggleFaq;