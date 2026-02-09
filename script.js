// --- 0. Role-Based Access Control ---
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role') || 'admin'; // Default fallback
    console.log('Current Role:', role);

    if (role === 'reception') {
        const forbiddenTargets = ['tratamientos', 'publicidad', 'configuracion'];
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const target = item.getAttribute('data-target');
            if (forbiddenTargets.includes(target)) {
                item.style.display = 'none';
            }
        });

        const odontogram = document.querySelector('.odontograma-container');
        if (odontogram) odontogram.style.display = 'none';

        const deleteBtns = document.querySelectorAll('.fa-trash');
        deleteBtns.forEach(btn => btn.style.display = 'none');
    }

    renderCalendar(); // Init calendar
    updateTokenList(); // Init tokens
});

// --- 1. SPA Navigation ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', function (e) {
        if (this.innerText.includes('Salir')) return;
        e.preventDefault();

        navItems.forEach(n => n.classList.remove('active'));
        this.classList.add('active');

        const target = this.getAttribute('data-target');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// --- 2. Check Button Logic ---
function toggleCheck(btn) {
    btn.classList.toggle('completed');
}

// --- 3. File Explorer Ghost ---
function openFileExplorer() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        alert(`Archivo seleccionado: ${e.target.files[0].name} (Simulado)`);
    }
    input.click();
}

// --- 4. Modals and Patient Profile Logic ---
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
}

function handleGhostSubmit(e, msg) {
    e.preventDefault();
    alert(msg);
    const modal = e.target.closest('.modal-overlay');
    if (modal) modal.classList.remove('active');
}

// Open Patient Profile
function openPatientProfile(name) {
    document.getElementById('profile-name').innerText = name;
    document.getElementById('profile-img').src = `https://ui-avatars.com/api/?name=${name}&background=random`;

    // Simulate fetching data (replace with actual DB/Localstorage fetch)
    if (name === 'Juan Pérez') {
        document.getElementById('p-phone').innerText = '555-123-4567';
        document.getElementById('p-address').innerText = 'Av. Reforma 100, CDMX';
        document.getElementById('p-blood').innerText = 'O+';
    }

    openModal('modal-patient-profile');
}

// Switch Tabs in Profile
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Show selected
    document.getElementById(tabId).classList.add('active');
    // Find button that triggered (this is a bit hacky, cleaner to pass 'this')
    const buttons = document.querySelectorAll('.tab-btn');
    if (tabId === 'tab-info') buttons[0].classList.add('active');
    if (tabId === 'tab-calendar') buttons[1].classList.add('active');
    if (tabId === 'tab-history') buttons[2].classList.add('active');
}


// --- 5. Calendar Logic ---
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('monthYear').innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Day headers
    const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.innerText = day;
        div.className = 'calendar-day-header';
        grid.appendChild(div);
    });

    // Empty cells before start
    for (let i = 0; i < startingDay; i++) {
        const div = document.createElement('div');
        grid.appendChild(div);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.innerText = i;

        // Mark today
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            div.classList.add('today');
        }

        // Simulate an appointment on the 10th and 25th
        if (i === 10 || i === 25) {
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            div.appendChild(dot);
        }

        div.onclick = () => alert(`Detalles del día ${i}/${month + 1}/${year}`);
        grid.appendChild(div);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}


// --- 6. Token System ---
function generateToken() {
    const role = document.getElementById('token-role').value;
    const prefix = role === 'doctor' ? 'DOC' : 'REC';
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const token = `${prefix}-${randomStr}`;

    const tokens = JSON.parse(localStorage.getItem('tokens') || '[]');
    tokens.push({ token, role, active: true });
    localStorage.setItem('tokens', JSON.stringify(tokens));

    updateTokenList();
    alert(`Token Generado: ${token}`);
}

function updateTokenList() {
    const list = document.getElementById('active-tokens-list');
    if (!list) return;
    list.innerHTML = '';
    const tokens = JSON.parse(localStorage.getItem('tokens') || '[]');

    tokens.forEach(t => {
        const li = document.createElement('li');
        li.style.cssText = "background: #f9f9f9; padding: 10px; border-radius: 6px; margin-bottom: 5px; display: flex; justify-content: space-between;";
        li.innerHTML = `<span>${t.token} (${t.role})</span> <i class="fa-solid fa-copy" onclick="navigator.clipboard.writeText('${t.token}')" style="cursor: pointer; color: var(--secondary-color);" title="Copiar"></i>`;
        list.appendChild(li);
    });
}


// --- 7. ODONTOGRAMA LOGIC ---
const dientesQ1 = [18, 17, 16, 15, 14, 13, 12, 11];
const dientesQ2 = [21, 22, 23, 24, 25, 26, 27, 28];
let herramientaActual = 'caries';

window.setHerramienta = function (herramienta) {
    herramientaActual = herramienta;
}

function renderizarDiente(numero) {
    return `
        <div class="diente-wrapper">
            <div class="numero-diente">${numero}</div>
            <div class="diente-geo" id="diente-${numero}">
                <div class="zona vestibular" onclick="marcarZona(this, ${numero}, 'vestibular')"></div>
                <div class="zona distal" onclick="marcarZona(this, ${numero}, 'distal')"></div>
                <div class="zona mesial" onclick="marcarZona(this, ${numero}, 'mesial')"></div>
                <div class="zona lingual" onclick="marcarZona(this, ${numero}, 'lingual')"></div>
                <div class="zona oclusal" onclick="marcarZona(this, ${numero}, 'oclusal')"></div>
            </div>
        </div>
    `;
}

const contenedor = document.getElementById('arcada-superior');
if (contenedor) {
    const divQ1 = document.createElement('div');
    divQ1.className = 'cuadrante';
    dientesQ1.forEach(num => divQ1.innerHTML += renderizarDiente(num));

    const divQ2 = document.createElement('div');
    divQ2.className = 'cuadrante';
    dientesQ2.forEach(num => divQ2.innerHTML += renderizarDiente(num));

    contenedor.appendChild(divQ1);
    contenedor.appendChild(divQ2);
}

window.marcarZona = function (elemento, idDiente, zona) {
    elemento.classList.remove('estado-caries', 'estado-realizado');
    if (herramientaActual === 'caries') {
        elemento.classList.add('estado-caries');
    } else if (herramientaActual === 'realizado') {
        elemento.classList.add('estado-realizado');
    }
};

// --- 8. Helper: Switch Tabs in Specialist Modal ---
function switchSpecTab(tabId) {
    const parent = document.getElementById('modal-config-specialist');
    // Hide all contents in this modal
    parent.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    parent.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Activate specific
    document.getElementById(tabId).classList.add('active');

    // Activate button
    const buttons = parent.querySelectorAll('.tab-btn');
    if (tabId === 'spec-personal') buttons[0].classList.add('active');
    if (tabId === 'spec-profesional') buttons[1].classList.add('active');
    if (tabId === 'spec-cuenta') buttons[2].classList.add('active');
}
