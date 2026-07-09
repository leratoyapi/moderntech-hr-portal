// payroll.js - load payroll table, handle dark mode, and show payslip data
// This is written in simple code and short comments.

let currentemployee = null;

// payroll_data is the main client-side data array for the portal.
// This is the dummy data for the table, cards, and payslip pages.
let payroll_data = [
  {
    employeeId: 1,
    name: "Sibongile Nkosi",
    position: "Software Engineer",
    basicSalary: 70000,
    hoursWorked: 160,
    overtimeHours: 8,
    leaveDeductions: 8,
    deductions: 792,
    tax: 1900,
    finalSalary: 69500,
  },
  {
    employeeId: 2,
    name: "Lungile Moyo",
    position: "HR Manager",
    basicSalary: 80000,
    hoursWorked: 150,
    overtimeHours: 4,
    leaveDeductions: 10,
    deductions: 650,
    tax: 1560,
    finalSalary: 79000,
  },
  {
    employeeId: 3,
    name: "Thabo Molefe",
    position: "Quality Analyst",
    basicSalary: 55000,
    hoursWorked: 170,
    overtimeHours: 0,
    leaveDeductions: 4,
    deductions: 600,
    tax: 1440,
    finalSalary: 54800,
  },
  {
    employeeId: 4,
    name: "Keshav Naidoo",
    position: "Sales Representative",
    basicSalary: 60000,
    hoursWorked: 165,
    overtimeHours: 12,
    leaveDeductions: 6,
    deductions: 708,
    tax: 1700,
    finalSalary: 59700,
  },
  {
    employeeId: 5,
    name: "Zanele Khumalo",
    position: "Marketing Specialist",
    basicSalary: 58000,
    hoursWorked: 158,
    overtimeHours: 0,
    leaveDeductions: 5,
    deductions: 917,
    tax: 2200,
    finalSalary: 57850,
  },
  {
    employeeId: 6,
    name: "Sipho Zulu",
    position: "UI/UX Designer",
    basicSalary: 65000,
    hoursWorked: 168,
    overtimeHours: 0,
    leaveDeductions: 2,
    deductions: 917,
    tax: 2200,
    finalSalary: 64800,
  },
  {
    employeeId: 7,
    name: "Naledi Moeketsi",
    position: "DevOps Engineer",
    basicSalary: 72000,
    hoursWorked: 175,
    overtimeHours: 0,
    leaveDeductions: 3,
    deductions: 917,
    tax: 2200,
    finalSalary: 71800,
  },
  {
    employeeId: 8,
    name: "Farai Gumbo",
    position: "Content Strategist",
    basicSalary: 56000,
    hoursWorked: 160,
    overtimeHours: 0,
    leaveDeductions: 0,
    deductions: 917,
    tax: 2200,
    finalSalary: 56000,
  },
  {
    employeeId: 9,
    name: "Karabo Dlamini",
    position: "Accountant",
    basicSalary: 62000,
    hoursWorked: 155,
    overtimeHours: 0,
    leaveDeductions: 5,
    deductions: 917,
    tax: 2200,
    finalSalary: 61500,
  },
  {
    employeeId: 10,
    name: "Fatima Patel",
    position: "Customer Support Lead",
    basicSalary: 58000,
    hoursWorked: 162,
    overtimeHours: 0,
    leaveDeductions: 4,
    deductions: 917,
    tax: 2200,
    finalSalary: 57750,
  },
];

const payrollFallbackData = payroll_data;

// Merge payroll records with employee info using the local JSON files.
// If either JSON file cannot be loaded, fallback to the hardcoded dataset.
async function loadPayrollDataFromJson() {
  const [payrollResponse, employeeResponse] = await Promise.all([
    fetch("./data/payroll_data.json"),
    fetch("./data/employee_info.json"),
  ]);

  if (!payrollResponse.ok || !employeeResponse.ok) {
    throw new Error("Failed to load payroll or employee info JSON.");
  }

  const payrollJson = await payrollResponse.json();
  const employeeJson = await employeeResponse.json();

  const employeeMap = (employeeJson.employeeInformation || []).reduce(
    (map, info) => {
      map[info.employeeId] = info;
      return map;
    },
    {},
  );

  return (payrollJson.payrollData || []).map((item) => {
    const info = employeeMap[item.employeeId] || {};
    const fallback =
      payroll_data.find(
        (fallbackItem) => fallbackItem.employeeId === item.employeeId,
      ) || {};

    return {
      employeeId: item.employeeId,
      name: info.name || fallback.name || `Employee ${item.employeeId}`,
      position: info.position || fallback.position || "Staff",
      basicSalary: info.salary || fallback.basicSalary || 0,
      hoursWorked: item.hoursWorked || fallback.hoursWorked || 0,
      overtimeHours: fallback.overtimeHours || 0,
      leaveDeductions: item.leaveDeductions || fallback.leaveDeductions || 0,
      deductions: fallback.deductions || 0,
      tax: fallback.tax || 0,
      finalSalary: item.finalSalary || fallback.finalSalary || 0,
    };
  });
}

async function loadlocaldata() {
  try {
    const payrollData = await loadPayrollDataFromJson();
    console.log("Local Data Successfully Loaded:", payrollData);
    displayPayslip(payrollData);
  } catch (error) {
    console.warn("Payroll JSON load failed, using fallback data:", error);
    displayPayslip(payrollFallbackData);
  }
}

// Show the payroll table and handle payslip page loading
function displayPayslip(payrollData) {
  const payrollTableBody = document.getElementById("payrollTableBody");
  const payslipCard = document.getElementById("prPayslipCard");
  
  if (payrollTableBody) {
    renderPayrollTable(payrollData);
    updatePayrollCards(payrollData);
    return;
  }
  
  if (payslipCard) {
    prCheckUrlForEmployee(payrollData);
    return;
  }
}

// ============================================
// PAYROLL TABLE RENDERING
// ============================================

function formatCurrency(value) {
  return "R " + value.toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}

function updatePayrollCards(payrollData) {
  const grossValue = payrollData.reduce(
    (sum, item) => sum + item.basicSalary,
    0,
  );
  const deductionsValue = payrollData.reduce(
    (sum, item) => sum + item.deductions + item.tax,
    0,
  );
  const netValue = payrollData.reduce((sum, item) => sum + item.finalSalary, 0);

  const grossElement = document.getElementById("grossPayrollValue");
  const deductionsElement = document.getElementById("deductionsPayrollValue");
  const netElement = document.getElementById("netPayrollValue");

  if (grossElement) grossElement.textContent = formatCurrency(grossValue);
  if (deductionsElement)
    deductionsElement.textContent = formatCurrency(deductionsValue);
  if (netElement) netElement.textContent = formatCurrency(netValue);
}

function renderPayrollTable(payrollData) {
  const tbody = document.getElementById("payrollTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  payrollData.forEach((payrollItem) => {
    const salary = formatCurrency(payrollItem.basicSalary);
    const hours = `${payrollItem.hoursWorked}h`;
    const ot = `${payrollItem.overtimeHours}h`;
    const deductions = `-R ${payrollItem.deductions.toLocaleString("en-ZA")}`;
    const tax = `-R ${payrollItem.tax.toLocaleString("en-ZA")}`;
    const net = formatCurrency(payrollItem.finalSalary);
    const payslipLink = `payslip.html?id=${payrollItem.employeeId}`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${payrollItem.name}</td>
      <td>${payrollItem.position}</td>
      <td>${salary}</td>
      <td>${hours}</td>
      <td>${ot}</td>
      <td>${deductions}</td>
      <td>${tax}</td>
      <td>${net}</td>
      <td><a href="${payslipLink}" class="btn btn-sm btn-outline-primary">Generate</a></td>
    `;

    tbody.appendChild(row);
  });
}

// ============================================
// FUNCTIONS FOR PAYSLIP.HTML
// ============================================

function prCheckUrlForEmployee(payrollData) {
  const loadingState = document.getElementById("prLoadingState");
  if (loadingState) {
    loadingState.style.display = "none";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get("id");

  if (employeeId) {
    const employee = payrollData.find(
      (item) => item.employeeId === parseInt(employeeId),
    );
    if (employee) {
      prShowPayslip(employee);
      return;
    }
    const fallback =
      Array.isArray(payrollData) && payrollData.length > 0
        ? payrollData[0]
        : null;
    if (fallback) {
      prShowPayslip(fallback);
      prShowError(
        "Employee not found. Showing the first available employee instead.",
      );
      return;
    }
    prShowError("Employee not found. Please go back and try again.");
    return;
  }

  if (Array.isArray(payrollData) && payrollData.length > 0) {
    prShowPayslip(payrollData[0]);
    const info = document.createElement("div");
    info.className = "alert alert-info";
    info.style.marginTop = "12px";
    info.textContent =
      "No employee selected in the URL — showing the first employee.";
    const container =
      document.getElementById("prErrorContainer") || document.body;
    container.prepend(info);
    return;
  }

  prShowError("No payroll data available to display a payslip.");
}

function prShowPayslip(employee) {
  currentemployee = employee;
  const card = document.getElementById("prPayslipCard");
  if (!card) return;

  const baseSalary = employee.basicSalary || employee.finalSalary || 0;
  const deductions = employee.deductions || 0;

  document.getElementById("prDisplayEmployeeId").textContent =
    employee.employeeId;
  document.getElementById("prDisplayHoursWorked").textContent =
    employee.hoursWorked + " hours";
  document.getElementById("prDisplayLeaveDeductions").textContent =
    employee.leaveDeductions + " hours";
  document.getElementById("prDisplayBaseSalary").textContent = formatCurrency(baseSalary);
  document.getElementById("prDisplayDeductions").textContent = `-${formatCurrency(deductions)}`;
  document.getElementById("prDisplayFinalSalary").textContent = formatCurrency(employee.finalSalary || 0);

  document.getElementById("prDisplayGeneratedDate").textContent = new Date().toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  card.dataset.employeeId = employee.employeeId;
  card.style.display = "block";
}

// ============================================
// PDF GENERATION - Using window.print() method
// ============================================

async function prDownloadPayslip() {
  // Check if we have an employee
  if (!currentemployee) {
    alert("No payslip to download! Please generate a payslip first.");
    return;
  }

  const downloadBtn = document.getElementById("prDownloadBtn");
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = 'Generating...';
  downloadBtn.disabled = true;

  try {
    const emp = currentemployee;
    const date = new Date().toLocaleString("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Format values
    const baseSalary = "R " + (emp.basicSalary || emp.finalSalary || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 });
    const deductions = "R " + (emp.deductions || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 });
    const finalSalary = "R " + (emp.finalSalary || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 });

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Please allow popups for this site to download the payslip.');
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
      return;
    }

    // Build the HTML for the payslip
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${emp.name}</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .payslip {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background: #ffffff;
            border: 2px solid #0b1a33;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0b1a33;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .header h1 {
            color: #0b1a33;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 2px;
            margin: 0;
          }
          .header p {
            color: #4a5b72;
            font-size: 14px;
            margin: 5px 0 0 0;
            letter-spacing: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .info-row .label {
            font-size: 12px;
            color: #68768a;
            margin: 0 0 3px 0;
            font-weight: 600;
          }
          .info-row .value {
            font-size: 18px;
            font-weight: 700;
            color: #0b1a33;
            margin: 0;
          }
          .position-section {
            margin-bottom: 20px;
          }
          .position-section .label {
            font-size: 12px;
            color: #68768a;
            margin: 0 0 3px 0;
            font-weight: 600;
          }
          .position-section .value {
            font-size: 16px;
            font-weight: 500;
            color: #1f2a3f;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 5px;
          }
          table tr {
            border-bottom: 1px solid #eef2f7;
          }
          table td {
            padding: 10px 6px;
          }
          table td:first-child {
            color: #4a5b72;
            font-weight: 500;
          }
          table td:last-child {
            text-align: right;
            font-weight: 600;
            color: #0b1a33;
          }
          .total-row {
            border-top: 3px solid #0b1a33 !important;
            background: #f8faff;
          }
          .total-row td {
            padding: 14px 6px;
          }
          .total-row td:first-child {
            font-weight: 700;
            color: #0b1a33;
            font-size: 16px;
          }
          .total-row td:last-child {
            font-weight: 700;
            color: #1f7b4d;
            font-size: 18px;
          }
          .footer {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 2px solid #eef2f7;
            text-align: center;
          }
          .footer p {
            font-size: 12px;
            color: #a0b0c4;
            margin: 0;
          }
          .footer .sub {
            font-size: 11px;
            color: #b8c4d4;
            margin: 4px 0 0 0;
          }
          @media print {
            body {
              background: white;
              padding: 20px;
            }
            .payslip {
              border: 2px solid #0b1a33;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="payslip">
          <div class="header">
            <h1>MODERNTECH</h1>
            <p>PAYSLIP</p>
          </div>

          <div class="info-row">
            <div>
              <div class="label">EMPLOYEE ID</div>
              <div class="value">${emp.employeeId}</div>
            </div>
            <div style="text-align: right;">
              <div class="label">EMPLOYEE NAME</div>
              <div class="value">${emp.name}</div>
            </div>
          </div>

          <div class="position-section">
            <div class="label">POSITION</div>
            <div class="value">${emp.position}</div>
          </div>

          <table>
            <tr>
              <td>Hours Worked</td>
              <td>${emp.hoursWorked} hours</td>
            </tr>
            <tr>
              <td>Leave Deductions</td>
              <td>${emp.leaveDeductions} hours</td>
            </tr>
            <tr>
              <td>Base Salary</td>
              <td>${baseSalary}</td>
            </tr>
            <tr>
              <td>Deductions</td>
              <td style="color: #c0392b;">-${deductions}</td>
            </tr>
            <tr class="total-row">
              <td>FINAL SALARY</td>
              <td>${finalSalary}</td>
            </tr>
          </table>

          <div class="footer">
            <p>Generated: ${date}</p>
            <p class="sub">ModernTech HR Portal</p>
          </div>
        </div>
        <script>
          // Auto-print and close after printing
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close();

  } catch (error) {
    alert('Error generating payslip: ' + error.message);
  }

  downloadBtn.innerHTML = originalText;
  downloadBtn.disabled = false;
}

// Show error
function prShowError(message) {
  const container =
    document.getElementById("prErrorContainer") || document.body;
  const existingErrors = container.querySelectorAll(".alert");
  existingErrors.forEach((el) => el.remove());

  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger";
  errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
  container.prepend(errorDiv);

  const loadingState = document.getElementById("prLoadingState");
  if (loadingState) {
    loadingState.style.display = "none";
  }
}

// ============================================
// PAGE SETUP
// ============================================

function setupDarkModeToggle() {
  const themeToggle = document.getElementById("darkModeToggle");
  const toggleText = document.getElementById("toggleText");
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.classList.add("dark-mode");
    if (toggleText) toggleText.textContent = "Light Mode";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      themeToggle.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDark);
      if (toggleText) {
        toggleText.textContent = isDark ? "Light Mode" : "Dark Mode";
      }
    });
  }
}

function setupDownloadButton() {
  const downloadBtn = document.getElementById("prDownloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", prDownloadPayslip);
  }
}

function initPage() {
  setupDarkModeToggle();
  loadlocaldata();
  setupDownloadButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}