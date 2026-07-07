document.addEventListener("DOMContentLoaded", function () {

    const ctxAttendance = document.getElementById('attendanceChart').getContext('2d');
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

    const ctxDepartment = document.getElementById('departmentChart').getContext('2d');
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

    // 3. PAYROLL TREND LINE CHART
    const ctxPayroll = document.getElementById('payrollChart').getContext('2d');
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
});


document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('darkModeToggle');
    const toggleText = document.getElementById('toggleText');
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.classList.add('dark-mode');
        if (toggleText) toggleText.textContent = 'Light Mode';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            themeToggle.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            if (toggleText) {
                toggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        });
    }
});