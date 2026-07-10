const state = {
    requests: [],
    payroll: []
};

// Calendar starts on the first month that contains leave requests
let currentMonth = 0;
let currentYear = 2025;

document.addEventListener("DOMContentLoaded", () => {
    setupSidebarControls();
    setupThemeToggle();
    loadTimeOffData();
});

function setupSidebarControls() {

    const menuToggle = document.getElementById("timeoffMenuToggle");
    const sidebar = document.getElementById("timeoffSidebar");
    const overlay = document.getElementById("timeoffSidebarOverlay");
    const closeBtn = document.getElementById("timeoffSidebarClose");

    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    menuToggle.addEventListener("click", () => {
        sidebar.classList.add("timeoff-sidebar--open");
        overlay.classList.add("timeoff-sidebar-overlay--visible");
        document.body.classList.add("timeoff-no-scroll");
    });

    function closeSidebar() {
        sidebar.classList.remove("timeoff-sidebar--open");
        overlay.classList.remove("timeoff-sidebar-overlay--visible");
        document.body.classList.remove("timeoff-no-scroll");
    }

    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);
}

function setupThemeToggle() {

    const themeToggle = document.getElementById("darkModeToggle");

    if (!themeToggle || !window.HRTheme) return;

    window.HRTheme.syncThemeControls(
        window.HRTheme.getSavedTheme()
    );

    themeToggle.addEventListener("click", () => {
        window.HRTheme.toggleTheme();
    });

}

async function loadTimeOffData() {

    try {

        const [
            attendanceResponse,
            employeeResponse,
            payrollResponse
        ] = await Promise.all([
            fetch("/attendance.json"),
            fetch("/employee_info.json"),
            fetch("/payroll_data.json")
        ]);

        const attendanceData = await attendanceResponse.json();
        const employeeData = await employeeResponse.json();
        const payrollData = await payrollResponse.json();

        const employeeMap = new Map(
            employeeData.employeeInformation.map(emp => [
                emp.employeeId,
                emp
            ])
        );

        const payrollMap = new Map(
            payrollData.payrollData.map(pay => [
                pay.employeeId,
                pay
            ])
        );

        const requests = [];

        let refCounter = 1;

        attendanceData.attendanceAndLeave.forEach(employeeEntry => {

            const employee =
                employeeMap.get(employeeEntry.employeeId);

            employeeEntry.leaveRequests.forEach((leave, index) => {

                requests.push({

                    id: `${employeeEntry.employeeId}-${index}`,

                    ref:
                        "TOR-" +
                        String(refCounter++).padStart(3, "0"),

                    employeeId: employeeEntry.employeeId,

                    employeeName:
                        employee?.name || "Unknown",

                    employeeTitle:
                        employee?.position || "Employee",

                    department:
                        employee?.department || "HR",

                    initials: getInitials(
                        employee?.name || "Unknown"
                    ),

                    type: leave.reason,

                    reason: leave.reason,

                    fromDate: leave.date,

                    toDate: leave.date,

                    days: 1,

                    status: leave.status,

                    payroll:
                        payrollMap.get(employeeEntry.employeeId)

                });

            });

        });

        state.requests = requests;
        state.payroll = payrollData.payrollData;

        // Automatically open on the month of the first leave request
        if (state.requests.length > 0) {

            const first = new Date(state.requests[0].fromDate);

            currentMonth = first.getMonth();
            currentYear = first.getFullYear();

        }

    }

    catch (err) {

        console.error(err);

    }

    render();
    renderCalendar();

}


function render() {

    const pendingCount = state.requests.filter(
        r => r.status.toLowerCase() === "pending"
    ).length;

    const approvedCount = state.requests.filter(
        r => r.status.toLowerCase() === "approved"
    ).length;

    const deniedCount = state.requests.filter(
        r => r.status.toLowerCase() === "denied"
    ).length;

    document.getElementById("pendingCount").textContent = pendingCount;
    document.getElementById("approvedCount").textContent = approvedCount;
    document.getElementById("deniedCount").textContent = deniedCount;

    document.getElementById("timeoffHeaderSummary").textContent =
        `${pendingCount} pending review • ${state.requests.length} total requests`;

    renderPayrollSnapshot();
    renderRequests();

}

function renderPayrollSnapshot() {

    const container = document.getElementById("payrollSnapshot");

    if (!container) return;

    if (!state.payroll.length) {

        container.innerHTML =
            "<div class='timeoff-insight-item'>No Payroll Data</div>";

        return;

    }

    const totalHours = state.payroll.reduce(
        (sum, item) => sum + item.hoursWorked,
        0
    );

    const deductions = state.payroll.reduce(
        (sum, item) => sum + item.leaveDeductions,
        0
    );

    const avgSalary = Math.round(

        state.payroll.reduce(
            (sum, item) => sum + item.finalSalary,
            0
        ) / state.payroll.length

    );

    container.innerHTML = `

        <div class="timeoff-insight-item">
            <strong>${totalHours} Hours</strong>
            <span>Total Hours Worked</span>
        </div>

        <div class="timeoff-insight-item">
            <strong>${deductions}</strong>
            <span>Leave Deductions</span>
        </div>

        <div class="timeoff-insight-item">
            <strong>${formatCurrency(avgSalary)}</strong>
            <span>Average Salary</span>
        </div>

    `;

}

function renderRequests() {

    const tbody = document.getElementById("timeoffTableBody");

    if (!tbody) return;

    if (!state.requests.length) {

        tbody.innerHTML = `

        <tr>
            <td colspan="9" class="text-center py-4">
                No Leave Requests Found
            </td>
        </tr>

        `;

        return;

    }

    const statusOrder = {

        pending: 0,
        approved: 1,
        denied: 2

    };

    const requests = [...state.requests].sort(

        (a, b) =>
            statusOrder[a.status.toLowerCase()] -
            statusOrder[b.status.toLowerCase()]

    );

    tbody.innerHTML = requests.map(request => `

<tr>

<td>${request.ref}</td>

<td>

<div class="timeoff-employee-cell">

<div
class="timeoff-avatar"
style="background:${getAvatarColor(request.employeeName)}">

${request.initials}

</div>

<div>

<div class="timeoff-employee-name">

${request.employeeName}

</div>

<div class="timeoff-muted-text">

${request.department}

</div>

</div>

</div>

</td>

<td>${request.type}</td>

<td>${formatDate(request.fromDate)}</td>

<td>${formatDate(request.toDate)}</td>

<td>${request.days}</td>

<td>${request.reason}</td>

<td>

<span class="timeoff-badge-status ${getStatusClass(request.status)}">

${request.status}

</span>

</td>

<td>

${request.status.toLowerCase()=="pending"

?

`

<button
class="timeoff-btn-approve"
data-id="${request.id}">

Approve

</button>

<button
class="timeoff-btn-deny"
data-id="${request.id}">

Deny

</button>

`

:

`

<button
class="timeoff-btn-revert"
data-id="${request.id}">

↩ Revert

</button>

`

}

</td>

</tr>

`).join("");

    document.querySelectorAll(".timeoff-btn-approve").forEach(btn => {

        btn.onclick = () => {

            const request = state.requests.find(
                r => r.id === btn.dataset.id
            );

            request.status = "Approved";

            render();
            renderCalendar();

        };

    });

    document.querySelectorAll(".timeoff-btn-deny").forEach(btn => {

        btn.onclick = () => {

            const request = state.requests.find(
                r => r.id === btn.dataset.id
            );

            request.status = "Denied";

            render();
            renderCalendar();

        };

    });

    document.querySelectorAll(".timeoff-btn-revert").forEach(btn => {

        btn.onclick = () => {

            const request = state.requests.find(
                r => r.id === btn.dataset.id
            );

            request.status = "Pending";

            render();
            renderCalendar();

        };

    });

}

function getStatusClass(status) {

    status = (status || "").toLowerCase();

    if (status === "approved") return "timeoff-status-approved";
    if (status === "denied") return "timeoff-status-denied";

    return "timeoff-status-pending";

}

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .slice(0,2)
        .join("");

}

function getAvatarColor(name) {

    const colors = [
        "#0ea5e9",
        "#0284c7",
        "#6366f1",
        "#ca8a04",
        "#9333ea",
        "#d97706"
    ];

    let hash = 0;

    for(let i=0;i<name.length;i++){

        hash += name.charCodeAt(i);

    }

    return colors[hash % colors.length];

}

function formatDate(value){

    if(!value) return "-";

    const date = new Date(value);

    return date.toLocaleDateString("en-ZA");

}

function formatCurrency(value){

    return new Intl.NumberFormat("en-ZA",{

        style:"currency",
        currency:"ZAR",
        maximumFractionDigits:0

    }).format(value);

}

function escapeHtml(value){

    return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");

}

function renderCalendar(){

    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("calendarTitle");

    if(!grid) return;

    const months=[

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];

    title.textContent=`${months[currentMonth]} ${currentYear} Leave Calendar`;

    grid.innerHTML="";

    const firstDay=new Date(currentYear,currentMonth,1).getDay();

    const totalDays=new Date(currentYear,currentMonth+1,0).getDate();

    for(let i=0;i<firstDay;i++){

        const empty=document.createElement("div");
        empty.className="calendar-day empty";
        grid.appendChild(empty);

    }

    for(let day=1;day<=totalDays;day++){

        const cell=document.createElement("div");
        cell.className="calendar-day";

        const number=document.createElement("div");
        number.className="day-number";
        number.textContent=day;

        cell.appendChild(number);

        const requests=state.requests.filter(request=>{

            const d=new Date(request.fromDate);

            return (

                d.getFullYear()===currentYear &&
                d.getMonth()===currentMonth &&
                d.getDate()===day

            );

        });

        if(requests.length){

            const approved=requests.filter(
                r=>r.status.toLowerCase()==="approved"
            );

            const pending=requests.filter(
                r=>r.status.toLowerCase()==="pending"
            );

            const denied=requests.filter(
                r=>r.status.toLowerCase()==="denied"
            );

            if(approved.length){

                cell.classList.add("calendar-approved");

            }
            else if(pending.length){

                cell.classList.add("calendar-pending");

            }
            else if(denied.length){

                cell.classList.add("calendar-denied");

            }

            const badge=document.createElement("div");
            badge.className="leave-count";
            badge.textContent=requests.length;

            cell.appendChild(badge);

            const tooltip=document.createElement("div");
            tooltip.className="calendar-tooltip";

            tooltip.innerHTML=requests.map(r=>`

                <strong>${r.employeeName}</strong><br>

                ${r.status}

            `).join("<hr>");

            cell.appendChild(tooltip);

        }

        grid.appendChild(cell);

    }

}