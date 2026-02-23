<?php
// api/logout.php

require 'db_connection.php';

// Destrói todas as variáveis de sessão
$_SESSION = array();

// Destrói a sessão
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

echo json_encode(['status' => 'success', 'message' => 'Logout realizado com sucesso.']);
?>