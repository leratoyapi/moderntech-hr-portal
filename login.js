const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", function(e){


    e.preventDefault();


    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();


    const message = document.getElementById("message");


    if(username === "Elijah" && password === "lat123"){


        message.style.color = "green";
        message.innerHTML = "Login Successful!";


        setTimeout(()=>{


            // Takes you to dashboard page if correct credentials are implemented
            window.location.href = "index.html";


        },1000);


    }
    else{


        message.style.color="red";
        message.innerHTML="Incorrect username or password.";


    }


});
