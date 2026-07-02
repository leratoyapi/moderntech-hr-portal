let payroll_data 
fetch()
// payroll_data =

// FOR THE PAYSLIP GENERATE BUTTON

async function generate() {
  constresponse = await fetch ('payroll_data.json');
  const data = await Response.json();

  document.getElementsById('name').innertext = data.name
  document.getElementById('id').innertext = data.id
  document.getElementsById('hoursWorked').innertext = data.hoursWorked
  document.getElementsById('leaveDeductions').innertext = data.leaveDeductions
  document.getElementsById('salary').innertext = data.salary

  
  const element = document.getElementByClass('payslip-template');


  html2pdf().from(element).save('payslip.pdf');
}
