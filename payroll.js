// here i  will be fetching the data from the json file and then i  will be using that data to generate the payslip //


let pr_allPayroll = [];
let pr_allEmployee = [];
let pr_allAttendance=[]

// console.log('Starting to load data from payroll_data.json...');

fetch('data/employee_info.json')
.then(response => response.json())
.then(data => {
  pr_allPayroll = data.payrollData;
  console.log('SUCCESS! Payroll data loaded', pr_allPayroll.length);
})
   
fetch('data/employee_info.json')
.then(response => reponse.json())
.then(data => {
  allEmplyees = data.employeeData;
  console.log('SUCCESS! Employee data loaded', allEmployees.lenght);
})

fetch('data/attendance.json')
.then(response => response.json())
.then(data => {
  allAttendance = data.attendanceData;
  console.log('SUCCESS! Attendance data loaded', allAttendance.lenght);

})

// here im combining the data using function and then i will  will be using that data to generate the payslip

function combinneData(){
  let combined= [];

  // basically this will to find the employee's payroll info
  for (let employee of allEmployee){
    let payrollInfo = allPayroll.find(p => p.employeeId === employee.employeeId);

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
















