let employees = [];
let deleteTimeouts = {};

const tbody = document.getElementById('employeeTableBody');
const searchInput = document.getElementById('searchInput');
const addModal = document.getElementById('addModal');
const form = document.getElementById('employeeForm');
const addBtn = document.getElementById('addBtn');

// function to create the employee table
async function loadEmployees() {
  try {
    const res= await fetch('./data/employee_info.json');
    if (!res.ok) throw new Error('Failed to fetch employee data');
    const data = await res.json();

    employees = data.employeeInformation;
    render();
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="7">Failed to load employee data</td></tr>';
  }
}
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
}
function render(list = employees) {
  tbody.innerHTML = '';
  const activeList = list.filter(emp => !emp.isDeleted);
  document.getElementById('totalCount').textContent = activeList.length;
  document.getElementById('totalEmployees').textContent = activeList.length;
  const payrollTotal = activeList.reduce((a,b) => a + b.salary, 0);
  document.getElementById('monthlyPayroll').textContent = 'R' + (payrollTotal / 1000000).toFixed(2) + 'M';

  list.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>E${String(emp.employeeId).padStart(3, '0')}</td>
      <td><span class="em-avatar" style="background:${stringToColor(emp.name)}">${getInitials(emp.name)}</span>${emp.name}</td>
      <td>${emp.department}</td>
      <td>${emp.position}</td>
      <td>${emp.salary.toLocaleString()}</td>
      <td><span class="em-status active">Active</span></td>
      <td class="em-actions">
      ${emp.isDeleted
        ? `<button class="em-btn-retrieve" id="retrieve-${emp.employeeId}" onclick="retrieveEmp(${emp.employeeId})">↪️</button>`
         :`<button class="em-btn-delete" onclick="deleteEmp(${emp.employeeId})">🗑️</button>`
      }
      </td>
      `;
    if(emp.isDeleted) {
      tr.style.opacity = '0.4';
    }

     tbody.appendChild(tr);
  });
}
// Adding new employees
form.addEventListener('submit', e => {
  e.preventDefault();
  const newId = employees.length > 0? Math.max(...employees.map(emp => emp.employeeId)) + 1 : 1;
  employees.push({
    employeeId: newId,
    name: document.getElementById('name').value,
    department: document.getElementById('department').value,
    position: document.getElementById('position').value,
    salary: Number(document.getElementById('salary').value),
    contact: "",
    employmentHistory: []
  });
  render();
  addModal.close();
  form.reset();
});
// function for deleted employees
function deleteEmp(id) {
  const empData = employees.find(emp => emp.employeeId === id);
  if(!empData) return;

  empData.isDeleted = true;
  render();

  deleteTimeouts[id] = setTimeout (() => {
    employees = employees.filter(emp => emp.employeeId !== id);
    render();
    }, 5000)
}
// Function to retrieve deleted employee
function retrieveEmp(id) {
  clearTimeout (deleteTimeouts[id]);

  const empData = employees.find(emp => emp.employeeId === id);
  if(empData) empData.isDeleted = false;

  render();
}
document.addEventListener('DOMContentLoaded', loadEmployees);

// Sidebar toggle functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

sidebar.classList.remove('open');
overlay.classList.remove('show');

const openSidebar = () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
};
const closeSidebar = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
};

menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
// Add Employee Button
addBtn.addEventListener('click', () => {
  addModal.showModal();
});

// Darkmode
const darkToggle = document.getElementById('darkToggle');
// Load saved theme on start
if(localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  darkToggle.innerHTML = 'Light Mode';
} else {
  darkToggle.innerHTML = 'Dark Mode';
}
// Toggle click
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')){
    localStorage.setItem('theme', 'dark');
    darkToggle.innerHTML = 'Light Mode';
  }else {
    localStorage.setItem('theme', 'light');
    darkToggle.innerHTML = 'Dark Mode';
  }
});