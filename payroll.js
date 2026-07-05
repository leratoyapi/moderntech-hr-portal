function loadlocaldata() {
  fetch("./data/payroll_data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Local Data Successfully Loaded:", data);
      displayPayslip(data.payrollData);
    })
    .catch((error) => {
      console.error("Failed to local data:", error);
      prShowError("Failed to load payroll data. Check console for details.");
    });
}

function displayPayslip(payrollData) {
  payrollData.forEach((payrollItem) => {
    console.log(`Employee ID: ${payrollItem.employeeId}`);
    console.log(`Hours Worked: ${payrollItem.hoursWorked}`);
    console.log(`Leave Deductions: ${payrollItem.leaveDeductions}`);
    console.log(`Final Salary: ${payrollItem.finalSalary}`);
  });

  // Check if we're on payslip.html
  const payslipCard = document.getElementById("prPayslipCard");
  if (payslipCard) {
    // We're on payslip.html - check URL for employee ID
    prCheckUrlForEmployee(payrollData);
  }
}

// ============================================
// FUNCTIONS FOR PAYSLIP.HTML
// ============================================

// Check URL for employee ID
function prCheckUrlForEmployee(payrollData) {
  // Hide loading state
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
    } else {
      prShowError("Employee not found. Please go back and try again.");
    }
  } else {
    prShowError("No employee selected. Please go back and select an employee.");
  }
}

// Show the payslip
function prShowPayslip(employee) {
  const card = document.getElementById("prPayslipCard");
  if (!card) return;

  document.getElementById("prDisplayEmployeeId").textContent =
    employee.employeeId;
  document.getElementById("prDisplayHoursWorked").textContent =
    employee.hoursWorked + " hours";
  document.getElementById("prDisplayLeaveDeductions").textContent =
    employee.leaveDeductions + " hours";
  document.getElementById("prDisplayBaseSalary").textContent =
    "R " + (employee.finalSalary + 1000).toFixed(2);
  document.getElementById("prDisplayDeductions").textContent =
    "-R " + (1000).toFixed(2);
  document.getElementById("prDisplayFinalSalary").textContent =
    "R " + employee.finalSalary.toFixed(2);

  card.dataset.employeeId = employee.employeeId;

  // Show the card
  card.style.display = "block";

  // Scroll to payslip
  setTimeout(() => {
    card.scrollIntoView({ behavior: "smooth" });
  }, 100);
}

// Download payslip
function prDownloadPayslip() {
  const card = document.getElementById("prPayslipCard");
  if (!card || card.style.display === "none") {
    alert("No payslip to download! Please generate a payslip first.");
    return;
  }

  const employeeId = card.dataset.employeeId || "unknown";

  const employeeIdText = document.getElementById(
    "prDisplayEmployeeId",
  ).textContent;
  const hoursWorkedText = document.getElementById(
    "prDisplayHoursWorked",
  ).textContent;
  const leaveDeductionsText = document.getElementById(
    "prDisplayLeaveDeductions",
  ).textContent;
  const baseSalaryText = document.getElementById(
    "prDisplayBaseSalary",
  ).textContent;
  const deductionsText = document.getElementById(
    "prDisplayDeductions",
  ).textContent;
  const finalSalaryText = document.getElementById(
    "prDisplayFinalSalary",
  ).textContent;

  const textContent = `
========================================
  MODERNTECH PAYSLIP
========================================

Employee ID:     ${employeeIdText}
Hours Worked:    ${hoursWorkedText}
Leave Deductions: ${leaveDeductionsText}
Base Salary:     ${baseSalaryText}
Deductions:      ${deductionsText}
Final Salary:    ${finalSalaryText}

========================================
    Generated on: ${new Date().toLocaleDateString()}
========================================
  `;

  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payslip_employee_${employeeId}_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Show error
function prShowError(message) {
  const container =
    document.getElementById("prErrorContainer") || document.body;

  // Remove any existing errors
  const existingErrors = container.querySelectorAll(".alert");
  existingErrors.forEach((el) => el.remove());

  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger";
  errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
  container.prepend(errorDiv);

  // Hide loading state if visible
  const loadingState = document.getElementById("prLoadingState");
  if (loadingState) {
    loadingState.style.display = "none";
  }
}

// ============================================
// INITIALIZE WHEN PAGE LOADS
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  loadlocaldata();

  const downloadBtn = document.getElementById("prDownloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", prDownloadPayslip);
  }
});
