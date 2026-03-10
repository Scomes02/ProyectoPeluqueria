<?php
session_start();
require 'conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$accion = $data['accion'] ?? '';

if ($accion === 'login') {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // Buscamos el usuario en la BD
    $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // Validación de contraseñas (en un proyecto real se usa password_verify)
    if ($user && $password === $user['password']) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['rol'] = $user['rol'];
        echo json_encode(['exito' => true, 'rol' => $user['rol']]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Credenciales incorrectas']);
    }
} 
elseif ($accion === 'logout') {
    session_destroy();
    echo json_encode(['exito' => true]);
}
?>