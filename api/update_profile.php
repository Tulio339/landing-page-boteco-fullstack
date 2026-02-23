<?php
// api/update_profile.php
require 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acesso não autorizado.']);
    exit;
}

$userId = $_SESSION['user_id'];
$fullName = $_POST['fullName'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';
$currentPassword = $_POST['currentPassword'] ?? '';

if (empty($fullName) || empty($email) || empty($phone) || empty($currentPassword)) {
    echo json_encode(['status' => 'error', 'message' => 'Preencha todos os campos e forneça sua senha atual.']);
    exit;
}

// 1. Verificar a senha atual
$stmt = $conn->prepare("SELECT senha FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($currentPassword, $user['senha'])) {
    echo json_encode(['status' => 'error', 'message' => 'A senha atual está incorreta.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// 2. Verificar se o novo e-mail já existe em outra conta
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
$stmt->bind_param("si", $email, $userId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Este e-mail já está sendo usado por outra conta.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// 3. Atualizar as informações
$stmt = $conn->prepare("UPDATE usuarios SET nome_completo = ?, email = ?, telefone = ?, endereco = ?, data_nascimento = ? WHERE id = ?");
$stmt->bind_param("sssssi", $fullName, $email, $phone, $address, $birthdate, $userId);

if ($stmt->execute()) {
    // Atualiza o nome na sessão
    $_SESSION['user_name'] = $fullName;
    echo json_encode(['status' => 'success', 'message' => 'Perfil atualizado com sucesso!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ocorreu um erro ao atualizar o perfil.']);
}

$stmt->close();
$conn->close();
?>