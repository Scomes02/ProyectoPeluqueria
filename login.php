<?php
session_start();
// Si ya está logueado, lo pateamos al index para que no vea el login de nuevo
if (isset($_SESSION['rol'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="icon" href="fotosIndex/icono.ico">
    <meta charset="UTF-8">
    <title>Login - Peluquería</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-body">
    <div class="login-box">
        <h2>✂️ Ingreso al Sistema</h2>
        <form id="form-login">
            <div class="input-group-vertical">
                <label>Usuario</label>
                <input type="text" id="username" placeholder="admin o staff" required>
            </div>
            <div class="input-group-vertical">
                <label>Contraseña</label>
                <input type="password" id="password" placeholder="admin123 o staff123" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-10">Ingresar</button>
        </form>
        <div id="login-error" class="error-msg"></div>
    </div>
    <script src="js/login.js"></script>
</body>
</html>