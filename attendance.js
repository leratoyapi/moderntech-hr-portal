// fetch("attendance.json")




// .then(response => response.json())
// .then(data => {


//     const tableBody = document.getElementById("attendanceTableBody");


//     data.attendanceAndLeave.forEach((employee,index)=>{




//         const latestAttendance =
//         employee.attendance[employee.attendance.length-1];




//         let historyTable = "";




//         employee.attendance.forEach(record=>{




//             historyTable += `




//             <tr>




//                 <td>${record.date}</td>




//                 <td>




//                     <span class="attendance-status ${record.status==="Present" ? "attendance-present" : "attendance-absent"}">




//                         ${record.status}




//                     </span>




//                 </td>




//             </tr>




//             `;




//         });




//         tableBody.innerHTML += `




//         <tr>




//             <td>${employee.employeeId}</td>




//             <td>${employee.name}</td>




//             <td>




//                 <span class="attendance-status ${latestAttendance.status==="Present" ? "attendance-present" : "attendance-absent"}">




//                     ${latestAttendance.status}




//                 </span>




//             </td>




//             <td>




//                 <button
//                 class="attendance-btn"
//                 onclick="toggleAttendanceHistory(${index})">




//                 View History




//                 </button>




//             </td>




//         </tr>




//         <tr
//         class="attendance-history-row"
//         id="attendanceHistory${index}">




//             <td
//             colspan="4"
//             class="attendance-history-cell">




//                 <table class="attendance-history-table">




//                     <thead>




//                         <tr>




//                             <th>Date</th>




//                             <th>Status</th>




//                         </tr>




//                     </thead>




//                     <tbody>




//                         ${historyTable}




//                     </tbody>




//                 </table>




//             </td>




//         </tr>




//         `;




//     });




// });




// function toggleAttendanceHistory(index){




//     const historyRow =
//     document.getElementById("attendanceHistory"+index);




//     if(historyRow.style.display==="table-row"){




//         historyRow.style.display="none";




//     }else{




//         historyRow.style.display="table-row";




//     }




// }








// Dark Mode


document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('darkModeToggle');
    const toggleText = document.getElementById('toggleText');


    const isDarkMode = localStorage.getItem('darkMode') === 'true';


    if (isDarkMode) {
       document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.classList.add('dark-mode');
        if (toggleText) toggleText.textContent = 'Light Mode';
    }


    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            themeToggle.classList.toggle('dark-mode');


            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);


            if (toggleText) {
                toggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        });
    }
});




/*=====================================
    ATTENDANCE TABLE
=====================================*/


const attendanceTableBody = document.getElementById("attendanceTableBody");
const attendanceSearchInput = document.getElementById("attendanceSearchInput");
const attendanceStatusFilter = document.getElementById("attendanceStatusFilter");
const attendanceDateFilter = document.getElementById("attendanceDateFilter");


let attendanceEmployees = [];


/*=====================================
    LOAD JSON
=====================================*/


fetch("attendance.json")
    .then(response => response.json())
    .then(data => {


        attendanceEmployees = data.attendanceAndLeave;


        displayAttendanceTable(attendanceEmployees);


    })
    .catch(error => console.error(error));


/*=====================================
    DISPLAY TABLE
=====================================*/


function displayAttendanceTable(employeeList) {


    attendanceTableBody.innerHTML = "";


    employeeList.forEach(employee => {


        // Latest attendance record
        const latestAttendance = employee.attendance[employee.attendance.length - 1];


        // Latest leave request
        const latestLeave = employee.leaveRequests.length
            ? employee.leaveRequests[employee.leaveRequests.length - 1]
            : {
                reason: "-",
                status: "-"
            };


        // Employee initials
        const initials = employee.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();


        let attendanceClass =
            latestAttendance.status === "Present"
                ? "attendance-present"
                : "attendance-absent";


        let leaveClass = "";


        switch (latestLeave.status) {


            case "Approved":
                leaveClass = "attendance-approved";
                break;


            case "Pending":
                leaveClass = "attendance-pending";
                break;


            case "Denied":
                leaveClass = "attendance-denied";
                break;


            default:
                leaveClass = "";
        }


        attendanceTableBody.innerHTML += `


        <tr>


            <td>


                <div class="attendance-employee"
                    onclick="showAttendanceHistory(${employee.employeeId})">


                    <div class="attendance-avatar">
                        ${initials}
                    </div>


                    <div>


                        <div class="attendance-name">
                            ${employee.name}
                        </div>


                        <div class="attendance-subtitle">
                            Employee
                        </div>


                    </div>


                </div>


            </td>


            <td>
                EMP-${String(employee.employeeId).padStart(3, "0")}
            </td>


            <td>
                ${latestAttendance.date}
            </td>


            <td>


                <span class="attendance-status ${attendanceClass}">
                    ${latestAttendance.status}
                </span>


            </td>


            <td>
                ${latestLeave.reason}
            </td>


            <td>


                <span class="attendance-status ${leaveClass}">
                    ${latestLeave.status}
                </span>


            </td>


        </tr>


        `;


    });


}


/*=====================================
    SEARCH
=====================================*/


attendanceSearchInput.addEventListener("keyup", filterAttendanceTable);


/*=====================================
    STATUS FILTER
=====================================*/


attendanceStatusFilter.addEventListener("change", filterAttendanceTable);


/*=====================================
    DATE FILTER
=====================================*/


attendanceDateFilter.addEventListener("change", filterAttendanceTable);


/*=====================================
    FILTER TABLE
=====================================*/


function filterAttendanceTable() {


    const searchValue = attendanceSearchInput.value.trim().toLowerCase();
    const selectedStatus = attendanceStatusFilter.value;
    const selectedDate = attendanceDateFilter.value;


    const filteredEmployees = attendanceEmployees.filter(employee => {


        const latestAttendance = employee.attendance[employee.attendance.length - 1];


        const employeeId = String(employee.employeeId);


        // Search by name OR employee ID
        const matchesSearch =
            employee.name.toLowerCase().includes(searchValue) ||
            employeeId.includes(searchValue);


        // Status filter
        const matchesStatus =
            selectedStatus === "All" ||
            latestAttendance.status === selectedStatus;


        // Date filter
        const matchesDate =
            selectedDate === "" ||
            latestAttendance.date === selectedDate;


        return matchesSearch && matchesStatus && matchesDate;


    });


    displayAttendanceTable(filteredEmployees);


}



function showAttendanceHistory(employeeId){


    const employee = attendanceEmployees.find(
        emp => emp.employeeId === employeeId
    );


    document.getElementById("attendanceEmployeeName").innerHTML =
        employee.name + " - Recent";


    const body = document.getElementById("attendanceHistoryBody");


    body.innerHTML = "";


    employee.attendance.forEach(record=>{


        body.innerHTML += `


        <tr>


            <td>${record.date}</td>


            <td>


                <span class="attendance-status ${
                    record.status==="Present"
                    ? "attendance-present"
                    : "attendance-absent"
                }">


                    ${record.status}


                </span>


            </td>


        </tr>


        `;


    });


    document.getElementById("attendanceHistoryModal").style.display="flex";


}


function closeAttendanceHistory(){


    document.getElementById("attendanceHistoryModal").style.display="none";


}
