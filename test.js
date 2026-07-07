// Attendance Data
const attendanceData = [
    { day: "Monday", rate: 92 },
    { day: "Tuesday", rate: 88 },
    { day: "Wednesday", rate: 95 },
    { day: "Thursday", rate: 90 },
    { day: "Friday", rate: 97 }
];

// Fill Table
const table = document.getElementById("attendanceTable");

attendanceData.forEach(item => {
    const row = `
        <tr>
            <td>${item.day}</td>
            <td>${item.rate}%</td>
        </tr>
    `;
    table.innerHTML += row;
});

// Average Attendance
const average =
attendanceData.reduce((sum,item)=>sum+item.rate,0)/
attendanceData.length;

document.getElementById("averageAttendance").textContent =
average.toFixed(1) + "%";

// Chart
const ctx = document.getElementById("attendanceChart");

new Chart(ctx,{
    type:'bar',
    data:{
        labels:attendanceData.map(item=>item.day),
        datasets:[{
            label:'Attendance Rate (%)',
            data:attendanceData.map(item=>item.rate),
            backgroundColor:[
                '#4CAF50',
                '#2196F3',
                '#FFC107',
                '#FF5722',
                '#9C27B0'
            ],
            borderRadius:8
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{
                display:false
            }
        },
        scales:{
            y:{
                beginAtZero:true,
                max:100,
                title:{
                    display:true,
                    text:'Attendance (%)'
                }
            }
        }
    }
});