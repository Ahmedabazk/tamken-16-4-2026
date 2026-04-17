/* ==========================================
   Admin Dashboard - JavaScript
   ========================================== */

// 📌 تم ربط لوحة التحكم بالموقع الرئيسي (index.html)
// 📌 يمكن الوصول إليها من:
//    - رابط في navbar (⚙️ لوحة التحكم)
//    - صفحة تسجيل الدخول
//    - الرابط المباشر: /admin.html
// 📌 للعودة إلى الموقع الرئيسي: اضغط على الشعار أو زر "العودة للموقع" في الـ sidebar

let currentPage = 'overview';
let chartsInitialized = false;

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeCharts();
    setupPageNavigation();
    updateDateTime();
});

function initializeEventListeners() {
    // Sidebar Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(link.dataset.page);
        });
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch(e.target.value);
            }
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Date filter
    const dateFilter = document.querySelector('.date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            updateCharts(e.target.value);
        });
    }

    // Chart period buttons
    const chartPeriods = document.querySelectorAll('.chart-period');
    chartPeriods.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            chartPeriods.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCharts(btn.textContent);
        });
    });

    // Action buttons
    setupActionButtons();

    // Notification bell
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('mouseenter', showNotifications);
    }

    // Table search
    const tableSearch = document.querySelector('.search-input input');
    if (tableSearch) {
        tableSearch.addEventListener('keyup', (e) => {
            filterTable(e.target.value);
        });
    }

    // Filter select
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterTable(e.target.value);
        });
    }

    // Settings inputs
    const settingInputs = document.querySelectorAll('.setting-group input');
    settingInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary)';
        });
    });

    // Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('btn-primary')) {
                showToast(`تم النقر على ${btn.textContent}`, 'success');
            }
        });
    });

    // Action button clicks
    const actionBtns = document.querySelectorAll('.btn-action');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.classList.contains('edit')) {
                showToast('جاري فتح نموذج التعديل...', 'info');
            } else if (btn.classList.contains('delete')) {
                if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
                    showToast('تم حذف العنصر بنجاح', 'success');
                }
            }
        });
    });
}

function setupPageNavigation() {
    // Setup navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
}

function navigateToPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
        currentPage = pageName;

        // Initialize charts if on overview
        if (pageName === 'overview' && !chartsInitialized) {
            setTimeout(() => {
                initializeCharts();
            }, 100);
        }
    }
}

// ==========================================
// Chart Initialization
// ==========================================

function initializeCharts() {
    if (chartsInitialized) return;

    const growthChartCanvas = document.getElementById('growthChart');
    const categoriesChartCanvas = document.getElementById('categoriesChart');

    if (growthChartCanvas && categoriesChartCanvas && typeof Chart !== 'undefined') {
        // Growth Chart
        const growthCtx = growthChartCanvas.getContext('2d');
        new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                datasets: [{
                    label: 'المستخدمون الجدد',
                    data: [65, 89, 125, 145, 180, 210, 240],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });

        // Categories Chart
        const categoriesCtx = categoriesChartCanvas.getContext('2d');
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['التكنولوجيا', 'التسويق', 'الخدمات', 'التجارة', 'أخرى'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#6366f1',
                        '#ec4899',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: "'Cairo', 'Tajawal', sans-serif"
                            },
                            padding: 15
                        }
                    }
                }
            }
        });

        chartsInitialized = true;
    }
}

function updateCharts(period) {
    showToast(`تم تحديث البيانات للفترة: ${period}`, 'info');
    // Here you would fetch new data based on the period
}

// ==========================================
// Notifications & Toast
// ==========================================

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles if not already added
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            .toast {
                position: fixed;
                top: 20px;
                left: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                background: white;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 2000;
                animation: slideInLeft 0.3s ease;
                max-width: 400px;
            }

            @keyframes slideInLeft {
                from {
                    transform: translateX(-500px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .toast-success {
                border-left: 4px solid #10b981;
            }

            .toast-success .toast-content {
                color: #065f46;
            }

            .toast-success i {
                color: #10b981;
            }

            .toast-error {
                border-left: 4px solid #ef4444;
            }

            .toast-error .toast-content {
                color: #7f1d1d;
            }

            .toast-error i {
                color: #ef4444;
            }

            .toast-info {
                border-left: 4px solid #3b82f6;
            }

            .toast-info .toast-content {
                color: #1e3a8a;
            }

            .toast-info i {
                color: #3b82f6;
            }

            .toast-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 14px;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function showNotifications() {
    // Already shown via CSS hover
}

// ==========================================
// Table Filtering
// ==========================================

function filterTable(searchValue) {
    const table = document.querySelector('.data-table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const isVisible = text.includes(searchValue.toLowerCase());
        row.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
    });

    // Show message if no results
    if (visibleCount === 0) {
        showToast('لم يتم العثور على نتائج', 'info');
    }
}

// ==========================================
// Search & Functionality
// ==========================================

function performSearch(query) {
    if (query.trim()) {
        showToast(`البحث عن: ${query}`, 'info');
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        showToast('جاري تسجيل الخروج...', 'info');
        // Simulate logout
        setTimeout(() => {
            // window.location.href = 'index.html';
        }, 1000);
    }
}

// ==========================================
// Setup Action Buttons
// ==========================================

function setupActionButtons() {
    // Add project buttons
    const addProjectBtns = document.querySelectorAll('.project-actions .btn-primary');
    addProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('جاري فتح تفاصيل المشروع...', 'info');
        });
    });

    // Edit project buttons
    const editProjectBtns = document.querySelectorAll('.project-actions .btn-outline');
    editProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('جاري فتح نموذج التعديل...', 'info');
        });
    });
}

// ==========================================
// Utility Functions
// ==========================================

function updateDateTime() {
    setInterval(() => {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat('ar-SA', options);
        // Update any date display if needed
    }, 60000);
}

// ==========================================
// Advanced Features
// ==========================================

// Track user activity
class ActivityTracker {
    constructor() {
        this.activities = [];
    }

    logActivity(action, details) {
        const activity = {
            timestamp: new Date(),
            action: action,
            details: details
        };
        this.activities.push(activity);
    }

    getActivities() {
        return this.activities;
    }
}

const activityTracker = new ActivityTracker();

// Page view tracking
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) {
        const pageName = e.target.closest('.nav-link').dataset.page;
        activityTracker.logActivity('page_view', { page: pageName });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Ctrl/Cmd + / for help
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showToast('اختصارات لوحة التحكم: Ctrl+K للبحث', 'info');
    }
});

// Responsive sidebar
let isMobile = window.innerWidth <= 768;

window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (wasMobile !== isMobile) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !isMobile) {
            sidebar.classList.remove('active');
        }
    }
});

// Export data simulation
window.exportData = function(format) {
    showToast(`جاري تصدير البيانات بصيغة ${format}...`, 'info');
};

// Print functionality
window.printPage = function() {
    window.print();
};

console.log('✅ لوحة التحكم الاحترافية تم تحميلها بنجاح');
console.log('🎨 التصميم: احترافي عصري مع ميزات متقدمة');
console.log('🚀 النسخة: Pro Enhanced v2.0');
console.log('🔗 الربط: تم ربط لوحة التحكم بنجاح مع الموقع الرئيسي');
console.log('📍 الرجوع: اضغط على الشعار أو زر "العودة للموقع" للعودة إلى index.html');
