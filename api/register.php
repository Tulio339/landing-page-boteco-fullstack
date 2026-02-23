<?php
// api/register.php

require 'db_connection.php';

// Pega os dados enviados via POST
$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';
$address = $_POST['address'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';

// Validação simples 
if (empty($fullName) || empty($email) || empty($password) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Por favor, preencha todos os campos obrigatórios.']);
    exit;
}

// Verifica se o email já existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Este e-mail já está cadastrado!']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Criptografa a senha - NUNCA armazene senhas em texto plano!
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insere o novo usuário no banco
$stmt = $conn->prepare("INSERT INTO usuarios (nome_completo, email, telefone, senha, endereco, data_nascimento) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $fullName, $email, $phone, $hashedPassword, $address, $birthdate);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Conta criada com sucesso!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao criar a conta. Tente novamente.']);
}

$stmt->close();
$conn->close();
?>