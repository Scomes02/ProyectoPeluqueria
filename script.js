// --- ESTADO INICIAL Y CONFIGURACIÓN ---
const DEFAULT_CONFIG = {
    porcentajeTienda: 20,
    servicios: [
        { id: 'corte', nombre: 'Corte', precio: 1500 },
        { id: 'barba', nombre: 'Barba', precio: 1000 },
        { id: 'color', nombre: 'Color', precio: 2000 }
    ]
};

// Variables Globales del Estado
let appConfig = JSON.parse(localStorage.getItem('pelu_config')) || DEFAULT_CONFIG;
let peluqueros = JSON.parse(localStorage.getItem('pelu_dia_actual')) || [];
let historial = JSON.parse(localStorage.getItem('pelu_historial')) || [];
let rolActual = 'admin'; // 'admin' o 'staff'

// --- INICIO ---
document.addEventListener('DOMContentLoaded', () => {
    renderPeluqueros();
    renderConfiguracion();
    renderHistorial();
    actualizarTotalesGlobales();
    verificarTema();
    cambiarRol(); // Aplicar rol inicial
});

// --- GESTIÓN DE PELUQUEROS ---
function agregarPeluquero() {
    const input = document.getElementById("nombrePeluquero");
    const nombre = input.value.trim();
    if (!nombre) return alert("Ingrese un nombre válido");

    // Estructura de servicios basada en la config actual
    // Creamos un objeto contador dinámico
    const serviciosIniciales = {};
    appConfig.servicios.forEach(s => serviciosIniciales[s.id] = 0);

    peluqueros.push({
        id: Date.now(), // ID único
        nombre,
        servicios: serviciosIniciales
    });
    
    input.value = "";
    guardarDatos();
    renderPeluqueros();
}

function eliminarPeluquero(id) {
    if (confirm("¿Seguro que quieres eliminar a este peluquero y sus datos de hoy?")) {
        peluqueros = peluqueros.filter(p => p.id !== id);
        guardarDatos();
        renderPeluqueros();
    }
}

// --- GESTIÓN DE SERVICIOS (Lógica Core) ---
function registrarServicio(idPeluquero, idServicio, accion) {
    const peluquero = peluqueros.find(p => p.id === idPeluquero);
    if (!peluquero) return;

    if (accion === 'sumar') {
        peluquero.servicios[idServicio] = (peluquero.servicios[idServicio] || 0) + 1;
    } else if (accion === 'restar') {
        if (peluquero.servicios[idServicio] > 0) {
            peluquero.servicios[idServicio]--;
        }
    }

    guardarDatos();
    renderPeluqueros();
}

// --- RENDERIZADO (UI) ---
function renderPeluqueros() {
    const contenedor = document.getElementById("contenedorPeluqueros");
    contenedor.innerHTML = "";

    peluqueros.forEach(p => {
        const calculos = calcularFinanzasPeluquero(p);
        
        // Generar botones de servicio dinámicamente desde la config
        const botonesHtml = appConfig.servicios.map(s => `
            <button class="btn-servicio" onclick="registrarServicio(${p.id}, '${s.id}', 'sumar')">
                <span>${s.nombre}</span>
                <strong>$${s.precio}</strong>
            </button>
        `).join('');

        // Generar lista de contadores (solo si > 0)
        const contadoresHtml = appConfig.servicios.map(s => {
            const cantidad = p.servicios[s.id] || 0;
            if (cantidad === 0) return '';
            return `
                <div class="item-contador">
                    <span>${s.nombre} x${cantidad}</span>
                    <div>
                        <strong>$${cantidad * s.precio}</strong>
                        <button onclick="registrarServicio(${p.id}, '${s.id}', 'restar')" class="btn-icon" style="color:red; margin-left:5px;">
                            <i class="fas fa-minus-circle"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const card = document.createElement('div');
        card.className = 'card-peluquero';
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-user"></i> ${p.nombre}</h3>
                <button class="btn-danger admin-only" onclick="eliminarPeluquero(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="servicios-grid">
                ${botonesHtml}
            </div>

            <div class="lista-contadores">
                ${contadoresHtml}
            </div>

            <div class="resumen-card">
                <div class="item-contador">
                    <span>Total Generado:</span>
                    <strong>$${calculos.total}</strong>
                </div>
                <div class="item-contador" style="color: var(--secondary)">
                    <span>Comisión Tienda (${appConfig.porcentajeTienda}%):</span>
                    <span>$${calculos.tienda.toFixed(2)}</span>
                </div>
                <div class="item-contador" style="color: var(--success); font-weight:bold; font-size:1.1em; border-top:1px solid #ccc; margin-top:5px; padding-top:5px;">
                    <span>Ganancia Neta:</span>
                    <span>$${calculos.peluquero.toFixed(2)}</span>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    actualizarTotalesGlobales();
    aplicarPermisosRol(); // Re-aplicar permisos al redibujar
}

function calcularFinanzasPeluquero(peluquero) {
    let total = 0;
    appConfig.servicios.forEach(s => {
        const cantidad = peluquero.servicios[s.id] || 0;
        total += cantidad * s.precio;
    });
    
    const tienda = total * (appConfig.porcentajeTienda / 100);
    return {
        total: total,
        tienda: tienda,
        peluquero: total - tienda
    };
}

function actualizarTotalesGlobales() {
    let totalBruto = 0;
    let totalTienda = 0;
    let totalPeluqueros = 0;

    peluqueros.forEach(p => {
        const finanzas = calcularFinanzasPeluquero(p);
        totalBruto += finanzas.total;
        totalTienda += finanzas.tienda;
        totalPeluqueros += finanzas.peluquero;
    });

    document.getElementById('liveTotal').textContent = `$${totalBruto.toFixed(2)}`;
    document.getElementById('liveTienda').textContent = `$${totalTienda.toFixed(2)}`;
    document.getElementById('livePeluqueros').textContent = `$${totalPeluqueros.toFixed(2)}`;
}

// --- CIERRE DE CAJA E HISTORIAL ---
function finalizarDia() {
    if (peluqueros.length === 0) return alert("No hay movimientos para cerrar.");
    
    if (!confirm("⚠️ ¿Estás seguro de cerrar la caja? \nEsto guardará el día en el historial y reiniciará los contadores a cero.")) return;

    // Calcular totales finales
    let totalDia = 0;
    let gananciaTiendaDia = 0;
    
    const detallePeluqueros = peluqueros.map(p => {
        const f = calcularFinanzasPeluquero(p);
        totalDia += f.total;
        gananciaTiendaDia += f.tienda;
        return {
            nombre: p.nombre,
            total: f.total,
            ganancia: f.peluquero
        };
    });

    // Crear registro
    const registroDia = {
        fecha: new Date().toLocaleString(),
        totalBruto: totalDia,
        totalTienda: gananciaTiendaDia,
        detalle: detallePeluqueros
    };

    // Guardar en historial
    historial.unshift(registroDia); // Agregar al principio
    localStorage.setItem('pelu_historial', JSON.stringify(historial));

    // Reiniciar día actual
    peluqueros = []; // Opcional: ¿Mantener peluqueros pero con contadores en 0?
    // Si quieres mantener nombres: peluqueros.forEach(p => p.servicios = {});
    // Por ahora reiniciamos todo para forzar 'Carga limpia'.
    
    guardarDatos();
    renderPeluqueros();
    renderHistorial();
    alert("✅ Día cerrado y guardado correctamente.");
}

function renderHistorial() {
    const tbody = document.querySelector('#tablaHistorial tbody');
    tbody.innerHTML = historial.map(h => `
        <tr>
            <td>${h.fecha}</td>
            <td>$${h.totalBruto.toFixed(2)}</td>
            <td style="color:green; font-weight:bold">$${h.totalTienda.toFixed(2)}</td>
            <td>
                <small>${h.detalle.map(d => `${d.nombre}: $${d.total}`).join(', ')}</small>
            </td>
        </tr>
    `).join('');
}

// --- CONFIGURACIÓN ---
function renderConfiguracion() {
    // Lista servicios
    const ul = document.getElementById('listaServiciosConfig');
    ul.innerHTML = appConfig.servicios.map((s, index) => `
        <li class="config-item">
            <span>${s.nombre} - <strong>$${s.precio}</strong></span>
            <button class="btn-danger btn-icon" onclick="borrarServicio(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');

    // Input Porcentaje
    document.getElementById('configPorcentaje').value = appConfig.porcentajeTienda;
}

function crearServicioNuevo() {
    const nombre = document.getElementById('nuevoServicioNombre').value;
    const precio = parseFloat(document.getElementById('nuevoServicioPrecio').value);
    
    if (nombre && precio) {
        // ID simple basado en nombre (ej: "Corte Niño" -> "corte_nino")
        const id = nombre.toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        appConfig.servicios.push({ id, nombre, precio });
        guardarConfiguracion();
        renderConfiguracion();
        renderPeluqueros(); // Actualizar interfaz principal
        
        // Limpiar inputs
        document.getElementById('nuevoServicioNombre').value = '';
        document.getElementById('nuevoServicioPrecio').value = '';
    }
}

function borrarServicio(index) {
    if(confirm("¿Eliminar servicio? No afectará a lo ya cobrado hoy, pero desaparecerá el botón.")) {
        appConfig.servicios.splice(index, 1);
        guardarConfiguracion();
        renderConfiguracion();
        renderPeluqueros();
    }
}

function guardarConfiguracion() {
    const porc = document.getElementById('configPorcentaje').value;
    appConfig.porcentajeTienda = parseFloat(porc);
    
    localStorage.setItem('pelu_config', JSON.stringify(appConfig));
    actualizarTotalesGlobales();
    renderPeluqueros(); // Para actualizar cálculos en tiempo real
}

// --- UTILIDADES ---
function guardarDatos() {
    localStorage.setItem('pelu_dia_actual', JSON.stringify(peluqueros));
    actualizarTotalesGlobales();
}

function cambiarRol() {
    rolActual = document.getElementById('roleSelector').value;
    document.body.setAttribute('data-role', rolActual);
    
    // Ocultar pestañas si es staff (volver al dashboard forzado)
    if(rolActual === 'staff') {
        mostrarSeccion('dashboard');
    }
    aplicarPermisosRol();
}

function aplicarPermisosRol() {
    // CSS se encarga de ocultar cosas con clase 'admin-only'
    // JS extra si fuera necesario
}

function mostrarSeccion(id) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    // Encontrar el botón correspondiente (simple hack)
    const btnIndex = ['dashboard', 'historial', 'config'].indexOf(id);
    if(btnIndex >= 0) document.querySelectorAll('.nav-btn')[btnIndex].classList.add('active');
}

function verificarTema() {
    const esOscuro = localStorage.getItem('modoOscuro') === 'true';
    if(esOscuro) document.body.classList.add('modo-oscuro');
    
    document.getElementById('toggle-tema').addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
    });
}