// here i  will be fetching the data from the json file and then i  will be using that data to generate the payslip //


let pr_allPayroll = [];
let pr_allEmployee = [];
let pr_allAttendance=[]

// console.log('Starting to load data from payroll_data.json...');
 cs
fetch('data/payroll_data.json')
.then(response => response.json())
.then(data => {
  pr_allPayroll = data.payrollData;
  console.log('SUCCESS! Payroll data loaded', pr_allPayroll.length);
})

// here im combining the data using function and then i will  will be using that data to generate the payslip

function combinneData(){
  let combined= [];

  // basically this will to find the employee's payroll info
  for (let employee of pr_allEmployee){
    let payrollInfo = pr_allPayroll.find(p => p.employeeId === employee.employeeId);

    if (payrollInfo) {
      combined.push({
        id: employee.employeeId,
        name: employee.name,
        department: employee.department,
        salary: employee.salary,
        hoursWorked: payrollInfo.hoursWorked,
        finalSalary: payrollInfo.finalSalary

      })
    }

  }
  return combined;
}
















