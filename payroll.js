let employees = [];

fetch("payroll_data.json")
.then(response => response.json())
.then(data => {

    employees = data.employees;

    const employeeList = document.getElementById("employeeList");

    employees.forEach(employee => {

        employeeList.innerHTML += `

        <div class="employee">

            <h3>${employee.name}</h3>

            <p>${employee.position}</p>

            <button onclick="generatePayslip(${employee.id})">
                Generate Payslip
            </button>

        </div>

        `;

    });

});

function generatePayslip(id){

    const employee = employees.find(emp => emp.id === id);


    document.getElementById("employeeid").textContent = employee.employeeid;
    document.getElementById("hoursWorked").textContent = employee.hoursWorked;
    document.getElementById("leaveDeductions").textContent = employee.leaveDeductions;
    document.getElementById("finalSalary").textContent = employee.finalSalary;

    document.getElementById("payslip").classList.remove("hidden");
}

function downloadPayslip(){

    window.print();

}