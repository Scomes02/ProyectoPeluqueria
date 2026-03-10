if (localStorage.getItem('modoOscuro') === 'true') document.body.classList.add('modo-oscuro');
const btnTema = document.getElementById('toggle-tema');
if(btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
        if (typeof renderAnalisis === "function") renderAnalisis(); // Repintar gráfico con colores oscuros
    });
}

let chartIngresos = null;

document.addEventListener('DOMContentLoaded', async () => {
    const state = {
        peluqueros: [], servicios: [], historial: [], productos: [], carrito: [],
        movimientos: JSON.parse(localStorage.getItem('movimientos_hoy')) || {}, 
        rol: document.body.dataset.role
    };

    async function inicializar() {
        try {
            const resp = await fetch('api/api.php?accion=get_datos');
            const data = await resp.json();
            
            if (data.exito) {
                state.peluqueros = data.peluqueros || [];
                state.servicios = data.servicios || [];
                state.historial = data.historial || [];
                state.productos = data.productos || [];
                
                state.peluqueros.forEach(p => { 
                    const pId = String(p.id);
                    if (!state.movimientos[pId]) state.movimientos[pId] = {}; 
                });
                
                renderDashboard();
                if (state.rol === 'admin') {
                    renderStaffAdmin();
                    renderHistorial();
                    renderAnalisis(); 
                    renderConfig();
                    renderCatalogo();
                    renderCarrito();
                }
            } else {
                mostrarToast('Error cargando BD: ' + data.error, 'error');
            }
        } catch (error) {
            mostrarToast('Error de conexión con el servidor', 'error');
        }
    }

    function renderDashboard() {
        const grid = document.getElementById('contenedorPeluqueros');
        if(!grid) return;
        
        grid.innerHTML = '';
        let tBruto = 0, tTienda = 0, tPeluqueros = 0;

        state.peluqueros.forEach(p => {
            const pId = String(p.id);
            let totalPeluquero = 0;
            
            const botonesSrv = state.servicios.map(s => {
                const sId = String(s.id);
                const precioNumerico = parseFloat(s.precio) || 0;
                return `
                <button class="btn-servicio" onclick="registrarServicio('${pId}', '${sId}', 'sumar')">
                    <span>${s.nombre}</span><strong>$${precioNumerico}</strong>
                </button>`;
            }).join('');

            const realizados = state.servicios.map(s => {
                const sId = String(s.id);
                const cant = state.movimientos[pId]?.[sId] || 0;
                if (cant === 0) return '';
                
                const precioNumerico = parseFloat(s.precio) || 0;
                const subtotal = cant * precioNumerico;
                totalPeluquero += subtotal;
                
                return `
                <div class="item-contador">
                    <span>${s.nombre} x${cant}</span>
                    <div><strong>$${subtotal}</strong>
                    <button onclick="registrarServicio('${pId}', '${sId}', 'restar')" class="btn-icon" style="color:var(--danger); margin-left:5px;"><i class="fas fa-minus-circle"></i></button></div>
                </div>`;
            }).join('');

            const tienda = totalPeluquero * 0.20; 
            const neto = totalPeluquero - tienda;
            tBruto += totalPeluquero; tTienda += tienda; tPeluqueros += neto;

            grid.innerHTML += `
                <div class="card-peluquero">
                    <div class="card-header">
                        <h3><i class="fas fa-user"></i> ${p.nombre}</h3>
                    </div>
                    <div class="servicios-grid">${botonesSrv}</div>
                    <div class="lista-contadores">${realizados || '<p style="text-align:center;color:var(--secondary)">Sin servicios hoy</p>'}</div>
                    <div class="resumen-card">
                        <div class="item-contador"><span>Total Generado:</span><strong>$${totalPeluquero}</strong></div>
                        <div class="item-contador" style="color:var(--secondary)"><span>Caja Tienda (20%):</span><span>$${tienda}</span></div>
                        <div class="item-contador" style="color:var(--success); border-top:1px solid var(--border); margin-top:5px; padding-top:5px; font-weight:bold;"><span>A Pagar:</span><span>$${neto}</span></div>
                    </div>
                </div>`;
        });

        document.getElementById('liveTotal').textContent = `$${tBruto}`;
        document.getElementById('liveTienda').textContent = `$${tTienda}`;
        document.getElementById('livePeluqueros').textContent = `$${tPeluqueros}`;
    }

    window.registrarServicio = (idP, idS, accion) => {
        idP = String(idP); idS = String(idS);
        if (!state.movimientos[idP]) state.movimientos[idP] = {};
        if (!state.movimientos[idP][idS]) state.movimientos[idP][idS] = 0;
        
        if (accion === 'sumar') state.movimientos[idP][idS]++;
        if (accion === 'restar' && state.movimientos[idP][idS] > 0) state.movimientos[idP][idS]--;
        
        localStorage.setItem('movimientos_hoy', JSON.stringify(state.movimientos));
        renderDashboard();
    };

    async function ejecutarAgregarPeluquero(inputElementId) {
        const input = document.getElementById(inputElementId);
        if(!input) return;
        const nombre = input.value.trim();
        if (!nombre) return mostrarToast('Ingrese un nombre válido', 'error');
        
        try {
            const resp = await fetch('api/api.php?accion=add_peluquero', { method: 'POST', body: JSON.stringify({ nombre }) });
            const data = await resp.json();
            if (data.exito) {
                input.value = '';
                await inicializar();
                mostrarToast('Profesional agregado');
            } else { mostrarToast(data.error, 'error'); }
        } catch (e) { mostrarToast('Error al conectar', 'error'); }
    }

    const btnAddDash = document.getElementById('btn-agregar-peluquero-dash');
    if(btnAddDash) btnAddDash.addEventListener('click', () => ejecutarAgregarPeluquero('nombrePeluqueroDash'));
    const btnAddAdmin = document.getElementById('btn-agregar-peluquero-admin');
    if(btnAddAdmin) btnAddAdmin.addEventListener('click', () => ejecutarAgregarPeluquero('nombrePeluqueroAdmin'));

    window.eliminarPeluquero = async (id) => {
        if (!confirm("¿Borrar peluquero permanentemente?")) return;
        try {
            const resp = await fetch('api/api.php?accion=del_peluquero', { method: 'POST', body: JSON.stringify({ id }) });
            if((await resp.json()).exito) {
                delete state.movimientos[String(id)];
                localStorage.setItem('movimientos_hoy', JSON.stringify(state.movimientos));
                inicializar();
                mostrarToast('Peluquero eliminado', 'error');
            }
        } catch (e) { mostrarToast('Error de red', 'error'); }
    };

    document.getElementById('btn-cerrar-caja').addEventListener('click', async () => {
        if (!confirm("⚠️ ¿Cerrar el día y guardar caja?")) return;

        let totalBruto = 0, totalTienda = 0;
        const detalles = [];

        state.peluqueros.forEach(p => {
            const pId = String(p.id);
            let totalP = 0;
            state.servicios.forEach(s => {
                const sId = String(s.id);
                const cant = state.movimientos[pId]?.[sId] || 0;
                totalP += cant * parseFloat(s.precio);
            });
            
            if (totalP > 0) {
                totalBruto += totalP;
                totalTienda += (totalP * 0.20);
                detalles.push({ id_peluquero: p.id, total: totalP, ganancia: totalP * 0.80 });
            }
        });

        if (totalBruto === 0) return mostrarToast('No hay cobros para registrar', 'error');

        try {
            const resp = await fetch('api/api.php?accion=cerrar_caja', { method: 'POST', body: JSON.stringify({ totalBruto, totalTienda, detalles }) });
            if ((await resp.json()).exito) {
                localStorage.removeItem('movimientos_hoy');
                state.movimientos = {};
                inicializar();
                mostrarToast('Día cerrado exitosamente');
            }
        } catch (e) { mostrarToast('Error de conexión', 'error'); }
    });

    if (state.rol === 'admin') {
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.getElementById(e.target.closest('button').dataset.target).classList.add('active');
                e.target.closest('button').classList.add('active');
            });
        });

        window.renderHistorial = () => {
            const tbody = document.querySelector('#tablaHistorial tbody');
            if(!tbody) return;
            
            tbody.innerHTML = state.historial.map(h => {
                const detalleDiscriminado = h.detalles.map(d => `• ${d.nombre_peluquero}: Generó $${parseFloat(d.total_generado)} (A pagar: $${parseFloat(d.pago_peluquero)})`).join('<br>');
                return `
                <tr>
                    <td>${h.fecha}</td>
                    <td>$${parseFloat(h.total_bruto)}</td>
                    <td style="color:var(--success);font-weight:bold">$${parseFloat(h.ganancia_local)}</td>
                    <td><small>${detalleDiscriminado}</small></td>
                </tr>`;
            }).join('');
        };

        const btnPDF = document.getElementById('btn-exportar-pdf');
        if (btnPDF) {
            btnPDF.addEventListener('click', () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('landscape'); 
                doc.setFontSize(18);
                doc.text("Historial de Cajas - Peluquería", 14, 20);
                doc.autoTable({ html: '#tablaHistorial', startY: 30, theme: 'grid', headStyles: { fillColor: [37, 99, 235] }, styles: { fontSize: 10 }});
                doc.save('Historial_Peluqueria.pdf');
                mostrarToast('PDF generado exitosamente');
            });
        }

        // --- ANÁLISIS REDISEÑADO ---
        window.renderAnalisis = (filtroDesde = null, filtroHasta = null) => {
            const canvas = document.getElementById('ingresosChart');
            if (!canvas) return;

            let datosFiltrados = state.historial;
            if (filtroDesde) {
                const dDesde = new Date(filtroDesde).getTime();
                datosFiltrados = datosFiltrados.filter(h => new Date(h.fecha).getTime() >= dDesde);
            }
            if (filtroHasta) {
                const dHasta = new Date(filtroHasta).getTime() + 86400000; 
                datosFiltrados = datosFiltrados.filter(h => new Date(h.fecha).getTime() <= dHasta);
            }

            const datosCronologicos = [...datosFiltrados].reverse(); 
            const labelsGrafico = datosCronologicos.map(h => h.fecha.split(' ')[0]); 
            const dataBruto = datosCronologicos.map(h => parseFloat(h.total_bruto));
            const dataLocal = datosCronologicos.map(h => parseFloat(h.ganancia_local));

            const isDark = document.body.classList.contains('modo-oscuro');
            const textColor = isDark ? '#f1f5f9' : '#1e293b';
            const gridColor = isDark ? '#334155' : '#e2e8f0';

            if (chartIngresos) chartIngresos.destroy();

            chartIngresos = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labelsGrafico,
                    datasets: [
                        { label: 'Ingreso Bruto Total', data: dataBruto, borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', fill: true, tension: 0.3 },
                        { label: 'Caja del Local', data: dataLocal, borderColor: '#16a34a', backgroundColor: 'rgba(22, 163, 74, 0.1)', fill: true, tension: 0.3 }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { 
                        legend: { labels: { color: textColor } },
                        title: { display: false } // El título ahora es HTML puro
                    },
                    scales: {
                        x: { ticks: { color: textColor }, grid: { color: gridColor } },
                        y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
                    }
                }
            });

            // Ranking con diseño de Tarjetas
            let agregados = {};
            datosFiltrados.forEach(h => {
                h.detalles.forEach(d => {
                    const nombre = d.nombre_peluquero;
                    if(!agregados[nombre]) agregados[nombre] = 0;
                    agregados[nombre] += parseFloat(d.total_generado);
                });
            });

            const rankingOrdenado = Object.keys(agregados)
                .map(nombre => ({ nombre, total: agregados[nombre] }))
                .sort((a, b) => b.total - a.total);

            const tbodyRanking = document.querySelector('#tablaRanking tbody');
            tbodyRanking.innerHTML = '';

            if(rankingOrdenado.length === 0) {
                tbodyRanking.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; background: var(--bg); border-radius: 8px;">No hay datos para estas fechas</td></tr>';
            } else {
                rankingOrdenado.forEach((peluquero, index) => {
                    let medalla = '';
                    if (index === 0) medalla = '🥇';
                    else if (index === 1) medalla = '🥈';
                    else if (index === 2) medalla = '🥉';
                    else medalla = `<span style="color: var(--secondary); font-size: 0.9em;">${index + 1}º</span>`;

                    // Colorear el Top 1
                    let bgClass = index === 0 ? 'background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3);' : 'background: var(--bg); border: 1px solid var(--border);';
                    
                    tbodyRanking.innerHTML += `
                        <tr>
                            <td style="text-align:center; font-size:1.3em; ${bgClass} border-right: none; border-radius: 8px 0 0 8px;">${medalla}</td>
                            <td style="font-weight: 600; ${bgClass} border-left: none; border-right: none;">${peluquero.nombre}</td>
                            <td style="color:var(--success); font-weight: bold; ${bgClass} border-left: none; border-radius: 0 8px 8px 0; text-align: right;">$${peluquero.total}</td>
                        </tr>
                    `;
                });
            }
        };

        const btnFiltrar = document.getElementById('btn-filtrar-analisis');
        const btnLimpiar = document.getElementById('btn-limpiar-filtro');

        if(btnFiltrar) {
            btnFiltrar.addEventListener('click', () => {
                const desde = document.getElementById('filtro-desde').value;
                const hasta = document.getElementById('filtro-hasta').value;
                renderAnalisis(desde, hasta);
                mostrarToast('Datos filtrados');
            });
        }

        if(btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                document.getElementById('filtro-desde').value = '';
                document.getElementById('filtro-hasta').value = '';
                renderAnalisis();
                mostrarToast('Mostrando todo el historial');
            });
        }

        window.renderStaffAdmin = () => {
            const list = document.getElementById('listaStaffAdmin');
            if(!list) return;
            list.innerHTML = state.peluqueros.map(p => `
                <div class="staff-card">
                    <span><i class="fas fa-user text-primary"></i> <b>${p.nombre}</b></span>
                    <button onclick="eliminarPeluquero('${p.id}')" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `).join('');
        };

        window.renderConfig = () => {
            const configList = document.getElementById('listaServiciosConfig');
            if(!configList) return;
            configList.innerHTML = state.servicios.map(s => `
                <li class="config-item">
                    <span>${s.nombre} - <strong>$${parseFloat(s.precio)}</strong></span>
                    <button onclick="eliminarServicio(${s.id})" class="btn-icon" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
                </li>
            `).join('');
        };

        const btnCrearServicio = document.getElementById('btn-crear-servicio');
        if(btnCrearServicio) {
            btnCrearServicio.addEventListener('click', async () => {
                const nombre = document.getElementById('nuevoServicioNombre').value;
                const precio = document.getElementById('nuevoServicioPrecio').value;
                if (nombre && precio) {
                    await fetch('api/api.php?accion=add_servicio', { method: 'POST', body: JSON.stringify({ nombre, precio }) });
                    document.getElementById('nuevoServicioNombre').value = '';
                    document.getElementById('nuevoServicioPrecio').value = '';
                    inicializar();
                    mostrarToast('Servicio creado con éxito');
                }
            });
        }

        window.eliminarServicio = async (id) => {
            if(!confirm("¿Eliminar este servicio del catálogo?")) return;
            await fetch('api/api.php?accion=del_servicio', { method: 'POST', body: JSON.stringify({ id }) });
            inicializar();
            mostrarToast('Servicio eliminado', 'error');
        };

        window.renderCatalogo = () => {
            const gridProds = document.getElementById('grid-productos');
            if(!gridProds) return;
            gridProds.innerHTML = state.productos.map(p => `
                <div class="producto-card">
                    <i class="fas ${p.icono}" style="font-size: 2em; color: var(--primary); margin-bottom: 10px;"></i>
                    <h4>${p.nombre}</h4><p><strong>$${parseFloat(p.precio)}</strong></p>
                    <button onclick="addCarrito(${p.id})" class="btn btn-primary btn-sm mt-10"><i class="fas fa-cart-plus"></i> Añadir</button>
                </div>
            `).join('');
        };

        window.addCarrito = (idProd) => {
            const prod = state.productos.find(p => String(p.id) === String(idProd));
            if(!prod) return;
            const item = state.carrito.find(i => String(i.id) === String(prod.id));
            if (item) item.cantidad++; else state.carrito.push({ ...prod, cantidad: 1 });
            renderCarrito();
            mostrarToast('Agregado al carrito');
        };

        window.delCarrito = (idProd) => {
            state.carrito = state.carrito.filter(i => String(i.id) !== String(idProd));
            renderCarrito();
        };

        window.renderCarrito = () => {
            const box = document.getElementById('carrito-items');
            if(!box) return;
            box.innerHTML = state.carrito.length === 0 ? '<p style="text-align:center;color:var(--secondary)">Tu carrito está vacío</p>' : '';
            let total = 0;
            state.carrito.forEach(i => {
                const precio = parseFloat(i.precio);
                total += precio * i.cantidad;
                box.innerHTML += `
                    <div class="carrito-item">
                        <span><b>${i.cantidad}x</b> ${i.nombre}</span>
                        <div><span>$${precio * i.cantidad}</span> <button onclick="delCarrito(${i.id})" class="btn-icon ms-2" style="color:var(--danger)"><i class="fas fa-times"></i></button></div>
                    </div>`;
            });
            document.getElementById('total-carrito').textContent = `$${total}`;
        };

        const btnEnviarPedido = document.getElementById('btn-enviar-pedido');
        if(btnEnviarPedido) {
            btnEnviarPedido.addEventListener('click', () => {
                if (state.carrito.length === 0) return mostrarToast('El carrito está vacío', 'error');
                state.carrito = [];
                renderCarrito();
                mostrarToast('¡Pedido enviado al proveedor correctamente!');
            });
        }
    }

    document.getElementById('btn-logout').addEventListener('click', async () => {
        await fetch('api/auth.php', { method: 'POST', body: JSON.stringify({ accion: 'logout' }) });
        window.location.href = 'login.php';
    });

    function mostrarToast(msg, tipo='success') {
        const t = document.createElement('div');
        t.className = `toast ${tipo}`;
        t.innerHTML = `<i class="fas ${tipo==='success'?'fa-check-circle':'fa-info-circle'}"></i> ${msg}`;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    inicializar();
});