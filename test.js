fetch("attendance.json")


.then(response => response.json())
.then(data => {

    const tableBody = document.getElementById("attendanceTableBody");

    data.attendanceAndLeave.forEach((employee,index)=>{


        const latestAttendance =
        employee.attendance[employee.attendance.length-1];


        let historyTable = "";


        employee.attendance.forEach(record=>{


            historyTable += `


            <tr>


                <td>${record.date}</td>


                <td>


                    <span class="attendance-status ${record.status==="Present" ? "attendance-present" : "attendance-absent"}">


                        ${record.status}


                    </span>


                </td>


            </tr>


            `;


        });


        tableBody.innerHTML += `


        <tr>


            <td>${employee.employeeId}</td>


            <td>${employee.name}</td>


            <td>


                <span class="attendance-status ${latestAttendance.status==="Present" ? "attendance-present" : "attendance-absent"}">


                    ${latestAttendance.status}


                </span>


            </td>


            <td>


                <button
                class="attendance-btn"
                onclick="toggleAttendanceHistory(${index})">


                View History


                </button>


            </td>


        </tr>


        <tr
        class="attendance-history-row"
        id="attendanceHistory${index}">


            <td
            colspan="4"
            class="attendance-history-cell">


                <table class="attendance-history-table">


                    <thead>


                        <tr>


                            <th>Date</th>


                            <th>Status</th>


                        </tr>


                    </thead>


                    <tbody>


                        ${historyTable}


                    </tbody>


                </table>


            </td>


        </tr>


        `;


    });


});


function toggleAttendanceHistory(index){


    const historyRow =
    document.getElementById("attendanceHistory"+index);


    if(historyRow.style.display==="table-row"){


        historyRow.style.display="none";


    }else{


        historyRow.style.display="table-row";


    }


}




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