<?php
// api/check_session.php
require 'db_connection.php'; // Inicia a sessão

// Define o tipo de resposta como JSON
header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    echo json_encode([
        'status' => 'loggedin',
        'userId' => $_SESSION['user_id'],
        'userName' => $_SESSION['user_name']
    ]);
} else {
    echo json_encode(['status' => 'loggedout']);
}
?>