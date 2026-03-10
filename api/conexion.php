<?php
$host = 'localhost';
$db   = 'peluqueria_db';
$user = 'root'; // Usuario de XAMPP
$pass = 'Comes.1016';     // Sin clave por defecto en XAMPP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die(json_encode(['exito' => false, 'error' => 'Error de conexión a la BD']));
}
?>