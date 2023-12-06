const container = document.getElementById('contenedor');
const registerBtn = document.getElementById('registro');
const loginBtn = document.getElementById('login');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");    
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

const formularioRegistro = document.getElementById('formulario-registro');
const formularioLogin = document.getElementById('formulario-login');

if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreCompleto = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fechaNacimiento = document.getElementById('fecha').value;

        const userData = {
            nombreCompleto: nombreCompleto,
            email: email,
            password: password,
            fechaNacimiento: fechaNacimiento
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        enviarCorreoConfirmacion(userData);

        alert('Usuario creado correctamente!');
        window.location.href = './login.html';
    });
}

function enviarCorreoConfirmacion(userData) {
    
    const templateParams = {
        nombre: userData.nombreCompleto,
        email: userData.email
    };

    emailjs.send("TecnoShop", "APPWEB1-Prueba", templateParams)
        .then(function(response) {
            console.log("Correo de confirmación enviado con éxito", response);
        }, function(error) {
            console.error("Error al enviar el correo de confirmación", error);
        });
}

if (formularioLogin) {
    formularioLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        validateLogin(email, password);
    });
}

function validateLogin(email, password) {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (storedUserData && email === storedUserData.email && password === storedUserData.password) {
        window.location.href = "./main.html";
    } else {
        alert('Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
}