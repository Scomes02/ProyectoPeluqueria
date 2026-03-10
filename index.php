<?php
session_start();
if (!isset($_SESSION['rol'])) { header("Location: login.php"); exit; }
$rol = $_SESSION['rol'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="fotosIndex/icono.ico">
    <title>Sistema de Gestión - Peluquería PRO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body data-role="<?php echo $rol; ?>">

    <header>
        <div class="logo-area">
            <h1>✂️ Gestión Peluquería</h1>
            <span class="badge"><?php echo strtoupper($rol); ?></span>
        </div>
        <div class="user-controls">
            <button id="toggle-tema" class="btn-icon" title="Cambiar Tema">🌙</button>
            <button id="btn-logout" class="btn btn-danger btn-sm"><i class="fas fa-sign-out-alt"></i> Salir</button>
        </div>
    </header>

    <nav class="main-nav">
        <button data-target="dashboard" class="nav-btn active"><i class="fas fa-chart-line"></i> Tablero Diario</button>
        <?php if($rol === 'admin'): ?>
            <button data-target="staff" class="nav-btn"><i class="fas fa-users"></i> Gestión Staff</button>
            <button data-target="pedidos" class="nav-btn"><i class="fas fa-truck-loading"></i> Proveedores</button>
            <button data-target="historial" class="nav-btn"><i class="fas fa-scroll"></i> Historial y Análisis</button>
            <button data-target="config" class="nav-btn"><i class="fas fa-cog"></i> Ajustes</button>
        <?php endif; ?>
    </nav>

    <main>
        <section id="dashboard" class="vista active">
            <div class="controls">
                <?php if($rol === 'staff'): ?>
                    <div class="input-group">
                        <input type="text" id="nombrePeluqueroDash" placeholder="Tu Nombre (Nuevo)" />
                        <button id="btn-agregar-peluquero-dash" class="btn btn-primary"><i class="fas fa-plus"></i> Ingresar al Turno</button>
                    </div>
                <?php else: ?>
                    <p style="margin: 0; font-weight: bold; color: var(--secondary);">Panel de control del día actual:</p>
                <?php endif; ?>
                
                <button id="btn-cerrar-caja" class="btn btn-success"><i class="fas fa-cash-register"></i> Cerrar Día y Guardar</button>
            </div>

            <div id="contenedorPeluqueros" class="peluqueros-grid"></div>

            <div class="live-stats">
                <div class="stats-row">
                    <div class="stat-card"><span>Ingreso Bruto</span><strong id="liveTotal">$0</strong></div>
                    <div class="stat-card"><span>Caja Local (20%)</span><strong id="liveTienda">$0</strong></div>
                    <div class="stat-card"><span>A Pagar Staff</span><strong id="livePeluqueros">$0</strong></div>
                </div>
            </div>
        </section>

        <?php if($rol === 'admin'): ?>
        <section id="staff" class="vista">
            <div class="config-block">
                <h3>Agregar Nuevo Peluquero</h3>
                <div class="input-group">
                    <input type="text" id="nombrePeluqueroAdmin" placeholder="Nombre del profesional" />
                    <button id="btn-agregar-peluquero-admin" class="btn btn-primary"><i class="fas fa-plus"></i> Guardar</button>
                </div>
            </div>
            <h2>Plantel Actual</h2>
            <div id="listaStaffAdmin" class="staff-grid mt-10"></div>
        </section>
        
        <section id="pedidos" class="vista">
            <div class="pedidos-container">
                <div class="catalogo-proveedores">
                    <h2>Catálogo</h2>
                    <div id="grid-productos" class="productos-grid"></div>
                </div>
                <div class="carrito-panel">
                    <h3>🛒 Carrito de Pedido</h3>
                    <div id="carrito-items" class="carrito-items"></div>
                    <div class="carrito-footer">
                        <div class="total-pedido">Total: <strong id="total-carrito">$0</strong></div>
                        <button id="btn-enviar-pedido" class="btn btn-success w-100">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="historial" class="vista">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2>Historial de Cajas Cerradas</h2>
                <button id="btn-exportar-pdf" class="btn btn-secondary"><i class="fas fa-file-pdf"></i> Exportar a PDF</button>
            </div>
            
            <table id="tablaHistorial" class="tabla-clasica">
                <thead><tr><th>Fecha</th><th>Total Bruto</th><th>Caja Local</th><th>Detalle Staff</th></tr></thead>
                <tbody></tbody>
            </table>

            <hr style="margin: 45px 0; border: 1px solid var(--border);">
            
            <h2 style="margin-bottom: 20px;">Análisis de Ingresos y Rendimiento</h2>
            
            <div class="controls analisis-filtros" style="margin-bottom: 30px;">
                <div class="input-group">
                    <label style="font-weight: bold; color: var(--secondary);">Desde:</label> 
                    <input type="date" id="filtro-desde">
                    <label style="font-weight: bold; color: var(--secondary); margin-left: 10px;">Hasta:</label> 
                    <input type="date" id="filtro-hasta">
                    <button id="btn-filtrar-analisis" class="btn btn-primary ms-2"><i class="fas fa-filter"></i> Filtrar</button>
                    <button id="btn-limpiar-filtro" class="btn btn-secondary ms-2"><i class="fas fa-sync"></i> Todo</button>
                </div>
            </div>

            <div class="analisis-grid">
                
                <div class="config-block" style="padding: 30px; margin: 0; width: 100%; box-sizing: border-box;">
                    <h3 style="margin-top:0; color: var(--primary); text-align: center; margin-bottom: 25px;">Curva de Ingresos del Periodo</h3>
                    <canvas id="ingresosChart"></canvas>
                </div>
                
                <div class="config-block" style="padding: 30px; margin: 0; width: 100%; box-sizing: border-box;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h3 style="margin-top:0; color: var(--primary); font-size: 1.5em;"><i class="fas fa-trophy" style="color: gold;"></i> Top Peluqueros</h3>
                        <p style="font-size: 0.9em; color: var(--secondary); margin-top: 5px;">Basado en recaudación neta</p>
                    </div>
                    
                    <table id="tablaRanking">
                        <thead>
                            <tr>
                                <th style="text-align: center;">Pos</th>
                                <th>Peluquero</th>
                                <th style="text-align: right;">Generado</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

            </div>

        </section>

        <section id="config" class="vista">
            <div class="config-block">
                <h3>Crear Nuevo Servicio</h3>
                <div class="input-group">
                    <input type="text" id="nuevoServicioNombre" placeholder="Ej: Mechas">
                    <input type="number" id="nuevoServicioPrecio" placeholder="Precio ($)">
                    <button id="btn-crear-servicio" class="btn btn-primary">Añadir</button>
                </div>
                <ul id="listaServiciosConfig" class="config-list mt-10"></ul>
            </div>
        </section>
        <?php endif; ?>
    </main>

    <div id="toast-container" class="toast-container"></div>
    <script src="js/app.js"></script>
</body>
</html>