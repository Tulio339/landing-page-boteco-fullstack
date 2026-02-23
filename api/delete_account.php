<?php
// api/delete_account.php
require 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário não autenticado.']);
    exit;
}

$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    // Destruir a sessão completamente após a exclusão
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    
    echo json_encode(['status' => 'success', 'message' => 'Conta apagada com sucesso.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao apagar a conta.']);
}

$stmt->close();
$conn->close();
?>