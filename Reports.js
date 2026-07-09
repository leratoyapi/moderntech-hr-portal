// State arrays mapped directly from your logic variables
let employees = [];
let selectedEmployeeId = null;
let activeVisibility = 'Private';

// Fallback seed array parsed into flat database contexts
const seedEmployees = [
    {
        "employeeId": 1,
        "name": "Sibongile Nkosi",
        "position": "Software Engineer",
        "department": "Development",
        "salary": 70000,
        "employmentHistory": [],
        "contact": "sibongile.nkosi@moderntech.com"
    },
    {
        "employeeId": 2,
        "name": "Lungile Moyo",
        "position": "HR Manager",
        "department": "HR",
        "salary": 80000,
        "employmentHistory": [],
        "contact": "lungile.moyo@moderntech.com"
    },
    {
        "employeeId": 3,
        "name": "Thabo Molefe",
        "position": "Quality Analyst",
        "department": "QA",
        "salary": 55000,
        "employmentHistory": [],
        "contact": "thabo.molefe@moderntech.com"
    },
    {
        "employeeId": 4,
        "name": "Keshav Naidoo",
        "position": "Sales Representative",
        "department": "Sales",
        "salary": 60000,
        "employmentHistory": [],
        "contact": "keshav.naidoo@moderntech.com"
    },
    {
        "employeeId": 5,
        "name": "Zanele Khumalo",
        "position": "Marketing Specialist",
        "department": "Marketing",
        "salary": 58000,
        "employmentHistory": [],
        "contact": "zanele.khumalo@moderntech.com"
    },
    {
        "employeeId": 6,
        "name": "Sipho Zulu",
        "position": "UI/UX Designer",
        "department": "Design",
        "salary": 65000,
        "employmentHistory": [],
        "contact": "sipho.zulu@moderntech.com"
    },
    {
        "employeeId": 7,
        "name": "Naledi Moeketsi",
        "position": "DevOps Engineer",
        "department": "IT",
        "salary": 72000,
        "employmentHistory": [],
        "contact": "naledi.moeketsi@moderntech.com"
    },
    {
        "employeeId": 8,
        "name": "Farai Gumbo",
        "position": "Content Strategist",
        "department": "Marketing",
        "salary": 56000,
        "employmentHistory": [],
        "contact": "farai.gumbo@moderntech.com"
    },
    {
        "employeeId": 9,
        "name": "Karabo Dlamini",
        "position": "Accountant",
        "department": "Finance",
        "salary": 62000,
        "employmentHistory": [],
        "contact": "karabo.dlamini@moderntech.com"
    },
    {
        "employeeId": 10,
        "name": "Fatima Patel",
        "position": "Customer Support Lead",
        "department": "Support",
        "salary": 58000,
        "employmentHistory": [],
        "contact": "fatima.patel@moderntech.com"
    }
];

// Core async initializer engine
async function loadEmployees() {
    try {
        const res = await fetch('./employee_info.json');
        if (!res.ok) throw new Error('Network file fetch context missing');
        const data = await res.json();
        
        // Map incoming data schema to support your employmentHistory reviews array
        employees = data.employeeInformation.map(emp => ({
            employeeId: emp.employeeId,
            name: emp.name,
            department: emp.department,
            position: emp.position || "Staff Associate",
            createdDate: new Date().toISOString().split('T')[0],
            employmentHistory: Array.isArray(emp.employmentHistory) ? emp.employmentHistory : []
        }));
    } catch (err) {
        console.error("JSON Loading Error:", err); 
        console.warn("Using local seeded employee database context instead.");
        
        // Process default seeds through normalization step
        employees = seedEmployees.map(emp => ({
            ...emp,
            createdDate: new Date().toISOString().split('T')[0],
            employmentHistory: Array.isArray(emp.employmentHistory) ? emp.employmentHistory : []
        }));
    }        
    
    renderList();
    
    // Auto-select first item on boot
    if (employees.length > 0) {
        selectEmployee(employees[0].employeeId);
    }
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 65%, 50%)`;
}

// Refactored dynamic listing render loop with real-time text matching
function renderList() {
    const container = document.getElementById('employeeListContainer');
    if (!container) return; // Prevent errors if loaded on wrong page
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    container.innerHTML = '';

    // Defensively filter to prevent crashes on undefined/null properties
    const filtered = employees.filter(emp => {
        const name = (emp.name || '').toLowerCase();
        const department = (emp.department || '').toLowerCase();
        const position = (emp.position || '').toLowerCase();

        return name.includes(searchTerm) || 
               department.includes(searchTerm) || 
               position.includes(searchTerm);
    });

    filtered.forEach(emp => {
        const color = stringToColor(emp.name || 'EE');
        const initials = getInitials(emp.name || 'EE');
        const isActive = emp.employeeId === selectedEmployeeId ? 'active' : '';
        const textClass = emp.employeeId === selectedEmployeeId ? 'text-primary text-decoration-underline' : 'text-secondary';
        const count = emp.employmentHistory ? emp.employmentHistory.length : 0;
        const targetDate = emp.createdDate || "2026-07-02";

        const itemHtml = `
            <div class="list-group-item employee-item d-flex align-items-center justify-content-between py-2 border-0 border-bottom ${isActive}" 
                 onclick="selectEmployee(${emp.employeeId})">
                <div class="d-flex align-items-center min-w-0">
                    <div class="avatar-circle me-3" style="background-color: ${color};">${initials}</div>
                    <div class="text-truncate">
                        <div class="fw-bold ${textClass} text-truncate" style="font-size: 0.95rem;">${emp.name || 'Unknown'}</div>
                        <div class="text-muted small text-truncate">${emp.department || 'General'}</div>
                    </div>
                </div>
                <div class="text-end flex-shrink-0">
                    <span class="badge text-dark bg-transparent p-0 small fw-bold">${count}</span>
                    <div class="text-muted-sm">${targetDate}</div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Synchronizes structural review views upon selection toggles
function selectEmployee(id) {
    selectedEmployeeId = id;
    const emp = employees.find(e => e.employeeId === id);
    if (!emp) return;

    // Repaint selection active highlights
    renderList();

    // Bind main review card info
    if (document.getElementById('activeName')) document.getElementById('activeName').innerText = emp.name;
    if (document.getElementById('activeRole')) document.getElementById('activeRole').innerText = `${emp.position} · ${emp.department}`;
    
    const activeAvatar = document.getElementById('activeAvatar');
    if (activeAvatar) {
        activeAvatar.innerText = getInitials(emp.name);
        activeAvatar.style.backgroundColor = stringToColor(emp.name);
    }

    // Repaint history list space container Workspace
    renderHistory(emp);
}

function renderHistory(emp) {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    historyContainer.innerHTML = '';
    
    const entries = emp.employmentHistory || [];
    if (document.getElementById('historyHeader')) {
        document.getElementById('historyHeader').innerText = `History · ${entries.length} Entries`;
    }

    if (entries.length === 0) {
        historyContainer.innerHTML = `<div class="text-center text-muted py-4 small card card-custom">No logs found for this employee profile context.</div>`;
        return;
    }

    // Render entries backwards chronologically
    [...entries].reverse().forEach(entry => {
        let badgeColorClass = 'text-primary border-primary-subtle';
        if (entry.type === 'Check-in') badgeColorClass = 'text-info border-info-subtle';
        if (entry.type === 'Performance') badgeColorClass = 'text-warning border-warning-subtle';
        if (entry.type === 'Commendation') badgeColorClass = 'text-success border-success-subtle';
        if (entry.type === 'Disciplinary') badgeColorClass = 'text-danger border-danger-subtle';

        const privateBadge = entry.visibility === 'Private' 
            ? `<span class="badge bg-light text-secondary border px-2 py-1 ms-1">Private</span>` 
            : '';

        const cardHtml = `
            <div class="card card-custom p-3 animate-entry">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-light ${badgeColorClass} border px-2 py-1">${entry.type}</span>
                        ${privateBadge}
                    </div>
                    <div class="text-end">
                        <div class="fw-semibold text-muted-sm text-dark">${entry.date}</div>
                        <div class="text-muted-sm">Admin User</div>
                    </div>
                </div>
                <p class="small text-secondary m-0" style="line-height: 1.6;">${entry.text}</p>
            </div>
        `;
        historyContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// Pipeline handling updates directly into dynamic data storage context models
function saveReviewEntry() {
    if (!selectedEmployeeId) {
        alert('Please select an active employee profile track first.');
        return;
    }

    const commentBox = document.getElementById('reviewComment');
    const commentText = commentBox ? commentBox.value.trim() : '';
    const reviewType = document.getElementById('reviewType')?.value || 'Check-in';

    if (!commentText) {
        alert('Please enter a comment before saving.');
        return;
    }

    const targetEmployee = employees.find(emp => emp.employeeId === selectedEmployeeId);
    if (!targetEmployee) return;

    // Append to state model structure layer
    targetEmployee.employmentHistory.push({
        type: reviewType,
        visibility: activeVisibility,
        date: new Date().toISOString().split('T')[0],
        text: commentText
    });

    // Reset tracking entry layout components
    if (commentBox) commentBox.value = '';
    if (document.getElementById('charCount')) document.getElementById('charCount').innerText = '0 chars';

    // Refresh layouts locally
    selectEmployee(selectedEmployeeId);
}

function addNewEmployee() {
    const nameInput = document.getElementById('newEmpName');
    const posInput = document.getElementById('newEmpPos');
    const deptInput = document.getElementById('newEmpDept');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const position = posInput ? posInput.value.trim() || "Staff Associate" : "Staff Associate";
    const department = deptInput ? deptInput.value : 'General';

    if (!name) {
        alert('Please enter an employee name');
        return;
    }

    // Generate dynamic unique key tracking indexes
    const newId = employees.length > 0 ? Math.max(...employees.map(emp => emp.employeeId)) + 1 : 1;

    const newEmp = {
        employeeId: newId,
        name: name,
        department: department,
        position: position,
        createdDate: new Date().toISOString().split('T')[0],
        employmentHistory: []
    };

    employees.push(newEmp);
    
    // Reset Inputs
    if (nameInput) nameInput.value = '';
    if (posInput) posInput.value = '';
    
    // Close form dropdown clean structure handles
    const collapseEl = document.getElementById('addEmployeeForm');
    if (collapseEl && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) bsCollapse.hide();
    }

    // Switch selection context view automatically over to newly created employee tracking fields
    selectEmployee(newId);
}

function toggleVisibility(element) {
    const group = document.getElementById('visibilityGroup');
    if (group) {
        group.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    }
    element.classList.add('active');
    activeVisibility = element.innerText;
}

function updateCharCount(textarea) {
    if (document.getElementById('charCount')) {
        document.getElementById('charCount').innerText = `${textarea.value.length} chars`;
    }
}

// Attach local search tracking events natively 
document.getElementById('searchInput')?.addEventListener('input', renderList);
document.addEventListener('DOMContentLoaded', loadEmployees);


    // State management variable for the file instance
    let attachedWordFile = null;

    function handleFileSelection(input) {
        const statusDiv = document.getElementById('fileUploadStatus');
        const commentBox = document.getElementById('reviewComment');
        
        if (input.files && input.files[0]) {
            attachedWordFile = input.files[0];
            
            // UI visual feedback update
            statusDiv.classList.remove('d-none');
            
            // Optional/Helper workflow: Automatically pre-populate context details
            if(commentBox && commentBox.value.trim() === "") {
                commentBox.value = `[Imported from Shared Drive File: ${attachedWordFile.name}]\n`;
                updateCharCount(commentBox);
            }
        } else {
            attachedWordFile = null;
            statusDiv.classList.add('d-none');
        }
    }

    // Intercept or modify your existing dashboard save routine
    const originalSaveReviewEntry = window.saveReviewEntry;
    
    window.saveReviewEntry = function() {
        const commentBox = document.getElementById('reviewComment');
        
        if (!commentBox || !commentBox.value.trim()) {
            alert("Please provide comments or ensure word document metadata context is appended.");
            return;
        }

        // Logic placeholder for your system application
        console.log("Saving systemic review data...");
        if (attachedWordFile) {
            console.log(`Payload package includes shared drive pointer attachment: ${attachedWordFile.name}`);
            // If utilizing standard fetch endpoints, append this file directly to a FormData object:
            // let formData = new FormData();
            // formData.append("wordDocument", attachedWordFile);
        }

        // Call your original routine layout logic if present
        if (typeof originalSaveReviewEntry === "function") {
            originalSaveReviewEntry();
        } else {
            // Fallback clear if dashboard.js hasn't initialized fully yet
            document.getElementById('wordFileInput').value = "";
            document.getElementById('fileUploadStatus').classList.add('d-none');
            attachedWordFile = null;
        }
    };
