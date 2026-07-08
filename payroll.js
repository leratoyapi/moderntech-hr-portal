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
  if (payrollTableBody) {
    renderPayrollTable(payrollData);
    updatePayrollCards(payrollData);
  }

  // show the payslip page if this is payslip.html
  const payslipCard = document.getElementById("prPayslipCard");
  if (payslipCard) {
    prCheckUrlForEmployee(payrollData);
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

  tbody.innerHTML = ""; // clear old rows

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

function calculateHourlyRate(finalSalary, hoursWorked, leaveDeductions) {
  const totalHours = hoursWorked - leaveDeductions;
  if (totalHours <= 0) {
    return 0;
  }
  return finalSalary / totalHours;
}

function prCheckUrlForEmployee(payrollData) {
  const loadingState = document.getElementById("prLoadingState");
  if (loadingState) {
    loadingState.style.display = "none";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get("id");

  // If an id param exists, try to load that employee.
  if (employeeId) {
    const employee = payrollData.find(
      (item) => item.employeeId === parseInt(employeeId),
    );
    if (employee) {
      prShowPayslip(employee);
      return;
    }
    // If the id param was provided but not found, fallback to the first employee.
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

  // No id param provided: fall back to the first available employee so the
  // payslip page displays useful content when opened directly.
  if (Array.isArray(payrollData) && payrollData.length > 0) {
    prShowPayslip(payrollData[0]);
    // show an informational message so the user knows which employee is shown
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

  // No data at all
  prShowError("No payroll data available to display a payslip.");
}

function prShowPayslip(employee) {
  currentemployee = employee;
  const card = document.getElementById("prPayslipCard");
  if (!card) return;

  const baseSalary = employee.basicSalary || employee.finalSalary || 0;
  const deductions = employee.deductions || 0;

  const baseSalaryElement = document.getElementById("prDisplayBaseSalary");
  const deductionsElement = document.getElementById("prDisplayDeductions");
  const finalSalaryElement = document.getElementById("prDisplayFinalSalary");

  document.getElementById("prDisplayEmployeeId").textContent =
    employee.employeeId;
  document.getElementById("prDisplayHoursWorked").textContent =
    employee.hoursWorked + " hours";
  document.getElementById("prDisplayLeaveDeductions").textContent =
    employee.leaveDeductions + " hours";
  if (baseSalaryElement)
    baseSalaryElement.textContent = formatCurrency(baseSalary);
  if (deductionsElement)
    deductionsElement.textContent = `-${formatCurrency(deductions)}`;
  if (finalSalaryElement)
    finalSalaryElement.textContent = formatCurrency(employee.finalSalary || 0);

  const generatedDateElement = document.getElementById(
    "prDisplayGeneratedDate",
  );
  if (generatedDateElement)
    generatedDateElement.textContent = new Date().toLocaleString("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  card.dataset.employeeId = employee.employeeId;
  card.style.display = "block";
}

async function prDownloadPayslip() {
  const card = document.getElementById("prPayslipCard");
  if (!card || card.style.display === "none" || !currentemployee) {
    alert("No payslip to download! Please generate a payslip first.");
    return;
  }

  const employeeId = card.dataset.employeeId || "unknown";
  const baseSalary =
    currentemployee.basicSalary || currentemployee.finalSalary || 0;
  const deductions = currentemployee.deductions || 0;
  const finalSalary = currentemployee.finalSalary || 0;

  const payslipGeneratetext = `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding:24px; color:#1f2a3f; background:#ffffff; width:100%; max-width:800px;">
  <div style="margin-bottom:20px; padding:18px 22px; background:#0b1a33; color:#ffffff; border-radius:16px;">
    <h2 style="margin:0; font-size:24px; letter-spacing:0.02em;">MODERNTECH PAYSLIP</h2>
  </div>
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <tbody>
      <tr>
        <th style="text-align:left; padding:12px 14px; background:#f4f6fb; color:#0b1a33; border:1px solid #d6dee7; width:35%;">Employee ID</th>
        <td style="padding:12px 14px; border:1px solid #d6dee7;">${currentemployee.employeeId}</td>
      </tr>
      <tr>
        <th style="text-align:left; padding:12px 14px; background:#f4f6fb; color:#0b1a33; border:1px solid #d6dee7;">Hours Worked</th>
        <td style="padding:12px 14px; border:1px solid #d6dee7;">${currentemployee.hoursWorked} hours</td>
      </tr>
      <tr>
        <th style="text-align:left; padding:12px 14px; background:#f4f6fb; color:#0b1a33; border:1px solid #d6dee7;">Leave Deductions</th>
        <td style="padding:12px 14px; border:1px solid #d6dee7;">${currentemployee.leaveDeductions} hours</td>
      </tr>
      <tr>
        <th style="text-align:left; padding:12px 14px; background:#f4f6fb; color:#0b1a33; border:1px solid #d6dee7;">Base Salary</th>
        <td style="padding:12px 14px; border:1px solid #d6dee7;">${formatCurrency(baseSalary)}</td>
      </tr>
      <tr>
        <th style="text-align:left; padding:12px 14px; background:#f4f6fb; color:#0b1a33; border:1px solid #d6dee7;">Deductions</th>
        <td style="padding:12px 14px; border:1px solid #d6dee7; color:#c0392b;">-${formatCurrency(deductions)}</td>
      </tr>
      <tr style="background:#d4edda;">
        <th style="text-align:left; padding:12px 14px; border:1px solid #c3dcc6; color:#0b1a33;">Final Salary</th>
        <td style="padding:12px 14px; border:1px solid #c3dcc6; font-weight:700;">${formatCurrency(finalSalary)}</td>
      </tr>
    </tbody>
  </table>
  <p style="font-size:13px; color:#5a6e87; margin-top:20px;">Generated: ${new Date().toLocaleDateString()}</p>
</div>
`;

  const exportElement = document.createElement("div");
  // place off-screen but visible to html2canvas so it can render fonts/styles
  exportElement.style.position = "fixed";
  exportElement.style.left = "0";
  exportElement.style.top = "0";
  exportElement.style.transform = "translateX(-200vw)";
  exportElement.style.width = "800px";
  exportElement.style.visibility = "visible";
  exportElement.style.opacity = "1";
  exportElement.style.pointerEvents = "none";
  exportElement.innerHTML = payslipGeneratetext;
  document.body.appendChild(exportElement);

  // small pause to ensure fonts and inline styles are applied off-screen
  await new Promise((resolve) => setTimeout(resolve, 500));

  await html2pdf()
    .set({
      margin: 8,
      filename: `payslip_employee_${employeeId}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "png", quality: 1 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(exportElement)
    .save();

  document.body.removeChild(exportElement);
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
