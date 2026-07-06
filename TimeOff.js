const state = {
    requests: [],
    payroll: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadTimeOffData();
});

async function loadTimeOffData() {
    try {
        const [attendanceResponse, employeeResponse, payrollResponse] = await Promise.all([
            fetch('attendance.json'),
            fetch('employee_info.json'),
            fetch('payroll_data.json')
        ]);

        if (!attendanceResponse.ok || !employeeResponse.ok || !payrollResponse.ok) {
            throw new Error('Unable to load one of the data files.');
        }

        const attendanceData = await attendanceResponse.json();
        const employeeData = await employeeResponse.json();
        const payrollData = await payrollResponse.json();

        const employeeMap = new Map((employeeData.employeeInformation || []).map((employee) => [employee.employeeId, employee]));
        const payrollMap = new Map((payrollData.payrollData || []).map((entry) => [entry.employeeId, entry]));

        const allRequests = [];
        let refCounter = 1;

        for (const employeeEntry of (attendanceData.attendanceAndLeave || [])) {
            const employee = employeeMap.get(employeeEntry.employeeId) || {
                name: employeeEntry.name || 'Unknown Employee',
                position: 'Employee',
                department: 'HR'
            };

            for (const [index, request] of (employeeEntry.leaveRequests || []).entries()) {
                allRequests.push({
                    id: `${employeeEntry.employeeId}-${index}`,
                    ref: `TOR-${String(refCounter++).padStart(3, '0')}`,
                    employeeId: employeeEntry.employeeId,
                    employeeName: employee.name,
                    employeeTitle: employee.position || 'Employee',
                    department: employee.department || 'HR',
                    initials: getInitials(employee.name),
                    type: request.reason || 'Leave',
                    reason: request.reason || 'Leave request',
                    fromDate: request.date,
                    toDate: request.date,
                    days: 1,
                    status: request.status || 'Pending',
                    payroll: payrollMap.get(employeeEntry.employeeId) || null
                });
            }
        }

        state.requests = allRequests;

        state.payroll = payrollData.payrollData || [];
    } catch (error) {
        console.error('Time Off data could not be loaded:', error);
        state.requests = [];
        state.payroll = [];
    }

    render();
}

function render() {
    const pendingCount = state.requests.filter((request) => request.status.toLowerCase() === 'pending').length;
    const approvedCount = state.requests.filter((request) => request.status.toLowerCase() === 'approved').length;
    const deniedCount = state.requests.filter((request) => request.status.toLowerCase() === 'denied').length;

    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('approvedCount').textContent = approvedCount;
    document.getElementById('deniedCount').textContent = deniedCount;
    document.getElementById('timeoffHeaderSummary').textContent = `${pendingCount} pending review • ${state.requests.length} total requests`;

    renderPayrollSnapshot();
    renderRequests();
}

function renderPayrollSnapshot() {
    const container = document.getElementById('payrollSnapshot');

    if (!container) return;

    if (!state.payroll.length) {
        container.innerHTML = '<div class="timeoff-insight-item"><strong>No payroll data available</strong><span>Upload the payroll JSON file to view payroll insights.</span></div>';
        return;
    }

    const totalHours = state.payroll.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);
    const totalDeduction = state.payroll.reduce((sum, entry) => sum + (entry.leaveDeductions || 0), 0);
    const averageSalary = Math.round(state.payroll.reduce((sum, entry) => sum + (entry.finalSalary || 0), 0) / state.payroll.length);

    container.innerHTML = `
        <div class="timeoff-insight-item">
            <strong>${totalHours} hours tracked</strong>
            <span>Combined hours from the latest payroll entries.</span>
        </div>
        <div class="timeoff-insight-item">
            <strong>${totalDeduction} leave deductions</strong>
            <span>Leave-related deductions recorded in the payroll dataset.</span>
        </div>
        <div class="timeoff-insight-item">
            <strong>Average salary ${formatCurrency(averageSalary)}</strong>
            <span>Computed from the current payroll snapshot.</span>
        </div>
    `;
}

function renderRequests() {
    const tbody = document.getElementById('timeoffTableBody');

    if (!state.requests.length) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-secondary py-4">No leave requests were found.</td></tr>';
        return;
    }

    const sortedRequests = [...state.requests].sort((left, right) => {
        const statusOrder = { pending: 0, approved: 1, denied: 2 };
        return statusOrder[left.status.toLowerCase()] - statusOrder[right.status.toLowerCase()];
    });

    tbody.innerHTML = sortedRequests.map((request) => `
        <tr>
            <td class="timeoff-ref-cell">${escapeHtml(request.ref)}</td>
            <td>
                <div class="timeoff-employee-cell">
                    <div class="timeoff-avatar" style="background-color: ${getAvatarColor(request.employeeName)};">${request.initials}</div>
                    <div>
                        <div class="timeoff-employee-name">${escapeHtml(request.employeeName)}</div>
                        <div class="timeoff-muted-text">${escapeHtml(request.department)}</div>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(request.type)}</td>
            <td>${formatDate(request.fromDate)}</td>
            <td>${formatDate(request.toDate)}</td>
            <td><strong>${request.days}</strong></td>
            <td>${escapeHtml(request.reason)}</td>
            <td><span class="timeoff-badge-status ${getStatusClass(request.status)}">${escapeHtml(request.status)}</span></td>
            <td class="timeoff-actions-cell">
                ${request.status.toLowerCase() === 'pending'
                    ? `
                        <button class="timeoff-btn-approve" data-action="approve" data-request-id="${request.id}">Approve</button>
                        <button class="timeoff-btn-deny" data-action="deny" data-request-id="${request.id}">Deny</button>
                    `
                    : `<button class="timeoff-btn-revert" data-action="revert" data-request-id="${request.id}">↩ Revert</button>`}
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('button[data-action]').forEach((button) => {
        button.addEventListener('click', () => {
            const requestId = button.getAttribute('data-request-id');
            const action = button.getAttribute('data-action');
            const matchedRequest = state.requests.find((request) => request.id === requestId);

            if (matchedRequest) {
                if (action === 'approve') matchedRequest.status = 'Approved';
                else if (action === 'deny') matchedRequest.status = 'Denied';
                else if (action === 'revert') matchedRequest.status = 'Pending';
                render();
            }
        });
    });
}

function getStatusClass(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'approved') return 'timeoff-status-approved';
    if (normalized === 'denied') return 'timeoff-status-denied';
    return 'timeoff-status-pending';
}

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() || '')
        .join('');
}

function getAvatarColor(name) {
    const colors = ['#0ea5e9', '#0284c7', '#6366f1', '#ca8a04', '#d97706', '#9333ea'];
    const hash = Array.from(name || '').reduce((total, char) => total + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function formatDate(value) {
    if (!value) return '-';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
    }).format(value);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}