let employees = [];

const tbody = document.getElementById("employeeTableBody");
const archivedBody = document.getElementById("archivedEmployeeTableBody");

const searchInput = document.getElementById("searchInput");

const addModal = document.getElementById("addModal");
const form = document.getElementById("employeeForm");
const addBtn = document.getElementById("addBtn");


async function loadEmployees() {

    try {

        const response = await fetch("./data/employee_info.json");

        if (!response.ok)
            throw new Error("Unable to load employees.");

        const data = await response.json();

        employees = data.employeeInformation.map(emp => ({
            ...emp,
            isDeleted: false
        }));

        render();

    } catch (err) {

        console.error(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load employee data.
                </td>
            </tr>
        `;
    }

}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}

function stringToColor(str) {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {

        hash = str.charCodeAt(i) + ((hash << 5) - hash);

    }

    return `hsl(${Math.abs(hash) % 360},70%,50%)`;

}

function render(list = employees) {

    tbody.innerHTML = "";

    if (archivedBody)
        archivedBody.innerHTML = "";

    const activeEmployees = list.filter(emp => !emp.isDeleted);

    const archivedEmployees = employees.filter(emp => emp.isDeleted);

    document.getElementById("totalCount").textContent = activeEmployees.length;

    document.getElementById("totalEmployees").textContent = activeEmployees.length;

    const payrollTotal = activeEmployees.reduce(
        (sum, emp) => sum + emp.salary,
        0
    );

    document.getElementById("monthlyPayroll").textContent =
        "R" + (payrollTotal / 1000000).toFixed(2) + "M";

    activeEmployees.forEach(emp => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>E${String(emp.employeeId).padStart(3,"0")}</td>

            <td>
                <span class="em-avatar"
                style="background:${stringToColor(emp.name)}">
                ${getInitials(emp.name)}
                </span>
                ${emp.name}
            </td>

            <td>${emp.department}</td>

            <td>${emp.position}</td>

            <td>R${emp.salary.toLocaleString()}</td>

            <td>
                <span class="em-status active">
                    Active
                </span>
            </td>

            <td>
                <button class="em-btn-delete"
                onclick="deleteEmp(${emp.employeeId})">
                🗑 Delete
                </button>
            </td>
        `;

        tbody.appendChild(row);

    });

    if (archivedBody) {

        archivedEmployees.forEach(emp => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>E${String(emp.employeeId).padStart(3,"0")}</td>

                <td>${emp.name}</td>

                <td>${emp.department}</td>

                <td>${emp.position}</td>

                <td>R${emp.salary.toLocaleString()}</td>

                <td>
                    <span class="em-status archived">
                        Archived
                    </span>
                </td>

                <td>
                    <button class="em-btn-retrieve"
                    onclick="restoreEmp(${emp.employeeId})">
                    ↩ Restore
                    </button>
                </td>
            `;

            archivedBody.appendChild(row);

        });

    }

}searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase().trim();

    const filtered = employees.filter(emp => {

        if (emp.isDeleted) return false;

        const id = "e" + String(emp.employeeId).padStart(3, "0");

        return (
            emp.name.toLowerCase().includes(value) ||
            emp.department.toLowerCase().includes(value) ||
            emp.position.toLowerCase().includes(value) ||
            id.includes(value) ||
            String(emp.employeeId).includes(value)
        );

    });

    render(filtered);

});


function deleteEmp(id) {

    const employee = employees.find(emp => emp.employeeId === id);

    if (employee) {

        employee.isDeleted = true;

        render();

    }

}

function restoreEmp(id) {

    const employee = employees.find(emp => emp.employeeId === id);

    if (employee) {

        employee.isDeleted = false;

        render();

    }

}

addBtn.addEventListener("click", () => {

    addModal.showModal();

});

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const newEmployee = {

        employeeId: employees.length + 1,

        name: document.getElementById("name").value,

        department: document.getElementById("department").value,

        position: document.getElementById("position").value,

        salary: Number(document.getElementById("salary").value),

        isDeleted: false

    };

    employees.push(newEmployee);

    render();

    form.reset();

    addModal.close();

});


loadEmployees();

// ===== Dark Mode =====

const darkModeToggle = document.getElementById("darkModeToggle");
const toggleText = document.getElementById("toggleText");

// Load saved preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleText.textContent = "Light Mode";
}

darkModeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    if (isDark) {
        localStorage.setItem("theme", "dark");
        toggleText.textContent = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        toggleText.textContent = "Dark Mode";
    }

});