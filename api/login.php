<?php
// api/login.php

require 'db_connection.php';

$emailOrUser = $_POST['emailOrUser'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($emailOrUser) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário e senha são obrigatórios.']);
    exit;
}

// Procura o usuário pelo email
$stmt = $conn->prepare("SELECT id, nome_completo, senha FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $emailOrUser);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verifica se a senha criptografada corresponde à senha fornecida
    if (password_verify($password, $user['senha'])) {
        // Login bem-sucedido: armazena dados na sessão
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['nome_completo'];

        echo json_encode(['status' => 'success', 'userName' => $user['nome_completo']]);
    } else {
        // Senha incorreta
        echo json_encode(['status' => 'error', 'message' => 'Usuário ou senha inválidos!']);
    }
} else {
    // Usuário não encontrado
    echo json_encode(['status' => 'error', 'message' => 'Usuário ou senha inválidos!']);
}

$stmt->close();
$conn->close();
?>