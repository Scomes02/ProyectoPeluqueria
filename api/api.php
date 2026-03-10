<?php
session_start();
require 'conexion.php';
header('Content-Type: application/json');

if (!isset($_SESSION['rol'])) { die(json_encode(['exito' => false, 'error' => 'No autorizado'])); }

$rol = $_SESSION['rol'];
$accion = $_GET['accion'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

try {
    // 1. OBTENER DATOS (Mapeado a tu BD exacta)
    if ($accion === 'get_datos' && $metodo === 'GET') {
        // Renombramos los IDs en la consulta para que el JS entienda
        $peluqueros = $pdo->query('SELECT id_peluquero as id, nombre FROM peluqueros WHERE estado = 1')->fetchAll();
        $servicios = $pdo->query('SELECT id_servicio as id, nombre, precio FROM servicios')->fetchAll();
        $productos = $pdo->query('SELECT id_producto as id, nombre, precio, icono FROM productos_proveedor')->fetchAll();
        
        $historial = [];
        if ($rol === 'admin') {
            // Corrección Error 1: Usamos id_cierre
            $cajas = $pdo->query('SELECT * FROM historial_cajas ORDER BY id_cierre DESC')->fetchAll();
            
            // Relacionamos las tablas para traer el nombre del peluquero
            $stmtDetalles = $pdo->prepare('
                SELECT d.total_generado, d.pago_peluquero, p.nombre as nombre_peluquero 
                FROM detalle_cierres d 
                JOIN peluqueros p ON d.id_peluquero = p.id_peluquero 
                WHERE d.id_cierre = ?
            ');

            foreach ($cajas as $caja) {
                $stmtDetalles->execute([$caja['id_cierre']]);
                $caja['detalles'] = $stmtDetalles->fetchAll();
                $historial[] = $caja;
            }
        }
        echo json_encode(['exito' => true, 'peluqueros' => $peluqueros, 'servicios' => $servicios, 'historial' => $historial, 'productos' => $productos]);
    }

    // 2. AGREGAR PELUQUERO
    elseif ($accion === 'add_peluquero' && $metodo === 'POST') {
        $stmt = $pdo->prepare('INSERT INTO peluqueros (nombre, estado) VALUES (?, 1)');
        $stmt->execute([$data['nombre']]);
        echo json_encode(['exito' => true, 'id' => $pdo->lastInsertId()]);
    }

    // 3. ELIMINAR PELUQUERO (Borrado lógico cambiando estado)
    elseif ($accion === 'del_peluquero' && $metodo === 'POST' && $rol === 'admin') {
        $stmt = $pdo->prepare('UPDATE peluqueros SET estado = 0 WHERE id_peluquero = ?');
        $stmt->execute([$data['id']]);
        echo json_encode(['exito' => true]);
    }

    // 4. AGREGAR SERVICIO
    elseif ($accion === 'add_servicio' && $metodo === 'POST' && $rol === 'admin') {
        $stmt = $pdo->prepare('INSERT INTO servicios (nombre, precio) VALUES (?, ?)');
        $stmt->execute([$data['nombre'], (float)$data['precio']]);
        echo json_encode(['exito' => true, 'id' => $pdo->lastInsertId()]);
    }

    // 5. ELIMINAR SERVICIO
    elseif ($accion === 'del_servicio' && $metodo === 'POST' && $rol === 'admin') {
        $stmt = $pdo->prepare('DELETE FROM servicios WHERE id_servicio = ?');
        $stmt->execute([$data['id']]);
        echo json_encode(['exito' => true]);
    }

    // 6. CERRAR CAJA (Corrección Error 2: Insertamos id_peluquero)
    elseif ($accion === 'cerrar_caja' && $metodo === 'POST') {
        $pdo->beginTransaction(); 
        
        $stmt = $pdo->prepare('INSERT INTO historial_cajas (total_bruto, ganancia_local) VALUES (?, ?)');
        $stmt->execute([(float)$data['totalBruto'], (float)$data['totalTienda']]);
        $idCierre = $pdo->lastInsertId();

        // En lugar de enviar 'nombre_peluquero', enviamos el 'id_peluquero' que es lo correcto en BD
        $stmtDetalle = $pdo->prepare('INSERT INTO detalle_cierres (id_cierre, id_peluquero, total_generado, pago_peluquero) VALUES (?, ?, ?, ?)');
        foreach ($data['detalles'] as $d) {
            $stmtDetalle->execute([$idCierre, $d['id_peluquero'], (float)$d['total'], (float)$d['ganancia']]);
        }
        
        $pdo->commit();
        echo json_encode(['exito' => true]);
    }
    
    else { echo json_encode(['exito' => false, 'error' => 'Acción no válida o sin permisos']); }

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}
?>