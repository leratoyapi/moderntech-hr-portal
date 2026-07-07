// let currentemployee;
function loadlocaldata() {
  fetch("./data/payroll_data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // prShowError(error);
      console.log("Local Data Successfully Loaded:", data);
      displayPayslip(data.payrollData);
    })
    .catch((error) => {
      console.error("Failed to local data:", error);
      // prShowError("Failed to load payroll data. Check console for details.");
      prShowError(error);
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
  currentemployee = employee;
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
}

// Download payslip

async function prDownloadPayslip() {
  await loadlocaldata();
  const card = document.getElementById("prPayslipCard");
  if (!card || card.style.display === "none") {
    alert("No payslip to download! Please generate a payslip first.");
    return;
  }

  const employeeId = card.dataset.employeeId || "unknown";
  // console.log(currentemployee);

  let payslipGeneratetext = `
<div style="font-family: Arial, sans-serif; padding:20px; border:1px solid #ccc;">
    <h2 style="text-align:center;">MODERNTECH PAYSLIP</h2>

    <table style="width:100%; border-collapse:collapse;">
        <tr>
            <td><strong>Employee ID</strong></td>
            <td>${currentemployee.employeeId}</td>
        </tr>

        <tr>
            <td><strong>Hours Worked</strong></td>
            <td>${currentemployee.hoursWorked} hours</td>
        </tr>

        <tr>
            <td><strong>Leave Deductions</strong></td>
            <td>${currentemployee.leaveDeductions} hours</td>
        </tr>

        <tr>
            <td><strong>Base Salary</strong></td>
            <td>R ${(currentemployee.finalSalary + 1000).toFixed(2)}</td>
        </tr>

        <tr>
            <td><strong>Deductions</strong></td>
            <td>R 1000.00</td>
        </tr>

        <tr>
            <td><strong>Final Salary</strong></td>
            <td><strong>R ${currentemployee.finalSalary.toFixed(2)}</strong></td>
        </tr>
    </table>

    <p>Generated: ${new Date().toLocaleDateString()}</p>
</div>
`;

  html2pdf()
    .set({
      margin: 0, // top, right, bottom, left (mm)
      filename: `payslip_employee_${employeeId}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(payslipGeneratetext) // use the card element as source
    .save(); // trigger download
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

const employeeData = {
  1: {
    name: "Sibongile Nkosi",
    pos: "Software Engineer",
    sal: "R 70 000",
    hrs: "179h",
    ot: "8h",
    ded: "-R 792",
    tax: "-R 1 900",
    net: "R 5 225",
  },
  2: {
    name: "Lungile Moyo",
    pos: "HR Manager",
    sal: "R 80 000",
    hrs: "172h",
    ot: "4h",
    ded: "-R 650",
    tax: "-R 1 560",
    net: "R 4 290",
  },
  3: {
    name: "Thabo Molefe",
    pos: "Quality Analyst",
    sal: "R 55 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 600",
    tax: "-R 1 440",
    net: "R 3 960",
  },
  4: {
    name: "Keshav Naidoo",
    pos: "Sales Representative",
    sal: "R 60 000",
    hrs: "176h",
    ot: "12h",
    ded: "-R 708",
    tax: "-R 1 700",
    net: "R 4 675",
  },
  5: {
    name: "Zanele Khumalo",
    pos: "Marketing Specialist",
    sal: "R 58 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
  6: {
    name: "Sipho Zulu",
    pos: "UI/UX Designer",
    sal: "R 65 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
  7: {
    name: "Naledi Moeketsi",
    pos: "DevOps Engineer",
    sal: "R 72 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
  8: {
    name: "Farai Gumbo",
    pos: "Content Strategist",
    sal: "R 56 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
  9: {
    name: "Karabo Dlamini",
    pos: "Accountant",
    sal: "R 62 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
  10: {
    name: "Fatima Patel",
    pos: "Customer Support Lead",
    sal: "R 58 000",
    hrs: "176h",
    ot: "0h",
    ded: "-R 917",
    tax: "-R 2 200",
    net: "R 6 050",
  },
};

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const emp = employeeData[id];

  if (emp) {
    document.getElementById("emp-name").innerText = emp.name;
    document.getElementById("emp-position").innerText = emp.pos;
    document.getElementById("emp-salary").innerText = emp.sal;
    document.getElementById("emp-hours").innerText = emp.hrs;
    document.getElementById("emp-ot").innerText = emp.ot;
    document.getElementById("emp-deductions").innerText = emp.ded;
    document.getElementById("emp-tax").innerText = emp.tax;
    document.getElementById("emp-net").innerText = emp.net;
  }
};

// Dark mode
document.addEventListener("DOMContentLoaded", function () {
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
});

