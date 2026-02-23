<?php
// api/db_connection.php

header('Content-Type: application/json'); // Define o tipo de resposta como JSON

$servername = "localhost";    // Geralmente 'localhost'
$username = "root";           // Usuário do seu banco de dados
$password = "mysql";               // Senha do seu banco de dados
$dbname = "coisadeboteco_db";        // Nome do banco de dados que você criou

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checar a conexão
if ($conn->connect_error) {
    // Encerra a execução e retorna um erro em JSON
    die(json_encode(['status' => 'error', 'message' => 'Falha na conexão: ' . $conn->connect_error]));
}

// Iniciar a sessão PHP para gerenciar o login
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>