// =========================================================================
// 1. IMMEDIATE THEME INITIALIZATION (Prevents white flashing on page load)
// =========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
}
initTheme();

// =========================================================================
// 2. MAIN APPLICATION LOGIC
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- CHARTS INITIALIZATION ---

    // Weekly Attendance Chart
    const ctxAttendance = document.getElementById('attendanceChart')?.getContext('2d');
    if (ctxAttendance) {
        new Chart(ctxAttendance, {
            type: 'bar',
            data: {
                labels: ['Mon Jul 1', 'Tue Jul 2', 'Wed Jul 3', 'Thu Jul 4', 'Fri Jul 5', 'Sat Jul 6', 'Tue Jul 9'],
                datasets: [
                    {
                        label: 'Present',
                        data: [240, 241, 60, 58, 59, 243, 239],
                        backgroundColor: '#3B82F6',
                        barThickness: 8,
                        borderRadius: 4
                    },
                    {
                        label: 'Absent',
                        data: [4, 5, 2, 3, 1, 4, 3],
                        backgroundColor: '#F59E0B',
                        barThickness: 4,
                        borderRadius: 2
                    },
                    {
                        label: 'Late',
                        data: [2, 4, 1, 2, 3, 1, 2],
                        backgroundColor: '#EF4444',
                        barThickness: 4,
                        borderRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: { min: 3, max: 250, ticks: { stepSize: 65, font: { size: 10 } }, grid: { borderDash: [4, 4] } }
                }
            }
        });
    }

    // Department Chart
    const ctxDepartment = document.getElementById('departmentChart')?.getContext('2d');
    if (ctxDepartment) {
        new Chart(ctxDepartment, {
            type: 'doughnut',
            data: {
                labels: ['Engineering', 'Sales', 'QA', 'Support', 'Marketing', 'HR'],
                datasets: [{
                    data: [82, 44, 31, 47, 28, 18],
                    backgroundColor: ['#3B82F6', '#06B6D4', '#A855F7', '#F59E0B', '#10B981', '#EF4444'],
                    borderWidth: 0,
                    weight: 0.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });
    }

    // Payroll Trend Chart
    const ctxPayroll = document.getElementById('payrollChart')?.getContext('2d');
    if (ctxPayroll) {
        new Chart(ctxPayroll, {
            type: 'line',
            data: {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    data: [1820, 1845, 1860, 1878, 1890, 1910],
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F6',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#3B82F6',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { min: 1800, max: 1950, ticks: { stepSize: 40 }, grid: { borderDash: [4, 4] } }
                }
            }
        });
    }


    // --- UNIFIED DARK MODE TOGGLE LOGIC ---

    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggleText = document.getElementById('toggleText');
    const htmlElement = document.documentElement;

    // Synchronize toggle text with the currently saved/active theme state
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    updateToggleText(currentTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const activeTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            
            // Apply theme globally to Bootstrap framework
            htmlElement.setAttribute('data-bs-theme', newTheme);
            
            // Persistence across multi-page jumps
            localStorage.setItem('theme', newTheme);
            
            // Sync current button text description
            updateToggleText(newTheme);
        });
    }

    function updateToggleText(theme) {
        if (toggleText) {
            toggleText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
});