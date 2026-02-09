let currentStep = 1;
const totalSteps = 4;

const formData = {
    teamType: '',
    name: '',
    email: '',
    password: '',
    role: 'doctor' // default
};

// --- Navigation Logic ---
function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`progress-${currentStep}`).classList.add('completed');

        currentStep++;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.getElementById(`progress-${currentStep}`).classList.add('active');
    }
    updateButtons();
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`progress-${currentStep}`).classList.remove('active');

        currentStep--;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.getElementById(`progress-${currentStep}`).classList.remove('completed');
    }
    updateButtons();
}

function updateButtons() {
    document.getElementById('prevBtn').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('nextBtn');

    if (currentStep === totalSteps) {
        nextBtn.innerText = 'Finalizar Registro';
        nextBtn.onclick = finishRegistration;
    } else {
        nextBtn.innerText = 'Siguiente';
        nextBtn.onclick = nextStep;
    }
}

// --- Validation Logic ---
function validateStep(step) {
    if (step === 1) {
        if (!formData.teamType) {
            alert('Por favor selecciona un tipo de equipo.');
            return false;
        }
    }
    if (step === 2) {
        const name = document.getElementById('input-name').value;
        const email = document.getElementById('input-email').value;
        if (!name || !email) {
            alert('Por favor completa todos los campos.');
            return false;
        }
        formData.name = name;
        formData.email = email;
    }
    if (step === 3) {
        if (!isPasswordValid) {
            alert('La contraseña no cumple con los requisitos de seguridad.');
            return false;
        }
        formData.password = document.getElementById('input-pass').value;
    }
    if (step === 4) {
        if (!document.getElementById('check-privacy').checked) {
            alert('Debes aceptar el aviso de privacidad.');
            return false;
        }
    }
    return true;
}

// --- Step 1: Team Selection ---
function selectTeam(type) {
    formData.teamType = type;
    document.querySelectorAll('.team-card').forEach(el => el.classList.remove('selected'));
    document.getElementById(`card-${type}`).classList.add('selected');
}

// --- Step 3: Password Validation ---
let isPasswordValid = false;

document.getElementById('input-pass').addEventListener('input', function (e) {
    const pass = e.target.value;

    // Checks
    const length = pass.length >= 8;
    const upper = /[A-Z]/.test(pass);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const noSeq = !/(123|234|345|456|567|678|789|890)/.test(pass); // Simple check

    updateCheck('req-length', length);
    updateCheck('req-upper', upper);
    updateCheck('req-special', special);
    updateCheck('req-seq', noSeq);

    isPasswordValid = length && upper && special && noSeq;
});

function updateCheck(id, valid) {
    const el = document.getElementById(id);
    const icon = el.querySelector('i');
    if (valid) {
        el.classList.add('valid');
        icon.className = 'fa-solid fa-check-circle';
    } else {
        el.classList.remove('valid');
        icon.className = 'fa-regular fa-circle';
    }
}

// --- Finish ---
function finishRegistration() {
    if (!validateStep(totalSteps)) return;

    alert('¡Registro Exitoso! Bienvenido a Dental Connect.');
    // Save minimal data to simulate login
    localStorage.setItem('role', 'admin'); // Assume admin for new registration
    window.location.href = 'index.html';
}
